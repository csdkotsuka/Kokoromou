import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { updateOrderStatusInFirestore, getOrderFromFirestore } from '@/lib/firebase-admin';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  // Webhook 署名検証
  if (webhookSecret && signature) {
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error(`⚠️ Webhook signature verification failed: ${err.message}`);
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }
  } else {
    // 開発環境またはモックテスト用（Webhook Secret未設定時）
    try {
      event = JSON.parse(body) as Stripe.Event;
      console.warn('⚠️ Webhook secret not set. Parsed raw body directly for testing/development.');
    } catch (err) {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }
  }

  // イベント種別のハンドリング
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;
      const paymentIntentId = session.payment_intent as string;

      console.log(`✅ [Stripe Webhook] Checkout session completed for order: ${orderId}`);

      if (orderId) {
        // Firestore 上の注文ステータスを 'paid'（決済完了）に更新
        await updateOrderStatusInFirestore(orderId, {
          status: 'paid',
          stripeCheckoutSessionId: session.id,
          stripePaymentIntentId: paymentIntentId || session.id,
          paidAt: new Date().toISOString(),
        });

        // 提携業者への通知ロジック（メール・プッシュ通知等のトリガー想定）
        console.log(`[Notification] Order ${orderId} is paid. Ready to notify partner vendor.`);
      } else {
        console.warn('⚠️ checkout.session.completed received without metadata.orderId');
      }
      break;
    }

    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const orderId = paymentIntent.metadata?.orderId;

      console.log(`💰 [Stripe Webhook] PaymentIntent succeeded: ${paymentIntent.id} for order: ${orderId}`);

      if (orderId) {
        await updateOrderStatusInFirestore(orderId, {
          status: 'paid',
          stripePaymentIntentId: paymentIntent.id,
          stripeChargeId: paymentIntent.latest_charge as string,
          paidAt: new Date().toISOString(),
        });
      }
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const orderId = paymentIntent.metadata?.orderId;
      console.error(`❌ [Stripe Webhook] Payment failed for PaymentIntent: ${paymentIntent.id}`);

      if (orderId) {
        await updateOrderStatusInFirestore(orderId, {
          status: 'pending_payment',
          lastPaymentError: paymentIntent.last_payment_error?.message || 'Payment failed',
        });
      }
      break;
    }

    default:
      console.log(`ℹ️ [Stripe Webhook] Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
