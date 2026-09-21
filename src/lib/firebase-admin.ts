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

if (!getApps().length) {
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (projectId && clientEmail && privateKey) {
    try {
      adminApp = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      adminDb = getFirestore(adminApp);
      console.log('✅ Firebase Admin initialized with service account.');
    } catch (error) {
      console.warn('⚠️ Failed to initialize Firebase Admin with credentials, falling back to mock mode:', error);
    }
  } else {
    console.info('ℹ️ Firebase Admin service credentials not found. Running in Development Mock Store mode.');
  }
} else {
  adminApp = getApps()[0];
  adminDb = getFirestore(adminApp);
}

/**
 * Firestore に初期データを投入（シード）する
 */
export async function seedInitialDataToFirestore() {
  const results = {
    adminInfo: false,
    cemeteryCompaniesCount: 0,
    vendorsCount: 0,
    ordersCount: 0,
    accountsCount: 0,
    mode: adminDb ? 'firestore' : 'in_memory',
  };

  // インメモリの更新
  inMemoryMockDb.adminInfo = { ...SAMPLE_ADMIN_INFO };
  SAMPLE_CEMETERY_COMPANIES.forEach((c) => inMemoryMockDb.cemeteryCompanies.set(c.id, { ...c }));
  SAMPLE_VENDORS.forEach((v) => inMemoryMockDb.vendors.set(v.id, { ...v }));
  SAMPLE_ORDERS.forEach((o) => inMemoryMockDb.orders.set(o.id, { ...o }));
  SAMPLE_ACCOUNTS.forEach((a) => inMemoryMockDb.accounts.set(a.email, { ...a }));

  if (adminDb) {
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
    console.log('✅ [Firestore Seed] All sample collections successfully seeded into Firestore.');
  }

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

export { adminDb };

