/*jshint browser:true, jquery:true, indent:2, globalstrict: true, laxcomma: true, laxbreak: true */
/*global require:true */

'use strict';

require.config({
  shim: {
    d3: {
      exports: 'd3'
    }
  , queue: {
      exports: 'queue'
    }
  , topojson: {
      exports: 'topojson'
    }
  , jquery: {
      exports: '$'
    }
  , jqueryui: {
      deps: ['jquery']
    , exports: 'jquery'
    }
  , trunk8: {
      deps: ['jquery']
    , exports: 'jquery'
    }
  , tipsy: {
      deps: ['jquery']
    , exports: 'jquery'
    }
  }

, paths: {
    jquery: '../bower_components/jquery/jquery'
  , jqueryui: '../bower_components/jquery-ui/ui/jquery-ui.custom'
  , trunk8: '../bower_components/trunk8/trunk8'
  , tipsy: 'vendor/jquery.tipsy'
  , lucidjs: '../bower_components/LucidJS/lucid'
  , d3: '../bower_components/d3/d3'
  , queue: '../bower_components/queue-async/queue'
  , topojson: '../bower_components/topojson/topojson'
  , lodash: '../bower_components/lodash/dist/lodash'
  }

});

require(['ui/events', 'ui/app'], function (event, app) {

  var emitter = event.emitter()
    , startTime = Date.now();

  // Initialize the application
  $(function () {

    app.init();

    emitter.on('ui.ready', function () {
      console.log('Total load time: ' + ((Date.now() - startTime) / 1000) + ' seconds.');
    });
  });
});