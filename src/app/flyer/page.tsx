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
  Sun,
  Smile
} from 'lucide-react';

export default function FlyerPage() {
  const [activeTab, setActiveTab] = useState<'poster' | 'leaflet'>('poster');
  const [leafletSide, setLeafletSide] = useState<'outside' | 'inside'>('outside');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-stone-100 min-h-screen pb-20 text-stone-900 font-sans">
      {/* 画面上部ツールバー（印刷時は非表示） */}
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
            <span className="text-sm font-bold text-stone-900">販促チラシ・リーフレット叩き台ビューア</span>
            <span className="text-[11px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full">
              ✨ 明るいブライトカラー版
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

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>印刷 / PDF出力</span>
          </button>
        </div>

        {activeTab === 'leaflet' && (
          <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-center gap-3 border-t border-stone-100 bg-amber-50/60 text-xs">
            <span className="text-stone-600 font-bold">三つ折り面の切り替え:</span>
            <button
              onClick={() => setLeafletSide('outside')}
              className={`px-3 py-1 rounded-md font-bold transition-colors ${
                leafletSide === 'outside' ? 'bg-emerald-600 text-white' : 'bg-white text-stone-700 border border-stone-300'
              }`}
            >
              【外側3面】表紙・裏表紙（会社概要）・折り込み
            </button>
            <button
              onClick={() => setLeafletSide('inside')}
              className={`px-3 py-1 rounded-md font-bold transition-colors ${
                leafletSide === 'inside' ? 'bg-emerald-600 text-white' : 'bg-white text-stone-700 border border-stone-300'
              }`}
            >
              【内側3面】見開きワイド（お悩み・3つのプラン詳細・お客様の声）
            </button>
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-8">
        {/* ========================================================= */}
        {/* 1. 縦置きポスター・A4チラシ（片面） - 明るく気持ちの良い配色 */}
        {/* ========================================================= */}
        {activeTab === 'poster' && (
          <div className="flex flex-col items-center">
            <div className="text-xs text-stone-500 mb-3 print:hidden">
              ※ 青空や若草色、やさしい山吹色を使い、清潔感と温かみがあってパッと目を引くポスター・チラシです。
            </div>

            {/* A4ポスター用紙枠 */}
            <div className="w-full max-w-[760px] bg-white border border-stone-300 shadow-xl rounded-2xl overflow-hidden p-8 sm:p-10 flex flex-col justify-between print:border-none print:shadow-none print:p-0 print:m-0 print:rounded-none">
              {/* 最上部：晴れやかなグラデーションヘッダー */}
              <div className="relative bg-gradient-to-r from-emerald-600 via-teal-500 to-sky-500 -mx-8 -mt-8 sm:-mx-10 sm:-mt-10 p-6 sm:p-8 text-white mb-6 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-white text-emerald-700 flex items-center justify-center shadow-md">
                      <Flower2 className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xl font-black tracking-tight block leading-tight">ココロモウ</span>
                      <span className="text-[10px] text-emerald-100 tracking-wider">お墓参り・お掃除代行プラットフォーム</span>
                    </div>
                  </div>
                  <span className="bg-amber-400 text-stone-950 font-black text-xs px-3 py-1 rounded-full shadow-md">
                    愛媛・松山市内 霊園対応
                  </span>
                </div>

                <div className="text-center mt-3">
                  <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-xs px-4 py-1 rounded-full text-xs font-bold mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>「忙しくて帰省できない」「高齢でお墓参りが大変」なあなたへ</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight drop-shadow-sm">
                    ふるさとのお墓を、真心を込めてピカピカに。<br />
                    <span className="text-amber-300">お墓参り・お掃除代行サービス</span>
                  </h1>
                </div>
              </div>

              {/* メインビジュアル：Before / After 実例写真 */}
              <div className="mb-6 bg-gradient-to-b from-emerald-50/70 to-amber-50/40 p-5 rounded-2xl border border-emerald-100">
                <div className="flex items-center justify-between mb-3 px-1">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-900 bg-white px-3 py-1 rounded-full border border-emerald-200 shadow-2xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>【施工実績】宝塔寺 旭ヶ丘霊園 モデル施工例</span>
                  </span>
                  <span className="text-xs font-extrabold text-amber-700 bg-amber-100/80 px-2.5 py-0.5 rounded-full">
                    見違えるほどの仕上がり！
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Before */}
                  <div className="relative rounded-xl overflow-hidden border border-stone-300 shadow-xs group bg-white">
                    <img
                      src="/images/grave_before.jpg"
                      alt="作業前のお墓"
                      className="w-full h-44 sm:h-52 object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-stone-800/90 text-white text-[10px] font-bold px-2.5 py-0.5 rounded shadow">
                      作業前 (Before)
                    </div>
                    <div className="p-2.5 bg-stone-50 text-[10px] text-stone-600">
                      苔・水垢の付着、敷地内に散乱した落ち葉や枯れ草
                    </div>
                  </div>

                  {/* After */}
                  <div className="relative rounded-xl overflow-hidden border-2 border-emerald-500 shadow-md group bg-white ring-2 ring-emerald-500/20">
                    <img
                      src="/images/grave_after.jpg"
                      alt="作業後のお墓"
                      className="w-full h-44 sm:h-52 object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded shadow">
                      作業完了 (After)
                    </div>
                    <div className="p-2.5 bg-emerald-50/90 text-[10px] text-emerald-950 font-bold flex items-center justify-between">
                      <span>全面除草・専用水洗い・生花とお線香</span>
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    </div>
                  </div>
                </div>
              </div>

              {/* 3つの安心・満足ポイント（明るく親しみやすいカード） */}
              <div className="grid grid-cols-3 gap-3 mb-6 text-center">
                <div className="bg-sky-50 p-3 rounded-xl border border-sky-200">
                  <div className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center mx-auto mb-1.5 shadow-2xs">
                    <Camera className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-xs text-sky-950 block">鮮明な写真報告</span>
                  <p className="text-[10px] text-stone-600 mt-0.5 leading-tight">作業前後の高画質写真をスマホにお届け</p>
                </div>

                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto mb-1.5 shadow-2xs">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-xs text-emerald-950 block">地元の確かなプロ</span>
                  <p className="text-[10px] text-stone-600 mt-0.5 leading-tight">松山お墓のトータルエージェント提携</p>
                </div>

                <div className="bg-amber-50 p-3 rounded-xl border border-amber-200">
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center mx-auto mb-1.5 shadow-2xs">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-xs text-amber-950 block">安心の明朗会計</span>
                  <p className="text-[10px] text-stone-600 mt-0.5 leading-tight">カード即時決済・追加料金一切なし</p>
                </div>
              </div>

              {/* 料金プラン概要（明るく見やすいカードデザイン） */}
              <div className="mb-6 bg-stone-50 border border-stone-200 p-5 rounded-2xl">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded">
                      明朗会計（税込）
                    </span>
                    <h2 className="text-base font-extrabold text-stone-900 mt-0.5">選べる3つの代行プラン</h2>
                  </div>
                  <span className="text-xs text-stone-500 font-medium">ご予算やお墓の状態に合わせて選べます</span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center text-xs">
                  {/* 基本プラン */}
                  <div className="bg-white p-3 rounded-xl border border-stone-200 shadow-2xs flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-stone-800 block">基本お参りプラン</span>
                      <span className="text-lg font-black text-stone-900 block mt-1">¥8,800</span>
                    </div>
                    <p className="text-[9px] text-stone-500 mt-1">落ち葉拾い・墓石水拭き・お線香合掌・写真報告</p>
                  </div>

                  {/* 標準プラン（一番人気） */}
                  <div className="bg-gradient-to-b from-amber-50 to-white p-3 rounded-xl border-2 border-amber-400 shadow-sm flex flex-col justify-between relative">
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-amber-500 text-stone-950 text-[9px] font-black px-2 py-0.5 rounded-full shadow-2xs">
                      ★ 一番人気
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-amber-950 block mt-1">標準お参り・徹底お掃除</span>
                      <span className="text-xl font-black text-emerald-800 block mt-0.5">¥14,800</span>
                    </div>
                    <p className="text-[9px] text-stone-700 font-semibold mt-1">全面手作業除草・水洗い・生花1対とお線香</p>
                  </div>

                  {/* プレミアムプラン */}
                  <div className="bg-white p-3 rounded-xl border border-stone-200 shadow-2xs flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-stone-800 block">プレミアム美装プラン</span>
                      <span className="text-lg font-black text-stone-900 block mt-1">¥29,800</span>
                    </div>
                    <p className="text-[9px] text-stone-500 mt-1">高圧洗浄・墓石専用撥水コーティング・防草施工</p>
                  </div>
                </div>
              </div>

              {/* 最下部：お問い合わせ・お申し込み（明るく目立つCTA帯） */}
              <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 p-4 rounded-2xl border border-emerald-200 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-950 font-bold">
                    <BuildingIcon className="w-3.5 h-3.5 text-emerald-700" />
                    <span>提携窓口: 株式会社トータルエージェント・パートナーズ</span>
                  </div>
                  <p className="text-[10px] text-stone-600">
                    愛媛県松山市土居田町 / 宝塔寺旭ヶ丘霊園ほか市内霊園全域
                  </p>
                  <div className="flex items-center gap-2 pt-0.5">
                    <div className="inline-flex items-center gap-1 bg-white px-3 py-1 rounded-lg text-xs font-black text-emerald-900 border border-emerald-300 shadow-2xs">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>089-997-XXXX</span>
                    </div>
                    <span className="text-[10px] text-stone-500 font-medium">お電話相談受付中</span>
                  </div>
                </div>

                {/* QRコード誘導 */}
                <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border-2 border-emerald-500 shadow-sm shrink-0">
                  <div className="w-14 h-14 bg-stone-50 rounded-lg p-0.5 flex items-center justify-center">
                    <QrCode className="w-13 h-13 text-emerald-900" />
                  </div>
                  <div className="text-left">
                    <span className="text-[11px] font-black text-emerald-950 block">スマホで24時間</span>
                    <span className="text-[10px] font-bold text-amber-600 block">簡単Webお申し込み</span>
                    <span className="text-[8px] text-stone-400">右のQRコードから</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 2. A4両面三つ折りリーフレット - 明るく心温まる配色 */}
        {/* ========================================================= */}
        {activeTab === 'leaflet' && (
          <div className="flex flex-col items-center">
            <div className="text-xs text-stone-500 mb-3 print:hidden">
              ※ A4用紙（横向き）に印刷して3つに折るリーフレットです。明るく清潔で、手に取りたくなるデザインに仕上げています。
            </div>

            {/* リーフレット外側3面 */}
            {leafletSide === 'outside' && (
              <div className="w-full max-w-[980px] bg-white border border-stone-300 shadow-xl rounded-2xl overflow-hidden p-6 grid grid-cols-1 md:grid-cols-3 gap-4 divide-y md:divide-y-0 md:divide-x divide-stone-200 print:border-none print:shadow-none print:p-0 print:rounded-none">
                {/* 1面：折り込み面（開いたときに最初に見える面） */}
                <div className="p-3 flex flex-col justify-between bg-gradient-to-b from-white to-emerald-50/40 rounded-xl">
                  <div>
                    <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full uppercase block w-fit mb-2">
                      ココロモウの想い
                    </span>
                    <h3 className="text-sm font-extrabold text-stone-900 leading-snug mb-3">
                      遠く離れていても、<br />
                      ふるさとへの感謝を繋ぎたい。
                    </h3>
                    <p className="text-[10px] text-stone-600 leading-relaxed mb-4">
                      「お墓参りに行けずご先祖様に申し訳ない」「お墓が荒れていないか心配」というご家族の想いに応えるため、ココロモウは生まれました。
                    </p>

                    <div className="space-y-2.5">
                      <div className="bg-white p-2.5 rounded-lg border border-emerald-100 shadow-2xs">
                        <div className="flex items-center gap-1 font-bold text-[10px] text-emerald-900 mb-0.5">
                          <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />
                          <span>単なる清掃ではなく「供養の心」</span>
                        </div>
                        <p className="text-[9px] text-stone-600 leading-relaxed">
                          雑草抜きや水拭きだけでなく、お線香を焚き、生花をお供えし、ご家族に代わって真心を込めて手を合わせます。
                        </p>
                      </div>

                      <div className="bg-white p-2.5 rounded-lg border border-amber-100 shadow-2xs">
                        <div className="flex items-center gap-1 font-bold text-[10px] text-amber-900 mb-0.5">
                          <Flower2 className="w-3.5 h-3.5 text-amber-600" />
                          <span>永代供養・墓じまいのご相談も</span>
                        </div>
                        <p className="text-[9px] text-stone-600 leading-relaxed">
                          宝塔寺旭ヶ丘霊園での永代供養墓や、将来の墓じまい・送骨供養のご相談もワンストップでお受けいたします。
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-100 text-center">
                    <span className="text-[9px] text-emerald-700 font-bold">▶ ページを開いて詳しいプランをご覧ください</span>
                  </div>
                </div>

                {/* 2面：裏表紙（背面・窓口案内とQRコード） */}
                <div className="p-3 flex flex-col justify-between bg-stone-50/70 rounded-xl">
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                        <Flower2 className="w-3 h-3" />
                      </div>
                      <span className="font-bold text-xs text-stone-900">ココロモウ 提携窓口</span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-stone-200 space-y-2 mb-3 shadow-2xs">
                      <span className="text-[9px] bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
                        愛媛・松山エリア パートナー
                      </span>
                      <p className="text-xs font-bold text-stone-900">
                        株式会社トータルエージェント・パートナーズ
                      </p>
                      <p className="text-[9px] text-stone-500 leading-relaxed">
                        〒790-0056 愛媛県松山市土居田町<br />
                        対応エリア：松山市全域・東温市・伊予市・松前町・砥部町
                      </p>
                      <div className="pt-1 flex items-center gap-1 text-xs font-bold text-emerald-800">
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        <span>TEL: 089-997-XXXX</span>
                      </div>
                    </div>

                    <div className="bg-white p-2.5 rounded-xl border border-stone-200 text-[9px] text-stone-600 space-y-1">
                      <p className="font-bold text-stone-800">【主な対応霊園】</p>
                      <p>・宝塔寺 旭ヶ丘霊園（朝日ヶ丘）</p>
                      <p>・松山市営霊園（梅津寺・大明神ほか）</p>
                      <p>・松山市内各寺院墓地・共同墓地</p>
                    </div>
                  </div>

                  {/* QRコード */}
                  <div className="pt-3 border-t border-stone-200 text-center">
                    <div className="w-16 h-16 bg-white border border-emerald-300 rounded-xl p-1 mx-auto mb-1 flex items-center justify-center shadow-xs">
                      <QrCode className="w-14 h-14 text-emerald-900" />
                    </div>
                    <span className="text-[10px] font-bold text-stone-900 block">Webサイトはこちら</span>
                    <span className="text-[8px] text-stone-500">24時間いつでも簡単お申し込み</span>
                  </div>
                </div>

                {/* 3面：表紙（明るく爽やかなエメラルド＆木漏れ日のデザイン） */}
                <div className="p-4 flex flex-col justify-between bg-gradient-to-b from-emerald-700 via-teal-700 to-emerald-900 text-white rounded-xl shadow-inner relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-full bg-white text-emerald-700 flex items-center justify-center shadow-xs">
                          <Flower2 className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-black text-xs tracking-wider">ココロモウ</span>
                      </div>
                      <span className="text-[9px] bg-amber-400 text-stone-950 font-bold px-2 py-0.5 rounded-full">
                        愛媛・松山版
                      </span>
                    </div>

                    <div className="mt-2 mb-3">
                      <span className="text-[10px] text-amber-300 font-extrabold tracking-wider block mb-1">
                        お墓参り・お掃除代行サービス
                      </span>
                      <h2 className="text-lg font-black leading-snug tracking-tight">
                        遠く離れていても、<br />
                        ふるさとのお墓を<br />
                        真心を込めて守る。
                      </h2>
                    </div>

                    <p className="text-[9px] text-emerald-100 leading-relaxed font-light mb-3">
                      松山の地元専門パートナーがご家族に代わってお墓を清掃。鮮明な写真レポートをお届けします。
                    </p>
                  </div>

                  {/* 表紙の写真対比 */}
                  <div className="relative z-10 space-y-1.5">
                    <div className="grid grid-cols-2 gap-1.5 bg-black/20 p-1.5 rounded-lg backdrop-blur-2xs">
                      <div className="rounded overflow-hidden border border-white/30">
                        <img src="/images/grave_before.jpg" alt="Before" className="w-full h-15 object-cover" />
                        <span className="text-[7px] bg-stone-900/90 text-white block text-center py-0.5">作業前</span>
                      </div>
                      <div className="rounded overflow-hidden border-2 border-amber-400 shadow-xs">
                        <img src="/images/grave_after.jpg" alt="After" className="w-full h-15 object-cover" />
                        <span className="text-[7px] bg-emerald-600 text-white block text-center py-0.5 font-bold">作業後</span>
                      </div>
                    </div>
                    <div className="text-center text-[8px] text-emerald-200">
                      宝塔寺旭ヶ丘霊園など市内各霊園に対応
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* リーフレット内側3面（見開きワイド展開） - 明るく読みやすいレイアウト */}
            {leafletSide === 'inside' && (
              <div className="w-full max-w-[980px] bg-white border border-stone-300 shadow-xl rounded-2xl overflow-hidden p-6 grid grid-cols-1 md:grid-cols-3 gap-4 divide-y md:divide-y-0 md:divide-x divide-stone-200 print:border-none print:shadow-none print:p-0 print:rounded-none">
                {/* 内側左面：お悩みとサービスの流れ */}
                <div className="p-3 flex flex-col justify-between">
                  <div>
                    <div className="inline-flex items-center gap-1 text-[9px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full mb-2">
                      <span>お墓のお悩み解決</span>
                    </div>
                    <h3 className="text-xs font-black text-stone-900 mb-2">
                      こんなお困りごとはございませんか？
                    </h3>
                    <ul className="space-y-1.5 text-[10px] text-stone-700 mb-4 bg-rose-50/50 p-2.5 rounded-xl border border-rose-100">
                      <li className="flex items-start gap-1">
                        <span className="text-rose-500 font-bold">✓</span>
                        <span>遠方に住んでいてなかなか松山へ帰省できない</span>
                      </li>
                      <li className="flex items-start gap-1">
                        <span className="text-rose-500 font-bold">✓</span>
                        <span>高齢になり階段や急な坂のある墓参りがつらい</span>
                      </li>
                      <li className="flex items-start gap-1">
                        <span className="text-rose-500 font-bold">✓</span>
                        <span>お盆や命日にお墓が荒れていないか心配</span>
                      </li>
                    </ul>

                    <h4 className="text-[11px] font-bold text-stone-900 mb-2 border-b border-emerald-200 pb-1 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>ご利用の流れ（簡単4ステップ）</span>
                    </h4>
                    <div className="space-y-2 text-[9px]">
                      <div className="flex gap-2 items-center bg-stone-50 p-1.5 rounded-lg">
                        <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0 text-[8px]">1</span>
                        <div>
                          <span className="font-bold text-stone-900">Web・お電話でお申し込み</span>
                          <p className="text-stone-500">霊園名・区画をご指定</p>
                        </div>
                      </div>
                      <div className="flex gap-2 items-center bg-stone-50 p-1.5 rounded-lg">
                        <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0 text-[8px]">2</span>
                        <div>
                          <span className="font-bold text-stone-900">安全な事前決済</span>
                          <p className="text-stone-500">クレジットカード決済対応</p>
                        </div>
                      </div>
                      <div className="flex gap-2 items-center bg-stone-50 p-1.5 rounded-lg">
                        <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0 text-[8px]">3</span>
                        <div>
                          <span className="font-bold text-stone-900">現地清掃・真心合掌</span>
                          <p className="text-stone-500">専門スタッフが丁寧に施工</p>
                        </div>
                      </div>
                      <div className="flex gap-2 items-center bg-stone-50 p-1.5 rounded-lg">
                        <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0 text-[8px]">4</span>
                        <div>
                          <span className="font-bold text-stone-900">写真レポート納品</span>
                          <p className="text-stone-500">スマホで仕上がりを確認</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 text-[8px] text-stone-400 text-center">
                    ココロモウ お墓参り・お掃除代行プラットフォーム
                  </div>
                </div>

                {/* 内側中央面：選べる3つのプランと料金詳細 */}
                <div className="p-3 flex flex-col justify-between bg-emerald-50/30 rounded-xl">
                  <div>
                    <div className="text-center mb-2">
                      <span className="text-[9px] bg-emerald-600 text-white font-bold px-2.5 py-0.5 rounded-full">
                        明朗会計・追加料金なし
                      </span>
                      <h3 className="text-xs font-black text-stone-900 mt-1">
                        選べる3つのサービスプラン
                      </h3>
                    </div>

                    <div className="space-y-2">
                      {/* 基本プラン */}
                      <div className="bg-white p-2.5 rounded-xl border border-stone-200 shadow-2xs">
                        <div className="flex justify-between items-baseline">
                          <span className="text-[10px] font-bold text-stone-900">基本お参りプラン</span>
                          <span className="text-xs font-black text-stone-900">¥8,800</span>
                        </div>
                        <p className="text-[8px] text-stone-500 mt-0.5 leading-tight">
                          落ち葉拾い・墓石水拭き・お線香合掌・完了写真
                        </p>
                      </div>

                      {/* 標準プラン（一番人気） */}
                      <div className="bg-gradient-to-b from-amber-50 to-white p-2.5 rounded-xl border-2 border-amber-400 shadow-xs">
                        <div className="flex justify-between items-baseline">
                          <div className="flex items-center gap-1">
                            <span className="text-[7px] bg-amber-500 text-stone-950 px-1.5 py-0.2 rounded font-black">一番人気</span>
                            <span className="text-[10px] font-bold text-amber-950">標準徹底お掃除プラン</span>
                          </div>
                          <span className="text-sm font-black text-emerald-800">¥14,800</span>
                        </div>
                        <p className="text-[8px] text-emerald-950 font-semibold mt-0.5 leading-tight">
                          全面手作業除草・水垢コケ落とし・生花（1対）とお線香・詳細点検写真
                        </p>
                      </div>

                      {/* プレミアムプラン */}
                      <div className="bg-white p-2.5 rounded-xl border border-stone-200 shadow-2xs">
                        <div className="flex justify-between items-baseline">
                          <span className="text-[10px] font-bold text-stone-900">プレミアム美装プラン</span>
                          <span className="text-xs font-black text-stone-900">¥29,800</span>
                        </div>
                        <p className="text-[8px] text-stone-500 mt-0.5 leading-tight">
                          高圧洗浄・墓石撥水コーティング・防草施工・永代供養相談
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 text-center text-[8px] text-stone-500 bg-white p-1.5 rounded-lg border border-emerald-100">
                    ※ 墓地の広さ・追加のご要望にも柔軟に対応いたします
                  </div>
                </div>

                {/* 内側右面：Before/After と お客様の声 */}
                <div className="p-3 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-black text-stone-900 mb-2 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                      <span>施工例とお客さまの声</span>
                    </h3>

                    {/* 実例写真 */}
                    <div className="grid grid-cols-2 gap-2 mb-2.5">
                      <div className="border rounded-lg overflow-hidden bg-stone-50">
                        <img src="/images/grave_before.jpg" alt="Before" className="w-full h-15 object-cover" />
                        <span className="text-[8px] text-stone-500 block text-center py-0.5 bg-stone-100">Before (手入れ前)</span>
                      </div>
                      <div className="border-2 border-emerald-500 rounded-lg overflow-hidden bg-emerald-50">
                        <img src="/images/grave_after.jpg" alt="After" className="w-full h-15 object-cover" />
                        <span className="text-[8px] text-emerald-800 font-bold block text-center py-0.5 bg-emerald-100">After (清掃・献花後)</span>
                      </div>
                    </div>

                    {/* お客様の声 */}
                    <div className="space-y-1.5 bg-amber-50/50 p-2.5 rounded-xl border border-amber-200">
                      <div>
                        <div className="flex items-center gap-1 text-[9px] font-bold text-amber-950 mb-0.5">
                          <Smile className="w-3 h-3 text-amber-600" />
                          <span>「届いた写真を見て涙が出ました」</span>
                        </div>
                        <p className="text-stone-600 text-[8px] leading-tight">
                          東京在住で帰省できず心配でしたが、お墓がピカピカになりお花が供えられた写真に家族で感動しました。（50代女性・宝塔寺旭ヶ丘霊園）
                        </p>
                      </div>
                      <div className="border-t border-amber-200/60 pt-1">
                        <div className="flex items-center gap-1 text-[9px] font-bold text-amber-950 mb-0.5">
                          <Smile className="w-3 h-3 text-amber-600" />
                          <span>「点検所見まで親切でした」</span>
                        </div>
                        <p className="text-stone-600 text-[8px] leading-tight">
                          足腰が悪く参拝が難しかったのですが、目地の劣化点検まで添えていただき安心でした。（60代男性）
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-[8px] text-stone-500">お申し込みはWeb・お電話で</span>
                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      年中無休で受付中
                    </span>
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

function BuildingIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M8 10h.01" />
      <path d="M16 10h.01" />
      <path d="M8 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M16 18h.01" />
    </svg>
  );
}
