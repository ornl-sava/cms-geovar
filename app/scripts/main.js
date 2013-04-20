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
    jquery: '../components/jquery/jquery'
  , jqueryui: '../components/jquery-ui/ui/jquery-ui.custom'
  , trunk8: '../components/trunk8/trunk8'
  , tipsy: 'vendor/jquery.tipsy'
  , lucidjs: '../components/LucidJS/lucid'
  , d3: '../components/d3/d3'
  , queue: '../components/queue-async/queue'
  , topojson: '../components/topojson/topojson'
  , lodash: '../components/lodash/lodash'
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