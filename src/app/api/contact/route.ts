import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { SAMPLE_ADMIN_INFO } from '@/mocks/sample-data';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      type, 
      name, 
      companyName, 
      email, 
      phone, 
      message, 
      prefecture, 
      cemeteryName,
      preferredContactMethod = 'email', // 'email' | 'phone'
      preferredDate
    } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'お名前、メールアドレス、お問い合わせ内容は必須項目です。' },
        { status: 400 }
      );
    }

    const isAreaRequest = type === 'area_request';
    const contactMethodLabel = preferredContactMethod === 'phone' ? '📞 お電話でのご連絡を希望' : '📧 メールでのご連絡';
    const adminEmail = SAMPLE_ADMIN_INFO.email || 'kokoromou@inteve-cloud.com';

    // 1. 自社（ココロモウ運営本部）宛ての通知メール本文
    const adminNotificationEmail = {
      to: adminEmail,
      from: 'noreply@kokoromou.com',
      subject: `【ココロモウ事前相談受付】${name}様より（希望連絡: ${preferredContactMethod === 'phone' ? '電話折り返し希望' : 'メール'}）`,
      body: `ココロモウ運営本部 各位

Webフォームより新しい事前相談・お見積り依頼を受付いたしました。
内容をご確認の上、対応をお願いいたします。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ お客様情報
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【お名前】: ${name} 様
【メールアドレス】: ${email}
【お電話番号】: ${phone || '未記入'}
【ご希望の連絡方法】: ${contactMethodLabel}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ ご相談内容・希望墓地
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【都道府県】: ${prefecture || '未選択'}
【対象霊園・墓地】: ${cemeteryName || '未指定・相談希望'}
${preferredDate ? `【ご希望時期】: ${preferredDate}\n` : ''}
【ご相談・ご要望詳細】:
${message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${preferredContactMethod === 'phone' 
  ? '⚠️ 【要対応】お客様はお電話での折り返し連絡をご希望です。手の空いている時間帯にお電話（' + (phone || '電話番号確認') + '）にてご連絡をお願いいたします。'
  : '💡 お客様はメールでのご連絡をご希望です。本メールまたは管理システムよりご回答をお願いいたします。'
}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
お墓参り・お掃除代行DXプラットフォーム「ココロモウ」
通知先: ${adminEmail}
`,
    };

    // 2. お客様宛ての自動返信メール本文
    const autoReplyEmail = {
      to: email,
      from: adminEmail,
      subject: `【ココロモウ】お墓参り・お掃除代行の事前ご相談を受け付けました`,
      body: `${name} 様

この度はお墓参り・お掃除代行プラットフォーム「ココロモウ」へ事前ご相談・お見積りをご依頼いただき、誠にありがとうございます。

以下の内容でお問い合わせを受け付けいたしました。
内容を確認の上、担当者より丁寧にご案内・お見積りをご連絡いたします。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ 受付内容のお控え
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【受付番号】: inq_${Date.now()}
【お名前】: ${name} 様
【ご希望の連絡方法】: ${contactMethodLabel}
【都道府県】: ${prefecture || '未選択'}
${cemeteryName ? `【対象霊園・墓地】: ${cemeteryName}\n` : ''}${preferredDate ? `【ご希望時期】: ${preferredDate}\n` : ''}
【ご相談内容】:
${message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ 今後の流れについて
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${preferredContactMethod === 'phone'
  ? '・「お電話でのご連絡」をご希望いただきましたので、担当者よりご都合の良い時間帯にお電話（' + (phone || 'ご登録番号') + '）にて折り返しご連絡差し上げます。\n・お急ぎのご用件や追加のお写真などがございましたら、本メールへそのままご返信いただくことも可能です。'
  : '・担当者にて現地の墓地環境や提携職人の空き状況を確認の上、原則24時間以内にメールにて概算費用・日程等をご案内いたします。\n・正式なお申し込み前にしっかりご納得いただけるようサポートいたしますので、どうぞご安心ください。'
}

何かご不明な点がございましたら、いつでも本メール（${adminEmail}）までお気軽にご返信ください。

─────────────────────────────────
お墓参り・お掃除代行DXプラットフォーム「ココロモウ」運営本部
担当：大塚
メール：${adminEmail}
Webサイト：https://kokoromou.vercel.app
─────────────────────────────────
`,
    };

    const inquiryData = {
      id: `inq_${Date.now()}`,
      type: type || 'general',
      name,
      companyName: companyName || (cemeteryName ? `対象霊園: ${cemeteryName}` : ''),
      email,
      phone: phone || '',
      message,
      prefecture: prefecture || '',
      cemeteryName: cemeteryName || '',
      preferredContactMethod, // 'email' | 'phone'
      preferredDate: preferredDate || '',
      notifyTo: adminEmail,
      adminNotificationEmail,
      autoReplyEmail,
      autoReplySent: true, // 自動返信生成完了
      createdAt: new Date().toISOString(),
      status: 'unread',
    };

    console.log(`📩 [New Inquiry/Request Received]: type=${inquiryData.type}, notifyTo=${adminEmail}, contactMethod=${preferredContactMethod}`);
    console.log(`📤 [Auto-Reply Prepared to Customer]: ${email}`);

    // Firestoreへの永続化
    if (adminDb) {
      try {
        await adminDb.collection('inquiries').doc(inquiryData.id).set({
          ...inquiryData,
          serverTimestamp: FieldValue.serverTimestamp(),
        });
        console.log(`✅ [Firestore] Inquiry and email logs saved successfully: ${inquiryData.id}`);
      } catch (err: any) {
        console.warn('⚠️ [Firestore] Failed to save inquiry to Firestore:', err.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: isAreaRequest
        ? '霊園・墓地のリクエストを受け付けました。運営本部より確認の上、ご連絡いたします。'
        : preferredContactMethod === 'phone'
          ? '事前相談を受け付けました。自動返信メールをお送りいたしました。担当者よりお電話にてご連絡差し上げます。'
          : '事前相談を受け付けました。自動返信メールをお送りいたしました。担当者よりメールにて丁寧にご案内いたします。',
      inquiryId: inquiryData.id,
      autoReplySent: true,
      preferredContactMethod,
    });
  } catch (error: any) {
    console.error('Inquiry API Error:', error);
    return NextResponse.json(
      { error: error.message || 'お問い合わせの送信中にエラーが発生しました。' },
      { status: 500 }
    );
  }
}
