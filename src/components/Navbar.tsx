'use client';

import React from 'react';
import Link from 'next/link';
import { Flower2, ShieldCheck, UserCheck } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* ロゴ */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <Flower2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-stone-900 block leading-tight">ココロモウ</span>
              <span className="text-[10px] text-stone-500 tracking-wider">お墓参り・お掃除代行プラットフォーム</span>
            </div>
          </Link>

          {/* ナビゲーション */}
          <nav className="flex items-center gap-3 sm:gap-6">
            <Link
              href="/#plans"
              className="text-sm font-medium text-stone-600 hover:text-emerald-700 transition-colors hidden md:inline"
            >
              プラン・料金
            </Link>
            <Link
              href="/#features"
              className="text-sm font-medium text-stone-600 hover:text-emerald-700 transition-colors hidden md:inline"
            >
              サービスの特長
            </Link>
            <Link
              href="/vendor/reports/order_sample_001"
              className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-stone-600 hover:text-emerald-700 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-full transition-colors"
            >
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>提携業者ポータル</span>
            </Link>
            <Link
              href="/order"
              className="inline-flex items-center justify-center text-xs sm:text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 px-4 py-2 rounded-lg shadow-sm transition-all hover:shadow-md"
            >
              お申し込み・お見積り
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
