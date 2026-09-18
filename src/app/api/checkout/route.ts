import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { saveOrderToFirestore } from '@/lib/firebase-admin';
import { SAMPLE_SERVICE_PLANS, SAMPLE_VENDORS } from '@/mocks/sample-data';
import { Order, OrderStatus } from '@/types/firestore';

interface CheckoutRequestBody {
  planId: string;
  vendorId: string;
  clientName: string;
  clientEmail: string;
  cemeteryName: string;
  locationAddress: string;
  sectionPlotNumber: string;
  deceasedName?: string;
  specialRequests?: string;
  preferredDate?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: CheckoutRequestBody = await req.json();

    const {
      planId,
      vendorId,
      clientName,
      clientEmail,
      cemeteryName,
      locationAddress,
      sectionPlotNumber,
      deceasedName,
      specialRequests,
      preferredDate,
    } = body;

    // 必須入力のバリデーション
    if (!planId || !vendorId || !clientName || !clientEmail || !cemeteryName) {
      return NextResponse.json(
        { error: '必須項目が不足しています。（プラン、担当業者、施主名、メールアドレス、霊園名）' },
        { status: 400 }
      );
    }

    // プランの取得
    const plan = SAMPLE_SERVICE_PLANS.find((p) => p.id === planId);
    if (!plan) {
      return NextResponse.json({ error: '指定されたサービスプランが見つかりません。' }, { status: 404 });
    }

    // 提携業者の取得
    const vendor = SAMPLE_VENDORS.find((v) => v.id === vendorId);
    if (!vendor || !vendor.vendorProfile) {
      return NextResponse.json({ error: '指定された提携業者が見つかりません。' }, { status: 404 });
    }

    const connectAccountId = vendor.vendorProfile.stripeConnectAccountId;
    if (!connectAccountId) {
      return NextResponse.json(
        { error: '提携業者のStripe Connect受取口座が設定されていません。' },
        { status: 400 }
      );
    }

    // 手数料計算 (Destination Charges)
    // 施主が支払う総額
    const totalAmount = plan.price;
    // プラットフォーム手数料 (例: 20%)
    const platformFeeAmount = Math.round(totalAmount * (plan.platformFeePercent / 100));
    // 提携業者への自動送金予定額
    const vendorPayoutAmount = totalAmount - platformFeeAmount;

    // 注文IDの生成
    const timestamp = Date.now();
    const orderId = `order_${timestamp}`;
    const orderNumber = `KKM-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${timestamp.toString().slice(-4)}`;

    // ベースURLの決定
    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`;

    // Firestore に仮注文（pending_payment）を作成
    const newOrder: Order = {
      id: orderId,
      orderNumber,
      clientId: `user_guest_${timestamp}`,
      clientName,
      clientEmail,
      vendorId: vendor.id,
      vendorName: vendor.displayName,
      vendorStripeAccountId: connectAccountId,
      servicePlanId: plan.id,
      servicePlanName: plan.name,
      totalAmount,
      platformFeeAmount,
      vendorPayoutAmount,
      currency: 'jpy',
      status: 'pending_payment' as OrderStatus,
      graveInfo: {
        cemeteryName,
        locationAddress,
        sectionPlotNumber,
        deceasedName: deceasedName || '',
        specialRequests: specialRequests || '',
      },
      preferredDate: preferredDate || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveOrderToFirestore(newOrder);

    // Stripe APIキーの確認（テスト環境・モック判定）
    const isMockStripe = !process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.startsWith('sk_test_mock');

    if (isMockStripe) {
      console.log('ℹ️ [Mock Mode] STRIPE_SECRET_KEY is dummy. Simulating checkout URL.');
      // モック時は直接成功画面へ遷移可能なシミュレーションURLを返す
      const mockSessionId = `cs_mock_${Date.now()}`;
      return NextResponse.json({
        url: `${baseUrl}/order/success?session_id=${mockSessionId}&order_id=${orderId}&mock=true`,
        orderId,
        isMock: true,
        message: 'Stripe APIキー未設定のため、デモ用決済完了シミュレーション画面へ遷移します。',
      });
    }

    // Stripe Checkout Session の生成 (Destination Charges)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'jpy',
            product_data: {
              name: `ココロモウ: ${plan.name}`,
              description: `担当業者: ${vendor.displayName} / 霊園: ${cemeteryName} (${sectionPlotNumber})`,
            },
            unit_amount: totalAmount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      // Stripe Connect Destination Charges 設定
      payment_intent_data: {
        application_fee_amount: platformFeeAmount, // プラットフォーム手数料 (20%)
        transfer_data: {
          destination: connectAccountId, // 提携業者アカウントへ直接送金
        },
        metadata: {
          orderId,
          orderNumber,
          vendorId: vendor.id,
          vendorName: vendor.displayName,
          planId: plan.id,
        },
      },
      customer_email: clientEmail,
      metadata: {
        orderId,
        orderNumber,
        vendorId: vendor.id,
        servicePlanId: plan.id,
      },
      success_url: `${baseUrl}/order/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
      cancel_url: `${baseUrl}/order?canceled=true&order_id=${orderId}`,
    });

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
      orderId,
    });
  } catch (error: any) {
    console.error('Stripe Checkout Session Creation Error:', error);
    return NextResponse.json(
      {
        error: '決済セッションの作成中にエラーが発生しました。',
        details: error.message || String(error),
      },
      { status: 500 }
    );
  }
}
