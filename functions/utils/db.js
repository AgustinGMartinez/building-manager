"use strict";

var createQueryValues = function createQueryValues(initialQuery, data, argsPerEntry) {
  var newQuery = '';
  data.forEach(function (_, i) {
    var nextVal = i + 1;
    if (nextVal % argsPerEntry === 1) newQuery += ' (';
    newQuery += "$".concat(nextVal);
    if (nextVal % argsPerEntry !== 0) newQuery += ', ';else {
      var isLastValue = nextVal === data.length;
      newQuery += ')' + (isLastValue ? '' : ',');
    }
  });
  return initialQuery.replace('?', newQuery);
};

exports.createQueryValues = createQueryValues;