import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey && process.env.NODE_ENV === 'production') {
  console.warn('⚠️ Warning: STRIPE_SECRET_KEY is not defined in environment variables.');
}

/**
 * Stripe サーバーサイド SDK インスタンス
 * 開発環境でキー未設定時もビルドエラーにならないよう安全に初期化
 */
export const stripe = new Stripe(stripeSecretKey || 'sk_test_mock_dummy_key_for_development', {
  apiVersion: '2025-02-24.acacia' as any,
  typescript: true,
  appInfo: {
    name: 'Kokoromou Platform',
    version: '1.0.0',
  },
});
