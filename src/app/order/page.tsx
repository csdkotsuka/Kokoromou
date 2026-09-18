'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SAMPLE_SERVICE_PLANS, SAMPLE_VENDORS } from '@/mocks/sample-data';
import { ShieldCheck, CreditCard, Loader2, CheckCircle, Info, Sparkles } from 'lucide-react';

function OrderFormContent() {
  const searchParams = useSearchParams();
  const defaultPlanId = searchParams.get('planId') || SAMPLE_SERVICE_PLANS[1].id;

  const [selectedPlanId, setSelectedPlanId] = useState<string>(defaultPlanId);
  const [selectedVendorId, setSelectedVendorId] = useState<string>(SAMPLE_VENDORS[0].id);

  // フォームステート
  const [formData, setFormData] = useState({
    clientName: '山田 太郎',
    clientEmail: 'client@example.com',
    cemeteryName: '宝塔寺 旭ヶ丘霊園（モデル霊園）',
    locationAddress: '愛媛県松山市朝日ヶ丘1丁目',
    sectionPlotNumber: '東区 5列 12番',
    deceasedName: '山田家先祖代々',
    specialRequests: '墓石側面の苔が気になるので、水洗いでしっかり落としていただけますと幸いです。',
    preferredDate: '2026-09-25',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedPlan = SAMPLE_SERVICE_PLANS.find((p) => p.id === selectedPlanId) || SAMPLE_SERVICE_PLANS[0];
  const selectedVendor = SAMPLE_VENDORS.find((v) => v.id === selectedVendorId) || SAMPLE_VENDORS[0];

  // Destination Charges の手数料計算プレビュー
  const totalAmount = selectedPlan.price;
  const platformFee = Math.round(totalAmount * (selectedPlan.platformFeePercent / 100));
  const vendorPayout = totalAmount - platformFee;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: selectedPlanId,
          vendorId: selectedVendorId,
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
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">お墓参り・お掃除代行のお申し込み</h1>
        <p className="mt-2 text-sm text-stone-600">
          プランとお墓の情報を入力し、Stripeの安全な決済システムにてお支払いへお進みください。
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
          <Info className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 左カラム：設定・フォーム入力 */}
        <div className="lg:col-span-7 space-y-8">
          {/* 1. プラン選択 */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
            <h2 className="text-base font-bold text-stone-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs flex items-center justify-center">1</span>
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
                              人気
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-500 mt-1">{plan.description}</p>
                        <p className="text-[11px] text-stone-400 mt-1">作業目安: {plan.estimatedDuration}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-base font-extrabold text-stone-900">¥{plan.price.toLocaleString()}</span>
                      <span className="text-[10px] text-stone-500 block">税込</span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 2. 提携業者選択 */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
            <h2 className="text-base font-bold text-stone-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs flex items-center justify-center">2</span>
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

          {/* 3. お墓情報・施主情報 */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs flex items-center justify-center">3</span>
              <span>お墓・施主情報のご入力</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  メールアドレス（レポート送信用） <span className="text-rose-500">*</span>
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

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">霊園の所在地・住所</label>
              <input
                type="text"
                name="locationAddress"
                value={formData.locationAddress}
                onChange={handleChange}
                className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="例: 愛媛県松山市朝日ヶ丘1丁目"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">刻印名 / 故人名</label>
                <input
                  type="text"
                  name="deceasedName"
                  value={formData.deceasedName}
                  onChange={handleChange}
                  className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="例: 山田家先祖代々"
                />
              </div>

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
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">特記事項・ご要望</label>
              <textarea
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleChange}
                rows={2}
                className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="例: 落ち葉が多く溜まっているので念入りに掃いてほしい、など"
              ></textarea>
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

            {/* 金額計算とDestination Chargesの透明性 */}
            <div className="space-y-3 pb-4 border-b border-stone-100">
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-stone-700">お支払い合計（税込）</span>
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
              className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-4 px-6 rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50 text-sm"
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
