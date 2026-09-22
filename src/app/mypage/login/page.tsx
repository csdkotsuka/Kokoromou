'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { SAMPLE_ACCOUNTS } from '@/mocks/sample-data';
import { User, Phone, Mail, Lock, ArrowRight, HeartHandshake, QrCode, Sparkles, CheckCircle2 } from 'lucide-react';

function MyPageLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const paramPhone = searchParams.get('phone') || '';
  const paramEmail = searchParams.get('email') || '';
  const paramPass = searchParams.get('pass') || '';
  const paramAuto = searchParams.get('auto') === 'true';

  const [identifier, setIdentifier] = useState(paramPhone || paramEmail);
  const [password, setPassword] = useState(paramPass);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [autoLoggingIn, setAutoLoggingIn] = useState(false);

  const customerAccounts = SAMPLE_ACCOUNTS.filter((a) => a.role === 'customer');

  // ハガキQRコードからの自動ログイン処理
  useEffect(() => {
    if (paramAuto && (paramPhone || paramEmail) && paramPass) {
      setAutoLoggingIn(true);
      const performAutoLogin = async () => {
        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              identifier: paramPhone || paramEmail,
              password: paramPass,
            }),
          });
          const data = await res.json();
          if (res.ok && data.user) {
            // スムーズにマイページへ
            setTimeout(() => {
              router.push('/mypage');
            }, 600);
          } else {
            setAutoLoggingIn(false);
            setError(data.error || '自動認証に失敗しました。パスワードをご確認ください。');
          }
        } catch (err: any) {
          setAutoLoggingIn(false);
          setError(err.message || '認証エラーが発生しました');
        }
      };
      performAutoLogin();
    }
  }, [paramAuto, paramPhone, paramEmail, paramPass, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: identifier.trim(),
          password: password.trim(),
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'ログインに失敗しました');
      }

      if (data.user.role !== 'customer' && data.user.role !== 'admin') {
        throw new Error('施主（顧客）のアカウントではありません');
      }

      router.push('/mypage');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (acc: (typeof SAMPLE_ACCOUNTS)[0]) => {
    setIdentifier(acc.phoneNumber || acc.email);
    setPassword(acc.password || 'client1234');
  };

  if (autoLoggingIn) {
    return (
      <div className="bg-white rounded-3xl shadow-xl border-2 border-emerald-200 p-8 sm:p-10 text-center space-y-5 animate-pulse">
        <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
          <QrCode className="w-8 h-8 animate-spin" />
        </div>
        <div>
          <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full mb-2">
            DM案内ハガキ QRコード認証
          </span>
          <h2 className="text-xl font-extrabold text-stone-900">
            お墓管理ページへログイン中...
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            事前登録されたお墓情報を読み込んでいます。少々お待ちください。
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl border-2 border-emerald-100 p-8 sm:p-10">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-emerald-700 text-white flex items-center justify-center mx-auto mb-4 shadow-md">
          <User className="w-8 h-8" />
        </div>
        <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-sm font-bold tracking-wider mb-3">
          施主様専用マイページ
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
          マイページ ログイン
        </h1>
        <p className="text-sm text-stone-500 mt-2">
          登録済みのお墓の確認・お参り清掃のご予約・レポート確認
        </p>
      </div>

      {paramPhone && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            霊園からのDMハガキ専用URLよりアクセスされました。
            <br />
            初期パスワードを入力してログインしてください。
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border-2 border-red-200 text-red-700 text-sm font-bold">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-stone-800 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-emerald-700" />
              お電話番号 または メールアドレス
            </span>
            <span className="text-[11px] text-stone-400 font-normal">
              ハイフン有無どちらでも可
            </span>
          </label>
          <input
            type="text"
            required
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="例: 090-1234-5678 または mail@example.com"
            className="w-full p-4 rounded-xl border-2 border-stone-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition text-stone-900 bg-stone-50 text-sm font-medium"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-stone-800 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-emerald-700" />
              パスワード
            </span>
            <span className="text-[11px] text-emerald-700 font-bold">
              ハガキ記載の仮PW、または電話番号下4桁
            </span>
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="パスワードを入力"
            className="w-full p-4 rounded-xl border-2 border-stone-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition text-stone-900 bg-stone-50 text-sm font-medium"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white text-base font-bold shadow-lg shadow-emerald-900/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:bg-stone-400"
        >
          <span>{loading ? 'ログイン中...' : 'マイページへログイン'}</span>
          {!loading && <ArrowRight className="w-4 h-4" />}
        </button>
      </form>

      {/* ダミーアカウント クイックログイン */}
      <div className="mt-8 pt-6 border-t-2 border-stone-100">
        <p className="text-xs font-bold text-stone-400 mb-3 text-center tracking-wider">
          【テスト用】ワンタップで施主アカウントを入力
        </p>
        <div className="space-y-2">
          {customerAccounts.map((acc) => (
            <button
              key={acc.id}
              type="button"
              onClick={() => handleQuickLogin(acc)}
              className="w-full text-left p-3.5 rounded-xl border border-stone-200 hover:border-emerald-400 bg-stone-50 hover:bg-emerald-50 text-stone-800 text-sm font-medium transition cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-900">{acc.name} 様</span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  電話: {acc.phoneNumber || '未登録'}
                </span>
              </div>
              <span className="text-xs text-stone-400 block mt-1">
                ログインID: {acc.phoneNumber || acc.email} ／ PW: {acc.password || 'client1234'}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MyPageLoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/60 to-stone-50 py-12 px-4 sm:px-6 flex flex-col justify-center items-center">
      <div className="max-w-md w-full space-y-6">
        {/* ロゴ・ヘッダー */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6 group">
            <div className="w-12 h-12 rounded-full overflow-hidden shadow-md border-2 border-emerald-200 bg-white">
              <Image
                src="/logo.png"
                alt="ココロモウ ロゴ"
                width={48}
                height={48}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <div className="text-left">
              <span className="text-xl font-bold tracking-tight text-stone-900 block leading-tight">ココロモウ</span>
              <span className="text-[10px] text-stone-500">お墓参り・お掃除代行プラットフォーム</span>
            </div>
          </Link>
        </div>

        {/* ログインフォーム本体 (Suspense内) */}
        <Suspense
          fallback={
            <div className="bg-white rounded-3xl p-10 text-center text-stone-400">
              読み込み中...
            </div>
          }
        >
          <MyPageLoginForm />
        </Suspense>

        {/* サポート案内 */}
        <div className="bg-emerald-800 text-white rounded-2xl p-5 flex items-center gap-4 shadow-md">
          <HeartHandshake className="w-8 h-8 text-emerald-300 shrink-0" />
          <div className="text-xs">
            <p className="font-bold text-emerald-100 mb-1">ハガキをお持ちの施主様へ</p>
            <p className="text-emerald-300 leading-relaxed">
              霊園・お寺から届いた案内ハガキのQRコードを読み取ると、お墓の写真・区画番号が登録された専用ページへ直接ログインできます。
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link href="/" className="text-sm text-stone-500 hover:text-stone-800 underline font-medium">
            ← トップページへ戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
