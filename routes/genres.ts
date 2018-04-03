import { Express, Request, Response } from 'express';

import { getGenresFromDB } from '../servises/genres.service';
import { authCheck } from './auth.route';
import { HttpStatus } from '../enums/http-status';

module.exports = (app: Express): void => {
  app.get('/get-genres', getGenres);
};

function getGenres(req: Request, res: Response): void {
  getGenresFromDB()
    .then(result => {
      res.json(result[0].genres);
    })
    .catch(err => {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
    });
}
