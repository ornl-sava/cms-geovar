/*jshint browser:true, jquery:true, indent:2, globalstrict: true, laxcomma: true, laxbreak: true */
/*global define:true, _:true, d3:true, console:true */

'use strict';

/*
 * Module for loading and retrieving a nested data structure to be used with d3
 * each item in the list is an indicator, which has an array of values
 * each item in the values array has a year and a list of locales
 * each item in the locales array has a locale and a value
 * [ { 
 *    'id': indicatorId
 *    'values': [ {
 *      'year': year,
 *      'indicator': indicatorName,
 *      'locales': [ {
 *        'id': localeId,
 *        'name': localeName,
 *        'value': value
 *      } ]
 *    } ] 
 * } ]
 */
define(['util/parse', 'model/indicators', 'ui/colorScales'], function (parse, indicators, colorScales) {

  /*
   * buildNestedData: reorganize the data into a nested structure
   * @param {Array} data The initial, flat data structure
   * @param {Array} stateCodes The array of state fips codes, names, abbreviations
   * @returns {Array} all The new nested data structure
   */
  function buildNestedData(data, stateCodes) {
    
    // sorted list all years 
    var years = [2007, 2008, 2009, 2010];
        
    var all = [];

    // temporary data structures for created a nested list
    var indicatorsAdded = []; // temp list of which indicators have been added
    var indicatorsIndex = {}; // temp object of indicator:index
    var yearsAdded = {}; // temp list of which years have been added, in the form of indicator:[years..]
    var yearsIndex = {}; // temp object of indicator:year:index
    var indicatorId = 0; // id, incremented for each indicator
    var nationalData = []; // list of raw national data
    
    // populate new nested data structure
    for (var i = 0 ; i < data.length ; i++) {
      var row = data[i];
      var year = row.Year;
      var locale = row.Locale;
      // see if the row is the 'National' and save to national average
      if (locale === 'National') {
        nationalData.push(row);
      }
      else {
        // get info for each locale (id, name)
        var localeInfo = _.find(stateCodes, function (code) {
          return code.stateAbbr === locale;
        });
        var id = +localeInfo.code
          , name = localeInfo.name;
        // loop through all of the keys (indicators)
        for (var key in row) {
          // skip year and locale field
          if (key !== 'Year' && key !== 'Locale') {
            // parse values as numbers
            var val = parse.parseNumber(row[key]);
            // if the indicator has not been added, create it
            // storing 'indicator' here redundantly to set up scales
            if (! _.contains(indicatorsAdded, key)) {
              var indicator = {
                'id': indicatorId,
                'values': [
                  {
                    'year': year,
                    'indicatorId': indicatorId,
                    'locales': [{'id': id, 'name': name, 'value': val}]
                  }
                ]
              };
              // push the indicator onto the all data array
              var indicatorsLength = all.push(indicator);
              // set the index of the indicator
              indicatorsIndex[key] = indicatorsLength - 1;
              // add the indicator to the set of added indicators
              indicatorsAdded.push(key);
              // this is the first year added for the indicator, add the year as the first item in an array for this indicator
              yearsAdded[key] = [year];
              // first year for this indicator, so the index is 0
              yearsIndex[key] = {};
              yearsIndex[key][year] = 0;
              // add the indicator id/name to the lookup map
              indicators.add(indicatorId, key);
              indicatorId++;
            }
            // key is already in list, push the values
            else {
              // if the year has not been added, create it
              if (! _.contains(yearsAdded[key], year)) {
                var yrLength = all[indicatorsIndex[key]].values.push(
                  {
                    'year': year, 
                    'indicatorId': indicators.getIdFromName(key),
                    'locales': [{'id': id, 'name': name, 'value': val}]
                  }
                );
                yearsAdded[key].push(year);
                yearsIndex[key][year] = yrLength - 1;
              }
              // indicator and year are added, add the locale to the year
              else {
                // this is separated for readability, use the indices to get the array location and add the new value
                var indicatorVals = all[indicatorsIndex[key]].values;
                var yearVals = indicatorVals[yearsIndex[key][year]];
                yearVals.locales.push({'id': id, 'name': name, 'value': val});
              }
            }
          }
        }
      }
    }
    
    colorScales.build(all, nationalData);
    
    return all;
  }
  
  
  return {
    buildNestedData: buildNestedData
  };
  
});