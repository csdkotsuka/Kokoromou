'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { User } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* ロゴ */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-full overflow-hidden shadow-sm transition-transform group-hover:scale-105 shrink-0 border border-stone-200 bg-white">
              <Image
                src="/logo.png"
                alt="ココロモウ ロゴ"
                width={40}
                height={40}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-stone-900 block leading-tight">ココロモウ</span>
              <span className="text-[10px] text-stone-500 tracking-wider">お墓参り・お掃除代行プラットフォーム</span>
            </div>
          </Link>

          {/* ナビゲーション（施主・一般利用者向け） */}
          <nav className="flex items-center gap-2 sm:gap-4">
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
              className="text-sm font-medium text-stone-600 hover:text-emerald-800 transition-colors hidden lg:inline"
            >
              お客様の声
            </Link>
            <Link
              href="/contact"
              className="text-xs sm:text-sm font-semibold text-emerald-800 hover:text-emerald-900 transition-colors flex items-center gap-1 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200 shadow-xs hidden sm:flex"
            >
              <span>無料ご相談・お問い合わせ</span>
            </Link>
            {/* マイページ - 目立つボタン */}
            <Link
              href="/mypage"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white bg-stone-700 hover:bg-stone-800 px-3 py-2 rounded-lg shadow-sm transition-all hover:shadow-md hidden md:inline-flex"
            >
              <User className="w-3.5 h-3.5" />
              <span>マイページ</span>
            </Link>
            <Link
              href="/order"
              className="inline-flex items-center justify-center text-xs sm:text-sm font-semibold text-white bg-emerald-800 hover:bg-emerald-900 px-4 py-2 rounded-lg shadow-sm transition-all hover:shadow-md shrink-0"
            >
              お申し込み・お見積り
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
