'use client';

import React, { useState, useEffect, use, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import QRCode from 'qrcode';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Mail,
  UserCheck,
  Camera,
  FileText,
  Sparkles,
  Printer,
  Edit3,
  ExternalLink,
  ShieldCheck,
  Save,
  AlertCircle,
  HelpCircle,
  ChevronRight,
} from 'lucide-react';
import {
  SAMPLE_CEMETERY_COMPANIES,
  SAMPLE_ORDERS,
  SAMPLE_REPORTS,
  ANNUAL_PLAN_OPTIONS,
} from '@/mocks/sample-data';
import { CemeteryClient, Order, Report, AnnualScheduleItem } from '@/types/firestore';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CemeteryClientDetailPage(props: PageProps) {
  return (
    <Suspense fallback={<div className="p-12 text-center text-stone-500 font-bold">施主カルテ読み込み中...</div>}>
      <ClientDetailInner {...props} />
    </Suspense>
  );
}

function ClientDetailInner({ params }: PageProps) {
  const resolvedParams = use(params);
  const clientId = resolvedParams.id;
  const searchParams = useSearchParams();
  const companyId = searchParams.get('companyId') || 'cem_comp_001';

  // 管理会社データ
  const cemeteryCompany = SAMPLE_CEMETERY_COMPANIES.find((c) => c.id === companyId) || SAMPLE_CEMETERY_COMPANIES[0];

  // 施主データ
  const [client, setClient] = useState<CemeteryClient | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reports, setReports] = useState<Report[]>([]);

  // 年間スケジュール編集用ステート
  const [schedules, setSchedules] = useState<AnnualScheduleItem[]>([]);
  const [isSavingSchedule, setIsSavingSchedule] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // お墓写真編集モーダル
  const [isEditingGrave, setIsEditingGrave] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    phoneNumber: '',
    address: '',
    sectionPlotNumber: '',
    frontInscription: '',
    builderName: '',
    photoUrl: '',
    builderPhotoUrl: '',
    notes: '',
  });

  // 専用DM印刷用QRコード
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  useEffect(() => {
    // 霊園管理会社の施主リストから検索（localStorageで更新されたものも考慮）
    let foundClient: CemeteryClient | undefined;

    try {
      const stored = localStorage.getItem(`kokoromou_clients_${companyId}`);
      if (stored) {
        const parsed: CemeteryClient[] = JSON.parse(stored);
        foundClient = parsed.find((c) => c.id === clientId);
      }
    } catch {}

    if (!foundClient) {
      foundClient = cemeteryCompany.clients?.find((c) => c.id === clientId);
    }

    // 他の霊園サンプルからもフォールバック検索
    if (!foundClient) {
      for (const comp of SAMPLE_CEMETERY_COMPANIES) {
        const c = comp.clients?.find((cl) => cl.id === clientId);
        if (c) {
          foundClient = c;
          break;
        }
      }
    }

    if (foundClient) {
      setClient(foundClient);
      setEditForm({
        name: foundClient.name,
        phoneNumber: foundClient.phoneNumber,
        address: foundClient.address || '',
        sectionPlotNumber: foundClient.sectionPlotNumber,
        frontInscription: foundClient.frontInscription,
        builderName: foundClient.builderName || '',
        photoUrl: foundClient.photoUrl || '',
        builderPhotoUrl: foundClient.builderPhotoUrl || '',
        notes: foundClient.notes || '',
      });

      // 関連する注文を検索
      const relatedOrders = SAMPLE_ORDERS.filter(
        (o) => o.clientId === foundClient!.id || o.clientName === foundClient!.name
      );
      setOrders(relatedOrders);

      // 主となる注文
      const primaryOrder = relatedOrders.find((o) => o.billingType === 'annual') || relatedOrders[0];

      if (primaryOrder?.annualSchedules && primaryOrder.annualSchedules.length > 0) {
        setSchedules(primaryOrder.annualSchedules);
      } else if (foundClient.subscriptionType === 'annual') {
        // デフォルトスケジュール生成
        const defaultScheds: AnnualScheduleItem[] = [
          {
            index: 1,
            periodLabel: '春彼岸（3月）',
            scheduledDate: '2026-03-20',
            status: 'completed',
            completedDate: '2026-03-20',
            reportId: 'rep_sample_annual_001',
            vendorNotes: '春彼岸の清掃・シキミお供え完了',
            clientNotes: 'お彼岸中日までに完了希望',
          },
          {
            index: 2,
            periodLabel: 'お盆（8月）',
            scheduledDate: foundClient.nextScheduledDate || '2026-08-12',
            status: 'scheduled',
            clientNotes: '8/13親族墓参のため前日までに',
          },
          {
            index: 3,
            periodLabel: '秋彼岸（9月）',
            scheduledDate: '2026-09-22',
            status: 'scheduled',
            clientNotes: '',
          },
        ];
        setSchedules(defaultScheds);
      }

      // レポート検索
      const relatedReports = SAMPLE_REPORTS.filter((r) =>
        relatedOrders.some((o) => o.id === r.orderId)
      );
      setReports(relatedReports);

      // 専用オンボーディングURLのQRコード生成
      const directOrderUrl = `https://kokoromou.inteve-cloud.com/order?cemeteryCompanyId=${companyId}&cemeteryName=${encodeURIComponent(
        cemeteryCompany.cemeteryNames[0] || cemeteryCompany.name
      )}&sectionPlotNumber=${encodeURIComponent(
        foundClient.sectionPlotNumber
      )}&frontInscription=${encodeURIComponent(
        foundClient.frontInscription
      )}&builderName=${encodeURIComponent(
        foundClient.builderName || ''
      )}&clientName=${encodeURIComponent(
        foundClient.name
      )}&prefilled=true`;

      QRCode.toDataURL(directOrderUrl, {
        width: 240,
        margin: 1,
        color: { dark: '#0f172a', light: '#ffffff' },
      }).then((url) => setQrCodeDataUrl(url));
    }
  }, [clientId, companyId, cemeteryCompany]);

  // スケジュール変更処理（日付・メモ）
  const handleScheduleChange = (index: number, field: keyof AnnualScheduleItem, value: any) => {
    setSchedules((prev) =>
      prev.map((item) => (item.index === index ? { ...item, [field]: value } : item))
    );
  };

  // スケジュール保存処理
  const handleSaveSchedules = () => {
    setIsSavingSchedule(true);
    setTimeout(() => {
      setIsSavingSchedule(false);
      setSaveSuccessMsg('年間定期管理スケジュール（指定日・メモ）を更新・保存しました。');
      setTimeout(() => setSaveSuccessMsg(null), 4000);
    }, 500);
  };

  // お墓写真・基本情報保存処理
  const handleSaveGraveInfo = () => {
    if (!client) return;
    const updatedClient: CemeteryClient = {
      ...client,
      name: editForm.name,
      phoneNumber: editForm.phoneNumber,
      address: editForm.address,
      sectionPlotNumber: editForm.sectionPlotNumber,
      frontInscription: editForm.frontInscription,
      builderName: editForm.builderName,
      photoUrl: editForm.photoUrl,
      builderPhotoUrl: editForm.builderPhotoUrl,
      notes: editForm.notes,
      updatedAt: new Date().toISOString(),
    };
    setClient(updatedClient);
    setIsEditingGrave(false);
    setSaveSuccessMsg('施主様基本情報および墓石特定写真を更新しました。');
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  if (!client) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-stone-900">施主データが見つかりません</h1>
        <p className="text-stone-500 mt-2">ID: {clientId} のデータが存在しないか、権限がありません。</p>
        <Link
          href={`/cemetery?companyId=${companyId}`}
          className="mt-6 inline-flex items-center gap-1.5 px-5 py-2.5 bg-emerald-800 text-white rounded-xl font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>管理会社ダッシュボードに戻る</span>
        </Link>
      </div>
    );
  }

  const primaryOrder = orders.find((o) => o.billingType === 'annual') || orders[0];
  const isAnnualPlan = client.subscriptionType === 'annual' || primaryOrder?.billingType === 'annual';

  return (
    <div className="min-h-screen bg-stone-100/90 text-stone-900 pb-24">
      {/* 画面上部ヘッダーバー */}
      <header className="bg-stone-900 text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href={`/cemetery?companyId=${companyId}`}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs sm:text-sm font-bold transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← 名簿一覧に戻る</span>
            </Link>
            <span className="text-stone-400 text-xs hidden sm:inline">|</span>
            <span className="text-xs text-stone-300 font-medium truncate max-w-[240px]">
              {cemeteryCompany.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/mypage?from=cemetery&clientId=${client.id}&clientName=${encodeURIComponent(client.name)}`}
              target="_blank"
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition shadow-xs"
            >
              <span>👤 施主マイページ代行確認 ↗</span>
            </Link>
          </div>
        </div>
      </header>

      {/* メインコンテナ */}
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* 通知トースト */}
        {saveSuccessMsg && (
          <div className="p-4 bg-emerald-100 border-2 border-emerald-500 text-emerald-950 font-bold rounded-2xl shadow-sm flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {/* 1. 施主カルテ・トップサマリーカード */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-xs font-bold bg-stone-100 text-stone-700 px-3 py-1 rounded-full border border-stone-200">
                顧客カルテ / 施主ID: {client.id}
              </span>
              {isAnnualPlan ? (
                <span className="text-xs font-black bg-amber-500 text-stone-950 px-3.5 py-1 rounded-full shadow-xs flex items-center gap-1">
                  <span>🔥</span> 年間定期管理契約中（年{client.annualFrequency || 3}回・一括決済完了）
                </span>
              ) : (
                <span className="text-xs font-bold bg-stone-200 text-stone-800 px-3 py-1 rounded-full">
                  1回スポット契約
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-3">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
                {client.name} <span className="text-xl sm:text-2xl font-bold text-stone-600">様</span>
              </h1>
              <span className="text-sm font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                区画: {client.sectionPlotNumber}
              </span>
            </div>

            <p className="text-stone-600 text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-stone-400 shrink-0" />
              <span>{client.address || '住所未登録'}</span>
            </p>
          </div>

          {/* 右側アクションボタングループ */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
            <button
              onClick={() => setIsEditingGrave(true)}
              className="px-4 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-950 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 border border-amber-300 cursor-pointer shadow-2xs"
            >
              <Edit3 className="w-4 h-4" />
              <span>お墓情報・写真を編集</span>
            </button>
            <a
              href={`mailto:${client.email || ''}?subject=${encodeURIComponent(`【${cemeteryCompany.name}より】お墓参り・清掃代行についてのご案内`)}`}
              className="px-4 py-2.5 bg-stone-800 hover:bg-stone-900 text-white rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              <Mail className="w-4 h-4" />
              <span>施主へメール送信（BCC起動）</span>
            </a>
          </div>
        </div>

        {/* 2. 墓石カルテ（正面 ＆ 側面建立者名・誤認防止の最重要特定情報） */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 space-y-6">
          <div className="flex items-center justify-between border-b border-stone-200 pb-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                お墓の特定カルテ（誤認防止の最重要項目）
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-stone-900 flex items-center gap-2">
                <span>🪦</span>
                <span>墓石写真 ＆ 刻印情報</span>
              </h2>
            </div>
            <button
              onClick={() => setIsEditingGrave(true)}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-950 underline"
            >
              写真を差し替える / 情報を変更
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 正面写真カード */}
            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 text-center space-y-3">
              <span className="text-xs font-extrabold text-stone-700 block">
                ① 正面の刻印文字写真
              </span>
              <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-stone-200 border border-stone-300">
                {client.photoUrl ? (
                  <img
                    src={client.photoUrl}
                    alt="正面写真"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-stone-400 text-xs font-bold">
                    未登録
                  </div>
                )}
                <span className="absolute bottom-2 left-2 bg-stone-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  正面
                </span>
              </div>
              <div className="text-left bg-white p-2.5 rounded-lg border border-stone-200">
                <span className="text-[10px] text-stone-400 font-bold block">正面文字（家名等）</span>
                <strong className="text-sm text-stone-900 font-bold block">
                  {client.frontInscription}
                </strong>
              </div>
            </div>

            {/* 側面・建立者名写真カード（同姓誤認防止） */}
            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 text-center space-y-3">
              <div className="flex items-center justify-center gap-1 text-xs font-extrabold text-stone-700">
                <span>② 側面の建立者名写真</span>
                <span className="text-[10px] bg-red-100 text-red-800 px-1.5 py-0.2 rounded font-bold">必須</span>
              </div>
              <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-stone-200 border border-stone-300">
                {client.builderPhotoUrl ? (
                  <img
                    src={client.builderPhotoUrl}
                    alt="側面建立者写真"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-stone-400 text-xs font-bold">
                    未登録
                  </div>
                )}
                <span className="absolute bottom-2 left-2 bg-stone-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  側面（建立者）
                </span>
              </div>
              <div className="text-left bg-white p-2.5 rounded-lg border border-stone-200">
                <span className="text-[10px] text-stone-400 font-bold block">側面の建立者名</span>
                <strong className="text-sm text-emerald-900 font-bold block">
                  {client.builderName || '未記入（要登録）'}
                </strong>
              </div>
            </div>

            {/* 区画 & 墓地案内メモ */}
            <div className="lg:col-span-2 bg-stone-50 rounded-2xl p-5 border border-stone-200 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-baseline border-b border-stone-200 pb-2">
                  <span className="text-xs text-stone-500 font-bold">霊園・墓地名</span>
                  <span className="text-sm font-extrabold text-stone-900">
                    {cemeteryCompany.cemeteryNames[0] || cemeteryCompany.name}
                  </span>
                </div>
                <div className="flex justify-between items-baseline border-b border-stone-200 pb-2">
                  <span className="text-xs text-stone-500 font-bold">区画番号</span>
                  <span className="text-base font-black text-blue-700">
                    {client.sectionPlotNumber}
                  </span>
                </div>
                <div className="flex justify-between items-baseline border-b border-stone-200 pb-2">
                  <span className="text-xs text-stone-500 font-bold">連絡先電話番号</span>
                  <span className="text-sm font-bold text-stone-800">
                    {client.phoneNumber}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-stone-500 font-bold block mb-1">周辺の目印・墓地カルテ特記メモ</span>
                  <p className="text-xs text-stone-700 bg-white p-3 rounded-xl border border-stone-200 leading-relaxed min-h-[60px]">
                    {client.notes || '目印の登録はありません。'}
                  </p>
                </div>
              </div>

              {/* 専用オンボーディング案内DMのQRコードプレビュー */}
              <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {qrCodeDataUrl && (
                    <img
                      src={qrCodeDataUrl}
                      alt="専用QRコード"
                      className="w-14 h-14 rounded-lg border border-stone-300 p-0.5 bg-white"
                    />
                  )}
                  <div>
                    <span className="text-xs font-bold text-stone-900 block">
                      施主専用オンボーディングQR
                    </span>
                    <span className="text-[11px] text-stone-500 block">
                      読み込むとお墓情報が入力済みの注文画面が開きます
                    </span>
                  </div>
                </div>
                <Link
                  href={`/flyer?clientId=${client.id}`}
                  className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg shadow-xs transition"
                >
                  案内チラシ印刷
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 3. 年間定期管理（複数回事前決済）＆ スケジュール管理・日付指定パネル */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border-2 border-emerald-300 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black bg-amber-500 text-stone-950 px-2.5 py-0.5 rounded-full">
                  事前決済済み・年間スケジュール
                </span>
                <span className="text-xs font-bold text-emerald-800">
                  {isAnnualPlan ? 'パターンB: 回数別ステップ割引適用' : 'スポット契約'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-stone-900 mt-1 flex items-center gap-2">
                <span>📅</span>
                <span>年間定期管理スケジュール ＆ 日付指定カルテ</span>
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSaveSchedules}
                disabled={isSavingSchedule}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSavingSchedule ? '保存中...' : '日付指定・メモを保存'}</span>
              </button>
            </div>
          </div>

          {/* 契約サマリー情報 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200">
            <div>
              <span className="text-[11px] text-emerald-900 font-bold block">契約プラン</span>
              <strong className="text-sm font-extrabold text-stone-900">
                {primaryOrder?.servicePlanName || '通常プラン（水洗い・墓石点検・シキミ）'}
              </strong>
            </div>
            <div>
              <span className="text-[11px] text-emerald-900 font-bold block">年間契約回数 / 割引率</span>
              <strong className="text-sm font-extrabold text-emerald-900">
                年{client.annualFrequency || 3}回定期（12%OFF適用済み）
              </strong>
            </div>
            <div>
              <span className="text-[11px] text-emerald-900 font-bold block">年間一括支払額（Stripe決済済）</span>
              <strong className="text-base font-black text-emerald-800">
                ¥{primaryOrder?.totalAmount?.toLocaleString() || '39,072'}{' '}
                <span className="text-xs font-medium text-stone-600">（税込）</span>
              </strong>
            </div>
          </div>

          {/* 回数ごとの実施スケジュールカードリスト */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-stone-800 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-700" />
              <span>実施回ごとの進捗・施主希望日・作業メモ（編集可能）</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {schedules.map((item) => {
                const isCompleted = item.status === 'completed';
                const isScheduled = item.status === 'scheduled';

                return (
                  <div
                    key={item.index}
                    className={`rounded-2xl p-5 border-2 transition space-y-4 ${
                      isCompleted
                        ? 'bg-emerald-50/60 border-emerald-400'
                        : 'bg-white border-stone-200 hover:border-emerald-300'
                    }`}
                  >
                    {/* カードヘッダー */}
                    <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-stone-900 text-white text-xs font-extrabold flex items-center justify-center">
                          {item.index}
                        </span>
                        <strong className="text-sm font-extrabold text-stone-900">
                          {item.periodLabel}
                        </strong>
                      </div>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          isCompleted
                            ? 'bg-emerald-200 text-emerald-900'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {isCompleted ? '✓ 実施完了' : '⏳ 実施予定'}
                      </span>
                    </div>

                    {/* 日付指定入力フォーム */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-700 block flex items-center justify-between">
                        <span>作業予定日（施主指定日）</span>
                        {isCompleted && (
                          <span className="text-[10px] text-emerald-800 font-bold">
                            完了日: {item.completedDate}
                          </span>
                        )}
                      </label>
                      <input
                        type="date"
                        value={item.scheduledDate || ''}
                        onChange={(e) =>
                          handleScheduleChange(item.index, 'scheduledDate', e.target.value)
                        }
                        className="w-full text-xs font-bold border border-stone-300 rounded-lg p-2 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    {/* 施主からの要望・指定メモ入力フォーム */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-700 block">
                        施主からの指定・要望メモ
                      </label>
                      <textarea
                        rows={2}
                        value={item.clientNotes || ''}
                        placeholder="例: 8/13親族墓参のため前日までに、白菊多めで等"
                        onChange={(e) =>
                          handleScheduleChange(item.index, 'clientNotes', e.target.value)
                        }
                        className="w-full text-xs border border-stone-300 rounded-lg p-2 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    {/* 完了レポートリンク */}
                    {isCompleted && item.reportId && (
                      <div className="pt-2 border-t border-emerald-200">
                        <Link
                          href={`#report_${item.reportId}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 underline"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>完了写真レポートを確認 ↓</span>
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 4. 過去の作業完了写真レポート（ビフォー・アフター） */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 space-y-6">
          <div className="flex items-center justify-between border-b border-stone-200 pb-4">
            <div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                作業履歴・提出写真
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-stone-900 mt-1 flex items-center gap-2">
                <span>📸</span>
                <span>完了写真レポート履歴（{reports.length}件）</span>
              </h2>
            </div>
          </div>

          {reports.length === 0 ? (
            <div className="text-center py-12 bg-stone-50 rounded-2xl border border-dashed border-stone-300 text-stone-500">
              まだ提出された作業完了レポートはありません。
            </div>
          ) : (
            <div className="space-y-6">
              {reports.map((report) => (
                <div
                  key={report.id}
                  id={`report_${report.id}`}
                  className="bg-stone-50 rounded-2xl p-6 border border-stone-200 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-700 text-white">
                        第1回 完了報告書
                      </span>
                      <strong className="text-sm font-bold text-stone-900">
                        作業実施日: {report.workDate}（{report.weather}）
                      </strong>
                    </div>
                    <span className="text-xs text-stone-500">
                      担当職人: {report.vendorName}
                    </span>
                  </div>

                  {/* ビフォー・アフター写真 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded-xl border border-stone-200 text-center space-y-2">
                      <span className="text-xs font-bold text-stone-700 block">
                        作業前（ビフォー）
                      </span>
                      <div className="aspect-4/3 rounded-lg overflow-hidden bg-stone-100 border border-stone-200">
                        <img
                          src={report.beforePhotos[0]?.url || '/images/grave_before.jpg'}
                          alt="作業前"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-[11px] text-stone-500 text-left">
                        {report.beforePhotos[0]?.caption}
                      </p>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-stone-200 text-center space-y-2">
                      <span className="text-xs font-bold text-emerald-800 block">
                        作業後（アフター・献花礼拝）
                      </span>
                      <div className="aspect-4/3 rounded-lg overflow-hidden bg-stone-100 border border-stone-200">
                        <img
                          src={report.afterPhotos[0]?.url || '/images/grave_after.jpg'}
                          alt="作業後"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-[11px] text-stone-500 text-left">
                        {report.afterPhotos[0]?.caption}
                      </p>
                    </div>
                  </div>

                  {/* 作業詳細コメント */}
                  <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-2 text-xs">
                    <strong className="font-bold text-stone-900 block">
                      【担当職人の作業報告】
                    </strong>
                    <p className="text-stone-700 whitespace-pre-wrap leading-relaxed">
                      {report.workNotes}
                    </p>
                    {report.graveConditionNotes && (
                      <div className="pt-2 border-t border-stone-100 mt-2">
                        <strong className="font-bold text-amber-800 block">
                          【お墓の健全性メモ（目地・傾きなど）】
                        </strong>
                        <p className="text-stone-600">{report.graveConditionNotes}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 施主・お墓情報 編集モーダル */}
      {isEditingGrave && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="text-lg font-bold text-stone-900">
                お墓特定写真 ＆ 施主情報の編集
              </h3>
              <button
                onClick={() => setIsEditingGrave(false)}
                className="text-stone-400 hover:text-stone-600 text-sm font-bold"
              >
                ✕ 閉じる
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">施主氏名</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg p-2.5"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">電話番号（ログインID）</label>
                  <input
                    type="text"
                    value={editForm.phoneNumber}
                    onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg p-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">ご住所</label>
                <input
                  type="text"
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg p-2.5"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">区画番号</label>
                  <input
                    type="text"
                    value={editForm.sectionPlotNumber}
                    onChange={(e) => setEditForm({ ...editForm, sectionPlotNumber: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg p-2.5"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">正面文字</label>
                  <input
                    type="text"
                    value={editForm.frontInscription}
                    onChange={(e) => setEditForm({ ...editForm, frontInscription: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg p-2.5"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    側面の建立者名（必須）
                  </label>
                  <input
                    type="text"
                    value={editForm.builderName}
                    onChange={(e) => setEditForm({ ...editForm, builderName: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg p-2.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    正面写真画像URL
                  </label>
                  <input
                    type="text"
                    value={editForm.photoUrl}
                    onChange={(e) => setEditForm({ ...editForm, photoUrl: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg p-2.5"
                    placeholder="/images/grave_front_example.jpg"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    側面（建立者名）写真画像URL
                  </label>
                  <input
                    type="text"
                    value={editForm.builderPhotoUrl}
                    onChange={(e) => setEditForm({ ...editForm, builderPhotoUrl: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg p-2.5"
                    placeholder="/images/grave_side_builder_example.jpg"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">周辺の目印・メモ</label>
                <textarea
                  rows={2}
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg p-2.5"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setIsEditingGrave(false)}
                className="px-4 py-2 border border-stone-300 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100"
              >
                キャンセル
              </button>
              <button
                type="button"
                onClick={handleSaveGraveInfo}
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                保存する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
