import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

/**
 @typedef {Object} Users
 @property {String} genres - genres of a music
 */
const countriesSchema = new Schema({
  code: String,
  country: String,
  lat: Number,
  lng: Number,
  alias: String
});

export default mongoose.model('Countries', countriesSchema);
