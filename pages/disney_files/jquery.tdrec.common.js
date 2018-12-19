//jqueryの拡張
// PC,SP両方で共通で使うライブラリ
(function ($) {
  $.fn.extend({
    /**
     * jqueryUIのdatePickerを呼び出す
     * @param opt : unavailableDates 非活性にする日付の配列　ex.["9-7-2013", "14-8-2013",...];
     *              それ以外はjqueryUIのdatepickerと同じ
     */
    tdrec_datepicker: function (opt) {
      var unavailableDates = opt.unavailableDates || [];
      var publicHolidays = opt.publicHolidays || [];

      this.datepicker($.extend({
        numberOfMonths : 2,
        showOn         : "both",
        buttonImage    : "cgp/images/ico/ico_calender_01.png",
        buttonImageOnly: true,
        firstDay       : 1,
        dateFormat     : "yy年m月d日",
        beforeShowDay  : function (date) {
          var result = [true, ""];
          var dmy = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
          var day = date.getDay();
          if (day === 6) {
            result = [true, "sat"]; //土曜日
          } else if (day === 0) {
            result = [true, "sun"]; //日曜日
          }

          if ($.inArray(dmy, publicHolidays) != -1) {
            result = [true, "sun", ""];
          }

          if ($.inArray(dmy, unavailableDates) != -1) {
            result = [false, "unavailable", ""];
          }
          return result;
        }
      }, opt));
    },

    /**
     * 1行ニュースを一定間隔で表示する
     *
     *  usage:
     * $('#test1').newsTicker({
     *   waitTime : 2000
     * });
     *
     * options:
     *   waitTime : 表示する時間
     *
     */
    tdrec_newsTicker: function (options) {
      var o , slideUp;
      if (!this.length) {
        return this;
      }

      o = $.extend({
        waitTime: 1000
      }, options);

      //リストの1番目をスライドさせ2番目の要素を表示する1番目は最後に追加
      slideUp = function () {
        var $self = $(this);
        $self.find('li:first').slideUp(function () {
          $(this).appendTo($self).show();
        });
      };

      return this.each(function () {
        var $self = $(this);
        $self.bind('slideUp', slideUp);
        setInterval(function () {
          $self.trigger('slideUp');
        }, o.waitTime);
      });
    },
    /**
     * 画面ロック
     */
    tdrec_lockScreen : function() {
      var $lockDiv = $("<div></div>", {
        id: 'lockScreen'
      });
      $lockDiv.css({
          'width' : '100%',
          'height': '100%',
          'top' : '0',
          'margin' : '0',
          'background-color' : '#fff',
          'opacity' : '0',
          'display' : 'block',
          'position' : 'fixed',
          'z-index' : '1500'
      });
      $('body').append($lockDiv);
    },
    /**
     * 画面ロック解除
     */
    tdrec_unlockScreen : function() {
      $('#lockScreen').remove();
    }
  });
})(jQuery);