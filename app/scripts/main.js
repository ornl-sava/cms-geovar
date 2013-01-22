/*jshint browser:true, jquery:true, indent:2, globalstrict: true, laxcomma: true, laxbreak: true */
/*global require:true, console:true */

'use strict';

require.config({
  shim: {
  },

  paths: {
    lodash: '//cdnjs.cloudflare.com/ajax/libs/lodash.js/1.0.0-rc.3/lodash.min'
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