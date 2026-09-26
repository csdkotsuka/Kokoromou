import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getCemeteryCompanies, saveCemeteryCompany, getVendors, saveVendor } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { targetType, targetId, email, name, returnUrl } = body;

    if (!targetType || !targetId) {
      return NextResponse.json(
        { success: false, error: 'targetType (vendor | cemetery) and targetId are required' },
        { status: 400 }
      );
    }

    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`;
    const redirectBackUrl = returnUrl || `${baseUrl}/${targetType === 'vendor' ? 'vendor' : 'cemetery'}?stripe_connected=true`;

    const isMockStripe = !process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.startsWith('sk_test_mock');

    // 1. データベースから対象エンティティを取得
    let currentAccountId: string | undefined;
    let payoutsEnabled = false;

    if (targetType === 'vendor') {
      const vendors = await getVendors();
      const vendor = vendors.find((v) => v.id === targetId);
      currentAccountId = vendor?.vendorProfile?.stripeConnectAccountId;
      payoutsEnabled = !!vendor?.vendorProfile?.stripePayoutsEnabled;
    } else {
      const companies = await getCemeteryCompanies();
      const company = companies.find((c) => c.id === targetId);
      currentAccountId = company?.stripeConnectAccountId;
      payoutsEnabled = !!company?.stripePayoutsEnabled;
    }

    // 2. モックモードの場合のシミュレーション処理
    if (isMockStripe) {
      const generatedAccountId = currentAccountId || `acct_mock_${targetType}_${Date.now().toString(36)}`;

      // DB側に受取アカウント情報を保存
      if (targetType === 'vendor') {
        const vendors = await getVendors();
        const vendor = vendors.find((v) => v.id === targetId);
        if (vendor) {
          vendor.vendorProfile = {
            ...vendor.vendorProfile,
            companyName: vendor.vendorProfile?.companyName || vendor.displayName,
            representativeName: vendor.vendorProfile?.representativeName || vendor.displayName,
            completedJobsCount: vendor.vendorProfile?.completedJobsCount || 0,
            serviceAreas: vendor.vendorProfile?.serviceAreas || ['松山市全域'],
            stripeConnectAccountId: generatedAccountId,
            stripeChargesEnabled: true,
            stripePayoutsEnabled: true,
          };
          await saveVendor(vendor);
        }
      } else {
        const companies = await getCemeteryCompanies();
        const company = companies.find((c) => c.id === targetId);
        if (company) {
          company.stripeConnectAccountId = generatedAccountId;
          company.stripeChargesEnabled = true;
          company.stripePayoutsEnabled = true;
          await saveCemeteryCompany(company);
        }
      }

      return NextResponse.json({
        success: true,
        isMock: true,
        accountId: generatedAccountId,
        status: 'active',
        payoutsEnabled: true,
        message: 'Stripe受取口座が正常に連携されました（デモシミュレーション）。本番環境ではStripeの本人確認・口座登録ページへ遷移します。',
        url: `${redirectBackUrl}&mock_stripe_connected=1`,
      });
    }

    // 3. 本番Stripe API による Connect アカウント処理
    let accountId = currentAccountId;

    if (!accountId) {
      // 新規 Stripe Express アカウントを作成
      const account = await stripe.accounts.create({
        type: 'express',
        country: 'JP',
        email: email || undefined,
        capabilities: {
          transfers: { requested: true },
          card_payments: { requested: true },
        },
        business_profile: {
          name: name || undefined,
          product_description: targetType === 'vendor' ? 'お墓参り・清掃代行業務の受取' : '霊園管理・紹介手数料の受取',
        },
      });
      accountId = account.id;

      // DB更新
      if (targetType === 'vendor') {
        const vendors = await getVendors();
        const vendor = vendors.find((v) => v.id === targetId);
        if (vendor && vendor.vendorProfile) {
          vendor.vendorProfile.stripeConnectAccountId = accountId;
          await saveVendor(vendor);
        }
      } else {
        const companies = await getCemeteryCompanies();
        const company = companies.find((c) => c.id === targetId);
        if (company) {
          company.stripeConnectAccountId = accountId;
          await saveCemeteryCompany(company);
        }
      }
    }

    // すでに受取準備完了していれば Express ダッシュボードへのログインリンクを発行
    if (payoutsEnabled) {
      try {
        const loginLink = await stripe.accounts.createLoginLink(accountId);
        return NextResponse.json({
          success: true,
          url: loginLink.url,
          isDashboard: true,
          accountId,
          payoutsEnabled: true,
        });
      } catch (err) {
        // まだオンボーディング未完了の場合はAccountLink作成へフォールバック
        console.warn('Failed to create login link, fallback to onboarding link:', err);
      }
    }

    // オンボーディングリンク（口座情報・本人確認入力URL）を生成
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${baseUrl}/${targetType === 'vendor' ? 'vendor' : 'cemetery'}?refresh_stripe=true`,
      return_url: redirectBackUrl,
      type: 'account_onboarding',
    });

    return NextResponse.json({
      success: true,
      url: accountLink.url,
      isDashboard: false,
      accountId,
      payoutsEnabled,
    });
  } catch (error: any) {
    console.error('Stripe Connect error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Stripe連携中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
