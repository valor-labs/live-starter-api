/* tslint:disable:no-any */
import * as mongoose from 'mongoose';

import { Country } from '../models/countries';
import { City } from '../models/cities';

const countriesDB = mongoose.model('Countries');
const citiesDB = mongoose.model('Cities');

export function getCountries(): Promise<Country[]> {
  return countriesDB
    .find({})
    .lean(true)
    .exec();
}

export function getCities(): Promise<City[]> {
  return citiesDB
    .find({})
    .lean(true)
    .exec();
}
