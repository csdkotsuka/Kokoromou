'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  HeartHandshake, 
  MapPin, 
  Calendar, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  Layers, 
  Maximize2, 
  Camera, 
  FileText, 
  ChevronRight, 
  CheckCircle2, 
  User, 
  ShieldCheck, 
  Phone, 
  RotateCcw,
  ExternalLink,
  HelpCircle,
  Share2,
  LogOut
} from 'lucide-react';

export default function CustomerMyPage() {
  const router = useRouter();
  const [authUser, setAuthUser] = useState<{ name?: string; email?: string } | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Cookie から認証情報を確認
    const cookieMatch = document.cookie
      .split('; ')
      .find((row) => row.startsWith('kokoromou_auth='));

    if (cookieMatch) {
      try {
        const userData = JSON.parse(decodeURIComponent(cookieMatch.split('=').slice(1).join('=')));
        if (userData.role === 'customer' || userData.role === 'admin') {
          setAuthUser(userData);
        } else {
          // 別ロールのアカウントはマイページ不可
          router.push('/mypage/login');
          return;
        }
      } catch {
        router.push('/mypage/login');
        return;
      }
    } else {
      router.push('/mypage/login');
      return;
    }
    setAuthChecked(true);
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/mypage/login');
  };

  // 認証確認中はローディング表示
  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-stone-500 font-medium">認証確認中...</p>
        </div>
      </div>
    );
  }

  // 登録済みのお墓情報（複数基対応・特定写真あり）
  const registeredGrave = {
    cemeteryName: '宝塔寺 旭ヶ丘霊園',
    sectionPlotNumber: '東区 5列 12番',
    locationAddress: '愛媛県松山市朝日ヶ丘1丁目',
    frontInscription: '山田家先祖代々之墓',
    builderName: '昭和五十年八月 山田太郎建之',
    frontPhoto: '/images/grave_front_example.jpg',
    builderPhoto: '/images/grave_side_builder_example.jpg',
    graveCount: 1,
    plotSize: 'standard', // 標準(~1坪)
    landmarks: '東区入口の階段を上がってすぐ右、大楠の木の隣。隣接墓地は「加藤家」です。',
  };

  // 進行中の依頼ステータス（最新注文）
  const currentOrder = {
    orderNumber: 'KKM-20260921-001',
    planName: '通常プラン（水洗い・墓石点検・シキミ）',
    price: 14800,
    vendorName: '松山まごころ墓苑サポート（ダミー提携パートナー）',
    scheduledDate: '2026年9月25日（予定）',
    currentStep: 2, // 1: 決済完了, 2: 業者手配・日程確定, 3: 現地清掃・お参り中, 4: 写真レポート納品
    steps: [
      { id: 1, label: '決済完了', desc: '受付完了' },
      { id: 2, label: '日程確定', desc: '天候・作業調整中' },
      { id: 3, label: '現地清掃・お参り', desc: '職人が現地出向' },
      { id: 4, label: '写真レポート納品', desc: 'Before/After公開' },
    ],
  };

  // 過去の作業完了履歴
  const pastReports = [
    {
      id: 'order_sample_001',
      date: '2026年3月20日（春のお彼岸）',
      planName: '通常プラン（水洗い・墓石点検・シキミ）',
      vendor: '松山まごころ墓苑サポート',
      reportUrl: '/vendor/reports/order_sample_001',
      beforeImg: '/images/grave_before.jpg',
      afterImg: '/images/grave_after.jpg',
      artisanNote: '春のお彼岸に合わせ、墓石全体を水洗いし、新鮮なシキミ一対とお線香をお供えして合掌礼拝いたしました。目地のひび割れ等の異常はなく健全な状態です。',
    },
  ];

  const [copied, setCopied] = useState(false);
  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-stone-50/70 py-10 sm:py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* ヘッダー・施主歓迎バナー */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-800 text-white flex items-center justify-center text-xl font-bold shadow-md shrink-0">
              <User className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900">{authUser?.name ?? '施主様'} 様</h1>
                <span className="text-[11px] bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-0.5 rounded-full">
                  施主会員
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                {authUser?.email} • 2026年9月登録
              </p>
            </div>
          </div>

          {/* 次回ワンクリック再予約ボタン */}
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-2.5">
            <Link
              href={`/order?planId=plan_standard_service`}
              className="inline-flex items-center justify-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-6 py-3 rounded-xl shadow-md transition-all text-sm group"
            >
              <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
              <span>次回のお参り・清掃を予約する</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold px-4 py-3 rounded-xl transition-all text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>ログアウト</span>
            </button>
          </div>
        </div>

        {/* 進行中のご依頼（現在のステータス進行状況） */}
        {currentOrder && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-100">
              <div>
                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full uppercase tracking-wider border border-amber-200">
                  現在進行中のご依頼
                </span>
                <h2 className="text-lg font-bold text-stone-900 mt-2 flex items-center gap-2">
                  <span>{currentOrder.planName}</span>
                  <span className="text-sm font-normal text-stone-500">（注文番号: {currentOrder.orderNumber}）</span>
                </h2>
              </div>
              <div className="text-right">
                <span className="text-xs text-stone-500 block">予定日</span>
                <span className="text-sm font-bold text-emerald-800">{currentOrder.scheduledDate}</span>
              </div>
            </div>

            {/* 進行ステップバー */}
            <div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {currentOrder.steps.map((st) => {
                  const isDone = st.id < currentOrder.currentStep;
                  const isCurrent = st.id === currentOrder.currentStep;
                  return (
                    <div
                      key={st.id}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        isCurrent
                          ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-600/20 shadow-xs'
                          : isDone
                          ? 'bg-stone-50 border-stone-200 text-stone-700'
                          : 'bg-white border-stone-100 text-stone-400 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span
                          className={`w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center ${
                            isCurrent
                              ? 'bg-emerald-700 text-white'
                              : isDone
                              ? 'bg-emerald-600 text-white'
                              : 'bg-stone-200 text-stone-600'
                          }`}
                        >
                          {isDone ? '✓' : st.id}
                        </span>
                        <span className={`text-xs font-bold ${isCurrent ? 'text-emerald-950' : 'text-stone-800'}`}>
                          {st.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500">{st.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between text-xs text-stone-600 bg-stone-50 p-4 rounded-xl">
              <div>
                <span>担当提携先: </span>
                <strong className="text-stone-900">{currentOrder.vendorName}</strong>
              </div>
              <div className="text-stone-500">
                作業が完了次第、高解像度のBefore/After写真レポートがメールおよび本画面に通知されます。
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* 左カラム：ご登録中のお墓情報 */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-700" />
                  <span>ご登録済みのお墓情報</span>
                </h2>
                <span className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 font-semibold px-2 py-0.5 rounded-md">
                  次回自動引き継ぎ
                </span>
              </div>

              {/* 正面写真 & 側面建立者名写真 */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-stone-700 block flex items-center gap-1">
                    <Camera className="w-3.5 h-3.5 text-emerald-700" />
                    <span>正面写真（家名）</span>
                  </span>
                  <div className="relative rounded-xl overflow-hidden border border-stone-200 shadow-inner">
                    <img
                      src={registeredGrave.frontPhoto}
                      alt="正面文字写真"
                      className="w-full h-36 object-cover"
                    />
                    <div className="absolute bottom-1 left-2 bg-stone-900/80 text-white text-[10px] px-2 py-0.5 rounded">
                      {registeredGrave.frontInscription}
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-stone-700 block flex items-center gap-1">
                    <Camera className="w-3.5 h-3.5 text-emerald-700" />
                    <span>側面写真（建立者名・必須）</span>
                  </span>
                  <div className="relative rounded-xl overflow-hidden border border-stone-200 shadow-inner">
                    <img
                      src={registeredGrave.builderPhoto}
                      alt="側面建立者名写真"
                      className="w-full h-36 object-cover"
                    />
                    <div className="absolute bottom-1 left-2 bg-stone-900/80 text-white text-[10px] px-2 py-0.5 rounded truncate max-w-[90%]">
                      {registeredGrave.builderName}
                    </div>
                  </div>
                </div>
              </div>

              {/* 詳細スペックリスト */}
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-2 border-b border-stone-100">
                  <span className="text-stone-500">霊園・寺院名</span>
                  <span className="font-bold text-stone-900">{registeredGrave.cemeteryName}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-stone-100">
                  <span className="text-stone-500">区画番号・墓石番号</span>
                  <span className="font-semibold text-stone-900">{registeredGrave.sectionPlotNumber}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-stone-100">
                  <span className="text-stone-500">正面刻印文字</span>
                  <span className="font-bold text-emerald-900">{registeredGrave.frontInscription}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-stone-100">
                  <span className="text-stone-500">側面の建立者名（必須）</span>
                  <span className="font-bold text-stone-900">{registeredGrave.builderName}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-stone-100">
                  <span className="text-stone-500">区画内のお墓の基数</span>
                  <span className="font-semibold text-stone-800">{registeredGrave.graveCount}基（標準）</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-stone-500">敷地（区画）の広さ</span>
                  <span className="font-semibold text-stone-800">標準区画（〜約1坪）</span>
                </div>
              </div>

              <div className="bg-stone-50 p-3.5 rounded-xl text-xs text-stone-600 space-y-1">
                <span className="font-bold text-stone-800 block">📍 周辺目印・アクセス補足:</span>
                <p className="text-[11px] leading-relaxed text-stone-600">{registeredGrave.landmarks}</p>
              </div>
            </div>
          </div>

          {/* 右カラム：過去の施工完了レポート（アルバム） */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-700" />
                  <span>作業完了レポート履歴（アルバム）</span>
                </h2>
                <span className="text-xs text-stone-500">{pastReports.length}件の記録</span>
              </div>

              <div className="space-y-4">
                {pastReports.map((rep) => (
                  <div key={rep.id} className="p-4 rounded-2xl border border-stone-200 hover:border-emerald-300 transition-all space-y-3 bg-stone-50/50">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-bold text-stone-900 block">{rep.date}</span>
                        <span className="text-[11px] text-emerald-800 font-medium">{rep.planName}</span>
                      </div>
                      <span className="text-[10px] text-stone-400 bg-white px-2 py-0.5 rounded border border-stone-200">
                        施工: {rep.vendor}
                      </span>
                    </div>

                    {/* Before / After ミニ写真プレビュー */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="relative rounded-lg overflow-hidden border border-stone-200">
                        <img src={rep.beforeImg} alt="Before" className="w-full h-24 object-cover" />
                        <span className="absolute top-1 left-1 bg-stone-900/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                          Before
                        </span>
                      </div>
                      <div className="relative rounded-lg overflow-hidden border border-emerald-400">
                        <img src={rep.afterImg} alt="After" className="w-full h-24 object-cover" />
                        <span className="absolute top-1 left-1 bg-emerald-800 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                          After
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-stone-600 leading-relaxed bg-white p-2.5 rounded-lg border border-stone-100">
                      💡 職人報告: {rep.artisanNote}
                    </p>

                    <div className="pt-2 flex justify-end gap-2">
                      <Link
                        href={rep.reportUrl}
                        className="inline-flex items-center gap-1.5 text-xs text-emerald-800 hover:text-emerald-950 font-bold bg-white hover:bg-emerald-50 px-3 py-1.5 rounded-lg border border-stone-200 transition"
                      >
                        <span>高解像度レポート全文を見る</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* ご家族・親戚への共有 */}
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
                <div className="flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>離れて暮らすご家族や親戚へ写真報告を共有できます</span>
                </div>
                <button
                  type="button"
                  onClick={handleShare}
                  className="bg-white hover:bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-lg border border-emerald-300 transition shrink-0"
                >
                  {copied ? 'コピー完了！' : 'URLを共有'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* フッターナビゲーション */}
        <div className="text-center pt-6">
          <Link
            href="/"
            className="text-xs text-stone-500 hover:text-stone-800 underline font-medium"
          >
            ← ココロモウ トップページへ戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
