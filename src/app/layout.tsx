import type { Metadata } from "next";
import Link from "next/link";
import { FileText } from "lucide-react";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "ココロモウ（Kokoromou）| お墓参り・お掃除代行プラットフォーム",
  description: "遠方に住むご家族と、地元の信頼できる石材・清掃業者を繋ぐお墓参り・清掃代行サービス。Stripe Connectによる安心の自動分配決済。",
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
        <footer className="bg-stone-900 text-stone-400 py-10 border-t border-stone-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
            <p className="font-semibold text-stone-300">ココロモウ（Kokoromou）- お墓参り・お掃除代行プラットフォーム</p>
            <p className="mt-2 text-xs text-stone-500">
              安心・安全の決済基盤：Stripe Connect (Destination Charges) / データ保護：Firebase
            </p>

            {/* 提携業者向け技術仕様書リンクボタン（小さく、でも分かりやすい位置に配置） */}
            <div className="mt-5 pt-5 border-t border-stone-800/80 flex justify-center items-center">
              <Link
                href="/partner-spec"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-stone-800/90 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-medium border border-stone-700/80 transition-colors shadow-xs group"
              >
                <FileText className="w-3.5 h-3.5 text-emerald-400 group-hover:text-emerald-300" />
                <span>【提携をご検討の業者様へ】システム概要・技術仕様書</span>
              </Link>
            </div>

            <p className="mt-4 text-[11px] text-stone-600">
              &copy; {new Date().getFullYear()} Kokoromou Inc. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
