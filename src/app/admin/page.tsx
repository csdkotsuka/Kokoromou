'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Users, 
  CreditCard, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  ArrowRight, 
  Search, 
  Filter, 
  ShieldCheck, 
  Eye, 
  Camera, 
  Layers, 
  MapPin, 
  RefreshCw,
  PlusCircle,
  Clock,
  ArrowUpRight,
  ChevronRight
} from 'lucide-react';
import { SAMPLE_VENDORS, SAMPLE_ORDERS, SAMPLE_SERVICE_PLANS } from '@/mocks/sample-data';
import { Order, User } from '@/types/firestore';

export default function AdminDashboardPage() {
  const [vendors, setVendors] = useState<User[]>(SAMPLE_VENDORS);
  const [orders, setOrders] = useState<Order[]>(SAMPLE_ORDERS);
  const [selectedTab, setSelectedTab] = useState<'orders' | 'vendors'>('orders');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewPhoto, setPreviewPhoto] = useState<{ title: string; url: string } | null>(null);

  // 売上・手数料の集計
  const totalVolume = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalPlatformFee = orders.reduce((sum, o) => sum + o.platformFeeAmount, 0);
  const totalVendorPayout = orders.reduce((sum, o) => sum + o.vendorPayoutAmount, 0);

  // 担当管理会社（パートナー）の切り替えハンドラー
  const handleAssignVendor = (orderId: string, newVendorId: string) => {
    const targetVendor = vendors.find((v) => v.id === newVendorId);
    if (!targetVendor) return;

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            vendorId: targetVendor.id,
            vendorName: targetVendor.displayName,
            vendorStripeAccountId: targetVendor.vendorProfile?.stripeConnectAccountId || '',
          };
        }
        return ord;
      })
    );
  };

  // 注文ステータスの切り替え
  const handleStatusChange = (orderId: string, newStatus: any) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    );
  };

  // フィルタリング
  const filteredOrders = orders.filter(
    (o) =>
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.graveInfo.cemeteryName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredVendors = vendors.filter(
    (v) =>
      v.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.vendorProfile?.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.vendorProfile?.serviceAreas.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-stone-100/70 py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* 本部管理者ヘッダー */}
        <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-950 text-emerald-300 border border-emerald-800/80 px-3 py-1 rounded-full text-xs font-semibold mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ココロモウ プラットフォーム運営本部</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">自社統括・管理ポータル</h1>
            <p className="text-xs sm:text-sm text-stone-400 mt-1">
              全体の流通額・手数料売上集計、提携墓地管理会社の管理、注文ごとの担当会社切り替え・アサイン
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/vendor"
              className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition"
            >
              <Building2 className="w-4 h-4" />
              <span>各管理会社の専用画面を見る</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/order"
              className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2.5 rounded-xl border border-white/20 transition"
            >
              <span>一般申込画面を確認</span>
            </Link>
          </div>
        </div>

        {/* 経営指標KPIカード */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs font-semibold">プラットフォーム総取扱高 (GMV)</span>
              <TrendingUp className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="text-2xl font-black text-stone-900">¥{totalVolume.toLocaleString()}</div>
            <span className="text-[11px] text-stone-500 mt-1 block">全受注金額の総計 (税込)</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs ring-2 ring-emerald-600/20 bg-emerald-50/20">
            <div className="flex items-center justify-between text-emerald-800 mb-2">
              <span className="text-xs font-bold">自社手数料売上 (20%)</span>
              <CreditCard className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="text-2xl font-black text-emerald-800">¥{totalPlatformFee.toLocaleString()}</div>
            <span className="text-[11px] text-emerald-700 mt-1 block">Stripe Connect自動留保純売上</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs font-semibold">提携会社送金予定額 (80%)</span>
              <Building2 className="w-4 h-4 text-stone-700" />
            </div>
            <div className="text-2xl font-black text-stone-900">¥{totalVendorPayout.toLocaleString()}</div>
            <span className="text-[11px] text-stone-500 mt-1 block">管理会社への直接送金総額</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs font-semibold">登録提携会社数 / 総注文数</span>
              <Users className="w-4 h-4 text-stone-700" />
            </div>
            <div className="text-2xl font-black text-stone-900">
              {vendors.length}社 <span className="text-base font-normal text-stone-500">/ {orders.length}件</span>
            </div>
            <span className="text-[11px] text-emerald-700 font-medium mt-1 block">全社 Stripe Connect 接続済</span>
          </div>
        </div>

        {/* タブ切り替えバー */}
        <div className="bg-white p-2 rounded-2xl border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setSelectedTab('orders')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                selectedTab === 'orders'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              受注・担当管理会社アサイン ({orders.length}件)
            </button>
            <button
              type="button"
              onClick={() => setSelectedTab('vendors')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                selectedTab === 'vendors'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              提携墓地管理会社一覧 ({vendors.length}社)
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="会社名、施主名、霊園名で検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-stone-50 border border-stone-300 rounded-xl pl-9 pr-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* タブ1: 受注案件 ＆ 担当管理会社の切り替え（アサイン） */}
        {selectedTab === 'orders' && (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-stone-100 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-stone-900">受注案件一覧 ＆ 担当管理会社アサイン</h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  注文ごとに担当する墓地管理会社をドロップダウンで即座に切り替え・再割り当てできます。
                </p>
              </div>
              <span className="text-xs text-stone-500 font-medium">該当: {filteredOrders.length}件</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">注文番号 / 日時</th>
                    <th className="py-3.5 px-4">施主情報</th>
                    <th className="py-3.5 px-4">墓石特定情報（正面/側面写真・基数）</th>
                    <th className="py-3.5 px-4">プラン / 金額</th>
                    <th className="py-3.5 px-4">担当管理会社の切り替え</th>
                    <th className="py-3.5 px-4">ステータス</th>
                    <th className="py-3.5 px-4 text-right">アクション</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="py-4 px-4 align-top">
                        <span className="font-bold text-stone-900 block font-mono">{ord.orderNumber}</span>
                        <span className="text-[10px] text-stone-400 block mt-0.5">
                          {new Date(ord.createdAt).toLocaleDateString('ja-JP')}
                        </span>
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold inline-block mt-1">
                          希望: {ord.preferredDate || '指定なし'}
                        </span>
                      </td>

                      <td className="py-4 px-4 align-top">
                        <span className="font-bold text-stone-900 block">{ord.clientName} 様</span>
                        <span className="text-[11px] text-stone-500 block">{ord.clientEmail}</span>
                      </td>

                      <td className="py-4 px-4 align-top max-w-xs space-y-1.5">
                        <div>
                          <span className="font-semibold text-stone-900 block truncate">
                            {ord.graveInfo.cemeteryName} ({ord.graveInfo.sectionPlotNumber})
                          </span>
                        </div>
                        <div className="bg-stone-50 p-2 rounded-lg border border-stone-200/80 space-y-1 text-[11px]">
                          <div>
                            <span className="text-stone-500">正面: </span>
                            <span className="font-bold text-stone-800">{ord.graveInfo.frontInscription}</span>
                          </div>
                          <div>
                            <span className="text-stone-500">建立者: </span>
                            <span className="font-bold text-emerald-800">{ord.graveInfo.builderName}</span>
                          </div>
                          <div className="text-[10px] text-stone-600">
                            基数: <strong>{ord.graveInfo.graveCount || 1}基</strong> / 広さ: {ord.graveInfo.plotSize === 'extra_large' ? '特大' : ord.graveInfo.plotSize === 'large' ? '広め' : '標準'}
                          </div>
                        </div>

                        {/* 正面写真・側面建立者写真プレビューリンク */}
                        <div className="flex gap-2 pt-0.5">
                          {ord.graveInfo.frontInscriptionPhotoUrl && (
                            <button
                              type="button"
                              onClick={() =>
                                setPreviewPhoto({
                                  title: `正面文字写真 - ${ord.graveInfo.frontInscription}`,
                                  url: ord.graveInfo.frontInscriptionPhotoUrl!,
                                })
                              }
                              className="inline-flex items-center gap-1 text-[10px] text-emerald-800 hover:text-emerald-950 font-bold bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded border border-emerald-200 transition"
                            >
                              <Camera className="w-3 h-3 text-emerald-700" />
                              <span>正面写真</span>
                            </button>
                          )}
                          {ord.graveInfo.builderNamePhotoUrl && (
                            <button
                              type="button"
                              onClick={() =>
                                setPreviewPhoto({
                                  title: `側面建立者名写真 - ${ord.graveInfo.builderName}`,
                                  url: ord.graveInfo.builderNamePhotoUrl!,
                                })
                              }
                              className="inline-flex items-center gap-1 text-[10px] text-amber-800 hover:text-amber-950 font-bold bg-amber-50 hover:bg-amber-100 px-2 py-1 rounded border border-amber-200 transition"
                            >
                              <Camera className="w-3 h-3 text-amber-700" />
                              <span>側面建立者写真</span>
                            </button>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-4 align-top">
                        <span className="font-medium text-stone-800 block text-[11px]">{ord.servicePlanName}</span>
                        <span className="font-black text-stone-900 text-sm block mt-1">
                          ¥{ord.totalAmount.toLocaleString()}
                        </span>
                        <div className="text-[10px] text-stone-500 mt-1">
                          手数料: ¥{ord.platformFeeAmount.toLocaleString()} (20%)<br />
                          業者受取: ¥{ord.vendorPayoutAmount.toLocaleString()}
                        </div>
                      </td>

                      {/* 担当管理会社セレクター（切り替え可能） */}
                      <td className="py-4 px-4 align-top">
                        <select
                          value={ord.vendorId}
                          onChange={(e) => handleAssignVendor(ord.id, e.target.value)}
                          className="w-full text-xs font-semibold bg-white border border-emerald-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-stone-900 shadow-xs"
                        >
                          {vendors.map((v) => (
                            <option key={v.id} value={v.id}>
                              {v.displayName}
                            </option>
                          ))}
                        </select>
                        <span className="text-[10px] text-stone-500 block mt-1">
                          送金先: {ord.vendorStripeAccountId || 'Stripe未連携'}
                        </span>
                      </td>

                      {/* ステータスドロップダウン */}
                      <td className="py-4 px-4 align-top">
                        <select
                          value={ord.status}
                          onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                          className={`text-xs font-bold rounded-lg px-2.5 py-1.5 border ${
                            ord.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : ord.status === 'in_progress'
                              ? 'bg-blue-100 text-blue-800 border-blue-300'
                              : ord.status === 'report_submitted'
                              ? 'bg-purple-100 text-purple-800 border-purple-300'
                              : 'bg-amber-100 text-amber-800 border-amber-300'
                          }`}
                        >
                          <option value="paid">決済完了 (未着手)</option>
                          <option value="in_progress">現地作業中</option>
                          <option value="report_submitted">写真レポート提出済</option>
                          <option value="completed">作業完了 (確認済)</option>
                        </select>
                      </td>

                      <td className="py-4 px-4 align-top text-right space-y-1">
                        <Link
                          href={`/vendor/reports/${ord.id}`}
                          className="inline-flex items-center gap-1 text-[11px] text-emerald-800 hover:text-emerald-950 font-bold bg-white hover:bg-stone-50 px-2.5 py-1.5 rounded-lg border border-stone-200 shadow-xs transition"
                        >
                          <span>報告書編集</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* タブ2: 提携墓地管理会社一覧 */}
        {selectedTab === 'vendors' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-stone-900">登録済み 提携墓地管理会社（パートナー）</h2>
              <span className="text-xs text-stone-500">計 {filteredVendors.length}社 登録中</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVendors.map((vendor) => {
                const assignedCount = orders.filter((o) => o.vendorId === vendor.id).length;
                return (
                  <div
                    key={vendor.id}
                    className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                            {vendor.vendorProfile?.stripeChargesEnabled ? 'Stripe Connect 接続済' : '未接続'}
                          </span>
                          <h3 className="text-base font-bold text-stone-900 mt-1.5 leading-snug">
                            {vendor.displayName}
                          </h3>
                        </div>
                        <span className="text-amber-600 font-bold text-xs bg-amber-50 px-2 py-1 rounded-lg border border-amber-200 shrink-0">
                          ★ {vendor.vendorProfile?.rating}
                        </span>
                      </div>

                      <div className="text-xs text-stone-600 space-y-1 pt-2 border-t border-stone-100">
                        <div>
                          <span className="text-stone-400">法人名: </span>
                          <span className="font-semibold text-stone-800">{vendor.vendorProfile?.companyName}</span>
                        </div>
                        <div>
                          <span className="text-stone-400">担当代表者: </span>
                          <span className="font-semibold text-stone-800">{vendor.vendorProfile?.representativeName}</span>
                        </div>
                        <div>
                          <span className="text-stone-400">連絡先: </span>
                          <span className="font-mono text-stone-700">{vendor.phoneNumber}</span>
                        </div>
                        <div>
                          <span className="text-stone-400">対応エリア: </span>
                          <span className="text-emerald-900 font-medium">
                            {vendor.vendorProfile?.serviceAreas.join('、')}
                          </span>
                        </div>
                      </div>

                      <p className="text-[11px] text-stone-500 leading-relaxed bg-stone-50 p-2.5 rounded-xl border border-stone-200/60">
                        {vendor.vendorProfile?.description}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-stone-400 block">現在のアサイン案件</span>
                        <span className="text-sm font-black text-stone-900">{assignedCount} 件</span>
                      </div>

                      {/* この管理会社のダッシュボードへジャンプ */}
                      <Link
                        href={`/vendor?vendorId=${vendor.id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold bg-emerald-800 hover:bg-emerald-900 text-white px-3.5 py-2 rounded-xl shadow-xs transition"
                      >
                        <span>管理画面へ切替</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 写真モーダルポップアップ */}
        {previewPhoto && (
          <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl space-y-4 p-6 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-stone-900">{previewPhoto.title}</h3>
                <button
                  type="button"
                  onClick={() => setPreviewPhoto(null)}
                  className="text-stone-400 hover:text-stone-700 font-bold text-sm px-2 py-1 rounded-lg hover:bg-stone-100"
                >
                  ✕ 閉じる
                </button>
              </div>
              <div className="rounded-2xl overflow-hidden border border-stone-200">
                <img src={previewPhoto.url} alt="拡大写真" className="w-full h-80 object-cover" />
              </div>
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setPreviewPhoto(null)}
                  className="bg-stone-900 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-stone-800 transition"
                >
                  閉じる
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
