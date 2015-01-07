"use strict";

/**
 * Module exports
 */

var exports = module.exports;

exports.clone = clone;
exports.tmpPath = tmpPath;
exports.parseExtension = parseExtension;

/**
 * Utilities
 */

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function tmpPath(format) {
  if (!format) format = "jpg";

  var filename = Math.random().toString(36).substring(7);

  return "/tmp/" + filename + "." + format;
}

function parseExtension(path) {
  return /\.([a-z0-9]{3,5})$/i.exec(path)[1];
}
