(function ($) {

  $.fn.setTween_Twinkle = function () {
    var opacity = this.css('opacity') * 100 >> 0;
    this.tween({
      opacity: {
        start   : +opacity,
        stop    : 0,
        time    : 0,
        duration: function () {
          return 0.6;
        },
        effect  : 'quadOut'
      },
      onStop : function (el) {
        $(el).remove();
      }
    });
    return this;
  };

  //アニメーションkira
  $.fn.setTweenKiraAnime = function () {
    var st_left = this.position().left;
    this.tween({
      left  : {
        start   : st_left,
        stop    : st_left,
        time    : 0,
        duration: 0.5
      },
      //top      : {start: st_top, stop: st_top},
      /*transform: {
       start   : 'rotate(0deg) g_test_scale(1)',
       stop    : 'rotate(1deg) g_test_scale(' + parseInt(Math.random() + 2, 10) + ')', // 2~3
       time    : 0,
       duration: 0.5,
       effect  : 'quadIn'
       },

       opacity  : {
       start   : 100,
       stop    : 0,
       time    : 0,
       duration: 1, //function () {return Math.random() * 2.5},
       effect  : 'easeOut'
       },
       */
      onStop: function (el) {
        $(el).remove();
      }
    });
    return this;
  };


  /**
   * dropする
   */
  //var topDist = 30, size = 5, increment = true;
  $.fn.setTweenDrop = function () {
    var top = this.position().top;
    var opacity = this.css('opacity') * 100 >> 0;
    var _duration = Math.random() * 1.5;
    return this.tween({
      top    : {
        start   : top,
        stop    : top + 100,
        time    : 0,
        duration: _duration,
        effect  : 'quadOut'
      },
      opacity: {
        start   : +opacity,
        stop    : 0,
        time    : 0,
        duration: _duration,
        effect  : 'quadOut'
      },
      onStop : function (el) {
        $(el).remove();
      }
    });
  };

  /*ボタン用*/
  $.fn.setTwinkleButton = function (halfPoint, sizeOfHalf) {
    var _left = this.position().left, _top = this.position().top;
    var stopleft = _left , offset = 15;
    //console.log('距離:', halfPoint - _left ,  sizeOfHalf );
    //console.log('距離割合:', ((halfPoint - _left)/sizeOfHalf) );
    //console.log('offset:', parseInt(offset*((halfPoint - _left)/sizeOfHalf),10));
    offset = parseInt(offset * ((halfPoint - _left) / sizeOfHalf), 10);
    //offset += parseInt((Math.random()-0.5)*2*20,10); //-10〜10で変動させる
    //stopleft += (_left > halfPoint)? +offset : -offset;
    stopleft -= offset

    this.tween({
      left   : {
        start   : _left,
        stop    : stopleft,
        effect  : 'quartOut',
        duration: 0.6
      },
      top    : {
        start   : _top,
        stop    : _top - 20,
        effect  : 'quartOut',
        duration: 0.5
      },
      opacity: {
        start   : 100,
        stop    : 30,
        time    : 0.3,
        duration: function () {
          return Math.random() * 2;
        },
        effect  : 'quartOut'
      },
      onStop : function (el) {
        $(el).remove();
      }
    });
    return this;
  };
})(jQuery);
