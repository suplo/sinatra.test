//トップページ
/**
 * 星となるDOMを生成
 * @param o
 * @returns {*}
 */
var orgDiv = document.createElement('div');
var createDiv = function(o){
  var div = orgDiv.cloneNode(true);
  div.className = 'star ' + o.className;
  var divStyle = div.style;
  divStyle.left = o.left + 'px';
  divStyle.top = o.top + 'px';
  divStyle.opacity = o.opacity;
  document.getElementById('content').appendChild(div);
  return $(div);
};

var orgImg = document.createElement('img');
orgImg.src = '/cgp/images/jp/pc/js/kira4_16.png';
orgImg.className = 'star';
var content = document.getElementById('content');
var createImg = function(o){
  var img = orgImg.cloneNode(true);
  //img.className = 'star ' + o.className;
  var divStyle = img.style;
  divStyle.left = o.left + 'px';
  divStyle.top = o.top + 'px';
  divStyle.opacity = o.opacity;
  content.appendChild(img);
  return $(img);
};


/**
 * キラキラを生成
 * @param left
 * @param top
 * @param opacity
 */
var plotStar = function(left, top, opacity){
  opacity = opacity || 1;
  var $stardiv, className, tweenType, randomNum_of_10;
  var scale = 3;
  var spreadRange = 15;
  while(scale--){
    //dom生成
    //className = util.pick(['kira3_16', 'kira4_16']);
    randomNum_of_10 = parseInt(Math.random() * 10, 10);
    tweenType = 'setTween_Twinkle';
    /*
     if (randomNum_of_10 === 0) {
     //10回に1回くらい（星アニメーション）
     className = 'star_anime';
     tweenType = 'setTweenKiraAnime';
     }
     */

    var l = left + (Math.random() * (spreadRange + 20));
    var t = top + (Math.random() * spreadRange);
    $stardiv = createImg({left: l, top: t, opacity: opacity, className: className});

    if(randomNum_of_10 % 2 === 0){
      //2回に1回(drop効果を生成)
      createImg({left: l, top: t, opacity: opacity, className: util.pick(['kira1', 'kira2'])}).setTweenDrop().play();
    }
    /*
     //スプライトアニメーションを設定
     if (randomNum_of_10 === 0) {
     $stardiv.animateSprite({
     fps        : 6,
     numOfFrames: 6,
     doOnce     : true
     });
     }
     */
    //Tweenを実行
    $stardiv[tweenType]().play();
  }
};

//花火
var setFirework = function(){
  //打ち上がる位置
  var range = {
    left  : {
      min: 0, max: 1000
    },
    bottom: {
      min: 50, max: 300
    }
  };
  var $firework_large, $firework_small;
  var running = false;

  return {
    init : function(){
      $firework_large = $('.firework_large').animateSprite({
        numOfFrames: 23,
        fps        : 16,
        doOnce     : false,
        moveRandom : true,
        classNames : ['firework_l', 'firework_l_green', 'firework_l_red'],
        viewRange  : range,
        interval   : 1000
      });

      $firework_small = $('.firework_small').animateSprite({
        numOfFrames: 23,
        fps        : 16,
        doOnce     : false,
        moveRandom : true,
        classNames : ['firework_s', 'firework_s_red', 'firework_s_green'],
        viewRange  : range,
        interval   : 1000
      });

    },
    start: function(){
      if(!running){
        $firework_large.start();
        $firework_small.start();
        running = true;
      }
    },
    stop : function(){
      if(running){
        $firework_large.stop();
        $firework_small.stop();
        running = false;
      }
    }
  }
};

var BgTwinkleStar = function(){
  var plotTwinkleLine, getVisibleStar, calcCheckPoint;
  var windowHeight = $(window).height();
  var viewRange = 20;//0.5; //topからどのくらいtwinkleを表示するか(0〜1)
  var duringTime = 30; //twinkleをplotする間隔(ms) 15
  var animating = false;
  var checkPoint = [];
  //キラキラがでるポイントを生成
  calcCheckPoint = function(){
    for(var i = 0, len = 20; i < len; i++){
      checkPoint.push(i * 100);
    }
  };

  /**
   * 点を上から下までうつ
   */
  plotTwinkleLine = function(){
    var getContentsHeight;
    /**
     * コンテンツ全体の高さを取得(top)
     * @param topOffset 最初の点と最上部からの距離(px)
     * @returns {number}
     */
    getContentsHeight = function(topOffset){
      return Math.max.apply(null, [document.body.clientHeight , document.body.scrollHeight, document.documentElement.scrollHeight, document.documentElement.clientHeight]) - topOffset;
    };
    var contentsHeight = getContentsHeight(200);

    var margin = 120; //コンテンツから点がどのくらいはみ出すか
    var leftOffset = 20; // TwinkleのDivの起点が左上になるのでそれを考慮し点を少し左にずらす
    var content = document.getElementById('content');
    var width = $('#content').width() / 2;

    var orgDiv = document.createElement('div');
    orgDiv.style.position = "absolute";
    orgDiv.className = "bgStar";

    var docFragment = document.createDocumentFragment();

    var createDiv = function(top, left){
      var d = orgDiv.cloneNode(true);
      var divStyle = d.style;
      divStyle.top = top + 'px';
      divStyle.left = left + 'px';
      //divStyle.width='3px';divStyle.height='3px';divStyle.borderRadius='10px';divStyle.backgroundColor='#F00';
      return d;
    };
    var j = 0;

    for(var top = 0; top < contentsHeight - 100; top += 10){
      var left = (width) + (Math.sin(j * 0.7) * (width + margin)) - leftOffset;
      docFragment.appendChild(createDiv(top, left));
      j += 0.08;
    }
    content.appendChild(docFragment);
  };


  /**
   * 表示されている点を取得
   * @param startPos
   * @param endPos
   * @returns {*|jQuery}
   */
  getVisibleStar = function(startPos, endPos){
    return $('.bgStar').filter(function(){
      return $(this).position().top > startPos && $(this).position().top < endPos;
    });
  };

  return {
    init   : function(){
      plotTwinkleLine();
      calcCheckPoint();
    },
    //twinkleを実行（スクロールのイベントで呼ばれる）
    twinkle: function(st){
      if(animating){
        return;
      }else{
        animating = true;
      }
      var $visibles = getVisibleStar(st, st + (windowHeight * viewRange));
      var visibleSize = $visibles.length;
      var index = 0;
      var opacity, pos;
      var setInterval_Id = setInterval(function(){

        if(visibleSize - 1 < index){
          clearInterval(setInterval_Id);
          animating = false;
          return;
        }
        //opacity = 1 - (index / visibleSize);
        //opacity = opacity > 0.5 ? 1 : opacity; // 最初の方は通常の透過度
        opacity = 1;
        pos = $($visibles[index]).position();
        plotStar(pos.left, pos.top, opacity);
        if(pos.top > $(window).scrollTop() + windowHeight){
          clearInterval(setInterval_Id);
          animating = false;
          return;
        }
        index++;
      }, duringTime);
    }
  };
};

$(function(){
  //news ticker
  $('.ticker').tdrec_newsTicker({waitTime: 5000});
  //background change
  BgChanger.init();

  //背景Twinkle用の点を打つ
  var bgTwinkleStar = BgTwinkleStar();
  bgTwinkleStar.init();

  /** 花火セットアップ **/
  var fw = setFirework();
  fw.init();

  /**画像キラッと**/
  $('body').on('mouseenter', 'p.photo img',function(){
    $(this).twinkle({
      startPoint   : 10.4,
      stopPoint    : 14.8,
      quantity     : 10,
      pointInterval: 0.3,
      effect       : 'ellipse'
    });
  });

  //検索ボタンキラキラ
  $('.btn, .btnSearch').mouseovertwinkle({
    intervalTime: 100,
    fadeOutTime : 500,
    duration    : 1000
  });

  var scrollTop, scrollBottom, direction;
  var lastScrollTop = 0, lastScrollBottom = 0;
  var footerInnerHeight = $('#footer').find('.inner').offset().top;
  $(window).on('scroll', function(){
    scrollTop = $(this).scrollTop();
    scrollBottom = scrollTop + $(window).height();
    //縦スクロールのみ反応する
    if(scrollTop === lastScrollTop){
      return;
    }
    direction = scrollTop > lastScrollTop ? 'down' : 'up';
    //あるポイントを通過したら起動
    bgTwinkleStar.twinkle(scrollTop - 100);

    //フッターの黒い部分が表示されている時に花火を上げる
    if(scrollBottom >= footerInnerHeight && lastScrollBottom < footerInnerHeight){
      fw.start();
    }
    if(scrollBottom <= footerInnerHeight && lastScrollBottom > footerInnerHeight){
      fw.stop();
    }
    lastScrollTop = scrollTop;
    lastScrollBottom = scrollBottom;
  });
});