import { Express, Request, Response } from 'express';

import { getCities, getCountries } from '../servises/locations.service';

module.exports = (app: Express): void => {
  app.get('/signup/get-locations', getFullLocations);
  app.get('/get-locations', getLocations);
};

async function getFullLocations(req: Request, res: Response) {
  const respObj = {
    countries: [],
    cities: []
  };

  try {
    respObj.countries = await getCountries();
    respObj.cities = await getCities();

    res.json(respObj);
  } catch (err) {
    const status = 500;
    res.status(status).send(err);
  }
}

function getLocations(req: Request, res: Response) {
  getCountries()
    .then(countries => {
      res.json({countries});
    })
    .catch (err => {
      const status = 500;
      res.status(status).send(err);
    });
}
