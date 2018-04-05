import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

/**
 @typedef {Object} Users
 @property {String} genres - genres of a music
 */

export interface Country extends mongoose.Document {
  id: string;
  name: string;
  sortname: string;
}

const countriesSchema = new Schema({
  id: String,
  name: String,
  sortname: String
});

export default mongoose.model('Countries', countriesSchema);
