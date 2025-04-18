import nodemailer from 'nodemailer';
import config from '../../app/config';
export const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: config.NODE_ENV === 'production',
    auth: {
      user: 'servicesfoodie@gmail.com',
      pass: 'xrrm hojg huwk gobw',
    },
  });
  await transporter.sendMail({
    from: 'servicesfoodie@gmail.com', // sender address
    to,
    subject: 'Password change Link : change it by 10 minutes',
    html,
  });
};
