import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

/**
 @typedef {Object} Users
 @property {String} genres - genres of a music
 */
const countriesSchema = new Schema({
  id: String,
  name: String,
  sortname: String
});

export default mongoose.model('Countries', countriesSchema);
