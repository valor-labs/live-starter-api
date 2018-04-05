import { Express, Request, Response } from 'express';

import { getCities, getCountries } from '../servises/locations.service';
import { HttpStatus } from '../enums/http-status';

module.exports = (app: Express): void => {
  app.get('/get-countries', getCountriesList);
  app.get('/get-cities', getCitiesList);
};

function getCountriesList(req: Request, res: Response): void {
  getCountries()
    .then(countries => {
      res.json(countries);
    })
    .catch (err => {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
    });
}

function getCitiesList(req: Request, res: Response): void | undefined {
  const query = req.query;

  if (!query.country) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({message: 'Country is empty'});

    return undefined;
  }

  getCities(query.country)
    .then(countries => {
      res.json(countries);
    })
    .catch (err => {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
    });
}
