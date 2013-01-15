/*jshint browser:true, jquery:true, indent:2, globalstrict: true, laxcomma: true, laxbreak: true */
/*global d3:true, queue:true, topojson:true, Spinner:true, console:true */

'use strict';

(function () {
  
  var width = 200
    , height = 120
    , topology
    , stateCodes;
    
  var projection = d3.geo.albersUsa()
                      .scale(width)
                      .translate([width/2, height/2]);
                
  var path = d3.geo.path().projection(projection);

  // progress spinner while loading
  var spinner = new Spinner({top: (height / 2), radius: 15, length: 16, width: 6}).spin(document.getElementById('vis'));
  
  // load the data
  queue()
    .defer(d3.json, '/data/national-2007-2010.json')
    .defer(d3.json, '/data/us-d3.json')
    .defer(d3.json, '/data/state-codes.json')
    .await(dataLoaded);


  function dataLoaded(error, nationalData, topo, states) {
    
    // TopoJSON US topology map
    topology = topo;
    
    // load the state codes into a variable
    stateCodes = states;

    // set up the small multiples
    var pre = d3.select('#previews').selectAll('.preview')
            .data(nationalData)
          .enter()
            .append('div')
            .attr('class', 'preview')
            .attr('width', width)
            .attr('height', height);

    // each div has its own svg
    var svgs = pre.append('svg')
            .attr('width', width)
            .attr('height', height);
            
    // each svg has a g context
    var previews = svgs.append('g');

    previews.each(loadMap);
    

    // set up tooltips
    $('.states').tipsy({
      gravity: 's'
    , offset: -10
    , title: function () {
        var d = this.__data__;
        return d.name;
      }
    });
    
    // everything is loaded, stop the spinner
    spinner.stop();
  }

  // load each small multiple map
  function loadMap(d, i) {
    
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
        .text(function (d) { return d.Year; })
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