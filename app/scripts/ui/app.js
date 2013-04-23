/*jshint browser:true, jquery:true, indent:2, globalstrict: true, laxcomma: true, laxbreak: true */
/*global define:true */

'use strict';

/*
 * Module for loading and retrieving [d3 quantile scales](https://github.com/mbostock/d3/wiki/Quantitative-Scales#wiki-quantile) for defining colors
 * Scales are defined by the minimum, national average, and maximum
 */
define(['jquery', 'd3', 'queue', 'topojson', 'lodash', 'ui/events', 'model/dataBuilder', 'model/indicatorLookup', 'model/stateLookup', 'ui/colorScales', 'jqueryui', 'tipsy', 'trunk8'],
  function ($, d3, queue, topojson, _, event, dataBuilder, indicators, states, colorScales) {

  // width and height are set in css for divs
  var emitter = event.emitter()
    , width = 190
    , height = 120
    , localeGeom // topojson topology objects
    , localeBorders // topojson mesh for borders
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
    localeGeom = topojson.feature(topology, topology.objects.states).features;

    localeBorders = topojson.mesh(topology, topology.objects.states, function (a, b) { return a.id !== b.id; });

    $('#loading-message').html('Building visualiations...');

    // set up the entire page
    d3.select('#previews').selectAll('.card')
          .data(nestedData)
        .enter()
          .append('div')
          .attr('class', 'card')
          .attr('id', function(d) {return 'indicator-' + d.id;})
          .call(_drawCard);

    // set up tooltips
    $('.mapLocale').tipsy({gravity: $.fn.tipsy.autoWE, offset: 5, html: true});

    // everything is loaded, stop the spinner and hide its container
    $('#loading-container').css('visibility', 'hidden');

    // make everything visible
    $('#main').css('visibility', 'visible');

    // truncate card titles to fit in the space    
    $('.card-title').trunk8();

    // make rows sortable via jqueryui
    $('#previews').sortable({
      opacity: 0.7
    , handle: '.card-handle'
    });
//    $('#previews').disableSelection();

    // TODO - handle changing the visible year
    $('header').click(function () {
      var year = 2009;
//      d3.select('.card-map')

    });

    emitter.set('ui.ready');

  }


  function _drawCard (selection) {
    var defaultYear = '2010'; // year is expected to be a string

    selection.each(function (data) {
      var card = d3.select(this);

      // set up lookup table for scale based on values for this map
      var valueById = {}
        , valuesForYear = _.where(data.values, {'year': defaultYear})[0];
      _.each(valuesForYear.locales, function (d) { valueById[+d.id] = +d.value; });

      // number formatter to add thousands separator
      var numFormatter = d3.format(',');

      // scale for this datum (indicator/year)
      var scale = colorScales.get(data.id, '2010');

      var header = card.append('div')
          .attr('class', 'card-header');

      header.append('span')
          .attr('class', 'card-handle')
          .append('i')
          .attr('class', 'icon-reorder');
      header.append('span')
          .attr('class', 'card-title')
          .html(function (d) { return indicators.getLabelFromId(+d.id); });

      var content = card.append('div')
          .attr('class', 'card-content');

      var map = content.append('svg')
          .style('width', content.style('width'))
          .style('height', content.style('height'))
          .append('g')
          .attr('transform', 'translate(' + 0 + ',' + -20 + ')'); // HACK!!!

      // load the geometry objects and set the color and title
      map.selectAll('path')
          .data(localeGeom)
        .enter().append('path')
          .attr('d', path)
          .attr('data-indicator-label', indicators.getLabelFromId(data.id))
          .attr('data-indicator-id', data.id)
          .attr('data-year', defaultYear)
          .attr('data-locale-name', function (d) {
            return states.getNameFromId(+d.id);
          })
          .attr('data-locale-value', function (d) {
            var value = _.find(valuesForYear.locales, function (locale) {
              return d.id === locale.id;
            });
            // if it is a valid number, format it with commas
            return (value && ! isNaN(value.value)) ? numFormatter(value.value) : 'unknown';
          })
          .attr('class', function (d) {
            var localeId = +d.id
              , indicatorId = +data.id
              , q = scale(valueById[localeId]);
            return 'mapLocale '
                + 'indicator-' + indicatorId + '-locale-' + localeId + ' '
                + (q ? q : '');
          })
          .attr('title', function () {
            var el = d3.select(this)
              , name = el.attr('data-locale-name')
              , value = el.attr('data-locale-value')
              , indicatorName = el.attr('data-indicator-label')
              , year = el.attr('data-year')
              , domain = scale.domain()
              , min = numFormatter(domain[0])
              , avg = numFormatter(domain[1])
              , max = numFormatter(domain[2]);
            return '<small>' + indicatorName + '</small>' + '<br />'
            + '<big><strong>' + name + '</strong> (' + year + ') &raquo; <strong>' + value + '</strong></big>'
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

    });
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