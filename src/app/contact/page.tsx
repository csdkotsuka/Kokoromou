'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Mail, 
  Phone, 
  Send, 
  CheckCircle2, 
  Building2, 
  User, 
  HelpCircle, 
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ArrowLeft
} from 'lucide-react';

function ContactFormContent() {
  const searchParams = useSearchParams();
  const initialType = searchParams.get('type') || 'cemetery';

  const [inquiryType, setInquiryType] = useState(initialType);
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const typeParam = searchParams.get('type');
    if (typeParam) {
      setInquiryType(typeParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: inquiryType,
          name,
          companyName,
          email,
          phone,
          message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '送信に失敗しました。');
      }

      setSubmitted(true);
    } catch (err: any) {
      setErrorMessage(err.message || '送信中にエラーが発生しました。恐れ入りますが、時間をおいて再度お試しください。');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 sm:p-12 bg-white rounded-3xl shadow-xl border border-stone-200 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900">
            お問い合わせを受け付けました
          </h1>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            この度はお問い合わせいただき誠にありがとうございます。<br />
            ご入力いただいた内容を確認の上、担当者より折り返しご連絡を差し上げます。
          </p>
        </div>

        <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-left text-xs text-stone-600 space-y-1">
          <p><strong>受付内容控え：</strong></p>
          <p>・お名前：{name} 様 {companyName && `(${companyName})`}</p>
          <p>・ご連絡先メール：{email}</p>
          {phone && <p>・お電話番号：{phone}</p>}
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-stone-900 text-white font-bold text-sm hover:bg-stone-800 transition"
          >
            ← ココロモウ トップページへ戻る
          </Link>
          <Link
            href="/order"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-700 text-white font-bold text-sm hover:bg-emerald-600 transition"
          >
            お墓参り・お掃除代行の申し込みへ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto my-8 sm:my-12 px-4">
      {/* ページタイトルヘッダー */}
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
          <Mail className="w-3.5 h-3.5" />
          <span>24時間受付 総合お問い合わせ窓口</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-stone-900">
          お問い合わせ・提携ご相談フォーム
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto leading-relaxed">
          霊園・寺院様の提携・導入相談、作業代行パートナー様のご応募、一般施主様からのご質問・お困りごとなど、お気軽にお問い合わせください。
        </p>
      </div>



      {/* フォーム本体 */}
      <div className="bg-white rounded-3xl shadow-xl border border-stone-200 p-6 sm:p-10">
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border-2 border-rose-300 text-rose-800 text-sm font-bold flex items-center gap-2">
            <span>⚠️ {errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* お問い合わせ種別 */}
          <div>
            <label className="block text-sm font-bold text-stone-900 mb-2">
              お問い合わせ種別 <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'cemetery', label: '霊園・寺院・墓地管理会社様（提携・導入相談）', desc: 'システム導入、資料請求、現場取次ぎ自動化について' },
                { id: 'vendor', label: '作業代行・石材・清掃業者様（提携加盟相談）', desc: '提携パートナー登録、受注エリア拡大について' },
                { id: 'customer', label: '一般施主様（サービスへのご質問・ご相談）', desc: 'お墓参り・清掃代行の内容確認、事前相談など' },
                { id: 'other', label: 'その他・ご意見・取材等', desc: 'その他のお問い合わせ全般' },
              ].map((item) => (
                <label
                  key={item.id}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between ${
                    inquiryType === item.id
                      ? 'border-emerald-600 bg-emerald-50/60 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <input
                      type="radio"
                      name="inquiryType"
                      value={item.id}
                      checked={inquiryType === item.id}
                      onChange={(e) => setInquiryType(e.target.value)}
                      className="mt-1 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <span className="text-xs sm:text-sm font-bold text-stone-900 block leading-snug">
                        {item.label}
                      </span>
                      <span className="text-[10px] sm:text-xs text-stone-500 block mt-0.5">
                        {item.desc}
                      </span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* 貴社名・霊園名・寺院名（法人・管理者の場合） */}
          {(inquiryType === 'cemetery' || inquiryType === 'vendor') && (
            <div>
              <label className="block text-sm font-bold text-stone-900 mb-1.5 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-stone-500" />
                <span>貴社名・霊園名・寺院名</span>
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="例：宝塔寺 旭ヶ丘霊園管理事務所 / 株式会社〇〇石材"
                className="w-full p-3.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:border-emerald-600 outline-none transition text-sm font-medium"
              />
            </div>
          )}

          {/* お名前 */}
          <div>
            <label className="block text-sm font-bold text-stone-900 mb-1.5 flex items-center gap-1.5">
              <User className="w-4 h-4 text-stone-500" />
              <span>お名前・ご担当者名 <span className="text-rose-500">*</span></span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例：山田 太郎"
              className="w-full p-3.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:border-emerald-600 outline-none transition text-sm font-medium"
            />
          </div>

          {/* メールアドレス */}
          <div>
            <label className="block text-sm font-bold text-stone-900 mb-1.5 flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-stone-500" />
              <span>メールアドレス <span className="text-rose-500">*</span></span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="例：sample@example.com"
              className="w-full p-3.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:border-emerald-600 outline-none transition text-sm font-medium"
            />
          </div>

          {/* お電話番号 */}
          <div>
            <label className="block text-sm font-bold text-stone-900 mb-1.5 flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-stone-500" />
              <span>お電話番号（任意）</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="例：089-999-9999 / 090-0000-0000"
              className="w-full p-3.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:border-emerald-600 outline-none transition text-sm font-medium"
            />
          </div>

          {/* お問い合わせ内容 */}
          <div>
            <label className="block text-sm font-bold text-stone-900 mb-1.5">
              お問い合わせ内容 <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                inquiryType === 'cemetery'
                  ? '例：当霊園での導入を検討しており、資料の送付や初期運用のデモ説明をお願いしたいです。管理区画数は約〇〇区画です。'
                  : inquiryType === 'vendor'
                  ? '例：愛媛県松山市で石材・清掃業を営んでおります。提携パートナーとしての登録要件や手数料率についてお伺いしたいです。'
                  : '例：お墓参り代行の申し込みを検討していますが、うちのお墓の場所（〇〇霊園）でも対応可能でしょうか？'
              }
              className="w-full p-3.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:border-emerald-600 outline-none transition text-sm font-medium"
            />
          </div>

          {/* 送信ボタン */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 px-6 bg-emerald-800 hover:bg-emerald-700 active:scale-98 text-white text-base font-extrabold rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:bg-stone-400"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? '送信中...' : 'お問い合わせを送信する'}</span>
            </button>
            <p className="text-[11px] text-stone-500 text-center mt-3">
              ※ご送信いただいた個人情報は、お問い合わせ対応および資料送付の目的にのみ使用いたします。
            </p>
          </div>
        </form>
      </div>

      {/* トップへ戻る */}
      <div className="text-center mt-6">
        <Link href="/" className="text-xs text-stone-500 hover:text-stone-800 transition underline">
          ← ココロモウ トップページへ戻る
        </Link>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-stone-500">読み込み中...</div>}>
      <ContactFormContent />
    </Suspense>
  );
}
