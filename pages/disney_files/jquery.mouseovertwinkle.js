/**
 * jQuery mouseovertwinkle
 * ボタン画像に対してマウスオーバーするとキラキラ画像を表示するプラグイン
 *
 * usage:
 *
 *   html:
 *     <p class="btn">
 *       <a href="#">
 *         <img src="cgp/images/xxx.png" width="285" height="41" alt="" class="roll">
 *       </a>
 *     </p>
 *
 *   javascript:
 *     $('.btn')({
 *       intervalTime: 200,
 *       fadeOutTime : 50,
 *       duration    : 200
 *     });
 *
 * options:
 *   intervalTime: 1つの画像を表示される間隔
 *   fadeOutTime:  画像がフェードアウトする時間
 *   duration:     マウスオーバーしてから何秒間表示されるか
 *
 */
;
(function($, window){
  'use strict';
  /**
   * キラ画像DOMを生成
   * コンテキストはimgタグ
   * @returns {*|HTMLElement}
   */
  var createStar = function(){
    var left, top;
    var $self = $(this);
    left = $self.position().left + ((Math.random() * $self.width()) >> 0) - 16;
    top = ((Math.random() * ($self.height())) >> 0) - 16;
    return $('<div></div>', {
      style: 'background:url("/cgp/images/jp/pc/js/kira4_32.png") no-repeat;' + 'width: 32px; ' + 'height: 32px; ' + 'position: absolute; ' + 'left:' + left + 'px;' + 'top: ' + top + 'px;'
    });
  };

  /**
   * IE8かどうか
   * @returns {boolean}
   */
  var isIE8 = function(){
    return typeof window.addEventListener === "undefined" && typeof document.getElementsByClassName === "undefined";
  };
  
  $.fn.mouseovertwinkle = function (options) {
    if (!this.length) {
      return this;
    }

    //options
    var o = $.extend({
      intervalTime: 100,
      fadeOutTime : 500,
      duration    : 1000
    }, options);

    return this.each(function(){
      $(this).mouseenter(function(){
        var setIntervalID;
        var $self = $(this);
        var $img = $($self.find('img'));
        if(!$img){
          return;
        }

        //ランダムな位置に星を生成し、フェードアウトして消える
        var plotStar = function(){
          var $twinkle = createStar.apply($img);
          $img.after($twinkle);
          if(isIE8()){
            //IE8の場合、フェードアウトせずに消えるだけ
            setTimeout(function(){
              $twinkle.remove();
            }, 400);
          }else{
            $twinkle.fadeOut(o.fadeOutTime, function () { $(this).remove(); });
          }
        };
        setTimeout(function(){
          clearInterval(setIntervalID);
        }, o.duration);

        setIntervalID = setInterval(plotStar, o.intervalTime)
      });
    });
  };
})(jQuery, this);