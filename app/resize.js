'use strict';

/*
Team yeti
This module is used to resize the pictures before they are stored in to the server. It creates a square everytime.
 */

const sharp = require('sharp');

const doResize = (pathToFile, width, newPath, next) => {
  sharp(pathToFile)
    .resize(width, width)
    .toFile(newPath)
    .then(() => {
      console.log('Resize OK');
      next();
    }).catch(err => {
      console.log(err)
    });
};


module.exports = {
  doResize: doResize,
};