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
  Flower2,
  HelpCircle,
} from 'lucide-react';

export default function Home() {
  // よくある質問（FAQ）
  const FAQS = [
    {
      q: '当日、現地へ立ち会う必要はありますか？',
      a: '一切不要です。遠方にお住まいの方やご高齢で移動が難しい方のために、鍵の手配や墓所への立ち入り手続きも含め、すべて現地の提携パートナーが代行いたします。完了後は写真付きのWeb報告書をお送りします。',
    },
    {
      q: '見積もり以上の追加料金や出張費が発生することはありますか？',
      a: '基本プランの料金内ですべて完結し、松山市内および周辺対応エリア（伊予市・東温市・松前町・砥部町など）の標準出張費も含んでおります。墓所の著しい倒壊や特殊伐採など特別工事が必要な場合を除き、事前の承諾なく追加費用を請求することは一切ございません。',
    },
    {
      q: '寺院墓地や地域共同墓地、みなし墓地でも対応してもらえますか？',
      a: 'はい、公営霊園・民営霊園・寺院墓地・山間部の地域共同墓地など、どのような形態のお墓でも対応可能です。寺院墓地の場合、事前にご住職へ代理清掃の旨をご一報いただけるとよりスムーズです。',
    },
    {
      q: '宗派や宗教に合わせたお参りはお願いできますか？',
      a: 'はい、仏教各宗派（浄土真宗、曹洞宗、真言宗、日蓮宗等）をはじめ、神道（神葬祭・榊のお供え）、キリスト教など、ご指定の作法やお気持ちに寄り添って敬虔に合掌・拝礼いたします。ご要望はお申し込み時の備考欄にご記入ください。',
    },
    {
      q: '雨天や台風などの悪天候時はどうなりますか？',
      a: '豪雨や台風などの荒天時は、丁寧な清掃作業と安全な線香着火・鮮明な写真撮影が困難となるため、天候回復を待って順延いたします。その際は事前に予定日の再調整メールをご連絡いたします。',
    },
    {
      q: '作業完了の報告はいつ、どのように届きますか？',
      a: '作業完了後、原則24時間〜48時間以内に、専用のWeb完了報告ページ（URL）をメールでお届けします。スマートフォンやPCから、作業前後の高画質比較写真（墓石全体、水鉢、花立、香炉、足回り）や専門スタッフの点検所見をいつでも閲覧・保存・ご親族へ共有いただけます。',
    },
    {
      q: 'お供えするお花やお線香の指定、故人の好物などのお供えは可能ですか？',
      a: '標準・プレミアムプランには季節の新鮮な生花一対とお線香が含まれます。「故人が好きだった色合いの花にしてほしい」「お酒や果物をお供えして手を合わせた後に持ち帰って処分してほしい」などのご要望にも柔軟に対応いたします（※鳥獣被害防止のため、供物は拝礼後に回収いたします）。',
    },
    {
      q: '墓石のひび割れや傾き、目地の劣化が見つかった場合はどうなりますか？',
      a: '現地清掃時に、経験豊富な石材技能士・お墓ディレクターが墓石全体の健全度を目視点検いたします。破損や劣化を発見した場合は、報告書に写真を添えて詳細を記載し、ご希望に応じて適切な補修プランやアドバイスをご案内いたします（無理な営業等は一切行いません）。',
    },
    {
      q: '年に複数回（春・秋のお彼岸、お盆、年末など）の定期清掃は頼めますか？',
      a: 'はい、年2回〜年4回の定期清掃や、複数回まとめてのご予約も承っております。定期契約いただくことで割引特典や優先日程確保のメリットもございます。お気軽にお問い合わせください。',
    },
    {
      q: '支払い方法は何が使えますか？',
      a: '各種クレジットカード（VISA、Mastercard、JCB、American Express、Diners等）による即時安全決済（Stripe）に対応しております。決済手数料は無料で、電子領収書も即時発行されます。',
    },
  ];
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
                  src="/images/grave_before.jpg" 
                  alt="作業前の墓石の様子（苔・水垢・落ち葉・枯れ草の堆積）" 
                  className="w-full h-72 sm:h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 bg-stone-900/85 backdrop-blur-xs text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-md">
                  作業前 (Before)
                </div>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                墓石本体の水垢・苔の付着、敷地内に散らばった落ち葉や雑草、花立ての枯れ草が堆積しているお手入れ前の状態。
              </p>
            </div>

            {/* After 写真 */}
            <div className="space-y-3">
              <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-600 shadow-lg group">
                <img 
                  src="/images/grave_after.jpg" 
                  alt="作業後のお参り完了の様子（専用水拭き・手作業除草・季節の生花とお線香）" 
                  className="w-full h-72 sm:h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 bg-emerald-800 text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-md">
                  作業完了 (After)
                </div>
              </div>
              <p className="text-xs text-emerald-900 font-medium leading-relaxed">
                手作業で落ち葉や雑草を全掃去し、墓石・敷石を専用水洗い。色鮮やかな生花（菊・リンドウ）をお供えし、お線香を焚いて合掌礼拝。
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

      {/* よくある質問（FAQ）セクション */}
      <section id="faq" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Q&A</span>
          </div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700">Frequently Asked Questions</h2>
          <p className="mt-2 text-3xl font-bold text-stone-900 sm:text-4xl">よくあるご質問</p>
          <p className="mt-3 text-sm text-stone-600">
            お申し込みや施工、お支払いに関して多くいただくご質問をまとめました。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {FAQS.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm hover:border-emerald-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-3">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-800 text-white font-black text-sm shrink-0">
                    Q
                  </span>
                  <h3 className="text-base font-bold text-stone-900 leading-snug pt-0.5">
                    {item.q}
                  </h3>
                </div>
                <div className="flex items-start gap-3 mt-4 pt-4 border-t border-stone-100">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-amber-100 text-amber-900 font-black text-sm shrink-0">
                    A
                  </span>
                  <p className="text-sm text-stone-600 leading-relaxed font-light">
                    {item.a}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 相談窓口のご案内 */}
        <div className="mt-12 bg-emerald-50 border border-emerald-200 rounded-2xl p-6 sm:p-8 text-center max-w-3xl mx-auto">
          <p className="text-sm sm:text-base font-bold text-emerald-950">
            他にご不明な点や、特殊なご要望はございますか？
          </p>
          <p className="text-xs sm:text-sm text-emerald-800 mt-1">
            お墓の場所が分からない場合や、複数区画のご相談もお気軽にお問い合わせください。
          </p>
          <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/order"
              className="inline-flex items-center justify-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-bold px-6 py-2.5 rounded-lg shadow-sm transition-colors"
            >
              <span>Webでお見積り・相談する</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
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
