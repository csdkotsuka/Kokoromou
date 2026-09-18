import type { Metadata } from "next";
import Link from "next/link";
import { FileText, ShieldCheck } from "lucide-react";
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
        <footer className="bg-stone-950 text-stone-400 py-12 border-t border-stone-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
            <p className="font-semibold text-stone-200 text-base">ココロモウ（Kokoromou）- お墓参り・お掃除代行プラットフォーム</p>
            <p className="mt-2 text-xs text-stone-400">
              安心・安全の決済基盤：Stripe Connect (Destination Charges) / データ保護：Google Cloud (Firebase)
            </p>

            {/* 提携業者向け技術仕様書リンクボタン */}
            <div className="mt-6 pt-6 border-t border-stone-800 flex flex-col sm:flex-row justify-center items-center gap-3">
              <Link
                href="/partner-spec"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900/90 text-emerald-300 hover:text-emerald-200 text-xs font-bold border border-emerald-700/60 transition-all shadow-md group"
              >
                <FileText className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span>【提携をご検討の業者様へ】システム概要・技術仕様書を見る</span>
              </Link>
            </div>

            <p className="mt-6 text-[11px] text-stone-600">
              &copy; {new Date().getFullYear()} Kokoromou Inc. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
