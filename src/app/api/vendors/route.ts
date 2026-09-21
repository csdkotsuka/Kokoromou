import { NextResponse } from 'next/server';
import { getVendors, saveVendor } from '@/lib/firebase-admin';
import { User } from '@/types/firestore';

export async function GET() {
  try {
    const vendors = await getVendors();
    return NextResponse.json({ success: true, vendors });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const vendor: User = await req.json();
    if (!vendor.id || !vendor.displayName) {
      return NextResponse.json({ success: false, error: '無効なデータです' }, { status: 400 });
    }
    const saved = await saveVendor(vendor);
    return NextResponse.json({ success: true, vendor: saved });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      displayName,
      representativeName,
      phoneNumber,
      email,
      businessType, // 'corporation' | 'individual'
      serviceAreas,
      description,
      password,
      cemeteryCompanyId, // 追加元の墓地管理会社ID（任意）
    } = body;

    if (!displayName || !phoneNumber || !email) {
      return NextResponse.json(
        { success: false, error: '屋号・業者名、電話番号、メールアドレスは必須です' },
        { status: 400 }
      );
    }

    const newVendorId = `vendor_${Date.now().toString(36)}`;
    const nowIso = new Date().toISOString();

    const newVendor: User = {
      id: newVendorId,
      email,
      role: 'vendor',
      displayName,
      phoneNumber,
      createdAt: nowIso,
      updatedAt: nowIso,
      vendorProfile: {
        businessType: businessType || 'individual',
        companyName: displayName,
        representativeName: representativeName || displayName,
        phoneNumber,
        email,
        serviceAreas: Array.isArray(serviceAreas) ? serviceAreas : [serviceAreas || '松山市・中予全域'],
        stripeChargesEnabled: false,
        stripePayoutsEnabled: false,
        description: description || '丁寧な心構えでお墓参り・清掃代行を承ります。',
        rating: 5.0,
        completedJobsCount: 0,
        affiliatedCemeteryCompanyIds: cemeteryCompanyId ? [cemeteryCompanyId] : [],
      },
    };

    // 1. 代行業者ドキュメント保存
    const savedVendor = await saveVendor(newVendor);

    // 2. ログインアカウント保存
    const { saveAccount, getCemeteryCompanies, saveCemeteryCompany } = await import('@/lib/firebase-admin');
    await saveAccount({
      id: `acc_${newVendorId}`,
      email,
      password: password || 'vendor1234',
      role: 'vendor',
      name: displayName,
      targetId: newVendorId,
      createdAt: nowIso,
    });

    // 3. 墓地管理会社の提携リストにも追加
    if (cemeteryCompanyId) {
      const companies = await getCemeteryCompanies();
      const targetCompany = companies.find((c) => c.id === cemeteryCompanyId);
      if (targetCompany && !targetCompany.affiliatedVendorIds.includes(newVendorId)) {
        targetCompany.affiliatedVendorIds.push(newVendorId);
        await saveCemeteryCompany(targetCompany);
      }
    }

    return NextResponse.json({
      success: true,
      message: '作業代行業者を新規登録しました',
      vendor: savedVendor,
    });
  } catch (error: any) {
    console.error('Create vendor error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
