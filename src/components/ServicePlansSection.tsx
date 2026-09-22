'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Sparkles, Check, ArrowRight } from 'lucide-react';
import { ServicePlan } from '@/types/firestore';

interface ServicePlansSectionProps {
  plans: ServicePlan[];
}

export default function ServicePlansSection({ plans }: ServicePlansSectionProps) {
  // デフォルトで一番人気のプランを選択状態にしておく
  const popularPlan = plans.find((p) => p.isPopular) || plans[1] || plans[0];
  const [selectedPlanId, setSelectedPlanId] = useState<string>(popularPlan?.id || '');

  return (
    <section id="plans" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100/80 text-emerald-900 border border-emerald-300 rounded-full text-xs font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
          <span>安心の明朗定額・追加費用なし</span>
        </div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700">Plans & Pricing</h2>
        <p className="mt-2 text-3xl font-bold text-stone-900 sm:text-4xl">選べるサービスプラン</p>
        <p className="mt-3 text-stone-600">お墓の状況やご予算に合わせて、最適なプランをお選びいただけます。</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan) => {
          const isSelected = selectedPlanId === plan.id;

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
              {/* 一番人気バッジ or 選択中バッジ */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
                {plan.isPopular && (
                  <span className="bg-emerald-700 text-white text-xs font-black px-4 py-1 rounded-full uppercase tracking-wider shadow-md">
                    ★ 一番人気
                  </span>
                )}
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

                <div className="mt-6 flex items-baseline gap-1 bg-stone-50/80 group-hover:bg-emerald-50/50 p-3.5 rounded-2xl border border-stone-200/70 transition-colors">
                  <span className="text-3xl sm:text-4xl font-black text-stone-900">
                    ¥{plan.price.toLocaleString()}
                  </span>
                  <span className="text-xs text-stone-500 font-bold ml-1">
                    （税込 / 目安 {plan.estimatedDuration}）
                  </span>
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
                  href={`/order?planId=${plan.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className={`w-full inline-flex items-center justify-center gap-2 py-4 px-5 rounded-2xl font-black text-sm transition-all shadow-md active:scale-98 ${
                    isSelected
                      ? 'bg-emerald-700 hover:bg-emerald-800 text-white ring-2 ring-emerald-500/50 shadow-emerald-900/20'
                      : 'bg-stone-900 hover:bg-emerald-700 text-white'
                  }`}
                >
                  <span>{isSelected ? '✓ この選択中プランで申し込む' : 'このプランで申し込む'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="text-[11px] text-center text-stone-400 mt-2 font-medium">
                  {isSelected ? 'カード事前決済・追加料金なし' : 'クリックして選択'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
