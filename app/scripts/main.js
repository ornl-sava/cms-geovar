/*jshint browser:true, jquery:true, indent:2, globalstrict: true, laxcomma: true, laxbreak: true */
/*global _:true, d3:true, queue:true, topojson:true, Spinner:true, console:true */

'use strict';

(function () {
  
  // width and height are set in css for divs
  var width = 190
    , height = 135
    , stateCodes // lookup for fips code, name, abbreviation
    , stateGeom // topojson topology objects
    , stateBorders // topojson mesh for borders
    , scales = {}
    , spinner = new Spinner({top: 100, radius: 15, length: 16, width: 6});
    
  var projection = d3.geo.albersUsa()
                      .scale(width + 20)
                      .translate([(width + 20) / 2, (height / 2) + 10]);
                
  var path = d3.geo.path().projection(projection);

  // progress spinner while loading
  spinner.spin(document.getElementById('vis'));
      
  // load the data
  queue()
    .defer(d3.csv, '/data/national-2007-2010-trimmed.csv')
    .defer(d3.csv, '/data/states-2007-2010-trimmed.csv')
    .defer(d3.json, '/data/us-d3.json')
    .defer(d3.json, '/data/state-codes.json')
    .await(dataLoaded);


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
  function buildNestedData(data) {
    
    // sorted list all years 
    var years = [2007, 2008, 2009, 2010];
        
    // populate new nested data structure
    var all = [];
    var indicatorsAdded = []; // temp list of which indicators have been added
    var indicatorsIndex = {}; // temp object of indicator:index
    var yearsAdded = {}; // temp list of which years have been added, in the form of indicator:[years..]
    var yearsIndex = {}; // temp object of indicator:year:index
    for (var i = 0 ; i < data.length ; i++) {
      var row = data[i];
      var year = row.Year;
      var locale = row.Locale;
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
          var val;
          if (row[key]) {
            // remove commas from numbers
            var num = row[key].replace(/[^\d\.\-\ ]/g, '');
            // parse numbers into floats ('*' will be NaN)
            val = parseFloat(num);
          }
          else {
            val = NaN;
          }
          // if the indicator has not been added, create it
          // storing 'indicator' here redundantly to set up scales
          if (! _.contains(indicatorsAdded, key)) {
            var indicator = {
              'name': key, 
              'values': [
                {
                  'year': year,
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
          }
          // key is already in list, push the values
          else {
            // if the year has not been added, create it
            if (! _.contains(yearsAdded[key], year)) {
              var yrLength = all[indicatorsIndex[key]].values.push(
                {
                  'year': year, 
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
    
    // this could be done in the main loop, but easier to read here
    // set domain for the scale based on all years for each indicator
    var range = d3.range(9).map(function (i) { return "q" + i + "-9"; });
    _.each(all, function (val) {
      var min = d3.min(val.values, function (d) { return d3.min(d.locales, function (d) { return d.value; }); });
      var max = d3.max(val.values, function (d) { return d3.max(d.locales, function (d) { return d.value; }); });

      var quantize = d3.scale.quantize()
              .range(range)
              .domain([min, max]);
      scales[val.name] = quantize;
    });
    
    return all;
  }

  function dataLoaded(error, nationalData, stateData, topology, codes) {
    
    stateCodes = codes;
    
    stateGeom = topojson.object(topology, topology.objects.states).geometries;

    stateBorders = topojson.mesh(topology, topology.objects.states, function (a, b) { return a.id !== b.id; });
    
    // build nested data structure
    var nestedData = buildNestedData(stateData);

    // set up the entire page
    var pre = d3.select('#previews').selectAll('.row')
            .data(nestedData)
          .enter()
            .append('div')
            .attr('class', 'row');

    pre.each(loadIndicators);

    // set up tooltips
    $('.rowLabel').tipsy({gravity: 's', fade: true, delayIn: 500});
    $('.states').tipsy({gravity: $.fn.tipsy.autoNS, html: true});
        
    // everything is loaded, stop the spinner
    spinner.stop();
  }

  // load each row (label and maps for each year)
  function loadIndicators(d, i) {
    
    //console.log(d);
    
    var base = d3.select(this);
    
    // heuristic to keep labels from overflowing
    var label = d.name > 100 ? (d.name.substr(0, 100) + ' ...') : d.name;
    
    base.append('div')
        .attr('class', 'rowLabel')
        .attr('title', d.name)
        .html(label);
        
    var row = base.selectAll('.preview')
                .data(d.values)
              .enter()
                .append('div')
                .attr('class', 'preview')
                .style('width', width)
                .style('height', height);

    // each div has its own svg
    var svgs = row.append('svg')
            .attr('width', width)
            .attr('height', height);
            
    // each svg has a context that the map is drawn on
    var previews = svgs.append('g');

    previews.each(loadMaps);
    
  }

  // load each cell (one map for each year)
  function loadMaps(datum, indx) {
    
    //console.log(datum);
    
    // set up lookup table for scale based on values for this map
    var valueById = {};
    _.each(datum.locales, function (d) { valueById[+d.id] = +d.value; });
    
    // number formatter to add thousands separator
    var numFormatter = d3.format(',');
    
    var base = d3.select(this);
    
    // draw background
    base.append('rect')
        .attr('width', width)
        .attr('height', height)
        .attr('class', 'mapBg');
          
    var map = base.append('g');
    
    // year label on each map
    map.append('text')
        .text(function (d) { return datum.year; })
        .attr('class', 'mapTitle')
        .attr('text-anchor', 'middle')
        .attr('x', width / 2)
        .attr('dy', '1.3em');

    // load the geometry objects
    map.selectAll('path')
        .data(stateGeom)
      .enter().append('path')
        .attr('d', path)
        .attr('class', function (d) {
          var quantize = scales[datum.indicator];
          var q = quantize(valueById[+d.id]);
          return 'states ' + (typeof q !== undefined ? q : '');
        })
        .attr('title', function (d) {
          var l = _.find(datum.locales, function (locale) {
            return d.id === locale.id;
          });
          var domain = scales[datum.indicator].domain();
          return '<big><strong>' + l.name + ' &raquo; ' + numFormatter(l.value) + '</strong></big><br />'
                + 'min: ' + domain[0] + ' / max: ' + domain[1] + '<br />'
                + '<small>' + datum.indicator + '</small>';
        });

    // draw the internal borders only (a.id !== b.id)
    map.append('path')
        .datum(stateBorders)
        .attr('d', path)
        .attr('class', 'states-boundary');
    
  }

  
}());