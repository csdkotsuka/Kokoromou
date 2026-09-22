'use client';

import { useState, useEffect, useMemo, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CemeteryCompany, User, Order, VendorContract, EmailTemplate, CemeteryClient, Report } from '@/types/firestore';
import QRCode from 'qrcode';
import {
  SAMPLE_CEMETERY_COMPANIES,
  SAMPLE_VENDORS,
  SAMPLE_ORDERS,
} from '@/mocks/sample-data';

function CemeteryDashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const fromSource = searchParams.get('from'); // 'admin' | null
  const companyIdParam = searchParams.get('companyId') || 'cem_comp_001';

  const [companyId, setCompanyId] = useState<string>(companyIdParam);
  const [companies, setCompanies] = useState<CemeteryCompany[]>(SAMPLE_CEMETERY_COMPANIES);
  const [vendors, setVendors] = useState<User[]>(SAMPLE_VENDORS);
  const [orders, setOrders] = useState<Order[]>(SAMPLE_ORDERS);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);

  // 文字サイズ切り替えステート（標準・大・特大）
  const [fontSize, setFontSize] = useState<'standard' | 'large' | 'xlarge'>('large');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kokoromou_cemetery_fontsize') as any;
      if (saved === 'standard' || saved === 'large' || saved === 'xlarge') {
        setFontSize(saved);
      }
    }
  }, []);

  const handleSetFontSize = (size: 'standard' | 'large' | 'xlarge') => {
    setFontSize(size);
    if (typeof window !== 'undefined') {
      localStorage.setItem('kokoromou_cemetery_fontsize', size);
    }
  };

  // 施主名簿CSVインポートステート
  const [importedClients, setImportedClients] = useState<CemeteryClient[]>([]);
  const [showImportModal, setShowImportModal] = useState(false);
  const [parsedPreviewClients, setParsedPreviewClients] = useState<CemeteryClient[]>([]);
  const [csvFileName, setCsvFileName] = useState('');
  const [importLoading, setImportLoading] = useState(false);
  const [importSuccessMsg, setImportSuccessMsg] = useState<string | null>(null);

  // 施主お墓写真・情報 編集モーダルステート（正面と側面・建立者の2枚対応）
  const [editingClient, setEditingClient] = useState<CemeteryClient | null>(null);
  const [editGraveForm, setEditGraveForm] = useState({
    photoUrl: '', // 正面写真
    builderPhotoUrl: '', // 側面・建立者写真
    sectionPlotNumber: '',
    frontInscription: '',
    builderName: '',
    phoneNumber: '',
    email: '',
  });
  const [isSavingGraveInfo, setIsSavingGraveInfo] = useState(false);

  // 顧客名簿の初回自動選択フラグ（解除ボタンや個別チェックを上書きしない）
  const hasInitializedSelectionRef = useRef(false);

  // パーソナライズ案内DM印刷モーダルステート
  const [showDmModal, setShowDmModal] = useState(false);
  const [dmPrintLayout, setDmPrintLayout] = useState<'postcard' | 'a4_postcard' | 'a4'>('a4_postcard');
  const [qrCodeUrls, setQrCodeUrls] = useState<Record<string, string>>({});
  const [targetPrintClients, setTargetPrintClients] = useState<any[]>([]);
  const [selectedClientIds, setSelectedClientIds] = useState<string[]>([]);

  // 会社情報 編集モーダル状態
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<CemeteryCompany>>({});
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // 提携代行業者 編集モーダル状態
  const [isEditingVendors, setIsEditingVendors] = useState(false);
  const [tempAffiliatedVendorIds, setTempAffiliatedVendorIds] = useState<string[]>([]);

  // 新規代行業者 登録モーダル状態
  const [isAddingNewVendor, setIsAddingNewVendor] = useState(false);
  const [newVendorData, setNewVendorData] = useState({
    displayName: '',
    representativeName: '',
    phoneNumber: '',
    email: '',
    businessType: 'individual' as 'corporation' | 'individual',
    serviceAreas: '松山市全域・中予エリア',
    description: '',
    password: 'vendor1234',
  });
  const [agreedToSafetyWarnings, setAgreedToSafetyWarnings] = useState(false);

  // 契約書印刷・ダウンロードモーダル状態
  const [contractPrintTargetVendor, setContractPrintTargetVendor] = useState<User | null>(null);
  const [showContractTemplateModal, setShowContractTemplateModal] = useState(false);

  // 契約書アップロードモーダル状態
  const [uploadTargetVendor, setUploadTargetVendor] = useState<User | null>(null);
  const [contractUploadFile, setContractUploadFile] = useState<{
    dataUrl: string;
    fileName: string;
    fileType: string;
  } | null>(null);
  const [contractUploadNotes, setContractUploadNotes] = useState('');
  const [isUploadingContract, setIsUploadingContract] = useState(false);

  // 添付契約書 閲覧プレビューモーダル状態
  const [viewingContract, setViewingContract] = useState<{
    vendorName: string;
    contract: VendorContract;
  } | null>(null);

  // 契約書テンプレートPDF アップロードモーダル状態
  const [isUploadingTemplate, setIsUploadingTemplate] = useState(false);
  const [templateUploadFile, setTemplateUploadFile] = useState<{
    dataUrl: string;
    fileName: string;
    fileType: string;
  } | null>(null);
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);

  // 案内メール用テンプレート状態・顧客管理状態
  const [activeTemplates, setActiveTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [emailSubject, setEmailSubject] = useState<string>('');
  const [emailBody, setEmailBody] = useState<string>('');
  const [selectedClientEmails, setSelectedClientEmails] = useState<string[]>([]);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [isSavingTemplateLoading, setIsSavingTemplateLoading] = useState(false);
  const [isAddingTemplateModal, setIsAddingTemplateModal] = useState(false);
  const [newTemplateTitleInput, setNewTemplateTitleInput] = useState('');

  // Escキーで開いているすべてのポップアップ・モーダルを閉じる
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsEditingCompany(false);
        setIsEditingVendors(false);
        setIsAddingNewVendor(false);
        setShowContractTemplateModal(false);
        setUploadTargetVendor(null);
        setViewingContract(null);
        setIsUploadingTemplate(false);
        setIsAddingTemplateModal(false);
        setShowImportModal(false);
        setShowDmModal(false);
        setEditingClient(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 施主名簿データの読み込み
  const loadClientsData = async (cid = companyId) => {
    try {
      const res = await fetch(`/api/cemetery/clients?companyId=${cid}`);
      if (res.ok) {
        const data = await res.json();
        if (data.clients) {
          setImportedClients(data.clients);
        }
      }
    } catch (e) {
      console.warn('Failed to load clients:', e);
    }
  };

  // 初期データ読み込み（APIから最新情報を取得、フォールバックあり）
  useEffect(() => {
    async function loadData() {
      try {
        const [cemRes, venRes, ordRes, repRes] = await Promise.all([
          fetch('/api/cemetery-companies'),
          fetch('/api/vendors'),
          fetch('/api/orders'),
          fetch('/api/reports'),
        ]);
        if (cemRes.ok) {
          const data = await cemRes.json();
          if (data.companies?.length) setCompanies(data.companies);
        }
        if (venRes.ok) {
          const data = await venRes.json();
          if (data.vendors?.length) setVendors(data.vendors);
        }
        if (ordRes.ok) {
          const data = await ordRes.json();
          if (data.orders?.length) setOrders(data.orders);
        }
        if (repRes.ok) {
          const data = await repRes.json();
          if (data.reports?.length) setReports(data.reports);
        }
        await loadClientsData(companyId);
      } catch (e) {
        console.warn('API fetch error, using local fallback:', e);
      }
    }
    loadData();
  }, [companyId]);

  const currentCompany = companies.find((c) => c.id === companyId) || companies[0];

  // この墓地管理会社に提携している代行業者
  const affiliatedVendors = vendors.filter((v) =>
    currentCompany?.affiliatedVendorIds?.includes(v.id)
  );

  // 提携業者の編集モーダルを開く
  const handleOpenVendorEdit = () => {
    setTempAffiliatedVendorIds([...(currentCompany?.affiliatedVendorIds || [])]);
    setIsEditingVendors(true);
  };

  // 提携業者のチェック切り替え（トグル）
  const handleToggleVendorId = (vendorId: string) => {
    setTempAffiliatedVendorIds((prev) =>
      prev.includes(vendorId) ? prev.filter((id) => id !== vendorId) : [...prev, vendorId]
    );
  };

  // 提携代行業者の変更をFirestoreに保存
  const handleSaveVendors = async () => {
    setLoading(true);
    try {
      const updated: CemeteryCompany = {
        ...currentCompany,
        affiliatedVendorIds: tempAffiliatedVendorIds,
      };

      const res = await fetch('/api/cemetery-companies', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });

      if (res.ok) {
        setCompanies((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
        setIsEditingVendors(false);
        setSaveSuccessMsg('提携作業代行業者の設定を更新・保存しました！');
        setTimeout(() => setSaveSuccessMsg(null), 4000);
      } else {
        alert('保存に失敗しました');
      }
    } catch (err) {
      alert('エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  // 新規代行業者の登録
  const handleCreateVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToSafetyWarnings) {
      alert('「重要確認事項」をご確認のうえ、同意チェックを入れてください。');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newVendorData,
          cemeteryCompanyId: currentCompany.id,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setVendors((prev) => [...prev, data.vendor]);
        const newAffiliated = [...(currentCompany.affiliatedVendorIds || []), data.vendor.id];
        setCompanies((prev) =>
          prev.map((c) => (c.id === currentCompany.id ? { ...c, affiliatedVendorIds: newAffiliated } : c))
        );
        setIsAddingNewVendor(false);
        setSaveSuccessMsg(`新しい作業代行パートナー「${data.vendor.displayName}」を登録し、提携先に追加しました！`);
        setTimeout(() => setSaveSuccessMsg(null), 5000);
      } else {
        alert(data.error || '登録に失敗しました');
      }
    } catch (err: any) {
      alert('エラーが発生しました: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // この墓地管理会社が管轄する霊園の注文一覧
  const companyOrders = orders.filter(
    (o) =>
      o.cemeteryCompanyId === currentCompany?.id ||
      currentCompany?.cemeteryNames?.some((name) => o.graveInfo?.cemeteryName?.includes(name))
  );

  // 施主様（顧客）の集約名簿リスト（注文履歴 ＋ CSV取り込み施主を統合）
  const clientsSummary = useMemo(() => {
    const map = new Map<string, {
      id: string;
      email: string;
      name: string;
      phone?: string;
      phoneNumber?: string;
      postalCode?: string;
      address?: string;
      frontInscription: string;
      builderName: string;
      sectionPlotNumber: string;
      cemeteryName: string;
      initialPassword?: string;
      photoUrl?: string;
      builderPhotoUrl?: string;
      notes?: string;
      lastOrderDate: string;
      orderCount: number;
      lastPlanName: string;
      latestAfterPhotoUrl?: string;
    }>();

    // 1. 管理会社に紐付く事前登録施主データ（CSVインポート施主）
    const allCompanyClients = [
      ...(currentCompany?.clients || []),
      ...importedClients,
    ];

    allCompanyClients.forEach((c) => {
      const key = (c.phoneNumber || c.email || c.id).replace(/\D/g, '') || c.id;
      if (!map.has(key)) {
        map.set(key, {
          id: c.id,
          email: c.email || '',
          name: c.name || '施主様',
          phone: c.phoneNumber || '',
          phoneNumber: c.phoneNumber || '',
          postalCode: c.postalCode || '',
          address: c.address || '',
          frontInscription: c.frontInscription || '',
          builderName: c.builderName || '',
          sectionPlotNumber: c.sectionPlotNumber || '',
          cemeteryName: currentCompany?.name || '管理霊園',
          initialPassword: c.initialPassword || (c.phoneNumber ? c.phoneNumber.replace(/\D/g, '').slice(-4) : 'client1234'),
          photoUrl: c.photoUrl || '/images/grave_front_example.jpg',
          builderPhotoUrl: c.builderPhotoUrl || '/images/grave_side_builder_example.jpg',
          notes: c.notes || '',
          lastOrderDate: c.lastOrderDate || '',
          orderCount: c.orderCount || 0,
          lastPlanName: '',
        });
      }
    });

    // 2. 過去の注文履歴から集約マージ
    companyOrders.forEach((o) => {
      const phoneKey = (o.clientPhone || '').replace(/\D/g, '');
      const key = phoneKey || o.clientEmail || `no_email_${o.clientId || o.id}`;
      const existing = map.get(key);
      if (!existing) {
        map.set(key, {
          id: o.clientId || o.id,
          email: o.clientEmail || '',
          name: o.clientName || '施主様',
          phone: o.clientPhone || '',
          phoneNumber: o.clientPhone || '',
          postalCode: '',
          address: o.graveInfo?.locationAddress || '',
          frontInscription: o.graveInfo?.frontInscription || '',
          builderName: o.graveInfo?.builderName || '',
          sectionPlotNumber: o.graveInfo?.sectionPlotNumber || '',
          cemeteryName: o.graveInfo?.cemeteryName || '',
          initialPassword: 'client1234',
          photoUrl: '/images/grave_front_example.jpg',
          builderPhotoUrl: '/images/grave_side_builder_example.jpg',
          notes: '',
          lastOrderDate: o.createdAt || '',
          orderCount: 1,
          lastPlanName: o.servicePlanName || '',
        });
      } else {
        existing.orderCount += 1;
        if (new Date(o.createdAt) > new Date(existing.lastOrderDate || 0)) {
          existing.lastOrderDate = o.createdAt;
          existing.lastPlanName = o.servicePlanName || existing.lastPlanName;
        }
      }
    });

    // 3. 作業代行業者の完了レポート写真と連動（最新の清掃完了写真）
    const clientList = Array.from(map.values());
    clientList.forEach((cl) => {
      const matchedOrders = companyOrders.filter(
        (o) =>
          (o.clientId === cl.id || (o.clientPhone && o.clientPhone.replace(/\D/g, '') === (cl.phoneNumber || '').replace(/\D/g, ''))) &&
          (o.status === 'completed' || o.reportId)
      );
      if (matchedOrders.length > 0) {
        const sorted = [...matchedOrders].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        const latestOrd = sorted[0];
        const rep = reports.find((r) => r.orderId === latestOrd.id || r.id === latestOrd.reportId);
        if (rep && rep.afterPhotos && rep.afterPhotos.length > 0) {
          cl.latestAfterPhotoUrl = rep.afterPhotos[0].url;
        }
      }
    });

    return clientList;
  }, [currentCompany, importedClients, companyOrders, reports]);

  // 見本CSVダウンロード
  const handleDownloadSampleCsv = () => {
    const headers = [
      '施主氏名',
      '電話番号',
      '郵便番号',
      '住所',
      'メールアドレス',
      '区画番号',
      '正面文字',
      '建立者名',
      '初期パスワード',
      '備考',
    ];
    const sampleRows = [
      [
        '山田 太郎',
        '090-1234-5678',
        '790-0001',
        '愛媛県松山市一番町1-2-3 メゾン松山301',
        'client@example.com',
        '東区 5列 12番',
        '山田家先祖代々之墓',
        '昭和五十年八月 山田太郎建之',
        'client1234',
        '大楠の木の隣。水汲み場から徒歩1分。',
      ],
      [
        '田中 花子',
        '090-9876-5432',
        '790-0842',
        '愛媛県松山市道後湯之町5-12',
        'tanaka@example.com',
        '南区 2列 05番',
        '田中家之墓',
        '平成十年十月 田中一郎建之',
        'client1234',
        '高齢のため坂道の上り下りが困難。定期的にお参り希望。',
      ],
      [
        '佐藤 健一',
        '080-3333-5555',
        '150-0002',
        '東京都渋谷区渋谷2-21-1 渋谷ヒカリエ17F',
        'sato@example.com',
        '北区 8列 19番',
        '南無阿弥陀仏 佐藤家',
        '平成十五年春 佐藤健一建之',
        'client1234',
        '東京在住の遠方施主。春・秋彼岸とお盆に代行希望。',
      ],
    ];

    const csvContent =
      '\uFEFF' +
      [
        headers.join(','),
        ...sampleRows.map((row) =>
          row.map((val) => `"${(val || '').replace(/"/g, '""')}"`).join(',')
        ),
      ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ココロモウ_施主名簿CSV取込フォーマット見本_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // CSVファイル選択・パース
  const handleCsvFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const lines = text.split(/\r\n|\n|\r/).filter((l) => l.trim().length > 0);
      if (lines.length <= 1) {
        alert('CSVファイルにデータ行が含まれていません');
        return;
      }

      // カンマ区切り＆クォート対応パーサー
      const parseCsvLine = (line: string): string[] => {
        const result: string[] = [];
        let current = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
              current += '"';
              i++;
            } else {
              inQuotes = !inQuotes;
            }
          } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }
        result.push(current.trim());
        return result;
      };

      const parsed: CemeteryClient[] = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = parseCsvLine(lines[i]);
        if (cols.length < 2 || !cols[0]) continue;

        const name = cols[0] || '施主様';
        const phone = cols[1] || '';
        const postal = cols[2] || '';
        const address = cols[3] || '';
        const email = cols[4] || '';
        const plot = cols[5] || '';
        const front = cols[6] || '';
        const builder = cols[7] || '';
        const cleanPhone = phone.replace(/\D/g, '');
        const pass = cols[8] || (cleanPhone.length >= 4 ? cleanPhone.slice(-4) : 'client1234');
        const notes = cols[9] || '';

        parsed.push({
          id: `csv_${Date.now()}_${i}`,
          cemeteryCompanyId: companyId,
          name,
          phoneNumber: phone,
          postalCode: postal,
          address,
          email,
          sectionPlotNumber: plot,
          frontInscription: front,
          builderName: builder,
          initialPassword: pass,
          photoUrl: '/images/grave_front_example.jpg',
          builderPhotoUrl: '/images/grave_side_builder_example.jpg',
          notes,
          importedAt: new Date().toISOString(),
          orderCount: 0,
          lastOrderDate: '',
        });
      }

      setParsedPreviewClients(parsed);
    };
    reader.readAsText(file, 'utf-8');
  };

  // CSV一括インポート実行
  const handleExecuteImport = async () => {
    if (parsedPreviewClients.length === 0) return;
    setImportLoading(true);
    try {
      const res = await fetch('/api/cemetery/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId,
          clients: parsedPreviewClients,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'インポートに失敗しました');

      setImportSuccessMsg(
        `🎉 ${data.count}件の施主データをインポートしました！施主アカウント・お墓情報が自動生成されました。`
      );
      await loadClientsData(companyId);

      setTimeout(() => {
        setShowImportModal(false);
        setParsedPreviewClients([]);
        setCsvFileName('');
        setImportSuccessMsg(null);
      }, 1500);
    } catch (err: any) {
      alert(err.message || 'インポート処理中にエラーが発生しました');
    } finally {
      setImportLoading(false);
    }
  };

  // パーソナライズ案内DM印刷モーダルを開く
  const handleOpenDmModal = async (specificClients?: any[]) => {
    const list =
      specificClients ||
      (selectedClientEmails.length > 0
        ? clientsSummary.filter((c) => selectedClientEmails.includes(c.email))
        : clientsSummary);

    if (list.length === 0) {
      alert('印刷対象の施主様が登録されていません');
      return;
    }

    setTargetPrintClients(list);

    // QRコードの一括生成
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const newQrMap: Record<string, string> = {};

    for (const c of list) {
      const cleanPhone = (c.phoneNumber || c.phone || '').replace(/\D/g, '');
      const pass = c.initialPassword || (cleanPhone.length >= 4 ? cleanPhone.slice(-4) : 'client1234');
      const loginUrl = `${origin}/mypage/login?phone=${encodeURIComponent(
        c.phoneNumber || c.phone || ''
      )}&pass=${encodeURIComponent(pass)}&auto=true`;

      try {
        const qrData = await QRCode.toDataURL(loginUrl, {
          width: 180,
          margin: 1,
          color: { dark: '#064e3b', light: '#ffffff' },
        });
        newQrMap[c.id] = qrData;
      } catch (e) {
        console.warn('QR generation error for client:', c.id, e);
      }
    }

    setQrCodeUrls(newQrMap);
    setShowDmModal(true);
  };

  // 初期テンプレートの生成・同期
  useEffect(() => {
    const fallbackTemplates: EmailTemplate[] = [
      {
        id: 'tpl_autumn',
        title: '秋のお彼岸のご案内',
        subject: `【${currentCompany?.name || '霊園管理所'}】秋のお彼岸のご供養・お墓参り代行のご案内`,
        body: `いつも大変お世話になっております。${currentCompany?.name || '霊園管理所'}でございます。\n\n朝夕はめっきり涼しくなってまいりましたが、施主様におかれましてはいかがお過ごしでしょうか。\nさて、まもなく秋のお彼岸の時期を迎えます。\n\n遠方にお住まいでご来園が難しい方や、ご高齢によりお参り・草刈りがご負担となっている施主様に向けて、当霊園では公認パートナー業者による「お墓参り・墓所清掃・お供花代行サービス」を承っております。\n\n心を込めて綺麗にお掃除し、お花と線香をお供えして写真付きでご報告いたします。\nご希望の施主様は、ぜひお早めにお申し付け・ご相談ください。\n\n━━━━━━━━━━━━━━━━━━━━━\n${currentCompany?.name || '霊園管理所'}\n代表・管理者: ${currentCompany?.representativeName || ''}\n電話番号: ${currentCompany?.phoneNumber || ''}\n所在地: ${currentCompany?.locationAddress || ''}\n━━━━━━━━━━━━━━━━━━━━━`,
        category: 'seasonal',
        updatedAt: '2026-09-01T00:00:00Z',
      },
      {
        id: 'tpl_bon',
        title: 'お盆のご供養・お墓参り代行のご案内',
        subject: `【${currentCompany?.name || '霊園管理所'}】お盆のご供養・墓所清掃代行のご案内`,
        body: `いつも大変お世話になっております。${currentCompany?.name || '霊園管理所'}でございます。\n\n猛暑の候、皆様のご健勝をお祈り申し上げます。\nまもなくご先祖様をお迎えするお盆の季節を迎えます。\n\n真夏の炎天下でのお墓掃除や除草作業は、熱中症の危険もあり大きな重労働となります。\n当霊園の公認作業代行サービスでは、墓石水洗い・区画内の草抜き・お花や線香のお供えを丁寧に実施いたします。\n\n施主様に代わり、真心込めてお墓をお守りいたします。\n\n━━━━━━━━━━━━━━━━━━━━━\n${currentCompany?.name || '霊園管理所'}\n電話番号: ${currentCompany?.phoneNumber || ''}\n━━━━━━━━━━━━━━━━━━━━━`,
        category: 'seasonal',
        updatedAt: '2026-07-01T00:00:00Z',
      },
      {
        id: 'tpl_spring',
        title: '春のお彼岸のご案内',
        subject: `【${currentCompany?.name || '霊園管理所'}】春のお彼岸のご案内（お墓参り代行サービス）`,
        body: `いつもお世話になっております。${currentCompany?.name || '霊園管理所'}でございます。\n\n寒さの中にも春の兆しが感じられる季節となりました。\n春のお彼岸にあたり、ご先祖様への感謝を込めたお墓参り代行・点検清掃のご案内を申し上げます。\n\nご多忙やご健康上のご理由でお参りが叶わない施主様に代わり、心を込めてご供養・墓石清掃を実施いたします。\n\n━━━━━━━━━━━━━━━━━━━━━\n${currentCompany?.name || '霊園管理所'}\n電話番号: ${currentCompany?.phoneNumber || ''}\n━━━━━━━━━━━━━━━━━━━━━`,
        category: 'seasonal',
        updatedAt: '2026-03-01T00:00:00Z',
      },
      {
        id: 'tpl_check',
        title: '年末年始・定期点検のご案内',
        subject: `【${currentCompany?.name || '霊園管理所'}】年末年始の墓所清掃・定期確認のご案内`,
        body: `いつも大変お世話になっております。${currentCompany?.name || '霊園管理所'}でございます。\n\n今年も残すところあとわずかとなりました。\n清々しい新年をお迎えいただくため、年末のお墓掃除や墓石の点検作業を承っております。\n\n一年の締めくくりに、ご先祖様への感謝の気持ちをお届けいたします。\n\n━━━━━━━━━━━━━━━━━━━━━\n${currentCompany?.name || '霊園管理所'}\n電話番号: ${currentCompany?.phoneNumber || ''}\n━━━━━━━━━━━━━━━━━━━━━`,
        category: 'maintenance',
        updatedAt: '2026-09-01T00:00:00Z',
      },
    ];

    const tpls = currentCompany?.emailTemplates && currentCompany.emailTemplates.length > 0
      ? currentCompany.emailTemplates
      : fallbackTemplates;

    setActiveTemplates(tpls);
    if (tpls.length > 0) {
      setSelectedTemplateId(tpls[0].id);
      setEmailSubject(tpls[0].subject);
      setEmailBody(tpls[0].body);
    }
  }, [currentCompany?.id]);

  // 顧客名簿の初期選択（初回データ読み込み完了時に1回だけ全顧客を自動選択。以降の解除や手動チェックを上書きしない）
  useEffect(() => {
    if (!hasInitializedSelectionRef.current && clientsSummary.length > 0) {
      const allIds = clientsSummary.map((c) => c.id);
      setSelectedClientIds(allIds);
      const validEmails = clientsSummary
        .map((c) => c.email)
        .filter((email) => email && email.includes('@'));
      setSelectedClientEmails(validEmails);
      hasInitializedSelectionRef.current = true;
    }
  }, [clientsSummary.length]);

  // 施主名簿 全選択・全解除
  const handleToggleSelectAllClients = () => {
    if (selectedClientIds.length === clientsSummary.length) {
      setSelectedClientIds([]);
      setSelectedClientEmails([]);
    } else {
      const allIds = clientsSummary.map((c) => c.id);
      setSelectedClientIds(allIds);
      const validEmails = clientsSummary
        .map((c) => c.email)
        .filter((email) => email && email.includes('@'));
      setSelectedClientEmails(validEmails);
    }
  };

  // 個別チェック切り替え（ID基準で確実に動作）
  const handleToggleClientId = (clientId: string) => {
    if (!clientId) return;
    const client = clientsSummary.find((c) => c.id === clientId);
    setSelectedClientIds((prev) => {
      const isSelected = prev.includes(clientId);
      const next = isSelected ? prev.filter((id) => id !== clientId) : [...prev, clientId];
      
      // メール側も同期
      if (client?.email && client.email.includes('@')) {
        setSelectedClientEmails((prevEmails) =>
          isSelected ? prevEmails.filter((e) => e !== client.email) : [...prevEmails, client.email]
        );
      }
      return next;
    });
  };

  // 施主お墓情報・写真の編集モーダルを開く（正面・側面写真対応）
  const handleOpenEditClient = (client: any) => {
    setEditingClient(client as CemeteryClient);
    setEditGraveForm({
      photoUrl: client.photoUrl || '/images/grave_front_example.jpg',
      builderPhotoUrl: client.builderPhotoUrl || '/images/grave_side_builder_example.jpg',
      sectionPlotNumber: client.sectionPlotNumber || '',
      frontInscription: client.frontInscription || '',
      builderName: client.builderName || '',
      phoneNumber: client.phoneNumber || client.phone || '',
      email: client.email || '',
    });
  };

  // 施主お墓情報・写真の保存
  const handleSaveGraveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient) return;
    setIsSavingGraveInfo(true);

    try {
      const updatedClient: CemeteryClient = {
        ...editingClient,
        cemeteryCompanyId: editingClient.cemeteryCompanyId || companyId || currentCompany?.id || 'cem_comp_default',
        importedAt: editingClient.importedAt || new Date().toISOString(),
        photoUrl: editGraveForm.photoUrl,
        builderPhotoUrl: editGraveForm.builderPhotoUrl,
        sectionPlotNumber: editGraveForm.sectionPlotNumber,
        frontInscription: editGraveForm.frontInscription,
        builderName: editGraveForm.builderName,
        phoneNumber: editGraveForm.phoneNumber,
        email: editGraveForm.email,
        updatedAt: new Date().toISOString(),
      };

      // サーバーAPIへ保存
      const res = await fetch('/api/cemetery/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId,
          clients: [updatedClient],
          mode: 'merge',
        }),
      });

      if (!res.ok) throw new Error('施主情報の更新に失敗しました');

      // ステート反映
      setImportedClients((prev) => {
        const found = prev.some((c) => c.id === updatedClient.id);
        if (found) {
          return prev.map((c) => (c.id === updatedClient.id ? updatedClient : c));
        } else {
          return [...prev, updatedClient];
        }
      });

      setEditingClient(null);
      alert(`${updatedClient.name} 様のお墓情報を更新・保存しました！`);
    } catch (err: any) {
      alert('エラー: ' + err.message);
    } finally {
      setIsSavingGraveInfo(false);
    }
  };

  // テンプレート切り替え
  const handleSelectTemplate = (tplId: string) => {
    setSelectedTemplateId(tplId);
    const found = activeTemplates.find((t) => t.id === tplId);
    if (found) {
      setEmailSubject(found.subject);
      setEmailBody(found.body);
    }
  };

  // テンプレートの上書き保存
  const handleSaveEmailTemplate = async () => {
    if (!currentCompany || !selectedTemplateId) return;
    setIsSavingTemplateLoading(true);
    try {
      const updatedTpls = activeTemplates.map((t) =>
        t.id === selectedTemplateId
          ? { ...t, subject: emailSubject, body: emailBody, updatedAt: new Date().toISOString() }
          : t
      );
      const updatedCompany: CemeteryCompany = {
        ...currentCompany,
        emailTemplates: updatedTpls,
      };

      const res = await fetch('/api/cemetery-companies', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCompany),
      });

      if (!res.ok) throw new Error('メールテンプレートの保存に失敗しました');

      setCompanies((prev) =>
        prev.map((c) => (c.id === updatedCompany.id ? updatedCompany : c))
      );
      setActiveTemplates(updatedTpls);
      const currentTitle = activeTemplates.find((t) => t.id === selectedTemplateId)?.title || 'テンプレート';
      setSaveSuccessMsg(`メールテンプレート「${currentTitle}」の変更を保存しました！`);
      setTimeout(() => setSaveSuccessMsg(null), 4000);
    } catch (e: any) {
      alert(e.message || '保存エラーが発生しました');
    } finally {
      setIsSavingTemplateLoading(false);
    }
  };

  // 新規テンプレート追加
  const handleCreateNewEmailTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTemplateTitleInput.trim() || !currentCompany) return;
    setIsSavingTemplateLoading(true);
    try {
      const newTpl: EmailTemplate = {
        id: `tpl_${Date.now()}`,
        title: newTemplateTitleInput.trim(),
        subject: emailSubject || `【${currentCompany.name}】次回お墓参り・ご供養のご案内`,
        body: emailBody || '',
        category: 'other',
        updatedAt: new Date().toISOString(),
      };
      const updatedTpls = [...activeTemplates, newTpl];
      const updatedCompany: CemeteryCompany = {
        ...currentCompany,
        emailTemplates: updatedTpls,
      };

      const res = await fetch('/api/cemetery-companies', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCompany),
      });

      if (!res.ok) throw new Error('テンプレートの追加に失敗しました');

      setCompanies((prev) =>
        prev.map((c) => (c.id === updatedCompany.id ? updatedCompany : c))
      );
      setActiveTemplates(updatedTpls);
      setSelectedTemplateId(newTpl.id);
      setIsAddingTemplateModal(false);
      setNewTemplateTitleInput('');
      setSaveSuccessMsg(`新しいメールテンプレート「${newTpl.title}」を登録しました！`);
      setTimeout(() => setSaveSuccessMsg(null), 4000);
    } catch (e: any) {
      alert(e.message || '追加エラーが発生しました');
    } finally {
      setIsSavingTemplateLoading(false);
    }
  };

  // メーラー起動（BCC一括セット）
  const handleLaunchMailer = () => {
    if (selectedClientEmails.length === 0) {
      alert('送信先の施主様が選択されていません。顧客一覧のチェックボックスを選択してください。');
      return;
    }
    const bcc = selectedClientEmails.join(',');
    const mailtoUrl = `mailto:?bcc=${encodeURIComponent(bcc)}&subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailtoUrl;
  };

  // BCC宛先コピー
  const handleCopyBcc = () => {
    if (selectedClientEmails.length === 0) {
      alert('送信先の施主様が選択されていません。');
      return;
    }
    navigator.clipboard.writeText(selectedClientEmails.join(', '));
    setCopyFeedback(`📋 BCC宛先（${selectedClientEmails.length}件）をコピーしました！メールソフトの「BCC」欄に貼り付けてください。`);
    setTimeout(() => setCopyFeedback(null), 4000);
  };

  // 件名・本文コピー
  const handleCopyBody = () => {
    const text = `【件名】\n${emailSubject}\n\n【本文】\n${emailBody}`;
    navigator.clipboard.writeText(text);
    setCopyFeedback('📋 メールの件名と本文をコピーしました！メールソフトに貼り付けてください。');
    setTimeout(() => setCopyFeedback(null), 4000);
  };

  // 会社情報編集を開く
  const handleOpenEdit = () => {
    setEditFormData({
      name: currentCompany.name,
      representativeName: currentCompany.representativeName,
      phoneNumber: currentCompany.phoneNumber,
      email: currentCompany.email,
      locationAddress: currentCompany.locationAddress,
      description: currentCompany.description,
      cemeteryNames: [...currentCompany.cemeteryNames],
    });
    setIsEditingCompany(true);
  };

  // 会社情報保存
  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updated = {
        ...currentCompany,
        ...editFormData,
      };

      const res = await fetch('/api/cemetery-companies', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });

      if (res.ok) {
        setCompanies((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
        setIsEditingCompany(false);
        setSaveSuccessMsg('管理会社情報を更新・保存しました！');
        setTimeout(() => setSaveSuccessMsg(null), 4000);
      } else {
        alert('保存に失敗しました');
      }
    } catch (err) {
      alert('エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  // ログアウト
  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/cemetery/login');
  };

  // 契約書ファイル選択ハンドラー（PDFまたは画像）
  const handleContractFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ファイルサイズチェック (最大 12MB)
    if (file.size > 12 * 1024 * 1024) {
      alert('ファイルサイズが大きすぎます（12MB以下にしてください）');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setContractUploadFile({
        dataUrl: event.target?.result as string,
        fileName: file.name,
        fileType: file.type || 'application/pdf',
      });
    };
    reader.readAsDataURL(file);
  };

  // 契約書を保存（Firestoreへ永続化）
  const handleSaveContract = async () => {
    if (!uploadTargetVendor || !contractUploadFile || !currentCompany) return;
    setIsUploadingContract(true);

    try {
      const updatedContracts: Record<string, VendorContract> = {
        ...(currentCompany.vendorContracts || {}),
        [uploadTargetVendor.id]: {
          vendorId: uploadTargetVendor.id,
          vendorName: uploadTargetVendor.displayName,
          contractFileUrl: contractUploadFile.dataUrl,
          contractFileName: contractUploadFile.fileName,
          uploadedAt: new Date().toISOString(),
          status: 'signed',
          notes: contractUploadNotes,
        },
      };

      const updatedCompany: CemeteryCompany = {
        ...currentCompany,
        vendorContracts: updatedContracts,
      };

      const res = await fetch('/api/cemetery-companies', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCompany),
      });

      if (!res.ok) throw new Error('契約書の保存に失敗しました');

      // ステート更新
      setCompanies((prev) =>
        prev.map((c) => (c.id === updatedCompany.id ? updatedCompany : c))
      );
      setSaveSuccessMsg(`「${uploadTargetVendor.displayName}」の締結済み契約書を添付・保存しました！`);
      setUploadTargetVendor(null);
      setContractUploadFile(null);
      setContractUploadNotes('');
      setTimeout(() => setSaveSuccessMsg(null), 4000);
    } catch (e: any) {
      alert(e.message || '保存エラーが発生しました');
    } finally {
      setIsUploadingContract(false);
    }
  };

  // 契約書を削除
  const handleDeleteContract = async (vendorId: string, vendorName: string) => {
    if (!currentCompany) return;
    if (!confirm(`「${vendorName}」の添付契約書を削除してもよろしいですか？\n（未提出・未締結状態に戻ります）`)) {
      return;
    }

    try {
      const updatedContracts = { ...(currentCompany.vendorContracts || {}) };
      delete updatedContracts[vendorId];

      const updatedCompany: CemeteryCompany = {
        ...currentCompany,
        vendorContracts: updatedContracts,
      };

      const res = await fetch('/api/cemetery-companies', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCompany),
      });

      if (!res.ok) throw new Error('契約書の削除に失敗しました');

      setCompanies((prev) =>
        prev.map((c) => (c.id === updatedCompany.id ? updatedCompany : c))
      );
      setSaveSuccessMsg(`「${vendorName}」の契約書を削除しました。`);
      setTimeout(() => setSaveSuccessMsg(null), 4000);
    } catch (e: any) {
      alert(e.message || '削除エラーが発生しました');
    }
  };

  // 契約書印刷（window.print）
  const handlePrintContract = () => {
    window.print();
  };

  // 契約書HTMLファイルダウンロード
  const handleDownloadContractHtml = (vendor?: User | null) => {
    const vName = vendor?.displayName || '＿＿＿＿＿＿＿＿＿＿＿＿＿＿';
    const vRep = vendor?.vendorProfile?.representativeName || '＿＿＿＿＿＿＿＿';
    const vPhone = vendor?.phoneNumber || '＿＿＿＿＿＿＿＿';
    const vAddress = vendor?.vendorProfile?.serviceAreas?.join('、') || '＿＿＿＿＿＿＿＿＿＿＿＿＿＿';

    const cName = currentCompany?.name || '霊園管理事務所';
    const cRep = currentCompany?.representativeName || '霊園管理長';
    const cPhone = currentCompany?.phoneNumber || '＿＿＿＿＿＿＿＿';
    const cAddress = currentCompany?.locationAddress || '＿＿＿＿＿＿＿＿';
    const cemes = currentCompany?.cemeteryNames?.join('、') || '管轄霊園';

    const todayStr = new Date().toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const html = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<title>墓地内作業代行業務 基本契約書 兼 遵守誓約書</title>
<style>
  body { font-family: "Hiragino Mincho ProN", "Yu Mincho", serif; line-height: 1.7; padding: 40px; max-width: 800px; margin: 0 auto; color: #111; }
  h1 { text-align: center; font-size: 22px; margin-bottom: 24px; border-bottom: 2px solid #333; padding-bottom: 8px; }
  h2 { font-size: 14px; margin-top: 20px; margin-bottom: 6px; }
  p, li { font-size: 13px; text-align: justify; }
  ol { padding-left: 20px; }
  .preamble { margin-bottom: 20px; }
  .signatures { margin-top: 40px; border-top: 1px solid #666; padding-top: 20px; }
  .sig-block { display: flex; justify-content: space-between; margin-top: 20px; }
  .sig-col { width: 48%; border: 1px solid #ccc; padding: 15px; border-radius: 6px; }
  .seal-box { border: 1px dashed #999; width: 60px; height: 60px; display: inline-block; text-align: center; line-height: 60px; font-size: 11px; float: right; color: #888; }
</style>
</head>
<body>
<h1>墓地内作業代行業務 基本契約書 兼 遵守誓約書</h1>
<p class="preamble">
  <strong>${cName}</strong>（以下「甲」という）と、作業代行業者 <strong>${vName}</strong>（以下「乙」という）は、甲が管理する霊園・墓地（${cemes}）内において、墓地使用者等から委託を受けたお墓参り・墓所清掃・除草等の作業代行業務を実施するにあたり、以下の通り契約を締結し、乙はこれを厳格に遵守することを誓約する。
</p>

<h2>第1条（目的及び作業の認可）</h2>
<p>甲は、乙が本契約に定める各条項および甲の定める霊園管理規則を遵守することを条件として、甲の管轄する霊園内への出入りおよび墓所作業の実施を認可する。</p>

<h2>第2条（霊園管理規則および作業規律の遵守）</h2>
<ol>
  <li>乙は、作業の実施にあたり、甲の管理規約、指定された作業可能時間帯、車両乗り入れ規則を遵守しなければならない。</li>
  <li>作業に伴い発生した雑草・落葉・ゴミ・古花等は、霊園内のゴミ集積所や水場に放置せず、乙の責任においてすべて場外へ持ち帰り適正に処分すること。</li>
  <li>水汲み場、通路等の共有設備を清潔に使用し、一般の墓参者の通行や参拝を妨げないこと。</li>
</ol>

<h2>第3条（善管注意義務及び損害賠償責任【極めて重要】）</h2>
<ol>
  <li>乙は、善良なる管理者の注意をもって作業を行わなければならない。</li>
  <li>乙が作業中または作業に関連して、対象墓石の欠損・破損・文字彫刻の剥離、または隣接・周辺の墓石・外柵・卒塔婆・共有施設に破損・汚損を生じさせた場合、<strong>乙が自己の費用と責任において直ちに原状回復を行い、甲および被害者に対する損害の一切を賠償するものとする。</strong></li>
</ol>

<h2>第4条（損害保険への加入確認）</h2>
<p>乙は、前条に定める賠償責任を担保するため、業務活動に伴う施設賠償責任保険等に加入し、有効な保険期間を維持すること。</p>

<h2>第5条（直接取引・中抜き行為の禁止）</h2>
<p>乙は、本業務を通じて知り得た施主または霊園関係者に対し、甲および正規プラットフォームを経由しない直接取引の勧誘や営業を行ってはならない。</p>

<h2>第6条（作業完了報告及び写真提出の義務）</h2>
<p>乙は、作業の適正性を証するため、作業前および作業後の状況写真を正確に記録し、甲および施主に対して指定の報告書を提出しなければならない。</p>

<h2>第7条（契約解除及び出入り禁止処分）</h2>
<p>乙が本契約に違反した場合、または霊園の秩序を著しく乱す行為があった場合、甲は何らの催告を要せず直ちに乙に対する出入り認可を取り消し、霊園内への立ち入りを禁止することができる。</p>

<div class="signatures">
  <p>本契約締結の証として本書2通を作成し、甲乙記名押印の上、各自1通を保有する。</p>
  <p style="text-align: right; margin-top: 15px;">契約締結日：${todayStr}</p>
  <div class="sig-block">
    <div class="sig-col">
      <div class="seal-box">甲印</div>
      <strong>【甲：霊園管理会社】</strong><br>
      所在地：${cAddress}<br>
      名　称：${cName}<br>
      代表者：${cRep}　　印<br>
      電　話：${cPhone}
    </div>
    <div class="sig-col">
      <div class="seal-box">乙印</div>
      <strong>【乙：作業代行業者】</strong><br>
      所在地：${vAddress}<br>
      屋号・商号：${vName}<br>
      代表者：${vRep}　　印<br>
      電　話：${vPhone}
    </div>
  </div>
</div>
</body>
</html>`;

    const fileName = `墓地作業代行基本契約書_${vendor?.displayName || '雛形'}_${new Date().toISOString().slice(0, 10)}.html`;
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // テンプレートPDFファイル選択ハンドラー
  const handleTemplateFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      alert('ファイルサイズが大きすぎます（20MB以下にしてください）');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setTemplateUploadFile({
        dataUrl: event.target?.result as string,
        fileName: file.name,
        fileType: file.type || 'application/pdf',
      });
    };
    reader.readAsDataURL(file);
  };

  // テンプレートPDFを自社の公式雛形として保存
  const handleSaveTemplatePdf = async () => {
    if (!templateUploadFile || !currentCompany) return;
    setIsSavingTemplate(true);

    try {
      const updatedCompany: CemeteryCompany = {
        ...currentCompany,
        contractTemplateUrl: templateUploadFile.dataUrl,
        contractTemplateFileName: templateUploadFile.fileName,
        contractTemplateUpdatedAt: new Date().toISOString(),
      };

      const res = await fetch('/api/cemetery-companies', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCompany),
      });

      if (!res.ok) throw new Error('テンプレートPDFの保存に失敗しました');

      setCompanies((prev) =>
        prev.map((c) => (c.id === updatedCompany.id ? updatedCompany : c))
      );
      setSaveSuccessMsg(`「${templateUploadFile.fileName}」を自社公式契約書テンプレートとして登録・保管しました！`);
      setIsUploadingTemplate(false);
      setTemplateUploadFile(null);
      setTimeout(() => setSaveSuccessMsg(null), 4000);
    } catch (e: any) {
      alert(e.message || '保存エラーが発生しました');
    } finally {
      setIsSavingTemplate(false);
    }
  };

  // テンプレートPDFのダウンロード処理
  const handleDownloadTemplatePdf = (vendor?: User | null) => {
    if (currentCompany?.contractTemplateUrl) {
      const link = document.createElement('a');
      link.href = currentCompany.contractTemplateUrl;
      link.download = currentCompany.contractTemplateFileName || '墓地内作業代行基本契約書_テンプレート.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // テンプレート未登録時はHTML文書をダウンロード
      handleDownloadContractHtml(vendor);
    }
  };

  return (
    <div 
      style={{
        zoom: fontSize === 'standard' ? 1 : fontSize === 'large' ? 1.12 : 1.25,
      }}
      className="min-h-screen bg-stone-100 text-slate-900 pb-24 transition-all duration-150"
    >
      {/* ⚠️ 本部管理者から来た場合のみ表示する戻りバー */}
      {fromSource === 'admin' && (
        <aside aria-label="管理者プレビュー案内" className="bg-amber-500 text-slate-950 font-bold px-6 py-3 shadow-md flex items-center justify-between">
          <div className="flex items-center gap-3 text-lg">
            <span className="text-2xl">⚠️</span>
            <span>【本部管理者プレビュー】現在、本部権限で墓地管理会社の画面を表示しています</span>
          </div>
          <a
            href="/admin"
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-base rounded-xl font-bold transition shadow"
          >
            ← 本部統括画面に戻る
          </a>
        </aside>
      )}

      {/* ヘッダー */}
      <header className="bg-stone-800 text-white shadow-lg sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 bg-amber-400 text-stone-950 text-xs font-black rounded-lg shadow-2xs whitespace-nowrap">
                霊園・墓地管理所 専用画面
              </span>
              {/* 文字サイズ切り替えボタングループ */}
              <div className="flex items-center bg-stone-900/90 rounded-lg p-0.5 border border-stone-700 text-xs">
                <span className="text-stone-400 px-2 font-bold whitespace-nowrap">文字サイズ:</span>
                <button
                  type="button"
                  onClick={() => handleSetFontSize('standard')}
                  className={`px-2.5 py-0.5 rounded font-bold transition cursor-pointer ${
                    fontSize === 'standard' ? 'bg-amber-400 text-stone-950 shadow-xs' : 'text-stone-300 hover:text-white'
                  }`}
                >
                  標準
                </button>
                <button
                  type="button"
                  onClick={() => handleSetFontSize('large')}
                  className={`px-2.5 py-0.5 rounded font-bold transition cursor-pointer ${
                    fontSize === 'large' ? 'bg-amber-400 text-stone-950 shadow-xs' : 'text-stone-300 hover:text-white'
                  }`}
                >
                  大
                </button>
                <button
                  type="button"
                  onClick={() => handleSetFontSize('xlarge')}
                  className={`px-2.5 py-0.5 rounded font-bold transition cursor-pointer ${
                    fontSize === 'xlarge' ? 'bg-amber-400 text-stone-950 shadow-xs' : 'text-stone-300 hover:text-white'
                  }`}
                >
                  特大
                </button>
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white mt-1">
              {currentCompany?.name}
            </h1>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* トップページへ戻るリンク */}
            <a
              href="/"
              className="px-4 py-2.5 bg-stone-700 hover:bg-stone-600 text-white text-base font-bold rounded-xl border border-stone-500 transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span>🏠</span> トップへ
            </a>

            {/* 操作説明書リンク */}
            <Link
              href="/cemetery/manual"
              target="_blank"
              className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white text-base font-bold rounded-xl border border-emerald-500 transition flex items-center gap-1.5 shadow-sm"
            >
              <span>📖</span> 操作説明書
            </Link>

            {/* 本部からのプレビューでない場合は、ログアウトボタンを表示 */}
            {fromSource !== 'admin' && (
              <button
                onClick={handleLogout}
                className="px-5 py-2.5 bg-stone-700 hover:bg-stone-600 text-white text-base font-bold rounded-xl border border-stone-500 transition cursor-pointer"
              >
                ログアウト
              </button>
            )}

            {/* 管理会社切り替え（テスト・デモ用） */}
            <div className="flex items-center gap-2 bg-stone-900/80 px-3 py-1.5 rounded-xl border border-stone-700">
              <label htmlFor="cemetery-select" className="text-sm text-stone-300 font-bold whitespace-nowrap">霊園切替:</label>
              <select
                id="cemetery-select"
                value={companyId}
                onChange={(e) => {
                  setCompanyId(e.target.value);
                  router.push(`/cemetery?companyId=${e.target.value}${fromSource ? `&from=${fromSource}` : ''}`);
                }}
                aria-label="管理会社・霊園の切り替え"
                className="bg-stone-800 text-white text-base font-bold px-3 py-1.5 rounded-lg border border-stone-600 outline-none"
              >
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* 成功通知メッセージ */}
      {saveSuccessMsg && (
        <div className="max-w-6xl mx-auto px-4 mt-6">
          <div className="p-4 bg-emerald-100 border-2 border-emerald-500 text-emerald-900 text-xl font-bold rounded-2xl shadow">
            ✅ {saveSuccessMsg}
          </div>
        </div>
      )}

      {/* メインコンテンツ */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* 1. 管理会社・霊園の基本情報＆編集ボタン */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border-2 border-stone-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-stone-200">
            <div>
              <span className="text-base font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
                登録情報
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-2">
                {currentCompany?.name}
              </h2>
            </div>
            <button
              onClick={handleOpenEdit}
              className="px-6 py-3.5 bg-amber-600 hover:bg-amber-700 text-white text-xl font-bold rounded-2xl shadow-md transition active:scale-95 flex items-center justify-center gap-2"
            >
              <span>✏️</span> この情報を変更する（編集）
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 text-lg">
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
              <span className="block text-stone-500 text-base font-bold">代表・管理責任者</span>
              <span className="font-extrabold text-stone-900 text-xl">{currentCompany?.representativeName}</span>
            </div>
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
              <span className="block text-stone-500 text-base font-bold">お電話番号</span>
              <a href={`tel:${currentCompany?.phoneNumber}`} className="font-extrabold text-amber-800 hover:underline text-2xl">
                📞 {currentCompany?.phoneNumber}
              </a>
            </div>
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
              <span className="block text-stone-500 text-base font-bold">メールアドレス</span>
              <span className="font-bold text-stone-900 text-lg">{currentCompany?.email}</span>
            </div>
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
              <span className="block text-stone-500 text-base font-bold">所在地</span>
              <span className="font-bold text-stone-900 text-lg">{currentCompany?.locationAddress}</span>
            </div>
            <div className="md:col-span-2 bg-stone-50 p-4 rounded-2xl border border-stone-200">
              <span className="block text-stone-500 text-base font-bold mb-2">管轄している霊園・墓所</span>
              <div className="flex flex-wrap gap-2">
                {currentCompany?.cemeteryNames?.map((cemName, idx) => (
                  <span key={idx} className="bg-stone-200 text-stone-900 px-4 py-2 rounded-xl text-lg font-bold">
                    🏛️ {cemName}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 2. 提携している作業代行業者一覧 */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border-2 border-stone-200">
          <div className="mb-6 pb-6 border-b-2 border-stone-200 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
            <div>
              <span className="text-base font-bold text-blue-800 bg-blue-100 px-3 py-1 rounded-full">
                現場の職人・パートナー
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-2">
                提携作業代行業者（{affiliatedVendors.length}社）
              </h2>
              <p className="text-stone-600 text-base font-medium mt-1">
                当霊園での作業が認定されているパートナー業者です
              </p>
            </div>
            <div className="xl:ml-auto flex items-center justify-end gap-2.5 flex-nowrap overflow-x-auto max-w-full pb-1 xl:pb-0 shrink-0">
              <button
                type="button"
                onClick={() => handleDownloadTemplatePdf(null)}
                className="px-3.5 py-2.5 bg-stone-800 hover:bg-stone-900 active:scale-95 text-white text-sm sm:text-base font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer"
              >
                <span>📥</span> 契約書PDFテンプレートをDL
              </button>
              <button
                type="button"
                onClick={() => setIsAddingNewVendor(true)}
                className="px-3.5 py-2.5 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white text-sm sm:text-base font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer"
              >
                <span>➕</span> 新規代行業者・便利屋さんを追加
              </button>
              <button
                type="button"
                onClick={handleOpenVendorEdit}
                className="px-3.5 py-2.5 bg-blue-700 hover:bg-blue-800 active:scale-95 text-white text-sm sm:text-base font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer"
              >
                <span>🤝</span> 提携の追加・解除（{affiliatedVendors.length}社）
              </button>
            </div>
          </div>

          {/* 📄 自社公式 契約書テンプレート（PDF原本）の管理・保管バー */}
          <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-amber-50/80 border-2 border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold bg-amber-200 text-amber-950 px-2.5 py-0.5 rounded-full">
                  自社公式 契約書テンプレート（PDF原本保管）
                </span>
                {currentCompany.contractTemplateUrl ? (
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                    登録済み ✓
                  </span>
                ) : (
                  <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                    標準雛形適用中
                  </span>
                )}
              </div>
              <h3 className="text-lg font-extrabold text-stone-900">
                {currentCompany.contractTemplateFileName || '自社契約書テンプレートPDF（未登録）'}
              </h3>
              <p className="text-xs text-stone-600">
                {currentCompany.contractTemplateUrl
                  ? '各社独自の実際の契約書PDFが保管されています。代行業者に手渡す際はここからダウンロードして印刷できます。'
                  : '寺院・霊園で普段お使いの実際の契約書・誓約書（PDF）をアップロードして保管・配布できます。'}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleDownloadTemplatePdf(null)}
                className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm rounded-xl flex items-center gap-1.5 shadow-sm transition cursor-pointer"
              >
                <span>📥</span> PDFをダウンロード
              </button>
              <button
                type="button"
                onClick={() => {
                  setTemplateUploadFile(null);
                  setIsUploadingTemplate(true);
                }}
                className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm rounded-xl flex items-center gap-1.5 shadow-sm transition cursor-pointer"
              >
                <span>📤</span> {currentCompany.contractTemplateUrl ? '差替・更新' : 'PDFを登録'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {affiliatedVendors.map((vendor) => {
              const contract = currentCompany?.vendorContracts?.[vendor.id];
              const hasContract = Boolean(contract && contract.contractFileUrl);

              return (
                <div
                  key={vendor.id}
                  className="bg-stone-50 border-2 border-stone-300 hover:border-blue-500 rounded-3xl p-6 shadow-sm transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900">
                        {vendor.displayName}
                      </h3>
                      <span className="bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded-full whitespace-nowrap">
                        ★ 認定パートナー
                      </span>
                    </div>
                    <p className="text-base text-stone-600 font-bold mb-3">
                      代表・責任者: <span className="text-stone-900">{vendor.vendorProfile?.representativeName}</span>
                    </p>
                    <p className="text-base text-stone-700 mb-4 line-clamp-2">
                      {vendor.vendorProfile?.description}
                    </p>
                    <div className="text-base text-stone-600 space-y-1 mb-4 bg-white p-3 rounded-xl border border-stone-200">
                      <div>📞 連絡先: <strong className="text-stone-900">{vendor.phoneNumber}</strong></div>
                      <div>📍 対応エリア: {vendor.vendorProfile?.serviceAreas?.join(', ')}</div>
                      <div>⭐ 実績評価: <strong className="text-amber-700">{vendor.vendorProfile?.rating}点</strong>（施工件数: {vendor.vendorProfile?.completedJobsCount}件）</div>
                    </div>

                    {/* 契約書・誓約書 締結状況エリア */}
                    <div className="mt-4 pt-4 border-t-2 border-stone-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-base font-bold text-stone-800 flex items-center gap-1.5">
                          <span>📋</span> 墓地内作業契約書・誓約書
                        </span>
                        {hasContract ? (
                          <span className="text-sm font-extrabold bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full border border-emerald-300 flex items-center gap-1 shadow-xs">
                            <span>✅</span> 締結済み
                          </span>
                        ) : (
                          <span className="text-sm font-bold bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-300 flex items-center gap-1">
                            <span>⚠️</span> 未提出（未締結）
                          </span>
                        )}
                      </div>

                      {hasContract ? (
                        <div className="bg-emerald-50/90 border border-emerald-300 rounded-2xl p-4 text-sm text-stone-800 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-emerald-950 truncate max-w-[220px]" title={contract?.contractFileName}>
                              📎 {contract?.contractFileName || '締結済み契約書'}
                            </span>
                            <span className="text-stone-500 text-xs">
                              {contract?.uploadedAt ? new Date(contract.uploadedAt).toLocaleDateString('ja-JP') : ''} 添付
                            </span>
                          </div>
                          {contract?.notes && (
                            <p className="text-xs text-stone-700 bg-white/90 p-2 rounded-xl border border-stone-200">
                              📝 {contract.notes}
                            </p>
                          )}
                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => setViewingContract({ vendorName: vendor.displayName, contract: contract! })}
                              className="flex-1 py-2.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-1.5 cursor-pointer transition shadow-xs"
                            >
                              <span>👁️</span> 契約書を表示・確認
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setUploadTargetVendor(vendor);
                                setContractUploadFile(null);
                                setContractUploadNotes(contract?.notes || '');
                              }}
                              className="py-2.5 px-3 bg-white hover:bg-stone-100 border border-stone-300 text-stone-800 font-bold rounded-xl text-sm cursor-pointer transition"
                              title="別のファイルで差し替える"
                            >
                              🔄 差替
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteContract(vendor.id, vendor.displayName)}
                              className="py-2.5 px-3 bg-white hover:bg-rose-50 border border-rose-200 text-rose-600 font-bold rounded-xl text-sm cursor-pointer transition"
                              title="契約書を削除する"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-amber-50/90 border border-amber-300 rounded-2xl p-4 text-sm text-stone-800 space-y-3">
                          <p className="text-stone-700 text-xs leading-relaxed">
                            ※墓石破損時の賠償責任や霊園管理規則を担保するため、契約書を交わして添付してください。
                          </p>
                          <div className="flex flex-wrap items-center gap-2 pt-0.5">
                            <button
                              type="button"
                              onClick={() => {
                                setUploadTargetVendor(vendor);
                                setContractUploadFile(null);
                                setContractUploadNotes('');
                              }}
                              className="flex-1 py-2.5 px-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-1.5 cursor-pointer transition shadow-sm"
                            >
                              <span>📎</span> 記入・捺印済み契約書を添付する
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (currentCompany.contractTemplateUrl) {
                                  handleDownloadTemplatePdf(vendor);
                                } else {
                                  setContractPrintTargetVendor(vendor);
                                  setShowContractTemplateModal(true);
                                }
                              }}
                              className="py-2.5 px-3 bg-white hover:bg-stone-100 border border-stone-300 text-stone-800 font-bold rounded-xl text-sm flex items-center justify-center gap-1 cursor-pointer transition"
                              title="この業者に渡す契約書をダウンロード・印刷"
                            >
                              <span>📄</span> 雛形DL
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 作業代行業者の画面を見に行くボタン（from=cemetery を付与） */}
                  <Link
                    href={`/vendor?vendorId=${vendor.id}&from=cemetery&companyId=${currentCompany.id}`}
                    className="mt-4 w-full py-3.5 px-4 bg-blue-700 hover:bg-blue-800 text-white text-lg font-bold rounded-2xl text-center shadow-md transition flex items-center justify-center gap-2"
                  >
                    <span>👁️</span> この代行業者の画面を確認する
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* 3. 管轄霊園のお申込み・作業進捗一覧 */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border-2 border-stone-200">
          <div className="mb-6">
            <span className="text-base font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              ご依頼案件の進捗
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-2">
              当霊園での作業・ご供養の状況（{companyOrders.length}件）
            </h2>
            <p className="text-stone-600 text-base font-medium mt-1">
              施主様からお申込みがあったお墓参り・清掃代行の最新状況です
            </p>
          </div>

          <div className="space-y-6">
            {companyOrders.map((order) => {
              const statusBadge =
                order.status === 'completed'
                  ? { label: '作業完了（報告済み）', bg: 'bg-emerald-600' }
                  : order.status === 'in_progress'
                  ? { label: '現地作業中', bg: 'bg-blue-600' }
                  : order.status === 'paid'
                  ? { label: '作業予定（準備中）', bg: 'bg-amber-600' }
                  : { label: '確認中', bg: 'bg-stone-500' };

              return (
                <div
                  key={order.id}
                  className="bg-stone-50 border-2 border-stone-300 rounded-3xl p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className={`text-white text-base font-bold px-4 py-1.5 rounded-full ${statusBadge.bg}`}>
                        {statusBadge.label}
                      </span>
                      <span className="text-stone-500 text-base font-bold">
                        注文番号: {order.orderNumber}
                      </span>
                    </div>

                    <div className="text-xl sm:text-2xl font-extrabold text-stone-900">
                      正面文字:「{order.graveInfo.frontInscription}」様墓
                      <span className="text-base font-normal text-stone-600 ml-3">
                        （建立者: {order.graveInfo.builderName}）
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-base text-stone-700 bg-white p-4 rounded-2xl border border-stone-200">
                      <div>
                        <span className="block text-stone-500 font-bold">区画・墓所番号</span>
                        <span className="font-extrabold text-stone-900 text-lg">{order.graveInfo.sectionPlotNumber}</span>
                      </div>
                      <div>
                        <span className="block text-stone-500 font-bold">お申込プラン</span>
                        <span className="font-extrabold text-stone-900 text-lg">{order.servicePlanName}</span>
                      </div>
                      <div>
                        <span className="block text-stone-500 font-bold">担当代行業者</span>
                        <span className="font-extrabold text-blue-900 text-lg">👷 {order.vendorName}</span>
                      </div>
                    </div>

                    {order.graveInfo.specialRequests && (
                      <div className="text-base bg-amber-50 p-3 rounded-xl border border-amber-200 text-amber-900">
                        <strong>施主様からのご要望:</strong> {order.graveInfo.specialRequests}
                      </div>
                    )}
                  </div>

                  {/* 担当代行業者の画面へ飛ぶボタン */}
                  <div className="lg:w-60 flex flex-col gap-2">
                    <Link
                      href={`/vendor/reports/${order.id}`}
                      className="w-full py-3.5 px-4 bg-stone-800 hover:bg-stone-900 text-white text-base font-bold rounded-2xl text-center shadow transition"
                    >
                      担当業者の作業レポートを見る →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. 施主様（顧客）名簿 ＆ 次回お参り・点検ご案内メール作成 */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border-2 border-stone-200">
          <div className="mb-6 pb-6 border-b-2 border-stone-200 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
            <div>
              <span className="text-base font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
                顧客台帳 ＆ 最強オンボーディングDM発行
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-2">
                施主様名簿 ＆ 案内DM・メール一括配信（{clientsSummary.length}名登録中）
              </h2>
              <p className="text-stone-600 text-base font-medium mt-1">
                手元の顧客台帳CSVを取り込めばアカウントとお墓情報が自動生成。専用QRコード付き案内DM（ハガキ/用紙）を一括発行できます。
              </p>
            </div>
            <div className="xl:ml-auto flex items-center justify-end gap-2.5 flex-wrap shrink-0">
              <button
                type="button"
                onClick={() => setShowImportModal(true)}
                className="px-3.5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm sm:text-base font-bold rounded-xl shadow-xs transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <span>📁</span> 施主名簿CSV一括取り込み
              </button>
              <button
                type="button"
                onClick={() => handleOpenDmModal()}
                className="px-3.5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-sm sm:text-base font-bold rounded-xl shadow-xs transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <span>📮</span> パーソナライズ案内DM印刷（QRコード付）
              </button>
              <button
                type="button"
                onClick={() => setIsAddingTemplateModal(true)}
                className="px-3.5 py-2.5 bg-stone-800 hover:bg-stone-900 text-white text-sm sm:text-base font-bold rounded-xl shadow-xs transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <span>➕</span> メール文面追加
              </button>
            </div>
          </div>

          {/* 💡 最強オンボーディング戦略と送信方式の解説パネル */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-emerald-50/90 border-2 border-emerald-300 rounded-2xl p-5 text-stone-800 space-y-2">
              <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-lg">
                <span className="text-xl">🚀</span>
                <span>摩擦ゼロ！成約率を跳ね上げるパーソナライズ案内DM</span>
              </div>
              <p className="text-sm text-stone-700 leading-relaxed">
                施主様のお墓の写真や区画番号、ログインID（電話番号）が<strong>すでに設定された状態の案内DM（ハガキ/A4）</strong>を印刷できます。施主様はスマホでQRコードを読み込み、<strong>「日程とプランを選ぶだけ」</strong>でお墓参り・清掃代行の注文が完了します。
              </p>
            </div>

            <div className="bg-amber-50/90 border-2 border-amber-300 rounded-2xl p-5 text-stone-800 space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-extrabold text-lg">
                <span className="text-xl">💡</span>
                <span>案内メールは、霊園様のメールソフト（Outlook・Gmail等）のBCCで送信</span>
              </div>
              <p className="text-sm text-stone-700 leading-relaxed">
                施主様からの「次回もお願いしたい」「希望日を変更したい」などの返信を霊園事務所の普段の受信トレイで確実に受け取れるよう、<strong>メールソフトのBCC宛先として一発起動・送信</strong>できます。
              </p>
            </div>
          </div>

          {/* コピー通知トースト */}
          {copyFeedback && (
            <div className="p-4 mb-6 bg-emerald-100 border-2 border-emerald-500 text-emerald-900 text-lg font-bold rounded-2xl shadow animate-fade-in">
              {copyFeedback}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* 左側: 施主様（顧客）一覧名簿（右側と高さを揃えた完全枠線ボックス） */}
            <div className="lg:col-span-6 bg-stone-50 rounded-2xl p-5 sm:p-6 border-2 border-stone-300 flex flex-col justify-between h-full">
              {/* ヘッダー部（固定表示・1行右揃え） */}
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-stone-200 shrink-0">
                <div className="flex items-baseline gap-1.5 sm:gap-2 shrink-0">
                  <span className="font-extrabold text-stone-900 text-base sm:text-lg flex items-center gap-1 whitespace-nowrap">
                    <span>👥</span> 対象の施主様を選択
                  </span>
                  <span className="text-xs text-stone-600 font-bold whitespace-nowrap">
                    (<strong className="text-blue-700">{selectedClientIds.length}</strong>/{clientsSummary.length}名)
                  </span>
                </div>
                <div className="ml-auto flex items-center justify-end gap-1.5 sm:gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleToggleSelectAllClients}
                    className="px-2.5 sm:px-3 py-1.5 bg-white hover:bg-stone-200 border border-stone-300 text-stone-800 text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer shadow-2xs whitespace-nowrap"
                  >
                    {selectedClientIds.length === clientsSummary.length ? 'すべての選択を解除' : '全員を選択する'}
                  </button>
                  {selectedClientIds.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        const targets = clientsSummary.filter((c) => selectedClientIds.includes(c.id));
                        handleOpenDmModal(targets);
                      }}
                      className="px-2.5 sm:px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition flex items-center gap-1 cursor-pointer whitespace-nowrap"
                    >
                      <span>📮</span> DM印刷（{selectedClientIds.length}名）
                    </button>
                  )}
                </div>
              </div>

              {/* 顧客名簿リスト（枠線の内側に収まり、下端まで伸びて内部スクロール） */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 pt-3 mt-1 min-h-[500px] max-h-[720px]">
                {clientsSummary.length === 0 ? (
                  <div className="text-center py-12 bg-stone-50 rounded-2xl border border-dashed border-stone-300 text-stone-500">
                    現在、利用履歴のある施主様データはありません。
                  </div>
                ) : (
                  clientsSummary.map((client) => {
                    const isChecked = selectedClientIds.includes(client.id);

                    // 最終利用日からの月数算出
                    const lastDate = client.lastOrderDate ? new Date(client.lastOrderDate) : null;
                    const diffMonths = lastDate
                      ? Math.max(0, Math.floor((new Date().getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24 * 30)))
                      : null;

                    return (
                      <div
                        key={client.id}
                        className={`p-4 rounded-2xl border-2 transition ${
                          isChecked
                            ? 'bg-blue-50/70 border-blue-400 shadow-xs'
                            : 'bg-stone-50/80 border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleClientId(client.id)}
                            className="w-6 h-6 mt-1 text-blue-600 rounded cursor-pointer shrink-0 accent-blue-600"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-stone-900 text-lg">
                                  {client.name} 様
                                </span>
                                {client.orderCount > 0 && (
                                  <span className="text-xs font-bold px-2 py-0.5 bg-stone-200 text-stone-800 rounded-lg">
                                    利用: {client.orderCount}回
                                  </span>
                                )}
                              </div>

                              {/* アクションボタングループ */}
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenEditClient(client);
                                  }}
                                  className="text-xs font-bold px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg transition flex items-center gap-1 cursor-pointer border border-amber-300"
                                >
                                  <span>📸</span> お墓写真・詳細
                                </button>
                                <Link
                                  href={`/mypage?from=cemetery&clientId=${client.id}&clientName=${encodeURIComponent(client.name)}`}
                                  target="_blank"
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-xs font-bold px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded-lg transition flex items-center gap-1 cursor-pointer border border-emerald-300"
                                >
                                  <span>👤</span> 施主画面確認 ↗
                                </Link>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenDmModal([client]);
                                  }}
                                  className="text-xs font-bold px-2.5 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg transition flex items-center gap-1 cursor-pointer border border-blue-300"
                                >
                                  <span>📮</span> DM印刷
                                </button>
                              </div>
                            </div>

                            {/* お墓写真（正面・側面・作業完了後） ＆ 情報プレビュー */}
                            <div className="flex items-center gap-3 mt-2 bg-white/80 p-2.5 rounded-xl border border-stone-200 flex-wrap sm:flex-nowrap">
                              <div className="flex items-center gap-1.5 shrink-0">
                                {/* 正面写真 */}
                                <div
                                  onClick={() => handleOpenEditClient(client)}
                                  className="w-14 h-14 rounded-lg bg-stone-100 border border-stone-300 overflow-hidden shrink-0 cursor-pointer relative group flex items-center justify-center shadow-2xs"
                                  title="正面写真（クリックで編集）"
                                >
                                  {client.photoUrl ? (
                                    <img
                                      src={client.photoUrl}
                                      alt="正面写真"
                                      className="w-full h-full object-cover group-hover:opacity-80 transition"
                                    />
                                  ) : (
                                    <span className="text-[10px] text-stone-400 font-bold text-center leading-tight">
                                      正面<br />未登録
                                    </span>
                                  )}
                                  <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[8px] font-bold text-center py-0.5">
                                    正面
                                  </span>
                                </div>

                                {/* 側面写真 */}
                                <div
                                  onClick={() => handleOpenEditClient(client)}
                                  className="w-14 h-14 rounded-lg bg-stone-100 border border-stone-300 overflow-hidden shrink-0 cursor-pointer relative group flex items-center justify-center shadow-2xs"
                                  title="側面建立者写真（クリックで編集）"
                                >
                                  {client.builderPhotoUrl ? (
                                    <img
                                      src={client.builderPhotoUrl}
                                      alt="側面写真"
                                      className="w-full h-full object-cover group-hover:opacity-80 transition"
                                    />
                                  ) : (
                                    <span className="text-[10px] text-stone-400 font-bold text-center leading-tight">
                                      側面<br />未登録
                                    </span>
                                  )}
                                  <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[8px] font-bold text-center py-0.5">
                                    側面
                                  </span>
                                </div>

                                {/* 代行業者作業後の最新写真（実績がある場合） */}
                                {client.latestAfterPhotoUrl && (
                                  <div
                                    onClick={() => handleOpenEditClient(client)}
                                    className="w-14 h-14 rounded-lg bg-emerald-50 border-2 border-emerald-500 overflow-hidden shrink-0 cursor-pointer relative group flex items-center justify-center shadow-2xs"
                                    title="提携業者清掃後写真（最新実績）"
                                  >
                                    <img
                                      src={client.latestAfterPhotoUrl}
                                      alt="清掃後写真"
                                      className="w-full h-full object-cover group-hover:opacity-80 transition"
                                    />
                                    <span className="absolute bottom-0 inset-x-0 bg-emerald-800 text-white text-[8px] font-bold text-center py-0.5">
                                      清掃済
                                    </span>
                                  </div>
                                )}
                              </div>

                              <div className="text-xs text-stone-700 min-w-0 flex-1 space-y-0.5 font-medium">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span>正面:「<strong className="text-stone-900 text-sm">{client.frontInscription || '未登録'}</strong>」</span>
                                  {client.sectionPlotNumber && (
                                    <span className="font-bold text-emerald-900 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                      区画: {client.sectionPlotNumber}
                                    </span>
                                  )}
                                </div>
                                {client.builderName && (
                                  <span className="text-stone-500 block truncate">建立者: {client.builderName}</span>
                                )}
                                {(client.phoneNumber || client.phone) && (
                                  <span className="font-bold text-stone-800 block">
                                    📞 {client.phoneNumber || client.phone}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-y-1 gap-x-3 mt-2 text-xs text-stone-600">
                              <span className="truncate">
                                ✉️ {client.email ? (
                                  <strong className="text-stone-700">{client.email}</strong>
                                ) : (
                                  <span className="text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded">メール未登録（DMハガキ送付推奨）</span>
                                )}
                              </span>
                              {lastDate && (
                                <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold">
                                  最終利用: {diffMonths !== null && diffMonths > 0 ? `約${diffMonths}ヶ月前` : '今月'}
                                </span>
                              )}
                            </div>

                            {client.address && (
                              <div className="text-xs text-stone-500 mt-1 truncate">
                                🏠 {client.postalCode ? `〒${client.postalCode} ` : ''}{client.address}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* 右側: 案内メール作成 ＆ 送信アクション (col-span-6 または 5) */}
            <div className="lg:col-span-6 bg-stone-50 rounded-2xl p-5 sm:p-6 border-2 border-stone-300 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-200">
                  <span className="font-extrabold text-stone-900 text-lg flex items-center gap-1.5">
                    <span>✉️</span> 案内メールの文面編集
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={isSavingTemplateLoading}
                      onClick={handleSaveEmailTemplate}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold rounded-xl shadow transition active:scale-95 flex items-center gap-1.5 cursor-pointer disabled:bg-stone-400"
                    >
                      <span>💾</span> {isSavingTemplateLoading ? '保存中...' : 'この文面を上書き保存'}
                    </button>
                  </div>
                </div>

                {/* テンプレート選択 */}
                <div>
                  <label htmlFor="email-template-select" className="block text-sm font-bold text-stone-700 mb-1">
                    文面テンプレート選択（時期・用途別）:
                  </label>
                  <select
                    id="email-template-select"
                    value={selectedTemplateId}
                    onChange={(e) => handleSelectTemplate(e.target.value)}
                    className="w-full bg-white text-stone-900 font-bold px-4 py-2.5 rounded-xl border-2 border-stone-300 focus:border-blue-500 outline-none text-base shadow-xs"
                  >
                    {activeTemplates.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 件名 */}
                <div>
                  <label htmlFor="email-subject-input" className="block text-sm font-bold text-stone-700 mb-1">
                    メール件名:
                  </label>
                  <input
                    id="email-subject-input"
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full bg-white text-stone-900 font-bold px-4 py-2.5 rounded-xl border-2 border-stone-300 focus:border-blue-500 outline-none text-base shadow-xs"
                    placeholder="メールの件名を入力"
                  />
                </div>

                {/* 本文 */}
                <div>
                  <label htmlFor="email-body-textarea" className="block text-sm font-bold text-stone-700 mb-1">
                    メール本文（自由に加筆・修正できます）:
                  </label>
                  <textarea
                    id="email-body-textarea"
                    rows={12}
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    className="w-full bg-white text-stone-900 font-medium px-4 py-3 rounded-xl border-2 border-stone-300 focus:border-blue-500 outline-none text-base leading-relaxed shadow-xs"
                    placeholder="メールの本文を入力"
                  />
                </div>
              </div>

              {/* 送信アクションボタン群 */}
              <div className="mt-6 pt-5 border-t-2 border-stone-300 space-y-3">
                <button
                  type="button"
                  onClick={handleLaunchMailer}
                  className="w-full py-4 px-6 bg-blue-700 hover:bg-blue-800 active:scale-95 text-white text-xl font-extrabold rounded-2xl shadow-lg transition flex items-center justify-center gap-3 cursor-pointer"
                >
                  <span>✉️</span>
                  <span>メールソフトを起動して送信（BCC {selectedClientEmails.length}件）</span>
                </button>
                <p className="text-center text-xs text-stone-500">
                  ※お使いのPCのメールソフト（Outlook、Mac Mail、Thunderbird等）が起動し、BCC宛先と本文が自動入力されます。
                </p>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handleCopyBcc}
                    className="py-3 px-3 bg-white hover:bg-stone-100 border-2 border-stone-300 text-stone-800 font-bold text-sm rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>📋</span> BCC宛先アドレスをコピー
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyBody}
                    className="py-3 px-3 bg-white hover:bg-stone-100 border-2 border-stone-300 text-stone-800 font-bold text-sm rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>📋</span> 件名と本文をコピー
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 編集モーダル */}
      {isEditingCompany && (
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setIsEditingCompany(false); }}
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm cursor-pointer"
        >
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border-4 border-amber-500 max-h-[90vh] overflow-y-auto cursor-default">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mb-2">
              管理会社情報の変更・編集
            </h3>
            <p className="text-stone-600 text-base mb-6 font-medium">
              入力内容を修正して「更新を保存する」ボタンを押してください。
            </p>

            <form onSubmit={handleSaveCompany} className="space-y-5">
              <div>
                <label className="block text-lg font-bold text-stone-800 mb-1">
                  会社・事務所名
                </label>
                <input
                  type="text"
                  required
                  value={editFormData.name || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full text-lg p-3.5 rounded-xl border-2 border-stone-300 focus:border-amber-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-lg font-bold text-stone-800 mb-1">
                    代表・管理責任者名
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.representativeName || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, representativeName: e.target.value })}
                    className="w-full text-lg p-3.5 rounded-xl border-2 border-stone-300 focus:border-amber-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-lg font-bold text-stone-800 mb-1">
                    お電話番号
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.phoneNumber || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, phoneNumber: e.target.value })}
                    className="w-full text-lg p-3.5 rounded-xl border-2 border-stone-300 focus:border-amber-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-lg font-bold text-stone-800 mb-1">
                  メールアドレス
                </label>
                <input
                  type="email"
                  required
                  value={editFormData.email || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  className="w-full text-lg p-3.5 rounded-xl border-2 border-stone-300 focus:border-amber-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-lg font-bold text-stone-800 mb-1">
                  所在地・住所
                </label>
                <input
                  type="text"
                  required
                  value={editFormData.locationAddress || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, locationAddress: e.target.value })}
                  className="w-full text-lg p-3.5 rounded-xl border-2 border-stone-300 focus:border-amber-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-lg font-bold text-stone-800 mb-1">
                  霊園の説明・備考
                </label>
                <textarea
                  rows={3}
                  value={editFormData.description || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  className="w-full text-lg p-3.5 rounded-xl border-2 border-stone-300 focus:border-amber-600 outline-none"
                />
              </div>

              <div className="pt-4 border-t-2 border-stone-200 flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsEditingCompany(false)}
                  className="flex-1 py-4 px-6 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xl font-bold rounded-2xl transition"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-4 px-6 bg-amber-600 hover:bg-amber-700 text-white text-xl font-bold rounded-2xl shadow-lg transition"
                >
                  {loading ? '保存中...' : '更新を保存する'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 提携代行業者 編集モーダル（高齢者向け特大UI） */}
      {isEditingVendors && (
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setIsEditingVendors(false); }}
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm cursor-pointer"
        >
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border-4 border-blue-600 max-h-[90vh] flex flex-col cursor-default">
            <div className="pb-4 border-b-2 border-stone-200">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-900 text-base font-extrabold rounded-full">
                  出入り認定・提携設定
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-2">
                提携作業代行業者の追加・解除
              </h3>
              <p className="text-stone-600 text-lg mt-1 font-medium">
                当霊園（{currentCompany?.name}）で作業を認める代行業者を選んでチェックを入れてください。
              </p>
            </div>

            {/* 業者一覧（スクロール可能） */}
            <div className="py-4 overflow-y-auto flex-1 space-y-3 pr-2">
              {vendors.map((vendor) => {
                const isChecked = tempAffiliatedVendorIds.includes(vendor.id);
                return (
                  <div
                    key={vendor.id}
                    onClick={() => handleToggleVendorId(vendor.id)}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition flex items-start justify-between gap-4 ${
                      isChecked
                        ? 'bg-blue-50/80 border-blue-500 shadow-sm'
                        : 'bg-stone-50 border-stone-300 hover:border-stone-400 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}} // 親divのonClickでトグル
                        className="mt-1.5 w-6 h-6 rounded text-blue-700 focus:ring-blue-500 cursor-pointer accent-blue-700 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-xl sm:text-2xl font-extrabold text-stone-900">
                            {vendor.displayName}
                          </h4>
                          {isChecked ? (
                            <span className="bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                              ✅ 提携・出入り認可
                            </span>
                          ) : (
                            <span className="bg-stone-200 text-stone-600 text-sm font-bold px-3 py-1 rounded-full">
                              未提携
                            </span>
                          )}
                        </div>
                        <p className="text-base text-stone-700 font-bold mt-1">
                          代表: {vendor.vendorProfile?.representativeName} • 電話: {vendor.phoneNumber}
                        </p>
                        <p className="text-base text-stone-600 mt-1 line-clamp-1">
                          {vendor.vendorProfile?.description}
                        </p>
                        <div className="text-sm text-stone-500 mt-1">
                          対応地域: {vendor.vendorProfile?.serviceAreas?.join(', ')} / 実績: {vendor.vendorProfile?.completedJobsCount}件完了
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-base font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-lg border border-amber-300">
                        ★ {vendor.vendorProfile?.rating}点
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* モーダルフッター */}
            <div className="pt-4 border-t-2 border-stone-200 flex gap-4">
              <button
                type="button"
                onClick={() => setIsEditingVendors(false)}
                className="flex-1 py-4 px-6 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xl font-bold rounded-2xl transition"
              >
                キャンセル
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleSaveVendors}
                className="flex-1 py-4 px-6 bg-blue-700 hover:bg-blue-800 text-white text-xl font-bold rounded-2xl shadow-lg transition flex items-center justify-center gap-2"
              >
                {loading ? '保存中...' : '提携業者の変更を保存する'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 新規代行業者・便利屋さん 登録モーダル（注意喚起付き） */}
      {isAddingNewVendor && (
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setIsAddingNewVendor(false); }}
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm cursor-pointer"
        >
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border-4 border-emerald-600 max-h-[90vh] overflow-y-auto cursor-default">
            <div className="pb-4 border-b-2 border-stone-200">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-base font-extrabold rounded-full">
                パートナー新規追加
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-2">
                作業代行業者・便利屋さんの新規登録
              </h3>
              <p className="text-stone-600 text-base mt-1 font-medium">
                当霊園（{currentCompany?.name}）で作業を行う代行業者または個人の便利屋さんを新しく登録します。
              </p>
            </div>

            {/* ⚠️ 注意喚起・重要確認事項ボックス */}
            <div className="my-5 p-5 bg-amber-50 border-2 border-amber-400 rounded-2xl text-stone-800 space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-extrabold text-lg">
                <span className="text-2xl">⚠️</span>
                <span>【重要】業者・個人を登録する前の確認事項</span>
              </div>
              <ul className="text-base space-y-2 list-disc list-inside text-stone-700 font-medium">
                <li>
                  <strong className="text-stone-900">墓石清掃の安全遵守:</strong> 金属たわしや酸性・塩素系洗剤の使用は禁止です（水垢落としは専用中性洗剤と柔らかい布・スポンジのみ）。
                </li>
                <li>
                  <strong className="text-stone-900">他家墓所への配慮:</strong> ご依頼区画以外の墓石・敷地・花立て等には一切手を触れないようご指導ください。
                </li>
                <li>
                  <strong className="text-stone-900">身元・連絡先の確認:</strong> 確実につながるお電話番号とご担当者氏名を正しくご入力ください。
                </li>
                <li>
                  <strong className="text-stone-900">破損時の賠償責任:</strong> 万が一の墓石破損やトラブルが生じた際の責任と対応ルールをご周知ください。
                </li>
              </ul>

              <div className="pt-2 border-t border-amber-200">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreedToSafetyWarnings}
                    onChange={(e) => setAgreedToSafetyWarnings(e.target.checked)}
                    className="mt-1 w-6 h-6 rounded text-amber-700 focus:ring-amber-500 accent-amber-700 shrink-0 cursor-pointer"
                  />
                  <span className="text-base font-extrabold text-amber-950">
                    上記の安全注意事項を確認し、責任を持って代行業者・便利屋さんを登録します（必須チェック）
                  </span>
                </label>
              </div>
            </div>

            {/* 登録フォーム */}
            <form onSubmit={handleCreateVendor} className="space-y-4">
              <div>
                <label className="block text-lg font-bold text-stone-800 mb-1">
                  事業形態・種別
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-lg font-bold text-stone-800 cursor-pointer p-3 bg-stone-50 rounded-xl border border-stone-300 flex-1">
                    <input
                      type="radio"
                      name="businessType"
                      value="individual"
                      checked={newVendorData.businessType === 'individual'}
                      onChange={() => setNewVendorData({ ...newVendorData, businessType: 'individual' })}
                      className="w-5 h-5 text-emerald-700"
                    />
                    <span>個人事業主・便利屋さん</span>
                  </label>
                  <label className="flex items-center gap-2 text-lg font-bold text-stone-800 cursor-pointer p-3 bg-stone-50 rounded-xl border border-stone-300 flex-1">
                    <input
                      type="radio"
                      name="businessType"
                      value="corporation"
                      checked={newVendorData.businessType === 'corporation'}
                      onChange={() => setNewVendorData({ ...newVendorData, businessType: 'corporation' })}
                      className="w-5 h-5 text-emerald-700"
                    />
                    <span>法人・石材店・清掃会社</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-lg font-bold text-stone-800 mb-1">
                  屋号・業者名・個人名 <span className="text-red-600 text-sm font-bold">必須</span>
                </label>
                <input
                  type="text"
                  required
                  value={newVendorData.displayName}
                  onChange={(e) => setNewVendorData({ ...newVendorData, displayName: e.target.value })}
                  placeholder="例: 松山おそうじサポート、便利屋 山田"
                  className="w-full text-lg p-3.5 rounded-xl border-2 border-stone-300 focus:border-emerald-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-lg font-bold text-stone-800 mb-1">
                    代表者・担当者氏名 <span className="text-red-600 text-sm font-bold">必須</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newVendorData.representativeName}
                    onChange={(e) => setNewVendorData({ ...newVendorData, representativeName: e.target.value })}
                    placeholder="例: 山田 太郎"
                    className="w-full text-lg p-3.5 rounded-xl border-2 border-stone-300 focus:border-emerald-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-lg font-bold text-stone-800 mb-1">
                    お電話番号 <span className="text-red-600 text-sm font-bold">必須</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={newVendorData.phoneNumber}
                    onChange={(e) => setNewVendorData({ ...newVendorData, phoneNumber: e.target.value })}
                    placeholder="例: 089-999-0000 または 携帯"
                    className="w-full text-lg p-3.5 rounded-xl border-2 border-stone-300 focus:border-emerald-600 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-lg font-bold text-stone-800 mb-1">
                    メールアドレス（ログインID） <span className="text-red-600 text-sm font-bold">必須</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={newVendorData.email}
                    onChange={(e) => setNewVendorData({ ...newVendorData, email: e.target.value })}
                    placeholder="例: yamada@example.com"
                    className="w-full text-lg p-3.5 rounded-xl border-2 border-stone-300 focus:border-emerald-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-lg font-bold text-stone-800 mb-1">
                    初期パスワード
                  </label>
                  <input
                    type="text"
                    required
                    value={newVendorData.password}
                    onChange={(e) => setNewVendorData({ ...newVendorData, password: e.target.value })}
                    placeholder="例: vendor1234"
                    className="w-full text-lg p-3.5 rounded-xl border-2 border-stone-300 focus:border-emerald-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-lg font-bold text-stone-800 mb-1">
                  対応可能エリア
                </label>
                <input
                  type="text"
                  value={newVendorData.serviceAreas}
                  onChange={(e) => setNewVendorData({ ...newVendorData, serviceAreas: e.target.value })}
                  placeholder="例: 松山市全域、東温市、伊予市"
                  className="w-full text-lg p-3.5 rounded-xl border-2 border-stone-300 focus:border-emerald-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-lg font-bold text-stone-800 mb-1">
                  自己紹介・アピール点・備考
                </label>
                <textarea
                  rows={2}
                  value={newVendorData.description}
                  onChange={(e) => setNewVendorData({ ...newVendorData, description: e.target.value })}
                  placeholder="例: 松山市内で草刈り・便利屋業を営んでいます。丁寧にお参りとお掃除をいたします。"
                  className="w-full text-lg p-3.5 rounded-xl border-2 border-stone-300 focus:border-emerald-600 outline-none"
                />
              </div>

              <div className="pt-4 border-t-2 border-stone-200 flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsAddingNewVendor(false)}
                  className="flex-1 py-4 px-6 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xl font-bold rounded-2xl transition"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  disabled={loading || !agreedToSafetyWarnings}
                  className={`flex-1 py-4 px-6 text-white text-xl font-bold rounded-2xl shadow-lg transition flex items-center justify-center gap-2 ${
                    loading || !agreedToSafetyWarnings
                      ? 'bg-stone-400 cursor-not-allowed'
                      : 'bg-emerald-700 hover:bg-emerald-800 cursor-pointer'
                  }`}
                >
                  {loading ? '登録中...' : 'この業者を登録して提携先に追加'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. 契約書雛形 印刷・PDFダウンロード用モーダル */}
      {showContractTemplateModal && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowContractTemplateModal(false);
              setContractPrintTargetVendor(null);
            }
          }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto no-print-bg cursor-pointer"
        >
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[95vh] flex flex-col shadow-2xl overflow-hidden my-4 cursor-default">
            {/* モーダル操作ヘッダー（印刷時は非表示） */}
            <div className="no-print p-5 bg-stone-900 text-white flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div>
                <span className="text-xs bg-amber-500 text-stone-950 font-bold px-2.5 py-0.5 rounded-full">
                  {contractPrintTargetVendor ? `専用契約書（${contractPrintTargetVendor.displayName}）` : '契約書標準雛形（手書き用）'}
                </span>
                <h3 className="text-xl font-bold mt-1">
                  📄 墓地内作業代行業務 基本契約書 兼 遵守誓約書
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrintContract}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm flex items-center gap-1.5 shadow-md transition cursor-pointer"
                >
                  <span>🖨️</span> PDF保存・印刷する（A4）
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadContractHtml(contractPrintTargetVendor)}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm flex items-center gap-1.5 shadow-md transition cursor-pointer"
                >
                  <span>📥</span> HTML文書をDL
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowContractTemplateModal(false);
                    setContractPrintTargetVendor(null);
                  }}
                  className="px-3.5 py-2.5 bg-stone-700 hover:bg-stone-600 text-white font-bold rounded-xl text-sm transition cursor-pointer"
                >
                  ✕ 閉じる
                </button>
              </div>
            </div>

            {/* 印刷・書面プレビューエリア */}
            <div className="p-6 sm:p-10 overflow-y-auto bg-stone-50 text-stone-900">
              <div
                id="printable-contract-container"
                className="bg-white p-8 sm:p-12 shadow-sm rounded-xl border border-stone-300 max-w-3xl mx-auto text-stone-900 font-serif leading-relaxed"
                style={{ fontFamily: '"Hiragino Mincho ProN", "Yu Mincho", serif' }}
              >
                <h1 className="text-center text-2xl font-bold pb-4 mb-6 border-b-2 border-stone-800 tracking-wider">
                  墓地内作業代行業務 基本契約書 兼 遵守誓約書
                </h1>

                <p className="text-sm text-justify mb-6 indent-4">
                  <strong>{currentCompany?.name || '霊園管理事務所'}</strong>（以下「甲」という）と、作業代行業者{' '}
                  <strong>{contractPrintTargetVendor ? contractPrintTargetVendor.displayName : '＿＿＿＿＿＿＿＿＿＿＿＿＿＿'}</strong>（以下「乙」という）は、甲が管理する霊園・墓地（{currentCompany?.cemeteryNames?.join('、') || '管轄霊園'}）内において、墓地使用者等から委託を受けたお墓参り・墓所清掃・除草等の作業代行業務を実施するにあたり、以下の通り契約を締結し、乙はこれを厳格に遵守することを誓約する。
                </p>

                <div className="space-y-4 text-xs sm:text-sm">
                  <div>
                    <h2 className="font-bold text-base mb-1">第1条（目的及び作業の認可）</h2>
                    <p className="text-justify indent-4">
                      甲は、乙が本契約に定める各条項および甲の定める霊園管理規則を誠実に遵守することを条件として、甲の管轄する霊園内への出入りおよび墓所作業の実施を認可する。
                    </p>
                  </div>

                  <div>
                    <h2 className="font-bold text-base mb-1">第2条（霊園管理規則および作業規律の遵守）</h2>
                    <ol className="list-decimal pl-6 space-y-1">
                      <li>乙は、作業の実施にあたり、甲の管理規約、指定された作業可能時間帯、車両乗り入れ規則を遵守しなければならない。</li>
                      <li>作業に伴い発生した雑草・落葉・ゴミ・古花等は、霊園内のゴミ集積所や水場に放置せず、乙の責任においてすべて場外へ持ち帰り適正に処分すること。</li>
                      <li>水汲み場、通路等の共有設備を清潔に使用し、一般の墓参者の通行や参拝を妨げないこと。</li>
                    </ol>
                  </div>

                  <div className="bg-amber-50/60 p-3 rounded border border-amber-300">
                    <h2 className="font-bold text-base mb-1 text-amber-950">第3条（善管注意義務及び損害賠償責任【極めて重要】）</h2>
                    <ol className="list-decimal pl-6 space-y-1 text-amber-950">
                      <li>乙は、善良なる管理者の注意をもって作業を行わなければならない。</li>
                      <li>乙が作業中または作業に関連して、対象墓石の欠損・破損・文字彫刻の剥離、または隣接・周辺の墓石・外柵・卒塔婆・共有施設に破損・汚損を生じさせた場合、<strong>乙が自己の費用と責任において直ちに原状回復を行い、甲および被害者に対する損害の一切を賠償するものとする。</strong></li>
                    </ol>
                  </div>

                  <div>
                    <h2 className="font-bold text-base mb-1">第4条（損害保険への加入確認）</h2>
                    <p className="text-justify indent-4">
                      乙は、前条に定める賠償責任を担保するため、業務活動に伴う施設賠償責任保険等に加入し、有効な保険期間を維持すること。
                    </p>
                  </div>

                  <div>
                    <h2 className="font-bold text-base mb-1">第5条（直接取引・中抜き行為の禁止）</h2>
                    <p className="text-justify indent-4">
                      乙は、本業務を通じて知り得た施主または霊園関係者に対し、甲および正規プラットフォームを経由しない直接取引の勧誘や営業を行ってはならない。
                    </p>
                  </div>

                  <div>
                    <h2 className="font-bold text-base mb-1">第6条（作業完了報告及び写真提出の義務）</h2>
                    <p className="text-justify indent-4">
                      乙は、作業の適正性を証するため、作業前および作業後の状況写真を正確に記録し、甲および施主に対して指定の報告書を提出しなければならない。
                    </p>
                  </div>

                  <div>
                    <h2 className="font-bold text-base mb-1">第7条（契約解除及び出入り禁止処分）</h2>
                    <p className="text-justify indent-4">
                      乙が本契約に違反した場合、または霊園の秩序を著しく乱す行為があった場合、甲は何らの催告を要せず直ちに乙に対する出入り認可を取り消し、霊園内への立ち入りを禁止することができる。
                    </p>
                  </div>
                </div>

                {/* 署名捺印欄 */}
                <div className="mt-8 pt-6 border-t border-stone-400">
                  <p className="text-xs">
                    本契約締結の証として本書2通を作成し、甲乙記名押印の上、各自1通を保有する。
                  </p>
                  <p className="text-right text-xs mt-3">
                    契約締結日：{new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mt-4 text-xs">
                    <div className="border border-stone-300 p-4 rounded bg-stone-50/50 relative">
                      <div className="absolute top-4 right-4 w-12 h-12 border border-dashed border-stone-400 text-stone-400 flex items-center justify-center text-[10px]">
                        甲印
                      </div>
                      <span className="font-bold block mb-1">【甲：霊園管理者】</span>
                      <div>所在地：{currentCompany?.locationAddress || '＿＿＿＿＿＿＿＿＿＿＿＿'}</div>
                      <div>名　称：{currentCompany?.name || '霊園管理事務所'}</div>
                      <div className="mt-1">代表者：{currentCompany?.representativeName || '霊園管理長'}　　印</div>
                      <div>電　話：{currentCompany?.phoneNumber || '＿＿＿＿＿＿＿＿＿＿＿＿'}</div>
                    </div>

                    <div className="border border-stone-300 p-4 rounded bg-stone-50/50 relative">
                      <div className="absolute top-4 right-4 w-12 h-12 border border-dashed border-stone-400 text-stone-400 flex items-center justify-center text-[10px]">
                        乙印
                      </div>
                      <span className="font-bold block mb-1">【乙：作業代行業者】</span>
                      <div>所在地：{contractPrintTargetVendor?.vendorProfile?.serviceAreas?.join('、') || '＿＿＿＿＿＿＿＿＿＿＿＿'}</div>
                      <div>屋号名：{contractPrintTargetVendor?.displayName || '＿＿＿＿＿＿＿＿＿＿＿＿'}</div>
                      <div className="mt-1">代表者：{contractPrintTargetVendor?.vendorProfile?.representativeName || '＿＿＿＿＿＿＿＿'}　　印</div>
                      <div>電　話：{contractPrintTargetVendor?.phoneNumber || '＿＿＿＿＿＿＿＿＿＿＿＿'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. 記入済み契約書の添付・貼り付けアップロードモーダル */}
      {uploadTargetVendor && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setUploadTargetVendor(null);
              setContractUploadFile(null);
            }
          }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl cursor-default">
            <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-stone-200">
              <div>
                <span className="text-xs font-bold bg-amber-100 text-amber-900 px-3 py-1 rounded-full">
                  契約書の電子保管
                </span>
                <h3 className="text-xl font-extrabold text-stone-900 mt-1">
                  📎 記入・捺印済み契約書の添付
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setUploadTargetVendor(null);
                  setContractUploadFile(null);
                }}
                className="text-stone-400 hover:text-stone-700 text-2xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="mb-4 bg-stone-50 p-4 rounded-2xl border border-stone-200">
              <span className="text-xs font-bold text-stone-500 block">対象の作業代行業者</span>
              <span className="text-lg font-extrabold text-stone-900">{uploadTargetVendor.displayName}</span>
              <span className="text-sm text-stone-600 block">責任者: {uploadTargetVendor.vendorProfile?.representativeName} 様</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-base font-bold text-stone-800 mb-2">
                  契約書ファイルを選択（PDF または スマホで撮影した画像）
                </label>
                <div className="border-2 border-dashed border-stone-300 hover:border-emerald-600 rounded-2xl p-6 text-center bg-stone-50 transition">
                  <input
                    type="file"
                    id="contract-file-input"
                    accept="application/pdf,image/*"
                    onChange={handleContractFileSelect}
                    className="hidden"
                  />
                  <label
                    htmlFor="contract-file-input"
                    className="cursor-pointer flex flex-col items-center justify-center gap-2"
                  >
                    <span className="text-4xl">📄</span>
                    <span className="text-base font-bold text-emerald-800 hover:underline">
                      ここをクリックしてファイルを選択
                    </span>
                    <span className="text-xs text-stone-500">
                      PDF、またはスマホカメラで撮影したJPG / PNG写真（最大12MB）
                    </span>
                  </label>
                </div>
              </div>

              {/* 選択されたファイルプレビュー */}
              {contractUploadFile && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-xl shrink-0">
                      {contractUploadFile.fileType.includes('pdf') ? '📑' : '🖼️'}
                    </span>
                    <div className="truncate">
                      <span className="font-bold text-emerald-950 text-sm block truncate">
                        {contractUploadFile.fileName}
                      </span>
                      <span className="text-xs text-emerald-700">アップロード準備完了</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setContractUploadFile(null)}
                    className="text-stone-400 hover:text-rose-600 font-bold text-xs p-1"
                  >
                    取消
                  </button>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-stone-800 mb-1">
                  備考・確認メモ（任意）
                </label>
                <input
                  type="text"
                  value={contractUploadNotes}
                  onChange={(e) => setContractUploadNotes(e.target.value)}
                  placeholder="例: 2026年9月締結。賠償責任保険証書の写しも確認済み。"
                  className="w-full text-sm p-3 rounded-xl border-2 border-stone-300 focus:border-emerald-600 outline-none"
                />
              </div>

              <div className="pt-4 border-t-2 border-stone-200 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setUploadTargetVendor(null);
                    setContractUploadFile(null);
                  }}
                  className="flex-1 py-3 px-4 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold rounded-xl transition"
                >
                  キャンセル
                </button>
                <button
                  type="button"
                  disabled={!contractUploadFile || isUploadingContract}
                  onClick={handleSaveContract}
                  className={`flex-1 py-3 px-4 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 ${
                    !contractUploadFile || isUploadingContract
                      ? 'bg-stone-400 cursor-not-allowed'
                      : 'bg-emerald-700 hover:bg-emerald-800 cursor-pointer'
                  }`}
                >
                  {isUploadingContract ? '保存中...' : '契約書を保存して締結済みにする'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. 添付契約書の拡大閲覧・確認モーダル */}
      {viewingContract && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setViewingContract(null);
            }
          }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden cursor-default">
            <div className="p-5 bg-stone-900 text-white flex items-center justify-between gap-3 shrink-0">
              <div>
                <span className="text-xs bg-emerald-600 text-white font-bold px-2.5 py-0.5 rounded-full">
                  締結済み契約書
                </span>
                <h3 className="text-xl font-bold mt-1">
                  👁️ {viewingContract.vendorName} の契約書
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {viewingContract.contract.contractFileUrl && (
                  <a
                    href={viewingContract.contract.contractFileUrl}
                    download={viewingContract.contract.contractFileName || '契約書'}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1"
                  >
                    <span>📥</span> ダウンロード
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setViewingContract(null)}
                  className="px-3.5 py-2 bg-stone-700 hover:bg-stone-600 text-white font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  ✕ 閉じる
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto bg-stone-100 flex-1 flex flex-col items-center justify-center">
              {viewingContract.contract.contractFileUrl ? (
                viewingContract.contract.contractFileUrl.startsWith('data:image/') ? (
                  <div className="max-w-full overflow-auto bg-white p-2 rounded-2xl shadow border border-stone-200">
                    <img
                      src={viewingContract.contract.contractFileUrl}
                      alt="添付契約書"
                      className="max-h-[65vh] w-auto object-contain rounded-xl"
                    />
                  </div>
                ) : (
                  <div className="w-full h-[65vh] bg-white rounded-2xl shadow overflow-hidden border border-stone-200">
                    <iframe
                      src={viewingContract.contract.contractFileUrl}
                      title="契約書PDF"
                      className="w-full h-full"
                    />
                  </div>
                )
              ) : (
                <div className="text-stone-500 font-bold p-8">ファイルデータがありません</div>
              )}

              <div className="w-full max-w-xl mt-4 bg-white p-3.5 rounded-xl border border-stone-200 text-xs text-stone-700 space-y-1">
                <div>📎 ファイル名: <strong>{viewingContract.contract.contractFileName || '不明'}</strong></div>
                <div>📅 添付日時: {viewingContract.contract.uploadedAt ? new Date(viewingContract.contract.uploadedAt).toLocaleString('ja-JP') : '不明'}</div>
                {viewingContract.contract.notes && (
                  <div>📝 備考メモ: {viewingContract.contract.notes}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. 自社公式契約書テンプレートPDFの登録・更新モーダル */}
      {isUploadingTemplate && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsUploadingTemplate(false);
              setTemplateUploadFile(null);
            }
          }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border-4 border-blue-600 cursor-default">
            <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-stone-200">
              <div>
                <span className="text-xs font-bold bg-blue-100 text-blue-900 px-3 py-1 rounded-full">
                  自社書類テンプレート管理
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900 mt-1">
                  📄 公式契約書PDFテンプレートの登録
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsUploadingTemplate(false);
                  setTemplateUploadFile(null);
                }}
                className="text-stone-400 hover:text-stone-700 text-2xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-stone-600 text-sm mb-4 leading-relaxed">
              霊園で実際に使用されている<strong>公式の契約書・誓約書PDF原本</strong>をアップロードして保管します。
              登録した原本PDFは、提携作業代行業者への配布や印刷にそのまま利用できます。
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-base font-bold text-stone-800 mb-2">
                  PDFファイルを選択
                </label>
                <div className="border-2 border-dashed border-stone-300 hover:border-blue-600 rounded-2xl p-6 text-center bg-stone-50 transition">
                  <input
                    type="file"
                    id="template-pdf-input"
                    accept="application/pdf"
                    onChange={handleTemplateFileSelect}
                    className="hidden"
                  />
                  <label
                    htmlFor="template-pdf-input"
                    className="cursor-pointer flex flex-col items-center justify-center gap-2"
                  >
                    <span className="text-4xl">📄</span>
                    <span className="text-base font-bold text-blue-800 hover:underline">
                      ここをクリックしてPDF原本を選択
                    </span>
                    <span className="text-xs text-stone-500">
                      PDF形式（最大20MBまで対応）
                    </span>
                  </label>
                </div>
              </div>

              {/* 選択されたテンプレートファイル情報 */}
              {templateUploadFile && (
                <div className="p-3.5 bg-blue-50 border border-blue-300 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-2xl shrink-0">📑</span>
                    <div className="truncate">
                      <span className="font-bold text-blue-950 text-sm block truncate">
                        {templateUploadFile.fileName}
                      </span>
                      <span className="text-xs text-blue-700">登録準備完了</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTemplateUploadFile(null)}
                    className="text-stone-400 hover:text-rose-600 font-bold text-xs p-1 cursor-pointer"
                  >
                    取消
                  </button>
                </div>
              )}

              {currentCompany?.contractTemplateFileName && !templateUploadFile && (
                <div className="p-3 bg-stone-100 rounded-xl text-xs text-stone-600">
                  <span>現在登録中の原本: <strong>{currentCompany.contractTemplateFileName}</strong></span>
                  {currentCompany.contractTemplateUpdatedAt && (
                    <span className="block text-stone-500 mt-0.5">
                      （最終更新: {new Date(currentCompany.contractTemplateUpdatedAt).toLocaleDateString('ja-JP')}）
                    </span>
                  )}
                </div>
              )}

              <div className="pt-4 border-t-2 border-stone-200 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsUploadingTemplate(false);
                    setTemplateUploadFile(null);
                  }}
                  className="flex-1 py-3 px-4 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold rounded-xl transition cursor-pointer"
                >
                  キャンセル
                </button>
                <button
                  type="button"
                  disabled={!templateUploadFile || isSavingTemplate}
                  onClick={handleSaveTemplatePdf}
                  className={`flex-1 py-3 px-4 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 ${
                    !templateUploadFile || isSavingTemplate
                      ? 'bg-stone-400 cursor-not-allowed'
                      : 'bg-blue-700 hover:bg-blue-800 cursor-pointer'
                  }`}
                >
                  {isSavingTemplate ? '保管中...' : 'テンプレート原本を登録・保存'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* メール文面テンプレート新規作成モーダル */}
      {isAddingTemplateModal && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAddingTemplateModal(false);
          }}
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm cursor-pointer"
        >
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-4 border-stone-800 cursor-default">
            <h3 className="text-2xl font-extrabold text-stone-900 mb-2">
              新しい文面テンプレートの追加
            </h3>
            <p className="text-stone-600 text-sm mb-5 font-medium">
              現在編集中の件名・本文をもとに、新しいテンプレートとして名前を付けて保存します。
            </p>

            <form onSubmit={handleCreateNewEmailTemplate} className="space-y-4">
              <div>
                <label htmlFor="new-template-title-input" className="block text-base font-bold text-stone-800 mb-1">
                  テンプレート名称（例: 年末墓所大掃除のご案内）:
                </label>
                <input
                  id="new-template-title-input"
                  type="text"
                  required
                  value={newTemplateTitleInput}
                  onChange={(e) => setNewTemplateTitleInput(e.target.value)}
                  placeholder="時期や行事名を入力してください"
                  className="w-full bg-white text-stone-900 font-bold px-4 py-3 rounded-xl border-2 border-stone-300 focus:border-blue-600 outline-none text-base"
                />
              </div>

              <div className="pt-4 border-t-2 border-stone-200 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddingTemplateModal(false)}
                  className="flex-1 py-3 px-4 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold rounded-xl transition cursor-pointer"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  disabled={!newTemplateTitleInput.trim() || isSavingTemplateLoading}
                  className={`flex-1 py-3 px-4 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 ${
                    !newTemplateTitleInput.trim() || isSavingTemplateLoading
                      ? 'bg-stone-400 cursor-not-allowed'
                      : 'bg-emerald-700 hover:bg-emerald-800 cursor-pointer'
                  }`}
                >
                  {isSavingTemplateLoading ? '登録中...' : 'テンプレートを保存'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. 施主名簿CSV一括取り込みモーダル */}
      {showImportModal && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowImportModal(false);
          }}
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto cursor-pointer"
        >
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border-4 border-emerald-800 cursor-default my-8 space-y-6">
            <div className="flex items-start justify-between border-b-2 border-stone-200 pb-4">
              <div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                  最強オンボーディング機能
                </span>
                <h3 className="text-2xl font-extrabold text-stone-900 mt-1">
                  施主台帳CSV一括取り込み
                </h3>
                <p className="text-stone-600 text-sm mt-1">
                  霊園・お寺でお持ちの施主様名簿（CSV・エクセル）を取り込むと、全員分の専用アカウント・お墓データが一瞬で自動生成されます。
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="w-10 h-10 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 text-xl font-bold flex items-center justify-center cursor-pointer transition"
              >
                ✕
              </button>
            </div>

            {/* テンプレート案内 & ダウンロード */}
            <div className="bg-stone-50 border-2 border-stone-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-extrabold text-stone-900 text-base flex items-center gap-1.5">
                  <span>📄</span> CSVフォーマット見本
                </h4>
                <p className="text-xs text-stone-600 mt-0.5">
                  氏名、電話番号、郵便番号、住所、区画番号、正面文字、初期PWなどが入ったExcel対応CSVです。
                </p>
              </div>
              <button
                type="button"
                onClick={handleDownloadSampleCsv}
                className="px-4 py-2.5 bg-white hover:bg-stone-100 border-2 border-emerald-600 text-emerald-800 font-bold text-sm rounded-xl transition shadow-xs flex items-center gap-2 cursor-pointer shrink-0"
              >
                <span>⬇️</span> 見本CSVをダウンロード
              </button>
            </div>

            {/* ファイル選択エリア */}
            <div className="border-2 border-dashed border-stone-300 hover:border-emerald-500 rounded-2xl p-6 text-center bg-stone-50/50 transition">
              <input
                type="file"
                id="csv-file-input"
                accept=".csv,text/csv"
                onChange={handleCsvFileUpload}
                className="hidden"
              />
              <label
                htmlFor="csv-file-input"
                className="cursor-pointer block space-y-2"
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto text-2xl shadow-xs">
                  📁
                </div>
                <div className="text-base font-bold text-stone-900">
                  {csvFileName ? (
                    <span className="text-emerald-800">選択中: {csvFileName}</span>
                  ) : (
                    <span>クリックしてCSVファイルを選択</span>
                  )}
                </div>
                <p className="text-xs text-stone-500">
                  カンマ区切りテキスト（.csv）形式に対応しています（UTF-8 / Shift-JIS）
                </p>
              </label>
            </div>

            {/* 取り込みプレビュー */}
            {parsedPreviewClients.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-stone-900 text-base flex items-center gap-2">
                    <span>👀</span> 取り込みプレビュー（{parsedPreviewClients.length}名）
                  </h4>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md">
                    正常に解析されました
                  </span>
                </div>

                <div className="max-h-60 overflow-y-auto border-2 border-stone-200 rounded-xl">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-stone-100 text-stone-700 font-bold sticky top-0 border-b border-stone-200">
                      <tr>
                        <th className="p-2.5">氏名</th>
                        <th className="p-2.5">電話番号（ID）</th>
                        <th className="p-2.5">区画番号</th>
                        <th className="p-2.5">正面文字</th>
                        <th className="p-2.5">住所</th>
                        <th className="p-2.5">初期PW</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      {parsedPreviewClients.map((client, idx) => (
                        <tr key={idx} className="hover:bg-emerald-50/50 font-medium text-stone-800">
                          <td className="p-2.5 font-bold text-stone-900">{client.name} 様</td>
                          <td className="p-2.5">{client.phoneNumber}</td>
                          <td className="p-2.5">{client.sectionPlotNumber || '-'}</td>
                          <td className="p-2.5">{client.frontInscription || '-'}</td>
                          <td className="p-2.5 max-w-[180px] truncate">{client.address || '-'}</td>
                          <td className="p-2.5 font-mono text-emerald-800 font-bold">{client.initialPassword}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 完了通知 */}
            {importSuccessMsg && (
              <div className="p-4 bg-emerald-100 border-2 border-emerald-500 text-emerald-950 font-bold rounded-2xl text-center">
                {importSuccessMsg}
              </div>
            )}

            {/* フッターアクション */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t-2 border-stone-200">
              <button
                type="button"
                onClick={() => {
                  setShowImportModal(false);
                  setParsedPreviewClients([]);
                  setCsvFileName('');
                }}
                className="px-5 py-3 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold rounded-xl transition cursor-pointer"
              >
                閉じる
              </button>
              <button
                type="button"
                disabled={parsedPreviewClients.length === 0 || importLoading}
                onClick={handleExecuteImport}
                className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 disabled:bg-stone-400 text-white font-bold rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                <span>{importLoading ? 'インポート実行中...' : `この内容で一括登録する（${parsedPreviewClients.length}件）`}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5.5 施主お墓写真・情報 編集モーダル */}
      {editingClient && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditingClient(null);
          }}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm overflow-y-auto p-2 sm:p-6 flex justify-center items-start cursor-pointer"
        >
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl border-4 border-amber-500 cursor-default my-2 sm:my-6 flex flex-col max-h-[92vh]">
            {/* スティッキーヘッダー（特大文字でも上に切れず常に表示） */}
            <div className="sticky top-0 z-20 bg-white pb-3 border-b-2 border-stone-200 flex items-center justify-between shrink-0">
              <div>
                <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
                  施主お墓情報 登録・変更
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-stone-900 mt-1 flex items-center gap-2">
                  <span>📸</span> {editingClient.name} 様のお墓情報
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingClient(null)}
                className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold flex items-center justify-center cursor-pointer transition shrink-0"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveGraveInfo} className="flex-1 overflow-y-auto pt-4 pr-1 space-y-5 text-xs sm:text-sm">
              {/* お墓特定用写真（正面写真 ＆ 側面建立者写真の2枚） */}
              <div className="bg-stone-50 p-4 rounded-2xl border-2 border-stone-200 space-y-4">
                <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                  <span className="font-extrabold text-stone-900 text-sm flex items-center gap-1.5">
                    <span>🪦</span> お墓特定用 写真登録（DMハガキ・マイページ掲載）
                  </span>
                  <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                    正面 ＋ 側面の2枚でお墓を100%特定
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* ① 正面写真 */}
                  <div className="bg-white p-3 rounded-xl border border-stone-200 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-stone-800 text-xs flex items-center gap-1">
                        <span className="w-4 h-4 rounded-full bg-emerald-700 text-white text-[10px] font-black inline-flex items-center justify-center">1</span>
                        正面写真（正面文字）
                      </label>
                      <span className="text-[10px] text-stone-400 font-medium">特定必須</span>
                    </div>

                    <div className="w-full h-32 rounded-xl bg-stone-100 border-2 border-dashed border-stone-300 overflow-hidden flex items-center justify-center relative">
                      {editGraveForm.photoUrl ? (
                        <img
                          src={editGraveForm.photoUrl}
                          alt="正面写真"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs text-stone-400 font-bold text-center">
                          正面写真<br />未登録
                        </span>
                      )}
                    </div>

                    <label className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-stone-800 hover:bg-stone-900 text-white font-bold rounded-xl text-xs shadow-xs cursor-pointer transition">
                      <span>📷 正面を撮影 / 選択</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = () => {
                              setEditGraveForm((prev) => ({
                                ...prev,
                                photoUrl: reader.result as string,
                              }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>

                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() =>
                          setEditGraveForm((prev) => ({
                            ...prev,
                            photoUrl: '/images/grave_front_example.jpg',
                          }))
                        }
                        className="text-[10px] text-blue-700 underline font-bold"
                      >
                        正面見本写真
                      </button>
                    </div>
                  </div>

                  {/* ② 側面写真 */}
                  <div className="bg-white p-3 rounded-xl border border-stone-200 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-stone-800 text-xs flex items-center gap-1">
                        <span className="w-4 h-4 rounded-full bg-emerald-700 text-white text-[10px] font-black inline-flex items-center justify-center">2</span>
                        側面写真（建立者名）
                      </label>
                      <span className="text-[10px] text-stone-400 font-medium">誤認防止用</span>
                    </div>

                    <div className="w-full h-32 rounded-xl bg-stone-100 border-2 border-dashed border-stone-300 overflow-hidden flex items-center justify-center relative">
                      {editGraveForm.builderPhotoUrl ? (
                        <img
                          src={editGraveForm.builderPhotoUrl}
                          alt="側面写真"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs text-stone-400 font-bold text-center">
                          側面写真<br />未登録
                        </span>
                      )}
                    </div>

                    <label className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-stone-800 hover:bg-stone-900 text-white font-bold rounded-xl text-xs shadow-xs cursor-pointer transition">
                      <span>📷 側面を撮影 / 選択</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = () => {
                              setEditGraveForm((prev) => ({
                                ...prev,
                                builderPhotoUrl: reader.result as string,
                              }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>

                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() =>
                          setEditGraveForm((prev) => ({
                            ...prev,
                            builderPhotoUrl: '/images/grave_side_builder_example.jpg',
                          }))
                        }
                        className="text-[10px] text-blue-700 underline font-bold"
                      >
                        側面見本写真
                      </button>
                    </div>
                  </div>
                </div>

                {/* ③ 代行業者による作業完了写真（実績がある場合） */}
                {(() => {
                  const matchedClient = clientsSummary.find((c) => c.id === editingClient.id);
                  if (matchedClient?.latestAfterPhotoUrl) {
                    return (
                      <div className="bg-emerald-50 border-2 border-emerald-400 rounded-xl p-3 flex items-center gap-3">
                        <div className="w-16 h-16 rounded-lg bg-stone-200 overflow-hidden shrink-0 border border-emerald-600">
                          <img
                            src={matchedClient.latestAfterPhotoUrl}
                            alt="作業完了写真"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="text-xs space-y-0.5 min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 bg-emerald-800 text-white font-black text-[10px] rounded">
                              ✓ 作業代行実績あり
                            </span>
                            <span className="font-bold text-emerald-950">提携業者による最新清掃・お供花写真</span>
                          </div>
                          <p className="text-emerald-900 text-[11px] leading-tight">
                            代行業者が現地作業完了時に撮影・提出した最新写真です。施主様のマイページにもリアルタイムで共有されています。
                          </p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">区画番号:</label>
                  <input
                    type="text"
                    value={editGraveForm.sectionPlotNumber}
                    onChange={(e) =>
                      setEditGraveForm((prev) => ({ ...prev, sectionPlotNumber: e.target.value }))
                    }
                    placeholder="例: 東3区 12番"
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-bold bg-white text-stone-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">正面彫刻文字:</label>
                  <input
                    type="text"
                    value={editGraveForm.frontInscription}
                    onChange={(e) =>
                      setEditGraveForm((prev) => ({ ...prev, frontInscription: e.target.value }))
                    }
                    placeholder="例: 先祖代々之墓"
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-bold bg-white text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">建立者名・建立年月:</label>
                <input
                  type="text"
                  value={editGraveForm.builderName}
                  onChange={(e) =>
                    setEditGraveForm((prev) => ({ ...prev, builderName: e.target.value }))
                  }
                  placeholder="例: 昭和五十年八月 山田太郎建之"
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-medium bg-white text-stone-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">施主お電話番号（ログインID）:</label>
                  <input
                    type="tel"
                    value={editGraveForm.phoneNumber}
                    onChange={(e) =>
                      setEditGraveForm((prev) => ({ ...prev, phoneNumber: e.target.value }))
                    }
                    placeholder="090-XXXX-XXXX"
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-mono bg-white text-stone-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">施主メールアドレス:</label>
                  <input
                    type="email"
                    value={editGraveForm.email}
                    onChange={(e) =>
                      setEditGraveForm((prev) => ({ ...prev, email: e.target.value }))
                    }
                    placeholder="example@email.com"
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-medium bg-white text-stone-900"
                  />
                </div>
              </div>

              <div className="sticky bottom-0 bg-white/95 backdrop-blur-xs pt-3 pb-1 border-t border-stone-200 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setEditingClient(null)}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold cursor-pointer transition"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  disabled={isSavingGraveInfo}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-stone-950 font-black shadow-md flex items-center gap-2 cursor-pointer transition"
                >
                  <span>💾</span> {isSavingGraveInfo ? '保存中...' : 'お墓情報を保存する'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. パーソナライズ案内DM（ハガキ/差込用紙）印刷プレビューモーダル */}
      {showDmModal && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowDmModal(false);
          }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm overflow-y-auto p-2 sm:p-6 flex justify-center items-start cursor-pointer"
        >
          <div className="bg-stone-100 rounded-3xl max-w-5xl w-full p-4 sm:p-6 shadow-2xl border-4 border-blue-900 cursor-default my-2 sm:my-6 flex flex-col max-h-[94vh]">
            {/* スティッキーヘッダー（常に上部に固定され、特大フォントでも絶対に隠れない） */}
            <div className="sticky top-0 z-30 bg-stone-100/95 backdrop-blur-xs pb-3 pt-1 border-b-2 border-stone-300 no-print flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
              <div>
                <span className="text-xs font-bold text-blue-900 bg-blue-100 px-3 py-0.5 rounded-full">
                  印刷プレビュー（全{targetPrintClients.length}名）
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-stone-900 mt-1 flex items-center gap-2">
                  <span>📮</span> パーソナライズ案内DM（ハガキ・差込用紙）
                </h3>
                <p className="text-stone-600 text-xs mt-0.5">
                  差出人名義: <strong>{currentCompany?.name} 管理事務所</strong>（施主様専用QRコード自動印字済み）
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* 印刷レイアウト切替 */}
                <div className="flex bg-white rounded-xl p-1 border-2 border-stone-300 shadow-xs">
                  <button
                    type="button"
                    onClick={() => setDmPrintLayout('a4_postcard')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                      dmPrintLayout === 'a4_postcard'
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <span>📄</span> A4用紙でハガキ確認PDF（推奨）
                  </button>
                  <button
                    type="button"
                    onClick={() => setDmPrintLayout('postcard')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                      dmPrintLayout === 'postcard'
                        ? 'bg-blue-700 text-white shadow-xs'
                        : 'text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <span>📮</span> はがき直接印刷
                  </button>
                  <button
                    type="button"
                    onClick={() => setDmPrintLayout('a4')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                      dmPrintLayout === 'a4'
                        ? 'bg-blue-700 text-white shadow-xs'
                        : 'text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <span>📜</span> A4封書案内状
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer text-sm"
                >
                  <span>🖨️</span> 印刷する（PDF保存も可）
                </button>
                <button
                  type="button"
                  onClick={() => setShowDmModal(false)}
                  className="w-9 h-9 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold flex items-center justify-center cursor-pointer shadow-xs"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* A4ハガキ確認PDFモードの案内メモ */}
            {dmPrintLayout === 'a4_postcard' && (
              <div className="bg-emerald-50 border-2 border-emerald-300 p-2.5 rounded-xl text-emerald-950 text-xs flex items-center gap-2 no-print my-2 shrink-0">
                <span className="text-lg">💡</span>
                <span>
                  <strong>ハガキ確認・PDF保存に最適化されています：</strong>
                  一般的なPC・ブラウザの「PDFに保存」は用紙サイズがA4基準のため、A4用紙の中央に実寸のハガキ（100×148mm）と切り取り破線を配置しています。レイアウト崩れなくそのままPDF保存やA4印刷が可能です。
                </span>
              </div>
            )}

            {/* 印刷対象DMシート群（中身がスムーズに全画面スクロール可能） */}
            <div id="printable-dm-container" className="flex-1 overflow-y-auto space-y-12 p-3 sm:p-6 bg-stone-200/60 rounded-2xl mt-1">
              {targetPrintClients.map((client, idx) => {
                const cleanPhone = (client.phoneNumber || client.phone || '').replace(/\D/g, '');
                const pass = client.initialPassword || (cleanPhone.length >= 4 ? cleanPhone.slice(-4) : 'client1234');
                const qrUrl = qrCodeUrls[client.id];
                const postalDigits = (client.postalCode || '7900001').replace(/\D/g, '').padEnd(7, ' ');

                // ハガキ表面（宛名面）JSX生成
                const renderPostcardFront = () => (
                  <div
                    className="postcard-sheet bg-white text-stone-900 rounded-2xl shadow-xl mx-auto p-7 flex flex-col justify-between border border-stone-300 relative overflow-hidden"
                    style={{ width: '100mm', minHeight: '148mm', height: '148mm', boxSizing: 'border-box' }}
                  >
                    {/* 上部ヘッダー：料金別納郵便 & 郵便番号7桁赤枠 */}
                    <div>
                      <div className="flex items-start justify-between">
                        {/* 料金別納郵便マーク */}
                        <div className="w-13 h-13 border-2 border-stone-800 rounded-full flex flex-col items-center justify-center p-0.5 text-center leading-tight">
                          <span className="text-[7px] font-bold border-b border-stone-700 w-full pb-0.5">料金別納</span>
                          <span className="text-[7px] font-bold pt-0.5">郵便</span>
                        </div>

                        {/* 郵便番号赤枠（3桁 - 4桁） */}
                        <div className="flex items-center gap-1 pt-1">
                          <div className="flex gap-0.5">
                            {[0, 1, 2].map((i) => (
                              <div key={i} className="w-5 h-7 border-2 border-rose-500 rounded-xs flex items-center justify-center font-mono font-bold text-sm text-stone-900">
                                {postalDigits[i] || ''}
                              </div>
                            ))}
                          </div>
                          <span className="text-rose-500 font-bold text-xs">-</span>
                          <div className="flex gap-0.5">
                            {[3, 4, 5, 6].map((i) => (
                              <div key={i} className="w-5 h-7 border-2 border-rose-500 rounded-xs flex items-center justify-center font-mono font-bold text-sm text-stone-900">
                                {postalDigits[i] || ''}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* 宛先住所 */}
                      <div className="mt-8 pl-6 pr-2 space-y-1">
                        <p className="text-xs text-stone-700 font-medium leading-relaxed">
                          {client.address || `${currentCompany?.locationAddress} 周辺`}
                        </p>
                      </div>

                      {/* 宛名（施主氏名・様） */}
                      <div className="mt-4 pl-8 pr-2">
                        <h2 className="text-2xl font-black text-stone-900 tracking-wider flex items-baseline gap-2 font-serif">
                          <span>{client.name}</span>
                          <span className="text-lg font-bold text-stone-800">様</span>
                        </h2>
                        <p className="text-[10px] text-stone-400 mt-1">
                          （お墓区画: {client.sectionPlotNumber || '登録済'} / 「{client.frontInscription || '山田家先祖代々之墓'}」様）
                        </p>
                      </div>
                    </div>

                    {/* 下部：差出人情報（霊園管理事務所） */}
                    <div className="pt-3 border-t-2 border-stone-300 text-[10px] text-stone-700 space-y-0.5">
                      <p className="font-extrabold text-stone-900 text-xs">
                        差出人：{currentCompany?.name} 管理事務所
                      </p>
                      <p>〒790-0001 {currentCompany?.locationAddress}</p>
                      <p className="font-mono">TEL: {currentCompany?.phoneNumber}</p>
                      <p className="text-[9px] text-stone-500 pt-0.5">
                        ※本状は当霊園に墓所をお持ちの施主様へ大切なお知らせをお届けしております。
                      </p>
                    </div>
                  </div>
                );

                // ハガキ裏面（案内面）JSX生成：ゆったりとした高級感あるレイアウト
                const renderPostcardBack = () => (
                  <div
                    className="postcard-sheet bg-white text-stone-900 rounded-2xl shadow-xl mx-auto px-4 py-5 flex flex-col justify-between border-2 border-emerald-800/80 relative overflow-hidden"
                    style={{ width: '100mm', minHeight: '148mm', height: '148mm', boxSizing: 'border-box' }}
                  >
                    {/* 上部ヘッダー：格式あるグリーン帯 ＆ ゆったりタイトル */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between pb-1.5 border-b-2 border-emerald-800">
                        <span className="text-[9px] font-black text-emerald-950 tracking-wider bg-emerald-100 px-2.5 py-0.5 rounded">
                          {currentCompany?.name} 公認
                        </span>
                        <span className="text-[9.5px] font-bold text-stone-600">
                          {client.name} 様 専用案内状
                        </span>
                      </div>

                      <div className="text-center pt-1 pb-0.5">
                        <h3 className="text-sm font-black text-emerald-950 tracking-tight leading-snug">
                          オンラインお墓管理・お参り清掃代行のご案内
                        </h3>
                        <p className="text-[9px] text-stone-600 mt-0.5 leading-tight">
                          施主様のお墓情報と写真は当管理事務所にてすでに事前登録済みです。
                        </p>
                      </div>

                      {/* ★ 正面写真 ＆ 側面写真の2枚横並びエリア（高さを2倍に拡大！） */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        {/* 左：正面写真 */}
                        <div className="border-2 border-stone-300 rounded-xl overflow-hidden bg-stone-100 relative shadow-xs flex flex-col">
                          <div className="h-38 w-full overflow-hidden">
                            <img
                              src={client.photoUrl || '/images/grave_front_example.jpg'}
                              alt="正面写真"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="bg-stone-900/85 text-white text-[8.5px] font-bold px-2 py-1 text-center truncate">
                            【正面】{client.frontInscription ? `「${client.frontInscription}」` : '正面文字'}
                          </div>
                        </div>

                        {/* 右：側面写真 */}
                        <div className="border-2 border-stone-300 rounded-xl overflow-hidden bg-stone-100 relative shadow-xs flex flex-col">
                          <div className="h-38 w-full overflow-hidden">
                            <img
                              src={client.builderPhotoUrl || '/images/grave_side_builder_example.jpg'}
                              alt="側面写真"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="bg-stone-900/85 text-white text-[8.5px] font-bold px-2 py-1 text-center truncate">
                            【側面】{client.builderName ? client.builderName : '建立者名'}
                          </div>
                        </div>
                      </div>

                      {/* 登録情報バー（区画番号・正面彫刻・建立者名） */}
                      <div className="bg-emerald-50/90 border border-emerald-300 rounded-xl px-2.5 py-1.5 flex items-center justify-between text-[9px] shadow-2xs">
                        <span className="font-extrabold text-emerald-950">
                          区画: <strong className="text-emerald-900 text-xs">{client.sectionPlotNumber || '登録済'}</strong>
                        </span>
                        <span className="text-stone-600 truncate max-w-[140px] font-medium">
                          建立: {client.builderName || '確認済'}
                        </span>
                        <span className="bg-emerald-700 text-white text-[8.5px] font-black px-2 py-0.5 rounded">
                          特定完了
                        </span>
                      </div>
                    </div>

                    {/* 中央：QRコード & ログイン情報（約1.3倍に拡大・ゆったり配置） */}
                    <div className="bg-stone-50 border-2 border-stone-200 rounded-2xl p-2.5 flex items-center justify-between gap-3 shadow-xs my-1">
                      <div className="space-y-1 flex-1 min-w-0">
                        <span className="text-[8.5px] font-black bg-emerald-800 text-white px-2 py-0.5 rounded inline-block">
                          初回ログインID・パスワード
                        </span>
                        <p className="text-[11px] text-stone-800 truncate">
                          ID: <strong className="font-mono text-emerald-950 font-bold text-xs">{client.phoneNumber || cleanPhone}</strong>
                        </p>
                        <p className="text-[11px] text-stone-800 truncate">
                          PASS: <strong className="font-mono text-emerald-950 font-bold text-xs">{pass}</strong>
                        </p>
                        <p className="text-[8px] text-stone-500 leading-tight">
                          ※スマホのカメラで右のQRを読み取ると自動ログインします。
                        </p>
                      </div>

                      {/* QRコード（1.3倍） */}
                      <div className="w-21 h-21 bg-white p-1.5 border-2 border-stone-300 rounded-xl shrink-0 flex items-center justify-center shadow-2xs">
                        {qrUrl ? (
                          <img src={qrUrl} alt="専用QRコード" className="w-full h-full object-contain" />
                        ) : (
                          <span className="text-[9px] text-stone-400">生成中</span>
                        )}
                      </div>
                    </div>

                    {/* 下部：簡単3ステップ案内（高さを2倍に拡大！） & お問い合わせ */}
                    <div className="space-y-2 pt-1 border-t border-stone-200 text-center">
                      <div className="grid grid-cols-3 gap-1.5 text-[9.5px] font-extrabold text-stone-800">
                        <div className="bg-stone-100 py-2 rounded-lg border border-stone-200 shadow-2xs flex items-center justify-center">
                          ① QR読取
                        </div>
                        <div className="bg-stone-100 py-2 rounded-lg border border-stone-200 shadow-2xs flex items-center justify-center">
                          ② お墓確認
                        </div>
                        <div className="bg-emerald-100 text-emerald-950 py-2 rounded-lg border border-emerald-300 shadow-2xs flex items-center justify-center">
                          ③ プラン選ぶだけ
                        </div>
                      </div>
                      <p className="text-[8.5px] text-stone-600 font-medium">
                        お電話注文も承ります: <strong>{currentCompany?.phoneNumber}</strong>（{currentCompany?.name}）
                      </p>
                    </div>
                  </div>
                );

                if (dmPrintLayout === 'a4_postcard') {
                  // ==================== A4用紙にハガキ原寸をセンタリング配置（確認・PDF保存に最適） ====================
                  return (
                    <div key={client.id || idx} className="space-y-12">
                      {/* A4 1ページ目：表面（宛名面） */}
                      <div className="a4-postcard-page bg-white rounded-3xl p-8 shadow-xl border border-stone-300 mx-auto flex flex-col justify-between items-center"
                        style={{ width: '210mm', minHeight: '297mm', height: '297mm', boxSizing: 'border-box' }}
                      >
                        <div className="w-full flex items-center justify-between text-xs text-stone-500 border-b border-stone-200 pb-2 mb-4">
                          <span className="font-bold">📄 A4用紙でハガキ確認PDF（1/2：表面 宛名面）</span>
                          <span>施主様: {client.name} 様</span>
                        </div>

                        {/* トンボ線・切り取り枠 */}
                        <div className="border-2 border-dashed border-stone-400 p-2 rounded-2xl relative">
                          <span className="absolute -top-3 left-4 bg-white px-2 text-[10px] text-stone-500 font-mono">
                            ✂️ ハガキ実寸（100mm × 148mm）切り取り枠
                          </span>
                          {renderPostcardFront()}
                        </div>

                        <div className="w-full text-center text-[10px] text-stone-400 pt-4 border-t border-stone-200">
                          ※ブラウザで「用紙サイズ：A4」「余白：なし」を選択してPDF保存してください。ハガキ原寸のまま歪まずに保存できます。
                        </div>
                      </div>

                      {/* A4 2ページ目：裏面（案内面） */}
                      <div className="a4-postcard-page bg-white rounded-3xl p-8 shadow-xl border border-stone-300 mx-auto flex flex-col justify-between items-center"
                        style={{ width: '210mm', minHeight: '297mm', height: '297mm', boxSizing: 'border-box' }}
                      >
                        <div className="w-full flex items-center justify-between text-xs text-stone-500 border-b border-stone-200 pb-2 mb-4">
                          <span className="font-bold">📄 A4用紙でハガキ確認PDF（2/2：裏面 案内面）</span>
                          <span>施主様専用QRコード印字済み</span>
                        </div>

                        {/* トンボ線・切り取り枠 */}
                        <div className="border-2 border-dashed border-stone-400 p-2 rounded-2xl relative">
                          <span className="absolute -top-3 left-4 bg-white px-2 text-[10px] text-stone-500 font-mono">
                            ✂️ ハガキ実寸（100mm × 148mm）切り取り枠
                          </span>
                          {renderPostcardBack()}
                        </div>

                        <div className="w-full text-center text-[10px] text-stone-400 pt-4 border-t border-stone-200">
                          ※施主様がスマホで上記QRコードを読み込むと、写真とお墓情報が事前セットされた注文画面が開きます。
                        </div>
                      </div>
                    </div>
                  );
                } else if (dmPrintLayout === 'postcard') {
                  // ==================== ハガキ直接印刷（100×148mm） ====================
                  return (
                    <div key={client.id || idx} className="space-y-8">
                      {renderPostcardFront()}
                      {renderPostcardBack()}
                    </div>
                  );
                } else {
                  // ==================== A4封書用紙版（公式案内状レター・三つ折り対応） ====================
                  return (
                    <div
                      key={client.id || idx}
                      className="a4-sheet bg-white text-stone-900 rounded-2xl shadow-xl mx-auto p-10 flex flex-col justify-between border border-stone-300 space-y-6"
                      style={{ width: '210mm', minHeight: '297mm', boxSizing: 'border-box' }}
                    >
                      {/* 上部：公式レターヘッダー */}
                      <div className="space-y-4">
                        <div className="flex items-start justify-between border-b-2 border-stone-300 pb-3">
                          <div>
                            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded">
                              {currentCompany?.name} 公式ご案内状
                            </span>
                            <h2 className="text-2xl font-black text-stone-900 mt-2 font-serif">
                              {client.name} 様
                            </h2>
                            <p className="text-xs text-stone-600 mt-0.5">
                              〒{client.postalCode || '790-0001'} {client.address || `${currentCompany?.locationAddress} 周辺`}
                            </p>
                          </div>

                          <div className="text-right text-xs text-stone-600 space-y-1">
                            <p className="font-mono text-stone-500">
                              発行日: {new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                            <p className="font-extrabold text-stone-900 text-sm">{currentCompany?.name}</p>
                            <p>所在地: {currentCompany?.locationAddress}</p>
                            <p className="font-mono">電話番号: {currentCompany?.phoneNumber}</p>
                          </div>
                        </div>

                        {/* 表題 */}
                        <div className="text-center py-2">
                          <h3 className="text-xl font-extrabold text-emerald-950 border-b-2 border-emerald-800 pb-2 inline-block px-8">
                            オンラインお墓管理・お参り清掃代行サービス 開設のお知らせ
                          </h3>
                        </div>

                        {/* 挨拶文 */}
                        <div className="text-xs text-stone-700 leading-relaxed space-y-2 bg-stone-50 p-4 rounded-xl border border-stone-200">
                          <p>拝啓　時下ますますご清栄のこととお慶び申し上げます。平素は当霊園の護持・運営に格別のご理解を賜り、厚く御礼申し上げます。</p>
                          <p>
                            さて、近年「遠方にお住まいで墓参りが難しい」「猛暑や高齢のため足腰に不安があり、定期的な草刈りや墓石の清掃が困難」というご相談を多数いただいております。
                            つきましては、当霊園公認の認定作業パートナーによる「お墓参り・清掃代行サービス」をオンラインから手軽にご利用いただける専用ポータルを開設いたしました。
                          </p>
                          <p className="font-bold text-emerald-900">
                            施主様のお手間を省くため、お墓の正面写真・区画番号・建立者名等の基本情報は、当管理事務所にてすでに事前登録を済ませております。
                          </p>
                        </div>

                        {/* 事前登録済みお墓情報 */}
                        <div className="border-2 border-emerald-800 rounded-2xl p-5 bg-white space-y-3">
                          <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                            <span className="font-extrabold text-sm text-emerald-950 flex items-center gap-2">
                              <span>🪦</span> {client.name} 様の事前登録お墓情報（ご確認）
                            </span>
                            <span className="text-[11px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
                              写真・区画特定済み（再入力不要）
                            </span>
                          </div>

                          <div className="grid grid-cols-12 gap-5 items-center">
                            {/* お墓特定写真2枚（正面・側面） */}
                            <div className="col-span-5 grid grid-cols-2 gap-2">
                              <div className="space-y-1">
                                <div className="aspect-4/3 rounded-xl overflow-hidden border-2 border-stone-300 bg-stone-100 relative">
                                  <img
                                    src={client.photoUrl || '/images/grave_front_example.jpg'}
                                    alt="正面写真"
                                    className="w-full h-full object-cover"
                                  />
                                  <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] font-bold text-center py-0.5">
                                    正面写真
                                  </span>
                                </div>
                              </div>
                              <div className="space-y-1">
                                <div className="aspect-4/3 rounded-xl overflow-hidden border-2 border-stone-300 bg-stone-100 relative">
                                  <img
                                    src={client.builderPhotoUrl || '/images/grave_side_builder_example.jpg'}
                                    alt="側面写真"
                                    className="w-full h-full object-cover"
                                  />
                                  <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] font-bold text-center py-0.5">
                                    側面（建立者名）
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="col-span-7 space-y-2 text-xs">
                              <div className="text-lg font-black text-stone-900 font-serif">
                                正面文字:「{client.frontInscription || '山田家先祖代々之墓'}」様墓
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-stone-700 font-medium">
                                <div className="bg-stone-50 p-2 rounded-lg border border-stone-200">
                                  区画番号: <strong className="text-emerald-900">{client.sectionPlotNumber || '東区 5列 12番'}</strong>
                                </div>
                                <div className="bg-stone-50 p-2 rounded-lg border border-stone-200">
                                  霊園名: <strong>{currentCompany?.name}</strong>
                                </div>
                              </div>
                              {client.builderName && (
                                <p className="text-stone-600 font-bold">建立者名: {client.builderName}</p>
                              )}
                              {client.notes && (
                                <p className="text-stone-500 text-[11px]">備考: {client.notes}</p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* 専用QRコードとログイン案内 */}
                        <div className="bg-gradient-to-r from-emerald-900 to-emerald-950 text-white rounded-2xl p-5 flex items-center justify-between gap-6 shadow-md">
                          <div className="space-y-2 flex-1">
                            <span className="text-xs font-bold bg-emerald-700 text-emerald-100 px-3 py-1 rounded-full inline-block">
                              専用QRコード（スマホをかざすだけで完了）
                            </span>
                            <p className="text-sm font-bold text-white">
                              スマホのカメラで右のQRコードを読み取るだけで、ログイン情報とお墓情報が自動的にセットされた画面が開きます。
                            </p>
                            <div className="bg-white/10 p-2.5 rounded-xl text-xs space-y-1 font-mono">
                              <p>施主様ログインID: <strong className="text-amber-300 text-sm">{client.phoneNumber || cleanPhone}</strong></p>
                              <p>初期パスワード: <strong className="text-amber-300 text-sm">{pass}</strong></p>
                            </div>
                          </div>

                          <div className="w-28 h-28 bg-white p-2 rounded-2xl shadow-md shrink-0 flex items-center justify-center">
                            {qrUrl ? (
                              <img src={qrUrl} alt="専用ログインQRコード" className="w-full h-full object-contain" />
                            ) : (
                              <span className="text-xs text-stone-400">生成中...</span>
                            )}
                          </div>
                        </div>

                        {/* 簡単3ステップ注文案内 */}
                        <div className="border-2 border-stone-200 rounded-2xl p-4 bg-stone-50">
                          <h4 className="text-xs font-extrabold text-stone-900 mb-2.5 text-center">
                            【わずか3ステップ】スマホでカンタン予約・完了報告
                          </h4>
                          <div className="grid grid-cols-3 gap-3 text-center text-xs">
                            <div className="bg-white p-2.5 rounded-xl border border-stone-200">
                              <div className="font-bold text-emerald-800 mb-1">STEP 1</div>
                              <p className="text-[11px] text-stone-600">上記QRコードをスマホで読み取り</p>
                            </div>
                            <div className="bg-white p-2.5 rounded-xl border border-stone-200">
                              <div className="font-bold text-emerald-800 mb-1">STEP 2</div>
                              <p className="text-[11px] text-stone-600">自分のお墓写真を確認しプラン選択</p>
                            </div>
                            <div className="bg-white p-2.5 rounded-xl border border-stone-200">
                              <div className="font-bold text-emerald-800 mb-1">STEP 3</div>
                              <p className="text-[11px] text-stone-600">希望日を指定して完了！写真レポート納品</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 下部フッター */}
                      <div className="pt-3 border-t-2 border-stone-300 text-center text-xs text-stone-500">
                        ご不明な点やWeb操作が難しい施主様は、管理事務所（TEL: {currentCompany?.phoneNumber}）までお気軽にお電話ください。
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          </div>
        </div>
      )}

      {/* 印刷・PDF保存専用CSSスタイル（ハガキ＆A4両対応） */}
      <style jsx global>{`
        @media print {
          @page {
            margin: 0;
            size: auto;
          }
          body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          body * {
            visibility: hidden;
          }
          #printable-contract-container,
          #printable-contract-container *,
          #printable-dm-container,
          #printable-dm-container * {
            visibility: visible;
          }
          #printable-contract-container,
          #printable-dm-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            color: #000 !important;
          }
          .postcard-sheet {
            width: 100mm !important;
            min-height: 148mm !important;
            height: 148mm !important;
            box-shadow: none !important;
            border: 1px solid #ddd !important;
            break-after: page;
            page-break-after: always;
            margin: 0 auto 10mm auto !important;
            box-sizing: border-box !important;
          }
          .a4-sheet {
            width: 210mm !important;
            min-height: 297mm !important;
            box-shadow: none !important;
            border: none !important;
            break-after: page;
            page-break-after: always;
            margin: 0 auto !important;
            padding: 15mm 18mm !important;
            box-sizing: border-box !important;
          }
          .a4-postcard-page {
            width: 210mm !important;
            min-height: 297mm !important;
            height: 297mm !important;
            box-shadow: none !important;
            border: none !important;
            break-after: page !important;
            page-break-after: always !important;
            margin: 0 auto !important;
            padding: 0 !important;
            box-sizing: border-box !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

export default function CemeteryPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xl font-bold text-stone-600">読み込み中...</div>}>
      <CemeteryDashboard />
    </Suspense>
  );
}
