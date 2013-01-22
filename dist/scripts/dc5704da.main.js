/*jshint browser:true, jquery:true, indent:2, globalstrict: true, laxcomma: true, laxbreak: true */
/*global require:true, console:true */

'use strict';

require.config({
  shim: {
  },

  paths: {
    lodash: 'vendor/lodash.min'
  , hm: 'vendor/hm'
  , esprima: 'vendor/esprima'
  , ui: 'ui'
  , model: 'model'
  , util: 'util'
  }
});
 
require(['ui/app'], function (app) {
  
  app.init();
  
});