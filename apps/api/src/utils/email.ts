import { Resend } from 'resend';

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    // Skip sending when key missing (tests/dev)
    return null;
  }
  return new Resend(key);
}

export async function sendPasswordResetEmail(email: string, otp: string) {
  const resend = getResend();
  if (!resend) {
    // eslint-disable-next-line no-console
    console.warn('[email] RESEND_API_KEY missing; email send skipped');
    return;
  }
  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Password Reset OTP',
    html: `<p>Your OTP is: <strong>${otp}</strong></p>`,
  });
}
