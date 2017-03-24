import { Request, Express }  from 'express';
import { head } from 'lodash';
import * as mongoose from 'mongoose';

const Genres: any = mongoose.model('Genres');
const Countries: any = mongoose.model('Countries');
const Users: any = mongoose.model('Users');
const Events: any = mongoose.model('Events');

module.exports = (app: Express): void => {
  app.get('/music-styles', getMusicStyles);
  app.get('/get-locations', getLocations);
  app.get('/get-artists-list', getArtistsList);
  app.get('/get-featured-artists-list', getFeaturedArtistsList);
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

function getArtistsList(req: Request, res: any): Promise<any> {
  const query: any = req.query;
  const findArtstsBy: any = {active: true};

  if (query.findByName) {
    findArtstsBy.username = query.findByName;
  }

  if (query.findByLocation) {
    findArtstsBy.country = query.findByLocation;
  }

  if (query.findByGenre) {
    findArtstsBy.genres = query.findByGenre;
  }

  return Users
    .find(findArtstsBy)
    .lean(true)
    .exec((err: Error, data: any): Function => {
        return res.json({success: !err, data: {artists: data, amount: data.length}, error: err});
      }
    );
}

function getFeaturedArtistsList(req: Request, res: any): Promise<any> {
  const findArtstsBy: any = {active: true};

  return Users
    .find(findArtstsBy)
    .limit(3)
    .lean(true)
    .exec((err: Error, data: any): Function => {
        return res.json({success: !err, data: {artists: data}, error: err});
      }
    );
}
