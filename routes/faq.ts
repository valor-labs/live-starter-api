import { Request, Express, Response } from 'express';
import { model } from 'mongoose';

import { HttpStatus } from '../enums/http-status';

const faqs = model('Faqs');

module.exports = (app: Express): void => {
  app.get('/getFAQs', getFAQsData);
};

async function getFAQsData(req: Request, res: Response): Promise<void> {
  try {
    const faqsList = await faqs
      .find({})
      .lean(true)
      .exec();

    res.json(faqsList);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
}
