import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

/**
 @typedef {Object} Users
 @property {String} genres - genres of a music
 */
export interface Genre extends mongoose.Document {
  genres: string[];
}

const genresSchema = new Schema({
  genres: [String]
});

export default mongoose.model('Genres', genresSchema);
