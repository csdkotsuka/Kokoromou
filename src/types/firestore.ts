/**
 * Kokoromou (ココロモウ) - Firestore Data Models & Types
 */

// -------------------------------------------------------------
// 1. 本部管理の情報 (Platform Headquarters)
// -------------------------------------------------------------
export interface PlatformAdminInfo {
  organizationName: string; // 運営会社名 (例: 株式会社ココロモウ)
  serviceName: string; // サービス名 (お墓参り・清掃代行プラットフォーム ココロモウ)
  representative: string; // 代表責任者名
  email: string; // 本部代表メール
  phoneNumber: string; // 本部電話番号
  address: string; // 本社所在地
  platformFeePercent: number; // 標準プラットフォーム手数料 (20%)
  stripePlatformAccountId: string; // Stripe Platform Account ID
  description: string;
}

// -------------------------------------------------------------
// 2. 墓地管理会社・霊園管理事務所 (Cemetery Management Companies)
// -------------------------------------------------------------
export interface VendorContract {
  vendorId: string;
  vendorName: string;
  contractFileUrl?: string; // base64データURL (PDFまたは画像)
  contractFileName?: string;
  uploadedAt: string; // ISO 8601
  status: 'signed' | 'pending';
  notes?: string;
}

export interface CemeteryCompany {
  id: string; // 例: "cem_comp_001"
  name: string; // 会社・寺院事務所名 (例: 宝塔寺 旭ヶ丘霊園管理事務所)
  cemeteryNames: string[]; // 管轄する霊園名 (例: ["宝塔寺 旭ヶ丘霊園", "宝塔寺 東区共同墓苑"])
  representativeName: string; // 責任者名
  phoneNumber: string;
  email: string;
  locationAddress: string;
  prefecture?: string; // 都道府県 (例: "愛媛県")
  description: string;
  // この墓地管理会社と提携・出入り可能な作業代行業者IDリスト
  affiliatedVendorIds: string[];
  // 作業代行業者ごとの締結済み契約書・誓約書 (vendorId -> VendorContract)
  vendorContracts?: Record<string, VendorContract>;
  // 管理会社独自の契約書・誓約書テンプレートPDF（ダウンロード・印刷用）
  contractTemplateUrl?: string;
  contractTemplateFileName?: string;
  contractTemplateUpdatedAt?: string;
  // 一斉案内メールテンプレート (お彼岸・お盆・定期お参り等の案内用)
  emailTemplates?: EmailTemplate[];
  // 一括CSV取り込みされた施主台帳データ
  clients?: CemeteryClient[];
}

export interface CemeteryClient {
  id: string; // 例: "client_xxx"
  cemeteryCompanyId: string; // 所属霊園・管理会社ID
  name: string; // 施主氏名
  phoneNumber: string; // 電話番号（ログインIDとしても使用）
  postalCode?: string; // 郵便番号
  address?: string; // 住所（DMハガキ送付先）
  email?: string; // メールアドレス
  sectionPlotNumber: string; // 区画番号（例: 東区 5列 12番）
  frontInscription: string; // 正面文字（例: 山田家先祖代々之墓）
  builderName?: string; // 建立者名（例: 昭和五十年八月 山田太郎建之）
  initialPassword?: string; // 初期パスワード
  photoUrl?: string; // お墓の正面写真URL
  builderPhotoUrl?: string; // 墓石側面・建立者写真URL
  notes?: string; // 備考
  importedAt: string; // インポート日時 (ISO 8601)
  lastOrderDate?: string; // 最終利用日
  orderCount?: number; // 利用回数
  updatedAt?: string; // 更新日時
}

export interface EmailTemplate {
  id: string;
  title: string;
  subject: string;
  body: string;
  category?: string;
  updatedAt?: string;
}

// -------------------------------------------------------------
// 3. ユーザー情報 (users コレクション)
// -------------------------------------------------------------
export type UserRole = 'client' | 'vendor' | 'admin';
export type AccountRole = 'admin' | 'cemetery' | 'vendor' | 'customer';

export interface UserAccount {
  id: string;
  email: string;
  phoneNumber?: string; // 施主ログイン用電話番号
  password?: string; // 簡易認証・シード用パスワード
  role: AccountRole;
  name: string;
  targetId?: string; // cemeteryCompanyId (cem_comp_xxx) または vendorId (vendor_xxx)
  graveInfo?: Partial<GraveInfo>; // 施主アカウントに紐づく事前登録お墓情報
  createdAt: string;
}

export interface VendorProfile {
  businessType?: 'corporation' | 'individual'; // 法人 または 個人事業主・便利屋
  companyName: string;
  representativeName: string;
  phoneNumber?: string; // 電話番号
  email?: string; // メールアドレス
  serviceAreas: string[]; // 例: ["愛媛県松山市", "愛媛県伊予市"]
  stripeConnectAccountId?: string; // Stripe Connect Custom/Express Account ID (acct_xxx)
  stripeChargesEnabled: boolean;
  stripePayoutsEnabled: boolean;
  description?: string;
  rating?: number; // 平均評価 (例: 4.8)
  completedJobsCount: number; // 完了実績数
  // 提携・出入り契約を結んでいる墓地管理会社IDリスト（複数重複可能）
  affiliatedCemeteryCompanyIds?: string[];
}

export interface User {
  id: string; // Firebase Auth UID
  email: string;
  role: UserRole;
  displayName: string;
  phoneNumber?: string;
  createdAt: string; // ISO 8601
  updatedAt: string;

  // role === 'vendor' の場合のみ保持
  vendorProfile?: VendorProfile;
}

// -------------------------------------------------------------
// 2. サービスプラン (service_plans または静的定義)
// -------------------------------------------------------------
export interface ServicePlan {
  id: string;
  name: string;
  description: string;
  price: number; // 税込金額 (JPY)
  platformFeePercent: number; // プラットフォーム手数料率 (例: 20 -> 20%)
  estimatedDuration: string; // 作業目安 (例: "約60分")
  features: string[]; // 作業内訳 (例: 雑草抜き, 墓石水洗い, お線香・お花のお供え, 写真レポート)
  isPopular?: boolean;
}

// -------------------------------------------------------------
// 3. お墓情報 (Grave Information)
// -------------------------------------------------------------
export type PlotSizeCategory = 'standard' | 'large' | 'extra_large';

export interface GraveInfo {
  cemeteryCompanyId?: string; // 管轄墓地管理会社ID (例: "cem_comp_001")
  cemeteryName: string; // 霊園・寺院名 (例: ○○霊園)
  locationAddress: string; // 所在地・住所
  sectionPlotNumber: string; // 区画番号・墓石番号 (例: 3区 12番)
  frontInscription: string; // 正面文字 (例: 山田家之墓、南無阿弥陀仏)
  builderName: string; // 側面の建立者名 (例: 昭和50年 吉田太郎建之) ※同姓誤認防止のため必須
  deceasedName?: string; // 故人名 / 家名 (互換性用)
  graveCount: number; // 敷地内のお墓の基数 (1, 2, 3...)
  plotSize: PlotSizeCategory; // 区画の広さ (標準, 広め, 大区画)
  googleMapsUrl?: string; // Googleマップ共有URL・位置情報
  landmarksDescription?: string; // 周辺の目印 (例: 階段上がってすぐ右、大きな楠の木の隣)
  frontInscriptionPhotoUrl?: string; // 正面文字の写真URL
  builderNamePhotoUrl?: string; // 側面建立者名の写真URL
  specialRequests?: string; // 特記事項・ご要望 (例: しきみをお供えしてほしい、落ち葉を多めに掃いてほしい)
}

// -------------------------------------------------------------
// 4. 注文情報 (orders コレクション)
// -------------------------------------------------------------
export type OrderStatus =
  | 'pending_payment' // 決済待ち (Checkout Session発行済)
  | 'paid' // 決済完了 (提携業者への作業割り当て待ち・確認中)
  | 'in_progress' // 提携業者が現地作業中
  | 'report_submitted' // 提携業者より写真レポート提出済
  | 'completed' // 施主確認完了・取引クローズ
  | 'cancelled'; // キャンセル・返金済

export interface Order {
  id: string; // 注文ID (Firestore ドキュメントID)
  orderNumber: string; // 表示用注文番号 (例: KKM-20260918-001)

  clientId: string; // 施主ユーザーID
  clientName: string;
  clientEmail: string;
  clientPhone?: string;

  // 墓地管理会社（霊園管理元）
  cemeteryCompanyId?: string;
  cemeteryCompanyName?: string;

  // 担当作業代行業者
  vendorId: string; // 担当提携業者ユーザーID
  vendorName: string;
  vendorStripeAccountId: string; // 送金先 Stripe Connect Account ID (acct_xxx)

  servicePlanId: string;
  servicePlanName: string;

  // 金額計算 (JPY)
  basePlanFee?: number; // 基本プラン料金
  extraGraveFee?: number; // 基数追加料金
  extraPlotFee?: number; // 区画広さ追加料金
  // 年間定期管理オプション
  billingType?: 'single' | 'annual';
  annualFrequency?: 2 | 3 | 4; // 年2回 / 年3回 / 年4回
  annualDiscountPercent?: number; // 10 | 12 | 15
  annualDiscountAmount?: number; // 割引額
  scheduledPeriods?: string[]; // 実施希望時期（例: ['春彼岸（3月）', 'お盆（8月）']）
  totalAmount: number; // 施主支払総額 (例: 12,000)
  platformFeeAmount: number; // プラットフォーム手数料 (例: 2,400)
  vendorPayoutAmount: number; // 提携業者への送金予定額 (例: 9,600)
  currency: 'jpy';

  // Stripe 決済メタデータ
  stripeCheckoutSessionId?: string;
  stripePaymentIntentId?: string;
  stripeChargeId?: string;
  stripeTransferId?: string;

  status: OrderStatus;
  graveInfo: GraveInfo;

  preferredDate?: string; // 希望作業日
  scheduledDate?: string; // 確定作業日

  reportId?: string; // 完了レポートID (1対1でリンク)

  createdAt: string;
  paidAt?: string;
  completedAt?: string;
  updatedAt: string;
}

// -------------------------------------------------------------
// 5. 作業完了写真レポート (reports コレクション)
// -------------------------------------------------------------
export type ReportStatus = 'draft' | 'submitted' | 'approved';

export interface PhotoRecord {
  url: string;
  caption?: string; // 例: "墓石洗浄前", "雑草除去前", "献花・お線香後"
  timestamp?: string;
}

export interface Report {
  id: string; // レポートID
  orderId: string; // 対象注文ID
  vendorId: string; // 作成業者ID
  vendorName: string;

  workDate: string; // 実際の作業実施日 (YYYY-MM-DD)
  weather?: string; // 天候 (例: "晴れ")

  beforePhotos: PhotoRecord[]; // 作業前写真
  afterPhotos: PhotoRecord[]; // 作業後写真

  workNotes: string; // 作業報告詳細コメント (例: "雑草を根元から除去し、墓石の苔を高圧洗浄いたしました。お花とお線香を供え、合掌いたしました。")
  graveConditionNotes?: string; // お墓の状態メモ (例: "目地の一部に経年劣化が見られます。次回補修をおすすめします。")

  status: ReportStatus;
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
}
