/*jshint browser:true, jquery:true, indent:2, globalstrict: true, laxcomma: true, laxbreak: true */
/*global define:true */

'use strict';

/*
 * Module for adding and retrieving indicator information
 * Fields
 *    id -> the id number to use throughout app
 *    name -> the field name used in the raw data
 *    label -> the short label to use for row labels
 *    description -> the long label to use for row tooltips
 *    category -> the grouping for the indicator
 */
define(['lodash'], function (_) {

  var indicators = []; // list of {id, name, label, description, category}

  /*
   * addAll: push all new mappings into data
   * @param {Array} list The list of indicators, loaded from disk
   */
  var addAll = function (list) {
    indicators = list;
  };

  /*
   * getNameFromId: retrieve a name based on a given ID
   * @param {Number} id The indicator ID
   * @returns {String} name The indicator name
   */
  var getNameFromId = function (id) {
    var name = _.find(indicators, function (val) {
      return val.id === +id;
    }).name;
    return name;
  };

  /*
   * getLabelFromId: retrieve a label based on a given ID
   * @param {Number} id The indicator ID
   * @returns {String} label The indicator label
   */
  var getLabelFromId = function (id) {
    var label = _.find(indicators, function (val) {
      return val.id === +id;
    }).label;
    return label;
  };

  /*
   * getDescriptionFromId: retrieve a description based on a given ID
   * @param {Number} id The indicator ID
   * @returns {String} description The indicator description
   */
  var getDescriptionFromId = function (id) {
    var description = _.find(indicators, function (val) {
      return val.id === +id;
    }).description;
    return description;
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
    return +id;
  };

  return {
    addAll: addAll
  , getNameFromId: getNameFromId
  , getLabelFromId: getLabelFromId
  , getDescriptionFromId: getDescriptionFromId
  , getIdFromName: getIdFromName
  };

});