const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 @typedef {Object} Users
 @property {String} genres - genres of a music
 */
const citiesSchema = new Schema({
  city: String,
  country: {type: Schema.Types.ObjectId, ref: 'Countries'},
  lat: Number,
  lng: Number,
  alias: String
});

mongoose.model('Cities', citiesSchema);
