/*
 * cs-339-chatapp
 * https://github.com/shellyan/cs-339-chatapp
 *
 * Copyright (c) 2013 Brian Gathright, Salman Khan, Shell Yan
 * Licensed under the MIT license.
 */

(function($) {

  // Collection method.
  $.fn.cs_339_chatapp = function() {
    return this.each(function(i) {
      // Do something awesome to each selected element.
      $(this).html('awesome' + i);
    });
  };

  // Static method.
  $.cs_339_chatapp = function(options) {
    // Override default options with passed-in options.
    options = $.extend({}, $.cs_339_chatapp.options, options);
    // Return something awesome.
    return 'awesome' + options.punctuation;
  };

  // Static method default options.
  $.cs_339_chatapp.options = {
    punctuation: '.'
  };

  // Custom selector.
  $.expr[':'].cs_339_chatapp = function(elem) {
    // Is this element awesome?
    return $(elem).text().indexOf('awesome') !== -1;
  };

}(jQuery));
