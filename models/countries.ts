import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

/**
 @typedef {Object} Users
 @property {String} genres - genres of a music
 */
const countriesSchema = new Schema({
  id: String,
  sortname: String,
  name: String
});

export default mongoose.model('Countries', countriesSchema);
