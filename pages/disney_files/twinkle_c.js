/**
 * canvasを使い、ボタン・画像にキラキラなエフェクトを使いする
 *
 * usage:
 *   $.twinkle({
 *     //...
 *   });
 *
 * options:
 *   startPoint: フレームの開始位置
 *   stopPoint: フレームの終了位置
 *   pointInterval: フレームの間隔
 *   quantity: 1フレームにいくつの星をだすか デフォルト:10
 *   effect: 表示ベクトルの種類 ellipse(楕円), random(ランダム), line(直線)
 *
 */
;
(function ($, window) {
  /**
   * canvasを生成
   * thisはimgやdivのjQueryElement;
   */
  var createCanvas = function () {
    var margin = 50,
      width = this.width() + margin * 2,
      height = this.height() + margin * 2,
      pos = this.offset(),
      left = pos.left - margin,
      top = pos.top - margin,
      $canvas = $('<canvas width="' + width + '" height="' + height + '" ' +
        'style="left:' + left + 'px;top:' + top + 'px;position:absolute; z-index:1"></canvas>');

    if (this.parents('a').length > 0) {
      var _a = this.parents('a')[0];
      $canvas.css("cursor", "pointer").on('click', function () {
        _a.click();
      });
    }
    return $canvas.appendTo('body');
  };

  /**
   * Point(星の位置)を生成するオブジェクトをまとめる
   * 各メソッドの戻り値はcreatejs.Pointとなる
   * @type {{ellipse: Function, random: Function}}
   */
  var createPoint = {
    /**
     * 楕円を生成
     * @param i ポイント位置
     * @param canvas
     * @param randomCoefficient ランダム係数
     * @returns {createjs.Point}
     */
    ellipse: function (i, canvas, randomCoefficient) {
      var width = canvas.width;
      var height = canvas.height;
      var xCenter = width / 2;
      var yCenter = height / 2;

      return new createjs.Point(
        Math.sin(i) * (width / 2.5 ) + xCenter + (Math.random() * (randomCoefficient + 10)) >> 0,
        Math.cos(i) * (height / 6) + yCenter + (Math.random() * randomCoefficient) >> 0);
      //return new Point(Math.sin(i) * radius + x + (Math.random() * randomCoefficient) >> 0, i * 15 + y + (Math.random() * randomCoefficient) >> 0);
    },

    //指定矩形にランダムで配置
    random : function (width, height, xOffset, yOffset) {
      xOffset = xOffset || 0;
      yOffset = yOffset || 0;
      return new createjs.Point(Math.random() * width + xOffset >> 0, Math.random() * height + yOffset >> 0);
    },

    //縦半分の位置で左から右に向かって移動
    line   : function (i, canvas) {
      var height = canvas.height;
      var yCenter = height / 2;
      return new createjs.Point(i * 70 + (Math.random() * 145), (yCenter + (Math.sin(i) * 7) + (Math.random() * 5)) >> 0);
    }
  };

  /**
   * 星を生成
   */
  function createTwinkle(index, effectType) {
    var point;
    switch (effectType) {
      case 'ellipse':
        point = createPoint.ellipse(index, this.canvas, 12);
        break;
      case 'random':
        point = createPoint.random(this.canvas.width, this.canvas.height);
        break;
      case 'line':
        point = createPoint.line(index, this.canvas);
        break;
      default :
        throw new Error('effect not found');
    }

    var radius = (Math.random() * 5 + 2) >> 0; //星の直径
    var sides = 4; // + (Math.random() * 4) >> 0; //星の角の数
    var pointSize = 0.7;//絞り
    var angle = 45 + ((Math.random() * 10) >> 0); //色
    var color = createjs.Graphics.getHSL(angle, 50 + ((Math.random() * 20) >> 0), 55 + ((Math.random() * 20) >> 0)); //色　hsl(56,100%,75%)
    var shape = new createjs.Shape();
    var g = shape.graphics;

    g.beginFill(color);
    g.drawPolyStar(0, 0, radius, sides, pointSize, angle);
    g.endFill();
    shape.x = point.x;
    shape.y = point.y;
    shape.scaleX = shape.scaleY = 0;
    shape.rotation = (Math.random() * 360 >> 0);
    shape.alpha = 0.5;
    //shadowを入れると重いのでなしにする
    //shape.shadow = new createjs.Shadow(color, 0, 0, 10);
    this.container.addChild(shape);
    twinkleTween.apply(this, [shape]);
  }

  /**
   * ドロップ効果の値を計算 0〜100
   * @returns {number}
   */
  function drop() {
    return Math.random() * 100;
  }

  /**
   * Tween効果を設定
   * @param shape
   */
  function twinkleTween(shape) {
    //tweenをつける
    var tween = createjs.Tween.get(shape)
      .to({scaleX: 1, scaleY: 1, alpha: 1 }, 300, createjs.Ease.sineOut)
      .to({scaleX: 0, scaleY: 0, alpha: 0, y: shape.y + drop() }, 400 + (Math.random() * 400), createjs.Ease.sineIn);
    tween.call(removeTwinkle, [tween], this);
  }


  /**
   * 星を削除
   * @param tween
   */
  function removeTwinkle(tween) {
    var shape = tween._target;
    this.container.removeChild(shape);
  }

  /**
   * 画像の周りに星を生成する処理を追加
   * @param options 上記のコメント参照
   * @returns {*}
   */
  $.fn.twinkle = function (options) {
    if (!this.length) {
      return this;
    }

    var o = $.extend({
      startPoint   : 0,
      stopPoint    : 100,
      quantity     : 10,
      pointInterval: 0.1,
      effect       : 'line'
    }, options);

    /**
     * canvasを生成し、そこに星を表示させる
     * @param canvas
     * @constructor
     */
    function Twinkle(canvas) {
      var po = 0, self = this;
      this.canvas = canvas;
      this.stage = new createjs.Stage(this.canvas);

      var tick = function () {
        var quantity = o.quantity;
        if (po > o.stopPoint) {
          //停止
          stop();
          self.stage.update();
          return;
        } else {
          while (quantity--) {
            createTwinkle.apply(self, [po, o.effect]);
          }
        }
        po += o.pointInterval;
        self.stage.update();
      };

      var stop = function () {
        setTimeout(function () {
          $(self.canvas).remove();
          createjs.Ticker.removeEventListener('tick', tick);
        }, 1600);
      };

      po = o.startPoint;
      this.container = new createjs.Container();
      this.stage.addChild(this.container);
      createjs.Ticker.setFPS(60);
      createjs.Ticker.addEventListener('tick', tick);
    }

    return this.each(function () {
      //canvasが作れない場合は処理しない
      try {
        document.createElement("canvas").getContext("2d");
      } catch (e) {
        return this;
      }
      //canvasを作成
      var $canvas = createCanvas.apply($(this));
      if (!$canvas) {
        return this;
      }

      new Twinkle($canvas[0]);
      return this;
    });
  };
})(jQuery, this);