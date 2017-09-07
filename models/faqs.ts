/* tslint:disable:no-any */

import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

/**
 @typedef {Object} Users
 @property {String} genres - genres of a music
 */
const faqsSchema = new Schema({
  poistion: Number,
  question: String,
  answer: String
});

export default mongoose.model('Faqs', faqsSchema);
