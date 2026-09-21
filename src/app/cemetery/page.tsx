'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CemeteryCompany, User, Order, VendorContract } from '@/types/firestore';
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
  const [loading, setLoading] = useState(false);

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

  // 初期データ読み込み（APIから最新情報を取得、フォールバックあり）
  useEffect(() => {
    async function loadData() {
      try {
        const [cemRes, venRes, ordRes] = await Promise.all([
          fetch('/api/cemetery-companies'),
          fetch('/api/vendors'),
          fetch('/api/orders'),
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
      } catch (e) {
        console.warn('API fetch error, using local fallback:', e);
      }
    }
    loadData();
  }, []);

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

  return (
    <div className="min-h-screen bg-stone-100 text-slate-900 pb-24">
      {/* ⚠️ 本部管理者から来た場合のみ表示する戻りバー */}
      {fromSource === 'admin' && (
        <aside aria-label="管理者プレビュー案内" className="bg-amber-500 text-slate-950 font-bold px-6 py-3 shadow-md flex items-center justify-between">
          <div className="flex items-center gap-3 text-lg">
            <span className="text-2xl">⚠️</span>
            <span>【本部管理者プレビュー】現在、本部権限で墓地管理会社の画面を表示しています</span>
          </div>
          <Link
            href="/admin"
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-base rounded-xl font-bold transition shadow"
          >
            ← 本部統括画面に戻る
          </Link>
        </aside>
      )}

      {/* ヘッダー（ご高齢の方も見やすい特大フォント＆高コントラスト） */}
      <header className="bg-stone-800 text-white shadow-lg sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="px-3 py-1 bg-amber-400 text-stone-900 text-sm font-bold rounded-md">
                霊園・墓地管理所 専用画面
              </span>
              <span className="text-stone-300 text-sm">文字サイズ：特大</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {currentCompany?.name}
            </h1>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* 本部からのプレビューでない場合は、ログアウトボタンを表示 */}
            {fromSource !== 'admin' && (
              <button
                onClick={handleLogout}
                className="px-5 py-2.5 bg-stone-700 hover:bg-stone-600 text-white text-base font-bold rounded-xl border border-stone-500 transition"
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
          <div className="mb-6 pb-6 border-b-2 border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setContractPrintTargetVendor(null);
                  setShowContractTemplateModal(true);
                }}
                className="px-5 py-3.5 bg-stone-800 hover:bg-stone-900 active:scale-95 text-white text-lg font-bold rounded-2xl shadow-md transition flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <span>📄</span> 契約書雛形（PDF）を印刷・DL
              </button>
              <button
                type="button"
                onClick={() => setIsAddingNewVendor(true)}
                className="px-5 py-3.5 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white text-lg font-bold rounded-2xl shadow-md transition flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <span>➕</span> 新規代行業者・便利屋さんを追加
              </button>
              <button
                type="button"
                onClick={handleOpenVendorEdit}
                className="px-5 py-3.5 bg-blue-700 hover:bg-blue-800 active:scale-95 text-white text-lg font-bold rounded-2xl shadow-md transition flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <span>🤝</span> 提携の追加・解除（{affiliatedVendors.length}社）
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
                                setContractPrintTargetVendor(vendor);
                                setShowContractTemplateModal(true);
                              }}
                              className="py-2.5 px-3 bg-white hover:bg-stone-100 border border-stone-300 text-stone-800 font-bold rounded-xl text-sm flex items-center justify-center gap-1 cursor-pointer transition"
                              title="この業者の名前入りの契約書を印刷・ダウンロード"
                            >
                              <span>📄</span> 雛形印刷
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
                      href={`/vendor?vendorId=${order.vendorId}&from=cemetery&companyId=${currentCompany.id}`}
                      className="w-full py-3.5 px-4 bg-stone-800 hover:bg-stone-900 text-white text-base font-bold rounded-2xl text-center shadow transition"
                    >
                      担当業者の報告画面を見る →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* 編集モーダル */}
      {isEditingCompany && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border-4 border-amber-500 max-h-[90vh] overflow-y-auto">
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
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border-4 border-blue-600 max-h-[90vh] flex flex-col">
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
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border-4 border-emerald-600 max-h-[90vh] overflow-y-auto">
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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto no-print-bg">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[95vh] flex flex-col shadow-2xl overflow-hidden my-4">
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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl">
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
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

      {/* 印刷・PDF保存専用CSSスタイル */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-contract-container,
          #printable-contract-container * {
            visibility: visible;
          }
          #printable-contract-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 15mm;
            background: white !important;
            color: #000 !important;
          }
          .no-print {
            display: none !important;
          }
          .no-print-bg {
            background: none !important;
            position: static !important;
            padding: 0 !important;
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
