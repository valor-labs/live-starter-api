const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
 @typedef {Object} Users
 @property {String} genres - genres of a music
 */
const countriesSchema = new Schema({
    code: String,
    country: String,
    lat: Number,
    lng: Number,
    alias: String
});
mongoose.model('Countries', countriesSchema);
