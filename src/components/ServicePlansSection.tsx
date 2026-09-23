'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Sparkles, Check, ArrowRight, Calendar, Tag } from 'lucide-react';
import { ServicePlan } from '@/types/firestore';
import { ANNUAL_PLAN_OPTIONS } from '@/mocks/sample-data';

interface ServicePlansSectionProps {
  plans: ServicePlan[];
}

export default function ServicePlansSection({ plans }: ServicePlansSectionProps) {
  // 契約種別（'single': 1回のみスポット / 'annual': 年間定期管理）
  const [billingType, setBillingType] = useState<'single' | 'annual'>('single');
  // 年間定期管理の回数（2 | 3 | 4、デフォルトは一番人気の3回）
  const [annualFrequency, setAnnualFrequency] = useState<2 | 3 | 4>(3);

  // デフォルトで一番人気のプランを選択状態にしておく
  const popularPlan = plans.find((p) => p.isPopular) || plans[1] || plans[0];
  const [selectedPlanId, setSelectedPlanId] = useState<string>(popularPlan?.id || '');

  // 選択中の年間定期割引設定
  const activeAnnualOption = ANNUAL_PLAN_OPTIONS.find((opt) => opt.frequency === annualFrequency) || ANNUAL_PLAN_OPTIONS[1];

  return (
    <section id="plans" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100/80 text-emerald-900 border border-emerald-300 rounded-full text-xs font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
          <span>安心の明朗定額・追加費用なし</span>
        </div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700">Plans & Pricing</h2>
        <p className="mt-2 text-3xl font-bold text-stone-900 sm:text-4xl">選べるサービスプラン</p>
        <p className="mt-3 text-stone-600">お墓の状況やご予算に合わせて、最適なプランをお選びいただけます。</p>

        {/* 1回のみ vs 年間定期管理 切り替えタブ */}
        <div className="mt-8 inline-flex p-1.5 bg-stone-200/80 rounded-2xl border border-stone-300 shadow-inner">
          <button
            type="button"
            onClick={() => setBillingType('single')}
            className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
              billingType === 'single'
                ? 'bg-white text-stone-900 shadow-md'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>1回のみスポット</span>
          </button>
          <button
            type="button"
            onClick={() => setBillingType('annual')}
            className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
              billingType === 'annual'
                ? 'bg-emerald-700 text-white shadow-md'
                : 'text-stone-700 hover:text-emerald-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>📅 年間定期管理</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
              billingType === 'annual' ? 'bg-amber-400 text-stone-950' : 'bg-emerald-100 text-emerald-800'
            }`}>
              最大15%OFF
            </span>
          </button>
        </div>

        {/* 年間定期管理選択時の回数ステップセレクター（パターンB） */}
        {billingType === 'annual' && (
          <div className="mt-6 p-4 sm:p-5 bg-emerald-50/80 border-2 border-emerald-300 rounded-3xl max-w-2xl mx-auto animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center justify-between mb-3 text-left">
              <span className="text-xs sm:text-sm font-black text-emerald-950 flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-emerald-700" />
                <span>年間のお参り回数をお選びください（回数が多いほど割引率UP）</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {ANNUAL_PLAN_OPTIONS.map((opt) => {
                const isFreqSelected = annualFrequency === opt.frequency;
                return (
                  <button
                    key={opt.frequency}
                    type="button"
                    onClick={() => setAnnualFrequency(opt.frequency)}
                    className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isFreqSelected
                        ? 'border-emerald-600 bg-white shadow-md ring-2 ring-emerald-500/30'
                        : 'border-emerald-200/80 bg-white/70 hover:bg-white text-stone-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-extrabold text-sm text-stone-900">{opt.label}</span>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          opt.isPopular
                            ? 'bg-amber-400 text-stone-950'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {opt.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 leading-snug">
                        {opt.recommendedDescription}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <p className="text-[11px] text-emerald-900 text-left mt-3 font-medium">
              💡 <strong>前払い一括契約でお得！</strong> 実施時期（春彼岸・お盆・秋彼岸・年末など）は、お申し込み画面にてご自由にお選びいただけます。
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan) => {
          const isSelected = selectedPlanId === plan.id;

          // 金額計算
          const singlePrice = plan.price;
          const discountPercent = billingType === 'annual' ? activeAnnualOption.discountPercent : 0;
          const discountedPerTime = Math.round(singlePrice * (1 - discountPercent / 100));
          const annualTotalAmount = discountedPerTime * (billingType === 'annual' ? activeAnnualOption.frequency : 1);
          const totalOriginalAmount = singlePrice * (billingType === 'annual' ? activeAnnualOption.frequency : 1);
          const savedAmount = totalOriginalAmount - annualTotalAmount;

          return (
            <div
              key={plan.id}
              onClick={() => setSelectedPlanId(plan.id)}
              className={`relative bg-white rounded-3xl border-2 flex flex-col justify-between p-7 sm:p-8 transition-all duration-300 cursor-pointer select-none group ${
                isSelected
                  ? 'border-emerald-600 shadow-2xl ring-4 ring-emerald-500/25 -translate-y-2 bg-gradient-to-b from-emerald-50/40 via-white to-white'
                  : 'border-stone-200 shadow-sm hover:border-emerald-400 hover:shadow-xl hover:-translate-y-1.5 bg-white'
              }`}
            >
              {/* 一番人気バッジ or 割引バッジ */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 whitespace-nowrap">
                {billingType === 'annual' ? (
                  <span className="bg-amber-500 text-stone-950 text-xs font-black px-3.5 py-1 rounded-full shadow-md flex items-center gap-1">
                    <span>🔥 年{activeAnnualOption.frequency}回定期 {activeAnnualOption.discountPercent}%OFF</span>
                  </span>
                ) : plan.isPopular ? (
                  <span className="bg-emerald-700 text-white text-xs font-black px-4 py-1 rounded-full uppercase tracking-wider shadow-md">
                    ★ 一番人気
                  </span>
                ) : null}

                {isSelected && (
                  <span className="bg-emerald-600 text-white text-xs font-black px-3 py-1 rounded-full flex items-center gap-1 shadow-md animate-in fade-in zoom-in-95">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>選択中</span>
                  </span>
                )}
              </div>

              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className={`text-xl font-extrabold transition-colors ${
                    isSelected ? 'text-emerald-950' : 'text-stone-900 group-hover:text-emerald-800'
                  }`}>
                    {plan.name}
                  </h3>
                  {/* ラジオボタン風インジケーター */}
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 transition-all ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-600 text-white'
                      : 'border-stone-300 group-hover:border-emerald-500 bg-white'
                  }`}>
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </div>

                <p className="mt-2 text-xs text-stone-500 min-h-[36px] leading-relaxed">
                  {plan.description}
                </p>

                {/* 料金表示ブロック */}
                <div className="mt-6 bg-stone-50/90 group-hover:bg-emerald-50/50 p-4 rounded-2xl border border-stone-200/80 transition-colors">
                  {billingType === 'annual' ? (
                    <div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs text-stone-500 font-bold">1回あたり実質:</span>
                        <span className="text-2xl sm:text-3xl font-black text-emerald-800">
                          ¥{discountedPerTime.toLocaleString()}
                        </span>
                      </div>
                      <div className="mt-2 pt-2 border-t border-stone-200 flex items-center justify-between text-xs">
                        <span className="text-stone-600 font-bold">年間一括支払額（年{activeAnnualOption.frequency}回）:</span>
                        <strong className="text-stone-900 font-black text-base">
                          ¥{annualTotalAmount.toLocaleString()}
                        </strong>
                      </div>
                      <div className="mt-1.5 text-right">
                        <span className="inline-block text-[11px] font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                          通常より ¥{savedAmount.toLocaleString()} お得！
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl sm:text-4xl font-black text-stone-900">
                          ¥{singlePrice.toLocaleString()}
                        </span>
                        <span className="text-xs text-stone-500 font-bold ml-1">
                          （税込 / 1回）
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-1 font-medium">
                        目安作業時間: {plan.estimatedDuration}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-6 border-t border-stone-100 pt-6">
                  <p className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    <span>含まれる作業内容：</span>
                  </p>
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-stone-700 font-medium">
                        <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 transition-colors ${
                          isSelected ? 'text-emerald-600' : 'text-emerald-500 group-hover:text-emerald-600'
                        }`} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-stone-100">
                <Link
                  href={
                    billingType === 'annual'
                      ? `/order?planId=${plan.id}&billing=annual&freq=${annualFrequency}`
                      : `/order?planId=${plan.id}`
                  }
                  onClick={(e) => e.stopPropagation()}
                  className={`w-full inline-flex items-center justify-center gap-2 py-4 px-5 rounded-2xl font-black text-sm transition-all shadow-md active:scale-98 ${
                    isSelected
                      ? 'bg-emerald-700 hover:bg-emerald-800 text-white ring-2 ring-emerald-500/50 shadow-emerald-900/20'
                      : 'bg-stone-900 hover:bg-emerald-700 text-white'
                  }`}
                >
                  <span>
                    {billingType === 'annual'
                      ? `年${activeAnnualOption.frequency}回定期（${activeAnnualOption.discountPercent}%OFF）で申し込む`
                      : isSelected ? '✓ この選択中プランで申し込む' : 'このプランで申し込む'
                    }
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="text-[11px] text-center text-stone-400 mt-2 font-medium">
                  {billingType === 'annual' ? '前払い一括決済・希望時期の変更可能' : 'カード事前決済・追加料金なし'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
