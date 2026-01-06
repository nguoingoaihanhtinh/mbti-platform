import * as nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'email-smtp.ap-southeast-2.amazonaws.com',
  port: 587,
  secure: false,
  auth: {
    user: 'AKIA2U3CM34OSVQ3K3OM',
    pass: 'BEggxUE91sRNWdLy/BzY8B2oSiwIKL5oTDoNe5n5j6mk',
  },
});

transporter.verify((err, success) => {
  if (err) {
    console.error('❌ FAILED:', err.message);
  } else {
    console.log('✅ SMTP OK');
  }
});
