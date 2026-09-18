# ココロモウ（Kokoromou）- お墓参り・お掃除代行プラットフォーム

遠方に住む施主と、地元の提携業者（石材店・霊園管理会社・代行者）を繋ぐマッチング・代行プラットフォームです。
Stripe Connect（Destination Charges）を活用し、決済時にプラットフォーム手数料（20%）を差し引き、提携業者アカウントへ売上を自動分配します。

---

## 🛠 技術スタック

- **Framework**: Next.js 16 (App Router, React 19, TypeScript)
- **Styling**: Tailwind CSS v4, Lucide Icons
- **Hosting**: Vercel
- **Database / Auth**: Firebase (Cloud Firestore, Firebase Auth, Firebase Admin SDK)
- **Payment**: Stripe Checkout & Stripe Connect (Destination Charges)

---

## 📁 ディレクトリ構成

```text
src/
├── app/
│   ├── api/
│   │   ├── checkout/
│   │   │   └── route.ts         # Stripe Checkout Session作成 (Destination Charges)
│   │   ├── webhook/
│   │   │   └── stripe/
│   │   │       └── route.ts     # Stripe Webhook (checkout.session.completed等)
│   │   ├── orders/
│   │   │   └── [id]/
│   │   │       └── route.ts     # 注文詳細取得API
│   │   └── reports/
│   │       └── route.ts         # 提携業者作業レポート提出API
│   ├── order/
│   │   ├── page.tsx             # サービス申し込み・決済画面
│   │   └── success/
│   │       └── page.tsx         # 注文完了画面 (Thank Youページ)
│   ├── vendor/
│   │   └── reports/
│   │       └── [orderId]/
│   │           └── page.tsx     # 提携業者向け写真レポート提出画面
│   ├── layout.tsx               # 共通レイアウト (Navbar / Footer)
│   ├── page.tsx                 # トップページ / サービスLP
│   └── globals.css
├── components/
│   └── Navbar.tsx               # 共通ヘッダーナビゲーション
├── lib/
│   ├── stripe.ts                # Stripe SDK初期化
│   ├── firebase.ts              # Firebase Client SDK初期化
│   └── firebase-admin.ts        # Firebase Admin SDK初期化 & Firestore操作ヘルパー
├── mocks/
│   └── sample-data.ts           # サービスプラン・提携業者・注文モックデータ
└── types/
    └── firestore.ts             # User, Order, Report, GraveInfo 型定義
```

---

## 💳 Stripe Connect (Destination Charges) 決済フロー

1. **セッション生成 (`/api/checkout`)**:
   - 施主がプランと提携業者を選択して申し込み
   - Firestore に注文（`orders`）を `status: 'pending_payment'` で作成
   - `stripe.checkout.sessions.create` にて:
     - `payment_intent_data.application_fee_amount`: プラットフォーム手数料（例: 20%）
     - `payment_intent_data.transfer_data.destination`: 提携業者のStripe ConnectアカウントID（`acct_xxx`）
2. **決済完了とWebhook受信 (`/api/webhook/stripe`)**:
   - 施主がカード決済を完了
   - `checkout.session.completed` イベントを受信
   - Firestore の `orders/{orderId}` を `status: 'paid'`、`stripePaymentIntentId`、`paidAt` に更新
3. **作業完了報告と確認 (`/vendor/reports/[orderId]`)**:
   - 提携業者が現地作業後にBefore/After写真と所見メモを提出
   - 注文ステータスが `report_submitted` へ移行し、施主へ通知

---

## 🚀 クイックスタート

### 1. 依存関係のインストール
```bash
npm install
```

### 2. 環境変数の設定
`.env.example` を参考に `.env.local` を作成してください。
```bash
cp .env.example .env.local
```

### 3. 開発サーバーの起動
```bash
npm run dev
```
ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

- **サービス紹介トップ**: `http://localhost:3000/`
- **お申し込み・決済画面**: `http://localhost:3000/order`
- **注文完了画面**: `http://localhost:3000/order/success`
- **提携業者レポート提出画面**: `http://localhost:3000/vendor/reports/order_sample_001`
