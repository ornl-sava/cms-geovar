/*jshint browser:true, jquery:true, indent:2, globalstrict: true, laxcomma: true, laxbreak: true */
/*global define:true, _:true, d3:true, console:true */

'use strict';

define(function () {

  var indicators = [] // list of {'id': id, 'name': name}
    , national = {} // national averages {indicator: {year: avgValue}}
    , scales = {}; // d3 scales {indicator: {year: scale}}

  // parse out raw values into numbers
  function parseValue(value) {
    var num = NaN;
    if (value) {
      // remove commas from numbers
      var parsed = value.replace(/[^\d\.\-\ ]/g, '');
      // parse numbers into floats ('*' will be NaN)
      num = parseFloat(parsed);
    }
    return num;
  }


  // reorganize the data into a nested structure
  // each item in the list is an indicator, which has an array of values
  // each item in the values array has a year and a list of locales
  // each item in the locales array has a locale and a value
  // [ { 
  //    'name': indicator, 
  //    'values': [ {
  //      'year': year
  //      'locales': [ {
  //        'id': id,
  //        'name': name,
  //        'value': val
  //      } ]
  //    } ] 
  // } ]
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
            var val = parseValue(row[key]);
            // if the indicator has not been added, create it
            // storing 'indicator' here redundantly to set up scales
            if (! _.contains(indicatorsAdded, key)) {
              var indicator = {
                'name': key, 
                'id': indicatorId,
                'values': [
                  {
                    'year': year,
                    'indicatorId': indicatorId,
                    'indicator': key,
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
              indicators.push({'id': indicatorId, 'name': key});
              indicatorId++;
            }
            // key is already in list, push the values
            else {
              // if the year has not been added, create it
              if (! _.contains(yearsAdded[key], year)) {
                var yrLength = all[indicatorsIndex[key]].values.push(
                  {
                    'year': year, 
                    'indicatorId': _.find(indicators, function (val) {
                      return val.name === key;
                    }).id,
                    'indicator': key,
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
    
    // these could be done in the main loop, but easier to read here..
    
    // save national averages to national
    _.each(nationalData, function (row) {
      for (var key in row) {
        var year = row.Year;
        var value = parseValue(row[key]);
        // skip year and locale field
        if (key !== 'Year' && key !== 'Locale') {
          var id = _.find(indicators, function (val) {
                      return val.name === key;
                    }).id;
          // if the indicator is not already there, add it
          if (!national[id]) national[id] = {};
          national[id][year] = value;
        }
      }
    });
    
    // set domain for the scale based on all years for each indicator
    var range = d3.range(9).map(function (i) { return 'q' + i; });
    
    // each indicator
    _.each(all, function (indicator) {
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
        
        // set the scale
        var scale = d3.scale.quantile()
                              .range(range)
                              .domain([min, avg, max]);
        // if this id has not been added, then add it with empty object
        if (! scales[id]) scales[id] = {};
        // save this scale to the scales collection
        scales[id][year] = scale;
      });

    });
    
    return all;
  }
  
  
  return {
    buildNestedData: buildNestedData
  , scales: scales
  }
  
});