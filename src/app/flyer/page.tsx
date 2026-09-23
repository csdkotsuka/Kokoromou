'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  const [activeTab, setActiveTab] = useState<'poster' | 'leaflet' | 'dm'>('poster');
  const [leafletSide, setLeafletSide] = useState<'outside' | 'inside'>('outside');
  const [dmFormat, setDmFormat] = useState<'postcard' | 'letter'>('postcard');

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
            <span className="text-sm font-bold text-stone-900">販促ツール・案内DM発行</span>
            <span className="text-[11px] bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
              ✨ 3大ツール対応
            </span>
          </div>

          {/* 切り替えタブ */}
          <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('poster')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'poster'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              ① ポスター・A4チラシ
            </button>
            <button
              onClick={() => setActiveTab('leaflet')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'leaflet'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              ② 三つ折りリーフレット
            </button>
            <button
              onClick={() => setActiveTab('dm')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                activeTab === 'dm'
                  ? 'bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-400'
                  : 'text-emerald-800 bg-emerald-50 hover:bg-emerald-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>③ 施主専用案内DM（ハガキ・封書）</span>
            </button>
          </div>

          {/* ダウンロード／アクションボタン */}
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
            ) : activeTab === 'leaflet' ? (
              <a
                href="/pdf/ココロモウ お墓参り代行リーフレット.pdf"
                download="ココロモウ お墓参り代行リーフレット.pdf"
                className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 px-4 py-2 rounded-xl text-xs font-black transition-all shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>PDFをダウンロード (三つ折り両面・QRコード付)</span>
              </a>
            ) : (
              <Link
                href="/cemetery"
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-black transition-all shadow-sm"
              >
                <Printer className="w-4 h-4" />
                <span>霊園管理画面で一括印刷する →</span>
              </Link>
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
                    <div className="w-10 h-10 rounded-full bg-white overflow-hidden shadow-md shrink-0">
                      <Image
                        src="/logo.png"
                        alt="ココロモウ ロゴ"
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <span className="text-2xl font-black tracking-tight block leading-tight">ココロモウ</span>
                      <span className="text-xs text-emerald-100">お墓参り・お掃除代行プラットフォーム</span>
                    </div>
                  </div>
                  <span className="bg-amber-400 text-stone-950 font-black text-xs px-3 py-1 rounded-md shadow-sm">
                    愛媛・松山 霊園公認連携
                  </span>
                </div>

                <div className="mt-4">
                  <p className="text-amber-200 text-xs font-bold mb-1">「忙しくて帰省できない」「高齢でお墓参りが大変」なご家族へ</p>
                  <h1 className="text-2xl sm:text-3xl font-black text-white leading-snug">
                    ふるさとのお墓を、真心を込めてピカピカに。<br />
                    <span className="text-amber-300">霊園公認パートナーによる 安心のお墓参り・代行清掃</span>
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
                      <p className="p-2 text-[10px] text-emerald-950 font-bold bg-emerald-50/80">手作業除草・墓石専用水洗い・シキミ一対・線香合掌</p>
                    </div>
                  </div>
                </div>

                {/* 3つの特徴 */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-stone-50 border-t-4 border-teal-600 p-3.5 rounded-b-lg">
                    <div className="font-bold text-xs text-stone-900 mb-1">🏛️ 霊園公認・安心の認可制度</div>
                    <p className="text-[10px] text-stone-600 leading-relaxed">寺院・霊園管理所の規約を遵守し、正式に出入り認可されたパートナーが施工。保険完備。</p>
                  </div>
                  <div className="bg-emerald-50/50 border-t-4 border-emerald-600 p-3.5 rounded-b-lg">
                    <div className="font-bold text-xs text-stone-900 mb-1">📸 鮮明写真・Web完了報告</div>
                    <p className="text-[10px] text-stone-600 leading-relaxed">清掃前後の高画質写真と職人の点検メモをスマホへ即日納品。遠方のご家族にも共有可能。</p>
                  </div>
                  <div className="bg-amber-50/50 border-t-4 border-amber-500 p-3.5 rounded-b-lg">
                    <div className="font-bold text-xs text-stone-900 mb-1">💳 明朗会計・追加料金なし</div>
                    <p className="text-[10px] text-stone-600 leading-relaxed">定額3プラン（¥8,800〜）。安全なクレカ事前決済でお見積り後の追加請求は一切なし。</p>
                  </div>
                </div>

                {/* 料金プラン */}
                <div>
                  <div className="flex items-baseline justify-between border-b border-stone-200 pb-1.5 mb-3">
                    <h3 className="text-sm font-black text-stone-900">選べる3つの安心代行プラン（税込・明朗会計）</h3>
                    <span className="text-[10px] text-stone-500">お墓の状態に合わせて選べます</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-stone-50 border border-stone-200 p-3 rounded-lg flex flex-col justify-between">
                      <div>
                        <span className="text-[11px] font-bold text-stone-800 block">簡易プラン</span>
                        <span className="text-lg font-black text-stone-900 block mt-0.5">¥8,800</span>
                      </div>
                      <p className="text-[9px] text-stone-500 mt-2">落ち葉拾い・草取り・シキミ一対・お線香合掌・Before/After写真報告</p>
                    </div>

                    <div className="bg-amber-50/60 border-2 border-amber-400 p-3 rounded-lg shadow-sm flex flex-col justify-between relative">
                      <span className="bg-amber-500 text-stone-950 text-[9px] font-black px-2 py-0.5 rounded absolute -top-2 left-1/2 -translate-x-1/2">
                        ★ 一番人気
                      </span>
                      <div>
                        <span className="text-[11px] font-bold text-amber-950 block mt-1">通常プラン</span>
                        <span className="text-xl font-black text-emerald-800 block mt-0.5">¥14,800</span>
                      </div>
                      <p className="text-[9px] text-stone-700 font-bold mt-2">簡易全内容＋墓石全体専用水洗い＋プロの健全度点検＋詳細写真レポート</p>
                    </div>

                    <div className="bg-stone-50 border border-stone-200 p-3 rounded-lg flex flex-col justify-between">
                      <div>
                        <span className="text-[11px] font-bold text-stone-800 block">プレミアムプラン</span>
                        <span className="text-lg font-black text-stone-900 block mt-0.5">¥22,800</span>
                      </div>
                      <p className="text-[9px] text-stone-500 mt-2">通常全内容＋頑固な水垢コケ徹底除去＋香炉灰全量新品入替＋詳細写真</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* フッターCTA */}
              <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 p-6 border-t-2 border-emerald-500 flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-black text-emerald-950 mb-0.5">運営元: Creative System Design（ココロモウ事務局）</div>
                  <p className="text-[10px] text-stone-600 mb-2">〒790-0931 愛媛県松山市西石井1丁目9番27号 グランジュール505号 / 宝塔寺旭ヶ丘霊園ほか中予全域対応</p>
                  <div className="inline-flex items-center gap-1 bg-white px-3 py-1 rounded border border-emerald-400 font-black text-emerald-800 text-sm">
                    <Phone className="w-3.5 h-3.5" />
                    <span>090-4116-9476</span>
                  </div>
                  <span className="text-[10px] text-stone-500 ml-2">お電話でのご相談・お申し込みも承っております（9:00〜18:00）</span>
                </div>

                <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border-2 border-emerald-500 shadow-xs shrink-0">
                  <div className="w-14 h-14 bg-stone-50 rounded p-1 flex items-center justify-center">
                    <QrCode className="w-12 h-12 text-emerald-900" />
                  </div>
                  <div className="text-left">
                    <span className="text-[11px] font-black text-emerald-950 block">スマホで24時間受付</span>
                    <span className="text-[10px] font-bold text-amber-600 block">簡単3分Webお申し込み</span>
                    <span className="text-[8px] text-stone-400">写真照合でお墓を安心特定</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. リーフレットプレビュー（手作り調整版・実用QRコード入り） */}
        {activeTab === 'leaflet' && (
          <div className="flex flex-col items-center space-y-6">
            {/* 案内バッジ */}
            <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 max-w-4xl w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="space-y-1 text-center sm:text-left">
                <span className="font-extrabold text-emerald-950 text-sm flex items-center justify-center sm:justify-start gap-1.5">
                  <span>📄</span> 公式三つ折りリーフレット（A4横・両面 調整版）
                </span>
                <p className="text-stone-600">
                  裏表紙に<strong>スマホで24時間Web注文できる実用QRコード</strong>が埋め込まれています。スマホカメラをかざして読み取りテストが可能です。
                </p>
              </div>
              <a
                href="/pdf/ココロモウ お墓参り代行リーフレット.pdf"
                download="ココロモウ お墓参り代行リーフレット.pdf"
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>PDFダウンロード</span>
              </a>
            </div>

            {/* 外側3面プレビュー */}
            {leafletSide === 'outside' && (
              <div className="w-full max-w-[1040px] bg-white border-2 border-stone-300 shadow-2xl rounded-2xl overflow-hidden p-3 sm:p-6 space-y-3">
                <div className="flex items-center justify-between text-xs text-stone-500 font-bold px-2">
                  <span>【外側3面】左：折り込み内側 ／ 中央：裏表紙（会社概要・Q&A・実用QRコード） ／ 右：メイン表紙</span>
                  <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">A4横 三つ折り（外側）</span>
                </div>
                <div className="relative rounded-xl overflow-hidden border border-stone-200 shadow-sm bg-stone-100">
                  <img
                    src="/pdf/leaflet_page_1.png"
                    alt="ココロモウ リーフレット外側3面"
                    className="w-full h-auto object-contain block"
                  />
                </div>
              </div>
            )}

            {/* 内側3面プレビュー */}
            {leafletSide === 'inside' && (
              <div className="w-full max-w-[1040px] bg-white border-2 border-stone-300 shadow-2xl rounded-2xl overflow-hidden p-3 sm:p-6 space-y-3">
                <div className="flex items-center justify-between text-xs text-stone-500 font-bold px-2">
                  <span>【内側3面】左：お悩み解決・ご利用の流れ ／ 中央：選べる3代行プラン ／ 右：施工実績・お客様の声</span>
                  <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">A4横 三つ折り（内側見開き）</span>
                </div>
                <div className="relative rounded-xl overflow-hidden border border-stone-200 shadow-sm bg-stone-100">
                  <img
                    src="/pdf/leaflet_page_2.png"
                    alt="ココロモウ リーフレット内側3面"
                    className="w-full h-auto object-contain block"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. 施主専用個別案内DM（ハガキ・封書）プレビュー */}
        {activeTab === 'dm' && (
          <div className="space-y-8">
            {/* オンボーディング説明カード */}
            <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-stone-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
              <div className="relative z-10 space-y-3 max-w-3xl">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400 text-stone-950 font-black text-xs rounded-full">
                  <Sparkles className="w-3.5 h-3.5" />
                  ★ 霊園公認・成約率No.1の最強オンボーディング機能
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  施主名簿CSVを取り込むだけで、写真・区画情報入り案内DMを全自動一括印刷！
                </h2>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  施主様が代行を頼もうとした時、最も離脱しやすいのが<strong>「区画番号が分からない」「お墓の正面・側面の写真を探してアップロードするのが面倒」</strong>というステップです。
                  ココロモウのDM発行機能なら、霊園台帳から自動で個別QRコードを発行。施主様は<strong>「QRを読み取るだけでお墓がセットされた注文画面が開き、日付とプランを選ぶだけ」</strong>で完了します。
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <Link
                    href="/cemetery"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 text-xs sm:text-sm font-black rounded-xl shadow-md transition active:scale-95"
                  >
                    <Printer className="w-4 h-4" />
                    <span>霊園管理画面でCSVを取り込んで印刷する →</span>
                  </Link>
                  <span className="text-xs text-stone-400">
                    ※ハガキ（100×148mm）およびA4封書レター（210×297mm）両対応
                  </span>
                </div>
              </div>
            </div>

            {/* 書式切り替えセレクター */}
            <div className="flex items-center justify-center gap-3 bg-white p-2 rounded-2xl border border-stone-200 shadow-2xs max-w-md mx-auto">
              <button
                onClick={() => setDmFormat('postcard')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  dmFormat === 'postcard'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 bg-stone-50'
                }`}
              >
                📮 ハガキ版（100×148mm・両面）
              </button>
              <button
                onClick={() => setDmFormat('letter')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  dmFormat === 'letter'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 bg-stone-50'
                }`}
              >
                📄 A4封書案内状（210×297mm）
              </button>
            </div>

            {/* ハガキ版プレビュー */}
            {dmFormat === 'postcard' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center max-w-5xl mx-auto">
                {/* 表面（宛名面）プレビュー */}
                <div className="w-full max-w-[360px] bg-white rounded-2xl border-2 border-stone-300 shadow-xl p-6 flex flex-col justify-between aspect-[100/148] text-stone-900 relative">
                  <div>
                    {/* 上部: 料金別納 ＆ 郵便番号 */}
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-14 h-14 border border-stone-400 rounded-full flex flex-col items-center justify-center text-[9px] font-bold leading-tight text-stone-600">
                        <span>料金別納</span>
                        <span>郵便</span>
                      </div>
                      <div className="flex items-center gap-1 border border-rose-300 px-2.5 py-1.5 rounded bg-rose-50/40">
                        <span className="text-[10px] text-rose-800 font-bold">〒</span>
                        <div className="flex gap-1 text-sm font-black tracking-widest text-stone-800">
                          <span>790</span>
                          <span>-</span>
                          <span>0001</span>
                        </div>
                      </div>
                    </div>

                    {/* 宛先住所・宛名 */}
                    <div className="pl-4 space-y-3 my-6">
                      <p className="text-xs text-stone-600 font-medium leading-relaxed">
                        愛媛県松山市一番町4丁目1-2<br />
                        サクラマンション 302号室
                      </p>
                      <div className="pt-2">
                        <span className="text-lg font-black text-stone-900 tracking-wider">
                          山田 太郎 <span className="text-sm font-medium text-stone-600">様</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 差出人（霊園公認名義） */}
                  <div className="pt-4 border-t border-stone-200 text-[10px] text-stone-600 space-y-0.5">
                    <span className="text-emerald-800 font-bold block text-[11px]">
                      【差出人・お問い合わせ】
                    </span>
                    <strong className="block text-stone-800 text-xs">宝塔寺旭ヶ丘霊園 管理事務所</strong>
                    <span>お墓参り・お掃除代行 公認DX受付センター（ココロモウ）</span>
                  </div>
                  <div className="absolute top-2 right-2 bg-stone-100 text-stone-500 text-[9px] px-2 py-0.5 rounded font-bold">
                    表面（宛名面）
                  </div>
                </div>

                {/* 裏面（案内面）プレビュー */}
                <div className="w-full max-w-[360px] bg-white rounded-2xl border-2 border-emerald-600 shadow-xl p-5 flex flex-col justify-between aspect-[100/148] text-stone-900 relative">
                  <div>
                    {/* ヘッダー緑帯 */}
                    <div className="bg-emerald-800 text-white px-3 py-2 rounded-xl text-center mb-3 shadow-xs">
                      <span className="text-[9px] text-emerald-200 font-bold block tracking-wider">
                        【霊園公認】施主様へ大切なお知らせ
                      </span>
                      <strong className="text-xs sm:text-sm font-black tracking-tight block">
                        お墓参り・清掃代行のご案内
                      </strong>
                    </div>

                    {/* 事前セットされたお墓情報バナー */}
                    <div className="bg-stone-50 rounded-xl p-2.5 border border-stone-200 mb-3 flex items-center gap-3">
                      <div className="w-14 h-14 rounded-lg bg-stone-200 overflow-hidden shrink-0 border border-stone-300">
                        <img
                          src="/images/grave_before.jpg"
                          alt="お墓写真"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-[10px] space-y-0.5 leading-tight">
                        <span className="bg-emerald-100 text-emerald-900 font-bold px-1.5 py-0.5 rounded text-[9px] inline-block">
                          事前登録済み墓所
                        </span>
                        <p className="font-extrabold text-stone-900 text-[11px]">
                          区画：東3区 12番
                        </p>
                        <p className="text-stone-500">正面文字：先祖代々之墓</p>
                      </div>
                    </div>

                    {/* ログインID・初期パスワード */}
                    <div className="bg-amber-50/80 border border-amber-300 rounded-xl p-2 text-center text-[10px] mb-3">
                      <span className="text-amber-900 font-bold block text-[9px]">
                        ★ 専用ログイン情報（入力不要で自動ログイン）
                      </span>
                      <div className="flex justify-around items-center pt-1 font-mono font-bold text-stone-800">
                        <span>ID: 090-XXXX-5678</span>
                        <span>PW: ym1234</span>
                      </div>
                    </div>

                    {/* QRコード ＆ 3ステップ */}
                    <div className="flex items-center gap-3 bg-stone-50 p-2 rounded-xl border border-stone-200">
                      <div className="w-16 h-16 bg-white p-1 rounded-lg border border-stone-300 shrink-0 flex items-center justify-center">
                        <QrCode className="w-14 h-14 text-stone-900" />
                      </div>
                      <div className="text-[9px] text-stone-600 space-y-1">
                        <strong className="text-emerald-900 block font-bold text-[10px]">
                          スマホでQRを読み取るだけ！
                        </strong>
                        <ol className="list-decimal list-inside space-y-0.5">
                          <li>カメラでQRを読み取り</li>
                          <li>日付とプランを選択</li>
                          <li>作業前後の写真をスマホでお届け</li>
                        </ol>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 text-center">
                    <span className="text-[9px] text-stone-400">
                      お電話でも受付中：089-911-8800（ココロモウ総合受付）
                    </span>
                  </div>

                  <div className="absolute top-2 right-2 bg-emerald-100 text-emerald-900 text-[9px] px-2 py-0.5 rounded font-bold">
                    裏面（案内面）
                  </div>
                </div>
              </div>
            )}

            {/* A4封書レター版プレビュー */}
            {dmFormat === 'letter' && (
              <div className="max-w-2xl mx-auto bg-white rounded-3xl border-2 border-stone-300 shadow-xl p-8 sm:p-12 text-stone-900 space-y-6">
                <div className="flex justify-between items-start border-b-2 border-stone-800 pb-4">
                  <div>
                    <span className="text-xs font-bold text-emerald-800 tracking-wider block">
                      【宝塔寺旭ヶ丘霊園 管理事務所 公認案内状】
                    </span>
                    <h3 className="text-lg font-black text-stone-900 mt-1">
                      施主様へ：お墓参り・清掃代行オンライン受付開始のお知らせ
                    </h3>
                  </div>
                  <span className="text-xs text-stone-500 font-medium">拝啓 時下ますますご清祥のこととお慶び申し上げます。</span>
                </div>

                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs text-stone-700 leading-relaxed space-y-2">
                  <p>
                    日頃より当霊園の護持管理にご協力を賜り、厚く御礼申し上げます。<br />
                    遠方にお住まいの施主様や、ご高齢によりご自身でのお参りが難しくなられた施主様のご要望にお応えし、当霊園では公認の**「お墓参り・お掃除代行システム（ココロモウ）」**を正式導入いたしました。
                  </p>
                  <p>
                    施主様の手間を省くため、<strong>お墓の区画番号およびお写真は当管理所にてすでに事前登録を完了</strong>しております。
                  </p>
                </div>

                {/* お墓情報とQR */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200">
                  <div className="space-y-2 text-xs">
                    <span className="text-xs font-bold text-emerald-900 block">■ 事前登録済み墓所情報</span>
                    <p className="text-stone-800 font-bold text-sm">山田 太郎 様 （東3区 12番）</p>
                    <p className="text-stone-600 text-xs">正面文字：先祖代々之墓</p>
                    <div className="pt-2">
                      <span className="text-[11px] text-stone-500 block">専用ログインID / 初期PW</span>
                      <span className="font-mono font-bold text-stone-800 text-xs">ID: 090-XXXX-5678 / PW: ym1234</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-emerald-200 text-center space-y-1">
                    <QrCode className="w-20 h-20 text-stone-900" />
                    <span className="text-[10px] font-bold text-emerald-900">右記QRから1クリックで注文可能</span>
                  </div>
                </div>

                <div className="text-center pt-2">
                  <Link
                    href="/cemetery"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold text-sm rounded-xl shadow-md transition cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>霊園管理画面でこの案内状を一括印刷する</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
