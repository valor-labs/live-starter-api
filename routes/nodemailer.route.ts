import { Express, Request, Response } from 'express';

import { NodeMailer } from '../servises/nodemailer.service';
import { SentMessageInfo } from 'nodemailer';
import { HttpStatus } from '../enums/http-status';

module.exports = (app: Express): void => {
  app.post('/callback-form', sendCallback);
};

export interface CallbackData {
  fullname: string;
  email: string;
  type: string;
  message: string;
}

function sendCallback(req: Request, res: Response): void | undefined {
  const body: CallbackData = req.body;

  if (!body.fullname || !body.fullname.length || !body.email || !body.type || !body.message || !body.message.length) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      title: 'Error',
      message: `Email didn't send! Invalid data, please try again`
    });

    return undefined;
  }

  const mailer = new NodeMailer();

  mailer.sendCallbackMessage(body, (err: Error, info: SentMessageInfo) => {
    if (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        title: 'Error',
        message: `Email didn't send! Please try again`
      });

      return undefined;
    }

    res.json({
      title: 'Thank you for getting in touch!',
      message: 'We will look over your message and get back to you soon.'
    });
  });
}
