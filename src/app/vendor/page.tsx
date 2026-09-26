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

  // Stripe受取口座連携ハンドラ
  const [isConnectingStripe, setIsConnectingStripe] = useState(false);
  const [stripeStatusMsg, setStripeStatusMsg] = useState<string | null>(null);

  const handleStripeConnect = async () => {
    setIsConnectingStripe(true);
    setStripeStatusMsg(null);
    try {
      const res = await fetch('/api/stripe/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetType: 'vendor',
          targetId: currentVendor.id,
          email: currentVendor.email,
          name: currentVendor.vendorProfile?.companyName || currentVendor.displayName,
          returnUrl: window.location.href,
        }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.url && !data.isMock) {
          window.location.href = data.url;
        } else {
          setStripeStatusMsg(data.message || 'Stripe受取口座が設定されました！');
          setVendors((prev) =>
            prev.map((v) =>
              v.id === currentVendor.id
                ? {
                    ...v,
                    vendorProfile: {
                      ...v.vendorProfile!,
                      stripeConnectAccountId: data.accountId,
                      stripeChargesEnabled: true,
                      stripePayoutsEnabled: true,
                    },
                  }
                : v
            )
          );
        }
      } else {
        alert(data.error || 'Stripe連携に失敗しました');
      }
    } catch (err) {
      alert('通信エラーが発生しました');
    } finally {
      setIsConnectingStripe(false);
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
                業者ポータル
              </span>
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
              className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-lg font-bold rounded-2xl shadow-md transition active:scale-95 flex items-center justify-center gap-2"
            >
              <Edit3 className="w-5 h-5" /> 情報編集
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
              <span className="block text-slate-500 text-base font-bold mb-2">提携霊園</span>
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

        {/* 2. 売上・報酬受取（Stripe Connect） */}
        <section className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-indigo-500/30">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-indigo-700/50">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-extrabold text-indigo-300 bg-indigo-950/80 px-3.5 py-1 rounded-full border border-indigo-500/40">
                  💳 売上・報酬のお受け取り
                </span>
                {currentVendor.vendorProfile?.stripePayoutsEnabled ? (
                  <span className="text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 text-sm font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 受取口座 連携済み
                  </span>
                ) : (
                  <span className="text-amber-300 bg-amber-950/80 border border-amber-500/40 text-sm font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                    ⚠️ 受取口座 未設定（設定が必要です）
                  </span>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Stripe 報酬受け取り・振込口座管理
              </h2>
              <p className="text-indigo-200/80 text-base mt-1">
                作業完了した代行報酬（80%）は、Stripeを通じてご登録の指定銀行口座へ安全に自動送金されます。
              </p>
            </div>

            {/* Stripe受取ボタン */}
            <div className="shrink-0 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleStripeConnect}
                disabled={isConnectingStripe}
                className="px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-lg font-black rounded-2xl shadow-lg shadow-emerald-500/25 transition active:scale-95 flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
              >
                <CreditCard className="w-6 h-6 text-slate-950" />
                <span>
                  {isConnectingStripe
                    ? 'Stripe連携処理中...'
                    : currentVendor.vendorProfile?.stripePayoutsEnabled
                    ? '💳 Stripe受取口座・振込履歴を確認する'
                    : '💳 Stripeの受け取り口座を設定する'}
                </span>
              </button>
            </div>
          </div>

          {stripeStatusMsg && (
            <div className="mt-4 p-4 bg-emerald-900/60 border border-emerald-500 text-emerald-200 text-base font-bold rounded-2xl">
              ✅ {stripeStatusMsg}
            </div>
          )}

          {/* 報酬サマリーと仕組み案内 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
              <span className="block text-indigo-200 text-sm font-bold">累計受取対象額</span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1 block">
                {totalEarnings.toLocaleString()} <span className="text-lg font-bold text-white">円</span>
              </span>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
              <span className="block text-indigo-200 text-sm font-bold">施工完了・レポート済</span>
              <span className="text-2xl sm:text-3xl font-black text-white mt-1 block">
                {completedCount} <span className="text-lg font-bold text-indigo-200">件</span>
              </span>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
              <span className="block text-indigo-200 text-sm font-bold">連携Stripeアカウント</span>
              <span className="text-base font-mono font-bold text-indigo-300 mt-2 block truncate">
                {currentVendor.vendorProfile?.stripeConnectAccountId || '未連携（ボタンから設定）'}
              </span>
            </div>
          </div>

          <div className="mt-4 text-xs sm:text-sm text-indigo-200/70 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Stripe Connectによる直接入金のため、プラットフォーム側で銀行口座の暗証番号や詳細口座情報が保持されることはなく安全です。</span>
          </div>
        </section>

        {/* 3. 担当する作業案件一覧 */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border-2 border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                担当案件（{vendorOrders.length}件）
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
                    ? { label: '完了', bg: 'bg-emerald-600' }
                    : order.status === 'in_progress'
                    ? { label: '作業中', bg: 'bg-blue-600' }
                    : order.status === 'paid'
                    ? { label: '準備中', bg: 'bg-amber-600' }
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
                        報酬: <span className="text-emerald-700 text-2xl font-extrabold">{order.vendorPayoutAmount?.toLocaleString()} 円</span>
                      </div>
                    </div>

                    {/* 墓石の特定情報 */}
                    <div className="bg-white p-6 rounded-2xl border-2 border-blue-200 shadow-sm space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded-md">
                          墓石照合
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                          <span className="block text-slate-500 text-base font-bold">正面文字</span>
                          <span className="font-extrabold text-slate-900 text-2xl">「{order.graveInfo.frontInscription}」</span>
                        </div>
                        <div className="p-4 bg-amber-50 rounded-xl border-2 border-amber-300">
                          <span className="block text-amber-900 text-base font-extrabold">側面建立者名</span>
                          <span className="font-extrabold text-amber-950 text-2xl">「{order.graveInfo.builderName}」</span>
                        </div>
                      </div>

                      {/* 写真プレビューボタン */}
                      <div className="flex flex-wrap gap-4 pt-2">
                        {order.graveInfo.frontInscriptionPhotoUrl && (
                          <button
                            type="button"
                            onClick={() => setPreviewPhoto({ title: '正面文字', url: order.graveInfo.frontInscriptionPhotoUrl! })}
                            className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-900 text-base font-bold rounded-xl border border-blue-300 flex items-center gap-2"
                          >
                            <Camera className="w-5 h-5" /> 正面写真
                          </button>
                        )}
                        {order.graveInfo.builderNamePhotoUrl && (
                          <button
                            type="button"
                            onClick={() => setPreviewPhoto({ title: '側面建立者', url: order.graveInfo.builderNamePhotoUrl! })}
                            className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 text-base font-bold rounded-xl border border-amber-300 flex items-center gap-2"
                          >
                            <Camera className="w-5 h-5" /> 側面写真
                          </button>
                        )}
                      </div>
                    </div>

                    {/* 霊園・区画・プラン内容 */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-base text-slate-800 bg-white p-5 rounded-2xl border border-slate-200">
                      <div>
                        <span className="block text-slate-500 font-bold">霊園</span>
                        <span className="font-extrabold text-slate-900 text-lg">{order.graveInfo.cemeteryName}</span>
                      </div>
                      <div>
                        <span className="block text-slate-500 font-bold">区画番号</span>
                        <span className="font-extrabold text-slate-900 text-lg">{order.graveInfo.sectionPlotNumber}</span>
                      </div>
                      <div>
                        <span className="block text-slate-500 font-bold">プラン</span>
                        <span className="font-extrabold text-slate-900 text-lg">{order.servicePlanName}</span>
                      </div>
                    </div>

                    {order.graveInfo.specialRequests && (
                      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-base text-amber-950 font-medium">
                        <strong>要望:</strong> {order.graveInfo.specialRequests}
                      </div>
                    )}

                    {/* 現場操作ボタングループ */}
                    <div className="pt-2 flex flex-wrap gap-4">
                      {order.status === 'paid' && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'in_progress')}
                          className="flex-1 py-4 px-6 bg-blue-700 hover:bg-blue-800 active:scale-95 text-white text-xl font-bold rounded-2xl shadow-lg transition flex items-center justify-center gap-3"
                        >
                          <span>▶️</span> 作業開始
                        </button>
                      )}

                      {order.status === 'in_progress' && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'completed')}
                          className="flex-1 py-4 px-6 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white text-xl font-bold rounded-2xl shadow-lg transition flex items-center justify-center gap-3"
                        >
                          <CheckCircle2 className="w-6 h-6" /> 作業完了・報告提出
                        </button>
                      )}

                      {order.status === 'completed' && (
                        <div className="flex-1 py-3 px-6 bg-emerald-100 border-2 border-emerald-500 text-emerald-900 text-base font-bold rounded-2xl text-center">
                          ✅ 作業完了済
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
            <h3 className="text-2xl font-extrabold text-slate-900 mb-6">
              自社情報編集
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div>
                <label className="block text-base font-bold text-slate-800 mb-1">
                  現場責任者
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
                <label className="block text-base font-bold text-slate-800 mb-1">
                  電話番号
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
                <label className="block text-base font-bold text-slate-800 mb-1">
                  対応エリア（カンマ区切り）
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
                <label className="block text-base font-bold text-slate-800 mb-1">
                  自己紹介
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
                  className="flex-1 py-3 px-6 bg-slate-200 hover:bg-slate-300 text-slate-800 text-lg font-bold rounded-2xl transition"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-6 bg-emerald-700 hover:bg-emerald-800 text-white text-lg font-bold rounded-2xl shadow-lg transition"
                >
                  保存
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
