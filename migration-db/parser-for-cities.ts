/* tslint:disable:no-console */
/* tslint:disable:no-var-requires */

// https://github.com/lutangar/cities.json

import * as mongoose from 'mongoose';

// for getting cities.json you should use this package https://github.com/lutangar/cities.json;
// const citiesList = require('./cities.json');
const citiesList = [];

const cityModel = mongoose.model('Cities');

export function createCity(): void {
  const citiesListLength = citiesList.length;
  let numItems = 0;

  citiesList.forEach(city => {
    const newcity = new cityModel(city);

    newcity.save().then(() => {
      numItems ++;

      if (numItems >= citiesListLength) {
        console.log(`saved ${numItems} items of ${citiesListLength}`);
      }
    });
  });
}