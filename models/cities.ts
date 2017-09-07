import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

/**
 @typedef {Object} Users
 @property {String} genres - genres of a music
 */

export interface City extends mongoose.Document {
  city: string;
  country: string;
  lat: number;
  lng: number;
  alias: number;
}

export const citiesSchema = new Schema({
  city: String,
  country: {type: Schema.Types.ObjectId, ref: 'Countries'},
  lat: Number,
  lng: Number,
  alias: String
});

export default mongoose.model('Cities', citiesSchema);
