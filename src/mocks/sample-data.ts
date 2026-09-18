import { ServicePlan, User, Order, Report } from '@/types/firestore';

/**
 * サービスプラン一覧
 */
export const SAMPLE_SERVICE_PLANS: ServicePlan[] = [
  {
    id: 'plan_basic_clean',
    name: '基本お参り・簡易清掃プラン',
    description: '遠方にお住まいで帰省が難しい方向け。落ち葉拾い、墓石の水拭き、合掌礼拝を代行します。',
    price: 8800,
    platformFeePercent: 20, // 手数料 20% (1,760円) -> 業者受取 7,040円
    estimatedDuration: '約45分',
    features: [
      '敷地内の落ち葉・雑草の簡易除去',
      '墓石・花立て・香炉の水洗い清掃',
      'お線香のお供え・合掌礼拝',
      '作業前後の写真付き完了レポート',
    ],
  },
  {
    id: 'plan_standard_service',
    name: '標準お参り・徹底お掃除プラン',
    description: '一番人気の定番プラン。敷地内全面の雑草手抜き、水垢・コケ落とし、生花のお供えまで心を込めて実施します。',
    price: 14800,
    platformFeePercent: 20, // 手数料 20% (2,960円) -> 業者受取 11,840円
    estimatedDuration: '約90分',
    features: [
      '手作業による敷地内全面の徹底的な除草',
      '専用ブラシと洗剤による水垢・コケ落とし',
      '季節の生花（1対）のお供え',
      'お線香・ろうそくのお供え・合掌礼拝',
      '高解像度の作業前後Before/After写真レポート',
      '墓石の傷み・ひび割れ・目地チェック報告',
    ],
    isPopular: true,
  },
  {
    id: 'plan_premium_service',
    name: 'プレミアム美装・撥水コーティングプラン',
    description: 'ご命日やお盆・お彼岸の前に。本格的な高圧洗浄と墓石コーティング、防草施工を実施します。',
    price: 29800,
    platformFeePercent: 20, // 手数料 20% (5,960円) -> 業者受取 23,840円
    estimatedDuration: '約180分',
    features: [
      '標準プランのすべての作業内容',
      '墓石専用撥水コーティング施工（ツヤ復元・汚れ防止）',
      '除草剤散布または防草砂簡易施工',
      '高級生花・特選線香のお供え',
      '詳細点検レポート（目地・傾き診断）',
      '永代供養・墓じまい等の専門ご相談対応',
    ],
  },
];

/**
 * 提携業者サンプル（松山エリアの特色あるダミー提携会社）
 */
export const SAMPLE_VENDORS: User[] = [
  {
    id: 'vendor_001',
    email: 'info@iyo-memorial-dummy.example.com',
    role: 'vendor',
    displayName: '松山まごころ墓苑サポート（ダミー提携パートナー）',
    phoneNumber: '089-997-XXXX',
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-09-01T10:00:00Z',
    vendorProfile: {
      companyName: '株式会社 伊予メモリアルパートナーズ（ダミー）',
      representativeName: '松山 誠司（お墓ディレクター）',
      serviceAreas: ['松山市全域', '東温市', '伊予市', '伊予郡松前町', '伊予郡砥部町'],
      stripeConnectAccountId: 'acct_1OuTESTConnectVendor01', // Stripe Connect 提携先ID
      stripeChargesEnabled: true,
      stripePayoutsEnabled: true,
      description: '松山市土居田町を拠点にお墓の清掃代行・墓じまい・永代供養までトータルでサポート。宝塔寺旭ヶ丘霊園など市内各霊園での施工実績多数。真心を込めてお墓を守ります。',
      rating: 4.9,
      completedJobsCount: 168,
    },
  },
  {
    id: 'vendor_002',
    email: 'support@jonan-kankyo-dummy.example.com',
    role: 'vendor',
    displayName: '城南みちお墓クリーン（ダミー提携パートナー）',
    phoneNumber: '089-912-XXXX',
    createdAt: '2026-02-15T09:00:00Z',
    updatedAt: '2026-09-05T09:00:00Z',
    vendorProfile: {
      companyName: '合同会社 城南環境サポート（ダミー）',
      representativeName: '越智 健一',
      serviceAreas: ['松山市', '伊予市', '東温市'],
      stripeConnectAccountId: 'acct_1OuTESTConnectVendor02', // Stripe Connect 提携先ID
      stripeChargesEnabled: true,
      stripePayoutsEnabled: true,
      description: '松山城下や道後周辺の寺院墓地・公営墓地に対応。地域に根ざした職人が丁寧にお参り・清掃を代行いたします。',
      rating: 4.8,
      completedJobsCount: 85,
    },
  },
  {
    id: 'vendor_003',
    email: 'contact@iyotakumi-dummy.example.com',
    role: 'vendor',
    displayName: '伊予匠・石材メンテナンス工房（ダミー提携パートナー）',
    phoneNumber: '089-943-XXXX',
    createdAt: '2026-03-01T09:00:00Z',
    updatedAt: '2026-09-10T09:00:00Z',
    vendorProfile: {
      companyName: '株式会社 伊予匠石材技研（ダミー）',
      representativeName: '白石 孝之（一級石材施工技能士）',
      serviceAreas: ['松山市', '今治市', '東温市', '伊予郡松前町'],
      stripeConnectAccountId: 'acct_1OuTESTConnectVendor03',
      stripeChargesEnabled: true,
      stripePayoutsEnabled: true,
      description: '創業40余年の石材加工技術を活かした本格的な墓石クリーニング。墓石を傷めない専用水洗いと目地補修、白木・ステンレス金具交換など石材のプロならではの施工が強みです。',
      rating: 4.9,
      completedJobsCount: 142,
    },
  },
  {
    id: 'vendor_004',
    email: 'info@dogo-komorebi-dummy.example.com',
    role: 'vendor',
    displayName: '道後こもれび墓苑ケア（ダミー提携パートナー）',
    phoneNumber: '089-977-XXXX',
    createdAt: '2026-03-20T10:00:00Z',
    updatedAt: '2026-09-12T10:00:00Z',
    vendorProfile: {
      companyName: '道後フラワー＆ケア 株式会社（ダミー）',
      representativeName: '門屋 裕美（終活カウンセラー・お墓ディレクター2級）',
      serviceAreas: ['松山市全域', '伊予市', '伊予郡砥部町'],
      stripeConnectAccountId: 'acct_1OuTESTConnectVendor04',
      stripeChargesEnabled: true,
      stripePayoutsEnabled: true,
      description: '女性スタッフ中心の細やかな心配りとお掃除代行。お供えする生花は松山老舗生花店から厳選仕入れし、故人様のお好きだった色合いや供物にも温かく対応いたします。',
      rating: 5.0,
      completedJobsCount: 96,
    },
  },
  {
    id: 'vendor_005',
    email: 'info@ryokufu-grave-dummy.example.com',
    role: 'vendor',
    displayName: '中予山間部・緑風墓苑管理（ダミー提携パートナー）',
    phoneNumber: '089-983-XXXX',
    createdAt: '2026-04-10T08:30:00Z',
    updatedAt: '2026-09-15T08:30:00Z',
    vendorProfile: {
      companyName: '緑風環境保全 有限会社（ダミー）',
      representativeName: '重松 健二（造園施工管理技士）',
      serviceAreas: ['松山市南部', '伊予市', '伊予郡松前町', '伊予郡砥部町', '大洲市'],
      stripeConnectAccountId: 'acct_1OuTESTConnectVendor05',
      stripeChargesEnabled: true,
      stripePayoutsEnabled: true,
      description: '山間部や階段の多い急傾斜地墓地、古くからの共同墓地での除草・雑木伐採を得意としています。足場の悪い難所墓地でも安全・確実にお手入れを実施いたします。',
      rating: 4.7,
      completedJobsCount: 115,
    },
  },
  {
    id: 'vendor_006',
    email: 'service@katsuyama-bisou-dummy.example.com',
    role: 'vendor',
    displayName: '勝山お墓美装メンテナンス（ダミー提携パートナー）',
    phoneNumber: '089-931-XXXX',
    createdAt: '2026-05-01T10:00:00Z',
    updatedAt: '2026-09-16T10:00:00Z',
    vendorProfile: {
      companyName: '勝山石材美装 株式会社（ダミー）',
      representativeName: '高市 勝也（お墓ディレクター1級）',
      serviceAreas: ['松山市全域', '東温市', '伊予郡松前町'],
      stripeConnectAccountId: 'acct_1OuTESTConnectVendor06',
      stripeChargesEnabled: true,
      stripePayoutsEnabled: true,
      description: '松山市営大明神霊園、宝塔寺旭ヶ丘霊園、客谷霊園など市内主要霊園での実績多数。最新の撥水防汚コーティングや文字墨入れなど、お墓の美観維持に特化した技術を提供します。',
      rating: 4.9,
      completedJobsCount: 203,
    },
  },
];

/**
 * サンプル注文データ（宝塔寺霊園をモデルにしたダミー霊園）
 */
export const SAMPLE_ORDERS: Order[] = [
  {
    id: 'order_sample_001',
    orderNumber: 'KKM-20260918-001',
    clientId: 'client_user_101',
    clientName: '山田 太郎',
    clientEmail: 'taro.yamada@example.com',
    vendorId: 'vendor_001',
    vendorName: '松山まごころ墓苑サポート（ダミー提携パートナー）',
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
      cemeteryName: '宝塔寺 旭ヶ丘霊園（モデル霊園・ダミー）',
      locationAddress: '愛媛県松山市朝日ヶ丘1丁目',
      sectionPlotNumber: '東区 5列 12番',
      deceasedName: '山田家先祖代々之墓',
      specialRequests: '花立ての水垢と墓石周辺の雑草が目立ってきたため、水洗いでしっかり綺麗にしていただきたいです。',
    },
    preferredDate: '2026-09-25',
    scheduledDate: '2026-09-25',
    createdAt: '2026-09-18T10:00:00Z',
    paidAt: '2026-09-18T10:05:00Z',
    updatedAt: '2026-09-18T10:05:00Z',
  },
];

/**
 * サンプル作業完了レポートデータ（宝塔寺 旭ヶ丘霊園モデル）
 */
export const SAMPLE_REPORTS: Report[] = [
  {
    id: 'report_sample_001',
    orderId: 'order_sample_001',
    vendorId: 'vendor_001',
    vendorName: '松山まごころ墓苑サポート（ダミー提携パートナー）',
    workDate: '2026-09-25',
    weather: '快晴（松山）',
    beforePhotos: [
      {
        url: '/images/grave_before.jpg',
        caption: '作業前：墓石全体の様子（苔・水垢・落ち葉・雑草の繁茂）',
      },
    ],
    afterPhotos: [
      {
        url: '/images/grave_after.jpg',
        caption: '作業後：雑草を除去し墓石を水洗い清掃。季節の生花・お線香をお供えし合掌礼拝いたしました',
      },
    ],
    workNotes:
      '本日、宝塔寺 旭ヶ丘霊園にて山田家様のお墓参りおよび清掃代行作業を滞りなく完了いたしました。敷地内の雑草を手作業で根元から抜き取り、墓石・花立て・香炉の専用水洗いを行いました。季節の生花をお供えし、お線香を焚いてご先祖様へのご冥福をお祈りいたしました。',
    graveConditionNotes:
      '墓石本体は健全な状態を保っておりますが、台座目地の一部に若干の経年摩耗が見られます。直ちに対応が必要な状態ではありませんが、今後のお参り時にも経過を確認いたします。',
    status: 'submitted',
    submittedAt: '2026-09-25T15:30:00Z',
    createdAt: '2026-09-25T15:00:00Z',
    updatedAt: '2026-09-25T15:30:00Z',
  },
];
