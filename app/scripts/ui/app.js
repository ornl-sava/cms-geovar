/*jshint browser:true, jquery:true, indent:2, globalstrict: true, laxcomma: true, laxbreak: true */
/*global define:true, d3:true, queue:true, topojson:true, console:true */

'use strict';

/*
 * Module for loading and retrieving [d3 quantile scales](https://github.com/mbostock/d3/wiki/Quantitative-Scales#wiki-quantile) for defining colors
 * Scales are defined by the minimum, national average, and maximum
 */
define(['lodash', 'model/dataBuilder', 'model/indicatorLookup', 'model/stateLookup', 'ui/colorScales'], function (_, dataBuilder, indicators, states, colorScales) {

  // width and height are set in css for divs
  var width = 190
    , height = 120
    , localeGeom // topojson topology objects
    , localeBorders // topojson mesh for borders
    , startTime = Date.now()
    , projection = d3.geo.albersUsa()
                    .scale(width + 20)
                    .translate([(width + 20) / 2, (height / 2) + 10])
    , path = d3.geo.path().projection(projection);

  /*
   * init: main initialization for the app
   */
  function init() {      
    // load the data
    queue()
      .defer(d3.csv, 'data/states-2007-2010-trimmed.csv')
      .defer(d3.json, 'data/lookup/state-codes.json')
      .defer(d3.json, 'data/lookup/indicator-names.json')
      .defer(d3.json, 'data/maps/us-very-small.json')
      .await(_dataLoaded);
  }


  /*
   * _dataLoaded: all data has been loaded, create the nested data and vis
   * @param {String} error null Error message, or null if no error
   * @param {Array} codes Fips codes, names, abbreviations for states
   * @param {Array} stateData State level data as a flat array of objects
   * @param {Object} topology Topojson data
   */
  function _dataLoaded(error, stateData, stateLookupData, indicatorLookupData, topology) {
    
    states.addAll(stateLookupData);
    
    indicators.addAll(indicatorLookupData);
    
    // build nested data structure
    var nestedData = dataBuilder.build(stateData);

    // save geometry and borders
    localeGeom = topojson.object(topology, topology.objects.states).geometries;

    localeBorders = topojson.mesh(topology, topology.objects.states, function (a, b) { return a.id !== b.id; });

    $('#loading-message').html('Building visualiations...');
        
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
        
    // everything is loaded, stop the spinner and hide its container
    $('#loading-container').css('visibility', 'hidden');
    
    // make everything visible
    $('#main').css('visibility', 'visible');
    
    // make rows sortable via jqueryui
    $('#previews').sortable({
      opacity: 0.4
    , handle: '.rowHandle'
    , placeholder: 'sort-highlight'
    });
    $('#previews').disableSelection();
    
    
    console.log('Total load time: ' + ((Date.now() - startTime) / 1000) + ' seconds.');
    
  }

  // load each row (label and maps for each year)
  function loadIndicators(d, i) {
    
    //console.log(d);
    
    var base = d3.select(this);
    
    // get indicator name
    var name = indicators.getLabelFromId(+d.id);
    
    // heuristic to keep labels from overflowing
    var label = name.length > 90 ? (name.substr(0, 90) + ' ...') : name;
    
    base.append('div')
        .attr('class', 'rowHandle')
        .html('::');
    
    base.append('div')
        .attr('class', 'rowLabel')
        .attr('title', indicators.getDescriptionFromId(d.id))
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
        .attr('data-indicator-label', indicators.getLabelFromId(datum.indicatorId))
        .attr('data-indicator-id', datum.indicatorId)
        .attr('data-year', datum.year)
        .attr('data-locale-name', function (d) {
          return states.getNameFromId(+d.id);
        })
        .attr('data-locale-value', function (d) {
          var value = _.find(datum.locales, function (locale) {
            return d.id === locale.id;
          }).value;
          // if it is a valid number, format it with commas
          return (! isNaN(value)) ? numFormatter(value) : 'unknown';
        })
        .attr('class', function (d) {
          var q = scale(valueById[+d.id]);
          return 'mapLocale '
                + 'indicator-' + datum.indicatorId + '-locale-' + (+d.id) + ' '
                + (typeof q !== undefined ? q : '');
        })
        .attr('title', function (d) {
          var el = d3.select(this)
            , name = el.attr('data-locale-name')
            , value = el.attr('data-locale-value')
            , indicatorName = el.attr('data-indicator-label')
            , domain = scale.domain()
            , min = numFormatter(domain[0])
            , avg = numFormatter(domain[1])
            , max = numFormatter(domain[2]);
          return '<small>' + indicatorName + '</small>' + '<br />'
          + '<big><strong>' + name + ' &raquo; ' + value + '</strong></big>'
          + '<br />'
          + '<small>min: </small>' + min + '<small> / avg: </small>' + avg + '<small> / max: </small>' + max;
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