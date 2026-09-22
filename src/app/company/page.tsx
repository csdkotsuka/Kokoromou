import React from 'react';
import Link from 'next/link';
import { 
  Building2, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Award, 
  CheckCircle2, 
  Sparkles, 
  ArrowLeft,
  FileCheck,
  ShieldCheck,
  HeartHandshake
} from 'lucide-react';

export const metadata = {
  title: '会社概要・運営元情報 | お墓参り・お掃除代行 ココロモウ',
  description: 'お墓参り・お掃除代行DXプラットフォーム「ココロモウ」を企画・運営するCreative System Design（クリエイティブ システム デザイン）の会社概要・代表者プロフィール・知的財産情報をご案内します。',
};

export default function CompanyPage() {
  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* パンくず・トップへ戻る */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-stone-600 hover:text-emerald-800 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>ココロモウ トップページへ戻る</span>
          </Link>
          <span className="text-xs font-bold text-stone-400 bg-stone-200/80 px-3 py-1 rounded-full">
            運営元情報
          </span>
        </div>

        {/* ヒーローセクション */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-stone-200 text-center space-y-4 relative overflow-hidden">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Creative System Design</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-stone-900 tracking-tight">
            会社概要・運営元情報
          </h1>
          <p className="text-stone-600 text-sm sm:text-base font-medium max-w-2xl mx-auto leading-relaxed">
            創造的な“こと”に自分と時間を活かすための仕組みづくり。<br className="hidden sm:inline" />
            現場の煩雑な業務を解放し、人と人が本当に向き合う大切な時間を取り戻します。
          </p>
        </div>

        {/* 開発者・代表メッセージ */}
        <div className="bg-gradient-to-br from-stone-900 via-stone-850 to-stone-900 text-white rounded-3xl p-8 sm:p-10 shadow-lg space-y-6">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs tracking-wider uppercase">
            <HeartHandshake className="w-4 h-4" />
            <span>Vision & Mission</span>
          </div>
          
          <h2 className="text-xl sm:text-2xl font-bold leading-snug">
            「本当に向き合いたいこと」に、あなたの時間を取り戻す。
          </h2>

          <div className="text-stone-300 text-xs sm:text-sm leading-relaxed space-y-4">
            <p>
              はじめまして。Creative System Design 代表の大塚 和宏と申します。<br />
              私は20年以上にわたり教育・医療現場にて教員・理学療法士として多くの人々と向き合ってきました。しかしその一方で、電話対応、書類作成、日程調整などの膨大な業務に忙殺され、本来最も大切にすべき「人と向き合う時間」が奪われていくもどかしさを強く経験してきました。
            </p>
            <p>
              「現場の負担をなくし、本当に価値のある仕事に集中できる環境をつくりたい」という想いから、独自アルゴリズムを用いた業務DXシステムや学校マネジメントシステム《INTEVE SCHOOL》（特許出願中・登録商標）の開発を続けてまいりました。
            </p>
            <p>
              このお墓参り・お掃除代行プラットフォーム<strong>「ココロモウ」</strong>も、まさにその想いから生まれました。高齢化や遠方居住で墓参に悩む施主様、取次ぎ電話やトラブル対応に追われる霊園・寺院管理事務所様、そして地元で確かな技術を持つ石材・清掃職人様が、オンラインと摩擦ゼロの仕組みによって安心・信頼でつながる世界を創造します。
            </p>
          </div>

          <div className="pt-4 border-t border-stone-700/80 flex items-center justify-between">
            <div>
              <span className="text-xs text-stone-400 block">Creative System Design 代表</span>
              <strong className="text-lg font-bold text-white">大塚 和宏</strong>
            </div>
            <span className="text-[11px] text-stone-400 bg-white/10 px-3 py-1 rounded-full border border-white/10">
              元・専門学校教員（教歴20年以上）／ 理学療法士
            </span>
          </div>
        </div>

        {/* 事業概要テーブル */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-stone-200 space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-stone-200">
            <Building2 className="w-5 h-5 text-emerald-800" />
            <h2 className="text-lg sm:text-xl font-black text-stone-900">
              事業概要（事業者情報）
            </h2>
          </div>

          <dl className="divide-y divide-stone-200 text-xs sm:text-sm">
            {/* 屋号 */}
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 items-center">
              <dt className="font-bold text-stone-600 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-700" />
                <span>屋号</span>
              </dt>
              <dd className="mt-1 sm:mt-0 font-bold text-stone-900 sm:col-span-2">
                Creative System Design（クリエイティブ システム デザイン）
              </dd>
            </div>

            {/* 代表者 */}
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 items-center">
              <dt className="font-bold text-stone-600 flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-700" />
                <span>代表者</span>
              </dt>
              <dd className="mt-1 sm:mt-0 sm:col-span-2 space-y-0.5">
                <div className="font-bold text-stone-900 text-base">大塚 和宏</div>
                <p className="text-xs text-stone-500">元・理学療法士養成校教員（教歴20年以上）／ 理学療法士</p>
              </dd>
            </div>

            {/* 所在地 */}
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 items-center">
              <dt className="font-bold text-stone-600 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-700" />
                <span>オフィス所在地</span>
              </dt>
              <dd className="mt-1 sm:mt-0 font-medium text-stone-900 sm:col-span-2">
                〒730-0051 広島県広島市中区大手町1-1-20 相生橋ビル7階 A号室
              </dd>
            </div>

            {/* 連絡先 */}
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 items-start">
              <dt className="font-bold text-stone-600 flex items-center gap-2 pt-1">
                <Phone className="w-4 h-4 text-emerald-700" />
                <span>連絡先</span>
              </dt>
              <dd className="mt-1 sm:mt-0 sm:col-span-2 space-y-1.5 font-medium text-stone-900">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-500 font-bold">お電話:</span>
                  <a href="tel:09041169476" className="font-bold text-emerald-800 hover:underline">
                    090-4116-9476
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-500 font-bold">メール:</span>
                  <a href="mailto:kokoromou@inteve-cloud.com" className="font-bold text-emerald-800 hover:underline">
                    kokoromou@inteve-cloud.com
                  </a>
                </div>
              </dd>
            </div>

            {/* Webサイト */}
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 items-start">
              <dt className="font-bold text-stone-600 flex items-center gap-2 pt-1">
                <Globe className="w-4 h-4 text-emerald-700" />
                <span>運営Webサイト</span>
              </dt>
              <dd className="mt-1 sm:mt-0 sm:col-span-2 space-y-1 text-xs">
                <div>
                  <span className="text-stone-500">ココロモウ公式:</span>{' '}
                  <a 
                    href="https://kokoromou.inteve-cloud.com/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-emerald-800 font-bold hover:underline"
                  >
                    https://kokoromou.inteve-cloud.com/
                  </a>
                </div>
                <div>
                  <span className="text-stone-500">コーポレートサイト:</span>{' '}
                  <a 
                    href="https://creativesd.net/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-emerald-800 font-bold hover:underline"
                  >
                    https://creativesd.net/
                  </a>
                </div>
              </dd>
            </div>

            {/* 知的財産権 */}
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 items-start bg-emerald-50/60 -mx-6 sm:-mx-10 px-6 sm:px-10 border-y border-emerald-100">
              <dt className="font-bold text-emerald-900 flex items-center gap-2 pt-1">
                <Award className="w-4 h-4 text-amber-600" />
                <span>知的財産権</span>
              </dt>
              <dd className="mt-1 sm:mt-0 sm:col-span-2 space-y-3 text-xs">
                <div className="flex items-start gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-extrabold text-[11px] shrink-0 mt-0.5">
                    特許出願中
                  </span>
                  <div>
                    <div className="font-bold text-stone-900">特願2025-265873</div>
                    <div className="text-stone-600 text-[11px] mt-0.5">
                      医療系養成校・実習管理システムおよび校務DXに関する独自アルゴリズム
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2 pt-2 border-t border-emerald-200/60">
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-extrabold text-[11px] shrink-0 mt-0.5">
                    登録商標
                  </span>
                  <div>
                    <div className="font-bold text-stone-900">「INTEVE SCHOOL」</div>
                    <div className="text-stone-600 text-[11px] mt-0.5">
                      特許庁 登録商標 第6994552号（区分：第9類・第42類）
                    </div>
                  </div>
                </div>
              </dd>
            </div>

            {/* 主な事業内容 */}
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 items-start">
              <dt className="font-bold text-stone-600 flex items-center gap-2 pt-1">
                <FileCheck className="w-4 h-4 text-emerald-700" />
                <span>事業内容</span>
              </dt>
              <dd className="mt-1 sm:mt-0 sm:col-span-2 text-stone-800 leading-relaxed space-y-1.5">
                <p>・お墓参り・お掃除代行DXプラットフォーム「ココロモウ」の開発・運用・マッチング事業</p>
                <p>・医療系・福祉系専門学校・大学向け教育マネジメントシステム「INTEVE SCHOOL」の開発・運用・保守</p>
                <p>・臨床実習ポータル「INTEVE LINK」の提供</p>
                <p>・AI即レス予約管理システム「CONNECT」の提供</p>
                <p>・現場（教育・医療・霊園等）のICT活用および業務効率化・自動化コンサルティング</p>
              </dd>
            </div>
          </dl>
        </div>

        {/* お問い合わせへの導線 */}
        <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-10 text-center space-y-4">
          <h3 className="text-xl sm:text-2xl font-black">
            システム導入・提携に関するお問い合わせ
          </h3>
          <p className="text-xs sm:text-sm text-stone-300 max-w-lg mx-auto leading-relaxed">
            霊園・寺院様でのココロモウ導入、作業代行パートナー様のご相談など、随時受け付けております。お気軽にご連絡ください。
          </p>
          <div className="pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-sm font-extrabold rounded-xl shadow-md transition cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              <span>お問い合わせ・ご相談フォームへ</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
