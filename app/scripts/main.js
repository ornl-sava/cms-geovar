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
  
  // set up truncation for long lines
  $('.rowLabel').trunk8({lines: 2});
    
  // load the data
  queue()
    .defer(d3.json, '/data/test.json')
    //.defer(d3.json, '/data/national-2007-2010.json')
    .defer(d3.json, '/data/states-2007-2010.json')
    .defer(d3.json, '/data/us-d3.json')
    .defer(d3.json, '/data/state-codes.json')
    .await(dataLoaded);


  // reorganize the data into a nested structure
  // [ { 
  //    'name': indicator, 
  //    'values': [ {
  //      'year': year,
  //      'value': val
  //    } ] 
  // } ]
  function buildNestedData(data) {
    // sorted list all years 
    var years = [2007, 2008, 2009, 2010];
        
    // populate new nested data structure
    var all = [];
    var added = []; // temp list of which keys have been added
    var indices = {}; // temp object of keys:index
    for (var i = 0 ; i < data.length ; i++) {
      var row = data[i];
      var year = row.Year;
      var locale = row.Locale;
      for (var key in row) {
        if (key !== 'Year' && key !== 'Locale') {
          var val = parseFloat(row[key]);
          // if the key has not been added, create it
          if (! _.contains(added, key)) {
            var entry = {'name': key, 'values': [{'year': year, 'value': val}]};
            var lngth = all.push(entry);
            indices[key] = lngth - 1;
            added.push(key);
          }
          // key is already in list, push the values
          else {
            all[indices[key]]['values'].push({'year': year, 'value': val});
          }
        }
      }
    }
    
    // empty temporary variables, is this necessary?
    added = [];
    indices = {};
    
    return all;
  }

  function dataLoaded(error, nationalData, stateData, topo, stateCodes) {
    
    // TopoJSON US topology map
    topology = topo;
    
    // load the state codes into a variable
    stateCodes = stateCodes;

    // build nested data structure
    var nestedData = buildNestedData(nationalData);
    console.log(nestedData);

    // set up the entire page
    var pre = d3.select('#previews').selectAll('.row')
            .data(nestedData)
          .enter()
            .append('div')
            .attr('class', 'row');

    pre.each(loadIndicators);

    // set up tooltips
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
    
    console.log(d);
    
    var base = d3.select(this);
    
    var id = d.name.length < 20 ? d.name.substr(2) : d.name.substr(2, 21);
    
    base.append('div')
        .attr('id', id)
        .attr('class', 'rowLabel')
        .html(d.name);

    $('#' + id).trunk8('update', d.name);
        
    var row = base.selectAll('.preview')
                .data(d.values)
              .enter()
                .append('div')
                .attr('class', 'preview')
                .attr('width', width)
                .attr('height', height);

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
        .attr('class', 'background');
          
    var map = base.append('g');
    
    map.append('path')
      .datum(topojson.object(topology, topology.objects.land))
      .attr('d', path);
    
    map.append('text')
        .text(function (d) { return d.year; })
        .attr('class', 'title')
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