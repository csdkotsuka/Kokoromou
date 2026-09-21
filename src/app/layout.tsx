import type { Metadata } from "next";
import Link from "next/link";
import { FileText, UserCheck, ShieldCheck, Printer, Mail } from "lucide-react";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "ココロモウ（Kokoromou）| お墓参り・お掃除代行プラットフォーム",
  description: "遠方に住むご家族と、地元の信頼できる石材・清掃業者を繋ぐお墓参り・清掃代行サービス。Stripe Connectによる安心の自動分配決済。",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-stone-50 text-stone-900">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="bg-stone-950 text-stone-400 py-14 border-t border-stone-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
            <p className="font-semibold text-stone-200 text-base">ココロモウ（Kokoromou）- お墓参り・お掃除代行プラットフォーム</p>
            <p className="mt-2 text-xs text-stone-400">
              安心・安全の決済基盤：Stripe Connect (Destination Charges) / データ保護：Google Cloud (Firebase)
            </p>

            {/* お問い合わせリンク */}
            <div className="mt-5 flex justify-center items-center gap-4 text-xs">
              <Link href="/contact" className="text-emerald-400 hover:text-emerald-300 font-bold underline flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                <span>お問い合わせ・提携ご相談（24時間受付）</span>
              </Link>
            </div>

            {/* 事業者向けログインセクション */}
            <div className="mt-8 pt-6 border-t border-stone-800/80">
              <p className="text-[11px] text-stone-500 mb-4 tracking-wider font-semibold">
                【提携事業者様・管理会社様向けログイン】
              </p>

              {/* メインの目立つログインボタン */}
              <div className="flex flex-wrap justify-center items-center gap-4 mb-5">
                <Link
                  href="/cemetery/login"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-600 text-white text-sm font-bold border border-amber-600 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 group"
                >
                  <ShieldCheck className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>墓地管理会社ログイン</span>
                </Link>
                <Link
                  href="/vendor/login"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-600 text-white text-sm font-bold border border-blue-600 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 group"
                >
                  <UserCheck className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>作業代行業者ログイン</span>
                </Link>
              </div>

              {/* サブリンク（近日削除予定） */}
              <div className="flex flex-wrap justify-center items-center gap-3">
                <Link
                  href="/partner-spec"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-300 text-xs font-medium border border-stone-700/60 transition-colors"
                >
                  <FileText className="w-3 h-3" />
                  <span>提携業者様向け技術仕様書</span>
                </Link>
                <Link
                  href="/flyer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-300 text-xs font-medium border border-stone-700/60 transition-colors"
                >
                  <Printer className="w-3 h-3" />
                  <span>販促チラシ・リーフレット叩き台</span>
                </Link>
              </div>
            </div>

            <p className="mt-8 text-[11px] text-stone-600">
              &copy; {new Date().getFullYear()} Creative System Design. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
