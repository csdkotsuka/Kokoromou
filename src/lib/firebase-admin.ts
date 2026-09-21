import { getApps, initializeApp, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore, FieldValue } from 'firebase-admin/firestore';
import {
  SAMPLE_ADMIN_INFO,
  SAMPLE_CEMETERY_COMPANIES,
  SAMPLE_VENDORS,
  SAMPLE_ORDERS,
  SAMPLE_ACCOUNTS,
  SAMPLE_REPORTS,
} from '@/mocks/sample-data';
import { CemeteryCompany, PlatformAdminInfo, User, Order } from '@/types/firestore';

// 開発中のインメモリフォールバックストア（Firebase認証情報がない場合でも動作可能にする）
export const inMemoryMockDb = {
  adminInfo: { ...SAMPLE_ADMIN_INFO } as PlatformAdminInfo,
  cemeteryCompanies: new Map<string, CemeteryCompany>(SAMPLE_CEMETERY_COMPANIES.map((c) => [c.id, { ...c }])),
  vendors: new Map<string, User>(SAMPLE_VENDORS.map((v) => [v.id, { ...v }])),
  orders: new Map<string, Order>(SAMPLE_ORDERS.map((o) => [o.id, { ...o }])),
  reports: new Map<string, any>(SAMPLE_REPORTS.map((r) => [r.id, { ...r }])),
  accounts: new Map<string, any>(SAMPLE_ACCOUNTS.map((a) => [a.email, { ...a }])),
};

let adminApp: App | null = null;
let adminDb: Firestore | null = null;
let firebaseInitStatus: { initialized: boolean; message: string; envStatus: Record<string, boolean> } = {
  initialized: false,
  message: '未初期化',
  envStatus: {},
};

function cleanEnvValue(val?: string): string | undefined {
  if (!val) return undefined;
  let cleaned = val.trim();
  // 先頭・末尾のシングルクォートまたはダブルクォートをすべて除去
  if ((cleaned.startsWith('"') && cleaned.endsWith('"')) || (cleaned.startsWith("'") && cleaned.endsWith("'"))) {
    cleaned = cleaned.slice(1, -1).trim();
  }
  return cleaned;
}

function formatPrivateKey(key?: string): string | undefined {
  if (!key) return undefined;
  let cleaned = key.trim();
  // 先頭・末尾のクォートを除去
  while (
    (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
    (cleaned.startsWith("'") && cleaned.endsWith("'"))
  ) {
    cleaned = cleaned.slice(1, -1).trim();
  }
  // \n のエスケープ解除
  cleaned = cleaned.replace(/\\n/g, '\n');

  // ヘッダーとフッターの改行を保証
  if (!cleaned.startsWith('-----BEGIN PRIVATE KEY-----')) {
    // プレフィックスが崩れている場合の補正
    const beginIndex = cleaned.indexOf('-----BEGIN PRIVATE KEY-----');
    if (beginIndex !== -1) {
      cleaned = cleaned.substring(beginIndex);
    }
  }

  return cleaned;
}

function initAdmin() {
  if (adminDb) return;

  if (getApps().length) {
    adminApp = getApps()[0];
    adminDb = getFirestore(adminApp);
    firebaseInitStatus = {
      initialized: true,
      message: '既存のFirebase Adminインスタンスを使用しています',
      envStatus: { existingApp: true },
    };
    return;
  }

  // 1. JSON全体が渡されている場合（FIREBASE_SERVICE_ACCOUNT_KEY または FIREBASE_PRIVATE_KEY が JSON の場合）
  const rawJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY || process.env.FIREBASE_SERVICE_ACCOUNT;
  if (rawJson) {
    try {
      let cleanedJson = cleanEnvValue(rawJson) || rawJson;
      const parsed = JSON.parse(cleanedJson);
      if (parsed.project_id && parsed.private_key && parsed.client_email) {
        adminApp = initializeApp({
          credential: cert(parsed),
        });
        adminDb = getFirestore(adminApp);
        console.log(`✅ Firebase Admin initialized via JSON key for project: ${parsed.project_id}`);
        firebaseInitStatus = {
          initialized: true,
          message: `Firebase Admin 正常接続 (JSON経由: ${parsed.project_id})`,
          envStatus: { hasServiceAccountJson: true },
        };
        return;
      }
    } catch (e: any) {
      console.warn('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY as JSON:', e.message);
    }
  }

  // 2. 個別環境変数の場合
  const rawProjectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const rawClientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY;

  // FIREBASE_PRIVATE_KEY が実は JSON 全体だった場合の救済
  if (rawPrivateKey && rawPrivateKey.trim().startsWith('{')) {
    try {
      const parsed = JSON.parse(rawPrivateKey.trim());
      if (parsed.project_id && parsed.private_key) {
        adminApp = initializeApp({
          credential: cert(parsed),
        });
        adminDb = getFirestore(adminApp);
        firebaseInitStatus = {
          initialized: true,
          message: `Firebase Admin 正常接続 (JSON形式秘密鍵: ${parsed.project_id})`,
          envStatus: { hasServiceAccountJson: true },
        };
        return;
      }
    } catch (e) {
      // JSONではないので続行
    }
  }

  const projectId = cleanEnvValue(rawProjectId);
  const clientEmail = cleanEnvValue(rawClientEmail);
  const privateKey = formatPrivateKey(rawPrivateKey);

  const envCheck = {
    hasProjectId: Boolean(projectId),
    hasClientEmail: Boolean(clientEmail),
    hasPrivateKey: Boolean(privateKey),
  };

  if (!projectId || !clientEmail || !privateKey) {
    const missing = [];
    if (!projectId) missing.push('FIREBASE_PROJECT_ID');
    if (!clientEmail) missing.push('FIREBASE_CLIENT_EMAIL');
    if (!privateKey) missing.push('FIREBASE_PRIVATE_KEY');
    const msg = `Firebase Admin credentials missing: ${missing.join(', ')}`;
    console.info(`ℹ️ ${msg}. Running in Development Mock Store mode.`);
    firebaseInitStatus = {
      initialized: false,
      message: msg,
      envStatus: envCheck,
    };
    return;
  }

  try {
    adminApp = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
    adminDb = getFirestore(adminApp);
    console.log(`✅ Firebase Admin initialized with service account for project: ${projectId}`);
    firebaseInitStatus = {
      initialized: true,
      message: `Firebase Admin 正常接続 (Project: ${projectId})`,
      envStatus: envCheck,
    };
  } catch (error: any) {
    const errMsg = `Failed to initialize Firebase Admin: ${error.message || error}`;
    console.warn(`⚠️ ${errMsg}`);
    firebaseInitStatus = {
      initialized: false,
      message: errMsg,
      envStatus: envCheck,
    };
  }
}

// 初期化実行
initAdmin();

export function getFirebaseAdminStatus() {
  initAdmin();
  return firebaseInitStatus;
}

/**
 * Firestore に初期データを投入（シード）する
 */
export async function seedInitialDataToFirestore() {
  initAdmin();

  const results = {
    adminInfo: false,
    cemeteryCompaniesCount: 0,
    vendorsCount: 0,
    ordersCount: 0,
    accountsCount: 0,
    mode: adminDb ? 'firestore' : 'in_memory',
    statusMessage: firebaseInitStatus.message,
  };

  // インメモリの更新（開発時の動作担保）
  inMemoryMockDb.adminInfo = { ...SAMPLE_ADMIN_INFO };
  SAMPLE_CEMETERY_COMPANIES.forEach((c) => inMemoryMockDb.cemeteryCompanies.set(c.id, { ...c }));
  SAMPLE_VENDORS.forEach((v) => inMemoryMockDb.vendors.set(v.id, { ...v }));
  SAMPLE_ORDERS.forEach((o) => inMemoryMockDb.orders.set(o.id, { ...o }));
  SAMPLE_ACCOUNTS.forEach((a) => inMemoryMockDb.accounts.set(a.email, { ...a }));

  if (!adminDb) {
    throw new Error(
      `Firestore に接続できませんでした。Firebase サービスアカウントの設定を確認してください。\n理由: ${firebaseInitStatus.message}`
    );
  }

  const batch = adminDb.batch();

  // 1. 本部管理情報
  const adminRef = adminDb.collection('platform_settings').doc('admin_info');
  batch.set(adminRef, { ...SAMPLE_ADMIN_INFO, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
  results.adminInfo = true;

  // 2. 墓地管理会社（3社）
  for (const company of SAMPLE_CEMETERY_COMPANIES) {
    const docRef = adminDb.collection('cemetery_companies').doc(company.id);
    batch.set(docRef, { ...company, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
    results.cemeteryCompaniesCount++;
  }

  // 3. 作業代行業者（6社）
  for (const vendor of SAMPLE_VENDORS) {
    const docRef = adminDb.collection('vendors').doc(vendor.id);
    batch.set(docRef, { ...vendor, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
    results.vendorsCount++;
  }

  // 4. サンプル注文（3件）
  for (const order of SAMPLE_ORDERS) {
    const docRef = adminDb.collection('orders').doc(order.id);
    batch.set(docRef, { ...order, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
    results.ordersCount++;
  }

  // 5. ログイン用アカウント（9アカウント）
  for (const acc of SAMPLE_ACCOUNTS) {
    const docRef = adminDb.collection('accounts').doc(acc.email);
    batch.set(docRef, { ...acc, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
    results.accountsCount++;
  }

  await batch.commit();
  console.log('✅ [Firestore Seed] All sample collections successfully written to Firestore.');

  return results;
}

/**
 * 本部管理情報
 */
export async function getPlatformAdminInfo(): Promise<PlatformAdminInfo> {
  if (adminDb) {
    try {
      const doc = await adminDb.collection('platform_settings').doc('admin_info').get();
      if (doc.exists) {
        return doc.data() as PlatformAdminInfo;
      }
    } catch (e) {
      console.warn('[Firestore] Error fetching admin_info:', e);
    }
  }
  return inMemoryMockDb.adminInfo;
}

export async function savePlatformAdminInfo(data: Partial<PlatformAdminInfo>): Promise<PlatformAdminInfo> {
  inMemoryMockDb.adminInfo = { ...inMemoryMockDb.adminInfo, ...data };
  if (adminDb) {
    try {
      await adminDb.collection('platform_settings').doc('admin_info').set(
        { ...data, updatedAt: FieldValue.serverTimestamp() },
        { merge: true }
      );
    } catch (e) {
      console.error('[Firestore Error] Could not update admin_info:', e);
    }
  }
  return inMemoryMockDb.adminInfo;
}

/**
 * 墓地管理会社 一覧・取得・保存
 */
export async function getCemeteryCompanies(): Promise<CemeteryCompany[]> {
  if (adminDb) {
    try {
      const snapshot = await adminDb.collection('cemetery_companies').get();
      if (!snapshot.empty) {
        return snapshot.docs.map((d) => d.data() as CemeteryCompany);
      }
    } catch (e) {
      console.warn('[Firestore] Error fetching cemetery_companies:', e);
    }
  }
  return Array.from(inMemoryMockDb.cemeteryCompanies.values());
}

export async function saveCemeteryCompany(company: CemeteryCompany): Promise<CemeteryCompany> {
  inMemoryMockDb.cemeteryCompanies.set(company.id, company);
  if (adminDb) {
    try {
      await adminDb.collection('cemetery_companies').doc(company.id).set(
        { ...company, updatedAt: FieldValue.serverTimestamp() },
        { merge: true }
      );
    } catch (e) {
      console.error(`[Firestore Error] Could not save cemetery company ${company.id}:`, e);
    }
  }
  return company;
}

/**
 * 作業代行業者 一覧・取得・保存
 */
export async function getVendors(): Promise<User[]> {
  if (adminDb) {
    try {
      const snapshot = await adminDb.collection('vendors').get();
      if (!snapshot.empty) {
        return snapshot.docs.map((d) => d.data() as User);
      }
    } catch (e) {
      console.warn('[Firestore] Error fetching vendors:', e);
    }
  }
  return Array.from(inMemoryMockDb.vendors.values());
}

export async function saveVendor(vendor: User): Promise<User> {
  inMemoryMockDb.vendors.set(vendor.id, vendor);
  if (adminDb) {
    try {
      await adminDb.collection('vendors').doc(vendor.id).set(
        { ...vendor, updatedAt: FieldValue.serverTimestamp() },
        { merge: true }
      );
    } catch (e) {
      console.error(`[Firestore Error] Could not save vendor ${vendor.id}:`, e);
    }
  }
  return vendor;
}

export async function saveAccount(account: any) {
  inMemoryMockDb.accounts.set(account.email, account);
  if (adminDb) {
    try {
      await adminDb.collection('accounts').doc(account.email).set(
        { ...account, updatedAt: FieldValue.serverTimestamp() },
        { merge: true }
      );
    } catch (e) {
      console.error(`[Firestore Error] Could not save account ${account.email}:`, e);
    }
  }
}

/**
 * 注文関連
 */
export async function getAllOrders(): Promise<Order[]> {
  if (adminDb) {
    try {
      const snapshot = await adminDb.collection('orders').orderBy('createdAt', 'desc').get();
      if (!snapshot.empty) {
        return snapshot.docs.map((d) => d.data() as Order);
      }
    } catch (e) {
      console.warn('[Firestore] Error fetching orders:', e);
    }
  }
  return Array.from(inMemoryMockDb.orders.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function saveOrderToFirestore(order: any) {
  inMemoryMockDb.orders.set(order.id, order);
  if (adminDb) {
    try {
      await adminDb.collection('orders').doc(order.id).set(order, { merge: true });
      console.log(`[Firestore] Order ${order.id} saved successfully.`);
    } catch (e) {
      console.error(`[Firestore Error] Could not save order ${order.id}:`, e);
    }
  }
}

export async function updateOrderStatusInFirestore(orderId: string, updateData: Record<string, any>) {
  const current = inMemoryMockDb.orders.get(orderId) || {};
  inMemoryMockDb.orders.set(orderId, { ...current, ...updateData, updatedAt: new Date().toISOString() } as Order);

  if (adminDb) {
    try {
      await adminDb.collection('orders').doc(orderId).update({
        ...updateData,
        updatedAt: FieldValue.serverTimestamp(),
      });
      console.log(`[Firestore] Order ${orderId} updated to status: ${updateData.status}`);
    } catch (e) {
      console.error(`[Firestore Error] Could not update order ${orderId}:`, e);
    }
  }
}

export async function getOrderFromFirestore(orderId: string) {
  if (adminDb) {
    try {
      const doc = await adminDb.collection('orders').doc(orderId).get();
      if (doc.exists) {
        return doc.data();
      }
    } catch (e) {
      console.warn(`[Firestore Error] Fetch error for ${orderId}:`, e);
    }
  }
  return inMemoryMockDb.orders.get(orderId) || null;
}

/**
 * 認証アカウント確認
 */
export async function authenticateAccount(email: string, password?: string) {
  if (adminDb) {
    try {
      const doc = await adminDb.collection('accounts').doc(email).get();
      if (doc.exists) {
        const data = doc.data();
        if (!password || data?.password === password) {
          return data;
        }
      }
    } catch (e) {
      console.warn('[Firestore] Error fetching account:', e);
    }
  }
  const mockAcc = inMemoryMockDb.accounts.get(email);
  if (mockAcc && (!password || mockAcc.password === password)) {
    return mockAcc;
  }
  return null;
}

/**
 * パスワード更新
 */
export async function updateAccountPassword(email: string, newPassword: string) {
  if (adminDb) {
    try {
      await adminDb.collection('accounts').doc(email).set({ password: newPassword }, { merge: true });
      console.log(`[Firestore] Password updated for account: ${email}`);
    } catch (e) {
      console.warn('[Firestore] Error updating account password:', e);
    }
  }
  const mockAcc = inMemoryMockDb.accounts.get(email);
  if (mockAcc) {
    mockAcc.password = newPassword;
    inMemoryMockDb.accounts.set(email, mockAcc);
  }
  return true;
}

export { adminDb };

