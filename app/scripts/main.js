/*jshint browser:true, jquery:true, indent:2, globalstrict: true, laxcomma: true, laxbreak: true */
/*global require:true */

'use strict';

require.config({
  shim: {
  },

  paths: {
    lodash: '//cdnjs.cloudflare.com/ajax/libs/lodash.js/1.0.0-rc.3/lodash.min'
  , lucidjs: '../components/LucidJS/lucid'
  , hm: 'vendor/hm'
  , esprima: 'vendor/esprima'
  , ui: 'ui'
  , model: 'model'
  , util: 'util'
  }
});
 
require(['ui/events', 'ui/app'], function (event, app) {
  
  var emitter = event.emitter()
    , startTime = Date.now();

  app.init();

  emitter.on('view.loaded', function () {

    console.log('Total load time: ' + ((Date.now() - startTime) / 1000) + ' seconds.');
  });

});