import { Resend } from "resend";

let _resend = null;
function getResend() {
  if (!_resend) {
    const key = process.env.RESEND_API_KEY;
    if (!key || key.startsWith("re_xxxxxxxx")) throw new Error("RESEND_API_KEY not configured");
    _resend = new Resend(key);
  }
  return _resend;
}

const FROM = `${process.env.RESEND_FROM_NAME || "FlowDesk"} <${process.env.RESEND_FROM_EMAIL || "noreply@goflowdesk.io"}>`;

/**
 * Send a follow-up email
 */
export async function sendEmail({ to, subject, html, text }) {
  const { data, error } = await getResend().emails.send({ from: FROM, to, subject, html, text });
  if (error) throw new Error(error.message);
  return data;
}

// ─── EMAIL TEMPLATES ─────────────────────────────────────────────────────────

export function getFollowUpEmail(step, lead) {
  const first = lead.name.split(" ")[0];
  const biz = process.env.RESEND_FROM_NAME || "Our Team";

  const templates = {
    2: {
      subject: `Quick follow-up on your ${lead.service} inquiry`,
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;color:#222;">
          <h2 style="color:#1a1a1a;">Hi ${first},</h2>
          <p>Thanks for reaching out about <strong>${lead.service}</strong>. We wanted to follow up and make sure we connect.</p>
          <p>We offer free, no-obligation estimates and can usually get to you within a few days. Most of our clients find the process simple and fast.</p>
          <p>Would you like to schedule a quick estimate? Just reply to this email or give us a call and we'll get something on the calendar.</p>
          <br/>
          <p>Looking forward to helping you,<br/><strong>${biz}</strong></p>
        </div>
      `,
    },
    4: {
      subject: `Still thinking about your ${lead.service} project?`,
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;color:#222;">
          <h2 style="color:#1a1a1a;">Hi ${first},</h2>
          <p>We wanted to check in one more time about your <strong>${lead.service}</strong> inquiry.</p>
          <p>We know things get busy — no pressure at all. Whenever you're ready, we're here and happy to provide a free estimate.</p>
          <p>Just reply or give us a call. We'd love the chance to earn your business.</p>
          <br/>
          <p>Best,<br/><strong>${biz}</strong></p>
        </div>
      `,
    },
  };

  return templates[step] || null;
}

/**
 * Send appointment confirmation email
 */
export async function sendAppointmentConfirmation(appt) {
  const subject = `Appointment Confirmed — ${appt.appt_type} on ${appt.appt_date}`;
  const html = `
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto;color:#222;">
      <h2>Your appointment is confirmed ✅</h2>
      <table style="border-collapse:collapse;width:100%;margin:20px 0;">
        <tr><td style="padding:8px;color:#666;">Date</td><td style="padding:8px;font-weight:600;">${appt.appt_date}</td></tr>
        <tr><td style="padding:8px;color:#666;">Time</td><td style="padding:8px;font-weight:600;">${appt.appt_time}</td></tr>
        <tr><td style="padding:8px;color:#666;">Type</td><td style="padding:8px;font-weight:600;">${appt.appt_type}</td></tr>
        ${appt.notes ? `<tr><td style="padding:8px;color:#666;">Notes</td><td style="padding:8px;">${appt.notes}</td></tr>` : ""}
      </table>
      <p>We look forward to seeing you. If you need to reschedule, just reply to this email.</p>
    </div>
  `;
  return sendEmail({ to: appt.email, subject, html });
}
