import { Request, Express }  from 'express';
import * as mongoose from 'mongoose';
const Faqs: any = mongoose.model('Faqs');

module.exports = (app: Express): void => {
  app.get('/getFAQs', getFAQsData);
};

function getFAQsData(req: Request, res: any): Promise<any> {
  return Faqs
    .find({})
    .lean(true)
    .exec((err: Error, data: any[]): Function => {
      return res.json({success: !err, data, error: err});
      }
    );
}
