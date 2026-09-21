'use client';

import React, { useState, useEffect, Suspense } from 'react';
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
  ChevronRight, 
  ArrowRight, 
  ShieldCheck, 
  User, 
  Sparkles,
  Edit3,
  X
} from 'lucide-react';
import { SAMPLE_VENDORS, SAMPLE_ORDERS, SAMPLE_CEMETERY_COMPANIES } from '@/mocks/sample-data';
import { Order, User as UserType } from '@/types/firestore';

function VendorDashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const fromSource = searchParams.get('from'); // 'admin' | 'cemetery' | null
  const sourceCompanyId = searchParams.get('companyId'); // 呼び出し元の墓地管理会社ID

  // 現在選択されている作業代行業者ID
  const currentVendorId = searchParams.get('vendorId') || SAMPLE_VENDORS[0].id;
  const [selectedVendorId, setSelectedVendorId] = useState<string>(currentVendorId);
  const [vendors, setVendors] = useState<UserType[]>(SAMPLE_VENDORS);
  const [orders, setOrders] = useState<Order[]>(SAMPLE_ORDERS);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');
  const [previewPhoto, setPreviewPhoto] = useState<{ title: string; url: string } | null>(null);

  // プロフィール編集モーダル状態
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFormData, setEditFormData] = useState({
    representativeName: '',
    phoneNumber: '',
    description: '',
    serviceAreas: '',
  });
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Escキーで開いているすべてのポップアップ・モーダルを閉じる
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPreviewPhoto(null);
        setIsEditingProfile(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 最新データのフェッチ
  useEffect(() => {
    async function loadData() {
      try {
        const [venRes, ordRes] = await Promise.all([
          fetch('/api/vendors'),
          fetch('/api/orders'),
        ]);
        if (venRes.ok) {
          const vData = await venRes.json();
          if (vData.vendors?.length) setVendors(vData.vendors);
        }
        if (ordRes.ok) {
          const oData = await ordRes.json();
          if (oData.orders?.length) setOrders(oData.orders);
        }
      } catch (e) {
        console.warn('API error, using local fallback:', e);
      }
    }
    loadData();
  }, []);

  // 選択中の業者
  const currentVendor = vendors.find((v) => v.id === selectedVendorId) || vendors[0];

  // 自社に割り当てられた注文一覧
  const vendorOrders = orders.filter((o) => o.vendorId === selectedVendorId);

  // 売上サマリー
  const totalEarnings = vendorOrders.reduce((sum, o) => sum + (o.vendorPayoutAmount || 0), 0);
  const completedCount = vendorOrders.filter((o) => o.status === 'completed' || o.status === 'report_submitted').length;

  // 提携している墓地管理会社
  const affiliatedCemeteries = SAMPLE_CEMETERY_COMPANIES.filter((cem) =>
    currentVendor.vendorProfile?.affiliatedCemeteryCompanyIds?.includes(cem.id)
  );

  // プロフィール編集を開く
  const handleOpenEdit = () => {
    setEditFormData({
      representativeName: currentVendor.vendorProfile?.representativeName || '',
      phoneNumber: currentVendor.phoneNumber || '',
      description: currentVendor.vendorProfile?.description || '',
      serviceAreas: currentVendor.vendorProfile?.serviceAreas?.join(', ') || '',
    });
    setIsEditingProfile(true);
  };

  // プロフィール保存
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated: UserType = {
        ...currentVendor,
        phoneNumber: editFormData.phoneNumber,
        vendorProfile: {
          ...currentVendor.vendorProfile!,
          representativeName: editFormData.representativeName,
          description: editFormData.description,
          serviceAreas: editFormData.serviceAreas.split(',').map((s) => s.trim()).filter(Boolean),
        },
      };

      const res = await fetch('/api/vendors', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });

      if (res.ok) {
        setVendors((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
        setIsEditingProfile(false);
        setSaveSuccessMsg('会社情報を保存しました！');
        setTimeout(() => setSaveSuccessMsg(null), 4000);
      } else {
        alert('保存に失敗しました');
      }
    } catch (err) {
      alert('エラーが発生しました');
    }
  };

  // 注文ステータスの変更
  const handleUpdateStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        setSaveSuccessMsg(`作業状態を更新しました！`);
        setTimeout(() => setSaveSuccessMsg(null), 3000);
      }
    } catch (err) {
      alert('ステータスの更新に失敗しました');
    }
  };

  // ログアウト
  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/vendor/login');
  };

  // フィルターされた注文
  const filteredOrders = vendorOrders.filter((o) => {
    if (statusFilter === 'pending') return o.status === 'paid';
    if (statusFilter === 'in_progress') return o.status === 'in_progress';
    if (statusFilter === 'completed') return o.status === 'completed' || o.status === 'report_submitted';
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-24">
      {/* ⚠️ 上位画面からの閲覧時のみ表示する戻りバー */}
      {fromSource === 'admin' && (
        <aside aria-label="管理者プレビュー案内" className="bg-amber-500 text-slate-950 font-bold px-6 py-3 shadow-md flex items-center justify-between">
          <div className="flex items-center gap-3 text-lg">
            <span className="text-2xl">⚠️</span>
            <span>【本部管理者プレビュー】現在、本部権限で作業代行業者の画面を表示しています</span>
          </div>
          <Link
            href="/admin"
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-base rounded-xl font-bold transition shadow"
          >
            ← 本部統括画面に戻る
          </Link>
        </aside>
      )}

      {fromSource === 'cemetery' && (
        <aside aria-label="墓地管理会社プレビュー案内" className="bg-blue-600 text-white font-bold px-6 py-3 shadow-md flex items-center justify-between">
          <div className="flex items-center gap-3 text-lg">
            <span className="text-2xl">🏛️</span>
            <span>【墓地管理会社からの確認】提携代行業者の作業画面を確認しています</span>
          </div>
          <Link
            href={`/cemetery?companyId=${sourceCompanyId || 'cem_comp_001'}`}
            className="px-5 py-2 bg-white hover:bg-slate-100 text-blue-900 text-base rounded-xl font-bold transition shadow"
          >
            ← 墓地管理会社画面に戻る
          </Link>
        </aside>
      )}

      {/* ヘッダー（ご高齢者・現場職人向け特大フォント＆高コントラスト） */}
      <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="px-3 py-1 bg-emerald-500 text-slate-950 text-sm font-extrabold rounded-md">
                作業代行業者 専用ポータル
              </span>
              <span className="text-slate-400 text-sm">文字サイズ：特大</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {currentVendor?.displayName}
            </h1>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* 操作マニュアルリンク */}
            <Link
              href="/vendor/manual"
              target="_blank"
              className="px-4 py-2.5 bg-blue-700 hover:bg-blue-600 text-white text-base font-bold rounded-xl border border-blue-500 transition flex items-center gap-1.5 shadow-sm"
            >
              <span>📖</span> 業務マニュアル
            </Link>

            {/* 上位画面からのプレビューでない場合はログアウトボタンを表示 */}
            {!fromSource && (
              <button
                onClick={handleLogout}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-base font-bold rounded-xl border border-slate-600 transition cursor-pointer"
              >
                ログアウト
              </button>
            )}

            {/* 業者切り替え（テスト・デモ用） */}
            <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-700">
              <label htmlFor="vendor-select" className="text-sm text-slate-400 font-bold whitespace-nowrap">業者切替:</label>
              <select
                id="vendor-select"
                value={selectedVendorId}
                onChange={(e) => {
                  setSelectedVendorId(e.target.value);
                  router.push(`/vendor?vendorId=${e.target.value}${fromSource ? `&from=${fromSource}` : ''}${sourceCompanyId ? `&companyId=${sourceCompanyId}` : ''}`);
                }}
                aria-label="作業代行業者の切り替え"
                className="bg-slate-800 text-white text-base font-bold px-3 py-1.5 rounded-lg border border-slate-600 outline-none"
              >
                {vendors.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.displayName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* 成功通知 */}
      {saveSuccessMsg && (
        <div className="max-w-6xl mx-auto px-4 mt-6">
          <div className="p-4 bg-emerald-100 border-2 border-emerald-500 text-emerald-900 text-xl font-bold rounded-2xl shadow">
            ✅ {saveSuccessMsg}
          </div>
        </div>
      )}

      {/* メインエリア */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* 1. 自社情報 ＆ 実績サマリー */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border-2 border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-slate-200">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-base font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                  自社プロフィール
                </span>
                <span className="text-amber-700 font-extrabold text-base bg-amber-50 px-3 py-1 rounded-full border border-amber-300">
                  ★ お客様評価: {currentVendor.vendorProfile?.rating} 点
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {currentVendor.vendorProfile?.companyName || currentVendor.displayName}
              </h2>
            </div>
            <button
              onClick={handleOpenEdit}
              className="px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xl font-bold rounded-2xl shadow-md transition active:scale-95 flex items-center justify-center gap-2"
            >
              <Edit3 className="w-5 h-5" /> 自社情報を変更する（編集）
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 text-lg">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <span className="block text-slate-500 text-base font-bold">現場責任者</span>
              <span className="font-extrabold text-slate-900 text-xl">{currentVendor.vendorProfile?.representativeName}</span>
            </div>
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <span className="block text-slate-500 text-base font-bold">電話番号</span>
              <a href={`tel:${currentVendor.phoneNumber}`} className="font-extrabold text-emerald-800 hover:underline text-2xl">
                📞 {currentVendor.phoneNumber}
              </a>
            </div>
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <span className="block text-slate-500 text-base font-bold">施工完了実績</span>
              <span className="font-extrabold text-slate-900 text-2xl">{currentVendor.vendorProfile?.completedJobsCount} 件 完了</span>
            </div>
            <div className="md:col-span-3 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <span className="block text-slate-500 text-base font-bold mb-2">提携している墓地管理会社（霊園）</span>
              <div className="flex flex-wrap gap-2">
                {affiliatedCemeteries.map((cem) => (
                  <span key={cem.id} className="bg-amber-100 text-amber-900 border border-amber-300 px-4 py-2 rounded-xl text-lg font-bold">
                    🏛️ {cem.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 2. 担当する作業案件一覧（現場用・高齢者向け大画面） */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border-2 border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-base font-bold text-blue-800 bg-blue-100 px-3 py-1 rounded-full">
                現場のお仕事
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                担当案件一覧（{vendorOrders.length}件）
              </h2>
            </div>

            {/* 状態フィルターボタン */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-4 py-2 text-base font-bold rounded-xl transition ${
                  statusFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                すべて
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-4 py-2 text-base font-bold rounded-xl transition ${
                  statusFilter === 'pending' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                }`}
              >
                準備中
              </button>
              <button
                onClick={() => setStatusFilter('in_progress')}
                className={`px-4 py-2 text-base font-bold rounded-xl transition ${
                  statusFilter === 'in_progress' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
                }`}
              >
                作業中
              </button>
              <button
                onClick={() => setStatusFilter('completed')}
                className={`px-4 py-2 text-base font-bold rounded-xl transition ${
                  statusFilter === 'completed' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                }`}
              >
                完了済み
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xl font-bold">
                該当する作業案件はありません
              </div>
            ) : (
              filteredOrders.map((order) => {
                const statusBadge =
                  order.status === 'completed'
                    ? { label: '作業完了（報告済）', bg: 'bg-emerald-600' }
                    : order.status === 'in_progress'
                    ? { label: '現場作業中', bg: 'bg-blue-600' }
                    : order.status === 'paid'
                    ? { label: '作業前（準備中）', bg: 'bg-amber-600' }
                    : { label: '確認中', bg: 'bg-slate-500' };

                return (
                  <div
                    key={order.id}
                    className="bg-slate-50 border-2 border-slate-300 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className={`text-white text-base font-bold px-4 py-1.5 rounded-full ${statusBadge.bg}`}>
                          {statusBadge.label}
                        </span>
                        <span className="text-slate-500 text-base font-bold">
                          注文番号: {order.orderNumber}
                        </span>
                      </div>
                      <div className="text-xl font-bold text-slate-800">
                        受取報酬: <span className="text-emerald-700 text-2xl font-extrabold">{order.vendorPayoutAmount?.toLocaleString()} 円</span>
                      </div>
                    </div>

                    {/* 墓石の特定情報（最重要） */}
                    <div className="bg-white p-6 rounded-2xl border-2 border-blue-200 shadow-sm space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="bg-blue-600 text-white text-base font-bold px-3 py-1 rounded-md">
                          特定情報（同姓誤認防止）
                        </span>
                        <span className="text-lg font-bold text-blue-950">現場で墓石を確認してください</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                          <span className="block text-slate-500 text-base font-bold">正面文字（墓石の刻字）</span>
                          <span className="font-extrabold text-slate-900 text-2xl">「{order.graveInfo.frontInscription}」</span>
                        </div>
                        <div className="p-4 bg-amber-50 rounded-xl border-2 border-amber-300">
                          <span className="block text-amber-900 text-base font-extrabold">側面建立者名（必須照合）</span>
                          <span className="font-extrabold text-amber-950 text-2xl">「{order.graveInfo.builderName}」</span>
                        </div>
                      </div>

                      {/* 写真プレビューボタン */}
                      <div className="flex flex-wrap gap-4 pt-2">
                        {order.graveInfo.frontInscriptionPhotoUrl && (
                          <button
                            type="button"
                            onClick={() => setPreviewPhoto({ title: '正面文字の写真', url: order.graveInfo.frontInscriptionPhotoUrl! })}
                            className="px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-900 text-base font-bold rounded-xl border border-blue-300 flex items-center gap-2"
                          >
                            <Camera className="w-5 h-5" /> 正面文字の写真を見る
                          </button>
                        )}
                        {order.graveInfo.builderNamePhotoUrl && (
                          <button
                            type="button"
                            onClick={() => setPreviewPhoto({ title: '側面建立者の写真', url: order.graveInfo.builderNamePhotoUrl! })}
                            className="px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 text-base font-bold rounded-xl border border-amber-300 flex items-center gap-2"
                          >
                            <Camera className="w-5 h-5" /> 側面建立者の写真を見る
                          </button>
                        )}
                      </div>
                    </div>

                    {/* 霊園・区画・プラン内容 */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-base text-slate-800 bg-white p-5 rounded-2xl border border-slate-200">
                      <div>
                        <span className="block text-slate-500 font-bold">霊園・寺院名</span>
                        <span className="font-extrabold text-slate-900 text-lg">{order.graveInfo.cemeteryName}</span>
                      </div>
                      <div>
                        <span className="block text-slate-500 font-bold">区画・墓石番号</span>
                        <span className="font-extrabold text-slate-900 text-lg">{order.graveInfo.sectionPlotNumber}</span>
                      </div>
                      <div>
                        <span className="block text-slate-500 font-bold">お申込プラン</span>
                        <span className="font-extrabold text-slate-900 text-lg">{order.servicePlanName}</span>
                      </div>
                    </div>

                    {order.graveInfo.specialRequests && (
                      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-lg text-amber-950 font-medium">
                        <strong>施主様からのご要望:</strong> {order.graveInfo.specialRequests}
                      </div>
                    )}

                    {/* 現場操作用の特大ボタングループ */}
                    <div className="pt-2 flex flex-wrap gap-4">
                      {order.status === 'paid' && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'in_progress')}
                          className="flex-1 py-4 px-6 bg-blue-700 hover:bg-blue-800 active:scale-95 text-white text-xl font-bold rounded-2xl shadow-lg transition flex items-center justify-center gap-3"
                        >
                          <span>▶️</span> 「作業開始」にする
                        </button>
                      )}

                      {order.status === 'in_progress' && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'completed')}
                          className="flex-1 py-4 px-6 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white text-xl font-bold rounded-2xl shadow-lg transition flex items-center justify-center gap-3"
                        >
                          <CheckCircle2 className="w-6 h-6" /> 「作業完了・報告提出」にする
                        </button>
                      )}

                      {order.status === 'completed' && (
                        <div className="flex-1 py-4 px-6 bg-emerald-100 border-2 border-emerald-500 text-emerald-900 text-lg font-bold rounded-2xl text-center">
                          ✅ この案件は作業完了済みです（報告書送付済み）
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </main>

      {/* 写真プレビューモーダル */}
      {previewPhoto && (
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setPreviewPhoto(null); }}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm cursor-pointer"
        >
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 cursor-default">
            <div className="flex items-center justify-between">
              <h4 className="text-2xl font-extrabold text-slate-900">{previewPhoto.title}</h4>
              <button
                onClick={() => setPreviewPhoto(null)}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-600 cursor-pointer"
              >
                <X className="w-8 h-8" />
              </button>
            </div>
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border-2 border-slate-300">
              <img src={previewPhoto.url} alt={previewPhoto.title} className="w-full h-full object-cover" />
            </div>
            <button
              onClick={() => setPreviewPhoto(null)}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white text-lg font-bold rounded-xl cursor-pointer transition"
            >
              閉じる
            </button>
          </div>
        </div>
      )}

      {/* プロフィール編集モーダル */}
      {isEditingProfile && (
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setIsEditingProfile(false); }}
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm cursor-pointer"
        >
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border-4 border-emerald-600 max-h-[90vh] overflow-y-auto cursor-default">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
              自社情報の変更・編集
            </h3>
            <p className="text-slate-600 text-base mb-6 font-medium">
              入力内容を修正して「更新を保存する」ボタンを押してください。
            </p>

            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div>
                <label className="block text-lg font-bold text-slate-800 mb-1">
                  現場責任者名
                </label>
                <input
                  type="text"
                  required
                  value={editFormData.representativeName}
                  onChange={(e) => setEditFormData({ ...editFormData, representativeName: e.target.value })}
                  className="w-full text-lg p-3.5 rounded-xl border-2 border-slate-300 focus:border-emerald-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-lg font-bold text-slate-800 mb-1">
                  連絡先お電話番号
                </label>
                <input
                  type="text"
                  required
                  value={editFormData.phoneNumber}
                  onChange={(e) => setEditFormData({ ...editFormData, phoneNumber: e.target.value })}
                  className="w-full text-lg p-3.5 rounded-xl border-2 border-emerald-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-lg font-bold text-slate-800 mb-1">
                  対応可能エリア（カンマ区切り）
                </label>
                <input
                  type="text"
                  required
                  value={editFormData.serviceAreas}
                  onChange={(e) => setEditFormData({ ...editFormData, serviceAreas: e.target.value })}
                  className="w-full text-lg p-3.5 rounded-xl border-2 border-slate-300 focus:border-emerald-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-lg font-bold text-slate-800 mb-1">
                  会社・店舗の自己紹介
                </label>
                <textarea
                  rows={3}
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  className="w-full text-lg p-3.5 rounded-xl border-2 border-slate-300 focus:border-emerald-600 outline-none"
                />
              </div>

              <div className="pt-4 border-t-2 border-slate-200 flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="flex-1 py-4 px-6 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xl font-bold rounded-2xl transition"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 px-6 bg-emerald-700 hover:bg-emerald-800 text-white text-xl font-bold rounded-2xl shadow-lg transition"
                >
                  更新を保存する
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VendorPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xl font-bold text-slate-600">読み込み中...</div>}>
      <VendorDashboardContent />
    </Suspense>
  );
}
