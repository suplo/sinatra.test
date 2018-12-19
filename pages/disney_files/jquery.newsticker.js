/**
 * jQuery newsTicker
 * 1行ニュースを一定間隔で表示するプラグイン
 *
 * usage:
 * $('#test1').newsTicker({
 *   waitTime : 2000
 * });
 *
 * options:
 *   waitTime : 表示する時間
 *
 */
;(function ($, window) {
  "use strict";
  $.fn.newsTicker = function (options) {
    var o , slide;
    if (!this.length) {
      return this;
    }

    o = $.extend({
      waitTime: 1000
    }, options);

    /**
     * リストの1番目をスライドさせ2番目の要素を表示する1番目は最後に追加
     */
    slide = function () {
      var self = this;
      this.find('li:first').slideUp(function () {
        $(this).appendTo(self).show();
      });
      setTimeout(function(){
        slide.apply(self);
      }, o.waitTime);
    };

    return this.each(function () {
      var $self = $(this);
      setTimeout(function(){
        slide.apply($self);
      }, o.waitTime);
    });
  };
})(jQuery, this);