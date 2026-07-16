// Cloudflare Pages Function — Launch waitlist signup
// Route: POST /api/subscribe   body: { "email": "user@example.com" }
//
// Sends each signup as an email via Resend (same infra as the support ticket
// form). It lands in the destination inbox — set WAITLIST_DESTINATION_EMAIL to a
// non-Zoho-Desk address if you don't want each signup to become a support ticket.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(body, status) {
  return new Response(JSON.stringify(body), {
    status: status || 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
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

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `GreatBless Launch <${senderEmail}>`,
        to: destination,
        reply_to: email,
        subject: `[Waitlist] ${email}`,
        html:
          `<h2>New launch-waitlist signup</h2>` +
          `<p><strong>Email:</strong> ${email}</p>` +
          `<p><strong>Source:</strong> ${source}</p>` +
          `<hr /><p style="font-size:11px;color:#888;">Submitted from the GreatBless landing page.</p>`,
      }),
    });

    if (!res.ok) {
      let msg = 'Failed to submit. Please try again later.';
      try {
        const d = await res.json();
        msg = d.message || msg;
      } catch (e) {}
      return json({ success: false, error: msg }, res.status);
    }

    return json({ success: true });
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
