import { NextResponse } from 'next/server';
import { getCemeteryClients, saveCemeteryClients } from '@/lib/firebase-admin';
import { CemeteryClient } from '@/types/firestore';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get('companyId') || 'cem_comp_001';

    const clients = await getCemeteryClients(companyId);
    return NextResponse.json({
      success: true,
      clients,
    });
  } catch (error: any) {
    console.error('Failed to get cemetery clients:', error);
    return NextResponse.json(
      { error: error.message || '施主名簿の取得に失敗しました' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { companyId, clients } = body;

    if (!companyId) {
      return NextResponse.json(
        { error: '管理会社ID（companyId）が必要です' },
        { status: 400 }
      );
    }

    if (!clients || !Array.isArray(clients) || clients.length === 0) {
      return NextResponse.json(
        { error: '取り込む施主データが存在しません' },
        { status: 400 }
      );
    }

    const validClients: CemeteryClient[] = clients.map((c: any, index: number) => {
      const cleanPhone = (c.phoneNumber || '').replace(/\D/g, '');
      const defaultPass = cleanPhone.length >= 4 ? cleanPhone.slice(-4) : 'client1234';

      return {
        id: c.id || `client_${cleanPhone || Date.now()}_${index}`,
        cemeteryCompanyId: companyId,
        name: c.name || '施主様',
        phoneNumber: c.phoneNumber || '',
        postalCode: c.postalCode || '',
        address: c.address || '',
        email: c.email || '',
        sectionPlotNumber: c.sectionPlotNumber || '',
        frontInscription: c.frontInscription || '',
        builderName: c.builderName || '',
        initialPassword: c.initialPassword || defaultPass,
        photoUrl: c.photoUrl || '/images/grave_front_example.jpg',
        builderPhotoUrl: c.builderPhotoUrl || '/images/grave_side_builder_example.jpg',
        notes: c.notes || '',
        importedAt: c.importedAt || new Date().toISOString(),
        orderCount: c.orderCount || 0,
        lastOrderDate: c.lastOrderDate || '',
      };
    });

    const result = await saveCemeteryClients(companyId, validClients);

    return NextResponse.json({
      success: true,
      count: result.count,
      clients: validClients,
      message: `${result.count}件の施主データをインポートしました。アカウント・お墓情報が自動生成されました。`,
    });
  } catch (error: any) {
    console.error('Failed to save cemetery clients:', error);
    return NextResponse.json(
      { error: error.message || '施主データの保存に失敗しました' },
      { status: 500 }
    );
  }
}
