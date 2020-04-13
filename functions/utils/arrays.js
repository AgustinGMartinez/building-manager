"use strict";

exports.removeUndefined = function (array) {
  var returnNullIfEmpty = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  if (!array) return array;
  var filtered = array.filter(function (val) {
    return val !== undefined;
  });
  if (!filtered.length && returnNullIfEmpty) return null;
  return filtered;
};