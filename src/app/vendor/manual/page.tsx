'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Briefcase, 
  ArrowLeft, 
  Printer, 
  CheckCircle2, 
  Camera, 
  Sparkles, 
  AlertTriangle, 
  Clock, 
  CreditCard, 
  ClipboardCheck, 
  MapPin, 
  PhoneCall,
  ShieldCheck,
  Smartphone
} from 'lucide-react';

export default function VendorManualPage() {
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
              className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-blue-400 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>仕様書・マニュアル一覧へ</span>
            </Link>
            <span className="text-stone-600">|</span>
            <Link
              href="/vendor"
              className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-blue-400 transition"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>作業代行業者ダッシュボードへ</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/cemetery/manual"
              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium rounded-lg transition"
            >
              🏛️ 墓地管理会社向けマニュアルを見る →
            </Link>
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>この説明書を印刷 / PDF保存</span>
            </button>
          </div>
        </div>
      </div>

      {/* ヘッダーバナー */}
      <div className="no-print bg-blue-950 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 bg-blue-900/60 px-3 py-1 rounded-full mb-3">
            <Briefcase className="w-3.5 h-3.5" />
            <span>作業代行業者・職人・便利屋様 専用ガイド</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            作業代行業者様向け 業務手順・操作説明書
          </h1>
          <p className="mt-3 text-stone-300 text-sm sm:text-base leading-relaxed max-w-3xl">
            本マニュアルは、現場でお墓参り・清掃代行業務を実施される提携業者・職人・便利屋様向けの実務ガイドです。案件の確認方法、現場での同姓誤認防止ルール、写真撮影・完了報告の提出、報酬の受取方法までをわかりやすく解説しています。
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-stone-400">
            <span className="bg-blue-900/80 px-3 py-1 rounded-full text-blue-200">対象: 石材店職人 / 清掃代行スタッフ / 個人事業主・便利屋様</span>
            <span className="bg-blue-900/80 px-3 py-1 rounded-full text-blue-200">スマートフォン対応 / 写真撮影実務ガイド</span>
          </div>
        </div>
      </div>

      {/* マニュアル本文コンテナ（印刷対象） */}
      <div id="printable-manual" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-white rounded-3xl shadow-sm border border-stone-200 p-6 sm:p-12 space-y-12">

          {/* 表紙見出し（印刷用） */}
          <div className="border-b-2 border-stone-900 pb-6">
            <span className="text-xs font-bold text-blue-800 bg-blue-100 px-3 py-1 rounded-full">
              ココロモウ公式実務ガイド
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-2">
              作業代行業者様 業務手順・操作説明書
            </h2>
            <p className="text-stone-600 text-sm mt-1">
              受注確認・墓石特定ルール・写真撮影・完了報告提出・報酬受取マニュアル
            </p>
          </div>

          {/* 目次 */}
          <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200">
            <h3 className="text-base font-bold text-stone-800 mb-3 flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-blue-700" />
              <span>目次（もくじ）</span>
            </h3>
            <ol className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm text-stone-700 font-medium">
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-700 text-white text-xs flex items-center justify-center font-bold">1</span>
                <span>業務全体の流れ（受注から報酬受取まで）</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-700 text-white text-xs flex items-center justify-center font-bold">2</span>
                <span>業者専用画面へのログイン方法</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-700 text-white text-xs flex items-center justify-center font-bold">3</span>
                <span>ご依頼案件の確認と施主様のご要望</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-600 text-white text-xs flex items-center justify-center font-bold">4</span>
                <span>現場での墓石特定と写真撮影（最重要）</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-700 text-white text-xs flex items-center justify-center font-bold">5</span>
                <span>作業完了報告書の提出手順</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-700 text-white text-xs flex items-center justify-center font-bold">6</span>
                <span>売上・報酬の自動送金（Stripe Connect）</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-700 text-white text-xs flex items-center justify-center font-bold">7</span>
                <span>霊園作業マナー・安全注意事項</span>
              </li>
            </ol>
          </div>

          {/* 第1章 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-stone-200 pb-2">
              <span className="w-8 h-8 rounded-full bg-blue-700 text-white text-sm flex items-center justify-center font-extrabold">
                1
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900">
                業務全体の流れ（受注から報酬受取まで）
              </h3>
            </div>
            <p className="text-stone-700 text-base leading-relaxed">
              ココロモウでの作業代行業務は、以下のシンプルなステップで完了します。スマホ1台で現場からすべての報告が完結します。
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-center space-y-1">
                <span className="text-xs font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full">STEP 1</span>
                <div className="text-xl font-bold mt-1">案件確認</div>
                <p className="text-xs text-stone-600">施主様の墓石情報・区画・ご要望を確認</p>
              </div>
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-center space-y-1">
                <span className="text-xs font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full">STEP 2</span>
                <div className="text-xl font-bold mt-1">現場特定・施工</div>
                <p className="text-xs text-stone-600">正面文字と建立者名を確認して写真撮影・清掃</p>
              </div>
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-center space-y-1">
                <span className="text-xs font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full">STEP 3</span>
                <div className="text-xl font-bold mt-1">報告書提出</div>
                <p className="text-xs text-stone-600">前後の写真をアップロードして完了送信</p>
              </div>
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-center space-y-1">
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">STEP 4</span>
                <div className="text-xl font-bold mt-1">売上入金</div>
                <p className="text-xs text-stone-600">代金の80%が自動送金で銀行口座へ着金</p>
              </div>
            </div>
          </section>

          {/* 第2章 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-stone-200 pb-2">
              <span className="w-8 h-8 rounded-full bg-blue-700 text-white text-sm flex items-center justify-center font-extrabold">
                2
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900">
                業者専用画面へのログイン方法
              </h3>
            </div>
            <div className="space-y-3 text-stone-700 text-base leading-relaxed">
              <p>
                スマートフォンまたはパソコンのブラウザで、以下の作業代行業者専用ログイン画面を開きます。<br />
                <span className="font-mono bg-stone-100 px-3 py-1 rounded text-sm text-stone-800 border border-stone-300 inline-block mt-1">
                  https://kokoromou.com/vendor/login
                </span>
              </p>
              <p>
                ご登録の<strong>メールアドレス</strong>と<strong>パスワード</strong>を入力して「ログイン」をタップします。
              </p>
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-sm text-blue-950 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-blue-600 shrink-0" />
                <span>スマホのホーム画面に「ブックマーク追加（ショートカット作成）」しておくと、現場からワンタップで開けて大変便利です。</span>
              </div>
            </div>
          </section>

          {/* 第3章 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-stone-200 pb-2">
              <span className="w-8 h-8 rounded-full bg-blue-700 text-white text-sm flex items-center justify-center font-extrabold">
                3
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900">
                ご依頼案件の確認と施主様のご要望
              </h3>
            </div>
            <p className="text-stone-700 text-base leading-relaxed">
              ログイン後の画面に、貴社が担当する依頼案件が一覧表示されます。作業に向かう前に、以下の項目を必ずチェックしてください。
            </p>
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2 text-sm text-stone-700">
              <div>・<strong>霊園名と所在地</strong>：作業対象の霊園・墓地名とアクセス場所</div>
              <div>・<strong>区画番号・目印</strong>：墓所の区画（例: 東3区 12番地、大きな桜の木の裏手など）</div>
              <div>・<strong>ご希望日・プラン内容</strong>：基本清掃、草刈り、お花のお供え、基数（複数基か）</div>
              <div>・<strong>施主様のご要望・備考</strong>：「祖父が好きだったお酒をお供えしてほしい」「雑草を根から抜いてほしい」など</div>
            </div>
          </section>

          {/* 第4章（最重要） */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-stone-200 pb-2">
              <span className="w-8 h-8 rounded-full bg-amber-600 text-white text-sm flex items-center justify-center font-extrabold">
                4
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900">
                現場での墓石特定と写真撮影（★最重要ルール）
              </h3>
            </div>
            <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl text-amber-950 text-sm space-y-2">
              <div className="flex items-center gap-2 font-bold text-base">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <span>同姓のお墓の「間違い施工」を絶対に防ぐために</span>
              </div>
              <p className="leading-relaxed">
                霊園には同じ苗字（例：「佐藤家」「山本家」）のお墓が何基も並んでいることがあります。
                <strong>正面の文字だけを見て作業を開始することは絶対にしないでください。</strong>
              </p>
            </div>

            <div className="space-y-4 text-stone-700 text-base">
              <h4 className="font-bold text-lg text-stone-900">【作業開始前の2重確認チェック】</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2">
                  <span className="font-bold text-stone-900 text-base flex items-center gap-1.5">
                    <span>①</span> 正面の刻印文字の確認
                  </span>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    施主様から申請された「正面文字」（例: ○○家先祖代々之墓、南無阿弥陀仏 など）と完全に一致しているか確認します。
                  </p>
                </div>
                <div className="bg-stone-50 p-4 rounded-xl border-2 border-amber-400 bg-amber-50/50 space-y-2">
                  <span className="font-bold text-amber-950 text-base flex items-center gap-1.5">
                    <span>②</span> 側面の「建立者名」の確認（決定打）
                  </span>
                  <p className="text-xs text-amber-950 leading-relaxed font-medium">
                    墓石の側面または裏面に彫られている<strong>「建立者名（建てた人の氏名）」</strong>を確認します。正面が同姓であっても、側面の建立者名が一致することで、間違いのない施工が100%担保されます。
                  </p>
                </div>
              </div>

              <h4 className="font-bold text-lg text-stone-900 pt-2">【必ず撮影する写真（前後で計4枚以上）】</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                  <strong className="text-stone-900 block">📷 作業前写真（施工前）</strong>
                  <div className="text-xs text-stone-600 space-y-0.5">
                    <div>1. 墓石正面の刻印文字が読める写真</div>
                    <div>2. 側面の建立者名の刻印写真</div>
                    <div>3. 区画全体の雑草や汚れの状態がわかる全景</div>
                  </div>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                  <strong className="text-stone-900 block">📷 作業後写真（施工完了）</strong>
                  <div className="text-xs text-stone-600 space-y-0.5">
                    <div>1. 水拭き・清掃が完了した墓石正面の写真</div>
                    <div>2. 雑草を抜いて綺麗になった区画全体の全景</div>
                    <div>3. お供えした生花・お線香をあげた合掌写真</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 第5章 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-stone-200 pb-2">
              <span className="w-8 h-8 rounded-full bg-blue-700 text-white text-sm flex items-center justify-center font-extrabold">
                5
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900">
                作業完了報告書の提出手順
              </h3>
            </div>
            <p className="text-stone-700 text-base leading-relaxed">
              作業が完了したら、現場からスマホでその日のうちに完了報告書を送信します。
            </p>
            <ol className="space-y-3 text-sm text-stone-700">
              <li className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                <strong>1. 該当案件の「報告書を入力する」をタップ</strong>
              </li>
              <li className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                <strong>2. 撮影した作業前・作業後の写真を枠ごとに選択</strong><br />
                <span className="text-stone-500 text-xs">スマホの写真ライブラリから選ぶだけで自動アップロードされます。</span>
              </li>
              <li className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                <strong>3. 職人からの作業メモ・気付きを入力</strong><br />
                <span className="text-stone-500 text-xs">例：「心を込めて水洗い清掃し、雑草を根から除去しました。墓石の欠損等はございません。」</span>
              </li>
              <li className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                <strong>4. 「完了報告を提出する」ボタンを押して完了！</strong><br />
                <span className="text-stone-500 text-xs">提出と同時に、施主様および霊園管理事務所へ自動的に完了通知が送信されます。</span>
              </li>
            </ol>
          </section>

          {/* 第6章 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-stone-200 pb-2">
              <span className="w-8 h-8 rounded-full bg-emerald-700 text-white text-sm flex items-center justify-center font-extrabold">
                6
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900">
                売上・報酬の自動送金（Stripe Connect）
              </h3>
            </div>
            <p className="text-stone-700 text-base leading-relaxed">
              ココロモウでは、施主様がお支払いされた代金からプラットフォーム手数料（20%）を差し引いた<strong>80%の施工報酬</strong>が、世界水準の決済プラットフォーム「Stripe Connect」を通じて、貴社の銀行口座へ自動送金されます。
            </p>
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2 text-sm text-emerald-950">
              <div className="flex items-center gap-2 font-bold">
                <CreditCard className="w-5 h-5 text-emerald-700" />
                <span>請求書発行や代金回収の手間はゼロ</span>
              </div>
              <p className="text-xs text-stone-700 leading-relaxed">
                施主様からのクレジットカード決済は前払いで完了しているため、「施工したのに代金が支払われない」という未回収リスクは一切ありません。
              </p>
            </div>
          </section>

          {/* 第7章 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-stone-200 pb-2">
              <span className="w-8 h-8 rounded-full bg-blue-700 text-white text-sm flex items-center justify-center font-extrabold">
                7
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900">
                霊園作業マナー・安全遵守事項
              </h3>
            </div>
            <div className="space-y-3 text-sm text-stone-700">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                <strong className="text-stone-900">1. ゴミ・抜いた雑草は必ず「すべて持ち帰り」</strong>
                <p className="text-stone-600 text-xs">霊園内のゴミ箱や水場に雑草や枯れた花を放置せず、必ず自己のゴミ袋に入れて持ち帰って適正に処分してください。</p>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                <strong className="text-stone-900">2. 一般墓参者への配慮と挨拶</strong>
                <p className="text-stone-600 text-xs">水汲み場を長時間占有したり、通路に道具を広げて墓参者の通行を妨げないようにしてください。すれ違う参拝者には礼儀正しく挨拶をしましょう。</p>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                <strong className="text-stone-900">3. 万が一、墓石破損やトラブルが起きた場合</strong>
                <p className="text-stone-600 text-xs">万一、作業中に墓石の欠損や隣接墓石への汚損が生じた場合は、絶対に隠さず、直ちに霊園管理事務所および本部サポート窓口へお電話でご連絡ください。</p>
              </div>
            </div>

            <div className="mt-6 p-5 bg-blue-50 rounded-2xl border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="font-bold text-blue-950 text-base block">ココロモウ 業者様サポートホットライン</span>
                <span className="text-xs text-stone-600">現場での区画迷い・お墓の特定確認など、作業中の緊急時もサポートします。</span>
              </div>
              <div className="text-right shrink-0">
                <span className="text-lg font-extrabold text-blue-800">📞 089-900-8800</span>
                <span className="text-xs text-stone-500 block">施工当日緊急ダイヤル（7:00〜19:00）</span>
              </div>
            </div>
          </section>

          {/* フッター戻りリンク（非印刷） */}
          <div className="no-print pt-6 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/vendor"
              className="px-5 py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl text-sm transition shadow-sm"
            >
              ← 作業代行業者の管理画面へ戻る
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/partner-spec"
                className="text-xs text-stone-600 hover:text-blue-700 underline font-medium"
              >
                技術仕様書を見る
              </Link>
              <Link
                href="/cemetery/manual"
                className="text-xs text-stone-600 hover:text-blue-700 underline font-medium"
              >
                墓地管理会社向けマニュアルを見る
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
