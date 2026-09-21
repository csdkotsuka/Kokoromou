'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SAMPLE_ACCOUNTS } from '@/mocks/sample-data';

export default function VendorLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const vendorAccounts = SAMPLE_ACCOUNTS.filter((a) => a.role === 'vendor');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'ログインに失敗しました');
      }

      if (data.user.role !== 'vendor' && data.user.role !== 'admin') {
        throw new Error('作業代行業者のアカウントではありません');
      }

      const targetId = data.user.targetId || 'vendor_001';
      router.push(`/vendor?vendorId=${targetId}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (acc: (typeof SAMPLE_ACCOUNTS)[0]) => {
    setEmail(acc.email);
    setPassword(acc.password || 'vendor1234');
  };

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4 sm:px-6 flex flex-col justify-center items-center">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border-2 border-slate-300 p-8 sm:p-10">
        <div className="text-center mb-8">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-900 text-sm font-bold tracking-wider mb-3">
            清掃・お参り代行パートナー 専用
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            作業代行業者 ログイン
          </h1>
          <p className="text-base sm:text-lg text-slate-600 mt-2 font-medium">
            お墓参り・清掃代行 現場管理・写真報告画面
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border-2 border-red-300 text-red-700 text-base font-bold">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-lg font-bold text-slate-800 mb-2">
              メールアドレス
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="例: contact@iyotakumi.jp"
              className="w-full text-lg p-4 rounded-xl border-2 border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition text-slate-900 bg-slate-50"
            />
          </div>

          <div>
            <label className="block text-lg font-bold text-slate-800 mb-2">
              パスワード
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="パスワードを入力"
              className="w-full text-lg p-4 rounded-xl border-2 border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition text-slate-900 bg-slate-50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 rounded-2xl bg-blue-700 hover:bg-blue-800 active:scale-[0.98] text-white text-xl font-bold shadow-lg shadow-blue-900/20 transition flex items-center justify-center gap-2"
          >
            {loading ? '確認中...' : '現場画面へログイン'}
          </button>
        </form>

        {/* 高齢者・テスト用 ワンクリック選択 */}
        <div className="mt-8 pt-6 border-t-2 border-slate-200">
          <p className="text-sm font-bold text-slate-500 mb-3 text-center">
            【テスト用】ワンタップで入力
          </p>
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {vendorAccounts.map((acc) => (
              <button
                key={acc.id}
                type="button"
                onClick={() => handleQuickLogin(acc)}
                className="w-full text-left p-3 rounded-xl border border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50 text-slate-800 text-sm font-medium transition"
              >
                <span className="font-bold text-slate-900 block text-base">{acc.name}</span>
                <span className="text-xs text-slate-500">{acc.email}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-base text-slate-500 hover:text-slate-800 underline font-medium">
            ← トップページへ戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
