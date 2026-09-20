'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SAMPLE_SERVICE_PLANS, SAMPLE_VENDORS } from '@/mocks/sample-data';
import { 
  ShieldCheck, 
  CreditCard, 
  Loader2, 
  CheckCircle, 
  Info, 
  Sparkles, 
  MapPin, 
  Layers, 
  Maximize2, 
  AlertTriangle,
  ExternalLink,
  HelpCircle
} from 'lucide-react';

function OrderFormContent() {
  const searchParams = useSearchParams();
  const defaultPlanId = searchParams.get('planId') || SAMPLE_SERVICE_PLANS[1].id;

  const [selectedPlanId, setSelectedPlanId] = useState<string>(defaultPlanId);
  const [selectedVendorId, setSelectedVendorId] = useState<string>(SAMPLE_VENDORS[0].id);

  // オプションステート
  const [graveCount, setGraveCount] = useState<number>(1);
  const [plotSize, setPlotSize] = useState<'standard' | 'large' | 'extra_large'>('standard');

  // フォームステート
  const [formData, setFormData] = useState({
    clientName: '山田 太郎',
    clientEmail: 'client@example.com',
    cemeteryName: '宝塔寺 旭ヶ丘霊園（モデル霊園）',
    locationAddress: '愛媛県松山市朝日ヶ丘1丁目',
    sectionPlotNumber: '東区 5列 12番',
    frontInscription: '山田家先祖代々之墓',
    builderName: '昭和五十年八月 山田太郎建之',
    googleMapsUrl: 'https://maps.app.goo.gl/sample123',
    landmarksDescription: '東区入口の階段を上がってすぐ右、大楠の木の隣。隣接墓地は「加藤家」です。',
    specialRequests: '花立ての水垢と墓石周辺の雑草が目立ってきたため、丁寧に水洗いして綺麗にしていただけますと幸いです。',
    preferredDate: '2026-09-25',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedPlan = SAMPLE_SERVICE_PLANS.find((p) => p.id === selectedPlanId) || SAMPLE_SERVICE_PLANS[0];
  const selectedVendor = SAMPLE_VENDORS.find((v) => v.id === selectedVendorId) || SAMPLE_VENDORS[0];

  // オプション料金の計算
  const basePlanFee = selectedPlan.price;
  const extraGraveFee = (graveCount - 1) * 3000;
  const extraPlotFee = plotSize === 'large' ? 3000 : plotSize === 'extra_large' ? 6000 : 0;
  const totalAmount = basePlanFee + extraGraveFee + extraPlotFee;

  // Destination Charges の手数料計算プレビュー (20%)
  const platformFee = Math.round(totalAmount * (selectedPlan.platformFeePercent / 100));
  const vendorPayout = totalAmount - platformFee;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    // クライアント側バリデーション
    if (!formData.frontInscription.trim()) {
      setErrorMessage('「正面の刻印文字」を入力してください。');
      setIsLoading(false);
      return;
    }
    if (!formData.builderName.trim()) {
      setErrorMessage('同姓のお墓との誤認を防ぐため、「側面の建立者名」の入力は必須です。');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: selectedPlanId,
          vendorId: selectedVendorId,
          graveCount,
          plotSize,
          ...formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '決済セッションの初期化に失敗しました。');
      }

      if (data.url) {
        // Stripe Checkout URL または モックシミュレーションURLへ遷移
        window.location.href = data.url;
      } else {
        throw new Error('決済ページのURLを取得できませんでした。');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'エラーが発生しました。再度お試しください。');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* ページ見出し */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>現場の職人が真心を込めて代行いたします</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">お墓参り・お掃除代行のお申し込み</h1>
        <p className="mt-2 text-sm text-stone-600">
          プラン・区画オプションとお墓の情報を入力し、Stripeの安全な決済システムにてお支払いへお進みください。
        </p>
      </div>

      {searchParams.get('canceled') && (
        <div className="mb-8 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm flex items-center gap-3">
          <Info className="w-5 h-5 text-amber-600 shrink-0" />
          <span>決済がキャンセルされました。内容をご確認の上、再度お申し込みいただけます。</span>
        </div>
      )}

      {errorMessage && (
        <div className="mb-8 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 左カラム：設定・フォーム入力 */}
        <div className="lg:col-span-7 space-y-8">
          {/* 1. プラン選択 */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
            <h2 className="text-base font-bold text-stone-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs flex items-center justify-center font-bold">1</span>
              <span>サービスプランの選択</span>
            </h2>
            <div className="space-y-3">
              {SAMPLE_SERVICE_PLANS.map((plan) => {
                const isSelected = plan.id === selectedPlanId;
                return (
                  <label
                    key={plan.id}
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={`flex items-start justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600/20'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="plan"
                        checked={isSelected}
                        onChange={() => setSelectedPlanId(plan.id)}
                        className="mt-1 text-emerald-600 focus:ring-emerald-500"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-900 text-sm">{plan.name}</span>
                          {plan.isPopular && (
                            <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">
                              一番人気
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-500 mt-1">{plan.description}</p>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {plan.features.map((feat, idx) => (
                            <span key={idx} className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded">
                              ✓ {feat}
                            </span>
                          ))}
                        </div>
                        <p className="text-[11px] text-stone-400 mt-1.5">作業目安: {plan.estimatedDuration}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <span className="text-base font-extrabold text-stone-900">¥{plan.price.toLocaleString()}</span>
                      <span className="text-[10px] text-stone-500 block">税込</span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 2. 基数・区画オプション */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs flex items-center justify-center font-bold">2</span>
              <span>区画内のお墓の基数・広さオプション</span>
            </h2>
            <p className="text-xs text-stone-500">
              同一区画内に複数のお墓がある場合や、広い敷地での清掃・除草作業に応じた適正料金をお選びいただけます。
            </p>

            {/* お墓の基数 */}
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/80">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-emerald-700" />
                  <span>区画内のお墓の基数</span>
                </label>
                <span className="text-xs text-emerald-700 font-semibold">
                  {graveCount === 1 ? '基本料金内 (追加なし)' : `+¥${((graveCount - 1) * 3000).toLocaleString()} (税込)`}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 mb-3">
                先祖代々墓のほかに、個人墓・五輪塔・墓誌等がある場合は該当の基数をご選択ください（1基追加ごとに +¥3,000）。
              </p>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { count: 1, label: '1基（標準）', extra: '+¥0' },
                  { count: 2, label: '2基', extra: '+¥3,000' },
                  { count: 3, label: '3基', extra: '+¥6,000' },
                  { count: 4, label: '4基以上', extra: '+¥9,000' },
                ].map((item) => (
                  <button
                    type="button"
                    key={item.count}
                    onClick={() => setGraveCount(item.count)}
                    className={`py-2 px-2 text-center rounded-lg border text-xs font-semibold transition-all ${
                      graveCount === item.count
                        ? 'border-emerald-600 bg-emerald-600 text-white shadow-sm'
                        : 'border-stone-300 bg-white text-stone-700 hover:border-stone-400'
                    }`}
                  >
                    <div className="font-bold">{item.label}</div>
                    <div className={`text-[10px] mt-0.5 ${graveCount === item.count ? 'text-emerald-100' : 'text-stone-400'}`}>
                      {item.extra}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 区画の広さ */}
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/80">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <Maximize2 className="w-4 h-4 text-emerald-700" />
                  <span>区画（敷地）の広さの目安</span>
                </label>
                <span className="text-xs text-emerald-700 font-semibold">
                  {plotSize === 'standard' ? '基本料金内 (追加なし)' : plotSize === 'large' ? '+¥3,000 (税込)' : '+¥6,000 (税込)'}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 mb-3">
                草取りや手入れを行う敷地面積の広さに応じて選択してください。
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  {
                    id: 'standard',
                    label: '標準区画',
                    desc: '〜約1坪（畳2枚分程度まで）',
                    extra: '+¥0',
                  },
                  {
                    id: 'large',
                    label: '広め区画',
                    desc: '約1〜2坪（畳4枚分程度）',
                    extra: '+¥3,000',
                  },
                  {
                    id: 'extra_large',
                    label: '特大会区画',
                    desc: '2坪以上（畳4枚超・広い敷地）',
                    extra: '+¥6,000',
                  },
                ].map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setPlotSize(item.id as any)}
                    className={`p-3 text-left rounded-lg border text-xs transition-all ${
                      plotSize === item.id
                        ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-600/30 text-emerald-950 font-bold'
                        : 'border-stone-300 bg-white text-stone-700 hover:border-stone-400'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-xs">{item.label}</span>
                      <span className={`text-[10px] ${plotSize === item.id ? 'text-emerald-700 font-bold' : 'text-stone-400'}`}>
                        {item.extra}
                      </span>
                    </div>
                    <p className="text-[10px] text-stone-500 font-normal leading-tight">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3. 提携業者選択 */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
            <h2 className="text-base font-bold text-stone-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs flex items-center justify-center font-bold">3</span>
              <span>担当提携業者の選択</span>
            </h2>
            <div className="space-y-3">
              {SAMPLE_VENDORS.map((vendor) => {
                const isSelected = vendor.id === selectedVendorId;
                return (
                  <label
                    key={vendor.id}
                    onClick={() => setSelectedVendorId(vendor.id)}
                    className={`flex items-start justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600/20'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="vendor"
                        checked={isSelected}
                        onChange={() => setSelectedVendorId(vendor.id)}
                        className="mt-1 text-emerald-600 focus:ring-emerald-500"
                      />
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-stone-900 text-sm">{vendor.displayName}</span>
                          <span className="text-[10px] text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded font-medium">
                            Stripe Connect Verified
                          </span>
                          <span className="text-amber-600 font-bold text-xs">
                            ★ {vendor.vendorProfile?.rating}
                          </span>
                        </div>
                        {vendor.vendorProfile?.representativeName && (
                          <p className="text-[11px] text-emerald-800 font-medium mt-0.5">
                            担当: {vendor.vendorProfile.representativeName}
                          </p>
                        )}
                        <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                          {vendor.vendorProfile?.description}
                        </p>
                        <div className="flex flex-wrap items-center justify-between text-[11px] text-stone-500 mt-2 pt-2 border-t border-stone-100">
                          <span>対応: {vendor.vendorProfile?.serviceAreas.join('・')}</span>
                          <span className="font-semibold text-emerald-800">施工実績: {vendor.vendorProfile?.completedJobsCount}件</span>
                        </div>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 4. お墓情報・施主情報 */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs flex items-center justify-center font-bold">4</span>
              <span>お墓の特定情報・施主情報のご入力</span>
            </h2>

            {/* 同姓誤認防止に関する重要案内 */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">お墓の取り違えを防ぐための重要なお願い：</span>
                <p className="text-amber-800 mt-0.5 leading-relaxed text-[11px]">
                  地域の共同墓地や寺院墓地では、同姓（同じ家名）のお墓が多数密集しているケースが非常に多くございます。
                  現場でのお墓の確実な特定のため、<strong>「正面の文字」</strong>に加えて<strong>「側面の建立者名（誰が建てたか）」は必須</strong>とさせていただいております。
                </p>
              </div>
            </div>

            {/* 施主情報 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  お名前（施主様） <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  required
                  className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="例: 山田 太郎"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  メールアドレス（完了報告送信用） <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  name="clientEmail"
                  value={formData.clientEmail}
                  onChange={handleChange}
                  required
                  className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="例: yamada@example.com"
                />
              </div>
            </div>

            {/* 霊園・区画情報 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  霊園・寺院名 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="cemeteryName"
                  value={formData.cemeteryName}
                  onChange={handleChange}
                  required
                  className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="例: 宝塔寺 旭ヶ丘霊園"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  区画番号・墓石番号 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="sectionPlotNumber"
                  value={formData.sectionPlotNumber}
                  onChange={handleChange}
                  required
                  className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="例: 東区 5列 12番"
                />
              </div>
            </div>

            {/* お墓の特定情報（正面文字 & 側面の建立者名：必須） */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-emerald-50/40 rounded-xl border border-emerald-200/70">
              <div>
                <label className="block text-xs font-bold text-stone-900 mb-1">
                  正面の刻印文字（家名・題目等） <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="frontInscription"
                  value={formData.frontInscription}
                  onChange={handleChange}
                  required
                  className="w-full text-sm bg-white border border-emerald-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="例: 山田家之墓 / 南無阿弥陀仏"
                />
                <p className="text-[10px] text-stone-500 mt-1">墓石の正面に彫られている文字</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-900 mb-1">
                  側面の建立者名（建てた方） <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="builderName"
                  value={formData.builderName}
                  onChange={handleChange}
                  required
                  className="w-full text-sm bg-white border border-emerald-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="例: 昭和50年 山田太郎建之"
                />
                <p className="text-[10px] text-emerald-800 font-medium mt-1">※特定に必須（年月が不明な場合はお名前だけでも可）</p>
              </div>
            </div>

            {/* 住所 */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">霊園・墓地の所在地・住所</label>
              <input
                type="text"
                name="locationAddress"
                value={formData.locationAddress}
                onChange={handleChange}
                className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="例: 愛媛県松山市朝日ヶ丘1丁目"
              />
            </div>

            {/* Googleマップ位置情報（URL） */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
              <label className="text-xs font-bold text-stone-800 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-700" />
                  <span>Googleマップ位置情報（推奨）</span>
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                  現地到着がスムーズになります
                </span>
              </label>
              <input
                type="text"
                name="googleMapsUrl"
                value={formData.googleMapsUrl}
                onChange={handleChange}
                className="w-full text-sm bg-white border border-stone-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none mt-1"
                placeholder="例: https://maps.app.goo.gl/xxx または 33.8415, 132.7483"
              />
              <p className="text-[11px] text-stone-500 mt-1.5 leading-relaxed">
                💡 スマホのGoogleマップで墓地の位置を長押ししてピンを立て、「共有」→「リンクをコピー」して貼り付けていただくと、提携業者が現地ナビで直行できます。
              </p>
            </div>

            {/* 周辺の目印・特徴 */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                周辺の目印・隣のお墓の家名など
              </label>
              <input
                type="text"
                name="landmarksDescription"
                value={formData.landmarksDescription}
                onChange={handleChange}
                className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="例: 階段を上がってすぐ右、大楠の木のすぐ横、隣は「〇〇家」のお墓など"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">ご希望作業日</label>
                <input
                  type="date"
                  name="preferredDate"
                  value={formData.preferredDate}
                  onChange={handleChange}
                  className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">特記事項・ご要望</label>
                <input
                  type="text"
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleChange}
                  className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="例: 落ち葉を念入りに掃いてほしい等"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 右カラム：料金サマリー & Stripe決済ボタン */}
        <div className="lg:col-span-5">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm sticky top-24 space-y-6">
            <h2 className="text-base font-bold text-stone-900">お支払いサマリー</h2>

            <div className="space-y-3 text-xs text-stone-600 pb-4 border-b border-stone-100">
              <div className="flex justify-between">
                <span>選択プラン</span>
                <span className="font-semibold text-stone-900">{selectedPlan.name}</span>
              </div>
              <div className="flex justify-between">
                <span>担当提携業者</span>
                <span className="font-semibold text-stone-900">{selectedVendor.displayName}</span>
              </div>
              <div className="flex justify-between">
                <span>作業目安時間</span>
                <span className="font-semibold text-stone-900">{selectedPlan.estimatedDuration}</span>
              </div>
            </div>

            {/* 料金内訳 */}
            <div className="space-y-2 text-xs text-stone-600 pb-4 border-b border-stone-100">
              <div className="flex justify-between">
                <span>基本プラン料金</span>
                <span className="font-medium text-stone-800">¥{basePlanFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>お墓の基数 ({graveCount}基)</span>
                <span className="font-medium text-stone-800">
                  {extraGraveFee > 0 ? `+¥${extraGraveFee.toLocaleString()}` : '¥0'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>区画の広さ ({plotSize === 'extra_large' ? '特大2坪以上' : plotSize === 'large' ? '広め1〜2坪' : '標準'})</span>
                <span className="font-medium text-stone-800">
                  {extraPlotFee > 0 ? `+¥${extraPlotFee.toLocaleString()}` : '¥0'}
                </span>
              </div>
            </div>

            {/* 金額合計とDestination Chargesの透明性 */}
            <div className="space-y-3 pb-4 border-b border-stone-100">
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-semibold text-stone-800">お支払い総額（税込）</span>
                <span className="text-2xl font-extrabold text-emerald-700">
                  ¥{totalAmount.toLocaleString()}
                </span>
              </div>

              {/* Stripe Connect 構造の可視化 */}
              <div className="bg-stone-50 rounded-xl p-3 text-[11px] space-y-1.5 border border-stone-200/80">
                <div className="flex items-center gap-1.5 font-bold text-stone-700 mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Stripe Connect 自動送金内訳</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>提携業者受取分 (80%)</span>
                  <span>¥{vendorPayout.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>プラットフォーム運営手数料 (20%)</span>
                  <span>¥{platformFee.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* 決済ボタン */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-4 px-6 rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50 text-sm cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>決済画面へ接続中...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  <span>Stripeで安全に決済する</span>
                </>
              )}
            </button>

            <div className="text-[11px] text-stone-500 space-y-1.5 text-center">
              <div className="flex items-center justify-center gap-1 text-emerald-700 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>SSL暗号化通信 / PCI-DSS準拠</span>
              </div>
              <p>クレジットカード番号はプラットフォームには保存されず、Stripeにより安全に暗号化処理されます。</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function OrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-700" />
        </div>
      }
    >
      <OrderFormContent />
    </Suspense>
  );
}
