'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  SAMPLE_SERVICE_PLANS, 
  SAMPLE_VENDORS, 
  SAMPLE_CEMETERY_COMPANIES, 
  PREFECTURES,
  ANNUAL_PLAN_OPTIONS,
  SCHEDULED_PERIOD_CANDIDATES
} from '@/mocks/sample-data';
import { 
  ShieldCheck, 
  CreditCard, 
  Loader2, 
  CheckCircle, 
  Check,
  Info, 
  Sparkles, 
  MapPin, 
  Layers, 
  Maximize2, 
  AlertTriangle,
  ExternalLink,
  HelpCircle,
  Camera,
  Upload,
  Image as ImageIcon,
  X,
  ChevronDown,
  ChevronUp,
  UserCheck,
  Mail,
  Phone,
  Send,
  MessageCircle,
  ArrowRight,
  Building2,
  Compass,
  FileQuestion,
  Calendar,
  Tag
} from 'lucide-react';

function OrderFormContent() {
  const searchParams = useSearchParams();
  const defaultPlanId = searchParams.get('planId') || SAMPLE_SERVICE_PLANS[1].id;
  const initialMode = searchParams.get('mode') === 'inquiry' ? 'inquiry' : 'order';
  const paramCemeteryId = searchParams.get('cemeteryId') || '';
  const paramBilling = searchParams.get('billing');
  const paramFreq = Number(searchParams.get('freq'));
  const initialBillingType = paramBilling === 'annual' ? 'annual' : 'single';
  const initialFreq = (paramFreq === 2 || paramFreq === 4) ? (paramFreq as 2 | 4) : 3;

  // 注文モード（'order': 正式本申し込み / 'inquiry': 無料事前相談・見積り）
  const [orderMode, setOrderMode] = useState<'order' | 'inquiry'>(initialMode);

  // 契約種別（'single': 1回のみ / 'annual': 年間定期管理）
  const [billingType, setBillingType] = useState<'single' | 'annual'>(initialBillingType);
  // 年間定期管理の回数（2 | 3 | 4）
  const [annualFrequency, setAnnualFrequency] = useState<2 | 3 | 4>(initialFreq);
  // 年間定期管理の実施希望時期
  const [scheduledPeriods, setScheduledPeriods] = useState<string[]>(
    initialFreq === 2
      ? ['春のお彼岸（3月頃）', 'お盆・夏参り（8月頃）']
      : initialFreq === 4
      ? ['春のお彼岸（3月頃）', 'お盆・夏参り（8月頃）', '秋のお彼岸（9月頃）', '年末・新年準備（12月頃）']
      : ['春のお彼岸（3月頃）', 'お盆・夏参り（8月頃）', '秋のお彼岸（9月頃）']
  );

  // 墓地管理会社 & 提携業者リスト（Firebaseから動的取得・初期値は静的モック）
  const [cemeteryCompanies, setCemeteryCompanies] = useState<typeof SAMPLE_CEMETERY_COMPANIES>(SAMPLE_CEMETERY_COMPANIES);
  const [vendorsList, setVendorsList] = useState<typeof SAMPLE_VENDORS>(SAMPLE_VENDORS);

  // 都道府県 & 墓地管理会社ステート
  // パラメータで指定された管理会社があればその都道府県を初期値に、なければ「愛媛県」
  const targetInitialCemetery = cemeteryCompanies.find(c => c.id === paramCemeteryId);
  const [selectedPrefecture, setSelectedPrefecture] = useState<string>(
    targetInitialCemetery?.prefecture || '愛媛県'
  );
  const [selectedCemeteryId, setSelectedCemeteryId] = useState<string>(
    targetInitialCemetery?.id || 'cem_comp_001'
  );

  const [selectedPlanId, setSelectedPlanId] = useState<string>(defaultPlanId);
  const [selectedVendorId, setSelectedVendorId] = useState<string>(SAMPLE_VENDORS[0].id);

  // Firebaseからの最新データ取得（レコード削除や追加がリアルタイムに反映される）
  useEffect(() => {
    let isMounted = true;
    const fetchFirebaseData = async () => {
      try {
        const [cemeteryRes, vendorRes] = await Promise.all([
          fetch('/api/cemetery-companies'),
          fetch('/api/vendors')
        ]);
        if (cemeteryRes.ok) {
          const cData = await cemeteryRes.json();
          if (cData.success && Array.isArray(cData.companies) && isMounted) {
            const validCompanies = (cData.companies.length > 0 && cData.companies.some((c: any) => c.prefecture === '愛媛県'))
              ? cData.companies
              : SAMPLE_CEMETERY_COMPANIES;
            setCemeteryCompanies(validCompanies);
            // 選択中の管理会社が削除されていた場合や初期化時の調整
            if (validCompanies.length > 0) {
              const inPref = validCompanies.filter((c: any) => c.prefecture === selectedPrefecture);
              if (inPref.length > 0) {
                const stillExists = inPref.some((c: any) => c.id === selectedCemeteryId);
                if (!stillExists) {
                  setSelectedCemeteryId(inPref[0].id);
                  setFormData((prev) => ({
                    ...prev,
                    cemeteryCompanyId: inPref[0].id,
                    cemeteryName: inPref[0].cemeteryNames?.[0] || inPref[0].name,
                    locationAddress: inPref[0].locationAddress || prev.locationAddress,
                  }));
                }
              }
            }
          }
        }
        if (vendorRes.ok) {
          const vData = await vendorRes.json();
          if (vData.success && Array.isArray(vData.vendors) && isMounted) {
            const validVendors = vData.vendors.length > 0 ? vData.vendors : SAMPLE_VENDORS;
            setVendorsList(validVendors);
          }
        }
      } catch (err) {
        console.warn('Firebase data fetch error, using fallback:', err);
      }
    };
    fetchFirebaseData();
    return () => {
      isMounted = false;
    };
  }, []);

  // 未登録霊園・エリアのリクエストモーダルステート
  const [showAreaRequestModal, setShowAreaRequestModal] = useState<boolean>(false);
  const [areaRequestData, setAreaRequestData] = useState({
    prefecture: '愛媛県',
    cemeteryName: '',
    locationAddress: '',
    name: '',
    email: '',
    phone: '',
    notes: '',
  });
  const [areaRequestSubmitting, setAreaRequestSubmitting] = useState(false);
  const [areaRequestSuccess, setAreaRequestSuccess] = useState(false);
  const [areaRequestError, setAreaRequestError] = useState<string | null>(null);

  // 事前相談用ステート
  const [inquiryData, setInquiryData] = useState({
    name: '',
    email: '',
    phone: '',
    prefecture: '愛媛県',
    cemeteryName: '',
    preferredContactMethod: 'email' as 'email' | 'phone',
    preferredDate: '',
    message: '',
  });
  const [inquirySubmitting, setInquirySubmitting] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [inquiryError, setInquiryError] = useState<string | null>(null);

  // オプションステート
  const [graveCount, setGraveCount] = useState<number>(1);
  const [plotSize, setPlotSize] = useState<'standard' | 'large' | 'extra_large'>('standard');

  // お墓の写真ステート（初期値は未選択null：現地に行けない方でも写真なしで申込可能）
  const [frontInscriptionPhoto, setFrontInscriptionPhoto] = useState<string | null>(null);
  const [builderNamePhoto, setBuilderNamePhoto] = useState<string | null>(null);
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);

  // フォームステート（未入力状態から開始し、入力完了でステップとボタンが連動）
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    cemeteryCompanyId: 'cem_comp_001',
    cemeteryName: '宝塔寺 旭ヶ丘霊園（モデル霊園）',
    locationAddress: '愛媛県松山市朝日ヶ丘1丁目',
    sectionPlotNumber: '',
    frontInscription: '',
    builderName: '',
    googleMapsUrl: '',
    landmarksDescription: '',
    specialRequests: '',
    preferredDate: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // マイページやお墓事前登録からのパラメータ自動反映
  useEffect(() => {
    const pCemeteryName = searchParams.get('cemeteryName');
    const pSection = searchParams.get('sectionPlotNumber');
    const pFront = searchParams.get('frontInscription');
    const pBuilder = searchParams.get('builderName');
    const pAddress = searchParams.get('locationAddress');
    const pPrefilled = searchParams.get('prefilled') === 'true';

    let authName = '';
    let authEmail = '';
    try {
      const cookieMatch = document.cookie.split('; ').find(row => row.startsWith('kokoromou_auth='));
      if (cookieMatch) {
        const uData = JSON.parse(decodeURIComponent(cookieMatch.split('=').slice(1).join('=')));
        authName = uData.name || '';
        authEmail = uData.email || '';
      }
    } catch {}

    if (pPrefilled || pFront || pSection) {
      setFormData((prev) => ({
        ...prev,
        clientName: prev.clientName || authName,
        clientEmail: prev.clientEmail || authEmail,
        cemeteryName: pCemeteryName || prev.cemeteryName,
        sectionPlotNumber: pSection || prev.sectionPlotNumber,
        frontInscription: pFront || prev.frontInscription,
        builderName: pBuilder || prev.builderName,
        locationAddress: pAddress || prev.locationAddress,
      }));
    } else if (authName || authEmail) {
      setFormData((prev) => ({
        ...prev,
        clientName: prev.clientName || authName,
        clientEmail: prev.clientEmail || authEmail,
      }));
    }
  }, [searchParams]);

  // 現在スクロール表示中のステップ (1: 霊園 | 2: プラン | 3: 基数広さ | 4: 提携業者 | 5: 墓石施主情報)
  const [activeStep, setActiveStep] = useState<number>(1);

  // 現在の都道府県に該当する管理会社リスト（Firebaseデータ連動）
  const availableCemeteries = cemeteryCompanies.filter(
    (c) => c.prefecture === selectedPrefecture
  );

  // 現在選択中の管理会社
  const currentCemetery = cemeteryCompanies.find((c) => c.id === selectedCemeteryId) || availableCemeteries[0];

  // 管理会社に紐付いている認定業者リスト（Firebaseデータ連動）
  const affiliatedVendors = currentCemetery?.affiliatedVendorIds && currentCemetery.affiliatedVendorIds.length > 0
    ? vendorsList.filter((v) => currentCemetery.affiliatedVendorIds.includes(v.id))
    : vendorsList;

  // 管理会社が変更された時、紐付き業者や霊園名を同期
  const handleCemeterySelect = (cemetery: typeof SAMPLE_CEMETERY_COMPANIES[0]) => {
    setSelectedCemeteryId(cemetery.id);
    const defaultCemeteryName = cemetery.cemeteryNames[0] || cemetery.name;
    setFormData((prev) => ({
      ...prev,
      cemeteryCompanyId: cemetery.id,
      cemeteryName: defaultCemeteryName,
      locationAddress: cemetery.locationAddress || prev.locationAddress,
    }));

    // 提携業者リストに現在の選択業者が含まれていなければ先頭に切り替え
    if (cemetery.affiliatedVendorIds && cemetery.affiliatedVendorIds.length > 0) {
      if (!cemetery.affiliatedVendorIds.includes(selectedVendorId)) {
        setSelectedVendorId(cemetery.affiliatedVendorIds[0]);
      }
    }
  };

  // 都道府県が変更された時の処理
  const handlePrefectureChange = (pref: string) => {
    setSelectedPrefecture(pref);
    setAreaRequestData((prev) => ({ ...prev, prefecture: pref }));
    const cemeteriesInPref = cemeteryCompanies.filter((c) => c.prefecture === pref);
    if (cemeteriesInPref.length > 0) {
      handleCemeterySelect(cemeteriesInPref[0]);
    } else {
      setSelectedCemeteryId('');
      setFormData((prev) => ({
        ...prev,
        cemeteryCompanyId: '',
        cemeteryName: '',
        locationAddress: '',
      }));
    }
  };

  // 未登録霊園・エリアリクエスト送信
  const handleAreaRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAreaRequestSubmitting(true);
    setAreaRequestError(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'area_request',
          name: areaRequestData.name,
          email: areaRequestData.email,
          phone: areaRequestData.phone,
          companyName: `【未登録エリアリクエスト】${areaRequestData.prefecture} / ${areaRequestData.cemeteryName}`,
          message: `【希望都道府県】: ${areaRequestData.prefecture}\n【希望霊園・墓地名】: ${areaRequestData.cemeteryName}\n【所在地・市町村】: ${areaRequestData.locationAddress || '未記入'}\n【ご要望・相談】: ${areaRequestData.notes || 'なし'}`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'リクエスト送信に失敗しました');
      setAreaRequestSuccess(true);
    } catch (err: any) {
      setAreaRequestError(err.message || '送信中にエラーが発生しました');
    } finally {
      setAreaRequestSubmitting(false);
    }
  };

  // 事前相談送信処理
  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySubmitting(true);
    setInquiryError(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'customer',
          name: inquiryData.name,
          email: inquiryData.email,
          phone: inquiryData.phone,
          prefecture: inquiryData.prefecture,
          cemeteryName: inquiryData.cemeteryName,
          preferredContactMethod: inquiryData.preferredContactMethod,
          preferredDate: inquiryData.preferredDate,
          companyName: inquiryData.cemeteryName ? `対象墓地・霊園: ${inquiryData.cemeteryName} (${inquiryData.prefecture})` : '',
          message: `【希望都道府県】: ${inquiryData.prefecture}\n${inquiryData.cemeteryName ? `【対象霊園・墓地】: ${inquiryData.cemeteryName}\n` : ''}${inquiryData.preferredDate ? `【希望時期】: ${inquiryData.preferredDate}\n` : ''}【ご希望の連絡方法】: ${inquiryData.preferredContactMethod === 'phone' ? 'お電話でのご連絡を希望' : 'メールでのご連絡'}\n\n${inquiryData.message}`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '送信に失敗しました');
      setInquirySuccess(true);
    } catch (err: any) {
      setInquiryError(err.message || '送信中にエラーが発生しました');
    } finally {
      setInquirySubmitting(false);
    }
  };

  // 各ステップの入力完了判定（5ステップ）
  const isStep1Completed = Boolean(selectedCemeteryId && formData.cemeteryName.trim());
  const isStep2Completed = Boolean(selectedPlanId);
  const isStep3Completed = Boolean(graveCount >= 1 && plotSize);
  const isStep4Completed = Boolean(selectedVendorId);
  const isStep5Completed = Boolean(
    formData.frontInscription.trim() &&
    formData.builderName.trim() &&
    formData.clientName.trim() &&
    formData.clientEmail.trim()
  );

  // 全ステップ完了判定（決済ボタンの活性化条件）
  const isAllCompleted = isStep1Completed && isStep2Completed && isStep3Completed && isStep4Completed && isStep5Completed;

  // スクロール位置の検知（今画面に表示されている項目をハイライト）
  useEffect(() => {
    const handleScroll = () => {
      const stepIds = ['step-cemetery', 'step-plan', 'step-graves', 'step-vendor', 'step-info'];
      const scrollPos = window.scrollY + 260; // ヘッダーオフセット

      for (let i = stepIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(stepIds[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveStep(i + 1);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ステッパーのボタンボタンスタイルヘルパー
  const getStepButtonClass = (stepNumber: number, isCompleted: boolean) => {
    const isCurrent = activeStep === stepNumber;
    if (isCurrent) {
      return 'bg-blue-50/95 border-2 border-blue-600 text-blue-950 font-extrabold shadow-sm ring-2 ring-blue-200/70 transition-all text-left group cursor-pointer';
    }
    if (isCompleted) {
      return 'bg-emerald-50/90 hover:bg-emerald-100/90 border border-emerald-400/80 text-emerald-950 font-bold shadow-xs transition-all text-left group cursor-pointer';
    }
    return 'bg-stone-50/80 hover:bg-stone-100/80 border border-stone-200 text-stone-500 font-medium transition-all text-left group cursor-pointer';
  };

  // ステッパーの番号バッジスタイルヘルパー
  const getStepBadgeClass = (stepNumber: number, isCompleted: boolean) => {
    const isCurrent = activeStep === stepNumber;
    if (isCurrent) {
      return 'bg-blue-600 text-white font-bold shadow-xs';
    }
    if (isCompleted) {
      return 'bg-emerald-600 text-white font-bold shadow-xs';
    }
    return 'bg-stone-200 text-stone-600 font-normal';
  };

  // 画像アップロードハンドラー
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'front' | 'builder') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (type === 'front') {
          setFrontInscriptionPhoto(event.target?.result as string);
        } else {
          setBuilderNamePhoto(event.target?.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const selectedPlan = SAMPLE_SERVICE_PLANS.find((p) => p.id === selectedPlanId) || SAMPLE_SERVICE_PLANS[0];
  const selectedVendor = SAMPLE_VENDORS.find((v) => v.id === selectedVendorId) || SAMPLE_VENDORS[0];

  // 選択中の年間定期割引設定（パターンB）
  const activeAnnualOption = ANNUAL_PLAN_OPTIONS.find((opt) => opt.frequency === annualFrequency) || ANNUAL_PLAN_OPTIONS[1];
  const discountPercent = billingType === 'annual' ? activeAnnualOption.discountPercent : 0;

  // オプション料金の計算（1回あたり）
  const basePlanFee = selectedPlan.price;
  const extraGraveFee = (graveCount - 1) * 3000;
  const extraPlotFee = plotSize === 'large' ? 3000 : plotSize === 'extra_large' ? 6000 : 0;
  
  // 1回あたりの定価合計
  const singleTotalBeforeDiscount = basePlanFee + extraGraveFee + extraPlotFee;
  // 1回あたりの実質割引後価格
  const discountedPerTime = Math.round(singleTotalBeforeDiscount * (1 - discountPercent / 100));

  // お支払い総額（年間一括前払い額 または 1回単発額）
  const totalAmount = billingType === 'annual'
    ? discountedPerTime * activeAnnualOption.frequency
    : singleTotalBeforeDiscount;

  // 割引額（お得になった金額）
  const totalOriginalWithoutDiscount = singleTotalBeforeDiscount * (billingType === 'annual' ? activeAnnualOption.frequency : 1);
  const annualDiscountAmount = totalOriginalWithoutDiscount - totalAmount;

  // Destination Charges の手数料計算プレビュー (20%)
  const platformFee = Math.round(totalAmount * (selectedPlan.platformFeePercent / 100));
  const vendorPayout = totalAmount - platformFee;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    // クライアント側バリデーション
    if (!formData.frontInscription.trim()) {
      setErrorMessage('「正面の刻印文字」を入力してください。');
      setIsLoading(false);
      return;
    }
    if (!formData.builderName.trim()) {
      setErrorMessage('同姓のお墓との誤認を防ぐため、「側面の建立者名」の入力は必須です。');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: selectedPlanId,
          vendorId: selectedVendorId,
          graveCount,
          plotSize,
          frontInscriptionPhotoUrl: frontInscriptionPhoto,
          builderNamePhotoUrl: builderNamePhoto,
          billingType,
          annualFrequency: billingType === 'annual' ? annualFrequency : undefined,
          annualDiscountPercent: billingType === 'annual' ? discountPercent : 0,
          annualDiscountAmount: billingType === 'annual' ? annualDiscountAmount : 0,
          scheduledPeriods: billingType === 'annual' ? scheduledPeriods : undefined,
          ...formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '決済セッションの初期化に失敗しました。');
      }

      if (data.url) {
        // Stripe Checkout URL または モックシミュレーションURLへ遷移
        window.location.href = data.url;
      } else {
        throw new Error('決済ページのURLを取得できませんでした。');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'エラーが発生しました。再度お試しください。');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* ページ見出し */}
      <div className="text-center max-w-2xl mx-auto mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
          {orderMode === 'order' ? 'お申込み' : '事前相談・お見積り'}
        </h1>
      </div>

      {/* モード切り替えタブ */}
      <div className="flex flex-col sm:flex-row gap-2 max-w-xl mx-auto mb-8 bg-stone-200/80 p-1.5 rounded-2xl">
        <button
          type="button"
          onClick={() => setOrderMode('order')}
          className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer ${
            orderMode === 'order'
              ? 'bg-white text-emerald-950 shadow-md border border-emerald-200'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <CreditCard className="w-4 h-4 text-emerald-600" />
          <span>本申込み</span>
        </button>

        <button
          type="button"
          onClick={() => setOrderMode('inquiry')}
          className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer ${
            orderMode === 'inquiry'
              ? 'bg-white text-emerald-950 shadow-md border border-amber-300'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <MessageCircle className="w-4 h-4 text-amber-600" />
          <span>事前相談・お見積り</span>
        </button>
      </div>

      {/* 2. 無料事前相談・お見積りモード */}
      {orderMode === 'inquiry' && (
        <div className="max-w-3xl mx-auto space-y-6">
          {inquirySuccess ? (
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-xl text-center space-y-5">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-stone-900">
                  送信完了
                </h2>
                <p className="text-stone-600 text-sm leading-relaxed">
                  受付メールを <strong className="text-emerald-900 font-mono">{inquiryData.email}</strong> 宛てにお送りしました。<br />
                  担当者よりご連絡いたします。
                </p>
              </div>
              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setInquirySuccess(false);
                    setOrderMode('order');
                  }}
                  className="px-6 py-3 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition cursor-pointer"
                >
                  本申し込みへ
                </button>
                <Link
                  href="/"
                  className="px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl text-sm transition text-center"
                >
                  トップへ
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xl space-y-6">
              <div className="border-b border-stone-100 pb-3">
                <h2 className="text-xl font-bold text-stone-900">
                  事前相談・お見積り
                </h2>
              </div>

              {inquiryError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
                  ⚠️ {inquiryError}
                </div>
              )}

              <form onSubmit={handleInquirySubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-900 mb-1">
                      都道府県 <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={inquiryData.prefecture}
                      onChange={(e) => setInquiryData({ ...inquiryData, prefecture: e.target.value })}
                      className="w-full p-3 rounded-xl border border-stone-300 bg-stone-50 text-sm focus:bg-white focus:border-emerald-600 outline-none font-medium"
                    >
                      {PREFECTURES.map((pref) => (
                        <option key={pref} value={pref}>{pref}</option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-stone-900 mb-1">
                      お名前 <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={inquiryData.name}
                      onChange={(e) => setInquiryData({ ...inquiryData, name: e.target.value })}
                      placeholder="例：山田 太郎"
                      className="w-full p-3 rounded-xl border border-stone-300 bg-stone-50 text-sm focus:bg-white focus:border-emerald-600 outline-none font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-900 mb-1">
                      メールアドレス <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={inquiryData.email}
                      onChange={(e) => setInquiryData({ ...inquiryData, email: e.target.value })}
                      placeholder="例：sample@example.com"
                      className="w-full p-3 rounded-xl border border-stone-300 bg-stone-50 text-sm focus:bg-white focus:border-emerald-600 outline-none font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-900 mb-1">
                      お電話番号 {inquiryData.preferredContactMethod === 'phone' ? <span className="text-rose-500">*（電話連絡希望のため必須）</span> : <span className="text-stone-400">（任意）</span>}
                    </label>
                    <input
                      type="tel"
                      required={inquiryData.preferredContactMethod === 'phone'}
                      value={inquiryData.phone}
                      onChange={(e) => setInquiryData({ ...inquiryData, phone: e.target.value })}
                      placeholder="例：090-0000-0000"
                      className="w-full p-3 rounded-xl border border-stone-300 bg-stone-50 text-sm focus:bg-white focus:border-emerald-600 outline-none font-medium"
                    />
                  </div>
                </div>

                {/* ご希望のご連絡方法セレクター */}
                <div className="pt-1">
                  <label className="block text-xs font-bold text-stone-900 mb-2">
                    ご連絡方法 <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label
                      className={`p-3 rounded-xl border-2 cursor-pointer transition flex items-center gap-2.5 ${
                        inquiryData.preferredContactMethod === 'email'
                          ? 'border-emerald-600 bg-emerald-50/50 text-emerald-950 font-bold'
                          : 'border-stone-200 bg-stone-50 text-stone-700 hover:border-stone-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="preferredContactMethod"
                        value="email"
                        checked={inquiryData.preferredContactMethod === 'email'}
                        onChange={() => setInquiryData({ ...inquiryData, preferredContactMethod: 'email' })}
                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                      <span className="text-xs flex items-center gap-1.5 font-bold">
                        <Mail className="w-3.5 h-3.5 text-emerald-700" />
                        <span>メール</span>
                      </span>
                    </label>

                    <label
                      className={`p-3 rounded-xl border-2 cursor-pointer transition flex items-center gap-2.5 ${
                        inquiryData.preferredContactMethod === 'phone'
                          ? 'border-emerald-600 bg-emerald-50/50 text-emerald-950 font-bold'
                          : 'border-stone-200 bg-stone-50 text-stone-700 hover:border-stone-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="preferredContactMethod"
                        value="phone"
                        checked={inquiryData.preferredContactMethod === 'phone'}
                        onChange={() => setInquiryData({ ...inquiryData, preferredContactMethod: 'phone' })}
                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                      <span className="text-xs flex items-center gap-1.5 font-bold">
                        <Phone className="w-3.5 h-3.5 text-emerald-700" />
                        <span>お電話</span>
                      </span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-900 mb-1">
                      お墓の場所・霊園名（分かる範囲で）
                    </label>
                    {/* その都道府県に登録された管理会社・霊園があればサジェスト選択可能 */}
                    {cemeteryCompanies.filter(c => c.prefecture === inquiryData.prefecture).length > 0 && (
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            setInquiryData({ ...inquiryData, cemeteryName: e.target.value });
                          }
                        }}
                        className="w-full mb-2 p-2 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-700 outline-none"
                      >
                        <option value="">-- {inquiryData.prefecture}の登録霊園から選択（任意） --</option>
                        {cemeteryCompanies
                          .filter(c => c.prefecture === inquiryData.prefecture)
                          .map(c => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                          ))}
                        <option value="その他の地域共同墓地 / 寺院墓地">その他の地域共同墓地 / 寺院墓地</option>
                      </select>
                    )}
                    <input
                      type="text"
                      value={inquiryData.cemeteryName}
                      onChange={(e) => setInquiryData({ ...inquiryData, cemeteryName: e.target.value })}
                      placeholder="例：宝塔寺 旭ヶ丘霊園 / 松山市〇〇町の共同墓地"
                      className="w-full p-3 rounded-xl border border-stone-300 bg-stone-50 text-sm focus:bg-white focus:border-emerald-600 outline-none font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-900 mb-1">
                      ご希望の実施時期（任意）
                    </label>
                    <input
                      type="text"
                      value={inquiryData.preferredDate}
                      onChange={(e) => setInquiryData({ ...inquiryData, preferredDate: e.target.value })}
                      placeholder="例：お盆まで / 命日の〇月〇日頃 / なるべく早く"
                      className="w-full p-3 rounded-xl border border-stone-300 bg-stone-50 text-sm focus:bg-white focus:border-emerald-600 outline-none font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-900 mb-1">
                    ご相談・確認したいこと <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={inquiryData.message}
                    onChange={(e) => setInquiryData({ ...inquiryData, message: e.target.value })}
                    placeholder="例：数年行けておらず、雑草や木が生えてしまっているため概算費用を知りたいです。写真があります。"
                    className="w-full p-3 rounded-xl border border-stone-300 bg-stone-50 text-sm focus:bg-white focus:border-emerald-600 outline-none font-medium"
                  />
                </div>

                <button
                  type="submit"
                  disabled={inquirySubmitting}
                  className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-700 active:scale-98 text-white font-black text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:bg-stone-400"
                >
                  <Send className="w-4 h-4" />
                  <span>{inquirySubmitting ? '送信中...' : '無料で事前相談・お見積りを送る'}</span>
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* 1. 正式お申込みモード */}
      {orderMode === 'order' && (
        <>
          {/* スティッキーステップフロー案内バー（スクロール時にページトップに固定） */}
          <div className="sticky top-16 z-30 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 bg-white/95 backdrop-blur-md border-y border-stone-200 shadow-sm mb-8 transition-all">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 text-xs">
                {/* ① 霊園・管理会社 */}
                <button
                  type="button"
                  onClick={() => document.getElementById('step-cemetery')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                  className={`flex items-center gap-2 p-2 rounded-xl ${getStepButtonClass(1, isStep1Completed)}`}
                >
                  <span className={`w-5 h-5 rounded-full ${getStepBadgeClass(1, isStep1Completed)} text-[11px] flex items-center justify-center shrink-0`}>
                    {isStep1Completed && activeStep !== 1 ? <Check className="w-3 h-3 stroke-[3]" /> : '1'}
                  </span>
                  <div className="leading-tight truncate">
                    <span className="block truncate font-bold">① 霊園・会社</span>
                    <span className={`block text-[9px] font-normal ${activeStep === 1 ? 'text-blue-700 font-semibold' : isStep1Completed ? 'text-emerald-700' : 'text-stone-400'}`}>
                      {activeStep === 1 ? '● 選択中' : isStep1Completed ? '✓ 選択済み' : '未選択'}
                    </span>
                  </div>
                </button>

                {/* ② プラン選択 */}
                <button
                  type="button"
                  onClick={() => document.getElementById('step-plan')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                  className={`flex items-center gap-2 p-2 rounded-xl ${getStepButtonClass(2, isStep2Completed)}`}
                >
                  <span className={`w-5 h-5 rounded-full ${getStepBadgeClass(2, isStep2Completed)} text-[11px] flex items-center justify-center shrink-0`}>
                    {isStep2Completed && activeStep !== 2 ? <Check className="w-3 h-3 stroke-[3]" /> : '2'}
                  </span>
                  <div className="leading-tight truncate">
                    <span className="block truncate font-bold">② プラン選択</span>
                    <span className={`block text-[9px] font-normal ${activeStep === 2 ? 'text-blue-700 font-semibold' : isStep2Completed ? 'text-emerald-700' : 'text-stone-400'}`}>
                      {activeStep === 2 ? '● 選択中' : isStep2Completed ? '✓ 選択済み' : '未選択'}
                    </span>
                  </div>
                </button>

                {/* ③ 墓石の基数・広さ */}
                <button
                  type="button"
                  onClick={() => document.getElementById('step-graves')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                  className={`flex items-center gap-2 p-2 rounded-xl ${getStepButtonClass(3, isStep3Completed)}`}
                >
                  <span className={`w-5 h-5 rounded-full ${getStepBadgeClass(3, isStep3Completed)} text-[11px] flex items-center justify-center shrink-0`}>
                    {isStep3Completed && activeStep !== 3 ? <Check className="w-3 h-3 stroke-[3]" /> : '3'}
                  </span>
                  <div className="leading-tight truncate">
                    <span className="block truncate font-bold">③ 基数・広さ</span>
                    <span className={`block text-[9px] font-normal ${activeStep === 3 ? 'text-blue-700 font-semibold' : isStep3Completed ? `✓ ${graveCount}基` : '未設定'}`}>
                      {activeStep === 3 ? '● 設定中' : isStep3Completed ? `✓ ${graveCount}基` : '未設定'}
                    </span>
                  </div>
                </button>

                {/* ④ 提携業者選択 */}
                <button
                  type="button"
                  onClick={() => document.getElementById('step-vendor')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                  className={`flex items-center gap-2 p-2 rounded-xl ${getStepButtonClass(4, isStep4Completed)}`}
                >
                  <span className={`w-5 h-5 rounded-full ${getStepBadgeClass(4, isStep4Completed)} text-[11px] flex items-center justify-center shrink-0`}>
                    {isStep4Completed && activeStep !== 4 ? <Check className="w-3 h-3 stroke-[3]" /> : '4'}
                  </span>
                  <div className="leading-tight truncate">
                    <span className="block truncate font-bold">④ 提携業者</span>
                    <span className={`block text-[9px] font-normal ${activeStep === 4 ? 'text-blue-700 font-semibold' : isStep4Completed ? 'text-emerald-700' : 'text-stone-400'}`}>
                      {activeStep === 4 ? '● 選択中' : isStep4Completed ? '✓ 選択済み' : '未選択'}
                    </span>
                  </div>
                </button>

                {/* ⑤ 墓石登録・写真 */}
                <button
                  type="button"
                  onClick={() => document.getElementById('step-info')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                  className={`flex items-center gap-2 p-2 rounded-xl ${getStepButtonClass(5, isStep5Completed)}`}
                >
                  <span className={`w-5 h-5 rounded-full ${getStepBadgeClass(5, isStep5Completed)} text-[11px] flex items-center justify-center shrink-0`}>
                    {isStep5Completed && activeStep !== 5 ? <Check className="w-3 h-3 stroke-[3]" /> : '5'}
                  </span>
                  <div className="leading-tight truncate">
                    <span className="block truncate font-bold">⑤ 墓石・施主</span>
                    <span className={`block text-[9px] font-normal ${activeStep === 5 ? 'text-blue-700 font-semibold' : isStep5Completed ? 'text-emerald-700' : 'text-stone-400'}`}>
                      {activeStep === 5 ? '● 入力中' : isStep5Completed ? '✓ 入力完了' : '未入力'}
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>

      {searchParams.get('canceled') && (
        <div className="mb-8 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm flex items-center gap-3">
          <Info className="w-5 h-5 text-amber-600 shrink-0" />
          <span>決済がキャンセルされました。内容をご確認の上、再度お申し込みいただけます。</span>
        </div>
      )}

      {errorMessage && (
        <div className="mb-8 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 左カラム：設定・フォーム入力 */}
        <div className="lg:col-span-7 space-y-8">
          {/* 1. 霊園・墓地（都道府県 ＆ 管理会社）の選択 */}
          <div id="step-cemetery" className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm scroll-mt-36 space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs flex items-center justify-center font-bold">1</span>
                <span>霊園・墓地・管理会社の選択</span>
              </h2>
            </div>

            {/* 都道府県セレクター */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-700" />
                <span>都道府県</span>
              </label>
              <select
                value={selectedPrefecture}
                onChange={(e) => handlePrefectureChange(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-stone-300 bg-stone-50 text-sm font-bold text-stone-800 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-none transition"
              >
                {PREFECTURES.map((pref) => (
                  <option key={pref} value={pref}>{pref}</option>
                ))}
              </select>
            </div>

            {/* 選択中の都道府県の管理会社一覧 */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-stone-800">
                {selectedPrefecture}の霊園・管理事務所
              </label>

              {availableCemeteries.length > 0 ? (
                <div className="space-y-3">
                  {availableCemeteries.map((cemetery) => {
                    const isSelected = cemetery.id === selectedCemeteryId;
                    return (
                      <div
                        key={cemetery.id}
                        onClick={() => handleCemeterySelect(cemetery)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600/20'
                            : 'border-stone-200 hover:border-stone-300 bg-white'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="cemetery"
                            checked={isSelected}
                            onChange={() => handleCemeterySelect(cemetery)}
                            className="mt-1 text-emerald-600 focus:ring-emerald-500"
                          />
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-bold text-stone-900 text-sm">{cemetery.name}</span>
                              <span className="text-[10px] text-emerald-800 bg-emerald-100 font-semibold px-2 py-0.5 rounded">
                                提携業者 {cemetery.affiliatedVendorIds?.length || 0}社
                              </span>
                            </div>
                            <p className="text-xs text-stone-500 mt-1 flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                              <span>所在地: {cemetery.locationAddress}</span>
                            </p>

                            {/* 管轄霊園の選択ボタン */}
                            <div className="mt-3 pt-2 border-t border-stone-100">
                              <span className="text-[11px] font-bold text-stone-700 block mb-1.5">
                                該当霊園:
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {cemetery.cemeteryNames.map((cemName) => {
                                  const isCemSelected = isSelected && formData.cemeteryName === cemName;
                                  return (
                                    <button
                                      type="button"
                                      key={cemName}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleCemeterySelect(cemetery);
                                        setFormData((prev) => ({ ...prev, cemeteryName: cemName }));
                                      }}
                                      className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition cursor-pointer flex items-center gap-1 ${
                                        isCemSelected
                                          ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                                          : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                                      }`}
                                    >
                                      {isCemSelected && <Check className="w-3 h-3 stroke-[3]" />}
                                      <span>{cemName}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* 登録霊園がある場合でも「見当たらない場合のリクエスト」案内 */}
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-600 text-xs flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>見当たらない場合</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setAreaRequestData((prev) => ({ ...prev, prefecture: selectedPrefecture }));
                        setShowAreaRequestModal(true);
                      }}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-900 underline cursor-pointer shrink-0"
                    >
                      霊園リクエスト →
                    </button>
                  </div>
                </div>
              ) : (
                /* 該当都道府県に管理会社が未登録の場合のカード */
                <div className="p-6 rounded-2xl bg-amber-50/80 border border-amber-200 text-center space-y-3">
                  <div className="w-10 h-10 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div className="max-w-md mx-auto">
                    <h3 className="text-sm font-bold text-amber-950">
                      {selectedPrefecture}は提携準備中エリアです
                    </h3>
                    <p className="text-xs text-amber-800 mt-1">
                      ご希望の霊園・墓地名をリクエストいただけます。
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAreaRequestData((prev) => ({ ...prev, prefecture: selectedPrefecture }));
                      setShowAreaRequestModal(true);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 active:scale-98 text-white font-bold text-xs rounded-xl shadow transition cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>霊園・墓地をリクエスト</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 2. プラン選択 */}
          <div id="step-plan" className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm scroll-mt-36 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs flex items-center justify-center font-bold">2</span>
                <span>サービスプランの選択</span>
              </h2>

              {/* 1回のみ vs 年間定期管理 切替タブ */}
              <div className="inline-flex p-1 bg-stone-100 rounded-xl border border-stone-200 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setBillingType('single')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    billingType === 'single'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  1回のみ
                </button>
                <button
                  type="button"
                  onClick={() => setBillingType('annual')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    billingType === 'annual'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-stone-600 hover:text-emerald-900'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>📅 年間定期管理</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-black ${
                    billingType === 'annual' ? 'bg-amber-400 text-stone-950' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    最大15%OFF
                  </span>
                </button>
              </div>
            </div>

            {/* 年間定期管理選択時の回数・時期設定パネル（パターンB） */}
            {billingType === 'annual' && (
              <div className="p-4 sm:p-5 bg-emerald-50/80 border-2 border-emerald-300 rounded-2xl space-y-4 animate-in fade-in duration-200">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                      <Tag className="w-4 h-4 text-emerald-700" />
                      <span>お参り回数</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {ANNUAL_PLAN_OPTIONS.map((opt) => {
                      const isFreqSelected = annualFrequency === opt.frequency;
                      return (
                        <button
                          key={opt.frequency}
                          type="button"
                          onClick={() => {
                            setAnnualFrequency(opt.frequency);
                            if (opt.frequency === 2) {
                              setScheduledPeriods(['春のお彼岸（3月頃）', 'お盆・夏参り（8月頃）']);
                            } else if (opt.frequency === 3) {
                              setScheduledPeriods(['春のお彼岸（3月頃）', 'お盆・夏参り（8月頃）', '秋のお彼岸（9月頃）']);
                            } else {
                              setScheduledPeriods(['春のお彼岸（3月頃）', 'お盆・夏参り（8月頃）', '秋のお彼岸（9月頃）', '年末・新年準備（12月頃）']);
                            }
                          }}
                          className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                            isFreqSelected
                              ? 'border-emerald-600 bg-white shadow-sm ring-2 ring-emerald-500/20'
                              : 'border-emerald-200 bg-white/70 hover:bg-white text-stone-700'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="font-extrabold text-xs text-stone-900">{opt.label}</span>
                            <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                              opt.isPopular
                                ? 'bg-amber-400 text-stone-950'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {opt.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-500 leading-tight">
                            {opt.recommendedDescription}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 実施希望時期の選択 */}
                <div className="pt-3 border-t border-emerald-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-emerald-950">
                      希望時期（{annualFrequency}回分）:
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {SCHEDULED_PERIOD_CANDIDATES.map((cand) => {
                      const periodText = `${cand.label}（${cand.season}）`;
                      const isChecked = scheduledPeriods.includes(periodText);
                      return (
                        <label
                          key={cand.id}
                          className={`p-2.5 rounded-lg border text-xs cursor-pointer flex items-center gap-2 transition ${
                            isChecked
                              ? 'bg-white border-emerald-600 text-emerald-950 font-bold shadow-2xs'
                              : 'bg-white/60 border-stone-200 text-stone-600 hover:bg-white'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setScheduledPeriods([...scheduledPeriods, periodText]);
                              } else {
                                setScheduledPeriods(scheduledPeriods.filter((p) => p !== periodText));
                              }
                            }}
                            className="rounded text-emerald-600 focus:ring-emerald-500"
                          />
                          <div>
                            <span className="block leading-tight">{cand.label}</span>
                            <span className="text-[10px] text-stone-400 block">{cand.season}</span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* プラン一覧リスト */}
            <div className="space-y-3">
              {SAMPLE_SERVICE_PLANS.map((plan) => {
                const isSelected = plan.id === selectedPlanId;
                const singlePrice = plan.price;
                const discRate = billingType === 'annual' ? activeAnnualOption.discountPercent : 0;
                const perTimePrice = Math.round(singlePrice * (1 - discRate / 100));
                const annualPrice = perTimePrice * (billingType === 'annual' ? activeAnnualOption.frequency : 1);
                const originalTotal = singlePrice * (billingType === 'annual' ? activeAnnualOption.frequency : 1);
                const saveTotal = originalTotal - annualPrice;

                return (
                  <label
                    key={plan.id}
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={`flex items-start justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600/20'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="plan"
                        checked={isSelected}
                        onChange={() => setSelectedPlanId(plan.id)}
                        className="mt-1 text-emerald-600 focus:ring-emerald-500"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-900 text-sm">{plan.name}</span>
                          {billingType === 'annual' ? (
                            <span className="text-[10px] bg-amber-500 text-stone-950 px-2 py-0.5 rounded-full font-black">
                              年{activeAnnualOption.frequency}回 {activeAnnualOption.discountPercent}%OFF
                            </span>
                          ) : plan.isPopular ? (
                            <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">
                              一番人気
                            </span>
                          ) : null}
                        </div>
                        <p className="text-xs text-stone-500 mt-1">{plan.description}</p>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {plan.features.map((feat, idx) => (
                            <span key={idx} className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded">
                              ✓ {feat}
                            </span>
                          ))}
                        </div>
                        <p className="text-[11px] text-stone-400 mt-1.5">作業目安: {plan.estimatedDuration}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0 ml-3">
                      {billingType === 'annual' ? (
                        <div>
                          <div className="text-base font-extrabold text-emerald-800">
                            ¥{annualPrice.toLocaleString()}
                          </div>
                          <span className="text-[10px] text-stone-500 block">
                            (1回実質 ¥{perTimePrice.toLocaleString()} / 税込)
                          </span>
                          <span className="inline-block mt-0.5 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">
                            ¥{saveTotal.toLocaleString()}引
                          </span>
                        </div>
                      ) : (
                        <div>
                          <span className="text-base font-extrabold text-stone-900">¥{singlePrice.toLocaleString()}</span>
                          <span className="text-[10px] text-stone-500 block">税込 / 1回</span>
                        </div>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 3. 基数・区画オプション */}
          <div id="step-graves" className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-5 scroll-mt-36">
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs flex items-center justify-center font-bold">3</span>
              <span>基数・広さオプション</span>
            </h2>

            {/* お墓の基数 */}
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/80">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-emerald-700" />
                  <span>お墓の基数</span>
                </label>
                <span className="text-xs text-emerald-700 font-semibold">
                  {graveCount === 1 ? '基本料金内 (1基)' : `${graveCount}基 (+¥${((graveCount - 1) * 3000).toLocaleString()})`}
                </span>
              </div>
              <div className="flex items-center gap-3">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    type="button"
                    key={num}
                    onClick={() => setGraveCount(num)}
                    className={`w-12 h-12 rounded-xl font-extrabold text-sm transition-all border ${
                      graveCount === num
                        ? 'border-emerald-600 bg-emerald-700 text-white shadow-md ring-2 ring-emerald-600/30'
                        : 'border-stone-300 bg-white text-stone-700 hover:border-stone-400 hover:bg-stone-50'
                    }`}
                  >
                    {num}基
                  </button>
                ))}
              </div>
            </div>

            {/* 区画の広さ */}
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/80">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <Maximize2 className="w-4 h-4 text-emerald-700" />
                  <span>区画の広さ</span>
                </label>
                <span className="text-xs text-emerald-700 font-semibold">
                  {plotSize === 'standard' ? '基本料金内' : plotSize === 'large' ? '+¥3,000' : '+¥6,000'}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  {
                    id: 'standard',
                    label: '標準区画',
                    desc: '〜約1坪（畳2枚分程度まで）',
                    extra: '+¥0',
                  },
                  {
                    id: 'large',
                    label: '広め区画',
                    desc: '約1〜2坪（畳4枚分程度）',
                    extra: '+¥3,000',
                  },
                  {
                    id: 'extra_large',
                    label: '特大会区画',
                    desc: '2坪以上（畳4枚超・広い敷地）',
                    extra: '+¥6,000',
                  },
                ].map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setPlotSize(item.id as any)}
                    className={`p-3 text-left rounded-lg border text-xs transition-all ${
                      plotSize === item.id
                        ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-600/30 text-emerald-950 font-bold'
                        : 'border-stone-300 bg-white text-stone-700 hover:border-stone-400'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-xs">{item.label}</span>
                      <span className={`text-[10px] ${plotSize === item.id ? 'text-emerald-700 font-bold' : 'text-stone-400'}`}>
                        {item.extra}
                      </span>
                    </div>
                    <p className="text-[10px] text-stone-500 font-normal leading-tight">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 4. 担当提携業者選択 */}
          <div id="step-vendor" className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm scroll-mt-36">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-4 border-b border-stone-100 pb-3">
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs flex items-center justify-center font-bold">4</span>
                <span>担当提携業者の選択</span>
              </h2>
              {currentCemetery && (
                <span className="text-[11px] text-emerald-800 bg-emerald-50 font-semibold px-2.5 py-1 rounded-full border border-emerald-200">
                  {currentCemetery.name} 公認パートナー ({affiliatedVendors.length}社)
                </span>
              )}
            </div>
            <div className="space-y-3">
              {affiliatedVendors.map((vendor) => {
                const isSelected = vendor.id === selectedVendorId;
                return (
                  <label
                    key={vendor.id}
                    onClick={() => setSelectedVendorId(vendor.id)}
                    className={`flex items-start justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600/20'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="vendor"
                        checked={isSelected}
                        onChange={() => setSelectedVendorId(vendor.id)}
                        className="mt-1 text-emerald-600 focus:ring-emerald-500"
                      />
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-stone-900 text-sm">{vendor.displayName}</span>
                          <span className="text-[10px] text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded font-medium">
                            Stripe Connect Verified
                          </span>
                          <span className="text-amber-600 font-bold text-xs">
                            ★ {vendor.vendorProfile?.rating}
                          </span>
                        </div>
                        {vendor.vendorProfile?.representativeName && (
                          <p className="text-[11px] text-emerald-800 font-medium mt-0.5">
                            担当: {vendor.vendorProfile.representativeName}
                          </p>
                        )}
                        <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                          {vendor.vendorProfile?.description}
                        </p>
                        <div className="flex flex-wrap items-center justify-between text-[11px] text-stone-500 mt-2 pt-2 border-t border-stone-100">
                          <span>対応: {vendor.vendorProfile?.serviceAreas.join('・')}</span>
                          <span className="font-semibold text-emerald-800">施工実績: {vendor.vendorProfile?.completedJobsCount}件</span>
                        </div>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 4. お墓情報・施主情報 */}
          <div id="step-info" className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-5 scroll-mt-36">
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs flex items-center justify-center font-bold">4</span>
              <span>お墓・施主情報</span>
            </h2>

            {/* 施主情報 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  お名前（施主様） <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  required
                  className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="例: 山田 太郎"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  メールアドレス（完了報告送信用） <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  name="clientEmail"
                  value={formData.clientEmail}
                  onChange={handleChange}
                  required
                  className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="例: yamada@example.com"
                />
              </div>
            </div>

            {/* 霊園・区画情報 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  霊園・寺院名 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="cemeteryName"
                  value={formData.cemeteryName}
                  onChange={handleChange}
                  required
                  className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="例: 宝塔寺 旭ヶ丘霊園"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  区画番号・墓石番号 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="sectionPlotNumber"
                  value={formData.sectionPlotNumber}
                  onChange={handleChange}
                  required
                  className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="例: 東区 5列 12番"
                />
              </div>
            </div>

            {/* 墓石の特定ガイド（図解アコーディオン） */}
            <div className="bg-stone-50 border border-stone-200 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setShowGuideModal(!showGuideModal)}
                className="w-full px-4 py-3 text-left flex items-center justify-between text-xs font-bold text-stone-800 hover:bg-stone-100 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-emerald-700" />
                  <span>お墓の彫刻文字の確認方法（図解）</span>
                </span>
                {showGuideModal ? <ChevronUp className="w-4 h-4 text-stone-500" /> : <ChevronDown className="w-4 h-4 text-stone-500" />}
              </button>
              {showGuideModal && (
                <div className="p-4 bg-white border-t border-stone-200 space-y-2">
                  <img
                    src="/images/grave_inscription_guide.jpg"
                    alt="和型墓石の彫刻見方ガイド（正面家名と側面建立者名）"
                    className="w-full rounded-lg border border-stone-200 shadow-sm"
                  />
                  <p className="text-[11px] text-stone-600">
                    正面に家名、側面または裏面に建立者名が刻まれています。
                  </p>
                </div>
              )}
            </div>

            {/* お墓の特定情報 */}
            <div className="space-y-4 p-5 bg-emerald-50/50 rounded-2xl border border-emerald-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. 正面文字 & 写真 */}
                <div className="bg-white p-4 rounded-xl border border-emerald-200/80 shadow-xs space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-900 mb-1">
                      正面の刻印文字 <span className="text-rose-500">*必須</span>
                    </label>
                    <input
                      type="text"
                      name="frontInscription"
                      value={formData.frontInscription}
                      onChange={handleChange}
                      required
                      className="w-full text-sm bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      placeholder="例: 山田家之墓 / 南無阿弥陀仏"
                    />
                  </div>

                  {/* 正面写真アップロード & プレビュー */}
                  <div className="pt-2 border-t border-stone-100">
                    <label className="block text-xs font-bold text-stone-800 mb-1.5 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Camera className="w-3.5 h-3.5 text-emerald-700" />
                        <span>正面写真（任意）</span>
                      </span>
                    </label>

                    {frontInscriptionPhoto ? (
                      <div className="relative rounded-lg overflow-hidden border border-emerald-300 bg-stone-100 group">
                        <img
                          src={frontInscriptionPhoto}
                          alt="正面の文字写真"
                          className="w-full h-36 object-cover"
                        />
                        <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <label className="cursor-pointer bg-white text-stone-900 text-xs font-bold px-3 py-1.5 rounded-lg shadow hover:bg-stone-50 transition">
                            <span>写真を変更</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handlePhotoUpload(e, 'front')}
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => setFrontInscriptionPhoto(null)}
                            className="bg-rose-600 text-white text-xs p-1.5 rounded-lg shadow hover:bg-rose-700 transition"
                            title="削除"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="border-2 border-dashed border-stone-300 hover:border-emerald-500 rounded-lg p-3 text-center cursor-pointer block transition bg-stone-50 hover:bg-emerald-50/30">
                        <Upload className="w-5 h-5 text-stone-400 mx-auto mb-1" />
                        <span className="text-xs font-semibold text-stone-700 block">写真を追加（任意）</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handlePhotoUpload(e, 'front')}
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* 2. 側面建立者名 & 写真 */}
                <div className="bg-white p-4 rounded-xl border border-emerald-200/80 shadow-xs space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-900 mb-1">
                      側面の建立者名 <span className="text-rose-500">*必須</span>
                    </label>
                    <input
                      type="text"
                      name="builderName"
                      value={formData.builderName}
                      onChange={handleChange}
                      required
                      className="w-full text-sm bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      placeholder="例: 昭和50年 山田太郎建之（お名前のみ可）"
                    />
                  </div>

                  {/* 側面写真アップロード & プレビュー */}
                  <div className="pt-2 border-t border-stone-100">
                    <label className="block text-xs font-bold text-stone-800 mb-1.5 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Camera className="w-3.5 h-3.5 text-emerald-700" />
                        <span>側面写真（任意）</span>
                      </span>
                    </label>

                    {builderNamePhoto ? (
                      <div className="relative rounded-lg overflow-hidden border border-emerald-300 bg-stone-100 group">
                        <img
                          src={builderNamePhoto}
                          alt="側面の建立者名写真"
                          className="w-full h-36 object-cover"
                        />
                        <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <label className="cursor-pointer bg-white text-stone-900 text-xs font-bold px-3 py-1.5 rounded-lg shadow hover:bg-stone-50 transition">
                            <span>写真を変更</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handlePhotoUpload(e, 'builder')}
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => setBuilderNamePhoto(null)}
                            className="bg-rose-600 text-white text-xs p-1.5 rounded-lg shadow hover:bg-rose-700 transition"
                            title="削除"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="border-2 border-dashed border-stone-300 hover:border-emerald-500 rounded-lg p-3 text-center cursor-pointer block transition bg-stone-50 hover:bg-emerald-50/30">
                        <Upload className="w-5 h-5 text-stone-400 mx-auto mb-1" />
                        <span className="text-xs font-semibold text-stone-700 block">写真を追加（任意）</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handlePhotoUpload(e, 'builder')}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 住所 */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">霊園・墓地の所在地・住所</label>
              <input
                type="text"
                name="locationAddress"
                value={formData.locationAddress}
                onChange={handleChange}
                className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="例: 愛媛県松山市朝日ヶ丘1丁目"
              />
            </div>

            {/* Googleマップ位置情報（URL） */}
            <div>
              <label className="text-xs font-bold text-stone-800 mb-1 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-700" />
                <span>Googleマップ位置情報（任意）</span>
              </label>
              <input
                type="text"
                name="googleMapsUrl"
                value={formData.googleMapsUrl}
                onChange={handleChange}
                className="w-full text-sm bg-white border border-stone-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none mt-1"
                placeholder="例: https://maps.app.goo.gl/xxx または 座標"
              />
            </div>

            {/* 周辺の目印・特徴 */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                周辺の目印・隣のお墓の家名など
              </label>
              <input
                type="text"
                name="landmarksDescription"
                value={formData.landmarksDescription}
                onChange={handleChange}
                className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="例: 階段を上がってすぐ右、大楠の木のすぐ横、隣は「〇〇家」のお墓など"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">ご希望作業日</label>
                <input
                  type="date"
                  name="preferredDate"
                  value={formData.preferredDate}
                  onChange={handleChange}
                  className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">特記事項・ご要望</label>
                <input
                  type="text"
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleChange}
                  className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="例: 落ち葉を念入りに掃いてほしい等"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 右カラム：料金サマリー & Stripe決済ボタン */}
        <div className="lg:col-span-5">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm sticky top-24 space-y-6">
            <h2 className="text-base font-bold text-stone-900">お支払いサマリー</h2>

            <div className="space-y-3 text-xs text-stone-600 pb-4 border-b border-stone-100">
              <div className="flex justify-between">
                <span>対象霊園・墓地</span>
                <span className="font-semibold text-stone-900 text-right">
                  {formData.cemeteryName || '未選択'}
                  {currentCemetery && (
                    <span className="block text-[10px] text-stone-500 font-normal">
                      ({currentCemetery.name})
                    </span>
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>選択プラン</span>
                <span className="font-semibold text-stone-900">{selectedPlan.name}</span>
              </div>
              <div className="flex justify-between">
                <span>担当提携業者</span>
                <span className="font-semibold text-stone-900">{selectedVendor.displayName}</span>
              </div>
              <div className="flex justify-between">
                <span>作業目安時間</span>
                <span className="font-semibold text-stone-900">{selectedPlan.estimatedDuration}</span>
              </div>
              <div className="flex justify-between">
                <span>契約形態</span>
                <span className="font-semibold text-stone-900">
                  {billingType === 'annual' ? (
                    <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-bold border border-emerald-200">
                      年間定期管理（年{annualFrequency}回・{discountPercent}%OFF）
                    </span>
                  ) : (
                    '1回のみスポット'
                  )}
                </span>
              </div>
              {billingType === 'annual' && scheduledPeriods.length > 0 && (
                <div className="flex justify-between items-start pt-1">
                  <span>希望時期</span>
                  <span className="font-medium text-stone-800 text-right">
                    {scheduledPeriods.join('、')}
                  </span>
                </div>
              )}
            </div>

            {/* 料金内訳 */}
            <div className="space-y-2 text-xs text-stone-600 pb-4 border-b border-stone-100">
              <div className="flex justify-between">
                <span>基本プラン料金（1回あたり）</span>
                <span className="font-medium text-stone-800">¥{basePlanFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>お墓の基数 ({graveCount}基)</span>
                <span className="font-medium text-stone-800">
                  {extraGraveFee > 0 ? `+¥${extraGraveFee.toLocaleString()}` : '¥0'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>区画の広さ ({plotSize === 'extra_large' ? '特大2坪以上' : plotSize === 'large' ? '広め1〜2坪' : '標準'})</span>
                <span className="font-medium text-stone-800">
                  {extraPlotFee > 0 ? `+¥${extraPlotFee.toLocaleString()}` : '¥0'}
                </span>
              </div>

              {billingType === 'annual' ? (
                <>
                  <div className="pt-2 border-t border-dashed border-stone-200 flex justify-between text-stone-500">
                    <span>1回あたり通常小計</span>
                    <span>¥{singleTotalBeforeDiscount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-stone-500">
                    <span>通常年間合計（{annualFrequency}回）</span>
                    <span>¥{totalOriginalWithoutDiscount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-amber-700 font-bold bg-amber-50 px-2 py-1 rounded">
                    <span>年間定期一括割引（{discountPercent}%OFF）</span>
                    <span>-¥{annualDiscountAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-emerald-800 font-medium">
                    <span>1回あたり実質</span>
                    <span>¥{discountedPerTime.toLocaleString()} / 回</span>
                  </div>
                </>
              ) : null}
            </div>

            {/* 金額合計とDestination Chargesの透明性 */}
            <div className="space-y-3 pb-4 border-b border-stone-100">
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-semibold text-stone-800">
                  {billingType === 'annual' ? 'お支払い総額（年間一括・税込）' : 'お支払い総額（税込）'}
                </span>
                <span className="text-2xl font-extrabold text-emerald-700">
                  ¥{totalAmount.toLocaleString()}
                </span>
              </div>

              {/* Stripe Connect 構造の可視化 */}
              <div className="bg-stone-50 rounded-xl p-3 text-[11px] space-y-1.5 border border-stone-200/80">
                <div className="flex items-center gap-1.5 font-bold text-stone-700 mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Stripe Connect 自動送金内訳</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>提携業者受取分 (80%)</span>
                  <span>¥{vendorPayout.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>プラットフォーム運営手数料 (20%)</span>
                  <span>¥{platformFee.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* 決済ボタン（全入力完了でアクティブ化、それまではグレーアウト） */}
            <div className="space-y-2">
              <button
                type="submit"
                disabled={!isAllCompleted || isLoading}
                className={`w-full flex items-center justify-center gap-2 font-bold py-4 px-6 rounded-xl transition-all text-sm ${
                  isAllCompleted && !isLoading
                    ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-md hover:shadow-lg cursor-pointer transform active:scale-[0.99]'
                    : 'bg-stone-200 text-stone-400 border border-stone-300 cursor-not-allowed shadow-none'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>接続中...</span>
                  </>
                ) : isAllCompleted ? (
                  <>
                    <CreditCard className="w-5 h-5" />
                    <span>決済へ進む</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 opacity-40" />
                    <span>必須項目を入力してください</span>
                  </>
                )}
              </button>

              {/* 未入力時のガイダンス案内 */}
              {!isAllCompleted && (
                <p className="text-[11px] text-amber-800 text-center font-medium">
                  ※未入力の必須項目があります
                </p>
              )}
            </div>

            <div className="text-[11px] text-stone-400 text-center flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>SSL暗号化 / PCI-DSS準拠</span>
            </div>
          </div>
        </div>
      </form>
      </>
      )}

      {/* 未登録霊園・エリアのリクエストモーダル */}
      {showAreaRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-stone-200 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  霊園・墓地のリクエスト
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowAreaRequestModal(false);
                  setAreaRequestSuccess(false);
                  setAreaRequestError(null);
                }}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {areaRequestSuccess ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h4 className="text-base font-bold text-stone-900">受付完了</h4>
                <p className="text-xs text-stone-600">
                  リクエストを受け付けました。担当者よりご連絡いたします。
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowAreaRequestModal(false);
                    setAreaRequestSuccess(false);
                  }}
                  className="mt-4 px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow transition cursor-pointer"
                >
                  閉じる
                </button>
              </div>
            ) : (
              <form onSubmit={handleAreaRequestSubmit} className="space-y-4">
                {areaRequestError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
                    ⚠️ {areaRequestError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">
                      都道府県 <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={areaRequestData.prefecture}
                      onChange={(e) => setAreaRequestData({ ...areaRequestData, prefecture: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 text-xs focus:bg-white focus:border-emerald-600 outline-none"
                    >
                      {PREFECTURES.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">
                      霊園・墓地名 <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={areaRequestData.cemeteryName}
                      onChange={(e) => setAreaRequestData({ ...areaRequestData, cemeteryName: e.target.value })}
                      placeholder="例: 〇〇寺 境内墓地 / 〇〇霊園"
                      className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 text-xs focus:bg-white focus:border-emerald-600 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    霊園・墓地の所在地・市町村（分かる範囲で）
                  </label>
                  <input
                    type="text"
                    value={areaRequestData.locationAddress}
                    onChange={(e) => setAreaRequestData({ ...areaRequestData, locationAddress: e.target.value })}
                    placeholder="例: 愛媛県西条市 / 香川県高松市〇〇町"
                    className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 text-xs focus:bg-white focus:border-emerald-600 outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">
                      お名前 <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={areaRequestData.name}
                      onChange={(e) => setAreaRequestData({ ...areaRequestData, name: e.target.value })}
                      placeholder="例: 山田 太郎"
                      className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 text-xs focus:bg-white focus:border-emerald-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">
                      メールアドレス <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={areaRequestData.email}
                      onChange={(e) => setAreaRequestData({ ...areaRequestData, email: e.target.value })}
                      placeholder="例: yamada@example.com"
                      className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 text-xs focus:bg-white focus:border-emerald-600 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    お電話番号（任意）
                  </label>
                  <input
                    type="tel"
                    value={areaRequestData.phone}
                    onChange={(e) => setAreaRequestData({ ...areaRequestData, phone: e.target.value })}
                    placeholder="例: 090-0000-0000"
                    className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 text-xs focus:bg-white focus:border-emerald-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    ご要望・お困りごと（任意）
                  </label>
                  <textarea
                    rows={3}
                    value={areaRequestData.notes}
                    onChange={(e) => setAreaRequestData({ ...areaRequestData, notes: e.target.value })}
                    placeholder="例: 山奥の共同墓地で草が生い茂っており対応可能か知りたいです。"
                    className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 text-xs focus:bg-white focus:border-emerald-600 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={areaRequestSubmitting}
                  className="w-full py-3 bg-emerald-800 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs sm:text-sm rounded-xl shadow transition cursor-pointer flex items-center justify-center gap-2 disabled:bg-stone-400"
                >
                  <Send className="w-4 h-4" />
                  <span>{areaRequestSubmitting ? '送信中...' : '霊園リクエストを自社運営本部へ送信する'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-700" />
        </div>
      }
    >
      <OrderFormContent />
    </Suspense>
  );
}
