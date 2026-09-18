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
  FileText,
  Layers
} from 'lucide-react';

export default function FlyerPage() {
  const [activeTab, setActiveTab] = useState<'poster' | 'leaflet'>('poster');
  const [leafletSide, setLeafletSide] = useState<'outside' | 'inside'>('outside');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-stone-100 min-h-screen pb-20 text-stone-900">
      {/* 画面上部ツールバー（印刷時は非表示） */}
      <div className="bg-white border-b border-stone-200 sticky top-16 z-40 print:hidden shadow-xs">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-emerald-800 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>サイトへ戻る</span>
            </Link>
            <span className="text-stone-300">|</span>
            <span className="text-sm font-bold text-stone-900">販促チラシ・リーフレット叩き台ビューア</span>
          </div>

          {/* 切り替えタブ */}
          <div className="flex items-center gap-2 bg-stone-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('poster')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'poster'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              ① 縦置きポスター・A4チラシ
            </button>
            <button
              onClick={() => setActiveTab('leaflet')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'leaflet'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              ② A4両面三つ折りリーフレット
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 bg-stone-900 hover:bg-stone-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>印刷 / PDF出力</span>
          </button>
        </div>

        {activeTab === 'leaflet' && (
          <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-center gap-3 border-t border-stone-100 bg-emerald-50/50 text-xs">
            <span className="text-stone-500 font-medium">三つ折り面の切り替え:</span>
            <button
              onClick={() => setLeafletSide('outside')}
              className={`px-3 py-1 rounded-md font-bold transition-colors ${
                leafletSide === 'outside' ? 'bg-emerald-800 text-white' : 'bg-white text-stone-700 border border-stone-200'
              }`}
            >
              【外側3面】表紙・裏表紙（会社概要）・折り込み
            </button>
            <button
              onClick={() => setLeafletSide('inside')}
              className={`px-3 py-1 rounded-md font-bold transition-colors ${
                leafletSide === 'inside' ? 'bg-emerald-800 text-white' : 'bg-white text-stone-700 border border-stone-200'
              }`}
            >
              【内側3面】見開き（お悩み・プラン料金詳細・お客様の声）
            </button>
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-8">
        {/* ========================================================= */}
        {/* 1. 縦置きポスター・A4チラシ（片面） */}
        {/* ========================================================= */}
        {activeTab === 'poster' && (
          <div className="flex flex-col items-center">
            <div className="text-xs text-stone-500 mb-3 print:hidden">
              ※ 霊園管理事務所の窓口、寺院掲示板、石材店店頭、地域の案内ラックに掲示するポスター・A4チラシの叩き台です。
            </div>

            {/* A4ポスター用紙枠 (アスペクト比 1 : 1.414) */}
            <div className="w-full max-w-[760px] bg-white border border-stone-300 shadow-xl rounded-none p-8 sm:p-10 flex flex-col justify-between print:border-none print:shadow-none print:p-0 print:m-0">
              {/* 最上部：キャッチコピー帯 */}
              <div className="border-b-2 border-emerald-800 pb-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center">
                      <Flower2 className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-lg font-black tracking-tight text-stone-900 block leading-tight">ココロモウ</span>
                      <span className="text-[9px] text-stone-500 tracking-wider">お墓参り・お掃除代行プラットフォーム</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] bg-emerald-100 text-emerald-900 font-bold px-2.5 py-0.5 rounded-full">
                      愛媛県松山市・中予エリア対応
                    </span>
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <p className="text-xs sm:text-sm font-bold text-emerald-800 tracking-wider">
                    「忙しくて帰省できない」「高齢でお墓参りの階段がつらい」あなたへ
                  </p>
                  <h1 className="text-2xl sm:text-3xl font-black text-stone-900 mt-1 leading-tight tracking-tight">
                    ふるさとのお墓を、真心を込めて綺麗に。<br />
                    <span className="text-emerald-800">お墓参り・お掃除代行サービス</span>
                  </h1>
                </div>
              </div>

              {/* メインビジュアル：Before / After 実例写真 */}
              <div className="mb-6 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                <div className="text-center mb-3">
                  <span className="text-[11px] font-bold text-stone-700 bg-white px-3 py-1 rounded-full border border-stone-200 shadow-2xs">
                    【施工実績】宝塔寺 旭ヶ丘霊園 モデル施工例
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Before */}
                  <div className="relative rounded-xl overflow-hidden border border-stone-300">
                    <img
                      src="/images/grave_before.jpg"
                      alt="作業前のお墓"
                      className="w-full h-44 sm:h-52 object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-stone-900/85 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      作業前 (Before)
                    </div>
                    <div className="p-2 bg-white text-[10px] text-stone-600">
                      苔・水垢の付着、敷地内の落ち葉や枯れ草の堆積
                    </div>
                  </div>

                  {/* After */}
                  <div className="relative rounded-xl overflow-hidden border-2 border-emerald-600 shadow-sm">
                    <img
                      src="/images/grave_after.jpg"
                      alt="作業後のお墓"
                      className="w-full h-44 sm:h-52 object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-emerald-800 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      作業後 (After)
                    </div>
                    <div className="p-2 bg-emerald-50 text-[10px] text-emerald-950 font-semibold">
                      全面手作業除草・水洗い、季節の生花とお線香で合掌
                    </div>
                  </div>
                </div>
              </div>

              {/* 3つの安心ポイント */}
              <div className="grid grid-cols-3 gap-3 mb-6 text-center">
                <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-100">
                  <Camera className="w-5 h-5 text-emerald-800 mx-auto mb-1" />
                  <span className="font-bold text-[11px] text-emerald-950 block">写真付き完了報告</span>
                  <p className="text-[9px] text-stone-600 mt-0.5">作業前後の高解像度写真をWebでお届け</p>
                </div>
                <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-100">
                  <MapPin className="w-5 h-5 text-emerald-800 mx-auto mb-1" />
                  <span className="font-bold text-[11px] text-emerald-950 block">地元の確かなプロ</span>
                  <p className="text-[9px] text-stone-600 mt-0.5">松山お墓のトータルエージェント提携</p>
                </div>
                <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-100">
                  <ShieldCheck className="w-5 h-5 text-emerald-800 mx-auto mb-1" />
                  <span className="font-bold text-[11px] text-emerald-950 block">安心の事前明朗会計</span>
                  <p className="text-[9px] text-stone-600 mt-0.5">カード決済対応・追加請求一切なし</p>
                </div>
              </div>

              {/* 料金プラン概要 */}
              <div className="mb-6 bg-stone-900 text-white p-4 rounded-2xl">
                <div className="text-center mb-2.5">
                  <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider">
                    わかりやすい明朗会計（税込）
                  </span>
                  <h2 className="text-sm sm:text-base font-bold text-white">選べる3つの代行プラン</h2>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-stone-800 p-2.5 rounded-xl border border-stone-700">
                    <span className="text-[10px] text-stone-300 block">基本お参り・簡易清掃</span>
                    <span className="text-base font-extrabold text-amber-400 block mt-1">¥8,800</span>
                    <span className="text-[9px] text-stone-400">水拭き・落ち葉拾い・合掌</span>
                  </div>
                  <div className="bg-emerald-950 p-2.5 rounded-xl border-2 border-emerald-500 relative">
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[8px] font-bold px-1.5 py-0.2 rounded-full">
                      一番人気
                    </span>
                    <span className="text-[10px] text-emerald-200 block">標準お参り・徹底お掃除</span>
                    <span className="text-base font-extrabold text-amber-300 block mt-1">¥14,800</span>
                    <span className="text-[9px] text-emerald-300">徹底除草・水洗い・生花供養</span>
                  </div>
                  <div className="bg-stone-800 p-2.5 rounded-xl border border-stone-700">
                    <span className="text-[10px] text-stone-300 block">プレミアム美装</span>
                    <span className="text-base font-extrabold text-amber-400 block mt-1">¥29,800</span>
                    <span className="text-[9px] text-stone-400">高圧洗浄・防草施工・撥水</span>
                  </div>
                </div>
              </div>

              {/* 最下部：お問い合わせ・QRコード誘導 */}
              <div className="border-t-2 border-stone-200 pt-4 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-stone-700 font-bold">
                    <span>提携施工窓口: 株式会社トータルエージェント・パートナーズ</span>
                  </div>
                  <p className="text-[10px] text-stone-500">
                    〒790-0056 愛媛県松山市土居田町 / 宝塔寺旭ヶ丘霊園ほか市内全域対応
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <div className="flex items-center gap-1 bg-stone-100 px-2.5 py-1 rounded-md text-xs font-bold text-stone-800">
                      <Phone className="w-3.5 h-3.5 text-emerald-800" />
                      <span>089-997-XXXX</span>
                    </div>
                    <span className="text-[9px] text-stone-400">お電話でもご相談受付中</span>
                  </div>
                </div>

                {/* QRコード誘導 */}
                <div className="flex items-center gap-3 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 shrink-0">
                  <div className="w-14 h-14 bg-white border border-emerald-300 rounded-lg p-1 flex items-center justify-center">
                    <QrCode className="w-12 h-12 text-emerald-900" />
                  </div>
                  <div className="text-[10px]">
                    <span className="font-bold text-emerald-950 block">スマホで簡単</span>
                    <span className="text-emerald-800 block font-semibold">Webから24時間</span>
                    <span className="text-[9px] text-stone-500">今すぐお申し込み</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 2. A4両面三つ折りリーフレット（巻き三つ折り） */}
        {/* ========================================================= */}
        {activeTab === 'leaflet' && (
          <div className="flex flex-col items-center">
            <div className="text-xs text-stone-500 mb-3 print:hidden">
              ※ A4用紙（横向き）に印刷して3つに折るリーフレットの叩き台です。上部の切り替えボタンで「外側」と「内側」をご確認いただけます。
            </div>

            {/* リーフレット外側3面（折り込み面 ＋ 裏表紙 ＋ 表紙） */}
            {leafletSide === 'outside' && (
              <div className="w-full max-w-[980px] bg-white border border-stone-300 shadow-xl rounded-none p-6 grid grid-cols-1 md:grid-cols-3 gap-4 divide-y md:divide-y-0 md:divide-x divide-stone-200 print:border-none print:shadow-none print:p-0">
                {/* 1面：折り込み面（開いたときに最初に見える面） */}
                <div className="p-3 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded uppercase block w-fit mb-2">
                      ココロモウの想い
                    </span>
                    <h3 className="text-sm font-bold text-stone-900 leading-snug mb-3">
                      遠く離れていても、<br />ふるさとへの想いを繋ぎたい。
                    </h3>
                    <p className="text-[10px] text-stone-600 leading-relaxed mb-4">
                      核家族化や進学・就職により、ふるさとを離れて暮らす方が増えています。「お墓参りに行けずご先祖様に申し訳ない」「お墓が荒れていないか心配」という声にお応えするため、ココロモウは誕生しました。
                    </p>

                    <div className="space-y-3 pt-2">
                      <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                        <span className="text-[10px] font-bold text-stone-900 block mb-0.5">■ 単なる清掃ではなく「供養の心」</span>
                        <p className="text-[9px] text-stone-500 leading-relaxed">
                          雑草抜きや水拭きだけでなく、お線香をあげ、生花をお供えし、ご家族に代わって真心を込めて手を合わせます。
                        </p>
                      </div>

                      <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                        <span className="text-[10px] font-bold text-stone-900 block mb-0.5">■ 永代供養・墓じまいのご相談も</span>
                        <p className="text-[9px] text-stone-500 leading-relaxed">
                          将来のお墓の継承にお悩みの方には、宝塔寺旭ヶ丘霊園での永代供養墓や墓じまいのご相談も承ります。
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-stone-100 text-center">
                    <span className="text-[9px] text-stone-400">【内側へ続く 巻き三つ折り面】</span>
                  </div>
                </div>

                {/* 2面：裏表紙（背面） */}
                <div className="p-3 flex flex-col justify-between bg-stone-50/50 rounded-xl">
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Flower2 className="w-4 h-4 text-emerald-800" />
                      <span className="font-bold text-xs text-stone-900">ココロモウ 提携窓口</span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-stone-200 space-y-2 mb-4">
                      <span className="text-[9px] bg-emerald-100 text-emerald-900 font-bold px-1.5 py-0.5 rounded">
                        愛媛県松山エリア 提携パートナー
                      </span>
                      <p className="text-xs font-bold text-stone-900">
                        株式会社トータルエージェント・パートナーズ
                      </p>
                      <p className="text-[9px] text-stone-500">
                        〒790-0056 愛媛県松山市土居田町<br />
                        対応エリア：松山市全域・東温市・伊予市・松前町・砥部町
                      </p>
                      <div className="pt-1 flex items-center gap-1 text-xs font-bold text-emerald-900">
                        <Phone className="w-3.5 h-3.5" />
                        <span>TEL: 089-997-XXXX</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-[9px] text-stone-600">
                      <p className="font-bold text-stone-800">【対応霊園・墓地】</p>
                      <p>・宝塔寺 旭ヶ丘霊園（朝日ヶ丘）</p>
                      <p>・松山市営霊園各所（梅津寺・大明神ほか）</p>
                      <p>・松山市内各寺院墓地・共同墓地</p>
                    </div>
                  </div>

                  {/* QRコード */}
                  <div className="pt-4 border-t border-stone-200 text-center">
                    <div className="w-16 h-16 bg-white border border-stone-300 rounded-xl p-1 mx-auto mb-1.5 flex items-center justify-center shadow-2xs">
                      <QrCode className="w-14 h-14 text-stone-900" />
                    </div>
                    <span className="text-[10px] font-bold text-stone-900 block">Webサイトはこちら</span>
                    <span className="text-[8px] text-stone-400">スマートフォンから24時間受付中</span>
                  </div>
                </div>

                {/* 3面：表紙（リーフレットの顔） */}
                <div className="p-3 flex flex-col justify-between bg-gradient-to-b from-stone-900 to-emerald-950 text-white rounded-xl">
                  <div>
                    <div className="flex items-center gap-1.5 mb-6">
                      <div className="w-6 h-6 rounded-full bg-emerald-700 flex items-center justify-center text-white">
                        <Flower2 className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-bold text-xs tracking-wider">ココロモウ</span>
                    </div>

                    <span className="text-[10px] text-amber-300 font-bold tracking-wider block mb-2">
                      愛媛・松山のお墓参り代行
                    </span>

                    <h2 className="text-xl font-extrabold leading-tight tracking-tight mb-4">
                      遠く離れていても、<br />
                      ふるさとのお墓を<br />
                      真心を込めて守る。
                    </h2>

                    <p className="text-[9px] text-stone-300 leading-relaxed font-light mb-4">
                      地元の専門業者がご家族に代わってお墓を清掃。鮮明な写真レポートをお届けする安心の代行サービスです。
                    </p>
                  </div>

                  {/* 表紙のBefore/Afterミニ写真 */}
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-1.5">
                      <div className="rounded-lg overflow-hidden border border-white/20">
                        <img src="/images/grave_before.jpg" alt="Before" className="w-full h-16 object-cover" />
                        <span className="text-[7px] bg-stone-900 text-white block text-center py-0.5">作業前</span>
                      </div>
                      <div className="rounded-lg overflow-hidden border border-emerald-400">
                        <img src="/images/grave_after.jpg" alt="After" className="w-full h-16 object-cover" />
                        <span className="text-[7px] bg-emerald-700 text-white block text-center py-0.5 font-bold">作業後</span>
                      </div>
                    </div>
                    <div className="pt-2 text-center text-[8px] text-emerald-300">
                      宝塔寺旭ヶ丘霊園など松山市内対応
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* リーフレット内側3面（見開きワイド展開） */}
            {leafletSide === 'inside' && (
              <div className="w-full max-w-[980px] bg-white border border-stone-300 shadow-xl rounded-none p-6 grid grid-cols-1 md:grid-cols-3 gap-4 divide-y md:divide-y-0 md:divide-x divide-stone-200 print:border-none print:shadow-none print:p-0">
                {/* 内側左面：お悩みとサービスの流れ */}
                <div className="p-3 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-extrabold text-emerald-900 uppercase tracking-wider mb-2">
                      こんなお悩みありませんか？
                    </h3>
                    <ul className="space-y-1.5 text-[10px] text-stone-700 mb-4">
                      <li className="flex items-start gap-1">
                        <span className="text-rose-500 font-bold">✓</span>
                        <span>遠方に住んでいて年1回も帰省できない</span>
                      </li>
                      <li className="flex items-start gap-1">
                        <span className="text-rose-500 font-bold">✓</span>
                        <span>高齢になり階段や坂道のあるお墓参りがつらい</span>
                      </li>
                      <li className="flex items-start gap-1">
                        <span className="text-rose-500 font-bold">✓</span>
                        <span>お盆や命日にお墓が荒れていないか心配</span>
                      </li>
                    </ul>

                    <h4 className="text-[11px] font-bold text-stone-900 mb-2 border-b border-stone-200 pb-1">
                      ご利用の流れ（簡単4ステップ）
                    </h4>
                    <div className="space-y-2 text-[9px]">
                      <div className="flex gap-2">
                        <span className="w-4 h-4 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold shrink-0 text-[8px]">1</span>
                        <div>
                          <span className="font-bold text-stone-900">Webからお申し込み</span>
                          <p className="text-stone-500">霊園名とご希望日を入力</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <span className="w-4 h-4 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold shrink-0 text-[8px]">2</span>
                        <div>
                          <span className="font-bold text-stone-900">カード事前決済</span>
                          <p className="text-stone-500">Stripeによる安心の決済</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <span className="w-4 h-4 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold shrink-0 text-[8px]">3</span>
                        <div>
                          <span className="font-bold text-stone-900">現地作業・お参り</span>
                          <p className="text-stone-500">職人が真心を込めて清掃</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <span className="w-4 h-4 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold shrink-0 text-[8px]">4</span>
                        <div>
                          <span className="font-bold text-stone-900">写真レポート納品</span>
                          <p className="text-stone-500">スマホで仕上がりを確認</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-100 text-[8px] text-stone-400 text-center">
                    ココロモウ お墓参り・お掃除代行
                  </div>
                </div>

                {/* 内側中央面：選べる3つのプランと料金詳細 */}
                <div className="p-3 flex flex-col justify-between bg-stone-50/60 rounded-xl">
                  <div>
                    <h3 className="text-xs font-extrabold text-stone-900 uppercase tracking-wider text-center mb-1">
                      選べる3つのサービスプラン
                    </h3>
                    <p className="text-[9px] text-stone-500 text-center mb-3">明朗会計・追加料金なし（税込）</p>

                    <div className="space-y-2.5">
                      {/* 基本プラン */}
                      <div className="bg-white p-2.5 rounded-lg border border-stone-200">
                        <div className="flex justify-between items-baseline">
                          <span className="text-[10px] font-bold text-stone-900">基本お参りプラン</span>
                          <span className="text-xs font-black text-emerald-900">¥8,800</span>
                        </div>
                        <p className="text-[8px] text-stone-500 mt-0.5">
                          落ち葉拾い・墓石水拭き・お線香合掌・完了写真
                        </p>
                      </div>

                      {/* 標準プラン */}
                      <div className="bg-emerald-50 p-2.5 rounded-lg border-2 border-emerald-600 shadow-2xs">
                        <div className="flex justify-between items-baseline">
                          <div>
                            <span className="text-[7px] bg-emerald-600 text-white px-1 rounded font-bold mr-1">人気</span>
                            <span className="text-[10px] font-bold text-emerald-950">標準徹底お掃除プラン</span>
                          </div>
                          <span className="text-xs font-black text-emerald-950">¥14,800</span>
                        </div>
                        <p className="text-[8px] text-emerald-900 mt-0.5 font-medium">
                          敷地内全面手作業除草・水垢コケ落とし・生花（1対）とお線香・詳細点検写真
                        </p>
                      </div>

                      {/* プレミアムプラン */}
                      <div className="bg-white p-2.5 rounded-lg border border-stone-200">
                        <div className="flex justify-between items-baseline">
                          <span className="text-[10px] font-bold text-stone-900">プレミアム美装プラン</span>
                          <span className="text-xs font-black text-emerald-900">¥29,800</span>
                        </div>
                        <p className="text-[8px] text-stone-500 mt-0.5">
                          標準作業＋高圧洗浄＋墓石専用撥水コーティング＋防草施工＋永代供養相談
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 text-center text-[8px] text-stone-400">
                    ※ 墓地の広さや特記事項にも柔軟に対応いたします
                  </div>
                </div>

                {/* 内側右面：Before/After と お客様の声 */}
                <div className="p-3 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-extrabold text-stone-900 mb-2">
                      実際の施工例とお客さまの声
                    </h3>

                    {/* 実例写真 */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div>
                        <img src="/images/grave_before.jpg" alt="Before" className="w-full h-16 object-cover rounded border" />
                        <span className="text-[8px] text-stone-500 block text-center mt-0.5">苔・落ち葉堆積</span>
                      </div>
                      <div>
                        <img src="/images/grave_after.jpg" alt="After" className="w-full h-16 object-cover rounded border border-emerald-500" />
                        <span className="text-[8px] text-emerald-800 font-bold block text-center mt-0.5">清掃・献花完了</span>
                      </div>
                    </div>

                    {/* お客様の声抜粋 */}
                    <div className="space-y-2 text-[9px] bg-stone-50 p-2 rounded-lg border border-stone-200">
                      <div>
                        <span className="font-bold text-stone-900 block">「思わず涙が出ました」</span>
                        <p className="text-stone-600 leading-snug text-[8px]">
                          東京在住でなかなか松山へ帰省できず心配でしたが、届いた写真を見て綺麗になった姿に感動しました。（50代女性・宝塔寺旭ヶ丘霊園）
                        </p>
                      </div>
                      <div className="border-t border-stone-200 pt-1.5">
                        <span className="font-bold text-stone-900 block">「安心感が違います」</span>
                        <p className="text-stone-600 leading-snug text-[8px]">
                          足腰が悪く困っていましたが、目地の点検メモまで添えていただき本当に親切でした。（60代男性）
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-[8px] text-stone-400">お申し込みはWeb・お電話から</span>
                    <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-900">
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Web受付中</span>
                    </div>
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
