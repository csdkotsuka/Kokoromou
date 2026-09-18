'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Printer, 
  ArrowLeft, 
  QrCode, 
  Phone, 
  CheckCircle2, 
  Camera, 
  ShieldCheck, 
  Flower2, 
  MapPin, 
  Sparkles, 
  Star,
  HeartHandshake,
  Download,
  Building2,
  Check
} from 'lucide-react';

export default function FlyerPage() {
  const [activeTab, setActiveTab] = useState<'poster' | 'leaflet'>('poster');
  const [leafletSide, setLeafletSide] = useState<'outside' | 'inside'>('outside');

  return (
    <div className="bg-stone-100 min-h-screen pb-20 text-stone-900 font-sans">
      {/* 画面上部ツールバー */}
      <div className="bg-white border-b border-stone-200 sticky top-16 z-40 print:hidden shadow-xs">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-emerald-700 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>サイトへ戻る</span>
            </Link>
            <span className="text-stone-300">|</span>
            <span className="text-sm font-bold text-stone-900">販促チラシ・リーフレット</span>
            <span className="text-[11px] bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
              ✨ 完成版デザイン
            </span>
          </div>

          {/* 切り替えタブ */}
          <div className="flex items-center gap-2 bg-stone-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('poster')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'poster'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              ① 縦置きポスター・A4チラシ
            </button>
            <button
              onClick={() => setActiveTab('leaflet')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'leaflet'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              ② A4両面三つ折りリーフレット
            </button>
          </div>

          {/* ダウンロードボタン */}
          <div className="flex items-center gap-2">
            {activeTab === 'poster' ? (
              <a
                href="/pdf/kokoromou_poster_a4.pdf"
                download="kokoromou_poster_a4.pdf"
                className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 px-4 py-2 rounded-xl text-xs font-black transition-all shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>PDFをダウンロード (A4縦)</span>
              </a>
            ) : (
              <a
                href="/pdf/kokoromou_leaflet_trifold.pdf"
                download="kokoromou_leaflet_trifold.pdf"
                className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 px-4 py-2 rounded-xl text-xs font-black transition-all shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>PDFをダウンロード (両面三つ折り)</span>
              </a>
            )}
          </div>
        </div>

        {activeTab === 'leaflet' && (
          <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-center gap-3 border-t border-stone-100 bg-amber-50/70 text-xs">
            <span className="text-stone-700 font-bold">三つ折り面の切り替えプレビュー:</span>
            <button
              onClick={() => setLeafletSide('outside')}
              className={`px-3 py-1 rounded-md font-bold transition-colors ${
                leafletSide === 'outside' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white text-stone-700 border border-stone-300'
              }`}
            >
              【外側3面】表紙・裏表紙（会社概要・Q&A）・折り込み面
            </button>
            <button
              onClick={() => setLeafletSide('inside')}
              className={`px-3 py-1 rounded-md font-bold transition-colors ${
                leafletSide === 'inside' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white text-stone-700 border border-stone-300'
              }`}
            >
              【内側3面】見開きワイド（お悩み・詳細3プラン・実例と声）
            </button>
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-6">
        {/* ダウンロード案内バナー */}
        <div className="bg-white border border-emerald-200 p-3.5 rounded-xl mb-6 shadow-2xs flex items-center justify-between gap-4 print:hidden">
          <div className="flex items-center gap-2 text-xs">
            <span className="bg-emerald-600 text-white font-bold px-2 py-0.5 rounded text-[10px]">
              印刷対応
            </span>
            <span className="text-stone-700">
              配布・印刷には右上の<strong>「PDFダウンロード」</strong>をご利用ください。A4実寸（ポスター: 210×297mm、リーフレット: 297×210mm両面）で余白ズレなく美しく印刷できます。
            </span>
          </div>
        </div>

        {/* 1. ポスタープレビュー */}
        {activeTab === 'poster' && (
          <div className="flex flex-col items-center">
            <div className="w-full max-w-[760px] bg-white border border-stone-300 shadow-xl rounded-2xl overflow-hidden flex flex-col justify-between">
              {/* ヘッダー */}
              <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 p-8 text-white">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full bg-white text-emerald-700 flex items-center justify-center font-black text-xl shadow-md">
                      🌸
                    </div>
                    <div>
                      <span className="text-2xl font-black tracking-tight block leading-tight">ココロモウ</span>
                      <span className="text-xs text-emerald-100">お墓参り・お掃除代行プラットフォーム</span>
                    </div>
                  </div>
                  <span className="bg-amber-400 text-stone-950 font-black text-xs px-3 py-1 rounded-md shadow-sm">
                    愛媛・松山市内 霊園対応
                  </span>
                </div>

                <div className="mt-4">
                  <p className="text-amber-200 text-xs font-bold mb-1">「忙しくて帰省できない」「高齢でお墓参りが大変」なあなたへ</p>
                  <h1 className="text-2xl sm:text-3xl font-black text-white leading-snug">
                    ふるさとのお墓を、真心を込めてピカピカに。<br />
                    <span className="text-amber-300">お墓参り・お掃除代行サービス</span>
                  </h1>
                </div>
              </div>

              {/* メイン写真 */}
              <div className="p-6 sm:p-8 space-y-6">
                <div className="bg-emerald-50/60 p-4 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-emerald-900">【施工実績】宝塔寺 旭ヶ丘霊園 モデル施工例</span>
                    <span className="text-xs font-bold text-amber-700">✨ 見違えるほどの清らかな仕上がり</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg overflow-hidden shadow-xs">
                      <div className="relative h-44 sm:h-52">
                        <img src="/images/grave_before.jpg" alt="作業前" className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 bg-stone-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                          作業前 (Before)
                        </span>
                      </div>
                      <p className="p-2 text-[10px] text-stone-600">苔・水垢の付着、敷地内に散乱した落ち葉や雑草</p>
                    </div>
                    <div className="bg-white rounded-lg overflow-hidden shadow-md ring-2 ring-emerald-500/30">
                      <div className="relative h-44 sm:h-52">
                        <img src="/images/grave_after.jpg" alt="作業後" className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                          作業完了 (After) ✨
                        </span>
                      </div>
                      <p className="p-2 text-[10px] text-emerald-950 font-bold bg-emerald-50/80">全面手作業除草・専用水洗い・生花1対とお線香</p>
                    </div>
                  </div>
                </div>

                {/* 3つの特徴 */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-stone-50 border-t-4 border-teal-600 p-3.5 rounded-b-lg">
                    <div className="font-bold text-xs text-stone-900 mb-1">📸 鮮明な写真レポート</div>
                    <p className="text-[10px] text-stone-600 leading-relaxed">清掃前後の高画質写真をスマホにお届け。遠方からでも安心です。</p>
                  </div>
                  <div className="bg-emerald-50/50 border-t-4 border-emerald-600 p-3.5 rounded-b-lg">
                    <div className="font-bold text-xs text-stone-900 mb-1">🏛️ 地元の確かなプロ施工</div>
                    <p className="text-[10px] text-stone-600 leading-relaxed">松山「お墓のトータルエージェント」提携店が真心施工。</p>
                  </div>
                  <div className="bg-amber-50/50 border-t-4 border-amber-500 p-3.5 rounded-b-lg">
                    <div className="font-bold text-xs text-stone-900 mb-1">💳 明朗会計・追加料金なし</div>
                    <p className="text-[10px] text-stone-600 leading-relaxed">カード即時決済。お見積もり後の追加料金は一切ありません。</p>
                  </div>
                </div>

                {/* 料金プラン */}
                <div>
                  <div className="flex items-baseline justify-between border-b border-stone-200 pb-1.5 mb-3">
                    <h3 className="text-sm font-black text-stone-900">選べる3つの代行プラン（税込・明朗会計）</h3>
                    <span className="text-[10px] text-stone-500">お墓の状態に合わせて選べます</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-stone-50 border border-stone-200 p-3 rounded-lg flex flex-col justify-between">
                      <div>
                        <span className="text-[11px] font-bold text-stone-800 block">基本お参りプラン</span>
                        <span className="text-lg font-black text-stone-900 block mt-0.5">¥8,800</span>
                      </div>
                      <p className="text-[9px] text-stone-500 mt-2">落ち葉拾い・墓石水拭き・お線香・完了写真報告</p>
                    </div>

                    <div className="bg-amber-50/60 border-2 border-amber-400 p-3 rounded-lg shadow-sm flex flex-col justify-between relative">
                      <span className="bg-amber-500 text-stone-950 text-[9px] font-black px-2 py-0.5 rounded absolute -top-2 left-1/2 -translate-x-1/2">
                        ★ 一番人気
                      </span>
                      <div>
                        <span className="text-[11px] font-bold text-amber-950 block mt-1">標準徹底お掃除プラン</span>
                        <span className="text-xl font-black text-emerald-800 block mt-0.5">¥14,800</span>
                      </div>
                      <p className="text-[9px] text-stone-700 font-bold mt-2">全面手作業除草・水洗い・生花1対とお線香・詳細写真</p>
                    </div>

                    <div className="bg-stone-50 border border-stone-200 p-3 rounded-lg flex flex-col justify-between">
                      <div>
                        <span className="text-[11px] font-bold text-stone-800 block">プレミアム美装プラン</span>
                        <span className="text-lg font-black text-stone-900 block mt-0.5">¥29,800</span>
                      </div>
                      <p className="text-[9px] text-stone-500 mt-2">高圧洗浄・コケ除去・撥水コーティング・防草施工</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* フッターCTA */}
              <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 p-6 border-t-2 border-emerald-500 flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-black text-emerald-950 mb-0.5">提携窓口: 株式会社トータルエージェント・パートナーズ</div>
                  <p className="text-[10px] text-stone-600 mb-2">愛媛県松山市土居田町 / 宝塔寺旭ヶ丘霊園ほか市内霊園全域対応</p>
                  <div className="inline-flex items-center gap-1 bg-white px-3 py-1 rounded border border-emerald-400 font-black text-emerald-800 text-sm">
                    <Phone className="w-3.5 h-3.5" />
                    <span>089-997-XXXX</span>
                  </div>
                  <span className="text-[10px] text-stone-500 ml-2">お電話でのご相談も承っております</span>
                </div>

                <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border-2 border-emerald-500 shadow-xs shrink-0">
                  <div className="w-14 h-14 bg-stone-50 rounded p-1 flex items-center justify-center">
                    <QrCode className="w-12 h-12 text-emerald-900" />
                  </div>
                  <div className="text-left">
                    <span className="text-[11px] font-black text-emerald-950 block">スマホで24時間受付</span>
                    <span className="text-[10px] font-bold text-amber-600 block">簡単Webお申し込み</span>
                    <span className="text-[8px] text-stone-400">カメラで読み取るだけ</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. リーフレットプレビュー */}
        {activeTab === 'leaflet' && (
          <div className="flex flex-col items-center">
            {/* 外側3面 */}
            {leafletSide === 'outside' && (
              <div className="w-full max-w-[980px] bg-white border border-stone-300 shadow-xl rounded-2xl overflow-hidden p-6 grid grid-cols-1 md:grid-cols-3 gap-5 divide-y md:divide-y-0 md:divide-x divide-stone-200">
                {/* 1面：折り込み面 */}
                <div className="p-3 flex flex-col justify-between bg-stone-50/70 rounded-xl space-y-2">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-700 block mb-1">ココロモウの約束</span>
                    <h3 className="text-sm font-black text-stone-900 leading-snug mb-2">
                      遠く離れていても、<br />ふるさとへの感謝を<br />真心を込めて繋ぐ。
                    </h3>
                    <p className="text-[9px] text-stone-600 leading-relaxed mb-2 bg-white p-2 rounded border border-stone-200">
                      「お墓参りに行けず申し訳ない」「お墓が荒れていないか心配」というご家族の想いに寄り添い、松山の地元石材パートナーとともに立ち上げました。
                    </p>
                  </div>

                  <div className="bg-white p-2 rounded border border-stone-100">
                    <div className="font-bold text-[10px] text-emerald-900">🌸 単なる作業ではない「供養の心」</div>
                    <p className="text-[8.5px] text-stone-600 mt-0.5">雑草抜きや水洗いだけでなく、生花をお供えし線香を焚き、敬虔に合掌いたします。</p>
                  </div>
                  <div className="bg-white p-2 rounded border border-stone-100">
                    <div className="font-bold text-[10px] text-emerald-900">🏛️ 松山エリア専門の確かな技術</div>
                    <p className="text-[8.5px] text-stone-600 mt-0.5">石材技能士の知識を持つ地元職人が、墓石を傷めない専用水洗いと手作業除草で施工。</p>
                  </div>
                  <div className="bg-white p-2 rounded border border-stone-100">
                    <div className="font-bold text-[10px] text-emerald-900">📸 鮮明な高画質写真レポート</div>
                    <p className="text-[8.5px] text-stone-600 mt-0.5">作業前後の比較写真をWebでお届け。遠方のご家族全員で安心を共有できます。</p>
                  </div>
                  <div className="bg-white p-2 rounded border border-stone-100">
                    <div className="font-bold text-[10px] text-emerald-900">🤝 永代供養・墓じまいのご相談も</div>
                    <p className="text-[8.5px] text-stone-600 mt-0.5">宝塔寺旭ヶ丘霊園での永代供養や、将来の墓じまい・改葬までワンストップ対応。</p>
                  </div>

                  <div className="bg-emerald-50 p-2 rounded border border-emerald-200 text-[8.5px]">
                    <div className="font-bold text-emerald-900">💬 地元技術スタッフより</div>
                    <p className="text-emerald-800 mt-0.5">「松山の気候風土とお墓を知り尽くした私たちが、ご家族の想いを大切にお墓へお届けします。」</p>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 p-1.5 rounded text-center text-[8.5px] text-amber-900 font-bold">
                    📅 年間定期管理（年2〜4回）なら全プラン10%OFF
                  </div>

                  <div className="pt-2 text-center text-[9px] text-emerald-700 font-bold border-t border-stone-200">
                    ▶ ページを開いて詳しいプランをご覧ください
                  </div>
                </div>

                {/* 2面：裏表紙 */}
                <div className="p-3 flex flex-col justify-between bg-white rounded-xl space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-900 mb-1">
                    <span>🌸</span>
                    <span>提携窓口・会社概要</span>
                  </div>
                  <div className="bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-100 space-y-0.5">
                    <span className="text-[9px] font-bold text-emerald-800">愛媛・松山エリア公認パートナー</span>
                    <p className="text-xs font-black text-stone-900">株式会社トータルエージェント・パートナーズ</p>
                    <p className="text-[8.5px] text-stone-600 leading-tight">
                      〒790-0056 愛媛県松山市土居田町 / 営業時間：9:00〜18:00
                    </p>
                    <div className="text-xs font-black text-emerald-800 pt-0.5">
                      📞 TEL: 089-997-XXXX
                    </div>
                  </div>

                  <div className="bg-stone-50 p-2 rounded text-[8px] text-stone-600 border border-stone-200 leading-tight">
                    <span className="font-bold text-stone-800 block mb-0.5">📍 主な対応エリア・霊園一覧</span>
                    松山市全域・東温市・伊予市・松前町・砥部町<br />
                    宝塔寺旭ヶ丘霊園、大明神霊園、客谷霊園、鷺谷霊園、市内寺院・共同墓地
                  </div>

                  <div className="space-y-1 text-[8px] text-stone-600">
                    <p className="font-bold text-stone-800 border-b pb-0.5">よくあるご質問（抜粋）</p>
                    <div className="bg-stone-50/80 p-1.5 rounded">
                      <strong>Q. 立ち会いは必要ですか？</strong><br />A. 一切不要です。高画質写真レポートをWebでお送りします。
                    </div>
                    <div className="bg-stone-50/80 p-1.5 rounded">
                      <strong>Q. 追加料金はかかりますか？</strong><br />A. かかりません。出張費・資材費込みの明朗会計です。
                    </div>
                    <div className="bg-stone-50/80 p-1.5 rounded">
                      <strong>Q. 宗派や宗教の指定は？</strong><br />A. 仏教各宗派、神道、キリスト教の作法に配慮いたします。
                    </div>
                    <div className="bg-stone-50/80 p-1.5 rounded">
                      <strong>Q. 寺院や山間部の墓地でも可能？</strong><br />A. はい。寺院・公営・民間・共同墓地に対応可能です。
                    </div>
                    <div className="bg-stone-50/80 p-1.5 rounded">
                      <strong>Q. 雨天の場合は？</strong><br />A. 丁寧な清掃のため、天候回復後に順延して実施します。
                    </div>
                    <div className="bg-stone-50/80 p-1.5 rounded">
                      <strong>Q. 墓石の破損が見つかったら？</strong><br />A. 写真付きで報告し、ご希望に応じて補修見積もりを案内します。
                    </div>
                  </div>

                  <div className="bg-stone-50 p-1 rounded text-center text-[8px] text-stone-500 border border-stone-200">
                    💳 各種クレジットカード（VISA/Master/JCB/Amex）即時決済対応
                  </div>

                  <div className="bg-white border-2 border-emerald-500 p-2 rounded-lg flex items-center gap-3">
                    <QrCode className="w-10 h-10 text-emerald-900 shrink-0" />
                    <div>
                      <span className="text-[10.5px] font-black text-emerald-950 block">スマホで24時間受付</span>
                      <span className="text-[9px] font-bold text-amber-600 block">簡単3分Webお申し込み</span>
                      <span className="text-[7.5px] text-stone-400">カメラをかざすだけで注文完了</span>
                    </div>
                  </div>
                </div>

                {/* 3面：表紙 */}
                <div className="p-4 flex flex-col justify-between bg-gradient-to-br from-emerald-500 via-teal-500 to-sky-500 text-white rounded-xl shadow-md space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">🌸</span>
                      <span className="font-black text-sm tracking-wider">ココロモウ</span>
                    </div>
                    <span className="text-[10px] bg-amber-400 text-stone-950 font-black px-2 py-0.5 rounded">
                      愛媛・松山版
                    </span>
                  </div>

                  <div className="text-center my-1">
                    <span className="text-[10px] text-amber-200 font-extrabold tracking-wider block mb-0.5">
                      お墓参り・お掃除代行サービス
                    </span>
                    <h2 className="text-xl font-black leading-snug tracking-tight">
                      ふるさとのお墓を、<br />真心を込めて<br /><span className="text-amber-300">ピカピカに。</span>
                    </h2>
                    <p className="text-[9px] text-emerald-50 leading-relaxed mt-1">
                      松山の地元専門パートナーがご家族に代わって丁寧に清掃・合掌。鮮明な写真レポートをお届けします。
                    </p>
                  </div>

                  <div className="bg-white/15 p-2 rounded text-[8px] leading-tight">
                    <span className="font-bold text-amber-200 block mb-0.5">こんな方にご利用いただいています</span>
                    ・遠方在住で帰省が難しい方<br />
                    ・足腰の不安でお参りの階段がつらい方<br />
                    ・お盆や命日にお墓を綺麗にしておきたい方
                  </div>

                  <div className="grid grid-cols-3 gap-1 text-center text-[8px]">
                    <div className="bg-white/20 p-1 rounded font-bold">① 明朗会計<br />追加なし</div>
                    <div className="bg-white/20 p-1 rounded font-bold">② 鮮明写真<br />Web報告</div>
                    <div className="bg-white/20 p-1 rounded font-bold">③ 生花・線香<br />合掌込み</div>
                  </div>

                  <div className="bg-white p-2 rounded-lg text-stone-900 shadow-md">
                    <div className="text-[8px] font-bold text-emerald-800 text-center mb-1">宝塔寺 旭ヶ丘霊園 実写施工例</div>
                    <div className="grid grid-cols-2 gap-1.5">
                      <div>
                        <img src="/images/grave_before.jpg" alt="Before" className="w-full h-18 object-cover rounded" />
                        <span className="text-[7px] text-stone-500 block text-center py-0.5">作業前</span>
                      </div>
                      <div>
                        <img src="/images/grave_after.jpg" alt="After" className="w-full h-18 object-cover rounded" />
                        <span className="text-[7px] text-emerald-800 font-bold block text-center py-0.5">作業完了後 ✨</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-[8px] text-emerald-100 text-center">
                    松山市・中予エリア全域対応 / 初めての方もお気軽にご相談ください
                  </div>
                </div>
              </div>
            )}

            {/* 内側3面 */}
            {leafletSide === 'inside' && (
              <div className="w-full max-w-[980px] bg-white border border-stone-300 shadow-xl rounded-2xl overflow-hidden p-6 grid grid-cols-1 md:grid-cols-3 gap-5 divide-y md:divide-y-0 md:divide-x divide-stone-200">
                {/* 内側左面 */}
                <div className="p-3 flex flex-col justify-between bg-stone-50/50 rounded-xl space-y-2">
                  <div>
                    <h4 className="text-xs font-black text-stone-900 mb-1 border-b-2 border-emerald-600 pb-1">
                      こんなお悩み、ございませんか？
                    </h4>
                    <ul className="space-y-1 text-[8.5px] text-stone-700 bg-amber-50/70 p-2 rounded border border-amber-200">
                      <li>✓ 遠方に住んでいてなかなか松山へ帰省できない</li>
                      <li>✓ 高齢になり階段や山道の墓参りが体力的にきつい</li>
                      <li>✓ お盆や命日にお墓が荒れていないか気がかり</li>
                      <li>✓ 墓石のコケやしつこい水垢、雑草抜きが大変</li>
                    </ul>
                  </div>

                  <div className="bg-white p-2 rounded border border-stone-200">
                    <span className="font-bold text-[9.5px] text-emerald-900 block mb-0.5">🌸 松山密着だからできる安心対応</span>
                    <p className="text-[8.5px] text-stone-600 leading-relaxed">
                      地元石材のプロが専用資材で墓石を傷めず手作業清掃。お花も松山市内の提携花店から新鮮な状態でお供えします。
                    </p>
                  </div>

                  <div className="bg-emerald-50/80 p-2 rounded border border-emerald-200 text-[8.5px]">
                    <span className="font-bold text-emerald-900 block mb-0.5">💡 お墓の場所が曖昧でも大丈夫</span>
                    <p className="text-emerald-800 leading-relaxed">
                      霊園名とお墓の特徴、施主名をお知らせいただければ、管理事務所と連携してスタッフがお墓をお探しします。
                    </p>
                  </div>

                  <div>
                    <h5 className="text-[10px] font-black text-stone-900 mb-1">ご利用の流れ（簡単4ステップ）</h5>
                    <div className="space-y-1 text-[8.5px]">
                      <div className="flex items-center gap-2 bg-white p-1.5 rounded border border-stone-100">
                        <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[8px] shrink-0">1</span>
                        <div><strong>Web・お電話で申込み</strong><span className="text-stone-400 text-[7.5px] block">所要3分で完了</span></div>
                      </div>
                      <div className="flex items-center gap-2 bg-white p-1.5 rounded border border-stone-100">
                        <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[8px] shrink-0">2</span>
                        <div><strong>事前決済（明朗会計）</strong><span className="text-stone-400 text-[7.5px] block">クレカ即時決済で追加費用なし</span></div>
                      </div>
                      <div className="flex items-center gap-2 bg-white p-1.5 rounded border border-stone-100">
                        <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[8px] shrink-0">3</span>
                        <div><strong>現地清掃・真心の合掌</strong><span className="text-stone-400 text-[7.5px] block">職人が施工・生花線香をお供え</span></div>
                      </div>
                      <div className="flex items-center gap-2 bg-white p-1.5 rounded border border-stone-100">
                        <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[8px] shrink-0">4</span>
                        <div><strong>写真レポート納品</strong><span className="text-stone-400 text-[7.5px] block">スマホで確認・親族へ共有可能</span></div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-1 text-[8px] text-stone-400 text-center border-t border-stone-200">
                    安心の事前決済・追加料金は一切いただきません
                  </div>
                </div>

                {/* 内側中面 */}
                <div className="p-3 flex flex-col justify-between bg-white rounded-xl space-y-2">
                  <h4 className="text-xs font-black text-stone-900 border-b-2 border-emerald-600 pb-1">
                    選べる3つの代行プラン（税込）
                  </h4>

                  <div className="bg-stone-50 p-2 rounded border border-stone-200">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-[10px] font-bold text-stone-900">基本お参りプラン</span>
                      <span className="text-xs font-black text-stone-900">¥8,800</span>
                    </div>
                    <div className="text-[8px] text-stone-600 space-y-0.5">
                      <div>✓ 敷地内の落ち葉・雑草・ゴミ清掃</div>
                      <div>✓ 墓石全体の水拭き清掃</div>
                      <div>✓ お線香献香・真心の合掌</div>
                      <div>✓ 完了写真レポート（メール納品）</div>
                    </div>
                  </div>

                  <div className="bg-emerald-50/70 p-2 rounded border-2 border-emerald-500 shadow-2xs">
                    <div className="text-[8px] font-bold text-amber-700 mb-0.5">★ 一番人気・おすすめ</div>
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-[11px] font-black text-emerald-950">標準徹底お掃除プラン</span>
                      <span className="text-sm font-black text-emerald-800">¥14,800</span>
                    </div>
                    <div className="text-[8px] text-stone-700 space-y-0.5">
                      <div>✓ <strong>手作業徹底除草（根から除去）</strong></div>
                      <div>✓ <strong>墓石・花立・香炉の専用水洗い</strong></div>
                      <div>✓ <strong>頑固なコケ・水垢・汚れ落とし</strong></div>
                      <div>✓ <strong>季節の生花1対（松山生花店直送）</strong></div>
                      <div>✓ お線香献香・真心の合掌</div>
                      <div>✓ 墓石健全度目地点検・詳細写真レポート</div>
                    </div>
                  </div>

                  <div className="bg-stone-50 p-2 rounded border border-stone-200">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-[10px] font-bold text-stone-900">プレミアム美装プラン</span>
                      <span className="text-xs font-black text-stone-900">¥29,800</span>
                    </div>
                    <div className="text-[8px] text-stone-600 space-y-0.5">
                      <div>✓ 標準プランの全作業内容</div>
                      <div>✓ 外柵・敷石の高圧洗浄機クリーニング</div>
                      <div>✓ <strong>墓石撥水防汚コーティング施工</strong></div>
                      <div>✓ <strong>防草砂（固まる土）施工</strong></div>
                      <div>✓ 永代供養・改葬・墓じまい優先無料相談</div>
                    </div>
                  </div>

                  <div className="bg-stone-50 p-1.5 rounded border border-stone-200 text-[8px]">
                    <span className="font-bold text-stone-800 block mb-0.5">🔧 個別オプション対応</span>
                    文字の墨入れ（白・黒）／花立・線香皿ステンレス交換／樹木の剪定・伐採／墓じまい相談
                  </div>

                  <div className="p-1.5 bg-stone-50 rounded text-center text-[8.5px] text-emerald-900 font-bold border border-stone-200">
                    ※ お得な年間定期契約（年2〜4回）なら全プラン10%OFF
                  </div>
                </div>

                {/* 内側右面 */}
                <div className="p-3 flex flex-col justify-between bg-stone-50/50 rounded-xl space-y-2">
                  <h4 className="text-xs font-black text-stone-900 border-b-2 border-emerald-600 pb-1">
                    施工実績とお客さまの声
                  </h4>
                  <div className="grid grid-cols-2 gap-1.5">
                    <div className="border rounded overflow-hidden bg-white">
                      <img src="/images/grave_before.jpg" alt="Before" className="w-full h-14 object-cover" />
                      <span className="text-[7px] text-stone-500 block text-center py-0.5">作業前 (手入れ前)</span>
                    </div>
                    <div className="border-2 border-emerald-500 rounded overflow-hidden bg-white">
                      <img src="/images/grave_after.jpg" alt="After" className="w-full h-14 object-cover" />
                      <span className="text-[7px] text-emerald-800 font-bold block text-center py-0.5">作業完了 (献花・合掌) ✨</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="bg-white p-1.5 rounded border border-stone-200 text-[8px]">
                      <div className="flex justify-between font-bold text-amber-900">
                        <span>「届いた写真を見て家族で涙が出ました」</span>
                        <span className="text-amber-500">★★★★★</span>
                      </div>
                      <p className="text-stone-600 mt-0.5">東京から帰省できず心配でしたが、ピカピカになり生花が供えられた写真を見て本当に安心しました。（50代女性）</p>
                    </div>
                    <div className="bg-white p-1.5 rounded border border-stone-200 text-[8px]">
                      <div className="flex justify-between font-bold text-amber-900">
                        <span>「目地の点検所見まで添えていただき感謝」</span>
                        <span className="text-amber-500">★★★★★</span>
                      </div>
                      <p className="text-stone-600 mt-0.5">階段がつらくて困っていましたが、目地の状態まで報告していただき助かりました。（60代男性）</p>
                    </div>
                    <div className="bg-white p-1.5 rounded border border-stone-200 text-[8px]">
                      <div className="flex justify-between font-bold text-amber-900">
                        <span>「遠く離れていても親孝行ができました」</span>
                        <span className="text-amber-500">★★★★★</span>
                      </div>
                      <p className="text-stone-600 mt-0.5">仕事でなかなか帰省できませんでしたが、親族からも大変喜ばれました。（40代男性）</p>
                    </div>
                  </div>

                  <div className="bg-white p-2 rounded-lg border border-emerald-400 text-center">
                    <span className="text-[9px] font-bold text-emerald-900 block">お電話でのご相談・お見積りもお気軽に</span>
                    <span className="text-xs font-black text-emerald-800 block">📞 089-997-XXXX</span>
                    <span className="text-[7.5px] text-stone-500">受付時間: 9:00〜18:00（年中無休）</span>
                  </div>

                  <div className="bg-emerald-600 text-white p-2 rounded-lg text-center shadow-sm">
                    <span className="text-[11px] font-bold block">Web・お電話で簡単お申し込み</span>
                    <span className="text-[8.5px] text-emerald-100">スマホから3分で完了 / クレジットカード決済対応</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
