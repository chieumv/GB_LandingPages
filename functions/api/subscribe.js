// Cloudflare Pages Function — Launch waitlist signup
// Route: POST /api/subscribe   body: { "email": "user@example.com" }
//
// Sends each signup as an email via Resend (same infra as the support ticket
// form). It lands in the destination inbox — set WAITLIST_DESTINATION_EMAIL to a
// non-Zoho-Desk address if you don't want each signup to become a support ticket.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESEND_EMAILS_URL = 'https://api.resend.com/emails';

function json(body, status) {
  return new Response(JSON.stringify(body), {
    status: status || 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

async function sendEmail(apiKey, message) {
  return fetch(RESEND_EMAILS_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

async function getResendError(response, fallback) {
  try {
    const data = await response.json();
    return data.message || fallback;
  } catch (e) {
    return fallback;
  }
}

export async function onRequestPost(context) {
  try {
    const { request, env } = context;

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return json({ success: false, error: 'Invalid request body' }, 400);
    }

    const email = (body && body.email ? String(body.email) : '').trim();
    if (!EMAIL_RE.test(email) || email.length > 254) {
      return json({ success: false, error: 'Please enter a valid email address.' }, 400);
    }

    const apiKey = env.RESEND_API_KEY;
    if (!apiKey) {
      return json({ success: false, error: 'Email service is not configured.' }, 500);
    }

    // Where signups are collected. Default to the support inbox; override with
    // WAITLIST_DESTINATION_EMAIL to keep them out of the Zoho Desk ticket queue.
    const destination =
      env.WAITLIST_DESTINATION_EMAIL || env.TICKET_DESTINATION_EMAIL || 'support@greatbless.com';
    const senderEmail = env.SENDER_EMAIL || 'support@greatbless.com';

    const source = (body && body.source ? String(body.source).slice(0, 120) : 'landing');

    // Step 1: register this specific waitlist submission with the internal inbox.
    // The user confirmation below is never sent unless this request succeeds.
    const internalResponse = await sendEmail(apiKey, {
      from: `GreatBless Launch <${senderEmail}>`,
      to: destination,
      reply_to: email,
      subject: `[Waitlist] ${email}`,
      text:
        `New launch-waitlist signup\n\n` +
        `Email: ${email}\n` +
        `Source: ${source}\n`,
      html:
        `<h2>New launch-waitlist signup</h2>` +
        `<p><strong>Email:</strong> ${escapeHtml(email)}</p>` +
        `<p><strong>Source:</strong> ${escapeHtml(source)}</p>` +
        `<hr /><p style="font-size:11px;color:#888;">Submitted from the GreatBless landing page.</p>`,
    });

    if (!internalResponse.ok) {
      const message = await getResendError(
        internalResponse,
        'Failed to submit. Please try again later.'
      );
      return json({ success: false, error: message }, internalResponse.status);
    }

    // Step 2: this transactional confirmation belongs only to /api/subscribe.
    // No general incoming-email or support-ticket handler triggers it.
    const confirmationRef = crypto.randomUUID();
    const confirmationResponse = await sendEmail(apiKey, {
      from: `GreatBless Launch <${senderEmail}>`,
      to: email,
      reply_to: destination,
      subject: "You're on the GreatBless launch list",
      headers: {
        'X-Entity-Ref-ID': confirmationRef,
      },
      text:
        `Thanks for joining the GreatBless launch list.\n\n` +
        `We received your request and will email you when live trading launches. ` +
        `GreatBless is currently available in preview with demo accounts only.\n\n` +
        `If you did not submit this request, you can ignore this email.\n\n` +
        `GreatBless Team\nhttps://greatbless.com`,
      html:
        `<div style="margin:0;background:#f5f2f8;padding:32px 16px;font-family:Arial,sans-serif;color:#241530;">` +
        `<div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e7dfec;border-radius:12px;padding:32px;">` +
        `<h1 style="margin:0 0 16px;color:#241530;">` +
        `<span style="display:block;font-size:22px;line-height:1.3;font-weight:700;color:#30124a;margin-bottom:22px;">GreatBless Global Markets Ltd.</span>` +
        `<span style="display:block;font-size:24px;line-height:1.3;font-weight:700;">You're on the launch list</span>` +
        `</h1>` +
        `<p style="font-size:16px;line-height:1.6;margin:0 0 14px;">Thanks for joining the GreatBless launch list.</p>` +
        `<p style="font-size:16px;line-height:1.6;margin:0 0 14px;">We received your request and will email you when live trading launches. GreatBless is currently available in preview with demo accounts only.</p>` +
        `<p style="font-size:13px;line-height:1.5;color:#75677e;margin:24px 0 0;">If you did not submit this request, you can ignore this email.</p>` +
        `<hr style="border:0;border-top:1px solid #eee6f2;margin:28px 0 18px;" />` +
        `<p style="font-size:13px;line-height:1.5;color:#75677e;margin:0;">GreatBless Team<br /><a href="https://greatbless.com" style="color:#299481;">greatbless.com</a></p>` +
        `</div></div>`,
    });

    if (!confirmationResponse.ok) {
      const message = await getResendError(
        confirmationResponse,
        'The signup was received, but the confirmation email could not be sent.'
      );
      console.error('Waitlist confirmation email failed:', message);
      return json({
        success: true,
        confirmationSent: false,
        warning: 'Your signup was received, but the confirmation email could not be sent.',
      });
    }

    return json({ success: true, confirmationSent: true });
  } catch (error) {
    return json({ success: false, error: error.message }, 500);
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
