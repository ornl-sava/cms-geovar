/*jshint browser:true, jquery:true, indent:2, globalstrict: true, laxcomma: true, laxbreak: true */
/*global define:true */

'use strict';

define(['lucidjs'], function (event) {
  
  var eventEmitter = event.emitter();

  function emitter() {
    return eventEmitter;
  }

  function emit(e) {
    eventEmitter.trigger(e);
    return eventEmitter;
  }

  return {
    emitter: emitter
  , emit: emit
  };

});