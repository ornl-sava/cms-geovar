/*jshint browser:true, jquery:true, indent:2, globalstrict: true, laxcomma: true, laxbreak: true */
/*global define:true, _:true, console:true */

'use strict';

/*
 * Module for adding and retrieving indicator id <-> name mapping
 */
define(['lodash'], function (_) {

  var indicators = []; // list of {'id': id, 'name': name}

  /*
   * add: push a new mapping into data
   * @param {Number} id The indicator ID (if not a number, cast to number)
   * @param {String} name The indicator name
   */
  var add = function (id, name) {
    indicators.push({'id': +id, 'name': name});
  };

  /*
   * getNameFromId: retrieve a name based on a given ID
   * @param {Number} id The indicator ID
   * @returns {String} name The indicator name
   */
  var getNameFromId = function (id) {
    var name = _.find(indicators, function (val) {
      return val.id === id;
    }).name;
    return name;
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
  , getNameFromId: getNameFromId
  , getIdFromName: getIdFromName
  };

});