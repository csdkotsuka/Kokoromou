import Link from 'next/link';
import { SAMPLE_SERVICE_PLANS, SAMPLE_VENDORS } from '@/mocks/sample-data';
import { 
  HeartHandshake, 
  Sparkles, 
  Camera, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  MapPin, 
  CreditCard,
  Star,
  Quote,
  Clock,
  Flower2
} from 'lucide-react';

export default function Home() {
  // 利用者の声（ダミーデータ）
  const REVIEWS = [
    {
      id: 'rev-1',
      name: '高橋 さゆり 様（50代・主婦）',
      location: '東京都品川区在住（松山市ご出身）',
      targetCemetery: '宝塔寺 旭ヶ丘霊園',
      planName: '標準お参り・徹底お掃除プラン',
      rating: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      comment:
        '東京に嫁いでから仕事と家庭の都合でなかなか松山へ帰省できず、ずっとお墓の荒れ具合が気がかりでした。届いた作業前後の写真を見て、墓石の苔まで驚くほど綺麗になり、綺麗なお花とお線香があげられている姿に思わず涙が出ました。遠く離れていても親孝行ができたようで、本当に救われました。',
      date: '2026年8月 ご利用',
    },
    {
      id: 'rev-2',
      name: '中村 正彦 様（60代・無職）',
      location: '大阪府大阪市在住',
      targetCemetery: '松山市内 寺院墓地',
      planName: '標準お参り・徹底お掃除プラン',
      rating: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
      comment:
        '足腰を痛めてしまい、階段の多い山裾の墓所へ足を運ぶのが年々難しくなっていました。地元の信頼できる業者さんが代行してくださり、作業前後の写真だけでなく「目地が少し傷んでいます」といった専門家ならではの点検所見まで丁寧に添えていただき、安心感が違いました。',
      date: '2026年9月 ご利用',
    },
    {
      id: 'rev-3',
      name: '渡辺 健太郎 様（40代・会社員）',
      location: '愛知県名古屋市在住',
      targetCemetery: '松山市営霊園',
      planName: 'プレミアム美装プラン',
      rating: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      comment:
        'お盆の帰省に合わせてプレミアムプランをお願いしました。自分たちで半日かけて掃除するより遥かに美しく、撥水コーティングで新品のようなツヤが戻っていて親戚一同大絶賛でした。クレジットカードでサッと決済でき、領収書も明瞭で助かります。来年も必ずお願いします。',
      date: '2026年8月 ご利用',
    },
  ];

  return (
    <div className="flex flex-col gap-20 pb-24">
      {/* ヒーローセクション：情緒的で心温まるビジュアル演出 */}
      <section className="relative overflow-hidden bg-stone-900 text-white min-h-[580px] lg:min-h-[640px] flex items-center">
        {/* 背景画像（静謐な日本庭園・木漏れ日の美しい写真にオーバーレイ） */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 transform scale-105 transition-transform duration-1000"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1800&q=80')`,
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/80 to-transparent"></div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-900/80 border border-emerald-400/40 rounded-full px-4 py-1.5 text-xs text-emerald-200 mb-6 backdrop-blur shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>遠く離れていても、大切な想いはすぐそばに</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight sm:leading-snug">
            ふるさとお墓の清掃とお参りを、<br />
            <span className="text-emerald-300">地元の確かな手で真心を込めて。</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-stone-200 max-w-3xl mx-auto leading-relaxed font-light">
            「仕事が忙しくて帰省できない」「高齢でお墓参りの階段を登るのがつらい」<br className="hidden sm:inline" />
            松山を知り尽くした地元パートナーが、ご家族に代わって丁寧に清掃・合掌。<br className="hidden sm:inline" />
            心温まる鮮明な写真レポートをWebでお届けします。
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/order"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 text-base"
            >
              <span>今すぐお申し込み・お見積り</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/#plans"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-4 rounded-xl border border-white/20 transition-colors text-base backdrop-blur-xs"
            >
              <span>プラン・料金を見る</span>
            </Link>
          </div>

          {/* 信頼の4大指標 */}
          <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-stone-300">
            <div className="flex items-center justify-center gap-2 bg-white/5 py-2 px-3 rounded-lg backdrop-blur-xs">
              <Camera className="w-4 h-4 text-emerald-400" />
              <span>Before/After 写真報告</span>
            </div>
            <div className="flex items-center justify-center gap-2 bg-white/5 py-2 px-3 rounded-lg backdrop-blur-xs">
              <HeartHandshake className="w-4 h-4 text-emerald-400" />
              <span>生花・線香・真心合掌</span>
            </div>
            <div className="flex items-center justify-center gap-2 bg-white/5 py-2 px-3 rounded-lg backdrop-blur-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Stripe Connect 安全決済</span>
            </div>
            <div className="flex items-center justify-center gap-2 bg-white/5 py-2 px-3 rounded-lg backdrop-blur-xs">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>愛媛・松山エリア密着</span>
            </div>
          </div>
        </div>
      </section>

      {/* 写真で見る「清掃とお参りの仕上がり」（Before / After 実例プレビュー） */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700">Real Report Preview</h2>
          <p className="mt-2 text-3xl font-bold text-stone-900 sm:text-4xl">まるで現地に立ち会ったような安心感</p>
          <p className="mt-3 text-sm text-stone-600">
            作業前と作業後の写真を高画質でお届け。墓石の細やかな状態まで一目でご確認いただけます。
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Before 写真 */}
            <div className="space-y-3">
              <div className="relative rounded-2xl overflow-hidden border border-stone-200 shadow-inner group">
                <img 
                  src="https://images.unsplash.com/photo-1561503972-839d0c56de17?auto=format&fit=crop&w=900&q=80" 
                  alt="作業前の墓石の様子（苔・水垢・雑草の繁茂）" 
                  className="w-full h-72 sm:h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 bg-stone-900/85 backdrop-blur-xs text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-md">
                  作業前 (Before)
                </div>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                墓石本体の水垢・苔の付着、文字彫刻部分の汚れ、敷地内に伸びた雑草や落ち葉が溜まっている状態。
              </p>
            </div>

            {/* After 写真 */}
            <div className="space-y-3">
              <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-lg group">
                <img 
                  src="https://images.unsplash.com/photo-1574063900403-a4e29a4690b5?auto=format&fit=crop&w=900&q=80" 
                  alt="作業後のお参り完了の様子（専用水拭き・お線香とお花のお供え）" 
                  className="w-full h-72 sm:h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 bg-emerald-800 text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-md">
                  作業完了 (After)
                </div>
              </div>
              <p className="text-xs text-emerald-900 font-medium leading-relaxed">
                手作業による敷地内の全面除草、墓石・花立て・香炉の専用水洗いを実施。お線香を焚き、色鮮やかな生花をお供えして合掌礼拝。
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-600 bg-stone-50 p-4 rounded-xl">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>職人からの点検メモ「台座の目地や欠けのチェック結果」もレポートに付属します。</span>
            </div>
            <Link
              href="/vendor/reports/order_sample_001"
              className="text-emerald-700 hover:text-emerald-800 font-bold hover:underline shrink-0"
            >
              実際の報告書サンプルを見る →
            </Link>
          </div>
        </div>
      </section>

      {/* ココロモウの3つの特長 */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700">Service Features</h2>
          <p className="mt-2 text-3xl font-bold text-stone-900 sm:text-4xl">ココロモウが選ばれる3つの理由</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center mb-6">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-3">1. 鮮明な写真レポート納品</h3>
            <p className="text-stone-600 leading-relaxed text-sm">
              作業前後の様子だけでなく、お花やお線香をお供えした瞬間の写真をWeb上でいつでも閲覧・保存できます。お墓の劣化診断メモも付属します。
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center mb-6">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-3">2. 地元の確かな専門パートナー</h3>
            <p className="text-stone-600 leading-relaxed text-sm">
              松山城下や道後、宝塔寺霊園など地域の霊園環境を知り尽くした提携業者が担当。大切なお墓を傷つけない専用の手法で真心を込めて施工します。
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-3">3. Stripe Connectによる安心決済</h3>
            <p className="text-stone-600 leading-relaxed text-sm">
              クレジットカードで即時・安全に決済。プラットフォーム手数料を差し引いた代金が提携業者へ自動分配される透明なシステムを採用しています。
            </p>
          </div>
        </div>
      </section>

      {/* 利用者の声（お客様の声）セクション */}
      <section id="reviews" className="bg-gradient-to-b from-stone-100 to-stone-50 py-16 sm:py-20 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 text-amber-500 font-bold text-xs bg-amber-50 border border-amber-200 px-3 py-1 rounded-full mb-3">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>お客様満足度 98.4%</span>
            </div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700">Customer Reviews</h2>
            <p className="mt-2 text-3xl font-bold text-stone-900 sm:text-4xl">ご利用いただいたお客様の声</p>
            <p className="mt-3 text-sm text-stone-600">
              遠方からお申し込みいただいた施主様より、温かいメッセージを多数いただいております。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {REVIEWS.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-2xl p-7 border border-stone-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* 星評価 */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  {/* コメント */}
                  <p className="text-stone-700 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                </div>

                {/* 投稿者情報 */}
                <div className="pt-4 border-t border-stone-100 flex items-center gap-3">
                  <img
                    src={review.avatarUrl}
                    alt={review.name}
                    className="w-10 h-10 rounded-full object-cover border border-stone-200 shrink-0"
                  />
                  <div>
                    <span className="font-bold text-stone-900 text-xs block">{review.name}</span>
                    <span className="text-[11px] text-stone-500 block">{review.location}</span>
                    <span className="text-[10px] text-emerald-700 font-medium block mt-0.5">
                      対象: {review.targetCemetery}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* プラン・料金 */}
      <section id="plans" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700">Plans & Pricing</h2>
          <p className="mt-2 text-3xl font-bold text-stone-900 sm:text-4xl">選べるサービスプラン</p>
          <p className="mt-3 text-stone-600">お墓の状況やご予算に合わせて、最適なプランをお選びいただけます。</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {SAMPLE_SERVICE_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl border flex flex-col justify-between p-8 transition-all ${
                plan.isPopular
                  ? 'border-emerald-600 shadow-xl ring-2 ring-emerald-600/20 md:-translate-y-2'
                  : 'border-stone-200 shadow-sm hover:shadow-md'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-700 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  一番人気
                </div>
              )}

              <div>
                <h3 className="text-xl font-bold text-stone-900">{plan.name}</h3>
                <p className="mt-2 text-xs text-stone-500 min-h-[36px]">{plan.description}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-stone-900">¥{plan.price.toLocaleString()}</span>
                  <span className="text-xs text-stone-500 font-medium">（税込 / 目安 {plan.estimatedDuration}）</span>
                </div>

                <div className="mt-6 border-t border-stone-100 pt-6">
                  <p className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-4">含まれる作業内容：</p>
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-stone-600">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-stone-100">
                <Link
                  href={`/order?planId=${plan.id}`}
                  className={`w-full inline-flex items-center justify-center py-3.5 px-4 rounded-xl font-bold text-sm transition-all ${
                    plan.isPopular
                      ? 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-md hover:shadow-lg'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-900'
                  }`}
                >
                  このプランで申し込む
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 提携業者のご紹介（松山エリアのパートナー） */}
      <section className="bg-stone-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700">Our Partners</h2>
            <p className="mt-2 text-2xl font-bold text-stone-900 sm:text-3xl">提携パートナー（愛媛県松山エリア）</p>
            <p className="mt-2 text-xs sm:text-sm text-stone-600">
              各地域の石材技能士・お墓ディレクターが責任を持ってお墓を守ります。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {SAMPLE_VENDORS.map((vendor) => (
              <div key={vendor.id} className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-base font-bold text-stone-900">{vendor.displayName}</span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <ShieldCheck className="w-3 h-3" /> Stripe Verified
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1 font-medium">{vendor.vendorProfile?.companyName}</p>
                  <p className="text-xs text-stone-600 mt-3">{vendor.vendorProfile?.description}</p>
                </div>

                <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <span>対応地域: {vendor.vendorProfile?.serviceAreas.join('・')}</span>
                  <span className="font-semibold text-emerald-800">実績: {vendor.vendorProfile?.completedJobsCount}件</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTAセクション */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-stone-950 text-white rounded-3xl p-10 sm:p-16 relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              大切なお墓の清掃・お参りを、今すぐ申し込む
            </h2>
            <p className="mt-4 text-stone-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              クレジットカードで簡単即時決済。作業完了後は、心温まる鮮明な写真レポートと専門家の点検報告をWebでお届けします。
            </p>
            <div className="mt-8">
              <Link
                href="/order"
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-8 py-4 rounded-xl shadow-lg transition-transform hover:-translate-y-0.5 text-base"
              >
                <span>お申し込み手続きへ進む</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
