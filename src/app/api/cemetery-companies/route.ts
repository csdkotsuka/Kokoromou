import { NextResponse } from 'next/server';
import { getCemeteryCompanies, saveCemeteryCompany } from '@/lib/firebase-admin';
import { CemeteryCompany } from '@/types/firestore';

export async function GET() {
  try {
    const companies = await getCemeteryCompanies();
    return NextResponse.json({ success: true, companies });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const company: CemeteryCompany = await req.json();
    if (!company.id || !company.name) {
      return NextResponse.json({ success: false, error: '無効なデータです' }, { status: 400 });
    }
    const saved = await saveCemeteryCompany(company);
    return NextResponse.json({ success: true, company: saved });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
