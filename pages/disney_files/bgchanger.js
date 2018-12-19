/**
 * スクロールに応じて背景の画像を切り替える
 */
;(function () {
  "use strict";
  var BgChanger, _changePer, _contentsHeight, _rate, _p, _switchPoint, _windowHeight;
  var getContentsHeight, getScrollPer, onScroll, round, calcFadeIn, calcFadeOut, flip, setOpacity, calcOpacity;

  if (!window.BgChanger) {
    window.BgChanger = BgChanger = {};
  } else {
    throw new Error("BgChanger is already used!");
  }
  getContentsHeight = function () {
    return Math.max.apply(null,
      [document.body.clientHeight ,
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.documentElement.clientHeight]);
  };

  BgChanger.init = function () {
    var contentsHeightTop;
    //コンテンツ全体の高さ
    _contentsHeight = getContentsHeight();
    //ウィンドウの高さ
    _windowHeight = document.documentElement.clientHeight;
    //スクロールの最下点
    contentsHeightTop = _contentsHeight - _windowHeight;
    //切り替えポイント
    _switchPoint = parseInt(contentsHeightTop / 3, 10);
    //1セクション内でのスクロール率
    _p = void 0;
    _changePer = 30;
    _rate = 0.75 / _changePer;
    //scrollTop = void 0;
    $(window).on("scroll", function () {
      onScroll();
    });
  };

  /**
   * 各セクション(朝,昼,夜)の中でどのくらいスクロールしているかをパーセンテージで出力
   * @param scrollTop
   * @param sizeHeight
   * @returns {number}
   */
  getScrollPer = function (scrollTop, sizeHeight) {
    while (scrollTop > sizeHeight) {
      scrollTop = scrollTop - sizeHeight;
    }
    return Math.round((scrollTop / sizeHeight) * 100);
  };

  /**
   * 小数点を含む数値を丸める
   * @param num 丸めたい数値
   * @param digits 小数点以下の桁数(1の場合は少数点なし), numの小数点以下の桁数以上をしていするとNaNとなる(要fix)
   * @returns {number}
   */
  round = function (num, digits) {
    var d = "1";
    while (digits--) {
      d += "0";
    }
    d = +d;
    return Math.round(num * d) / d;
  };

  /**
   * 各背景の透過度を設定する
   * @param opacities 透過値(0〜1)の配列
   */
  setOpacity = function (opacities) {
    $("#castleMorning").css("opacity", opacities[0]);
    $("#castleNoon").css("opacity", opacities[1]);
    $("#castleNight").css("opacity", opacities[2]);
  };


  calcFadeOut = function (p, changePer, rate) {
    return round(+(p - (100 - changePer)) * rate, 2);
  };
  calcFadeIn = function (p, changePer, rate) {
    return round((changePer - p) * rate, 2);
  };
  flip = function (o) {
    return round(1 - o, 2);
  };

  /**
   * 背景画像の透過を計算
   * @type {{first: Function, middle: Function, last: Function}}
   */
  calcOpacity = {
    first : function () {
      var result = [1, 0, 0], op;
      if (_p > (100 - _changePer)) {
        op = calcFadeOut(_p, _changePer, _rate);
        result = [ flip(op), op, 0];
      }
      return result;
    },
    middle: function () {
      var changePer2, rate2, result, op;
      changePer2 = parseInt(_changePer / 2, 10);
      rate2 = 0.25 / changePer2;
      result = [0, 1, 0];
      if (_p < changePer2) {
        op = calcFadeIn(_p, changePer2, rate2);
        result = [op, flip(op), 0];
      } else if (_p > (100 - changePer2)) {
        op = calcFadeOut(_p, changePer2, rate2);
        result = [0, flip(op), op];
      }
      return result;
    },
    last  : function () {
      var result = [0, 0, 1], op;
      if (_p < _changePer) {
        op = calcFadeIn(_p, _changePer, _rate);
        result = [0, op, flip(op)];
      }
      return result;
    }
  };

  /**
   * スクロール時の処理
   * @returns {*}
   */
  onScroll = function () {
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    _p = getScrollPer(scrollTop, _switchPoint);
    //スクロールがはみ出した場合処理しない
    if (scrollTop <= 0) {
      setOpacity([1, 0, 0]);
      return;
    }
    //スクロールがはみ出した場合処理しない
    if (scrollTop + _windowHeight >= _contentsHeight) {
      setOpacity([0, 0, 1]);
      return;
    }

    if (scrollTop <= _switchPoint) {
      //朝
      setOpacity(calcOpacity.first());
    } else if (scrollTop > _switchPoint && scrollTop <= _switchPoint * 2) {
      //昼
      setOpacity(calcOpacity.middle());
    } else {
      //夜
      setOpacity(calcOpacity.last());
    }
  };
}).call();