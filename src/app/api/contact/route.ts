import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { SAMPLE_ADMIN_INFO } from '@/mocks/sample-data';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

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
    const rawFrom = process.env.RESEND_FROM_EMAIL || 'noreply@inteve-cloud.com';
    const fromEmail = rawFrom.includes('<') ? rawFrom : `ココロモウ運営本部 <${rawFrom}>`;

    // お問い合わせ種別の日本語ラベル
    const inquiryTypeLabel = 
      type === 'cemetery' ? '霊園・墓地管理所（提携・導入相談）' :
      type === 'partner' ? '石材店・清掃代行業者（新規提携申請）' :
      type === 'area_request' ? '未対応エリア・霊園のリクエスト' :
      type === 'order' ? '代行プラン・ご注文に関する相談' : '一般・その他のお問い合わせ';

    // 1. 自社（ココロモウ運営本部: kokoromou@inteve-cloud.com）宛ての通知メール本文
    const adminSubject = `【ココロモウ受付】[${inquiryTypeLabel}] ${companyName ? `${companyName} ` : ''}${name}様より`;
    const adminNotificationEmail = {
      to: adminEmail,
      from: fromEmail,
      subject: adminSubject,
      body: `ココロモウ運営本部 各位

Webフォームより新しいお問い合わせ・ご相談を受付いたしました。
内容をご確認の上、ご対応をお願いいたします。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ お問い合わせ種別
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【種別】: ${inquiryTypeLabel}
${companyName ? `【貴社名・寺院霊園名】: ${companyName}\n` : ''}【お名前】: ${name} 様
【メールアドレス】: ${email}
【お電話番号】: ${phone || '未記入'}
【ご希望の連絡方法】: ${contactMethodLabel}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ ご相談内容・対象霊園情報
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${prefecture ? `【都道府県】: ${prefecture}\n` : ''}${cemeteryName ? `【対象霊園・墓地】: ${cemeteryName}\n` : ''}${preferredDate ? `【ご希望時期】: ${preferredDate}\n` : ''}【お問い合わせ・ご相談詳細】:
${message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${preferredContactMethod === 'phone' 
  ? '⚠️ 【要対応】お客様はお電話での折り返し連絡をご希望です。お電話（' + (phone || '電話番号確認') + '）にてご連絡をお願いいたします。'
  : '💡 お客様宛てにメールで直接ご返信いただく場合は、本メールにそのまま「返信」していただけます（Reply-To設定済み）。'
}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
お墓参り・お掃除代行DXプラットフォーム「ココロモウ」
通知先: ${adminEmail}
`,
    };

    // 2. お客様宛ての自動返信メール本文
    const autoReplySubject = `【ココロモウ】お問い合わせ・ご相談を受け付けました`;
    const autoReplyEmail = {
      to: email,
      from: fromEmail,
      subject: autoReplySubject,
      body: `${name} 様

この度はお墓参り・お掃除代行プラットフォーム「ココロモウ」へお問い合わせ・ご相談をいただき、誠にありがとうございます。

以下の内容でお問い合わせを受け付けいたしました。
内容を確認の上、担当者より丁寧にご回答・ご案内を差し上げます。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ 受付内容のお控え
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【受付番号】: inq_${Date.now()}
【お問い合わせ種別】: ${inquiryTypeLabel}
${companyName ? `【貴社名・寺院霊園名】: ${companyName}\n` : ''}【お名前】: ${name} 様
【ご希望の連絡方法】: ${contactMethodLabel}
${prefecture ? `【都道府県】: ${prefecture}\n` : ''}${cemeteryName ? `【対象霊園・墓地】: ${cemeteryName}\n` : ''}${preferredDate ? `【ご希望時期】: ${preferredDate}\n` : ''}【お問い合わせ・ご相談内容】:
${message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ 今後の流れについて
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${preferredContactMethod === 'phone'
  ? '・「お電話でのご連絡」をご希望いただきましたので、担当者より原則3営業日以内にお電話（' + (phone || 'ご登録番号') + '）にて折り返しご連絡差し上げます。\n・お急ぎのご用件や追加の資料・お写真などがございましたら、本メールへそのままご返信いただくことも可能です。'
  : '・担当者にてお問い合わせ内容を確認の上、原則3営業日以内にメールにて詳細なご回答・ご案内（お見積り・代行相談の場合は概算費用や日程等）をご連絡差し上げます。\n・追加のご質問やご不明な点がございましたら、本メールへそのままご返信いただけますのでご安心ください。'
}

何かご不明な点がございましたら、いつでも本メール（${adminEmail}）までお気軽にご返信ください。

─────────────────────────────────
お墓参り・お掃除代行DXプラットフォーム「ココロモウ」運営本部
運営会社：Creative System Design
担当：大塚
メール：${adminEmail}
お電話：090-4116-9476
所在地：〒730-0051 広島県広島市中区大手町1-1-20 相生橋ビル7階 A号室
Webサイト：https://kokoromou.inteve-cloud.com/
─────────────────────────────────
`,
    };

    // Resend を使用した実際のメール送信処理
    let adminEmailSent = false;
    let autoReplyEmailSent = false;
    let adminMailError: any = null;
    let autoReplyMailError: any = null;

    if (resend) {
      // ① ココロモウ運営本部（kokoromou@inteve-cloud.com）宛てに通知メールを送信
      try {
        const { data: adminData, error: adminErr } = await resend.emails.send({
          from: fromEmail,
          to: adminEmail,
          replyTo: email, // お客様のメールアドレス。メールソフトで「返信」すれば直接お客様へ届きます
          subject: adminNotificationEmail.subject,
          text: adminNotificationEmail.body,
        });

        if (adminErr) {
          adminMailError = adminErr;
          console.error(`❌ [Resend Error - Admin Notification]:`, adminErr);
        } else {
          console.log(`✅ [Resend Success - Admin Notification sent to ${adminEmail}]:`, adminData);
          adminEmailSent = true;
        }
      } catch (mailErr: any) {
        adminMailError = mailErr?.message || mailErr;
        console.error(`❌ [Resend Exception - Admin Notification]:`, mailErr);
      }

      // ② お客様宛てに自動返信メールを送信（ドメイン認証済み、またはテスト可能アドレスの場合）
      try {
        const { data: replyData, error: replyErr } = await resend.emails.send({
          from: fromEmail,
          to: email,
          replyTo: adminEmail,
          subject: autoReplyEmail.subject,
          text: autoReplyEmail.body,
        });

        if (replyErr) {
          autoReplyMailError = replyErr;
          console.warn(`⚠️ [Resend Restricted - Auto-reply]:`, replyErr);
        } else {
          console.log(`✅ [Resend Success - Auto-reply sent to ${email}]:`, replyData);
          autoReplyEmailSent = true;
        }
      } catch (replyErr: any) {
        autoReplyMailError = replyErr?.message || replyErr;
        console.warn(`⚠️ [Resend Exception - Auto-reply]:`, replyErr);
      }
    } else {
      adminMailError = 'RESEND_API_KEY environment variable is not configured on the server.';
      console.warn('⚠️ [Resend] RESEND_API_KEY is not configured in environment variables.');
    }

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
      adminEmailSent,
      autoReplySent: autoReplyEmailSent,
      adminMailError: adminMailError ? String(adminMailError?.message || adminMailError) : null,
      createdAt: new Date().toISOString(),
      status: 'unread',
    };

    console.log(`📩 [Inquiry Log]: id=${inquiryData.id}, type=${inquiryData.type}, notifyTo=${adminEmail}, resendKeySet=${!!process.env.RESEND_API_KEY}, adminEmailSent=${adminEmailSent}`);

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
      emailDelivery: {
        resendConfigured: !!process.env.RESEND_API_KEY,
        adminTarget: adminEmail,
        adminSent: adminEmailSent,
        adminError: adminMailError ? (adminMailError.message || adminMailError) : null,
        autoReplySent: autoReplyEmailSent,
        autoReplyError: autoReplyMailError ? (autoReplyMailError.message || autoReplyMailError) : null,
      },
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

/**
 * Resend接続状態の診断用 GET エンドポイント
 * https://kokoromou.vercel.app/api/contact でブラウザから直接診断可能
 */
export async function GET(req: Request) {
  const adminEmail = SAMPLE_ADMIN_INFO.email || 'kokoromou@inteve-cloud.com';
  const hasKey = !!process.env.RESEND_API_KEY;
  const keyPrefix = hasKey ? `${process.env.RESEND_API_KEY?.substring(0, 7)}...` : 'NONE';
  const rawFrom = process.env.RESEND_FROM_EMAIL || 'noreply@inteve-cloud.com';
  const fromEmail = rawFrom.includes('<') ? rawFrom : `ココロモウ運営本部 <${rawFrom}>`;

  const url = new URL(req.url);
  const triggerTest = url.searchParams.get('test') === 'true';

  let testResult: any = null;

  if (triggerTest && resend) {
    try {
      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to: adminEmail,
        subject: `【ココロモウ Resendテスト送信】診断チェック（${new Date().toLocaleString('ja-JP')}）`,
        text: `このメールはココロモウのResend設定診断テストメールです。\n正常に届いていれば設定完了です！\n送信先: ${adminEmail}`,
      });
      testResult = { data, error };
    } catch (err: any) {
      testResult = { exception: err.message || err };
    }
  }

  return NextResponse.json({
    status: 'ok',
    resendConfigured: hasKey,
    resendKeyPrefix: keyPrefix,
    fromEmail,
    adminTargetEmail: adminEmail,
    testTriggered: triggerTest,
    testResult,
    note: triggerTest 
      ? 'Test email execution finished. Check testResult field for details.' 
      : 'Add ?test=true to trigger a test email to admin target address.',
  });
}
