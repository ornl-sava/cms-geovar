/*jshint browser:true, jquery:true, indent:2, globalstrict: true, laxcomma: true, laxbreak: true */
/*global _:true, d3:true, queue:true, topojson:true, Spinner:true, console:true */

'use strict';

(function () {
  
  // width and height are set in css for divs
  var width = 190
    , height = 135
    , topology
    , stateCodes
    , spinner = new Spinner({top: 100, radius: 15, length: 16, width: 6});
    
  var projection = d3.geo.albersUsa()
                      .scale(width + 20)
                      .translate([(width + 20) / 2, (height / 2) + 10]);
                
  var path = d3.geo.path().projection(projection);

  // progress spinner while loading
  spinner.spin(document.getElementById('vis'));
      
  // load the data
  queue()
    .defer(d3.json, '/data/test.json')
    //.defer(d3.json, '/data/national-2007-2010.json')
    .defer(d3.csv, '/data/raw/tests.csv')
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
  //        'locale': locale,
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
      for (var key in row) {
        // skip year and locale field
        if (key !== 'Year' && key !== 'Locale') {
          // remove commas from numbers
          var num = row[key].replace(/[^\d\.\-\ ]/g, '');
          // parse numbers into floats ('*' will be NaN)
          var val = parseFloat(num);
          // if the indicator has not been added, create it
          if (! _.contains(indicatorsAdded, key)) {
            var indicator = {
              'name': key, 
              'values': [
                {
                  'year': year, 
                  'locales': [{'locale': locale, 'value': val}]
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
              var yrLength = all[indicatorsIndex[key]]['values'].push(
                {
                  'year': year, 
                  'locales': [{'locale': locale, 'value': val}]
                }
              );
              yearsAdded[key].push(year);
              yearsIndex[key][year] = yrLength - 1;
            }
            // indicator and year are added, add the locale to the year
            else {
              // this is separated for readability, use the indices to get the array location and add the new value
             var indicatorVals = all[indicatorsIndex[key]]['values'];
             var yearVals = indicatorVals[yearsIndex[key][year]];
             var locales = yearVals.locales.push({'locale': locale, 'value': val});
            }
          }
        }
      }
    }
    
    return all;
  }

  function dataLoaded(error, nationalData, stateData, topo, stateCodes) {
    
    // TopoJSON US topology map
    topology = topo;
    
    // load the state codes into a variable
    stateCodes = stateCodes;

    // build nested data structure
    var nestedData = buildNestedData(stateData);
    console.log(nestedData);

    // set up the entire page
    var pre = d3.select('#previews').selectAll('.row')
            .data(nestedData)
          .enter()
            .append('div')
            .attr('class', 'row');

    pre.each(loadIndicators);

    // set up tooltips
    $('.rowLabel').tipsy({gravity: 's', fade: true, delayIn: 500});
    /*
    $('.states').tipsy({
      gravity: 's'
    , offset: -10
    , title: function () {
        var d = this.__data__;
        return d.name;
      }
    });
    */
        
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
            
    // each svg has a g context
    var previews = svgs.append('g');

    previews.each(loadMaps);
    
    
  }

  // load each cell (one map for each year)
  function loadMaps(d, i) {
    
    console.log(d);
    
    var base = d3.select(this);
    
    // draw background
    base.append('rect')
        .attr('width', width)
        .attr('height', height)
        .attr('class', 'mapBg');
          
    var map = base.append('g');
    
    map.append('path')
      .datum(topojson.object(topology, topology.objects.land))
      .attr('d', path);
    
    map.append('text')
        .text(function (d) { return d.year; })
        .attr('class', 'mapTitle')
        .attr('text-anchor', 'middle')
        .attr('x', width / 2)
        .attr('dy', '1.3em');

/*          
    // geometries for all of the locales for the given level
    var locales = topojson.object(topology, topology.objects[level]).geometries;
    
    // load the geometry objects
    var locale = container.selectAll('path')
        .data(locales)
      .enter().append('path')
        .attr('d', path)
        .attr('class', level)
        .attr('display', show ? 'inherit' : 'none');
    
    // add names for each locale from lookup code
    locales.forEach(function (d) {
      var el;
      if (level === 'states') {
        // pad with leading zero for state ids for lookup
        var id = ('0' + d.id).slice(-2);
        el = stateCodes[id];
        if (el) {
          d.level = 'state';
          d.name = el.name;
        }
        else {
          console.log('Problem with state '  + d.id);
        }
      }
    });
    
    // draw the internal borders only (a.id !== b.id)
    container.append('path')
        .datum(topojson.mesh(topology, topology.objects[level], function (a, b) { return a.id !== b.id; }))
        .attr('d', path)
        .attr('class', level + '-boundary')
        .attr('display', show ? 'inherit' : 'none');
        */
        
  }

  
}());