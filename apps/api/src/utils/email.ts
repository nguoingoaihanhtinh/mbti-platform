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

export async function sendAssignmentEmail(
  email: string,
  testLink: string,
  note?: string,
) {
  const resend = getResend();
  if (!resend) return;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto;">
      <h2 style="color: #4f46e5;">Bạn được mời làm bài đánh giá MBTI</h2>
      <p>Xin chào,</p>
      <p>Bạn được mời làm bài đánh giá tính cách MBTI bởi doanh nghiệp của bạn.</p>
      ${note ? `<p><strong>Ghi chú từ HR:</strong> ${note}</p>` : ''}
      <p>
        <a href="${testLink}" style="display: inline-block; background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
          Bắt đầu làm bài
        </a>
      </p>
      <p>Bài test mất khoảng 10–15 phút. Kết quả sẽ được chia sẻ với bạn và HR sau khi hoàn thành.</p>
      <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;" />
      <p style="color: #6b7280; font-size: 12px;">
        Đây là email tự động. Vui lòng không phản hồi.
      </p>
    </div>
  `;

  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Mời làm bài đánh giá MBTI từ HR',
    html,
  });
}
