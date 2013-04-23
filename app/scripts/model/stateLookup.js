/*jshint browser:true, indent:2, globalstrict: true, laxcomma: true, laxbreak: true */
/*global define:true */

'use strict';

/*
 * Module for mapping and retrieving state id (fips), name, 2 character US postal service abbreviations
 */
define(['lodash'], function (_) {

  var states = []; // list of {'id': id, 'name': name, 'usps': abbreviation}

  /*
   * add: push a new mapping into data
   * @param {Array} list The list of states, loaded from disk
   */
  var addAll = function (list) {
    states = list;
  };

  /*
   * getNameFromId: retrieve a name based on a given ID
   * @param {Number} id The indicator ID
   * @returns {String} name The indicator name
   */
  var getNameFromId = function (id) {
    var locale = _.find(states, function (val) {
      return +val.id === +id;
    });
    if (!locale) console.log('Cannot find id, ' + id);
    return locale.name;
  };

  /*
   * getAbbreviationFromId: retrieve a two char abbreviation based on a given ID
   * @param {Number} id The indicator ID
   * @returns {String} usps The indicator USPS abbreviation
   */
  var getAbbreviationFromId = function (id) {
    var locale = _.find(states, function (val) {
      return +val.id === +id;
    });
    if (!locale) console.log('Cannot find id, ' + id);
    return locale ? +locale.usps : 'unknown';
  };

  /*
   * getIdFromName: retrieve an ID based on a given name
   * @param {String} name The indicator name
   * @returns {Number} id The indicator ID as a number
   */
  var getIdFromName = function (name) {
    var locale = _.find(states, function (val) {
      return val.name === name;
    });
    if (!locale) console.log('Cannot find name, ' + name);
    return locale ? +locale.id : 'unknown';
  };

  /*
   * getIdFromAbbreviation: retrieve an ID based on a given abbreviation
   * @param {String} abbrev The indicator USPS abbreviation
   * @returns {Number} id The indicator ID as a number
   */
  var getIdFromAbbreviation = function (usps) {
    var locale = _.find(states, function (val) {
      return val.usps === usps;
    });
    if (!locale) console.log('Cannot find abbreviation, ' + usps);
    return locale ? +locale.id : 'unknown';
  };

  return {
    addAll: addAll
  , getNameFromId: getNameFromId
  , getAbbreviationFromId: getAbbreviationFromId
  , getIdFromName: getIdFromName
  , getIdFromAbbreviation: getIdFromAbbreviation
  };

});