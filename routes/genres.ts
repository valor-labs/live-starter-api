import { Express, Request, Response } from 'express';

import { getGenresFromDB } from '../servises/genres.service';
import { authCheck } from './auth.route';

module.exports = (app: Express): void => {
  app.get('/get-genres', getGenres);
};

function getGenres(req: Request, res: Response): void {
  getGenresFromDB()
    .then(result => {
      res.json(result[0].genres);
    })
    .catch(err => {
      const status = 500;
      res.status(status).send(err);
    });
}
