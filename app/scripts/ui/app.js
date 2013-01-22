/*jshint browser:true, jquery:true, indent:2, globalstrict: true, laxcomma: true, laxbreak: true */
/*global define:true, _:true, d3:true, queue:true, topojson:true, Spinner:true, console:true */

'use strict';

/*
 * Module for loading and retrieving [d3 quantile scales](https://github.com/mbostock/d3/wiki/Quantitative-Scales#wiki-quantile) for defining colors
 * Scales are defined by the minimum, national average, and maximum
 */
define(['model/data', 'ui/colorScales'], function (data, colorScales) {

  // width and height are set in css for divs
  var width = 190
    , height = 135
    , stateCodes // lookup for fips code, name, abbreviation
    , localeGeom // topojson topology objects
    , localeBorders // topojson mesh for borders
    , spinner = new Spinner({top: 100, radius: 15, length: 16, width: 6})
    , startTime = Date.now()
    , projection = d3.geo.albersUsa()
                    .scale(width + 20)
                    .translate([(width + 20) / 2, (height / 2) + 10])
    , path = d3.geo.path().projection(projection);

  /*
   * init: main initialization for the app
   */
  function init() {
    // progress spinner while loading
    spinner.spin(document.getElementById('vis'));
      
    // load the data
    queue()
      .defer(d3.json, 'data/state-codes.json')
      .defer(d3.csv, 'data/states-2007-2010-trimmed.csv')
      .defer(d3.json, 'data/us-small.json')
      .await(_dataLoaded);

  }


  /*
   * _dataLoaded: all data has been loaded, create the nested data and vis
   * @param {String} error null Error message, or null if no error
   * @param {Array} codes Fips codes, names, abbreviations for states
   * @param {Array} stateData State level data as a flat array of objects
   * @param {Object} topology Topojson data
   */
  function _dataLoaded(error, codes, stateData, topology) {
    
    stateCodes = codes;
    
    // build nested data structure
    var nestedData = data.buildNestedData(stateData, stateCodes);

    // save geometry and borders
    localeGeom = topojson.object(topology, topology.objects.states).geometries;

    localeBorders = topojson.mesh(topology, topology.objects.states, function (a, b) { return a.id !== b.id; });
        
    // set up the entire page
    var pre = d3.select('#previews').selectAll('.row')
            .data(nestedData)
          .enter()
            .append('div')
            .attr('class', 'row');

    pre.each(loadIndicators);

    // set up tooltips
    $('.rowLabel').tipsy({gravity: 's', fade: true, delayIn: 500});
    $('.mapLocale').tipsy({gravity: $.fn.tipsy.autoNS, html: true});
        
    // everything is loaded, stop the spinner
    spinner.stop();
    
    console.log('Total load time: ' + ((Date.now() - startTime) / 1000) + ' seconds.');
    
  }

  // load each row (label and maps for each year)
  function loadIndicators(d, i) {
    
    //console.log(d);
    
    var base = d3.select(this);
    
    // heuristic to keep labels from overflowing
    var label = d.name.length > 90 ? (d.name.substr(0, 90) + ' ...') : d.name;
    
    base.append('div')
        .attr('class', 'rowLabel')
        .attr('title', d.name)
        .html(label);
        
    var row = base.selectAll('.preview')
                .data(d.values)
              .enter()
                .append('div')
                .attr('class', function (d) {
                  return 'indicator-' + (+d.id) + ' preview';
                })
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
    
    // scale for this datum (indicator/year)
    var scale = colorScales.get(datum.indicatorId, datum.year);
    
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

    // load the geometry objects and set the color and title
    map.selectAll('path')
        .data(localeGeom)
      .enter().append('path')
        .attr('d', path)
        .attr('data-indicator', datum.indicator)
        .attr('data-indicator-id', datum.indicatorId)
        .attr('data-year', datum.year)
        .attr('class', function (d) {
          var q = scale(valueById[+d.id]);
          return 'mapLocale '
                + 'indicator-' + datum.indicatorId + '-locale-' + (+d.id) + ' '
                + (typeof q !== undefined ? q : '');
        })
        .attr('title', function (d) {
          var l = _.find(datum.locales, function (locale) {
            return d.id === locale.id;
          });
          var domain = scale.domain();
          return '<big><strong>' + l.name + ' &raquo; ' + numFormatter(l.value) + '</strong></big><br />'
                + 'min: ' + domain[0] + ' / avg: ' + domain[1] + ' / max: ' + domain[2] + '<br />'
                + '<small>' + datum.indicator + '</small>';
        })
        .on('mouseover', function (d) {
          var indicatorId = d3.select(this).attr('data-indicator-id');
          _hoverMapLocale('over', indicatorId, +d.id);
        })
        .on('mouseout', function (d) {
          var indicatorId = d3.select(this).attr('data-indicator-id');
          _hoverMapLocale('out', indicatorId, +d.id);          
        });

    // draw the internal borders only (a.id !== b.id)
    map.append('path')
        .datum(localeBorders)
        .attr('d', path)
        .attr('class', 'mapLocaleBoundary');
    
  }

  /*
   * _hoverMapLocale: event handler for when a user hovers over an item in a map
   * @param {String} overOrOut The action, either 'over' for when the cursor is over the map item, or 'out' when it leaves
   * @param {Number} indicatorId The id of the indicator, used in class selection
   * @param {Number} localeId The id of the locale, used in class selection
   */
  function _hoverMapLocale(overOrOut, indicatorId, localeId) {
    d3.selectAll('.indicator-' + indicatorId + '-locale-' + localeId).style('fill', overOrOut === 'over' ? '#b0d912' : null);
  }

  
  return {
    init: init
  };

});