/**
 * jQuery animateSprite
 * spriteをアニメーションで描画するプラグイン
 *
 * usage:
 * $('#test1').animateSprite({
 *   numOfFrames : 15,
 *   interval    : 2000,
 *   fps         : 14
 * });
 *
 * options:
 *   numOfFrames: コマ数 (必須)。 デフォルトは2frame
 *   fps         : フレームレート(おおよそ1〜60で指定)。デフォルトは24fps
 *   interval    : リピートする際の間隔をmsecで指定。デフォルトは1000msec
 *   doOnce     : リピートするかどうか。デフォルトはfalse
 *   moveRandom : リピートする場合、配置をランダムに変えるかどうか。デフォルトはfalse
 *
 * 注: background-size: coverなどを指定して、domの大きさと背景の大きさが異なる場合
 *     正常に動作しない
 */
;
(function ($, window) {
  "use strict";
  $._animateSprite = {
    //CSSのbackgroundUrlを取得
    getBgImageUrl: function (el) {
      var bgImage = el.css("background-image");
      if (!bgImage || bgImage.length === 0) {
        throw new Error("BackgroundImage is not specified");
      }
      return bgImage.replace(/url\((['"])?(.*?)\1\)/gi, '$2').split(',')[0];
    },
    //ランダムな位置に配置
    moveRandom   : function (el, range) {
      var rmd = function (min, max) {
        if (min == null && max == null) {
          max = 1;
        }
        min = +min || 0;
        if (max == null) {
          max = min;
          min = 0;
        }
        return min + Math.floor(Math.random() * ((+max || 0) - min + 1));
      };
      return el.css({
        left  : rmd(range.left.min, range.left.max),
        bottom: rmd(range.bottom.min, range.bottom.max)
      });
    },
    //指定されたクラス名の配列からランダムに選びクラスを追加する
    changeClass  : function (el, classNames) {
      if (!classNames || classNames.length === 0) {
        return;
      }
      el.removeClass(classNames.join(' '));
      el.addClass(classNames[Math.floor(Math.random() * (classNames.length))]);
    }
  };

  $.fn.animateSprite = function (opt) {
    if (!this.length) {
      return this;
    }
    var $body = $('body');
    var o = $.extend({
      spriteWidth : 0,
      spriteHeight: 0,
      numOfFrames : 2,
      fps         : 24,
      interval    : 1000,
      doOnce      : false,
      moveRandom  : false,
      viewRange   : {
        left  : {
          min: 0,
          max: $body.width()
        },
        bottom: {
          min: 0,
          max: $body.height()
        }
      },
      classNames  : []
    }, opt);

    //原則jQueryセレクタでは１つとする
    var self = this;
    var $self = $(this.get(0));
    var orgClassName = $self.attr('class');
    var running = false;
    var callStop = false;

    //背景の大きさを取得
    var loadImg = function ($el, callOut) {
      var bgImage = (new Image());
      bgImage.onload = function () {
        o.spriteWidth = bgImage.width;
        o.spriteHeight = bgImage.height;
        callOut();
      };
      bgImage.src = $._animateSprite.getBgImageUrl($el);
    };
    //場所を変更
    var moving = function(){
      if (o.moveRandom) {
        $self = $._animateSprite.moveRandom($self, o.viewRange);
      }
    };

    //アニメーションを実行
    var execAnimation = function () {
      var wait = parseInt((1 / o.fps) * 1000, 10);
      var frameWidth = parseInt(o.spriteWidth / o.numOfFrames, 10);
      //描画
      var curPx = 0;
      moving();

      var animate = function () {
        $self.css("backgroundPosition", "-" + curPx + "px 0px");
        curPx = curPx + frameWidth;
        if (curPx >= o.spriteWidth + frameWidth) {
          if (o.doOnce) {
            running = false;
            return;
          }
          curPx = 0;
          if(callStop){
            running = false;
            callStop = false;
            return;
          }
         self.timer = setTimeout(function () {
            moving();
            $self.attr('class', orgClassName);
            $._animateSprite.changeClass($self, o.classNames);
            animate.apply($self);
          }, (Math.random() * 3) * o.interval);
          return;
        }
       self.timer = setTimeout(function () {
          animate.apply($self);
        }, wait);
      };

      animate();
    };

    return $.extend(this, {
      isRunning: function(){
        return running;
      },
      clear: function () {
        clearTimeout(this.timer);
      },
      start: function () {
        //実行
        this.clear();
        callStop = false;
        running = true;
        loadImg($self, execAnimation);
        return this;
      },
      stop : function () {
        callStop = true;
        return this;
      }
    });
  };
})(jQuery, this);
