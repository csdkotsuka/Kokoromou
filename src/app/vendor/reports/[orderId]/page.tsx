'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { 
  Camera, 
  Upload, 
  CheckCircle2, 
  ArrowLeft, 
  Sparkles, 
  Info, 
  AlertCircle, 
  Trash2, 
  Loader2, 
  PlusCircle, 
  Calendar,
  CloudSun,
  MapPin,
  Eye,
  Lock
} from 'lucide-react';
import { SAMPLE_REPORTS } from '@/mocks/sample-data';

interface PhotoItem {
  url: string;
  caption: string;
}

export default function VendorReportPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = use(params);

  const [order, setOrder] = useState<any>(null);
  const [loadingOrder, setLoadingOrder] = useState(true);

  // ロール判定（vendor/admin のみ編集可）
  const [isEditable, setIsEditable] = useState(false);
  const [viewerRole, setViewerRole] = useState<string>('guest');

  useEffect(() => {
    try {
      const cookieMatch = document.cookie
        .split('; ')
        .find((row) => row.startsWith('kokoromou_auth='));
      if (cookieMatch) {
        const userData = JSON.parse(decodeURIComponent(cookieMatch.split('=').slice(1).join('=')));
        setViewerRole(userData.role || 'guest');
        setIsEditable(userData.role === 'vendor' || userData.role === 'admin');
      }
    } catch {
      // 未ログイン or パース失敗 → 閲覧のみ
    }
  }, []);

  // レポート入力状態
  const [workDate, setWorkDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [weather, setWeather] = useState<string>('快晴');
  const [beforePhotos, setBeforePhotos] = useState<PhotoItem[]>([
    {
      url: '/images/grave_before.jpg',
      caption: '作業前：墓石全体の様子（苔・水垢・落ち葉・雑草の繁茂）',
    },
  ]);
  const [afterPhotos, setAfterPhotos] = useState<PhotoItem[]>([
    {
      url: '/images/grave_after.jpg',
      caption: '作業後：手作業除草・水洗い清掃完了、季節の生花・お線香をお供え',
    },
  ]);
  const [workNotes, setWorkNotes] = useState<string>(
    '本日現地にて、お墓参り・清掃代行を心を込めて実施いたしました。敷地内の雑草を手作業で根元から抜き取り、墓石・花立て・香炉の専用水洗いを行いました。季節の生花をお供えし、お線香を焚いてご先祖様へのご冥福をお祈りいたしました。'
  );
  const [graveConditionNotes, setGraveConditionNotes] = useState<string>(
    '墓石本体に大きなひび割れや傾きは見られませんが、台座目地の一部に若干の経年劣化が見られます。現状直ちに対応が必要な状態ではございません。'
  );

  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadOrder() {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data.order);
        }
      } catch (e) {
        console.error('Failed to load order', e);
      } finally {
        setLoadingOrder(false);
      }
    }
    loadOrder();
  }, [orderId]);

  const addPhoto = (type: 'before' | 'after') => {
    const sampleUrls = [
      'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80',
    ];
    const newPhoto: PhotoItem = {
      url: sampleUrls[Math.floor(Math.random() * sampleUrls.length)],
      caption: type === 'before' ? '作業前：追加写真' : '作業後：追加写真',
    };
    if (type === 'before') {
      setBeforePhotos([...beforePhotos, newPhoto]);
    } else {
      setAfterPhotos([...afterPhotos, newPhoto]);
    }
  };

  const removePhoto = (type: 'before' | 'after', index: number) => {
    if (type === 'before') {
      setBeforePhotos(beforePhotos.filter((_, i) => i !== index));
    } else {
      setAfterPhotos(afterPhotos.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          vendorId: order?.vendorId || 'vendor_001',
          vendorName: order?.vendorName || '提携業者',
          workDate,
          weather,
          beforePhotos,
          afterPhotos,
          workNotes,
          graveConditionNotes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'レポート提出に失敗しました。');
      }

      setIsSuccess(true);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'エラーが発生しました。');
    } finally {
      setSubmitting(false);
    }
  };

  // ===== 共通：お墓情報サマリー =====
  const GraveInfoSummary = () => (
    <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm mb-8 space-y-4">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
          <Info className="w-4 h-4 text-emerald-700" />
          <span>対象のお墓・ご依頼情報（現場特定用）</span>
        </h2>
        {order?.graveInfo?.googleMapsUrl && (
          <a
            href={order.graveInfo.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition-all self-start sm:self-auto"
          >
            <MapPin className="w-4 h-4 text-emerald-200" />
            <span>Googleマップで現地を開く (ナビ)</span>
          </a>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-emerald-50/60 rounded-xl border border-emerald-200">
        <div>
          <span className="text-[11px] text-emerald-800 font-bold block mb-0.5">墓石の正面刻印文字</span>
          <span className="font-extrabold text-stone-900 text-sm block">
            {order?.graveInfo?.frontInscription || order?.graveInfo?.deceasedName || '山田家先祖代々之墓'}
          </span>
          {order?.graveInfo?.frontInscriptionPhotoUrl && (
            <div className="mt-2">
              <img
                src={order.graveInfo.frontInscriptionPhotoUrl}
                alt="正面写真"
                className="w-full h-24 object-cover rounded-lg border border-stone-200 shadow-xs"
              />
            </div>
          )}
        </div>
        <div>
          <span className="text-[11px] text-rose-700 font-bold block mb-0.5">
            側面・裏面の建立者名（特定必須）
          </span>
          <span className="font-extrabold text-stone-900 text-sm bg-white px-2.5 py-1 rounded border border-emerald-300 inline-block mb-1">
            {order?.graveInfo?.builderName || '昭和五十年八月 山田太郎建之'}
          </span>
          {order?.graveInfo?.builderNamePhotoUrl && (
            <div className="mt-1">
              <img
                src={order.graveInfo.builderNamePhotoUrl}
                alt="側面建立者名写真"
                className="w-full h-24 object-cover rounded-lg border border-stone-200 shadow-xs"
              />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-stone-50 p-3 rounded-xl">
          <span className="text-stone-500 block mb-0.5 text-[11px]">霊園・寺院名</span>
          <span className="font-bold text-stone-800">{order?.graveInfo?.cemeteryName || '宝塔寺 旭ヶ丘霊園'}</span>
        </div>
        <div className="bg-stone-50 p-3 rounded-xl">
          <span className="text-stone-500 block mb-0.5 text-[11px]">区画・墓石番号</span>
          <span className="font-bold text-stone-800">{order?.graveInfo?.sectionPlotNumber || '東区 5列 12番'}</span>
        </div>
        <div className="bg-stone-50 p-3 rounded-xl">
          <span className="text-stone-500 block mb-0.5 text-[11px]">お墓の基数・広さ</span>
          <span className="font-bold text-stone-800">
            {order?.graveInfo?.graveCount || 1}基 / {order?.graveInfo?.plotSize === 'extra_large' ? '特大(2坪超)' : order?.graveInfo?.plotSize === 'large' ? '広め(1〜2坪)' : '標準(~1坪)'}
          </span>
        </div>
        <div className="bg-stone-50 p-3 rounded-xl">
          <span className="text-stone-500 block mb-0.5 text-[11px]">依頼プラン</span>
          <span className="font-bold text-emerald-700">{order?.servicePlanName || '通常プラン'}</span>
        </div>
      </div>

      {order?.graveInfo?.landmarksDescription && (
        <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200 text-xs text-blue-900">
          <span className="font-bold mr-1">📍 周辺の目印・隣接情報:</span>
          {order.graveInfo.landmarksDescription}
        </div>
      )}
      {order?.graveInfo?.specialRequests && (
        <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-xs text-amber-900">
          <span className="font-bold mr-1">施主様からのご要望:</span>
          {order.graveInfo.specialRequests}
        </div>
      )}
    </div>
  );

  // ===== 閲覧専用ビュー（customer / cemetery / guest） =====
  const ReadOnlyView = () => (
    <div className="space-y-8">
      {/* 閲覧専用バナー */}
      <div className="flex items-center gap-3 p-4 bg-stone-100 border border-stone-300 rounded-xl text-sm text-stone-700">
        <Eye className="w-5 h-5 text-stone-500 shrink-0" />
        <div>
          <span className="font-bold block">作業完了レポート（閲覧専用）</span>
          <span className="text-xs text-stone-500">
            {viewerRole === 'customer' ? '施主様向けの閲覧ビューです。' : '管理会社向けの閲覧ビューです。'}
            レポートの編集・提出は担当の代行業者のみ可能です。
          </span>
        </div>
      </div>

      {/* 作業日・天候 */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-700" />
          作業実施情報
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-stone-50 p-3 rounded-xl">
            <span className="text-[11px] text-stone-500 block mb-0.5">作業実施日</span>
            <span className="font-bold text-stone-900">{workDate}</span>
          </div>
          <div className="bg-stone-50 p-3 rounded-xl">
            <span className="text-[11px] text-stone-500 block mb-0.5">天候</span>
            <span className="font-bold text-stone-900">{weather}</span>
          </div>
        </div>
      </div>

      {/* Before写真 */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm">
        <h3 className="text-sm font-bold text-stone-900 mb-4 flex items-center gap-2">
          <Camera className="w-4 h-4 text-rose-600" />
          作業前の写真 (Before)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {beforePhotos.map((photo, index) => (
            <div key={index} className="bg-stone-50 rounded-xl overflow-hidden border border-stone-200">
              <img src={photo.url} alt={`Before ${index + 1}`} className="w-full h-40 object-cover" />
              <p className="p-3 text-xs text-stone-600">{photo.caption}</p>
            </div>
          ))}
        </div>
      </div>

      {/* After写真 */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm">
        <h3 className="text-sm font-bold text-stone-900 mb-4 flex items-center gap-2">
          <Camera className="w-4 h-4 text-emerald-600" />
          作業後の写真 (After)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {afterPhotos.map((photo, index) => (
            <div key={index} className="bg-stone-50 rounded-xl overflow-hidden border border-emerald-200">
              <img src={photo.url} alt={`After ${index + 1}`} className="w-full h-40 object-cover" />
              <p className="p-3 text-xs text-stone-600">{photo.caption}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 作業報告コメント */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-stone-900">作業報告・点検メモ</h3>
        <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
          <span className="text-[11px] text-stone-500 font-bold block mb-1">作業実施報告</span>
          <p className="text-sm text-stone-800 leading-relaxed whitespace-pre-wrap">{workNotes}</p>
        </div>
        {graveConditionNotes && (
          <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200">
            <span className="text-[11px] text-amber-800 font-bold block mb-1">墓石コンディション・点検所見</span>
            <p className="text-sm text-stone-800 leading-relaxed whitespace-pre-wrap">{graveConditionNotes}</p>
          </div>
        )}
      </div>

      <div className="text-center">
        <Link href="/" className="text-xs text-stone-500 hover:text-stone-800 underline">
          ← トップページへ戻る
        </Link>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* パンくず & 戻る */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>トップページへ戻る</span>
        </Link>
      </div>

      {/* 画面ヘッダー */}
      <div className={`text-white rounded-2xl p-6 sm:p-8 mb-8 shadow-sm ${isEditable ? 'bg-emerald-900' : 'bg-stone-800'}`}>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-2 ${isEditable ? 'bg-emerald-800/80 text-emerald-200' : 'bg-stone-700 text-stone-300'}`}>
              {isEditable ? (
                <><Camera className="w-3.5 h-3.5" /><span>提携業者ポータル（作業完了報告）</span></>
              ) : (
                <><Eye className="w-3.5 h-3.5" /><span>作業完了レポート閲覧</span></>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold">
              {isEditable ? '作業完了写真レポートの提出' : '作業完了写真レポート'}
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 mt-1">
              {isEditable
                ? '現地作業完了後、作業前後の写真をアップロードして施主様への報告書を作成します。'
                : '担当業者が提出した作業完了レポートをご確認いただけます。'}
            </p>
          </div>
          <div className={`p-3 rounded-xl border text-right shrink-0 ${isEditable ? 'bg-emerald-800/60 border-emerald-700/50' : 'bg-stone-700/60 border-stone-600/50'}`}>
            <span className="text-[11px] text-stone-300 block">対象注文番号</span>
            <span className="font-mono font-bold text-sm text-white">{order?.orderNumber || orderId}</span>
          </div>
        </div>
      </div>

      {/* お墓情報サマリー（共通） */}
      <GraveInfoSummary />

      {/* ===== 編集不可の場合は閲覧ビューのみ ===== */}
      {!isEditable ? (
        <ReadOnlyView />
      ) : isSuccess ? (
        <div className="bg-white rounded-2xl p-8 border border-emerald-200 shadow-md text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-stone-900">作業完了レポートが正常に提出されました</h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto">
            施主様へ写真レポート完了通知が送信され、注文ステータスが「レポート提出済（report_submitted）」に更新されました。
          </p>
          <div className="pt-4 flex justify-center gap-4">
            <Link
              href="/"
              className="bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold px-5 py-2.5 rounded-xl transition-colors"
            >
              トップへ戻る
            </Link>
            <button
              onClick={() => setIsSuccess(false)}
              className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-colors"
            >
              レポートを再編集する
            </button>
          </div>
        </div>
      ) : (
        /* ===== 編集フォーム（vendor/admin のみ） ===== */
        <form onSubmit={handleSubmit} className="space-y-8">
          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 作業基本情報（日付・天候） */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm">
            <h3 className="text-sm font-bold text-stone-900 mb-4">1. 作業実施日・環境</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  作業実施日 <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={workDate}
                    onChange={(e) => setWorkDate(e.target.value)}
                    required
                    className="w-full text-xs border border-stone-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">天候</label>
                <input
                  type="text"
                  value={weather}
                  onChange={(e) => setWeather(e.target.value)}
                  className="w-full text-xs border border-stone-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="例: 快晴、曇り"
                />
              </div>
            </div>
          </div>

          {/* 作業前写真 (Before) */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-stone-900">2. 作業前の写真 (Before)</h3>
                <p className="text-[11px] text-stone-500">清掃前の墓石全体や、雑草・汚れの状態がわかる写真</p>
              </div>
              <button
                type="button"
                onClick={() => addPhoto('before')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>写真を追加</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {beforePhotos.map((photo, index) => (
                <div key={index} className="relative bg-stone-50 rounded-xl overflow-hidden border border-stone-200">
                  <img src={photo.url} alt={`Before ${index + 1}`} className="w-full h-40 object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto('before', index)}
                    className="absolute top-2 right-2 bg-black/60 hover:bg-rose-600 text-white p-1.5 rounded-full transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <div className="p-3">
                    <input
                      type="text"
                      value={photo.caption}
                      onChange={(e) => {
                        const updated = [...beforePhotos];
                        updated[index].caption = e.target.value;
                        setBeforePhotos(updated);
                      }}
                      className="w-full text-xs border border-stone-200 rounded px-2 py-1 bg-white"
                      placeholder="写真の説明（例: 墓石全体の様子）"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 作業後写真 (After) */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-stone-900">3. 作業後の写真 (After)</h3>
                <p className="text-[11px] text-stone-500">清掃完了後、お花・お線香をお供えした状態の写真</p>
              </div>
              <button
                type="button"
                onClick={() => addPhoto('after')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>写真を追加</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {afterPhotos.map((photo, index) => (
                <div key={index} className="relative bg-stone-50 rounded-xl overflow-hidden border border-stone-200">
                  <img src={photo.url} alt={`After ${index + 1}`} className="w-full h-40 object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto('after', index)}
                    className="absolute top-2 right-2 bg-black/60 hover:bg-rose-600 text-white p-1.5 rounded-full transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <div className="p-3">
                    <input
                      type="text"
                      value={photo.caption}
                      onChange={(e) => {
                        const updated = [...afterPhotos];
                        updated[index].caption = e.target.value;
                        setAfterPhotos(updated);
                      }}
                      className="w-full text-xs border border-stone-200 rounded px-2 py-1 bg-white"
                      placeholder="写真の説明（例: 清掃後・お供えの様子）"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 作業報告コメント・墓石コンディション */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-stone-900">4. 作業報告と点検メモ</h3>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                作業実施報告コメント <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={workNotes}
                onChange={(e) => setWorkNotes(e.target.value)}
                required
                rows={4}
                className="w-full text-xs border border-stone-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="実施した作業内容、お参りの様子などを施主様に向けてご記入ください。"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                墓石のコンディション・点検所見（任意）
              </label>
              <textarea
                value={graveConditionNotes}
                onChange={(e) => setGraveConditionNotes(e.target.value)}
                rows={2}
                className="w-full text-xs border border-stone-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="目地の劣化、欠け、傾きなど、今後のメンテナンスに関する所見があればご記入ください。"
              />
            </div>
          </div>

          {/* 送信ボタン */}
          <div className="text-right">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 px-8 rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50 text-sm"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>レポートを送信中...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>作業完了レポートを施主様へ提出</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
