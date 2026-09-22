import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  CreditCard, 
  Database, 
  Smartphone, 
  Lock, 
  CheckCircle2, 
  ArrowLeft, 
  FileText, 
  RefreshCw, 
  Layers, 
  Server, 
  Clock, 
  AlertCircle,
  Building2,
  Cpu,
  BookOpen,
  Briefcase,
  Sparkles
} from 'lucide-react';

export const metadata = {
  title: '提携業者様向け 技術仕様・システム概要書 | ココロモウ（Kokoromou）',
  description: '提携石材店・管理会社・作業代行者様向けのシステムアーキテクチャ、Stripe Connect自動決済送金、セキュリティおよび運用フローの解説書。',
};

export default function PartnerSpecPage() {
  return (
    <div className="bg-stone-50 min-h-screen pb-24 text-stone-900">
      {/* ページ上部バナー */}
      <div className="bg-stone-900 text-white border-b border-stone-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-3 tracking-wider uppercase">
            <Cpu className="w-4 h-4" />
            <span>Technical Architecture & Partner Portal</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            ココロモウ 提携パートナー様向け 総合ガイド・技術仕様書
          </h1>
          <p className="mt-4 text-stone-300 text-sm sm:text-base leading-relaxed max-w-3xl">
            本ポータルは、ココロモウと提携される寺院霊園管理会社様・石材店様・清掃作業代行業者様に向けて、各担当者別の操作マニュアルおよびシステムの安全性・Stripe決済送金・セキュリティ仕様書を提供する公式ドキュメントセンターです。
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-stone-400">
            <span className="bg-stone-800 px-3 py-1 rounded-full border border-stone-700">文書バージョン: 1.0 (2026年9月版)</span>
            <span className="bg-stone-800 px-3 py-1 rounded-full border border-stone-700">対象: 墓地管理事務所様 / 作業代行業者様 / 技術担当者様</span>
            <span className="text-emerald-400 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" /> 各種マニュアル印刷・PDF保存対応
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-emerald-700 font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>サービスサイトへ戻る</span>
          </Link>
        </div>

        {/* 📚 提携パートナー向け 3つのドキュメント切り替えカード */}
        <div className="mb-10">
          <h2 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-3">
            提携パートナー様向け ドキュメント＆操作マニュアル一覧
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. 墓地管理会社様向けマニュアル */}
            <Link
              href="/cemetery/manual"
              className="p-5 rounded-2xl bg-white hover:bg-emerald-50/50 border-2 border-emerald-600/30 hover:border-emerald-600 shadow-sm transition group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    操作説明書
                  </span>
                  <span className="text-xs text-emerald-700 font-semibold group-hover:translate-x-0.5 transition-transform">
                    開く →
                  </span>
                </div>
                <div className="flex items-center gap-2 font-extrabold text-stone-900 text-lg mb-2">
                  <Building2 className="w-5 h-5 text-emerald-700 shrink-0" />
                  <span>墓地管理会社様向け 操作説明書</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  霊園管理者様向け。代行業者の追加管理、作業契約書・誓約書の印刷・添付保管、施工完了写真の確認手順を大きな文字で解説。
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                <span>📄 A4印刷・PDF保存対応</span>
              </div>
            </Link>

            {/* 2. 作業代行業者様向けマニュアル */}
            <Link
              href="/vendor/manual"
              className="p-5 rounded-2xl bg-white hover:bg-blue-50/50 border-2 border-blue-600/30 hover:border-blue-600 shadow-sm transition group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-full">
                    実務ガイド
                  </span>
                  <span className="text-xs text-blue-700 font-semibold group-hover:translate-x-0.5 transition-transform">
                    開く →
                  </span>
                </div>
                <div className="flex items-center gap-2 font-extrabold text-stone-900 text-lg mb-2">
                  <Briefcase className="w-5 h-5 text-blue-700 shrink-0" />
                  <span>作業代行業者様向け 業務手順書</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  職人・便利屋様向け。現場での同姓誤認防止（正面文字・建立者名照合）、前後写真撮影、報告書提出、Stripe自動入金手順を解説。
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-blue-700 font-bold flex items-center gap-1">
                <span>📱 スマホ対応・写真撮影ガイド</span>
              </div>
            </Link>

            {/* 3. 技術仕様書（現在地） */}
            <div className="p-5 rounded-2xl bg-stone-900 text-white border-2 border-stone-800 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-400 bg-stone-800 px-2.5 py-0.5 rounded-full border border-stone-700">
                    現在のページ
                  </span>
                  <span className="text-xs text-emerald-400 font-semibold">
                    閲覧中 ●
                  </span>
                </div>
                <div className="flex items-center gap-2 font-extrabold text-white text-lg mb-2">
                  <Cpu className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>システム概要・技術仕様書</span>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  技術・経営担当者様向け。Stripe Connect決済送金アーキテクチャ、PCI-DSS準拠セキュリティ、クラウド基盤仕様の完全解説。
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-stone-800 text-[11px] text-stone-400 flex items-center gap-1">
                <span>🔒 セキュリティ＆アーキテクチャ</span>
              </div>
            </div>
          </div>
        </div>

        {/* 要約サマリーカード */}
        <div className="bg-emerald-900/10 border border-emerald-700/20 rounded-2xl p-6 mb-12">
          <h2 className="text-base font-bold text-emerald-950 flex items-center gap-2 mb-3">
            <Building2 className="w-5 h-5 text-emerald-700" />
            <span>提携事業者様にとっての安心・成長ポイント（3分まとめ）</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-stone-700">
            <div className="bg-white p-4 rounded-xl border border-emerald-900/10 shadow-sm">
              <span className="font-bold text-emerald-800 block mb-1">① 請求・回収リスクゼロ</span>
              <p className="leading-relaxed">
                施主が決済した時点で売上が確定。手数料（20%）控除後の代金がStripeから貴社口座へ自動振込されます。
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-emerald-900/10 shadow-sm">
              <span className="font-bold text-emerald-800 block mb-1">② 口座番号・カードの非保持</span>
              <p className="leading-relaxed">
                貴社の振込口座情報は世界基準（PCI-DSS Lv1）のStripeが直接管理。本アプリ側で金融情報を保持・流出させるリスクはありません。
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-emerald-900/10 shadow-sm">
              <span className="font-bold text-emerald-800 block mb-1">③ アプリインストール不要</span>
              <p className="leading-relaxed">
                スマートフォンやタブレットの標準ブラウザ（Safari/Chrome）から直接写真アップロードと報告が行えます。
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-emerald-900/10 shadow-sm">
              <span className="font-bold text-emerald-800 block mb-1">④ 永代供養・墓じまい連携</span>
              <p className="leading-relaxed">
                遠方施主との継続的な接点が生まれ、宝塔寺霊園等の永代供養・送骨・墓じまい相談への自然な送客に繋がります。
              </p>
            </div>
          </div>
        </div>

        {/* 本編 */}
        <div className="space-y-12">
          {/* 1. システム全体構成 */}
          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-stone-900">システムアーキテクチャ概要</h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-6">
              ココロモウは、米Vercel社の高信頼エッジクラウド基盤と、Google Cloud Platform（Firebase）、米Stripe社の決済金融インフラをシームレスに結合した堅牢なクラウドネイティブ構成を採用しています。自社サーバーを持たないサーバーレス構成により、サーバーダウンや脆弱性攻撃に対する高い耐性を備えています。
            </p>

            <div className="bg-stone-50 rounded-xl p-5 border border-stone-200 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-xs">
                  <div className="flex items-center gap-2 font-bold text-stone-800 mb-1">
                    <Server className="w-4 h-4 text-emerald-600" />
                    <span>フロントエンド / API</span>
                  </div>
                  <p className="text-stone-500 mb-2">Next.js 16 (App Router) / Vercel</p>
                  <p className="text-stone-600">国内高速エッジ配信により、現場のスマートフォンからでも瞬時に読み込み・報告が完了します。</p>
                </div>

                <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-xs">
                  <div className="flex items-center gap-2 font-bold text-stone-800 mb-1">
                    <Database className="w-4 h-4 text-blue-600" />
                    <span>データベース・認証</span>
                  </div>
                  <p className="text-stone-500 mb-2">Google Cloud (Firestore / Auth)</p>
                  <p className="text-stone-600">99.999%の可用性を誇るマルチリージョンNoSQL。暗号化された安全なデータ保護体制。</p>
                </div>

                <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-xs">
                  <div className="flex items-center gap-2 font-bold text-stone-800 mb-1">
                    <CreditCard className="w-4 h-4 text-indigo-600" />
                    <span>決済・自動送金基盤</span>
                  </div>
                  <p className="text-stone-500 mb-2">Stripe Checkout & Connect</p>
                  <p className="text-stone-600">国際金融水準のPCI-DSS Level 1に準拠。自動分配送金（Destination Charges）に対応。</p>
                </div>
              </div>
            </div>
          </section>

          {/* 2. 決済・売上自動分配の仕組み (Stripe Connect) */}
          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-stone-900">
                Stripe Connect による売上自動分配（送金）の仕組み
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-6">
              提携業者様が最も気にされる「代金の受取」「手数料の透明性」「未回収リスク」を解消するため、世界大手マーケットプレイス等で標準採用されている **Stripe Connect（Destination Charges 方式）** を導入しています。
            </p>

            {/* 送金フロー図解 */}
            <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200 mb-6">
              <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-4 text-center">
                【Destination Charges 自動決済フロー図】
              </h3>
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
                {/* 施主 */}
                <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs text-center w-full md:w-1/4">
                  <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center mx-auto mb-2 font-bold">
                    施主
                  </div>
                  <span className="font-bold text-stone-900 block">代金Web決済</span>
                  <span className="text-[11px] text-emerald-700 font-semibold block mt-1">¥14,800（例）</span>
                  <span className="text-[10px] text-stone-400">カード事前即時決済</span>
                </div>

                <div className="text-stone-400 rotate-90 md:rotate-0 font-bold">▶</div>

                {/* プラットフォーム */}
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 text-center w-full md:w-2/5">
                  <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center mx-auto mb-2">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-emerald-950 block">Stripe Connect 自動分配</span>
                  <div className="mt-2 text-[11px] space-y-1 bg-white p-2 rounded-lg border border-emerald-100 text-left">
                    <div className="flex justify-between text-stone-600">
                      <span>手数料 (20%):</span>
                      <span className="font-bold text-stone-700">¥2,960 (運営費)</span>
                    </div>
                    <div className="flex justify-between text-emerald-800 font-bold border-t border-stone-100 pt-1">
                      <span>提携業者送金額 (80%):</span>
                      <span>¥11,840</span>
                    </div>
                  </div>
                </div>

                <div className="text-stone-400 rotate-90 md:rotate-0 font-bold">▶</div>

                {/* 提携業者 */}
                <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs text-center w-full md:w-1/4">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center mx-auto mb-2 font-bold">
                    貴社
                  </div>
                  <span className="font-bold text-stone-900 block">提携業者 口座</span>
                  <span className="text-[11px] text-blue-700 font-semibold block mt-1">¥11,840 入金</span>
                  <span className="text-[10px] text-stone-400">Stripeより直接自動振込</span>
                </div>
              </div>
            </div>

            {/* 技術的メリット */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                <span className="font-bold text-stone-900 block mb-1">■ 事前決済による未回収ゼロの保証</span>
                <p className="text-stone-600 leading-relaxed">
                  現地での作業開始前に施主のクレジットカード決済が完了しているため、「作業したのに代金が支払われない」「請求書を発行して督促する」といった代金回収リスクや経理負担が一切発生しません。
                </p>
              </div>
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                <span className="font-bold text-stone-900 block mb-1">■ 金融口座情報の完全な分離・保護</span>
                <p className="text-stone-600 leading-relaxed">
                  貴社の受取銀行口座情報は、Stripeが提供する本人確認ポータル（Stripe Express）経由で直接登録されます。ココロモウのサーバーには口座番号が一切保存されないため、情報漏洩リスクがありません。
                </p>
              </div>
            </div>
          </section>

          {/* 3. 【新機能】施主名簿CSV一括連携 ＆ パーソナライズ案内DM発行アーキテクチャ */}
          <section className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-emerald-600/30 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[11px] font-black px-4 py-1 rounded-bl-xl shadow-xs">
              ★ 最強オンボーディング機能
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-sm">
                3
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-stone-900">
                  施主名簿CSV一括連携 ＆ パーソナライズ案内DM発行アーキテクチャ
                </h2>
                <span className="text-xs text-stone-500 font-medium">
                  離脱率を極小化し、施主様の成約率を最大化するオンボーディング自動化
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-6">
              代行サービスで最も離脱が発生しやすい「区画番号が分からない」「墓石の写真撮影・アップロードが面倒」という課題を根本解決。霊園の既存台帳CSVをインポートするだけで、施主ごとに写真・区画情報が事前紐付けされた個別案内状（ハガキ・A4封書）を瞬時に一括印刷できます。
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs mb-6">
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2">
                <span className="font-extrabold text-emerald-800 text-xs block">① CSV一括インポート</span>
                <p className="text-stone-700 leading-relaxed">
                  霊園管理画面から施主名簿（お名前・住所・区画番号・電話番号）のCSVを取り込むと、システムが施主アカウントとお墓情報をバックグラウンドで自動一括生成。
                </p>
              </div>
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2">
                <span className="font-extrabold text-emerald-800 text-xs block">② パーソナライズDM自動生成</span>
                <p className="text-stone-700 leading-relaxed">
                  宛名面（料金別納・7桁郵便枠）と案内面（個別QRコード・初期PW・お墓写真・区画番号）が完全に揃ったハガキおよびA4封書用紙をワンクリックで一括印刷。
                </p>
              </div>
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2">
                <span className="font-extrabold text-emerald-800 text-xs block">③ QR読み取りで即注文</span>
                <p className="text-stone-700 leading-relaxed">
                  施主様がスマホでQRコードを読み取ると、すでに自分のお墓写真と区画番号がセットされた画面が開きます。あとは日付とプランを選ぶだけで完了！
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">提携パートナー様へのメリット</strong>
                <span>
                  施主様の「登録の面倒くささ」を霊園側で事前に解消してあげることで、チラシ単体配布と比較して数倍〜数十倍のコンバージョン率を達成。安定した代行依頼の継続受注に繋がります。
                </span>
              </div>
            </div>
          </section>

          {/* 4. 業務・データフロー */}
          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                4
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-stone-900">業務フローとステータス連携</h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-6">
              注文発生から代行完了・写真レポート納品までのステータスはFirestoreによりリアルタイムに同期されます。
            </p>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-stone-50 border border-stone-200">
                <span className="w-6 h-6 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center font-bold shrink-0">1</span>
                <div>
                  <span className="font-bold text-stone-900 block text-sm">注文受付 & 決済完了（Status: paid）</span>
                  <p className="text-stone-600 mt-1">
                    施主がWeb上でプラン・霊園・お墓の区画番号を入力し、Stripeで決済。Webhookにより注文が確定し、提携業者へメール/通知が届きます。
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-stone-50 border border-stone-200">
                <span className="w-6 h-6 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center font-bold shrink-0">2</span>
                <div>
                  <span className="font-bold text-stone-900 block text-sm">日程調整 & 現地作業（Status: in_progress）</span>
                  <p className="text-stone-600 mt-1">
                    天候等を考慮して作業日を確定。現地にて作業前（Before）の写真をスマートフォンで撮影した上で、清掃・お参りを実施します。
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-stone-50 border border-stone-200">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">3</span>
                <div>
                  <span className="font-bold text-emerald-950 block text-sm">写真レポート提出（Status: report_submitted）</span>
                  <p className="text-stone-600 mt-1">
                    作業完了後、お花・お線香をお供えした作業後（After）写真をアップロードし、作業メモ・墓石の点検所見を入力して「提出」ボタンをタップ。施主へレポートが納品されます。
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-stone-50 border border-stone-200">
                <span className="w-6 h-6 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center font-bold shrink-0">4</span>
                <div>
                  <span className="font-bold text-stone-900 block text-sm">施主確認 & 取引完了（Status: completed）</span>
                  <p className="text-stone-600 mt-1">
                    施主がレポートを確認し完了。Stripeの入金サイクル（例: 週次または月次）に従い、提携業者様の銀行口座へ自動送金が行われます。
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 5. 現場での操作性・端末要件 */}
          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                5
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-stone-900">現場での操作性・端末環境</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-stone-600">
              <div className="space-y-3">
                <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span>アプリ不要・スマートフォンブラウザで完結</span>
                </div>
                <p className="leading-relaxed">
                  App StoreやGoogle Playからの専用アプリのダウンロード・更新作業は一切不要です。
                  現場のスタッフ様がお持ちのスマートフォン（iPhone / Android）の標準ブラウザで専用URLを開くだけで、カメラ連動の写真撮影・アップロードが可能です。
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
                  <RefreshCw className="w-4 h-4 text-emerald-600" />
                  <span>通信負荷の自動最適化</span>
                </div>
                <p className="leading-relaxed">
                  霊園や山間部など、電波の弱い環境でも快適に動作するよう、撮影写真のクライアント側リサイズ・高効率圧縮をサポート。大容量データによる通信制限の心配がありません。
                </p>
              </div>
            </div>
          </section>

          {/* 6. セキュリティ・情報保護基準 */}
          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                6
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-stone-900">セキュリティ & 個人情報保護基準</h2>
            </div>

            <div className="space-y-4 text-xs text-stone-600">
              <div className="flex items-start gap-3">
                <Lock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-stone-800">全通信の暗号化（HTTPS / TLS 1.3）</span>
                  <p className="mt-0.5">施主のお名前、お墓の区画、写真レポートデータなど、すべての通信は最新のTLS暗号化で保護されています。</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-stone-800">厳格なアクセス制御（最小権限の原則）</span>
                  <p className="mt-0.5">担当業者様には、自社に割り当てられた案件情報のみが表示され、他業者の注文情報や売上データが閲覧されることはありません。</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Building2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-stone-800">お墓・ご先祖様情報の取り扱い</span>
                  <p className="mt-0.5">お墓の写真や位置情報は作業代行および施主へのご報告目的のみに限定され、無断で一般公開されることはありません。</p>
                </div>
              </div>
            </div>
          </section>

          {/* 7. よくある質問 (FAQ) */}
          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                7
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-stone-900">提携業者様からの技術・運用FAQ</h2>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                <span className="font-bold text-stone-900 block mb-1">
                  Q. 入金サイクル（振込頻度）はどのようになりますか？
                </span>
                <p className="text-stone-600 leading-relaxed">
                  A. Stripe Connectの設定により、**週次（毎週○曜日）** または **月次（月末締め翌月払い）**、さらには **ローリング入金（作業完了から一定日数後）** を選択可能です。貴社の資金繰り方針に合わせて設定できます。
                </p>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                <span className="font-bold text-stone-900 block mb-1">
                  Q. 悪天候等で作業日が延期になった場合の扱いはどうなりますか？
                </span>
                <p className="text-stone-600 leading-relaxed">
                  A. 注文ステータスは有効のまま維持され、提携業者ポータルから予定日を更新できます。施主決済は事前に完了しているため、天候回復後に作業を実施し、レポートを提出すれば問題なく送金が行われます。
                </p>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                <span className="font-bold text-stone-900 block mb-1">
                  Q. 万が一、施主都合でキャンセルされた場合の返金処理はどうなりますか？
                </span>
                <p className="text-stone-600 leading-relaxed">
                  A. StripeのDestination Charges仕様に基づき、キャンセル時には決済金額および手数料がStripeシステム上で一括自動返金されます。提携業者様側で個別に送金・振込手続きを行う必要はありません。
                </p>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                <span className="font-bold text-stone-900 block mb-1">
                  Q. 既存の自社業務ソフトや顧客台帳と連携できますか？
                </span>
                <p className="text-stone-600 leading-relaxed">
                  A. はい。注文データおよびレポートデータは標準的なJSON形式のREST APIとして提供されており、将来的な自社基幹システムやCRMとのWebhook連携・データエクスポート（CSV等）への拡張が容易な設計となっております。
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* ページ下部CTA */}
        <div className="mt-12 text-center pt-8 border-t border-stone-200">
          <p className="text-xs text-stone-500 mb-4">
            ご不明点や提携に関する技術的なお問い合わせは、プラットフォーム技術開発チームまでお気軽にご連絡ください。
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/"
              className="bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-semibold px-5 py-2.5 rounded-xl transition-colors"
            >
              サービスサイトへ戻る
            </Link>
            <Link
              href="/vendor/reports/order_sample_001"
              className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-colors"
            >
              レポート画面デモを体験する
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
