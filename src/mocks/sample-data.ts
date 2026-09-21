import { ServicePlan, User, Order, Report, PlatformAdminInfo, CemeteryCompany } from '@/types/firestore';

/**
 * 本部管理情報（ココロモウ運営本部）
 */
export const SAMPLE_ADMIN_INFO: PlatformAdminInfo = {
  organizationName: 'Creative System Design（プラットフォーム本部）',
  serviceName: 'お墓参り・お掃除代行DXプラットフォーム「ココロモウ」',
  representative: '大塚',
  email: 'kotsuka@creativesd.net',
  phoneNumber: '090-4116-9476',
  address: '〒790-0931 愛媛県松山市西石井1丁目9番27号 グランジュール505号',
  platformFeePercent: 20, // 標準手数料 20%
  stripePlatformAccountId: 'acct_1KokoromouPlatformMain',
  description: '愛媛県松山・中予エリアを中心に、霊園・墓地管理会社と地域の確かな石材・清掃代行業者をつなぐ、安心の代行マッチングおよび決済送金プラットフォーム。',
};

/**
 * 墓地管理会社・霊園管理事務所サンプル（3社）
 */
export const SAMPLE_CEMETERY_COMPANIES: CemeteryCompany[] = [
  {
    id: 'cem_comp_001',
    name: '宝塔寺 旭ヶ丘霊園管理事務所',
    cemeteryNames: ['宝塔寺 旭ヶ丘霊園（モデル霊園）', '宝塔寺 東区共同墓苑'],
    representativeName: '宝塔寺 住職 / 霊園管理長 佐伯 泰山',
    phoneNumber: '089-925-8822',
    email: 'info@houtouji-reien-dummy.jp',
    locationAddress: '愛媛県松山市朝日ヶ丘1丁目',
    description: '松山城を望む閑静な旭ヶ丘の高台に位置する歴史ある寺院霊園。同姓の多い共同区画の適正管理と指定業者認定制度を導入。',
    affiliatedVendorIds: ['vendor_001', 'vendor_003', 'vendor_006'], // 松山まごころ、伊予匠、勝山美装
    vendorContracts: {
      vendor_001: {
        vendorId: 'vendor_001',
        vendorName: '有限会社 松山まごころ清掃',
        contractFileUrl: '/images/grave_front_example.jpg', // プレビュー確認用サンプル
        contractFileName: '墓地内作業代行契約書_松山まごころ清掃_20260901.pdf',
        uploadedAt: '2026-09-01T10:00:00.000Z',
        status: 'signed',
        notes: '2026年度更新済。三井住友海上 施設賠償責任保険証券コピー確認済。',
      },
    },
    contractTemplateFileName: '宝塔寺_霊園内作業代行業務基本契約書_標準雛形.pdf',
    contractTemplateUpdatedAt: '2026-09-01T09:00:00.000Z',
    emailTemplates: [
      {
        id: 'tpl_autumn_higan',
        title: '🍁 秋のお彼岸・お墓参り代行のご案内',
        subject: '【宝塔寺 旭ヶ丘霊園より】秋のお彼岸・お墓参り・代行清掃のご案内',
        body: `宝塔寺 旭ヶ丘霊園をご利用の施主様へ

いつも大変お世話になっております。宝塔寺 旭ヶ丘霊園管理事務所でございます。
朝夕は涼しさを感じる季節となってまいりました。

まもなく秋のお彼岸を迎えます。
遠方にお住まいの方や、ご多忙・足腰の不安等でお墓参りや草抜きのお手入れが難しい施主様に向けて、当霊園の公認提携パートナーによる「お墓参り・お掃除代行サービス」を本年も承っております。

■ 当霊園での代行プラン
・簡易プラン（草取り・シキミ供え・線香・合掌・Before/After写真報告）：8,800円
・通常プラン（水洗い・健全度点検・草取り・シキミ・線香）：14,800円【一番人気】
・プレミアムプラン（頑固な水垢落とし・香炉灰全量新品入替）：22,800円

ご希望の施主様は、本メールへのご返信、または管理事務所へのお電話・Webよりお気軽にお申し付けください。
提携職人が心を込めて合掌礼拝・清掃し、高画質な完了写真レポートをお届けいたします。

--------------------------------------------------
宗教法人 宝塔寺 旭ヶ丘霊園管理事務所
電話番号: 089-925-8822
所在地: 愛媛県松山市朝日ヶ丘1丁目
--------------------------------------------------`,
      },
      {
        id: 'tpl_obon',
        title: '🌻 お盆・ご先祖供養のお墓清掃ご案内',
        subject: '【宝塔寺 旭ヶ丘霊園より】お盆のお墓参り・清掃代行のご予約受付について',
        body: `宝塔寺 旭ヶ丘霊園をご利用の施主様へ

いつも大変お世話になっております。宝塔寺 旭ヶ丘霊園管理事務所でございます。

まもなくお盆の季節を迎えます。
「猛暑で現地のお墓掃除が大変」「帰省できないためお盆までにお墓を綺麗にしておきたい」という施主様のために、当霊園の公認パートナーによるお墓参り・清掃代行のご予約を承っております。

お盆時期はご依頼が混み合いますため、お早めのご連絡をおすすめしております。
ご希望の施主様は本メールへのご返信、またはお電話・Webにてお気軽にご相談ください。

--------------------------------------------------
宗教法人 宝塔寺 旭ヶ丘霊園管理事務所
電話番号: 089-925-8822
所在地: 愛媛県松山市朝日ヶ丘1丁目
--------------------------------------------------`,
      },
      {
        id: 'tpl_spring_higan',
        title: '🌸 春のお彼岸・お墓参り代行のご案内',
        subject: '【宝塔寺 旭ヶ丘霊園より】春のお彼岸・お墓参り代行のご案内',
        body: `宝塔寺 旭ヶ丘霊園をご利用の施主様へ

いつも大変お世話になっております。宝塔寺 旭ヶ丘霊園管理事務所でございます。
春彼岸を迎え、ご先祖様への感謝を伝える季節となりました。

お墓のお手入れやお参り代行をご希望の施主様は、どうぞお気軽に本メールまたはお電話にてお申し付けください。

--------------------------------------------------
宗教法人 宝塔寺 旭ヶ丘霊園管理事務所
電話番号: 089-925-8822
--------------------------------------------------`,
      },
      {
        id: 'tpl_regular_check',
        title: '🍃 定期点検・雑草除去のご案内',
        subject: '【宝塔寺 旭ヶ丘霊園より】お墓の定期お手入れ・除草清掃のご案内',
        body: `宝塔寺 旭ヶ丘霊園をご利用の施主様へ

いつも大変お世話になっております。宝塔寺 旭ヶ丘霊園管理事務所でございます。

前回のお墓参り・清掃から一定の期間が経過いたしました。
雑草の繁茂や墓石の汚れ、台風後の状態などが気になる施主様に向けて、定期清掃・墓石点検を承っております。

ご相談やご依頼は、本メールへのご返信または管理事務所までお気軽にご連絡ください。

--------------------------------------------------
宗教法人 宝塔寺 旭ヶ丘霊園管理事務所
電話番号: 089-925-8822
--------------------------------------------------`,
      },
    ],
  },
  {
    id: 'cem_comp_002',
    name: '松山市営霊園 指定管理共同体（大明神・客谷）',
    cemeteryNames: ['松山市営 大明神霊園', '松山市営 客谷霊園'],
    representativeName: '所長 門田 喜一郎',
    phoneNumber: '089-947-6611',
    email: 'reien@matsuyama-shiei-dummy.jp',
    locationAddress: '愛媛県松山市溝辺町',
    description: '松山市営の大規模公営霊園群。広大な敷地の手入れと水回り環境を維持するため、複数の地域清掃代行パートナーと連携。',
    affiliatedVendorIds: ['vendor_001', 'vendor_002', 'vendor_003', 'vendor_004'], // 複数業者と提携
  },
  {
    id: 'cem_comp_003',
    name: '道後やすらぎ墓苑 運営会 / 湯山寺院管理所',
    cemeteryNames: ['道後 湯山地域共同墓地', '道後やすらぎ霊苑'],
    representativeName: '代表幹事 水野 兼昭',
    phoneNumber: '089-977-3300',
    email: 'dogo-yasuragi@dummy.example.com',
    locationAddress: '愛媛県松山市末町',
    description: '道後温泉奥座敷の豊かな緑に囲まれた共同霊園。傾斜地や階段のある難所区画が多いため、専門技能を持つ業者を指定。',
    affiliatedVendorIds: ['vendor_002', 'vendor_004', 'vendor_005'], // 城南みち、道後こもれび、緑風墓苑
  },
  {
    id: 'cem_comp_004',
    name: 'お墓のトータルエージェント（宝塔寺・善福寺・東榮寺・法寿院 総合窓口）',
    cemeteryNames: ['宝塔寺 旭ヶ丘霊園', '善福寺 境内墓地', '東榮寺 墓苑', '法寿院 墓地'],
    representativeName: '代表窓口 / 霊園総合管理者',
    phoneNumber: '089-997-7466',
    email: 'info@totalagent.net',
    locationAddress: '愛媛県松山市土居田町455-16',
    description: '愛媛県松山・中予エリアを中心に、宝塔寺霊園や善福寺など中核霊園の管理受託・墓石建立・墓じまい・お参り代行相談をワンストップで手掛ける有力エージェント。',
    affiliatedVendorIds: ['vendor_001', 'vendor_002', 'vendor_003', 'vendor_004', 'vendor_005', 'vendor_006'],
    vendorContracts: {
      vendor_001: {
        vendorId: 'vendor_001',
        vendorName: '有限会社 松山まごころ清掃',
        contractFileUrl: '/images/grave_front_example.jpg',
        contractFileName: '墓地内作業代行契約書_松山まごころ清掃_2026.pdf',
        uploadedAt: '2026-09-10T10:00:00.000Z',
        status: 'signed',
        notes: '2026年度提携更新済。中予全域の代行作業を連携。',
      },
    },
    contractTemplateFileName: 'お墓のトータルエージェント_提携作業代行基本契約書.pdf',
    contractTemplateUpdatedAt: '2026-09-10T09:00:00.000Z',
  },
];

/**
 * サービスプラン一覧
 */
export const SAMPLE_SERVICE_PLANS: ServicePlan[] = [
  {
    id: 'plan_simple_service',
    name: '簡易プラン（お参り・草取り・シキミ）',
    description: '遠方にお住まいで定期的なお手入れをしたい方向け。シキミ供え、お線香、草取り、合掌礼拝を代行します。',
    price: 8800,
    platformFeePercent: 20, // 手数料 20% (1,760円) -> 業者受取 7,040円
    estimatedDuration: '約45分',
    features: [
      '敷地内の草取り・落ち葉の簡易除去',
      '新鮮なシキミ（樒）一対のお供え',
      'お線香のお供え・心を込めた合掌礼拝',
      '高解像度の作業前後Before/After写真レポート（全プラン共通）',
    ],
  },
  {
    id: 'plan_standard_service',
    name: '通常プラン（水洗い・墓石点検・シキミ）',
    description: '一番選ばれている定番プラン。簡易プランの内容に加え、墓石の埃落とし水洗いとメンテナンスチェックを実施します。',
    price: 14800,
    platformFeePercent: 20, // 手数料 20% (2,960円) -> 業者受取 11,840円
    estimatedDuration: '約90分',
    features: [
      '簡易プランのすべての作業内容（草取り・シキミ・線香・拝礼）',
      '墓石全体・花立て・香炉の水洗い（埃落とし・丁寧な水拭き）',
      'プロによる墓石メンテナンスチェック（目地割れ・傾き・欠け点検）',
      '高解像度の作業前後Before/After写真レポート（全プラン共通）',
    ],
    isPopular: true,
  },
  {
    id: 'plan_premium_service',
    name: 'プレミアムプラン（水垢落とし・香炉灰入替）',
    description: 'ご命日やお盆・お彼岸前に。通常プランに加え、頑固な水垢落としと香炉灰の全量交換を行い清潔に整えます。',
    price: 22800,
    platformFeePercent: 20, // 手数料 20% (4,560円) -> 業者受取 18,240円
    estimatedDuration: '約150分',
    features: [
      '通常プランのすべての作業内容（草取り・水洗い・点検・シキミ・線香）',
      '専用洗剤・ブラシによる墓石の水垢・コケの徹底除去',
      '香炉灰の全量取り出し・清掃・新品の香炉灰入れ替え',
      '高解像度の作業前後Before/After写真レポート（詳細点検コメント付き）',
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
      affiliatedCemeteryCompanyIds: ['cem_comp_001', 'cem_comp_002'], // 宝塔寺霊園、松山市営霊園
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
      affiliatedCemeteryCompanyIds: ['cem_comp_002', 'cem_comp_003'], // 市営霊園、道後やすらぎ
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
      affiliatedCemeteryCompanyIds: ['cem_comp_001', 'cem_comp_002'], // 宝塔寺霊園、市営霊園
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
      affiliatedCemeteryCompanyIds: ['cem_comp_002', 'cem_comp_003'], // 市営霊園、道後やすらぎ
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
      affiliatedCemeteryCompanyIds: ['cem_comp_003'], // 道後やすらぎ・山間部難所
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
      affiliatedCemeteryCompanyIds: ['cem_comp_001', 'cem_comp_002'], // 宝塔寺、市営霊園
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
    cemeteryCompanyId: 'cem_comp_001',
    cemeteryCompanyName: '宝塔寺 旭ヶ丘霊園管理事務所',
    vendorId: 'vendor_001',
    vendorName: '松山まごころ墓苑サポート（ダミー提携パートナー）',
    vendorStripeAccountId: 'acct_1OuTESTConnectVendor01',
    servicePlanId: 'plan_standard_service',
    servicePlanName: '通常プラン（水洗い・墓石点検・シキミ）',
    basePlanFee: 14800,
    extraGraveFee: 0,
    extraPlotFee: 0,
    totalAmount: 14800,
    platformFeeAmount: 2960, // 20%
    vendorPayoutAmount: 11840,
    currency: 'jpy',
    stripeCheckoutSessionId: 'cs_test_sample_session_123',
    stripePaymentIntentId: 'pi_test_sample_payment_intent_456',
    status: 'paid',
    graveInfo: {
      cemeteryCompanyId: 'cem_comp_001',
      cemeteryName: '宝塔寺 旭ヶ丘霊園（モデル霊園・ダミー）',
      locationAddress: '愛媛県松山市朝日ヶ丘1丁目',
      sectionPlotNumber: '東区 5列 12番',
      frontInscription: '山田家先祖代々之墓',
      builderName: '昭和五十年八月 山田太郎建之',
      frontInscriptionPhotoUrl: '/images/grave_front_example.jpg',
      builderNamePhotoUrl: '/images/grave_side_builder_example.jpg',
      deceasedName: '山田家先祖代々之墓',
      graveCount: 1,
      plotSize: 'standard',
      googleMapsUrl: 'https://maps.google.com/?q=33.8415,132.7483',
      landmarksDescription: '東区入口の階段を上がって右側、大楠の木のすぐ横です。隣は「加藤家」のお墓です。',
      specialRequests: '花立ての水垢と墓石周辺の雑草が目立ってきたため、水洗いでしっかり綺麗にしていただきたいです。',
    },
    preferredDate: '2026-09-25',
    scheduledDate: '2026-09-25',
    createdAt: '2026-09-18T10:00:00Z',
    paidAt: '2026-09-18T10:05:00Z',
    updatedAt: '2026-09-18T10:05:00Z',
  },
  {
    id: 'order_sample_002',
    orderNumber: 'KKM-20260920-002',
    clientId: 'client_user_102',
    clientName: '佐藤 美咲',
    clientEmail: 'misaki.sato@example.com',
    cemeteryCompanyId: 'cem_comp_002',
    cemeteryCompanyName: '松山市営霊園 指定管理共同体（大明神・客谷）',
    vendorId: 'vendor_002',
    vendorName: '城南みちお墓クリーン（ダミー提携パートナー）',
    vendorStripeAccountId: 'acct_1OuTESTConnectVendor02',
    servicePlanId: 'plan_premium_service',
    servicePlanName: 'プレミアムプラン（水垢落とし・香炉灰入替）',
    basePlanFee: 22800,
    extraGraveFee: 3000, // 2基
    extraPlotFee: 3000, // 広め区画
    totalAmount: 28800,
    platformFeeAmount: 5760, // 20%
    vendorPayoutAmount: 23040,
    currency: 'jpy',
    status: 'in_progress',
    graveInfo: {
      cemeteryCompanyId: 'cem_comp_002',
      cemeteryName: '松山市営 大明神霊園',
      locationAddress: '愛媛県松山市溝辺町',
      sectionPlotNumber: '南3区 8列 15番',
      frontInscription: '佐藤家之墓',
      builderName: '昭和四十五年三月 佐藤一郎建之',
      frontInscriptionPhotoUrl: '/images/grave_front_example.jpg',
      builderNamePhotoUrl: '/images/grave_side_builder_example.jpg',
      deceasedName: '佐藤家之墓',
      graveCount: 2,
      plotSize: 'large',
      landmarksDescription: '南3区水道場のすぐ斜め向かい。角地から2軒目のお墓です。',
      specialRequests: '個人墓も含め2基ございます。水垢がひどいので念入りにお願いします。',
    },
    preferredDate: '2026-09-28',
    scheduledDate: '2026-09-28',
    createdAt: '2026-09-20T14:30:00Z',
    paidAt: '2026-09-20T14:35:00Z',
    updatedAt: '2026-09-20T14:35:00Z',
  },
  {
    id: 'order_sample_003',
    orderNumber: 'KKM-20260921-003',
    clientId: 'client_user_103',
    clientName: '高橋 健司',
    clientEmail: 'kenji.takahashi@example.com',
    cemeteryCompanyId: 'cem_comp_003',
    cemeteryCompanyName: '道後やすらぎ墓苑 運営会 / 湯山寺院管理所',
    vendorId: 'vendor_003',
    vendorName: '伊予匠・石材メンテナンス工房（ダミー提携パートナー）',
    vendorStripeAccountId: 'acct_1OuTESTConnectVendor03',
    servicePlanId: 'plan_standard_service',
    servicePlanName: '通常プラン（水洗い・墓石点検・シキミ）',
    basePlanFee: 14800,
    extraGraveFee: 0,
    extraPlotFee: 0,
    totalAmount: 14800,
    platformFeeAmount: 2960,
    vendorPayoutAmount: 11840,
    currency: 'jpy',
    status: 'paid',
    graveInfo: {
      cemeteryCompanyId: 'cem_comp_003',
      cemeteryName: '道後 湯山地域共同墓地',
      locationAddress: '愛媛県松山市末町',
      sectionPlotNumber: '参道沿い中段 7番',
      frontInscription: '高橋家之墓',
      builderName: '平成二年四月 高橋修建之',
      frontInscriptionPhotoUrl: '/images/grave_front_example.jpg',
      builderNamePhotoUrl: '/images/grave_side_builder_example.jpg',
      deceasedName: '高橋家之墓',
      graveCount: 1,
      plotSize: 'standard',
      landmarksDescription: '山門をくぐって階段を30段上がった右手。隣に五輪塔があります。',
      specialRequests: '生花をお供えし、合掌礼拝の写真をしっかり送ってください。',
    },
    preferredDate: '2026-09-30',
    scheduledDate: '2026-09-30',
    createdAt: '2026-09-21T08:10:00Z',
    paidAt: '2026-09-21T08:15:00Z',
    updatedAt: '2026-09-21T08:15:00Z',
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

/**
 * ログイン用アカウントサンプル（メールアドレス＆パスワード）
 */
export const SAMPLE_ACCOUNTS = [
  // 本部統括
  {
    id: 'acc_admin_001',
    email: 'kotsuka@creativesd.net',
    password: 'admin1234',
    role: 'admin' as const,
    name: 'Creative System Design（本部統括）',
    createdAt: '2026-01-01T00:00:00Z',
  },
  // 墓地管理会社（3社）
  {
    id: 'acc_cem_001',
    email: 'info@houtouji-reien-dummy.jp',
    password: 'cem1234',
    role: 'cemetery' as const,
    name: '宝塔寺 旭ヶ丘霊園管理事務所',
    targetId: 'cem_comp_001',
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'acc_cem_002',
    email: 'reien@matsuyama-shiei-dummy.jp',
    password: 'cem1234',
    role: 'cemetery' as const,
    name: '松山市営霊園 指定管理共同体',
    targetId: 'cem_comp_002',
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'acc_cem_003',
    email: 'dogo-yasuragi@dummy.example.com',
    password: 'cem1234',
    role: 'cemetery' as const,
    name: '道後やすらぎ墓苑 運営会',
    targetId: 'cem_comp_003',
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'acc_cem_004',
    email: 'info@totalagent.net',
    password: 'cem1234',
    role: 'cemetery' as const,
    name: 'お墓のトータルエージェント',
    targetId: 'cem_comp_004',
    createdAt: '2026-01-01T00:00:00Z',
  },
  // 作業代行業者（6社）
  {
    id: 'acc_ven_001',
    email: 'info@iyo-memorial-dummy.example.com',
    password: 'vendor1234',
    role: 'vendor' as const,
    name: '松山まごころ墓苑サポート',
    targetId: 'vendor_001',
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'acc_ven_002',
    email: 'support@jonan-kankyo-dummy.example.com',
    password: 'vendor1234',
    role: 'vendor' as const,
    name: '城南みちお墓クリーン',
    targetId: 'vendor_002',
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'acc_ven_003',
    email: 'contact@iyotakumi-dummy.example.com',
    password: 'vendor1234',
    role: 'vendor' as const,
    name: '伊予匠・石材メンテナンス工房',
    targetId: 'vendor_003',
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'acc_ven_004',
    email: 'info@dogo-komorebi-dummy.example.com',
    password: 'vendor1234',
    role: 'vendor' as const,
    name: '道後こもれび墓苑ケア',
    targetId: 'vendor_004',
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'acc_ven_005',
    email: 'info@ryokufu-grave-dummy.example.com',
    password: 'vendor1234',
    role: 'vendor' as const,
    name: '中予山間部・緑風墓苑管理',
    targetId: 'vendor_005',
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'acc_ven_006',
    email: 'contact@katsuyama-bisou-dummy.example.com',
    password: 'vendor1234',
    role: 'vendor' as const,
    name: '勝山美装・墓所プロテクト',
    targetId: 'vendor_006',
    createdAt: '2026-01-01T00:00:00Z',
  },
];

