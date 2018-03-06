import * as nodemailer from 'nodemailer';
import { SentMessageInfo } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';

import { GMAIL_CONFIG } from '../config/gmail.config';
import { CallbackData } from '../routes/nodemailer.route';

export class NodeMailer {
  private transporter: Mail = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      type: 'OAuth2',
      user: GMAIL_CONFIG.USER,
      clientId:  GMAIL_CONFIG.CLIENT_ID,
      clientSecret:  GMAIL_CONFIG.CLIENT_SECRET,
      refreshToken:  GMAIL_CONFIG.REFRESH_TOKEN
    }
  });

  private mailOptions: Mail.Options = {
    from: GMAIL_CONFIG.USER,
    subject: 'Livestarter',
    html: '',
    to: ''
  };

  sendEmail( resultCB: Function): void {
    this.transporter.sendMail(this.mailOptions, (error: Error, info: SentMessageInfo) => {
      this.mailOptions.subject = 'Livestarter';
      this.mailOptions.to = '';
      this.mailOptions.html = '';

      return resultCB(error, info);
    });
  }

  sendCallbackMessage(data: CallbackData, resultCB: Function): void {
    this.mailOptions.subject = 'Livestarter Callback';
    this.mailOptions.to = GMAIL_CONFIG.USER;
    this.mailOptions.html = `<p><strong>Full name:</strong> ${data.fullname}<p/>
                             <p><strong>Email:</strong> ${data.email}<p/>
                             <p><strong>Type:</strong> ${data.type}<p/>
                             <p><strong>Message:</strong> ${data.message}<p/>`;

    this.sendEmail(resultCB);
  }
}
