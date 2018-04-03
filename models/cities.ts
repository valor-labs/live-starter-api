import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

/**
 @typedef {Object} Users
 @property {String} genres - genres of a music
 */

export interface City extends mongoose.Document {
  name: string;
  country: string;
  lat: string;
  lng: string;
}

export const citySchema = new Schema({
  name: String,
  country: String,
  lat: String,
  lng: String
});

export default mongoose.model('Cities', citySchema);
