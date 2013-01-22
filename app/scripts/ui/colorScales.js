/*jshint browser:true, jquery:true, indent:2, globalstrict: true, laxcomma: true, laxbreak: true */
/*global define:true, d3:true */

'use strict';

/*
 * Module for loading and retrieving [d3 quantile scales](https://github.com/mbostock/d3/wiki/Quantitative-Scales#wiki-quantile) for defining colors
 * Scales are defined by the minimum, national average, and maximum
 */
define(['lodash', 'util/parse', 'model/indicators'], function (_, parse, indicators) {

  var scales = {}  // d3 scales {indicator: {year: scale}}
  , national = {}; // national averages {indicator: {year: avgValue}}

  
  /*
   * build: create the color scales based on the data
   * @param {Array} data The full nested data structure
   * @param {Array} nationalData The national averages to use in the scales
   */
  function build(data, nationalData) {

    // save national averages to national
    _.each(nationalData, function (row) {
      for (var key in row) {
        var year = row.Year;
        var value = parse.parseNumber(row[key]);
        // skip year and locale field
        if (key !== 'Year' && key !== 'Locale') {
          var id = indicators.getIdFromName(key);
          // if the indicator is not already there, add it
          if (!national[id]) national[id] = {};
          national[id][year] = value;
        }
      }
    });
    
    // set domain for the scale based on all years for each indicator
    var range = d3.range(9).map(function (i) { return 'q' + i; });
    
    // each indicator
    _.each(data, function (indicator) {
      var id = indicator.id;
      // each year
      _.each(indicator.values, function (row) {
        var year = row.year;
        
        //TODO max and min are getting national average values!?!
        
        // get min/max for each year
        var min = d3.min(row.locales, function (d) { return d.value; });
        var max = d3.max(row.locales, function (d) { return d.value; });
        
        // national average
        var avg = national[id][year];
        
        var domain = [min, avg, max];

        // set the scale
        var scale = d3.scale.quantile()
                              .range(range)
                              .domain(domain);
        // if this id has not been added, then add it with empty object
        if (! scales[id]) scales[id] = {};
        // save this scale to the scales collection
        scales[id][year] = scale;
      });

    });
    
  }
  
  /*
   * get: retrieve a specific color scale
   * @param {Number} id The ID of the indicator
   * @param {Number} year The year of the indicator
   * @returns {Function} [d3 Quantile Scale](https://github.com/mbostock/d3/wiki/Quantitative-Scales#wiki-quantile)
   */
  var get = function (id, year) {
    return scales[id][year];
  };
  
  
  return {
    get: get
  , build: build
  };
  
});