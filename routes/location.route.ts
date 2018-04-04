import { Express, Request, Response } from 'express';

import { getCities, getCountries } from '../servises/locations.service';
import { HttpStatus } from '../enums/http-status';

module.exports = (app: Express): void => {
  app.get('/signup/get-locations', getFullLocations);
  app.get('/get-locations', getLocations);
  app.get('/get-countries', getCountriesList);
  app.get('/get-cities', getCitiesList);
};

async function getFullLocations(req: Request, res: Response): Promise<void> {
  const respObj = {
    countries: [],
    cities: []
  };

  try {
    respObj.countries = await getCountries();

    res.json(respObj);
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
  }
}

function getLocations(req: Request, res: Response): void {
  getCountries()
    .then(countries => {
      res.json({countries});
    })
    .catch (err => {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
    });
}

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
