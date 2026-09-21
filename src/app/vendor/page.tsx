'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Building2, 
  MapPin, 
  Phone, 
  CreditCard, 
  Star, 
  FileText, 
  Camera, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ChevronRight, 
  ExternalLink,
  Layers,
  ArrowRight,
  ShieldCheck,
  User,
  Sparkles
} from 'lucide-react';
import { SAMPLE_VENDORS, SAMPLE_ORDERS, SAMPLE_CEMETERY_COMPANIES } from '@/mocks/sample-data';
import { Order, User as UserType } from '@/types/firestore';

function VendorDashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // 現在選択されている管理会社ID（デフォルトは vendor_001）
  const currentVendorId = searchParams.get('vendorId') || SAMPLE_VENDORS[0].id;
  const [selectedVendorId, setSelectedVendorId] = useState<string>(currentVendorId);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');
  const [previewPhoto, setPreviewPhoto] = useState<{ title: string; url: string } | null>(null);

  // 選択中の管理会社情報
  const currentVendor = SAMPLE_VENDORS.find((v) => v.id === selectedVendorId) || SAMPLE_VENDORS[0];

  // 自社に割り当てられた注文一覧
  const vendorOrders = SAMPLE_ORDERS.filter((o) => o.vendorId === selectedVendorId);

  // 売上サマリー
  const totalEarnings = vendorOrders.reduce((sum, o) => sum + o.vendorPayoutAmount, 0);
  const completedCount = vendorOrders.filter((o) => o.status === 'completed' || o.status === 'report_submitted').length;

  // 会社切り替えハンドラー
  const handleSwitchVendor = (newId: string) => {
    setSelectedVendorId(newId);
    router.push(`/vendor?vendorId=${newId}`);
  };

  // フィルターされた注文
  const filteredOrders = vendorOrders.filter((o) => {
    if (statusFilter === 'pending') return o.status === 'paid';
    if (statusFilter === 'in_progress') return o.status === 'in_progress';
    if (statusFilter === 'completed') return o.status === 'completed' || o.status === 'report_submitted';
    return true;
  });

  return (
    <div className="min-h-screen bg-stone-50/70 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* 会社切り替えスイッチャー（最上部） */}
        <div className="bg-emerald-900 text-white rounded-3xl p-5 sm:p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 flex items-center justify-center text-emerald-200 shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider block">
                提携墓地管理会社ポータル（各社専用ビュー）
              </span>
              <span className="text-sm font-bold text-white">ログイン中の管理会社を切り替える：</span>
            </div>
          </div>

          <div className="w-full md:w-auto flex items-center gap-2">
            <select
              value={selectedVendorId}
              onChange={(e) => handleSwitchVendor(e.target.value)}
              className="w-full md:w-80 bg-emerald-950 border border-emerald-700 text-white font-bold text-xs rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-emerald-400 focus:outline-none cursor-pointer"
            >
              {SAMPLE_VENDORS.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.displayName}
                </option>
              ))}
            </select>
            <Link
              href="/admin"
              className="shrink-0 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3 py-2.5 rounded-xl border border-white/20 transition"
            >
              自社統括画面へ
            </Link>
          </div>
        </div>

        {/* 選択中会社のプロフィール・サマリーカード */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-stone-100">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  認定提携パートナー
                </span>
                <span className="text-xs text-stone-500 font-mono">ID: {currentVendor.id}</span>
                <span className="text-amber-600 font-bold text-xs bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  ★ {currentVendor.vendorProfile?.rating}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 leading-tight">
                {currentVendor.displayName}
              </h1>
              <p className="text-xs text-stone-500 mt-1">
                法人名: {currentVendor.vendorProfile?.companyName} • 代表: {currentVendor.vendorProfile?.representativeName} • 電話: {currentVendor.phoneNumber}
              </p>
            </div>

            {/* Stripe Connect 口座ステータス */}
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/80 flex items-center gap-4 text-xs">
              <CreditCard className="w-8 h-8 text-emerald-700 shrink-0" />
              <div>
                <span className="text-stone-500 block text-[11px]">Stripe Connect 受取連携口座</span>
                <span className="font-bold text-stone-900 font-mono">
                  {currentVendor.vendorProfile?.stripeConnectAccountId}
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">
                  ● 自動送金機能 有効 (Charges & Payouts Enabled)
                </span>
              </div>
            </div>
          </div>

          {/* 会社KPI */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/60">
              <span className="text-stone-500 block mb-1">受取予定報酬額 (総売上の80%)</span>
              <span className="text-2xl font-black text-emerald-900">¥{totalEarnings.toLocaleString()}</span>
              <span className="text-[10px] text-stone-400 block mt-1">手数料20%控除後の純振込額</span>
            </div>
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/60">
              <span className="text-stone-500 block mb-1">自社アサイン案件数</span>
              <span className="text-2xl font-black text-stone-900">{vendorOrders.length} 件</span>
              <span className="text-[10px] text-stone-400 block mt-1">うち完了・提出済: {completedCount}件</span>
            </div>
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/60">
              <span className="text-stone-500 block mb-1">担当施工対応エリア</span>
              <span className="font-bold text-stone-800 block text-xs truncate">
                {currentVendor.vendorProfile?.serviceAreas.join('、')}
              </span>
              <span className="text-[10px] text-stone-400 block mt-1">愛媛県中予エリア中心</span>
            </div>
          </div>

          {/* 提携・出入り契約中の墓地管理会社（霊園） */}
          <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold text-stone-700 flex items-center gap-1 shrink-0">
              <Building2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>提携・出入り認定 墓地管理会社：</span>
            </span>
            {SAMPLE_CEMETERY_COMPANIES.filter((c) =>
              c.affiliatedVendorIds.includes(currentVendor.id)
            ).map((comp) => (
              <span
                key={comp.id}
                className="bg-emerald-50 text-emerald-900 border border-emerald-200 px-2.5 py-1 rounded-lg font-semibold text-[11px] flex items-center gap-1"
              >
                <span>{comp.name}</span>
                <span className="text-[9px] text-emerald-700">（{comp.cemeteryNames[0]}）</span>
              </span>
            ))}
          </div>
        </div>

        {/* 自社の担当作業案件一覧 */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-stone-100 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-stone-900">自社担当の清掃・お参り代行 案件一覧</h2>
              <p className="text-xs text-stone-500 mt-0.5">
                現場でのお墓特定（正面文字・側面建立者名・写真）を確認し、作業完了レポートを作成・提出します。
              </p>
            </div>

            {/* フィルター */}
            <div className="flex gap-1.5 bg-stone-100 p-1 rounded-xl text-xs">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                  statusFilter === 'all' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                すべて ({vendorOrders.length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('pending')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                  statusFilter === 'pending' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                作業待ち
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('in_progress')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                  statusFilter === 'in_progress' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                作業中
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('completed')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                  statusFilter === 'completed' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                完了済
              </button>
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="p-12 text-center text-stone-400 text-xs">
              該当する作業案件はありません。
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {filteredOrders.map((ord) => (
                <div key={ord.id} className="p-6 hover:bg-stone-50/70 transition-colors space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900 text-sm font-mono">{ord.orderNumber}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            ord.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ord.status === 'in_progress'
                              ? 'bg-blue-100 text-blue-800'
                              : ord.status === 'report_submitted'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {ord.status === 'completed'
                            ? '完了・確認済'
                            : ord.status === 'in_progress'
                            ? '現地作業中'
                            : ord.status === 'report_submitted'
                            ? '写真レポート提出済'
                            : '日程確定・作業待ち'}
                        </span>
                        <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                          {ord.servicePlanName}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500">
                        施主様: <strong className="text-stone-800">{ord.clientName} 様</strong>（{ord.clientEmail}） • 希望作業日: <strong className="text-emerald-900">{ord.preferredDate}</strong>
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] text-stone-400 block">提携先受取報酬（80%）</span>
                      <span className="text-base font-black text-emerald-800">
                        ¥{ord.vendorPayoutAmount.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-stone-400 block">注文総額: ¥{ord.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* お墓の特定情報カード（現場確認用） */}
                  <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                      <div>
                        <span className="text-stone-500 text-[10px] block">対象霊園・寺院</span>
                        <span className="font-bold text-stone-800">{ord.graveInfo.cemeteryName}</span>
                      </div>
                      <div>
                        <span className="text-stone-500 text-[10px] block">区画・墓石番号</span>
                        <span className="font-bold text-stone-800">{ord.graveInfo.sectionPlotNumber}</span>
                      </div>
                      <div>
                        <span className="text-stone-500 text-[10px] block">お墓の基数・広さ</span>
                        <span className="font-bold text-stone-800">
                          {ord.graveInfo.graveCount || 1}基 / {ord.graveInfo.plotSize === 'extra_large' ? '特大(2坪超)' : ord.graveInfo.plotSize === 'large' ? '広め(1〜2坪)' : '標準(~1坪)'}
                        </span>
                      </div>
                      <div>
                        <span className="text-stone-500 text-[10px] block">霊園所在地</span>
                        <span className="font-semibold text-stone-700 truncate block">
                          {ord.graveInfo.locationAddress || '愛媛県松山市'}
                        </span>
                      </div>
                    </div>

                    {/* 正面文字 & 側面建立者名（重要！） ＋ 写真 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-stone-200/60">
                      <div className="bg-white p-3 rounded-xl border border-stone-200 flex items-center gap-3">
                        {ord.graveInfo.frontInscriptionPhotoUrl ? (
                          <img
                            src={ord.graveInfo.frontInscriptionPhotoUrl}
                            alt="正面写真"
                            className="w-14 h-14 object-cover rounded-lg border border-stone-200 shrink-0 cursor-pointer hover:opacity-80"
                            onClick={() =>
                              setPreviewPhoto({
                                title: `正面文字写真 - ${ord.graveInfo.frontInscription}`,
                                url: ord.graveInfo.frontInscriptionPhotoUrl!,
                              })
                            }
                          />
                        ) : (
                          <div className="w-14 h-14 bg-stone-100 rounded-lg flex items-center justify-center text-stone-400 shrink-0">
                            <Camera className="w-5 h-5" />
                          </div>
                        )}
                        <div className="text-xs truncate">
                          <span className="text-[10px] font-bold text-emerald-800 block">① 正面の刻印文字</span>
                          <span className="font-extrabold text-stone-900 text-sm block">
                            {ord.graveInfo.frontInscription}
                          </span>
                          <span className="text-[10px] text-stone-400">墓石正面の家名・題目</span>
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-emerald-300 flex items-center gap-3">
                        {ord.graveInfo.builderNamePhotoUrl ? (
                          <img
                            src={ord.graveInfo.builderNamePhotoUrl}
                            alt="側面写真"
                            className="w-14 h-14 object-cover rounded-lg border border-stone-200 shrink-0 cursor-pointer hover:opacity-80"
                            onClick={() =>
                              setPreviewPhoto({
                                title: `側面建立者名写真 - ${ord.graveInfo.builderName}`,
                                url: ord.graveInfo.builderNamePhotoUrl!,
                              })
                            }
                          />
                        ) : (
                          <div className="w-14 h-14 bg-stone-100 rounded-lg flex items-center justify-center text-stone-400 shrink-0">
                            <Camera className="w-5 h-5" />
                          </div>
                        )}
                        <div className="text-xs truncate">
                          <span className="text-[10px] font-bold text-rose-700 block">② 側面の建立者名（特定必須）</span>
                          <span className="font-extrabold text-stone-900 text-sm block">
                            {ord.graveInfo.builderName}
                          </span>
                          <span className="text-[10px] text-emerald-800 font-medium">※同姓誤認防止のため現地で照合</span>
                        </div>
                      </div>
                    </div>

                    {ord.graveInfo.landmarksDescription && (
                      <p className="text-[11px] text-stone-600 bg-white p-2.5 rounded-lg border border-stone-100">
                        📍 <strong>周辺目印:</strong> {ord.graveInfo.landmarksDescription}
                      </p>
                    )}
                  </div>

                  {/* アクション */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <span className="text-[11px] text-stone-500">
                      特記事項: {ord.graveInfo.specialRequests || '特になし'}
                    </span>
                    <Link
                      href={`/vendor/reports/${ord.id}`}
                      className="inline-flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>作業報告レポートを作成・編集する</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 写真拡大モーダル */}
        {previewPhoto && (
          <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-stone-900">{previewPhoto.title}</h3>
                <button
                  type="button"
                  onClick={() => setPreviewPhoto(null)}
                  className="text-stone-400 hover:text-stone-700 text-xs font-bold"
                >
                  ✕ 閉じる
                </button>
              </div>
              <img src={previewPhoto.url} alt="拡大写真" className="w-full h-80 object-cover rounded-xl border" />
              <button
                type="button"
                onClick={() => setPreviewPhoto(null)}
                className="w-full bg-stone-900 text-white text-xs font-bold py-2 rounded-xl"
              >
                閉じる
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VendorDashboardPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-stone-500">読み込み中...</div>}>
      <VendorDashboardContent />
    </Suspense>
  );
}
