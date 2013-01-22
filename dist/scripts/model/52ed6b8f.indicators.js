/*jshint browser:true, jquery:true, indent:2, globalstrict: true, laxcomma: true, laxbreak: true */
/*global define:true, _:true, console:true */

'use strict';

/*
 * Module for adding and retrieving indicator id <-> name mapping
 */
define(function () {

  var indicators = []; // list of {'id': id, 'name': name}

  /*
   * add: push a new mapping into data
   * @param {Number} id The indicator ID
   * @param {String} name The indicator name
   */
  var add = function (id, name) {
    indicators.push({'id': id, 'name': name});
  };

  /*
   * getIdFromName: retrieve an ID based on a given name
   * @param {String} name The indicator name
   * @returns {Number} id The indicator ID
   */
  var getIdFromName = function (name) {
    var id = _.find(indicators, function (val) {
      return val.name === name;
    }).id;
    return id;
  };

  return {
    add: add
  , getIdFromName: getIdFromName
  };

});