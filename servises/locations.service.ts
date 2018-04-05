/* tslint:disable:no-any */
import * as mongoose from 'mongoose';

import { Country } from '../models/countries.model';
import { City } from '../models/cities.model';

const countriesDB = mongoose.model('Countries');
const citiesDB = mongoose.model('Cities');

export function getCountries(): Promise<Country[]> {
  return countriesDB
    .find({}, {_id: false, id: false})
    .lean(true)
    .exec();
}

export function getCities(country: string): Promise<City[]> {

  return citiesDB
    .find({country}, {_id: false, __v: false})
    .sort({name: 1})
    .lean(true)
    .exec();
}
