'use client';

import React from 'react';
import Link from 'next/link';
import { Flower2 } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* ロゴ */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full bg-emerald-800 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <Flower2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-stone-900 block leading-tight">ココロモウ</span>
              <span className="text-[10px] text-stone-500 tracking-wider">お墓参り・お掃除代行プラットフォーム</span>
            </div>
          </Link>

          {/* ナビゲーション（施主・一般利用者向け） */}
          <nav className="flex items-center gap-3 sm:gap-6">
            <Link
              href="/#features"
              className="text-sm font-medium text-stone-600 hover:text-emerald-800 transition-colors hidden md:inline"
            >
              特長
            </Link>
            <Link
              href="/#plans"
              className="text-sm font-medium text-stone-600 hover:text-emerald-800 transition-colors hidden md:inline"
            >
              プラン・料金
            </Link>
            <Link
              href="/#reviews"
              className="text-sm font-medium text-stone-600 hover:text-emerald-800 transition-colors hidden sm:inline"
            >
              お客様の声
            </Link>
            <Link
              href="/#faq"
              className="text-sm font-medium text-stone-600 hover:text-emerald-800 transition-colors hidden lg:inline"
            >
              よくある質問
            </Link>
            <Link
              href="/mypage"
              className="text-xs sm:text-sm font-semibold text-stone-700 hover:text-emerald-800 transition-colors"
            >
              マイページ
            </Link>
            <Link
              href="/vendor"
              className="text-xs sm:text-sm font-semibold text-emerald-800 hover:text-emerald-950 transition-colors hidden sm:inline"
            >
              管理会社
            </Link>
            <Link
              href="/admin"
              className="text-xs sm:text-sm font-semibold text-stone-600 hover:text-stone-900 transition-colors hidden lg:inline"
            >
              本部管理
            </Link>
            <Link
              href="/order"
              className="inline-flex items-center justify-center text-xs sm:text-sm font-semibold text-white bg-emerald-800 hover:bg-emerald-900 px-4 py-2 rounded-lg shadow-sm transition-all hover:shadow-md"
            >
              お申し込み・お見積り
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
