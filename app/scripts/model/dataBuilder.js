/*jshint browser:true, jquery:true, indent:2, globalstrict: true, laxcomma: true, laxbreak: true */
/*global define:true */

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
define(['lodash', 'util/parse', 'model/indicatorLookup', 'model/stateLookup', 'model/nationalData', 'ui/colorScales'], function (_, parse, indicators, states, national, colorScales) {

  // field names to use for the year and locale
  var validYearFields = ['Year', 'year', 'Yr', 'yr']
    , validLocaleFields = ['Locale', 'locale', 'State', 'state', 'HRR', 'hrr'];

  /*
   * buildNestedData: reorganize the data into a nested structure
   * @param {Array} data The initial, flat data structure
   * @returns {Array} all The new nested data structure
   */
  function buildNestedData(data) {
    
    // find field names to use for the year and locale
    var fields = _.keys(data[0]) // use the first row, they should all be the same
      , yearField = _.find(fields, function (field) {
          return _.contains(validYearFields, field);
        })
      , localeField = _.find(fields, function (field) {
          return _.contains(validLocaleFields, field);
        });
        
    // new array to put the nested data into
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
      var year = row[yearField];
      var locale = row[localeField];
      // see if the row is the 'National' and save to national average
      if (locale === 'National') {
        nationalData.push(row);
      }
      else {
        // get info for each locale (id, name)
        var id = states.getIdFromAbbreviation(locale)
          , name = states.getNameFromId(id);
        // loop through all of the keys (indicators)
        for (var key in row) {
          // skip year and locale field
          if (key !== yearField && key !== localeField) {
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
    
    // create national averages
    national.build(nationalData);
    
    // create color scales
    colorScales.build(all);
    
    return all;
  }
  
  
  return {
    build: buildNestedData
  };
  
});