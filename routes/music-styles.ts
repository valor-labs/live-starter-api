'use strict';

module.exports = (app) => {
  app.get('/music-styles', getMusicStyles);
};

function getMusicStyles (req, res) {
  let response = {data: ['Rock', 'Art Punk', 'Folk Punk', 'Blues', 'Pop', 'Raggae', 'Techno', 'Rap', 'Electro']};
  res.json(response);
}