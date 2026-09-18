import { ServicePlan, User, Order, Report } from '@/types/firestore';

/**
 * サービスプラン一覧
 */
export const SAMPLE_SERVICE_PLANS: ServicePlan[] = [
  {
    id: 'plan_basic_clean',
    name: '基本お参り・簡易清掃プラン',
    description: '遠方でなかなか行けない方向け。枯れ葉拾い、墓石の水拭き、合掌礼拝を代行します。',
    price: 8800,
    platformFeePercent: 20, // 手数料 20% (1,760円) -> 業者受取 7,040円
    estimatedDuration: '約45分',
    features: [
      '墓地敷地内の落ち葉・ゴミ拾い',
      '墓石・花立て・香炉の水洗い清掃',
      'お線香のお供え・合掌礼拝',
      '作業前後の写真付き完了レポート',
    ],
  },
  {
    id: 'plan_standard_service',
    name: '標準お参り・徹底お掃除プラン',
    description: '一番人気の定番プラン。雑草抜きから花立て洗浄、生花のお供えまで心を込めて実施します。',
    price: 14800,
    platformFeePercent: 20, // 手数料 20% (2,960円) -> 業者受取 11,840円
    estimatedDuration: '約90分',
    features: [
      '手作業による徹底的な雑草除去（敷地内全面）',
      '専用ブラシと洗剤による水垢・コケ落とし',
      '季節の生花（1対）のお供え',
      'お線香・ろうそくのお供え・読経/合掌',
      '作業前後の高解像度写真レポート',
      '墓石の傷み・ひび割れチェック報告',
    ],
    isPopular: true,
  },
  {
    id: 'plan_premium_service',
    name: 'プレミアム美装・防草コーティングプラン',
    description: '命日やお盆・お彼岸の前に。本格的な高圧洗浄と防草砂・撥水コーティングを施工します。',
    price: 29800,
    platformFeePercent: 20, // 手数料 20% (5,960円) -> 業者受取 23,840円
    estimatedDuration: '約180分',
    features: [
      '標準プランのすべての作業内容',
      '墓石専用撥水コーティング施工（ツヤ復元・汚れ防止）',
      '除草剤散布または防草シート簡易施工',
      '高級生花・特選線香のお供え',
      '詳細点検レポート（目地・傾き診断）',
      '1ヶ月のアフターフォロー保証',
    ],
  },
];

/**
 * 提携業者（愛媛県松山市・中予エリア / Stripe Connect連携済み）サンプルデータ
 */
export const SAMPLE_VENDORS: User[] = [
  {
    id: 'vendor_001',
    email: 'contact@iyo-sekizai.example.com',
    role: 'vendor',
    displayName: '伊予石材・松山お墓守り本舗',
    phoneNumber: '089-912-3456',
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-09-01T10:00:00Z',
    vendorProfile: {
      companyName: '有限会社 伊予石材クリーンサービス',
      representativeName: '越智 健一（墓石施工技士）',
      serviceAreas: ['松山市', '東温市', '伊予市', '伊予郡松前町', '伊予郡砥部町'],
      stripeConnectAccountId: 'acct_1OuTESTConnectVendor01', // Stripe Connect 提携先ID
      stripeChargesEnabled: true,
      stripePayoutsEnabled: true,
      description: '創業40年。松山城下や道後周辺で代々続く石材のプロが、遠方のご家族に代わって真心を込めて清掃・お参りいたします。',
      rating: 4.9,
      completedJobsCount: 156,
    },
  },
  {
    id: 'vendor_002',
    email: 'support@iyoji-cleaning.example.com',
    role: 'vendor',
    displayName: 'いよ路 代行サービス（松山・中予）',
    phoneNumber: '089-987-6543',
    createdAt: '2026-02-15T09:00:00Z',
    updatedAt: '2026-09-05T09:00:00Z',
    vendorProfile: {
      companyName: 'いよ路環境サービス 合同会社',
      representativeName: '白石 誠',
      serviceAreas: ['松山市', '伊予市', '東温市', '今治市南部'],
      stripeConnectAccountId: 'acct_1OuTESTConnectVendor02', // Stripe Connect 提携先ID
      stripeChargesEnabled: true,
      stripePayoutsEnabled: true,
      description: '瀬戸内の温暖な気候で育ちやすい雑草も根元から徹底除去。四国霊場・お遍路の地に寄り添い、丁寧にお墓を守ります。',
      rating: 4.8,
      completedJobsCount: 94,
    },
  },
];

/**
 * サンプル注文データ（愛媛県松山市）
 */
export const SAMPLE_ORDERS: Order[] = [
  {
    id: 'order_sample_001',
    orderNumber: 'KKM-20260918-001',
    clientId: 'client_user_101',
    clientName: '山田 太郎',
    clientEmail: 'taro.yamada@example.com',
    vendorId: 'vendor_001',
    vendorName: '伊予石材・松山お墓守り本舗',
    vendorStripeAccountId: 'acct_1OuTESTConnectVendor01',
    servicePlanId: 'plan_standard_service',
    servicePlanName: '標準お参り・徹底お掃除プラン',
    totalAmount: 14800,
    platformFeeAmount: 2960, // 20%
    vendorPayoutAmount: 11840,
    currency: 'jpy',
    stripeCheckoutSessionId: 'cs_test_sample_session_123',
    stripePaymentIntentId: 'pi_test_sample_payment_intent_456',
    status: 'paid',
    graveInfo: {
      cemeteryName: '松山市営 梅津寺霊園',
      locationAddress: '愛媛県松山市梅津寺町1382',
      sectionPlotNumber: '西地区 3列 15番',
      deceasedName: '山田家先祖代々之墓',
      specialRequests: '墓石側面の苔が目立ってきたため、水洗いでしっかり落としていただけると助かります。',
    },
    preferredDate: '2026-09-25',
    scheduledDate: '2026-09-25',
    createdAt: '2026-09-18T10:00:00Z',
    paidAt: '2026-09-18T10:05:00Z',
    updatedAt: '2026-09-18T10:05:00Z',
  },
];

/**
 * サンプル作業完了レポートデータ（愛媛県松山市）
 */
export const SAMPLE_REPORTS: Report[] = [
  {
    id: 'report_sample_001',
    orderId: 'order_sample_001',
    vendorId: 'vendor_001',
    vendorName: '伊予石材・松山お墓守り本舗',
    workDate: '2026-09-25',
    weather: '快晴（松山・瀬戸内側）',
    beforePhotos: [
      {
        url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
        caption: '作業前：墓石全体の様子（潮風によるくすみと落ち葉の堆積）',
      },
      {
        url: 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=800&q=80',
        caption: '作業前：花立て・水受け周辺の水垢・コケ',
      },
    ],
    afterPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
        caption: '作業後：雑草を全て手作業で抜去し、墓石水洗い完了',
      },
      {
        url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=800&q=80',
        caption: '作業後：季節の生花・お線香をお供えし合掌礼拝いたしました',
      },
    ],
    workNotes:
      '本日、松山市営 梅津寺霊園にて山田家様のお墓参りおよび清掃代行作業を滞りなく完了いたしました。敷地内の雑草を手作業で根元から抜き取り、墓石・花立て・香炉の専用水洗いを行いました。季節の生花（菊・リンドウ）をお供えし、お線香を焚いてご先祖様へのご冥福をお祈りいたしました。',
    graveConditionNotes:
      '墓石本体はしっかりしておりますが、台座目地の一部に経年によるわずかな摩耗が見られます。今すぐの補修は不要ですが、次回の法要などの機会にご点検をお勧めいたします。',
    status: 'submitted',
    submittedAt: '2026-09-25T15:30:00Z',
    createdAt: '2026-09-25T15:00:00Z',
    updatedAt: '2026-09-25T15:30:00Z',
  },
];
