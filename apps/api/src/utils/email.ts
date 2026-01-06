// apps/api/src/utils/email.ts
import * as nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'email-smtp.ap-southeast-2.amazonaws.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.AWS_SES_SMTP_USER,
    pass: process.env.AWS_SES_SMTP_PASS,
  },
});

transporter.verify((error) => {
  if (error) {
    console.error('[email] SMTP connection failed:', error);
  } else {
    console.log('[email] SMTP server ready');
  }
});

export async function sendPasswordResetEmail(email: string, otp: string) {
  try {
    await transporter.sendMail({
      from: 'tuankhoaanh2104@gmail.com',
      to: email,
      subject: 'Password Reset OTP',
      html: `<p>Your OTP is: <strong>${otp}</strong></p>`,
    });
    console.log(`[email] Sent OTP to ${email}`);
  } catch (error) {
    console.error('[email] SEND FAILED:', error.message);
    throw error;
  }
}

export async function sendAssignmentEmail(
  email: string,
  testLink: string,
  note?: string,
) {
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

  await transporter.sendMail({
    from: 'tuankhoaanh2104@gmail.com',
    to: email,
    subject: 'Mời làm bài đánh giá MBTI từ HR',
    html,
  });
}