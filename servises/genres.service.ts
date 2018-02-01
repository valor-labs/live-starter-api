import * as mongoose from 'mongoose';

import { Genre } from '../models/genres';

const genresDB = mongoose.model('Genres');

export function getGenresFromDB(): Promise<Genre[]> {
  return genresDB
    .find({})
    .lean(true)
    .exec();
}
