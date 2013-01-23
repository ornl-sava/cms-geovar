/*jshint browser:true, jquery:true, indent:2, globalstrict: true, laxcomma: true, laxbreak: true */
/*global define:true */

'use strict';

/*
 * Utility module for parsing strings into numbers
 */
define(function () {
  
  /*
   * parseNumber: parse out raw values into numbers
   * @param {String} value The string representing a given value
   * @returns {Number} number The parsed Number, or NaN if unable to parse
   */
  function parseNumber(value) {
    var number = NaN;
    if (value) {
      // remove commas from numbers
      var parsed = value.replace(/,/g, '');
      // parse numbers into floats ('*' will be NaN)
      number = parseFloat(parsed);
    }
    return number;
  }


  return {
    parseNumber: parseNumber
  };
  
});