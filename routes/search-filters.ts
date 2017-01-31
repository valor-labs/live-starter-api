import { Request, Express }  from 'express';
import { head } from 'lodash';
import * as mongoose from 'mongoose';
const Genres: any = mongoose.model('Genres');
const Countries: any = mongoose.model('Countries');

module.exports = (app: Express): void => {
  app.get('/music-styles', getMusicStyles);
  app.get('/get-locations', getLocations);
};

function getMusicStyles(req: Request, res: any): Promise<any> {
  return Genres
    .find({}, {genres: 1})
    .limit(1)
    .lean(true)
    .exec((dbError: Error, data: any): Function => {
      const genres = head(data);

      return res.json({success: !dbError, data: genres, error: dbError});
    });
}

function getLocations(req: Request, res: any): Promise<any> {
  return Countries
    .find({})
    .lean(true)
    .exec((dbError: Error, data: any): Function => {
      return res.json({success: !dbError, data, error: dbError});
    });
}
