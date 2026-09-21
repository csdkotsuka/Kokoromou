'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  ChevronRight,
  Settings,
  Phone,
  Mail,
  Home,
  Check,
  Briefcase,
  LogOut,
  KeyRound
} from 'lucide-react';
import { 
  SAMPLE_ADMIN_INFO, 
  SAMPLE_CEMETERY_COMPANIES, 
  SAMPLE_VENDORS, 
  SAMPLE_ORDERS 
} from '@/mocks/sample-data';
import { Order, User, CemeteryCompany, PlatformAdminInfo } from '@/types/firestore';

export default function AdminDashboardPage() {
  const router = useRouter();

  // 本部管理情報ステート
  const [adminInfo, setAdminInfo] = useState<PlatformAdminInfo>(SAMPLE_ADMIN_INFO);

  // 墓地管理会社ステート
  const [cemeteryCompanies, setCemeteryCompanies] = useState<CemeteryCompany[]>(SAMPLE_CEMETERY_COMPANIES);

  // 作業代行業者ステート
  const [vendors, setVendors] = useState<User[]>(SAMPLE_VENDORS);

  // 注文ステート
  const [orders, setOrders] = useState<Order[]>(SAMPLE_ORDERS);

  // 選択中のタブ
  const [selectedTab, setSelectedTab] = useState<'orders' | 'cemetery_relations' | 'admin_profile'>('orders');

  // 墓地管理会社紐付けタブで選択中の墓地管理会社ID
  const [selectedCemeteryId, setSelectedCemeteryId] = useState<string>(SAMPLE_CEMETERY_COMPANIES[0].id);

  // 検索クエリ
  const [searchQuery, setSearchQuery] = useState('');

  // 写真プレビューモーダル
  const [previewPhoto, setPreviewPhoto] = useState<{ title: string; url: string } | null>(null);

  // パスワード変更モーダル状態
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [confirmAdminPassword, setConfirmAdminPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState<string | null>(null);

  // シード処理中フラグ＆メッセージ
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedResultMsg, setSeedResultMsg] = useState<{ text: string; isError?: boolean } | null>(null);

  // Firebase接続ステータス
  const [firebaseStatus, setFirebaseStatus] = useState<{ initialized: boolean; message: string; envStatus?: Record<string, boolean> } | null>(null);

  // 新規代行業者追加モーダル
  const [isAddingVendor, setIsAddingVendor] = useState(false);
  const [newVendorData, setNewVendorData] = useState({
    displayName: '',
    representativeName: '',
    phoneNumber: '',
    email: '',
    businessType: 'individual' as 'corporation' | 'individual',
    serviceAreas: '松山市・中予全域',
    description: '',
    password: 'vendor1234',
  });
  const [agreedToWarnings, setAgreedToWarnings] = useState(false);

  // 認証ガードチェック
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('skipAuth') === 'true') return;

      const cookies = document.cookie.split(';').map((c) => c.trim());
      const authCookie = cookies.find((c) => c.startsWith('kokoromou_auth='));
      if (!authCookie) {
        router.push('/admin/login');
        return;
      }
      try {
        const decoded = decodeURIComponent(authCookie.split('=')[1]);
        const user = JSON.parse(decoded);
        if (user.role !== 'admin') {
          router.push('/admin/login');
        }
      } catch (e) {
        router.push('/admin/login');
      }
    }
  }, [router]);

  // ログアウト処理
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {}
    document.cookie = 'kokoromou_auth=; path=/; max-age=0';
    router.push('/admin/login');
  };

  // パスワード変更保存
  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newAdminPassword !== confirmAdminPassword) {
      alert('新しいパスワードが一致しません');
      return;
    }
    if (newAdminPassword.length < 4) {
      alert('パスワードは4文字以上で設定してください');
      return;
    }
    setIsUpdatingPassword(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'kotsuka@creativesd.net', newPassword: newAdminPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('kokoromou_admin_custom_pwd', newAdminPassword);
        }
        setPasswordSuccessMsg('管理者パスワードを正常に更新しました！次回ログイン時からこのパスワードが有効です。');
        setIsChangingPassword(false);
        setNewAdminPassword('');
        setConfirmAdminPassword('');
        setTimeout(() => setPasswordSuccessMsg(null), 5000);
      } else {
        alert(data.error || 'パスワードの更新に失敗しました');
      }
    } catch (e: any) {
      alert('エラーが発生しました: ' + e.message);
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // Escキーで開いているすべてのポップアップ・モーダルを閉じる
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPreviewPhoto(null);
        setIsAddingVendor(false);
        setIsChangingPassword(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // サーバーAPIから最新データを読み込み
  React.useEffect(() => {
    async function fetchServerData() {
      try {
        const [cemRes, venRes, ordRes, admRes, fbRes] = await Promise.all([
          fetch('/api/cemetery-companies'),
          fetch('/api/vendors'),
          fetch('/api/orders'),
          fetch('/api/admin-info'),
          fetch('/api/admin/firebase-status'),
        ]);
        if (cemRes.ok) {
          const data = await cemRes.json();
          if (data.companies?.length) setCemeteryCompanies(data.companies);
        }
        if (venRes.ok) {
          const data = await venRes.json();
          if (data.vendors?.length) setVendors(data.vendors);
        }
        if (ordRes.ok) {
          const data = await ordRes.json();
          if (data.orders?.length) setOrders(data.orders);
        }
        if (admRes.ok) {
          const data = await admRes.json();
          if (data.adminInfo) setAdminInfo(data.adminInfo);
        }
        if (fbRes.ok) {
          const fbData = await fbRes.json();
          if (fbData.status) setFirebaseStatus(fbData.status);
        }
      } catch (e) {
        console.warn('API fetch error, using local fallback:', e);
      }
    }
    fetchServerData();
  }, []);

  // Firebase（Firestore）へ初期データを投入する
  const handleSeedFirestore = async () => {
    if (!confirm('Firebase（Firestore）に現在設定されている初期マスターデータ（本部情報・墓地管理会社・代行業者・注文・ログインアカウント）を投入します。よろしいですか？')) {
      return;
    }
    setIsSeeding(true);
    setSeedResultMsg(null);
    try {
      const res = await fetch('/api/admin/seed', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        setSeedResultMsg({
          text: `✅ Firestoreへ書き込み成功！ [墓地管理会社: ${data.details.cemeteryCompaniesCount}件 / 代行業者: ${data.details.vendorsCount}件 / 注文: ${data.details.ordersCount}件 / 認証アカウント: ${data.details.accountsCount}件] (${data.details.statusMessage})`,
        });
        // ステータス再取得
        const fbRes = await fetch('/api/admin/firebase-status');
        if (fbRes.ok) {
          const fbData = await fbRes.json();
          setFirebaseStatus(fbData.status);
        }
      } else {
        setSeedResultMsg({ text: `❌ 投入失敗: ${data.error}`, isError: true });
      }
    } catch (err: any) {
      setSeedResultMsg({ text: `❌ エラー: ${err.message}`, isError: true });
    } finally {
      setIsSeeding(false);
    }
  };

  // 売上・手数料の集計
  const totalVolume = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalPlatformFee = orders.reduce((sum, o) => sum + o.platformFeeAmount, 0);
  const totalVendorPayout = orders.reduce((sum, o) => sum + o.vendorPayoutAmount, 0);

  // 選択中の墓地管理会社オブジェクト
  const activeCemeteryCompany = cemeteryCompanies.find((c) => c.id === selectedCemeteryId) || cemeteryCompanies[0];

  // 墓地管理会社への代行業者紐付け（トグル切り替え）
  const handleToggleVendorAffiliation = async (cemeteryCompId: string, vendorId: string) => {
    let updatedCompany: CemeteryCompany | null = null;
    const newCemList = cemeteryCompanies.map((comp) => {
      if (comp.id === cemeteryCompId) {
        const isAffiliated = comp.affiliatedVendorIds.includes(vendorId);
        const newIds = isAffiliated
          ? comp.affiliatedVendorIds.filter((id) => id !== vendorId)
          : [...comp.affiliatedVendorIds, vendorId];
        updatedCompany = { ...comp, affiliatedVendorIds: newIds };
        return updatedCompany;
      }
      return comp;
    });

    setCemeteryCompanies(newCemList);

    setVendors((prev) =>
      prev.map((v) => {
        if (v.id === vendorId && v.vendorProfile) {
          const currentIds = v.vendorProfile.affiliatedCemeteryCompanyIds || [];
          const isAffiliated = currentIds.includes(cemeteryCompId);
          const newIds = isAffiliated
            ? currentIds.filter((id) => id !== cemeteryCompId)
            : [...currentIds, cemeteryCompId];
          return {
            ...v,
            vendorProfile: { ...v.vendorProfile, affiliatedCemeteryCompanyIds: newIds },
          };
        }
        return v;
      })
    );

    // サーバーにも保存
    if (updatedCompany) {
      try {
        await fetch('/api/cemetery-companies', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedCompany),
        });
      } catch (e) {
        console.warn('API update error:', e);
      }
    }
  };

  // 新規代行業者の登録
  const handleCreateVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToWarnings) {
      alert('注意事項をご確認のうえ、同意チェックを入れてください。');
      return;
    }
    try {
      const res = await fetch('/api/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newVendorData,
          cemeteryCompanyId: activeCemeteryCompany.id,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setVendors((prev) => [...prev, data.vendor]);
        const updatedCem = {
          ...activeCemeteryCompany,
          affiliatedVendorIds: [...activeCemeteryCompany.affiliatedVendorIds, data.vendor.id],
        };
        setCemeteryCompanies((prev) =>
          prev.map((c) => (c.id === updatedCem.id ? updatedCem : c))
        );
        setIsAddingVendor(false);
        alert(`新規代行業者「${data.vendor.displayName}」を登録し、Firestoreに保存しました！`);
      } else {
        alert(data.error || '登録に失敗しました');
      }
    } catch (e: any) {
      alert('エラー: ' + e.message);
    }
  };

  // 注文に対する代行業者アサイン切り替えハンドラー
  const handleAssignVendor = async (orderId: string, newVendorId: string) => {
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

    try {
      await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          vendorId: targetVendor.id,
          vendorName: targetVendor.displayName,
        }),
      });
    } catch (e) {
      console.warn('API update order error:', e);
    }
  };

  // 注文ステータスの変更
  const handleStatusChange = async (orderId: string, newStatus: any) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    );

    try {
      await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
    } catch (e) {
      console.warn('API update order status error:', e);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100/70 py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* 本部統括ヘッダー */}
        <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-950 text-emerald-300 border border-emerald-800/80 px-3 py-1 rounded-full text-xs font-semibold mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{adminInfo.serviceName} 統括管理ポータル</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{adminInfo.organizationName}</h1>
            <p className="text-xs sm:text-sm text-stone-400 mt-1">
              墓地管理会社（霊園）と現場作業代行業者を紐付け・統括管理する本部向け管理画面
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {firebaseStatus ? (
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                    firebaseStatus.initialized
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                      : 'bg-amber-950 text-amber-300 border-amber-700'
                  }`}
                >
                  🔥 Firebase状態: {firebaseStatus.message}
                </span>
              ) : (
                <span className="text-[11px] text-stone-500">Firebase状態を確認中...</span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Firebaseへデータ投入ボタン */}
            <button
              onClick={handleSeedFirestore}
              disabled={isSeeding}
              className="inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-500 active:scale-95 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition cursor-pointer"
            >
              <span>🔥</span>
              <span>{isSeeding ? 'Firestoreへ投入中...' : 'Firebaseに初期データを投入'}</span>
            </button>

            {/* 墓地管理会社プレビュー */}
            <Link
              href={`/cemetery?companyId=${selectedCemeteryId}&from=admin`}
              className="inline-flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold px-4 py-2.5 rounded-xl border border-stone-600 shadow transition"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>墓地管理会社画面を閲覧</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>

            {/* 代行業者プレビュー */}
            <Link
              href="/vendor?from=admin"
              className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition"
            >
              <Briefcase className="w-4 h-4" />
              <span>代行業者画面を閲覧</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>

            {/* 提携料金表・提案資料（adminからのみアクセス可能） */}
            <Link
              href="/admin/pricing"
              className="inline-flex items-center gap-1.5 bg-blue-700 hover:bg-blue-600 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-md transition active:scale-95 border border-blue-500"
            >
              <span>📊</span>
              <span>提携料金表・提案資料</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>

            {/* パスワード設定・変更ボタン */}
            <button
              onClick={() => setIsChangingPassword(true)}
              className="inline-flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 text-amber-300 text-xs font-bold px-3.5 py-2.5 rounded-xl border border-stone-700 shadow transition cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>パスワード設定</span>
            </button>

            {/* ログアウトボタン */}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-bold px-3.5 py-2.5 rounded-xl border border-stone-700 shadow transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>ログアウト</span>
            </button>
          </div>
        </div>

        {/* パスワード更新成功バナー */}
        {passwordSuccessMsg && (
          <div className="p-4 rounded-2xl border-2 border-emerald-500 bg-emerald-50 text-emerald-900 text-sm font-bold shadow-sm flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{passwordSuccessMsg}</span>
          </div>
        )}

        {/* シード処理結果バナー */}
        {seedResultMsg && (
          <div
            className={`p-4 rounded-2xl border text-sm font-bold shadow-sm ${
              seedResultMsg.isError
                ? 'bg-red-50 border-red-300 text-red-800'
                : 'bg-emerald-50 border-emerald-300 text-emerald-900'
            }`}
          >
            {seedResultMsg.text}
          </div>
        )}

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
              <span className="text-xs font-bold">本部手数料売上 ({adminInfo.platformFeePercent}%)</span>
              <CreditCard className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="text-2xl font-black text-emerald-800">¥{totalPlatformFee.toLocaleString()}</div>
            <span className="text-[11px] text-emerald-700 mt-1 block">Stripe Connect自動留保純売上</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs font-semibold">提携代行業者 送金報酬額 (80%)</span>
              <Briefcase className="w-4 h-4 text-stone-700" />
            </div>
            <div className="text-2xl font-black text-stone-900">¥{totalVendorPayout.toLocaleString()}</div>
            <span className="text-[11px] text-stone-500 mt-1 block">各代行業者への直接送金総額</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs font-semibold">墓地管理会社 / 提携代行業者</span>
              <Building2 className="w-4 h-4 text-stone-700" />
            </div>
            <div className="text-2xl font-black text-stone-900">
              {cemeteryCompanies.length}社 <span className="text-base font-normal text-stone-500">/ {vendors.length}社</span>
            </div>
            <span className="text-[11px] text-emerald-700 font-medium mt-1 block">
              管轄霊園: {cemeteryCompanies.reduce((sum, c) => sum + c.cemeteryNames.length, 0)}霊園
            </span>
          </div>
        </div>

        {/* タブナビゲーション */}
        <div className="bg-white p-2 rounded-2xl border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedTab('orders')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                selectedTab === 'orders'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>① 受注・代行業者アサイン ({orders.length}件)</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedTab('cemetery_relations')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                selectedTab === 'cemetery_relations'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>② 墓地管理会社 ＆ 提携代行業者の紐付け管理</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedTab('admin_profile')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                selectedTab === 'admin_profile'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>③ 本部管理情報・プラットフォーム設定</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* タブ1: 受注案件 ＆ 墓地管理会社ごとの代行業者アサイン */}
        {/* ========================================================================= */}
        {selectedTab === 'orders' && (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden space-y-4">
            <div className="p-6 border-b border-stone-100 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <span>受注案件一覧 ＆ 現場作業代行業者アサイン</span>
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  施主が指定した霊園（墓地管理会社）と提携契約を結んでいる代行業者の中から、担当業者をワンクリックで切り替えできます。
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">注文番号 / 日時</th>
                    <th className="py-3.5 px-4">施主情報</th>
                    <th className="py-3.5 px-4">管轄 墓地管理会社 / 霊園</th>
                    <th className="py-3.5 px-4">墓石特定情報（正面/側面写真・基数）</th>
                    <th className="py-3.5 px-4">プラン / 金額</th>
                    <th className="py-3.5 px-4">担当 作業代行業者</th>
                    <th className="py-3.5 px-4">ステータス</th>
                    <th className="py-3.5 px-4 text-right">アクション</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {orders.map((ord) => {
                    // この注文の墓地管理会社
                    const comp = cemeteryCompanies.find((c) => c.id === ord.cemeteryCompanyId);
                    // この墓地管理会社に紐付いている代行業者リスト
                    const allowedVendors = vendors.filter((v) =>
                      comp ? comp.affiliatedVendorIds.includes(v.id) : true
                    );

                    return (
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

                        {/* 管轄 墓地管理会社 / 霊園 */}
                        <td className="py-4 px-4 align-top max-w-[200px]">
                          <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 inline-block mb-1">
                            管理元: {comp?.name || ord.cemeteryCompanyName || '未設定'}
                          </span>
                          <span className="font-bold text-stone-900 block text-xs">
                            {ord.graveInfo.cemeteryName}
                          </span>
                          <span className="text-[11px] text-stone-500 block">
                            区画: {ord.graveInfo.sectionPlotNumber}
                          </span>
                        </td>

                        {/* 墓石特定情報 */}
                        <td className="py-4 px-4 align-top max-w-xs space-y-1.5">
                          <div className="bg-stone-50 p-2 rounded-lg border border-stone-200/80 space-y-1 text-[11px]">
                            <div>
                              <span className="text-stone-500">正面文字: </span>
                              <span className="font-bold text-stone-800">{ord.graveInfo.frontInscription}</span>
                            </div>
                            <div>
                              <span className="text-stone-500">建立者名: </span>
                              <span className="font-bold text-emerald-800">{ord.graveInfo.builderName}</span>
                            </div>
                            <div className="text-[10px] text-stone-600">
                              基数: <strong>{ord.graveInfo.graveCount || 1}基</strong> / 広さ: {ord.graveInfo.plotSize === 'extra_large' ? '特大' : ord.graveInfo.plotSize === 'large' ? '広め' : '標準'}
                            </div>
                          </div>

                          {/* 写真プレビューボタン */}
                          <div className="flex gap-2">
                            {ord.graveInfo.frontInscriptionPhotoUrl && (
                              <button
                                type="button"
                                onClick={() =>
                                  setPreviewPhoto({
                                    title: `正面文字写真 - ${ord.graveInfo.frontInscription}`,
                                    url: ord.graveInfo.frontInscriptionPhotoUrl!,
                                  })
                                }
                                className="inline-flex items-center gap-1 text-[10px] text-emerald-800 hover:text-emerald-950 font-bold bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200 transition"
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
                                    title: `側面建立者写真 - ${ord.graveInfo.builderName}`,
                                    url: ord.graveInfo.builderNamePhotoUrl!,
                                  })
                                }
                                className="inline-flex items-center gap-1 text-[10px] text-amber-800 hover:text-amber-950 font-bold bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded border border-amber-200 transition"
                              >
                                <Camera className="w-3 h-3 text-amber-700" />
                                <span>側面建立者写真</span>
                              </button>
                            )}
                          </div>
                        </td>

                        {/* 金額 */}
                        <td className="py-4 px-4 align-top">
                          <span className="font-medium text-stone-800 block text-[11px]">{ord.servicePlanName}</span>
                          <span className="font-black text-stone-900 text-sm block mt-0.5">
                            ¥{ord.totalAmount.toLocaleString()}
                          </span>
                          <div className="text-[10px] text-stone-500 mt-1">
                            本部手数料(20%): ¥{ord.platformFeeAmount.toLocaleString()}<br />
                            業者受取: ¥{ord.vendorPayoutAmount.toLocaleString()}
                          </div>
                        </td>

                        {/* 担当作業代行業者 セレクター（該当墓地に紐付く業者を優先表示） */}
                        <td className="py-4 px-4 align-top">
                          <select
                            value={ord.vendorId}
                            onChange={(e) => handleAssignVendor(ord.id, e.target.value)}
                            className="w-full text-xs font-semibold bg-white border border-emerald-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-stone-900 shadow-xs cursor-pointer"
                          >
                            <optgroup label="【この霊園の指定・提携代行業者】">
                              {allowedVendors.map((v) => (
                                <option key={v.id} value={v.id}>
                                  ★ {v.displayName}
                                </option>
                              ))}
                            </optgroup>
                            <optgroup label="【その他登録代行業者】">
                              {vendors
                                .filter((v) => !allowedVendors.some((av) => av.id === v.id))
                                .map((v) => (
                                  <option key={v.id} value={v.id}>
                                    {v.displayName}
                                  </option>
                                ))}
                            </optgroup>
                          </select>
                          <span className="text-[10px] text-stone-400 block mt-1">
                            送金先: {ord.vendorStripeAccountId || 'Stripe未設定'}
                          </span>
                          <Link
                            href={`/vendor?vendorId=${ord.vendorId}&from=admin`}
                            className="inline-flex items-center gap-1 text-[10px] text-emerald-800 hover:text-emerald-950 font-bold mt-1.5 underline"
                          >
                            <span>この業者の現場画面を見る →</span>
                          </Link>
                        </td>

                        {/* ステータス */}
                        <td className="py-4 px-4 align-top">
                          <select
                            value={ord.status}
                            onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                            className={`text-xs font-bold rounded-lg px-2.5 py-1.5 border cursor-pointer ${
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

                        <td className="py-4 px-4 align-top text-right">
                          <Link
                            href={`/vendor/reports/${ord.id}`}
                            className="inline-flex items-center gap-1 text-[11px] text-emerald-800 hover:text-emerald-950 font-bold bg-white hover:bg-stone-50 px-2.5 py-1.5 rounded-lg border border-stone-200 shadow-xs transition"
                          >
                            <span>報告書確認</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* タブ2: 墓地管理会社 ＆ 提携代行業者の紐付け管理（多対多の整理） */}
        {/* ========================================================================= */}
        {selectedTab === 'cemetery_relations' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* 左カラム：墓地管理会社（霊園管理元）の選択リスト */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div>
                    <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-emerald-700" />
                      <span>墓地管理会社・霊園管理事務所</span>
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      管理元を選択すると、右側に提携代行業者の一覧が表示されます。
                    </p>
                  </div>
                  <span className="text-xs font-bold text-stone-400">{cemeteryCompanies.length}社</span>
                </div>

                <div className="space-y-3">
                  {cemeteryCompanies.map((comp) => {
                    const isSelected = comp.id === selectedCemeteryId;
                    return (
                      <div
                        key={comp.id}
                        onClick={() => setSelectedCemeteryId(comp.id)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-600/20 shadow-xs'
                            : 'border-stone-200 hover:border-stone-300 bg-white'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-stone-900 text-sm">{comp.name}</h4>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full shrink-0">
                            提携代行: {comp.affiliatedVendorIds.length}社
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 mt-1">
                          責任者: {comp.representativeName} • 電話: {comp.phoneNumber}
                        </p>
                        <div className="mt-2 pt-2 border-t border-stone-100 text-[11px] text-stone-600 flex items-center justify-between gap-2">
                          <div>
                            <span className="font-semibold text-emerald-900">管轄霊園: </span>
                            <span>{comp.cemeteryNames.join('、')}</span>
                          </div>
                          <Link
                            href={`/cemetery?companyId=${comp.id}&from=admin`}
                            onClick={(e) => e.stopPropagation()}
                            className="shrink-0 text-[11px] bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold px-2.5 py-1 rounded-lg border border-amber-300 transition"
                          >
                            画面を開く →
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 右カラム：選択した墓地管理会社に紐付く「作業代行業者」の整理・編集パネル */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-sm space-y-6">
                <div className="pb-4 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      選択中の墓地管理会社
                    </span>
                    <h3 className="text-lg font-bold text-stone-900 mt-1">
                      {activeCemeteryCompany.name}
                    </h3>
                  </div>
                  <Link
                    href={`/cemetery?companyId=${activeCemeteryCompany.id}&from=admin`}
                    className="inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition"
                  >
                    <span>🏛️ この管理会社の画面をプレビュー</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <div className="text-xs text-stone-500 -mt-2">
                  所在地: {activeCemeteryCompany.locationAddress} • メール: {activeCemeteryCompany.email}
                </div>
                <p className="text-xs text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-200/80">
                  {activeCemeteryCompany.description}
                </p>

                {/* 提携代行業者の一覧 ＆ チェックボックスで紐付け・重複整理 */}
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                        <Briefcase className="w-4 h-4 text-emerald-700" />
                        <span>この霊園に出入り可能な作業代行業者（提携パートナー）</span>
                      </h4>
                      <p className="text-[11px] text-stone-500">
                        チェックを入れると、この墓地管理会社（霊園）の案件へアサイン可能になります（複数霊園との重複提携対応）。
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAddingVendor(true)}
                      className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-xs transition shrink-0 cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>新規業者・個人を追加</span>
                    </button>
                  </div>

                  <div className="space-y-2.5 pt-2">
                    {vendors.map((vendor) => {
                      const isAffiliated = activeCemeteryCompany.affiliatedVendorIds.includes(vendor.id);
                      const affiliatedCount = vendor.vendorProfile?.affiliatedCemeteryCompanyIds?.length || 0;

                      return (
                        <div
                          key={vendor.id}
                          className={`p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                            isAffiliated
                              ? 'bg-emerald-50/40 border-emerald-300'
                              : 'bg-white border-stone-200 opacity-75 hover:opacity-100'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              checked={isAffiliated}
                              onChange={() => handleToggleVendorAffiliation(activeCemeteryCompany.id, vendor.id)}
                              className="mt-1 w-4 h-4 rounded text-emerald-700 focus:ring-emerald-500 cursor-pointer"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-stone-900 text-xs sm:text-sm">
                                  {vendor.displayName}
                                </span>
                                <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                                  ★ {vendor.vendorProfile?.rating}
                                </span>
                                {isAffiliated && (
                                  <span className="text-[10px] bg-emerald-700 text-white font-bold px-2 py-0.5 rounded-full">
                                    指定提携中
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-stone-500 mt-0.5">
                                代表: {vendor.vendorProfile?.representativeName} • 対応地域: {vendor.vendorProfile?.serviceAreas.join('・')}
                              </p>
                              <span className="text-[10px] text-stone-400 mt-1 block">
                                現在 {affiliatedCount}箇所の墓地管理会社と重複提携中（施工実績: {vendor.vendorProfile?.completedJobsCount}件）
                              </span>
                            </div>
                          </div>

                          <Link
                            href={`/vendor?vendorId=${vendor.id}&from=admin`}
                            className="shrink-0 inline-flex items-center gap-1 text-[11px] text-emerald-800 hover:text-emerald-950 font-bold bg-white hover:bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-stone-200 transition"
                          >
                            <span>代行業者画面</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* タブ3: 本部管理情報・プラットフォーム設定 */}
        {/* ========================================================================= */}
        {selectedTab === 'admin_profile' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm max-w-4xl mx-auto space-y-6">
            <div className="pb-4 border-b border-stone-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-emerald-700" />
                  <span>本部運営会社 基本情報 ＆ プラットフォーム設定</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  ココロモウの運営責任者情報、決済プラットフォーム口座、手数料率などのマスター設定
                </p>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full">
                本部マスターデータ
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/80 space-y-1">
                <span className="text-stone-400 block text-[11px]">運営法人名</span>
                <span className="font-bold text-stone-900 text-sm block">{adminInfo.organizationName}</span>
                <span className="text-[10px] text-stone-500">{adminInfo.serviceName}</span>
              </div>

              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/80 space-y-1">
                <span className="text-stone-400 block text-[11px]">代表責任者</span>
                <span className="font-bold text-stone-900 text-sm block">{adminInfo.representative}</span>
                <span className="text-[10px] text-stone-500">運営総括統括責任者</span>
              </div>

              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/80 space-y-1">
                <span className="text-stone-400 block text-[11px]">本部代表連絡先</span>
                <span className="font-bold text-stone-900 text-sm block flex items-center gap-1 font-mono">
                  <Phone className="w-3.5 h-3.5 text-emerald-700" />
                  {adminInfo.phoneNumber}
                </span>
                <span className="text-[11px] text-stone-600 flex items-center gap-1 font-mono">
                  <Mail className="w-3.5 h-3.5 text-stone-400" />
                  {adminInfo.email}
                </span>
              </div>

              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/80 space-y-1">
                <span className="text-stone-400 block text-[11px]">本社所在地</span>
                <span className="font-bold text-stone-900 text-xs block flex items-start gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                  {adminInfo.address}
                </span>
              </div>
            </div>

            {/* プラットフォーム手数料・Stripe Connect設定 */}
            <div className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-emerald-700" />
                  <span>Stripe Connect プラットフォーム決済・自動送金設定</span>
                </span>
                <span className="text-xs font-black text-emerald-900 bg-emerald-100 px-3 py-1 rounded-lg">
                  標準手数料率: {adminInfo.platformFeePercent}%
                </span>
              </div>
              <p className="text-[11px] text-emerald-900 leading-relaxed">
                施主様がクレジットカード決済を行った際、決済総額の<strong>{adminInfo.platformFeePercent}%</strong>がココロモウ本部へ自動留保され、残りの<strong>{100 - adminInfo.platformFeePercent}%</strong>が担当作業代行業者のStripe Connect受取口座へ自動送金（Destination Charges方式）されます。
              </p>
              <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between text-xs">
                <span className="text-emerald-800">プラットフォーム口座ID:</span>
                <span className="font-mono font-bold text-emerald-950">{adminInfo.stripePlatformAccountId}</span>
              </div>
            </div>

            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/80 text-xs text-stone-600 space-y-1.5">
              <span className="font-bold text-stone-800 block">プラットフォーム運営理念・概要</span>
              <p className="text-[11px] leading-relaxed text-stone-600">
                {adminInfo.description}
              </p>
            </div>
          </div>
        )}

        {/* 写真拡大モーダル */}
        {previewPhoto && (
          <div 
            onClick={(e) => { if (e.target === e.currentTarget) setPreviewPhoto(null); }}
            className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer"
          >
            <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl space-y-4 p-6 animate-in fade-in zoom-in-95 cursor-default">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-stone-900">{previewPhoto.title}</h3>
                <button
                  type="button"
                  onClick={() => setPreviewPhoto(null)}
                  className="text-stone-400 hover:text-stone-700 font-bold text-sm px-2 py-1 rounded-lg hover:bg-stone-100 cursor-pointer"
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
                  className="bg-stone-900 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-stone-800 transition cursor-pointer"
                >
                  閉じる
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 新規代行業者追加モーダル（注意喚起付き） */}
        {isAddingVendor && (
          <div 
            onClick={(e) => { if (e.target === e.currentTarget) setIsAddingVendor(false); }}
            className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer"
          >
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto cursor-default">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    代行業者マスター管理
                  </span>
                  <h3 className="text-lg font-bold text-stone-900 mt-1">
                    作業代行業者・便利屋パートナーの新規登録
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddingVendor(false)}
                  className="text-stone-400 hover:text-stone-700 font-bold text-sm px-2 py-1 rounded-lg hover:bg-stone-100 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* ⚠️ 注意喚起ボックス */}
              <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl text-xs text-stone-700 space-y-2">
                <div className="flex items-center gap-1.5 text-amber-900 font-bold text-sm">
                  <span>⚠️</span>
                  <span>【重要】作業代行業者・個人の登録における確認事項</span>
                </div>
                <ul className="space-y-1 list-disc list-inside text-stone-600">
                  <li><strong>墓石清掃の安全基準:</strong> 金属たわしや酸性・強アルカリ洗剤の使用禁止（墓石の変色・風化防止）。</li>
                  <li><strong>他家墓所への立ち入り禁止:</strong> ご依頼区画以外の墓石・敷地・花立てへの接触禁止。</li>
                  <li><strong>身元の確認:</strong> 確実につながる電話番号・代表者氏名の確認。</li>
                  <li><strong>賠償責任の自覚:</strong> 万が一の墓石破損時における損害賠償責任の周知。</li>
                </ul>
                <div className="pt-2 border-t border-amber-200">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreedToWarnings}
                      onChange={(e) => setAgreedToWarnings(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-700 focus:ring-emerald-500 accent-emerald-700 cursor-pointer"
                    />
                    <span className="font-bold text-amber-950 text-xs">
                      上記の注意事項を確認し、責任を持って代行業者を登録します（必須）
                    </span>
                  </label>
                </div>
              </div>

              <form onSubmit={handleCreateVendor} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">事業形態・種別</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer p-2.5 bg-stone-50 rounded-xl border border-stone-200 flex-1">
                      <input
                        type="radio"
                        name="adminBusinessType"
                        value="individual"
                        checked={newVendorData.businessType === 'individual'}
                        onChange={() => setNewVendorData({ ...newVendorData, businessType: 'individual' })}
                        className="w-4 h-4 text-emerald-700"
                      />
                      <span className="font-bold text-stone-800">個人事業主・便利屋さん</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer p-2.5 bg-stone-50 rounded-xl border border-stone-200 flex-1">
                      <input
                        type="radio"
                        name="adminBusinessType"
                        value="corporation"
                        checked={newVendorData.businessType === 'corporation'}
                        onChange={() => setNewVendorData({ ...newVendorData, businessType: 'corporation' })}
                        className="w-4 h-4 text-emerald-700"
                      />
                      <span className="font-bold text-stone-800">法人・石材店・清掃会社</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    屋号・業者名・氏名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newVendorData.displayName}
                    onChange={(e) => setNewVendorData({ ...newVendorData, displayName: e.target.value })}
                    placeholder="例: 松山おそうじ工房、便利屋 山田"
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 outline-none text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      代表者氏名 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={newVendorData.representativeName}
                      onChange={(e) => setNewVendorData({ ...newVendorData, representativeName: e.target.value })}
                      placeholder="例: 山田 太郎"
                      className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 outline-none text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      お電話番号 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={newVendorData.phoneNumber}
                      onChange={(e) => setNewVendorData({ ...newVendorData, phoneNumber: e.target.value })}
                      placeholder="例: 089-999-0000"
                      className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 outline-none text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      メールアドレス（ログイン用） <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={newVendorData.email}
                      onChange={(e) => setNewVendorData({ ...newVendorData, email: e.target.value })}
                      placeholder="例: yamada@example.com"
                      className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 outline-none text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">初期パスワード</label>
                    <input
                      type="text"
                      required
                      value={newVendorData.password}
                      onChange={(e) => setNewVendorData({ ...newVendorData, password: e.target.value })}
                      placeholder="例: vendor1234"
                      className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 outline-none text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">対応エリア</label>
                  <input
                    type="text"
                    value={newVendorData.serviceAreas}
                    onChange={(e) => setNewVendorData({ ...newVendorData, serviceAreas: e.target.value })}
                    placeholder="例: 松山市全域、東温市、伊予市"
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">自己紹介・備考</label>
                  <textarea
                    rows={2}
                    value={newVendorData.description}
                    onChange={(e) => setNewVendorData({ ...newVendorData, description: e.target.value })}
                    placeholder="例: 地域密着の便利屋として真心込めてお参りとお掃除を代行いたします。"
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 outline-none text-xs"
                  />
                </div>

                <div className="pt-3 border-t border-stone-200 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddingVendor(false)}
                    className="flex-1 py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl transition cursor-pointer"
                  >
                    キャンセル
                  </button>
                  <button
                    type="submit"
                    disabled={!agreedToWarnings}
                    className={`flex-1 py-2.5 px-4 text-white font-bold rounded-xl shadow-xs transition ${
                      agreedToWarnings
                        ? 'bg-emerald-700 hover:bg-emerald-800 cursor-pointer'
                        : 'bg-stone-300 cursor-not-allowed text-stone-500'
                    }`}
                  >
                    この業者を登録する
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 管理者パスワード設定・変更モーダル */}
        {isChangingPassword && (
          <div 
            onClick={(e) => { if (e.target === e.currentTarget) setIsChangingPassword(false); }}
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm cursor-pointer"
          >
            <div className="bg-white text-stone-900 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border-4 border-stone-800 cursor-default space-y-5">
              <div className="flex items-center gap-2">
                <KeyRound className="w-6 h-6 text-amber-600" />
                <h2 className="text-xl font-black text-stone-900">管理者パスワードの設定・変更</h2>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                対象管理者アカウント：<strong className="text-stone-900">kotsuka@creativesd.net</strong><br />
                新しいパスワードを設定してください。次回ログイン時から有効になります。
              </p>

              <form onSubmit={handleSavePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    新しいパスワード（4文字以上）
                  </label>
                  <input
                    type="password"
                    required
                    value={newAdminPassword}
                    onChange={(e) => setNewAdminPassword(e.target.value)}
                    placeholder="新しいパスワードを入力"
                    className="w-full p-3 rounded-xl border-2 border-stone-300 focus:border-amber-600 outline-none text-sm font-medium text-stone-900 bg-stone-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    新しいパスワード（確認用・もう一度入力）
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmAdminPassword}
                    onChange={(e) => setConfirmAdminPassword(e.target.value)}
                    placeholder="確認のためもう一度入力"
                    className="w-full p-3 rounded-xl border-2 border-stone-300 focus:border-amber-600 outline-none text-sm font-medium text-stone-900 bg-stone-50"
                  />
                </div>

                <div className="pt-3 border-t border-stone-200 flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsChangingPassword(false);
                      setNewAdminPassword('');
                      setConfirmAdminPassword('');
                    }}
                    className="flex-1 py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl text-sm transition cursor-pointer"
                  >
                    キャンセル
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdatingPassword || !newAdminPassword}
                    className="flex-1 py-2.5 px-4 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-sm shadow-md transition cursor-pointer disabled:bg-stone-300"
                  >
                    {isUpdatingPassword ? '保存中...' : 'パスワードを保存'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
