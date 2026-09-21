'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Building2, 
  ArrowLeft, 
  Printer, 
  CheckCircle2, 
  FileText, 
  ShieldCheck, 
  Users, 
  HelpCircle, 
  Sparkles,
  ClipboardList,
  Upload,
  AlertTriangle,
  PhoneCall,
  ExternalLink
} from 'lucide-react';

export default function CemeteryManualPage() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-stone-100 min-h-screen pb-24 text-stone-900 font-sans">
      {/* 印刷用CSS */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-manual,
          #printable-manual * {
            visibility: visible;
          }
          #printable-manual {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 10mm;
            background: white !important;
            color: #111 !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* トップナビゲーション（非印刷） */}
      <div className="no-print bg-stone-900 text-white border-b border-stone-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/partner-spec"
              className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-emerald-400 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>仕様書・マニュアル一覧へ</span>
            </Link>
            <span className="text-stone-600">|</span>
            <Link
              href="/cemetery"
              className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-emerald-400 transition"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>墓地管理会社ダッシュボードへ</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/vendor/manual"
              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium rounded-lg transition"
            >
              🧹 作業代行業者向けマニュアルを見る →
            </Link>
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>この説明書を印刷 / PDF保存</span>
            </button>
          </div>
        </div>
      </div>

      {/* ヘッダーバナー */}
      <div className="no-print bg-emerald-950 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-900/60 px-3 py-1 rounded-full mb-3">
            <Building2 className="w-3.5 h-3.5" />
            <span>墓地管理会社・霊園管理事務所様 専用ガイド</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            墓地管理会社様向け 操作説明書・ご利用マニュアル
          </h1>
          <p className="mt-3 text-stone-300 text-sm sm:text-base leading-relaxed max-w-3xl">
            本マニュアルは、寺院のご住職様・霊園管理者様・事務所スタッフ様が、ココロモウの管理画面を迷わず簡単にご活用いただくための公式操作ガイドです。提携代行業者の管理や契約書締結、作業進捗の確認手順を解説しています。
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-stone-400">
            <span className="bg-emerald-900/80 px-3 py-1 rounded-full text-emerald-200">対象: 墓地管理事務所 / 寺院役員 / 事務担当者様</span>
            <span className="bg-emerald-900/80 px-3 py-1 rounded-full text-emerald-200">文字サイズ: 大きめ（読みやすさ重視）</span>
          </div>
        </div>
      </div>

      {/* マニュアル本文コンテナ（印刷対象） */}
      <div id="printable-manual" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-white rounded-3xl shadow-sm border border-stone-200 p-6 sm:p-12 space-y-12">

          {/* 表紙見出し（印刷用） */}
          <div className="border-b-2 border-stone-900 pb-6">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              ココロモウ公式ガイド
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-2">
              墓地管理会社・霊園管理事務所様 操作マニュアル
            </h2>
            <p className="text-stone-600 text-sm mt-1">
              管轄霊園の作業管理・代行業者提携・契約書保管・施工写真確認ガイド
            </p>
          </div>

          {/* 目次 */}
          <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200">
            <h3 className="text-base font-bold text-stone-800 mb-3 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-emerald-700" />
              <span>目次（もくじ）</span>
            </h3>
            <ol className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm text-stone-700 font-medium">
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs flex items-center justify-center font-bold">1</span>
                <span>本システムでできること（役割と概要）</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs flex items-center justify-center font-bold">2</span>
                <span>管理画面へのログイン手順</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs flex items-center justify-center font-bold">3</span>
                <span>提携作業代行業者・便利屋さんの管理</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs flex items-center justify-center font-bold">4</span>
                <span>作業代行契約書の印刷・添付（重要）</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs flex items-center justify-center font-bold">5</span>
                <span>お墓参り・清掃代行の作業進捗と写真確認</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs flex items-center justify-center font-bold">6</span>
                <span>よくあるご質問・困ったときのお問い合わせ</span>
              </li>
            </ol>
          </div>

          {/* 第1章 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-stone-200 pb-2">
              <span className="w-8 h-8 rounded-full bg-emerald-700 text-white text-sm flex items-center justify-center font-extrabold">
                1
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900">
                本システムでできること（役割と概要）
              </h3>
            </div>
            <p className="text-stone-700 text-base leading-relaxed">
              ココロモウの管理画面では、霊園管理者様が日々の業務負担を増やすことなく、霊園内で実施される代行作業の品質と安全性を一元管理できます。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 space-y-2">
                <div className="text-emerald-800 font-bold text-base flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>霊園出入りの認可管理</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  霊園内へ出入りする石材店や便利屋さんを事前に認定。部外者の無断作業やトラブルを防止します。
                </p>
              </div>
              <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 space-y-2">
                <div className="text-emerald-800 font-bold text-base flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  <span>契約書・誓約書の電子保管</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  墓石破損時の賠償責任や出入り規約を担保する契約書を印刷し、署名後の書面を写真で添付保存できます。
                </p>
              </div>
              <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 space-y-2">
                <div className="text-emerald-800 font-bold text-base flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>施工完了写真の確認</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  職人が実施した作業前・作業後の写真と報告書をパソコンやスマホからいつでも閲覧確認できます。
                </p>
              </div>
            </div>
          </section>

          {/* 第2章 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-stone-200 pb-2">
              <span className="w-8 h-8 rounded-full bg-emerald-700 text-white text-sm flex items-center justify-center font-extrabold">
                2
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900">
                管理画面へのログイン手順
              </h3>
            </div>
            <div className="space-y-3 text-stone-700 text-base leading-relaxed">
              <p>
                1. インターネットブラウザ（Google Chrome, Safari, Edgeなど）で、以下のログイン画面を開きます。<br />
                <span className="font-mono bg-stone-100 px-3 py-1 rounded text-sm text-stone-800 border border-stone-300 inline-block mt-1">
                  https://kokoromou.com/cemetery/login
                </span>
              </p>
              <p>
                2. ご登録いただいた<strong>メールアドレス</strong>と<strong>パスワード</strong>を入力し、「ログイン」ボタンをクリックします。
              </p>
              <p>
                3. ログインが完了すると、貴霊園専用のダッシュボード画面が表示されます。
              </p>
            </div>
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-sm text-stone-600">
              💡 <strong>パスワードをお忘れの場合</strong>は、画面の「パスワード再設定」または本部サポート窓口までご連絡ください。
            </div>
          </section>

          {/* 第3章 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-stone-200 pb-2">
              <span className="w-8 h-8 rounded-full bg-emerald-700 text-white text-sm flex items-center justify-center font-extrabold">
                3
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900">
                提携作業代行業者・便利屋さんの管理
              </h3>
            </div>
            <p className="text-stone-700 text-base leading-relaxed">
              貴霊園に出入りして作業を行う業者の一覧を確認できます。地元の信頼できる石材店や、既存のお付き合いのある業者様を自由に追加・解除できます。
            </p>
            <div className="space-y-3">
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-1.5">
                <span className="font-bold text-stone-900 text-base">① 新しい代行業者・便利屋さんを追加する場合</span>
                <p className="text-sm text-stone-600">
                  「➕ 新規代行業者・便利屋さんを追加」ボタンを押します。屋号・代表者名・お電話番号・対応エリアを入力し、安全確認にチェックを入れて登録します。
                </p>
              </div>
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-1.5">
                <span className="font-bold text-stone-900 text-base">② 提携の追加・解除をする場合</span>
                <p className="text-sm text-stone-600">
                  「🤝 提携の追加・解除」ボタンを押すと、登録されている全業者の中から、貴霊園への出入りを認可する業者にチェックを付け外しできます。
                </p>
              </div>
            </div>
          </section>

          {/* 第4章（最重要） */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-stone-200 pb-2">
              <span className="w-8 h-8 rounded-full bg-amber-600 text-white text-sm flex items-center justify-center font-extrabold">
                4
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900">
                作業代行契約書の印刷・添付（極めて重要）
              </h3>
            </div>
            <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl text-amber-950 text-sm space-y-2">
              <div className="flex items-center gap-2 font-bold text-base">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <span>なぜ契約書が必要なのか？</span>
              </div>
              <p className="leading-relaxed">
                作業代行業者が作業中に<strong>墓石の角を欠けさせたり、隣の区画を汚損した場合の賠償責任の所在（業者自身の一次責任）</strong>や、霊園内の水場・ゴミ処理ルールを法的に担保するため、作業代行業者とは必ず事前に契約書を締結します。
              </p>
            </div>

            <div className="space-y-4 text-stone-700 text-base">
              <h4 className="font-bold text-lg text-stone-900">【契約書の手順（3ステップ）】</h4>
              <ol className="space-y-3">
                <li className="bg-stone-50 p-4 rounded-xl border border-stone-200">
                  <strong>ステップ1：契約書を印刷する</strong><br />
                  <span className="text-sm text-stone-600">
                    業者カード内の「📄 雛形印刷」ボタンを押します。貴霊園名と業者の屋号があらかじめ印字されたA4サイズの契約書が開きますので、「🖨️ PDF保存・印刷する」を押して紙に印刷します。
                  </span>
                </li>
                <li className="bg-stone-50 p-4 rounded-xl border border-stone-200">
                  <strong>ステップ2：業者と記名押印を交わす</strong><br />
                  <span className="text-sm text-stone-600">
                    印刷した契約書を業者に渡し、第1条〜第7条の内容を確認の上、甲（霊園）と乙（業者）双方で住所・氏名の記入と押印を行います。
                  </span>
                </li>
                <li className="bg-stone-50 p-4 rounded-xl border border-stone-200">
                  <strong>ステップ3：記入済み契約書を画面に貼り付ける（添付）</strong><br />
                  <span className="text-sm text-stone-600">
                    捺印された契約書をスマホカメラで撮影（またはスキャナーでPDF化）し、業者カードの「📎 記入・捺印済み契約書を添付する」ボタンから選択して保存します。これで画面上に「✅ 締結済み」と表示され、いつでも確認できます。
                  </span>
                </li>
              </ol>
            </div>
          </section>

          {/* 第5章 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-stone-200 pb-2">
              <span className="w-8 h-8 rounded-full bg-emerald-700 text-white text-sm flex items-center justify-center font-extrabold">
                5
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900">
                お墓参り・清掃代行の作業進捗と写真確認
              </h3>
            </div>
            <p className="text-stone-700 text-base leading-relaxed">
              ダッシュボードの「3. 管轄霊園のお申込み・作業進捗一覧」にて、現在進行中の案件や完了した案件の状況を確認できます。
            </p>
            <div className="space-y-2 text-sm text-stone-700 bg-stone-50 p-4 rounded-2xl border border-stone-200">
              <div>・<strong>未着手 / 準備中</strong>：施主様からの申込みを受付し、担当業者が作業日程を調整中の段階です。</div>
              <div>・<strong>作業完了（報告提出済）</strong>：職人が現場でお墓参り・清掃を実施し、完了報告書と写真を提出した段階です。</div>
              <div>・<strong>完了写真の閲覧</strong>：「作業写真・報告書を見る」ボタンを押すと、作業前後の写真（正面刻印、建立者名、清掃後、供花・お線香）を拡大表示して仕上がりを確認できます。</div>
            </div>
          </section>

          {/* 第6章 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-stone-200 pb-2">
              <span className="w-8 h-8 rounded-full bg-emerald-700 text-white text-sm flex items-center justify-center font-extrabold">
                6
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900">
                よくあるご質問・お問い合わせ
              </h3>
            </div>
            <div className="space-y-3 text-sm text-stone-700">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="font-bold text-stone-900 block mb-1">Q. パソコンが苦手な職員でも使えますか？</span>
                <p className="text-stone-600">A. はい。文字サイズを大きくし、ボタン操作だけで完結するように設計されています。スマートフォンやタブレットの画面からもそのままご利用いただけます。</p>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="font-bold text-stone-900 block mb-1">Q. 契約書の添付ファイルはどんな形式が使えますか？</span>
                <p className="text-stone-600">A. PDFファイルはもちろん、スマートフォンで撮影した写真（JPGまたはPNG）をそのまま選択してアップロードいただけます。</p>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="font-bold text-stone-900 block mb-1">Q. 施主様からの売上や手数料はどうなりますか？</span>
                <p className="text-stone-600">A. お客様のクレジットカード決済完了後、Stripe Connectの自動送金システムにより、代行業者様および管理会社様の手数料が安全に自動振込されます。</p>
              </div>
            </div>

            <div className="mt-6 p-5 bg-emerald-50 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="font-bold text-emerald-950 text-base block">ココロモウ 本部サポート窓口</span>
                <span className="text-xs text-stone-600">操作方法のご不明点や契約書の取り交わしについて、お気軽にご相談ください。</span>
              </div>
              <div className="text-right shrink-0">
                <span className="text-lg font-extrabold text-emerald-800">📞 089-900-8800</span>
                <span className="text-xs text-stone-500 block">平日 9:00〜18:00（土日祝対応）</span>
              </div>
            </div>
          </section>

          {/* フッター戻りリンク（非印刷） */}
          <div className="no-print pt-6 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/cemetery"
              className="px-5 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-sm transition shadow-sm"
            >
              ← 墓地管理会社の管理画面へ戻る
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/partner-spec"
                className="text-xs text-stone-600 hover:text-emerald-700 underline font-medium"
              >
                技術仕様書を見る
              </Link>
              <Link
                href="/vendor/manual"
                className="text-xs text-stone-600 hover:text-emerald-700 underline font-medium"
              >
                作業代行業者向けマニュアルを見る
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
