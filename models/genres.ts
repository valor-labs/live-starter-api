const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 @typedef {Object} Users
 @property {String} genres - genres of a music
 */
const genresSchema = new Schema({
  genres: String
});

mongoose.model('Genres', genresSchema);
