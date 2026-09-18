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
  CreditCard 
} from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      {/* ヒーローセクション */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 to-stone-900 text-white py-20 lg:py-28">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-800/60 border border-emerald-500/30 rounded-full px-4 py-1.5 text-xs text-emerald-200 mb-6 backdrop-blur">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>遠く離れていても、想いはすぐそばに</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            遠方に住むあなたと、地元の信頼できる業者を繋ぐ<br className="hidden sm:inline" />
            <span className="text-emerald-300">お墓参り・お掃除代行</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-stone-300 max-w-3xl mx-auto leading-relaxed">
            「忙しくて帰省できない」「高齢でお墓の階段を登るのがつらい」<br />
            地元の厳選された提携業者が真心を込めて清掃とお参りを代行。高解像度の写真レポートでお届けします。
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/order"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 text-base"
            >
              <span>今すぐお申し込み・見積り</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/#plans"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-4 rounded-xl border border-white/20 transition-colors text-base"
            >
              <span>料金プランを見る</span>
            </Link>
          </div>

          {/* 信頼バッジ */}
          <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-stone-300">
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Stripe Connect 安全決済</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Camera className="w-4 h-4 text-emerald-400" />
              <span>Before/After 写真報告</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <HeartHandshake className="w-4 h-4 text-emerald-400" />
              <span>厳選された提携業者</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <span>代行完了後の安心精算</span>
            </div>
          </div>
        </div>
      </section>

      {/* サービスの特長 */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700">Service Features</h2>
          <p className="mt-2 text-3xl font-bold text-stone-900 sm:text-4xl">ココロモウが選ばれる3つの理由</p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center mb-6">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-3">1. 詳細な写真付きレポート</h3>
            <p className="text-stone-600 leading-relaxed text-sm">
              作業前と作業後の鮮明な写真、お線香・お花をお供えした瞬間の様子をWeb上でいつでも確認できます。お墓の劣化状態の点検コメントも添えてお届けします。
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center mb-6">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-3">2. 地元の確かな専門業者</h3>
            <p className="text-stone-600 leading-relaxed text-sm">
              地域に根ざした石材店や清掃技能士など、厳しい基準をクリアした提携業者が担当。大切なお墓を傷つけない専用の道具・手順で丁寧に施工します。
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-3">3. Stripe Connectによる安心決済</h3>
            <p className="text-stone-600 leading-relaxed text-sm">
              クレジットカード決済完了後、プラットフォーム手数料を差し引いた代金が提携業者へ自動分配される透明な決済フローを構築しています。
            </p>
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
                  ? 'border-emerald-500 shadow-xl ring-2 ring-emerald-500/20 md:-translate-y-2'
                  : 'border-stone-200 shadow-sm hover:shadow-md'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-sm">
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
                  className={`w-full inline-flex items-center justify-center py-3 px-4 rounded-xl font-bold text-sm transition-all ${
                    plan.isPopular
                      ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-md hover:shadow-lg'
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

      {/* 提携業者のご紹介 */}
      <section className="bg-stone-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700">Our Partners</h2>
            <p className="mt-2 text-2xl font-bold text-stone-900 sm:text-3xl">登録提携業者（Stripe Connect連携済み）</p>
            <p className="mt-2 text-xs sm:text-sm text-stone-600">
              各地域の石材技能士や専門スタッフが責任を持ってお墓を守ります。
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
                  <span>対応地域: {vendor.vendorProfile?.serviceAreas.join(', ')}</span>
                  <span className="font-semibold text-emerald-800">実績: {vendor.vendorProfile?.completedJobsCount}件</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTAセクション */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-emerald-900 text-white rounded-3xl p-10 sm:p-16 relative overflow-hidden shadow-xl">
          <h2 className="text-2xl sm:text-4xl font-bold">大切なお墓の清掃・お参りを、今すぐ申し込む</h2>
          <p className="mt-4 text-stone-300 text-sm sm:text-base max-w-2xl mx-auto">
            クレジットカードで即時決済。作業完了後は高解像度写真と詳細なご報告をWebでお届けします。
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
      </section>
    </div>
  );
}
