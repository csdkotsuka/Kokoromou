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
  frontInscription: string;
  builderName: string;
  frontInscriptionPhotoUrl?: string;
  builderNamePhotoUrl?: string;
  deceasedName?: string;
  graveCount?: number;
  plotSize?: 'standard' | 'large' | 'extra_large';
  googleMapsUrl?: string;
  landmarksDescription?: string;
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
      frontInscription,
      builderName,
      frontInscriptionPhotoUrl,
      builderNamePhotoUrl,
      deceasedName,
      graveCount = 1,
      plotSize = 'standard',
      googleMapsUrl,
      landmarksDescription,
      specialRequests,
      preferredDate,
    } = body;

    // 必須入力のバリデーション（建立者名 builderName も必須！）
    if (!planId || !vendorId || !clientName || !clientEmail || !cemeteryName || !sectionPlotNumber) {
      return NextResponse.json(
        { error: '必須項目が不足しています。（プラン、担当業者、施主名、メールアドレス、霊園名、区画番号）' },
        { status: 400 }
      );
    }

    if (!builderName || !builderName.trim()) {
      return NextResponse.json(
        { error: '同姓のお墓との誤認を防ぐため、「側面の建立者名」の入力は必須です。' },
        { status: 400 }
      );
    }

    if (!frontInscription || !frontInscription.trim()) {
      return NextResponse.json(
        { error: 'お墓の特定のため、「正面の刻印文字（家名等）」の入力は必須です。' },
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

    // オプション料金計算
    const basePlanFee = plan.price;
    // 基数追加: 1基目無料、2基目以降 1基あたり +3,000円
    const count = Math.max(1, Number(graveCount) || 1);
    const extraGraveFee = (count - 1) * 3000;

    // 広さ追加: standard 0円, large 3,000円, extra_large 6,000円
    let extraPlotFee = 0;
    if (plotSize === 'large') {
      extraPlotFee = 3000;
    } else if (plotSize === 'extra_large') {
      extraPlotFee = 6000;
    }

    // 手数料計算 (Destination Charges)
    // 施主が支払う総額
    const totalAmount = basePlanFee + extraGraveFee + extraPlotFee;
    // プラットフォーム手数料 (20%)
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
      basePlanFee,
      extraGraveFee,
      extraPlotFee,
      totalAmount,
      platformFeeAmount,
      vendorPayoutAmount,
      currency: 'jpy',
      status: 'pending_payment' as OrderStatus,
      graveInfo: {
        cemeteryName,
        locationAddress: locationAddress || '',
        sectionPlotNumber,
        frontInscription: frontInscription.trim(),
        builderName: builderName.trim(),
        frontInscriptionPhotoUrl: frontInscriptionPhotoUrl || '',
        builderNamePhotoUrl: builderNamePhotoUrl || '',
        deceasedName: deceasedName || frontInscription.trim(),
        graveCount: count,
        plotSize,
        googleMapsUrl: googleMapsUrl || '',
        landmarksDescription: landmarksDescription || '',
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
    const plotSizeLabel = plotSize === 'extra_large' ? '2坪以上' : plotSize === 'large' ? '約1〜2坪' : '標準(~1坪)';
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'jpy',
            product_data: {
              name: `ココロモウ: ${plan.name}`,
              description: `担当: ${vendor.displayName} / 霊園: ${cemeteryName} (${sectionPlotNumber}) / 建立者: ${builderName.trim()} / ${count}基 / ${plotSizeLabel}`,
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
