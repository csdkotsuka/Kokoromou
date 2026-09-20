'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  CheckCircle2, 
  ArrowRight, 
  CalendarCheck, 
  Camera, 
  Sparkles, 
  UserCheck, 
  FileText,
  Clock,
  Loader2 
} from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id') || 'order_sample_001';
  const sessionId = searchParams.get('session_id') || 'cs_test_sample';
  const isMock = searchParams.get('mock') === 'true';

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data.order);
        }
      } catch (err) {
        console.error('Failed to fetch order:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderId]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      {/* 完了バッジ */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200 shadow-sm text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
          ご注文・決済が完了いたしました
        </h1>
        <p className="mt-3 text-sm text-stone-600">
          ココロモウをご利用いただき、誠にありがとうございます。<br />
          ご登録いただいたメールアドレスへ、注文確認通知を送信いたしました。
        </p>

        {isMock && (
          <div className="mt-4 inline-block bg-amber-50 border border-amber-200 text-amber-800 text-xs px-3 py-1.5 rounded-full font-medium">
            ※開発デモモード：Stripe APIキー未設定のため、シミュレーション完了として処理されました。
          </div>
        )}

        {/* 注文詳細情報 */}
        <div className="mt-8 bg-stone-50 rounded-2xl p-6 text-left border border-stone-200 text-xs space-y-3">
          <div className="flex justify-between border-b border-stone-200 pb-2">
            <span className="text-stone-500">注文番号 (ID)</span>
            <span className="font-mono font-bold text-stone-800">{order?.orderNumber || orderId}</span>
          </div>
          <div className="flex justify-between border-b border-stone-200 pb-2">
            <span className="text-stone-500">決済ステータス</span>
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              {order?.status === 'paid' ? '決済完了 (Paid)' : '決済完了・提携業者手配中'}
            </span>
          </div>
          <div className="flex justify-between border-b border-stone-200 pb-2">
            <span className="text-stone-500">お支払い金額</span>
            <span className="font-bold text-stone-900">
              {order ? `¥${order.totalAmount?.toLocaleString()}` : '¥14,800'} (税込)
            </span>
          </div>
          <div className="flex justify-between border-b border-stone-200 pb-2">
            <span className="text-stone-500">ご依頼プラン</span>
            <span className="font-semibold text-emerald-800">
              {order?.servicePlanName || '通常プラン（水洗い・墓石点検・シキミ）'}
            </span>
          </div>
          <div className="flex justify-between border-b border-stone-200 pb-2">
            <span className="text-stone-500">対象霊園 / 区画</span>
            <span className="font-medium text-stone-800">
              {order?.graveInfo?.cemeteryName || '宝塔寺 旭ヶ丘霊園'} ({order?.graveInfo?.sectionPlotNumber || '東区 5列 12番'})
            </span>
          </div>
          <div className="flex justify-between border-b border-stone-200 pb-2">
            <span className="text-stone-500">正面文字 / 側面の建立者名</span>
            <span className="font-medium text-stone-800 text-right">
              {order?.graveInfo?.frontInscription || order?.graveInfo?.deceasedName || '山田家先祖代々之墓'} /{' '}
              <span className="text-emerald-800 font-semibold">{order?.graveInfo?.builderName || '昭和五十年八月 山田太郎建之'}</span>
            </span>
          </div>
          <div className="flex justify-between border-b border-stone-200 pb-2">
            <span className="text-stone-500">お墓の基数 / 広さ</span>
            <span className="font-medium text-stone-800">
              {order?.graveInfo?.graveCount || 1}基 / {order?.graveInfo?.plotSize === 'extra_large' ? '特大区画(2坪超)' : order?.graveInfo?.plotSize === 'large' ? '広め区画(約1〜2坪)' : '標準区画(~1坪)'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">担当業者</span>
            <span className="font-medium text-stone-800">{order?.vendorName || '松山まごころ墓苑サポート（ダミー提携パートナー）'}</span>
          </div>
        </div>

        {/* 登録されたお墓の特定写真（正面 & 側面建立者名） */}
        <div className="mt-6 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200 text-left">
          <h3 className="text-xs font-bold text-stone-900 mb-3 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>登録された墓石の特定用写真</span>
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-2.5 rounded-xl border border-stone-200 text-center">
              <span className="text-[10px] font-bold text-stone-700 block mb-1.5">① 正面の刻印文字</span>
              <img
                src={order?.graveInfo?.frontInscriptionPhotoUrl || '/images/grave_front_example.jpg'}
                alt="正面刻印写真"
                className="w-full h-28 object-cover rounded-lg border border-stone-100"
              />
              <span className="text-[10px] text-stone-500 mt-1 block truncate">
                {order?.graveInfo?.frontInscription || '山田家先祖代々之墓'}
              </span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-stone-200 text-center">
              <span className="text-[10px] font-bold text-stone-700 block mb-1.5">② 側面の建立者名（必須）</span>
              <img
                src={order?.graveInfo?.builderNamePhotoUrl || '/images/grave_side_builder_example.jpg'}
                alt="側面建立者名写真"
                className="w-full h-28 object-cover rounded-lg border border-stone-100"
              />
              <span className="text-[10px] text-stone-500 mt-1 block truncate">
                {order?.graveInfo?.builderName || '昭和五十年八月 山田太郎建之'}
              </span>
            </div>
          </div>
        </div>

        {/* 今後の流れ */}
        <div className="mt-8 text-left">
          <h2 className="text-sm font-bold text-stone-900 mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-700" />
            <span>作業完了までの今後の流れ</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
              <span className="font-bold text-emerald-700 block mb-1">STEP 1</span>
              <p className="font-semibold text-stone-800 mb-1">提携業者の日程確定</p>
              <p className="text-stone-500">天候等を考慮し、業者より作業確定日をご連絡いたします。</p>
            </div>
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
              <span className="font-bold text-emerald-700 block mb-1">STEP 2</span>
              <p className="font-semibold text-stone-800 mb-1">現地清掃・お参り代行</p>
              <p className="text-stone-500">真心を込めて雑草除去、水洗い、お供えを実施します。</p>
            </div>
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
              <span className="font-bold text-emerald-700 block mb-1">STEP 3</span>
              <p className="font-semibold text-stone-800 mb-1">写真レポート納品</p>
              <p className="text-stone-500">作業前後の高解像度写真と点検報告をWebでお届けします。</p>
            </div>
          </div>
        </div>

        {/* アクションボタン */}
        <div className="mt-10 pt-6 border-t border-stone-100 flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Link
            href="/mypage"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 text-white font-bold px-6 py-3 rounded-xl shadow-sm transition-all text-sm"
          >
            <span>施主マイページで確認する</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          {/* 提携業者向け動作確認用リンク */}
          <Link
            href={`/vendor/reports/${orderId}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-3 rounded-xl shadow-sm transition-all text-sm"
          >
            <UserCheck className="w-4 h-4" />
            <span>【業者側確認】作業報告レポート作成へ</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-700" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
