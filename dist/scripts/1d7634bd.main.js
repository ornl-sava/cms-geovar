/*jshint browser:true, jquery:true, indent:2, globalstrict: true, laxcomma: true, laxbreak: true */
/*global require:true, console:true */

'use strict';

require.config({
  shim: {
  },

  paths: {
    hm: 'vendor/hm',
    esprima: 'vendor/esprima'
  }
});
 
require(['app'], function (app) {
  // use app here
  console.log(app);
});