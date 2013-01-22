/*jshint browser:true, jquery:true, indent:2, globalstrict: true, laxcomma: true, laxbreak: true */
/*global define:true */

'use strict';

/*
 * Module for adding and retrieving national average data
 */
define(['lodash', 'model/indicatorLookup', 'util/parse'], function (_, indicators, parse) {

  var national = {}; // national averages {indicator: {year: avgValue}}
  
  /*
   * build: create the array of national averages
   * @param {Array} nationalData The national averages
   */
  function buildNestedNationalData(nationalData) {

    // save national averages to national
    _.each(nationalData, function (row) {
      for (var key in row) {
        var year = row.Year;
        var value = parse.parseNumber(row[key]);
        // skip year and locale field
        if (key !== 'Year' && key !== 'Locale') {
          // compute average for count of benes
          // assumes 51 states - 50 states plus DC
          if (key === 'Count of Beneficiaries') {
            value = Math.round(value / 51);
          }
          var id = indicators.getIdFromName(key);
          // if the indicator is not already there, add it
          if (!national[id]) national[id] = {};
          national[id][year] = value;
        }
      }
    });

  }

  /*
   * getNationalAverage: retrieve national average
   * @param {Number} id The indicator ID
   * @param {Number} year The year
   */
  function getNationalAverage(id, year) {
    return national[id][year];
  }
  
  
  return {
    build: buildNestedNationalData
  , get: getNationalAverage
  };

});