'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import QRCode from 'qrcode';
import { 
  ArrowLeft, 
  Printer, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Phone, 
  Building2, 
  FileText, 
  Sparkles,
  AlertTriangle,
  ArrowRight,
  Download,
  QrCode
} from 'lucide-react';

export default function AdminPricingProposalPage() {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  useEffect(() => {
    QRCode.toDataURL('https://kokoromou.inteve-cloud.com/contact?type=cemetery', {
      width: 200,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    })
      .then((url) => setQrCodeDataUrl(url))
      .catch((err) => console.error('QR code generation error:', err));
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 pb-20 print:bg-white print:pb-0 print:p-0">
      {/* 画面上部のアクションバー（印刷時には非表示） */}
      <aside aria-label="操作メニュー" className="bg-stone-900 text-white sticky top-0 z-30 shadow-lg print:hidden">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-sm font-bold transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← 本部管理画面に戻る</span>
            </Link>
            <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded-full font-bold">
              本部限定・商談用提案書
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-sm font-extrabold rounded-xl shadow-md transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>🖨️ A4提案資料をPDFダウンロード / 印刷</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Web画面用の案内メッセージ */}
      <div className="max-w-4xl mx-auto px-4 pt-6 print:hidden">
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 text-blue-950 text-sm flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div className="space-y-1">
            <strong className="block text-base font-bold text-blue-900">
              霊園・寺院様へのご提案・商談時にそのままお使いいただけます
            </strong>
            <p className="text-blue-800 text-xs sm:text-sm">
              「A4提案資料をPDFダウンロード / 印刷」を押すと、ブラウザの印刷ダイアログが開きます。送信先を「PDFに保存」にすることで、<strong>A4縦2ページ（1ページ目：導入メリットと課題解決、2ページ目：料金プラン表と導入手順）</strong>の綺麗な資料として保存・印刷が可能です。
            </p>
          </div>
        </div>
      </div>

      {/* 提案書本文コンテナ（印刷時はA4実寸、画面上はプレビュー用紙） */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-10 print:max-w-none print:p-0 print:m-0 print:space-y-0">

        {/* =========================================================
            【1ページ目】：導入のメリット・課題解決・業務フロー比較
           ========================================================= */}
        <div className="page-sheet bg-white rounded-3xl shadow-xl border border-stone-300 p-8 sm:p-12 print:shadow-none print:border-none print:rounded-none print:p-[12mm] print:page-break-after">
          
          {/* ヘッダーブロック */}
          <div className="flex items-start justify-between border-b-2 border-stone-800 pb-5 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm shrink-0 border border-stone-200 bg-white">
                <Image
                  src="/logo.png"
                  alt="ココロモウ ロゴ"
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
              <div>
                <span className="text-2xl font-black text-stone-900 tracking-tight block leading-tight">
                  ココロモウ（Kokoromou）
                </span>
                <span className="text-[11px] font-bold text-stone-500 tracking-wider">
                  お墓参り・お掃除代行 公認DXプラットフォーム
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block bg-emerald-800 text-white font-extrabold text-xs px-3 py-1 rounded-md mb-1">
                墓地管理会社・寺院様向け
              </span>
              <p className="text-xs text-stone-500 font-bold">提携パートナー募集・導入提案書</p>
            </div>
          </div>

          {/* メインキャッチコピー */}
          <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-stone-900 text-white p-6 rounded-2xl mb-6 shadow-sm">
            <span className="text-amber-300 font-black text-xs tracking-widest block mb-1">
              【現場の取次ぎ負担ゼロ ＆ 墓じまい防止】
            </span>
            <h1 className="text-xl sm:text-2xl font-black leading-snug tracking-tight text-white mb-2">
              代行依頼の「電話取次ぎ・日程調整」の手間を完全自動化。<br className="hidden sm:inline" />
              霊園公認の安心代行で、<span className="text-amber-300">施主様の管理費継続・ご供養</span>を守ります。
            </h1>
            <p className="text-xs text-stone-300 leading-relaxed">
              遠方に住む施主様からの「お墓参りに行けない」ご相談に対し、霊園様が電話対応・業者取次ぎをする必要はもうありません。安心の事前契約・写真報告までワンストップで代行いたします。
            </p>
          </div>

          {/* 導入前後の業務比較（Before / After） */}
          <div className="mb-6">
            <h2 className="text-base font-extrabold text-stone-900 mb-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-700"></span>
              <span>業務フロー比較：なぜ管理会社様の手間が「ゼロ」になるのか？</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Before */}
              <div className="bg-rose-50/70 border-2 border-rose-200 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-rose-800 font-black text-sm mb-2">
                  <span>❌</span>
                  <span>導入前（従来の手動対応）</span>
                </div>
                <ul className="text-xs text-rose-950 space-y-1.5 leading-relaxed font-medium">
                  <li className="flex items-start gap-1.5">
                    <span className="text-rose-600 font-bold">・</span>
                    <span>施主様から「代行してほしい」と電話を受け、区画や希望を聞き取る（15分）</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-rose-600 font-bold">・</span>
                    <span>知り合いの石材店や便利屋へ電話し、日程調整や墓所の場所を案内（20分）</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-rose-600 font-bold">・</span>
                    <span>作業完了後、写真や報告書を預かって施主様へ郵送・取次ぎ（20分）</span>
                  </li>
                  <li className="flex items-start gap-1.5 font-bold text-rose-900 bg-white/70 p-1.5 rounded">
                    <span>⚠️</span>
                    <span>「電話の取次ぎがとにかく面倒」「トラブル時の責任が怖い」</span>
                  </li>
                </ul>
              </div>

              {/* After */}
              <div className="bg-emerald-50/90 border-2 border-emerald-400 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-emerald-900 font-black text-sm mb-2">
                  <span>✅</span>
                  <span>ココロモウ導入後（完全オンライン自動化）</span>
                </div>
                <ul className="text-xs text-emerald-950 space-y-1.5 leading-relaxed font-medium">
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-700 font-bold">・</span>
                    <span>施主様がスマホで専用画面から直接プラン選択・カード決済（管理所の手間なし）</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-700 font-bold">・</span>
                    <span>提携代行業者へ自動通知。認可契約書を締結済みの業者だけが現地施工</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-700 font-bold">・</span>
                    <span>作業完了写真（ビフォーアフター）が自動で施主様のスマホへ届き完了！</span>
                  </li>
                  <li className="flex items-start gap-1.5 font-extrabold text-emerald-900 bg-white/90 p-1.5 rounded border border-emerald-300">
                    <span>✨</span>
                    <span>管理事務所は「進捗画面を見るだけ」。電話対応・取次ぎは完全ゼロ！</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* 霊園管理会社様が得られる5大メリット */}
          <div>
            <h2 className="text-base font-extrabold text-stone-900 mb-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-700"></span>
              <span>霊園・寺院管理会社様が得られる「5大メリット」</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-stone-50 border border-stone-200 p-3 rounded-xl space-y-1">
                <div className="font-extrabold text-stone-900 text-sm flex items-center gap-1.5 text-emerald-900">
                  <span>①</span>
                  <span>取次ぎ人件費・電話対応コストの削減</span>
                </div>
                <p className="text-stone-600 leading-relaxed">
                  月数十時間に及ぶ電話相談・業者調整・現地案内から事務員を解放。通常業務に集中できます。
                </p>
              </div>

              <div className="bg-stone-50 border border-stone-200 p-3 rounded-xl space-y-1">
                <div className="font-extrabold text-stone-900 text-sm flex items-center gap-1.5 text-emerald-900">
                  <span>②</span>
                  <span>無断侵入・墓石損壊リスクの完全撲滅</span>
                </div>
                <p className="text-stone-600 leading-relaxed">
                  管理規律を遵守する「公認基本契約書・誓約書」と「損害賠償保険」を義務付けた業者のみを認定。
                </p>
              </div>

              <div className="bg-stone-50 border border-stone-200 p-3 rounded-xl space-y-1">
                <div className="font-extrabold text-stone-900 text-sm flex items-center gap-1.5 text-emerald-900">
                  <span>③</span>
                  <span>遠方・高齢化による「墓じまい」の防止</span>
                </div>
                <p className="text-stone-600 leading-relaxed">
                  「遠くて通えないから手放す」を防ぎ、施主様がお墓を永く守り続けることで年間管理費の収入を守ります。
                </p>
              </div>

              <div className="bg-stone-50 border border-stone-200 p-3 rounded-xl space-y-1">
                <div className="font-extrabold text-stone-900 text-sm flex items-center gap-1.5 text-emerald-900">
                  <span>④</span>
                  <span>顧客台帳 ＆ 次回お参り案内メール一括送信</span>
                </div>
                <p className="text-stone-600 leading-relaxed">
                  お彼岸やお盆の案内をBCCで一斉作成。返信は普段の霊園メールに直接届くため見落とし事故ゼロ。
                </p>
              </div>

              <div className="sm:col-span-2 bg-amber-50/80 border border-amber-300 p-3 rounded-xl text-stone-800 space-y-1">
                <div className="font-extrabold text-amber-950 text-sm flex items-center gap-1.5">
                  <span>⑤</span>
                  <span>税務上も極めてクリーン（宗教法人の収益事業課税リスクなし）</span>
                </div>
                <p className="text-stone-700 leading-relaxed">
                  不透明なキックバック（紹介料）ではなく、正規の「霊園管理システム利用料（業務委託・通信費）」として経費処理できるため、税務署からの指摘リスクが一切ありません。
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-500">
            <span>ココロモウ提携プラン提案書 - 1/2</span>
            <span>※次ページに詳細な料金プランと導入手順を掲載しております</span>
          </div>
        </div>

        {/* =========================================================
            【2ページ目】：提携料金プラン表・収益試算・導入手順
           ========================================================= */}
        <div className="page-sheet bg-white rounded-3xl shadow-xl border border-stone-300 p-8 sm:p-12 print:shadow-none print:border-none print:rounded-none print:p-[12mm]">
          
          {/* 2ページ目ヘッダー */}
          <div className="flex items-center justify-between border-b-2 border-stone-800 pb-4 mb-6">
            <div>
              <span className="text-lg font-black text-stone-900 tracking-tight block">
                提携料金プラン ＆ 導入シミュレーション
              </span>
              <span className="text-[11px] font-bold text-stone-500">
                管理会社様の規模やニーズに合わせて最適なプランをお選びいただけます
              </span>
            </div>
            <span className="bg-stone-900 text-white font-bold text-xs px-3 py-1 rounded-md">
              明朗・定額会計
            </span>
          </div>

          {/* 料金プラン2選 比較テーブル */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            {/* スタンダードSaaSプラン（推奨） */}
            <div className="bg-gradient-to-b from-emerald-50/60 to-white border-3 border-emerald-600 rounded-2xl p-6 shadow-md relative flex flex-col justify-between">
              <div className="absolute -top-3.5 right-6 bg-emerald-600 text-white text-[11px] font-black px-3 py-1 rounded-full shadow-sm">
                ★ 一番選ばれているおすすめプラン
              </div>
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    SaaS型・業務効率化
                  </span>
                  <h3 className="text-xl font-black text-stone-900 mt-1">
                    スタンダードSaaSプラン
                  </h3>
                  <p className="text-xs text-stone-600 mt-1">
                    代行取次ぎゼロ・顧客名簿・次回案内メールまでフル活用したい霊園様
                  </p>
                </div>

                {/* 料金表示 */}
                <div className="bg-white p-4 rounded-xl border border-emerald-200 text-center space-y-1">
                  <span className="text-xs font-bold text-stone-500">月額固定システム利用料</span>
                  <div className="text-3xl font-black text-emerald-950">
                    10,000<span className="text-base font-bold text-stone-700"> 円/月</span>
                    <span className="text-xs font-normal text-stone-500 ml-1">（税別）</span>
                  </div>
                  <div className="text-xs font-extrabold text-blue-900 pt-1 border-t border-stone-100 mt-2">
                    決済手数料: <strong className="text-base text-blue-700">わずか 10%</strong>
                    <span className="block text-[10px] text-stone-500 font-normal">（代行業者へ90%が実入り還元され、良い職人が集まる）</span>
                  </div>
                </div>

                {/* 含まれる機能 */}
                <ul className="text-xs space-y-2 text-stone-800 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>取次ぎ・日程調整・写真報告の完全自動化</strong>（電話ゼロ）</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>顧客管理名簿台帳 ＆ 履歴集約機能</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>次回お参り案内一括メール送信</strong>（BCCメーラー起動）</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>提携業者との認可契約書PDF・電子原本保管</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>園内掲示用A4ポスター・チラシデータ無償提供</strong></span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-3 border-t border-emerald-200 text-center">
                <span className="text-[11px] font-bold text-emerald-900">
                  ※パート事務員を月数時間雇うより圧倒的に低コストです
                </span>
              </div>
            </div>

            {/* 初期お試しトライアルプラン */}
            <div className="bg-stone-50/80 border-2 border-stone-300 rounded-2xl p-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold text-stone-700 bg-stone-200 px-2.5 py-0.5 rounded-full">
                    完全成果報酬型
                  </span>
                  <h3 className="text-xl font-black text-stone-900 mt-1">
                    初期お試しトライアル
                  </h3>
                  <p className="text-xs text-stone-600 mt-1">
                    まずは初期費用ゼロで、施主様の反応や効果を確かめたい霊園様
                  </p>
                </div>

                {/* 料金表示 */}
                <div className="bg-white p-4 rounded-xl border border-stone-200 text-center space-y-1">
                  <span className="text-xs font-bold text-stone-500">月額固定費</span>
                  <div className="text-3xl font-black text-stone-900">
                    0<span className="text-base font-bold text-stone-700"> 円</span>
                    <span className="text-xs font-normal text-stone-500 ml-1">（完全無料）</span>
                  </div>
                  <div className="text-xs font-extrabold text-stone-700 pt-1 border-t border-stone-100 mt-2">
                    決済手数料: <strong className="text-base text-stone-900">20%</strong>
                    <span className="block text-[10px] text-stone-500 font-normal">（注文が発生した時のみ手数料を申し受ける成果報酬型）</span>
                  </div>
                </div>

                {/* 含まれる機能 */}
                <ul className="text-xs space-y-2 text-stone-700 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-stone-600 shrink-0" />
                    <span>基本の受発注・オンラインカード決済システム</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-stone-600 shrink-0" />
                    <span>作業完了写真の自動Web報告</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-stone-600 shrink-0" />
                    <span>提携業者の出入り認可管理</span>
                  </li>
                  <li className="flex items-center gap-2 text-stone-400">
                    <span className="w-4 text-center font-bold">−</span>
                    <span>顧客管理台帳・一括メール送信（※有料オプション）</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-3 border-t border-stone-200 text-center">
                <span className="text-[11px] font-bold text-stone-600">
                  ※いつでもスタンダードプランへ移行いただけます
                </span>
              </div>
            </div>
          </div>

          {/* 導入までのカンタン3ステップ */}
          <div className="mb-6 bg-stone-50 p-5 rounded-2xl border border-stone-200">
            <h2 className="text-sm font-extrabold text-stone-900 mb-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-700"></span>
              <span>最短3日でスタート可能！導入までのカンタン3ステップ</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-stone-200 space-y-1">
                <span className="font-extrabold text-emerald-800 block text-xs">STEP 1</span>
                <strong className="block text-stone-900 font-bold">霊園情報のご登録</strong>
                <p className="text-stone-600 text-[11px] leading-relaxed">
                  霊園名、所在地、管轄区画をご登録。既存の出入り石材店様も即日パートナー登録可能。
                </p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-stone-200 space-y-1">
                <span className="font-extrabold text-emerald-800 block text-xs">STEP 2</span>
                <strong className="block text-stone-900 font-bold">チラシ・ポスターの設置</strong>
                <p className="text-stone-600 text-[11px] leading-relaxed">
                  管理事務所の窓口や掲示板へ、専用QRコード付き案内ポスター・リーフレットを設置。
                </p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-stone-200 space-y-1">
                <span className="font-extrabold text-emerald-800 block text-xs">STEP 3</span>
                <strong className="block text-stone-900 font-bold">自動受付スタート</strong>
                <p className="text-stone-600 text-[11px] leading-relaxed">
                  施主様からのご依頼はすべて自動化。管理所は進捗画面で確認するだけで業務完了。
                </p>
              </div>
            </div>
          </div>

          {/* 運営会社・お問い合わせ窓口 */}
          <div className="border-2 border-stone-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs bg-stone-50/50">
            <div className="space-y-1.5 flex-1">
              <span className="font-black text-sm text-stone-900 block">
                運営元：Creative System Design（プラットフォーム本部）
              </span>
              <p className="text-stone-600 text-[11px]">
                〒790-0931 愛媛県松山市西石井1丁目9番27号 グランジュール505号
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-stone-700 font-bold text-[11px]">
                <span>📞 お電話: <strong>090-4116-9476</strong></span>
                <span>🌐 お問い合わせフォーム: <strong className="text-emerald-800">https://kokoromou.inteve-cloud.com/contact</strong></span>
              </div>
              <p className="text-[10px] text-stone-500 font-medium">
                ※提携・導入相談、資料請求、一般的なご質問は、右記QRコードまたはWebフォームより24時間承っております。
              </p>
            </div>

            {/* QRコード表示エリア */}
            <div className="flex items-center gap-3 bg-white px-3.5 py-2.5 rounded-xl border border-stone-300 shadow-xs shrink-0">
              <div className="w-14 h-14 bg-stone-100 rounded flex items-center justify-center overflow-hidden border border-stone-200">
                {qrCodeDataUrl ? (
                  <img 
                    src={qrCodeDataUrl} 
                    alt="お問い合わせQRコード" 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <QrCode className="w-10 h-10 text-stone-700" />
                )}
              </div>
              <div className="text-left space-y-0.5">
                <span className="inline-block px-1.5 py-0.5 bg-emerald-100 text-emerald-800 font-black text-[9px] rounded">
                  24時間受付
                </span>
                <span className="text-[11px] font-black text-stone-900 block">
                  総合お問い合わせ窓口
                </span>
                <span className="text-[9px] text-stone-500 block">
                  提携相談・一般質問受付
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-2 flex items-center justify-between text-[11px] text-stone-500">
            <span>ココロモウ提携プラン提案書 - 2/2</span>
            <span>© Kokoromou Inc. All Rights Reserved.</span>
          </div>
        </div>

      </div>

      {/* A4縦2ページ印刷専用CSS */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 8mm;
          }
          html, body {
            background: white !important;
            color: #000 !important;
            margin: 0 !important;
            padding: 0 !important;
            font-size: 11pt !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          header, aside, nav, footer, .print\\:hidden {
            display: none !important;
          }
          .page-sheet {
            page-break-after: always !important;
            break-after: page !important;
            box-shadow: none !important;
            border: none !important;
            padding: 4mm !important;
            margin: 0 !important;
            width: 100% !important;
            min-height: 275mm !important;
            height: auto !important;
          }
          .page-sheet:last-child {
            page-break-after: avoid !important;
            break-after: avoid !important;
          }
        }
      `}</style>
    </div>
  );
}
