(function (window) {

  /**
   * Utility オブジェクト
   * @type {{}}
   */
  var util = {};

  /**
   * -1〜1を乱数で出力し係数をかける。
   * ※ 10の場合は-10〜10となる
   * @param d 係数
   * @returns {number}
   */
  util.rmd = function (d) {
    d = d || 1;
    return (Math.random() - 0.5) * 2 * d;
  };

  /**
   * min と max の間でランダムな整数を取得
   * @param min
   * @param max
   * @returns {number}
   */
  util.random = function (min, max) {
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

  /**
   * Arrayの中でランダムに1つを抽出する
   * @param arr
   * @returns {*}
   */
  util.pick = function (arr) {
    if (arr instanceof Array) {
      return arr[Math.floor(Math.random() * arr.length)];
    } else {
      return this;
    }
  };

  if (!window.util) {
    window.util = util;
  }

})(this);

/**
 * 数値分繰り返す拡張関数　(rubyのtimes関数)
 * @param fn
 */
Number.prototype.times = function(fn) {
  var _i, _ref;
  for (_i = 1, _ref = this.valueOf(); 1 <= _ref ? _i <= _ref : _i >= _ref; 1 <= _ref ? _i++ : _i--) {
    fn();
  }
};
