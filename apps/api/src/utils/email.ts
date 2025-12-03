import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail(email: string, otp: string) {
  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Password Reset OTP',
    html: `<p>Your OTP is: <strong>${otp}</strong></p>`,
  });
}
