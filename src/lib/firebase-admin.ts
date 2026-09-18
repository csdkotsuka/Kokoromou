import { getApps, initializeApp, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore, FieldValue } from 'firebase-admin/firestore';

// 開発中のインメモリフォールバックストア（Firebase認証情報がない場合でも動作可能にする）
export const inMemoryMockDb = {
  orders: new Map<string, any>(),
  reports: new Map<string, any>(),
  users: new Map<string, any>(),
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
 * Firestore Admin ドキュメント操作ヘルパー
 * 実環境では Firestore に保存し、ローカル開発では inMemoryMockDb に保存
 */
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
  inMemoryMockDb.orders.set(orderId, { ...current, ...updateData, updatedAt: new Date().toISOString() });

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

export { adminDb };
