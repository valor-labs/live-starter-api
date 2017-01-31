'use strict';

import mongoose = require('mongoose');
const Genres: any = mongoose.model('Genres');

module.exports = (app) => {
  app.get('/music-styles', getMusicStyles);
};

function getMusicStyles (req, res) {
	Genres
		.find({}, {genres: 1})
		.lean()
		.exec((dbError, data) => {
      if (dbError) {
        return res.json({success: !dbError, data: null, error: dbError});
      }

      return res.json({success: !dbError, data: data, error: dbError});
    });
}