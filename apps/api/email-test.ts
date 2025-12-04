// test-email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

async function test() {
  const res = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: 'tuankhoaanh2104@gmail.com',
    subject: 'Test OTP',
    html: '<p>Test: 123456</p>',
  });
  console.log(res);
}

test().catch(console.error);
