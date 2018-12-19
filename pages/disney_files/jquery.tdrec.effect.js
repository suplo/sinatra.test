/**
 *
 */
(function ($) {
  "use strict";
  //jquery関数の拡張
  $.extend({
    /**
     * 「トップへ戻る」要素を生成する
     */
    tdrec_addReturnToTop: function () {
      var $pagetop = $('<p class="pagetop" style="display:none;"></p>');
      $pagetop.html('<a href="javascript:void(0);">' +
        '<img width="68" height="68" alt="Pagetop" src="/cgp/images/jp/pc/btn/btn_pagetop.png" /></a>');
      $pagetop.tdrec_toppage();
      $('#content').append($pagetop);

      var scrollHeight = Math.ceil($(window).height() / 2);
      $(window).scroll(function () {
        //表示されているコンテンツの半分を過ぎたら表示される
        if ($(window).scrollTop() > scrollHeight) {
          $pagetop.fadeIn();
        } else {
          $pagetop.fadeOut();
        }
      });
    }
  });

  //jqueryの拡張
  $.fn.extend({

    /**
     * トップページの画像スライドを設定
     * @param opt
     */
    tdrec_imageSlider: function (opt) {
      var o = $.extend({
        prevSelector: '.prev',
        nextSelector: '.next',
        duration    : 500
      }, opt);
      var $slider = this;
      var isMoving = false;
      var $view = $slider.find('ul');
      var items = $slider.find('li');
      // 画像データが1つの場合は動作しない
      if (items.length < 2) {
        $(o.prevSelector + ',' + o.nextSelector).hide();
        return;
      }
      var during = $slider.find('li:eq(0)').outerWidth(true);

      // left値を数値で取得
      var getLeft = function () {
        var left = $view[0].style.left; //$view.css('left');だとchromeで縮小したとき値がうまく取れない
        left = left === 'auto' ? 0 : left.replace('px', '');
        return +left;
      };

      // left値をセット
      var setLeft = function (left) {
        $view.css('left', left + 'px');
      };

      //rotation用に先頭と最後尾にそれぞれ、最後尾、先頭の画像を設定する
      var last1 = items.clone().slice(-1);
      $view.append($slider.find('li:lt(1)').clone());
      $slider.find('li').first().before(last1);

      //初期位置をセット
      setLeft(-(during));

      //全バナーの幅
      var maxWidth = during * ($slider.find('li').length - 1);

      //スライドアニメーション
      var slide = function (e, toLeft) {
        isMoving = true;
        var left;
        if (toLeft) {
          left = (getLeft() - during);
        } else {
          left = (getLeft() + during);
        }
        $(this).animate({
          left: left + 'px'
        }, o.duration, function () {
          isMoving = false;
          if (-getLeft() >= maxWidth) {
            //最後に到達した場合はleftを最初の画像に設定する
            setLeft(-(during));
          }
          if (getLeft() >= 0) {
            //最初に到達した場合はleftを最後尾の画像の位置に設定する
            setLeft(-(during * ($slider.find('li').length - 2)));
          }
        });
      };
      $view.bind('slide', slide);

      // ボタンイベント
      $slider.on('click', o.nextSelector,function (e) {
        e.preventDefault();
        if (isMoving) {
          return;
        }
        $view.trigger('slide', true);

      }).on('click', o.prevSelector, function (e) {
          e.preventDefault();
          if (isMoving) {
            return;
          }
          $view.trigger('slide', false);
        });

    },
    /**
     * Topへ戻る
     * @returns {string|click|.special.click|HTMLInputElement.click}
     */
    tdrec_toppage    : function () {
      $(this).click(function () {
        if($(this).hasClass("scrolling")){
          return;
        }
        $(this).addClass("scrolling");
        var scrollBtn=$(this);
        $('body,html').animate({
          scrollTop: 0
        }, 800 ,function(){
          
          scrollBtn.removeClass("scrolling");
          
        });
        return false;
      });
    },

    /**
     * 指定の要素に要素を追加する
     * @param $content 追加する要素
     * @returns {*}
     */
    tdrec_append: function ($content) {
      $content.hide().appendTo($(this)).fadeIn(500);
    },

    tdrec_remove: function (speed) {
      speed = speed || 500;
      this.animate({
        height : 0,
        opacity: 0
      }, speed, function () {
        $(this).remove();
      });
    },

    /**
     * キラッと関数
     */
    tdrec_shine: function (speed) {
      speed = speed || 700;
      this.each(function () {
        var orgCss = $(this).attr('style');
        var $shine = $('<div class="thumb_shine" ' +
          'style="width:' + $(this).innerWidth() + 'px; ' +
          'height:' + $(this).innerHeight() + 'px"></div>');
        //キラッと光る用の画像を設定
        $(this).css('position', 'relative').append($shine);
        var $self = $(this);
        $shine.show()
          .css("background-position", "-260px 0")
          .animate({ backgroundPositionX: '230px' }, speed, function () {
            $shine.remove();
            $self.removeAttr('style');
            $self.attr('style', orgCss);
          });
      });
      return this;
    },

    /**
     * blink関数
     */
    tdrec_blink: function (speed) {
      speed = speed || 500;
      this.fadeOut(speed, function () {
        $(this).fadeIn(speed);
      });
      return this;
    }

  });
})(jQuery);

/**
 * jQuery UI widgetの拡張
 */
(function () {

  /**
   * header固定関数
   */
  $.widget('tdrec.headerFix', {
    options: {
      bodyTarget: '.boxSearch02',
      showSpeed : 500,
      hideSpeed : 300
    },

    _create: function () {
      $.extend(this, {
        _height  : 0,
        _animate : false,
        _isVisble: false
      });
      this._limit = 0;
      $(window).bind("scroll.headerFix", $.proxy(this._onScroll, this));
    },

    _init: function () {
      this.reflow();
      return this.element.css("top", -this._height + "px");
    },

    reflow: function () {
      var body, elTop, nLimit;
      body = $(this.options.bodyTarget);
      elTop = body.prev();
      nLimit = body.offset().top;
      this._height = this.element.height();
      this._nFollowTop = nLimit + this._height;
      this._setLimit();
    },

    _setLimit: function () {
      var body;
      body = $(this.options.bodyTarget);
      this._limit = body.offset().top - 20;
    },

    _onScroll: function () {
      this._onVerticalScroll();
    },

    _onVerticalScroll: function () {
      this._setLimit();
      var scrollTop = $(document).scrollTop();
      if (scrollTop > this._limit) {
        if (!this._animate) {
          if (scrollTop < this._nFollowTop && scrollTop < this._nBeforeTop) {
            if (this._isVisble) {
              this._stop();
              this._hide(this.hideSpeed);
            }
          } else {
            if (this.element.css("top") !== "0px") {
              this._show(this.showSpeed);
            }
          }
        }
      } else {
        if (!this._animate) {
          if (this._isVisble) {
            this._stop();
            this._hide(this.hideSpeed);
          }
        }
      }
      this._nBeforeTop = scrollTop;
    },

    _show: function (speed) {
      var _this = this;
      this._animate = true;
      return this.element.animate({
        top: 0
      }, speed, function () {
        _this._animate = false;
        _this._isVisble = true;
      });
    },

    _hide: function (speed) {
      var _this = this;
      this._animate = true;
      this._height = this.element.height();
      return this.element.animate({
        top: -this._height + "px"
      }, speed, function () {
        _this._animate = false;
        _this._isVisble = false;
      });
    },

    _stop: function () {
      this.element.stop();
    }
  });

  /**
   * ダイアログの基底となるwidget
   */
  $.widget('tdrec.dialog', {
    options: {
      contents            : '',
      _className          : '',
      useCloseButton      : false,
      useBottomCloseButton: false,
      modalOffsetY        : 50,
      feedInSpeed         : 500,
      withNavAndInner     : true,
      open                : function () {
      },
      close               : function () {
      },
      removeOnClose		  : true,
      overlayClose        : true
    },

    /**
     * モーダルの背景を生成
     * @returns {*|jQuery|HTMLElement}
     */
    _generateModalOverlay: function () {
      var $modalOverlay;
      $modalOverlay = $('<div>', {
        id     : "modalOverlay",
        "class": "modalOverlay"
      });
      if ($('body').find('#modalOverlay')) {
        $modalOverlay.appendTo('body');
      }
      return $modalOverlay;
    },

    /**
     * モーダル本体を生成
     * @returns {*|jQuery|HTMLElement}
     */
    _generateModal: function () {
      return $('<div>', {
        id     : "modalDialog",
        "class": "modalDialog " + this.options._className
      });
    },
    
    /**
     * 複数のmodalがある時に最後のmodalを上に表示する
     */
    _setHighLayer: function () {
    	$(".modalOverlay, .modalDialog").removeClass("highLayer");
    	$(".modalOverlay:visible:last, .modalDialog:visible:last").addClass("highLayer");
    },

    _create: function () {
      this._$modalOverlay = this._generateModalOverlay();
      this._$modal = this._generateModal();
      this._$modal.hide();
      if (this.options.overlayClose) {
        this._on(this._$modalOverlay, {
          click: "close"
        });
      }
      if (this.options.useCloseButton) {
        this._addCloseButton();
      }
      //コンテンツを設定
      this._putContents();
      if (this.options.useBottomCloseButton) {
        this._addBottomCloseButton();
      }
      return this._append();
    },

    /**
     * 右上の閉じるボタンを設置
     * @returns {*|void}
     */
    _addCloseButton: function () {
      var $closeButton;
      $closeButton = $(this.options._closeButtonHTML);
      this._on($closeButton, {
        click: "close"
      });
      return this._$modal.append($closeButton);
    },

    /**
     * 下部の閉じるボタンを設置
     */
    _addBottomCloseButton: function () {
    },

    _append: function () {
      return this._$modal.appendTo('body');
    },

    open: function () {
      //モーダルを表示
      this._$modal.show();
      var top, _this = this;
      this._$modalOverlay.fadeIn(this.options.feedInSpeed);
      top = document.documentElement.scrollTop || document.body.scrollTop;
      this._$modal.css("top", (top + this.options.modalOffsetY) + "px")
        .fadeIn(this.options.feedInSpeed, function () {
          _this._trigger('open', null, {
            options: _this.options,
            dialog : _this._$modal
          });
        });
      this._setHighLayer();
    },

    close: function (e) {
      if (e) {
        e.preventDefault();
      }
      this._$modal.hide();
      if (this.options.removeOnClose) {
    	  this._$modal.remove();
      }
      this._$modalOverlay.hide();
      if (this.options.removeOnClose) {
    	  this._$modalOverlay.remove();
      }
      this._trigger('close', null, {
        options: this.options,
        dialog : this._$modal
      });
      this._setHighLayer();
    },

    init: function (e) {
      this._$modal.empty();
      this._putContents();
    }
  });

  /**
   * 大サイズのモーダル
   */
  $.widget('tdrec.dialogLarge', $.tdrec.dialog, {
    options: {
      _className            : 'modal01',
      _closeButtonHTML      : "<p class=\"close01\">\n  <a href=\"javascript:void(0);\">\n    <img src=\"/cgp/images/jp/pc/btn/btn_close_03.png\" width=\"56\" height=\"60\" alt=\"閉じる\" class=\"roll\">\n  </a>\n</p>'",
      _bottomCloseButtonHTML: "<p class=\"close02\">\n  <a href=\"javascript:void(0);\">\n    <img src=\"/cgp/images/jp/pc/btn/btn_close_04.png\" width=\"99\" height=\"44\" alt=\"閉じる\" class=\"roll\">\n  </a>\n</p>"
    },

    /**
     * 下部の閉じるボタンを設定
     * @returns {*|void}
     * @private
     */
    _addBottomCloseButton: function () {
      var $closeButtonBottom;
      $closeButtonBottom = $(this.options._bottomCloseButtonHTML);
      this._on($closeButtonBottom, {
        click: "close"
      });
      this._$modal.append($closeButtonBottom);
    }
  });

  /**
   * コンテンツ用ダイアログ
   */
  $.widget('tdrec.dialogLargeContents', $.tdrec.dialogLarge, {
    options     : {
      _headerHTML: "<div class=\"header02\">\n  <h2><img src=\"/cgp/images/jp/pc/tit/tit_modal_02.png\" width=\"964\" height=\"57\" alt=\"コンテンツの選択\"></h2>\n</div>",
      _bodyHTML  : "<div class=\"inner\">"
    },

    //コンテンツを設定
    _putContents: function () {
      var $inner;
      this._$modal.append($(this.options._headerHTML));
      $inner = $(this.options._bodyHTML);
      return this._$modal.append($inner.append($($.parseHTML(this.options.contents))));
    }
  });

  /**
   * ホテル詳細用のダイアログ
   */
  $.widget('tdrec.dialogLargeHotelInfo', $.tdrec.dialogLarge, {
    options     : {
      _bodyHTML: "<ul class=\"navModal01\"></ul><div class=\"inner\">",
      _bodyHTML_en: "<ul class=\"navModal01\"></ul><div class=\"inner\">" 
    },
    //コンテンツを設定
    _putContents: function () {
      var $inner;
      if (i18n.isJP()) {
    	  this._$modal.append($(this.options._bodyHTML));
      }
      else {
    	  this._$modal.append($(this.options._bodyHTML_en));
      }

      $inner = this._$modal.find('.inner');
      $inner.append($($.parseHTML(this.options.contents)));
    }
  });

  /**
   * ログイン用ダイアログを表示する
   */
  $.widget('tdrec.dialogLogin', $.tdrec.dialog, {
    options     : {
      useBottomCloseButton: false,
      modalOffsetY        : 150,
      _className          : 'loginModalWrap',
      _closeButtonHTML    : "<p class=\"loginClose01\"><a href=\"javascript:void(0);\"><img src=\"/cgp/images/jp/pc/btn/btn_close_03.png\" width=\"56\" height=\"60\" alt=\"閉じる\" class=\"roll\"></a></p>"
    },
    _putContents: function () {
      return this._$modal.append($($.parseHTML(this.options.contents)));
    }
  });

  /**
   * 小さいダイアログを表示する
   */
  $.widget('tdrec.dialogSmall', $.tdrec.dialog, {
    options     : {
      useBottomCloseButton: false,
      _className          : 'modal02',
      _closeButtonHTML    : "<p class=\"close01\">\n  <a href=\"javascript:void(0);\">\n    <img src=\"/cgp/images/jp/pc/btn/btn_close_06.png\" width=\"29\" height=\"29\" alt=\"閉じる\">\n  </a>\n</p>"
    },
    _putContents: function () {
      return this._$modal.append($($.parseHTML(this.options.contents)));
    }
  });
  
  /**
   * vpでのモーダルを表示する
   */
  $.widget('tdrec.modalFrontVP', $.tdrec.dialog, {
    options     : {
      useBottomCloseButton: true,
      _className          : 'modal02',
      _closeButtonHTML    : "<p class=\"close01\">\n  <a href=\"javascript:void(0);\">\n    <img src=\"/cgp/images/jp/pc/btn/btn_close_06.png\" width=\"29\" height=\"29\" alt=\"閉じる\">\n  </a>\n</p>"
    },
    _putContents: function () {
      return this._$modal.append($($.parseHTML(this.options.contents)));
    }
  });

  /**
   * 指定の要素がクリックされると詳細が開くwidget
   */
  $.widget('tdrec.toggleWidget', {
    options: {
      targetEl: '',
      speed   : 100,
      open    : function () {
      },
      close   : function () {
      }
    },

    _create: function () {
      this.$trgEl = $(this.options.targetEl);
    },

    _init: function () {
      var _this = this;
      this.element.on('click', function (e) {
        e.preventDefault();
        if (_this.$trgEl.css('display') === 'none') {
          return _this._show();
        } else {
          return _this._hide();
        }
      });
    },
    _show: function () {
      this.$trgEl.slideDown(this.options.speed);
      this._trigger('open', null, {
        options : this.options,
        targetEl: this.$trgEl
      });
    },
    _hide: function () {
      this.$trgEl.slideUp(this.options.speed);
      this._trigger('close', null, {
        options : this.options,
        targetEl: this.$trgEl
      });
    }
  });

  /**
   *
   */
  $.widget('tdrec.toggleList', {
    options: {
      header      : '',
      headerOffset: 65,
      closeAll    : false
    },
    _create: function () {
      this.$titles = this.element.find(this.options.header);
      this.$bodys = this.element.find(this.options.header).next();
      if (this.options.closeAll) {
        this.$bodys.hide();
      }
      this._on(this.$titles, { click: "_toggle" });
    },
    _toggle: function (e) {
      var $title = $(e.currentTarget), _this = this;
      $title.toggleClass('open');
      $title.next().slideToggle(function () {
        if ($title.hasClass('open')) {
          var top = $title.offset().top - _this.options.headerOffset;
          $('html,body').animate({ scrollTop: top });
        }
      });
    }
  });
  
  
  /**
  *
  */
 $.widget('tdrec.toggleListNoScroll', {
   options: {
     header      : '',
     headerOffset: 65,
     closeAll    : false
   },
   _create: function () {
     this.$titles = this.element.find(this.options.header);
     this.$bodys = this.element.find(this.options.header).next();
     if (this.options.closeAll) {
       this.$bodys.hide();
     }
     this._on(this.$titles, { click: "_toggle" });
   },
   _toggle: function (e) {
     var $title = $(e.currentTarget), _this = this;
     $title.toggleClass('open');
     $title.next().slideToggle(function () {
       
     });
   }
 });

  /**
   * 指定のDOMがcheckONだと詳細が開くwidget
   * optionのinvertは trueを渡した時にチェックボックスがOFFになったときに開く
   *
   */
  $.widget('tdrec.toggleWidgetCheckbox', $.tdrec.toggleWidget, {

    _init: function () {
      var _this = this;
      this.element.on('click', function () {
        if (_this.element.is(':checked')) {
          _this._show();
        } else {
          _this._hide();
        }
      });
    }
  });


  /**
   * カルーセル(beta)
   */
  $.widget('tdrec.carousel', {
    options: {
      prev       : '',
      next       : '',
      goFirst    : '',
      view       : '',
      cell       : '',
      slideSize  : 1,
      speed      : 500,
      itemPerPage: 5,
      created    : function () {
      },
      slideEnd   : function () {
      },
      changeCntlLeft: function(stat) {
    	  // 左端のコントロールボタンの状態
      },
      changeCntlRight: function(stat) {
    	  // 右端のコントロールボタンの状態
      },
      startPos   : 0
    },

    _create: function () {
      this.prev = this.element.find(this.options.prev).eq(0);
      this.next = this.element.find(this.options.next).eq(0);
      this.goFirst = this.element.find(this.options.goFirst).eq(0);
      this.view = this.element.find(this.options.view).eq(0);
      this.view.css('position', 'relative');
      this._on(this.prev, {
        click: "_toRight"
      });
      this._on(this.next, {
        click: "_toLeft"
      });
      this._on(this.goFirst, {
        click: "_goFirst"
      });
      this.cellWidth = this.element.find(this.options.cell).eq(0).outerWidth(true);
      this.allItemSize = this.view.find(this.options.cell).length;
      this.maxWidth = this.allItemSize * this.cellWidth;
      this.pageWidth = this.cellWidth * this.options.itemPerPage;
      this.currentPage = 1;
      this.totalPage = Math.ceil(this.allItemSize / this.options.itemPerPage);
      this._trigger("created", null, {
        options    : this.options,
        currentPage: this.currentPage,
        totalPage  : this.totalPage
      });
      this.cntlStat = {left: null, right: null}; // can move: 1, reached to end: 0
      this._checkStat();
      this._setStartPos();
    },

    _toLeft: function (e) {
      e.preventDefault();
      this._slideLeft(1);
    },

    _toRight: function (e) {
      e.preventDefault();
      this._slideRight(1);
    },


    _getLeft: function () {
      var left;
      left = this.view.css('left');
      if (typeof left !== "number") {
        left = left === "auto" ? 0 : left.replace(/px|em/, '');
      }
      return +left;
    },

    _slideLeft : function (pageSize) {
      var left = this._getLeft();
      if (this.maxWidth <= Math.abs(left) + this.pageWidth) {
        return;
      }
      left -= this.cellWidth * this.options.slideSize * pageSize;
      if (!this.isAnimating) {
        this.currentPage += pageSize;
        this._move(left);
      }
    },
    _slideRight: function (pageSize) {
      var left = this._getLeft();
      if (left === 0) {
        return;
      }
      left += this.cellWidth * this.options.slideSize * pageSize;
      if (!this.isAnimating) {
        this.currentPage -= pageSize;
        this._move(left);
      }
    },

    _move: function (left) {
      var _this = this;
      this.isAnimating = true;
      this.view.animate({
        left: left + "px"
      }, this.options.speed, function () {
        _this._moveCompleted();
        _this._trigger('slideEnd', null, {
          options    : _this.options,
          currentPage: _this.currentPage,
          totalPage  : _this.totalPage
        });
      });
    },

    _moveCompleted: function () {
      this.isAnimating = false;
//      console.log(this.currentPage + '/' + this.totalPage);
      this._checkStat();
    },

    _goFirst: function (e) {
      e.preventDefault();
      if (this.currentPage !== 1) {
        this._slideRight(this.currentPage - 1);
      }
    },

    // 左右に動けるかどうかの判断
    _checkStat: function() {
    	var right = (this.maxWidth <= Math.abs(this._getLeft()) + this.pageWidth) ? 0 : 1;
    	var left = (0 == this._getLeft()) ? 0 : 1;
    	
    	if (this.cntlStat.right != right) {
    		this.options.changeCntlRight(right);
    		this.cntlStat.right = right;
//    		console.debug('change cntl stat right:' + right);
    	}
    	
    	if (this.cntlStat.left != left) {
    		this.options.changeCntlLeft(left);
    		this.cntlStat.left = left;
//    		console.debug('change cntl stat left:' + left);
    	}
    	
    	
    },
    
    // 初期表示位置の設定
    _setStartPos: function() {
    	var pageTarget = Math.floor(this.options.startPos/this.options.slideSize);
        this._slideLeft(pageTarget);
    }

  });


})();


// カルーセルスクロールボタン制御用ファンクサンプル
var timeSpanControl = {
		prev: function(stat) {
			var src = $('.js-carousel p.prev img').attr('src');
			var prefix = src.replace(/\.png$/, '');
			var change = 0;
			if (stat == 1 && prefix.match(/_d$/)) {
				src = prefix.replace(/_d/, '') + '.png';
			} else if (stat == 0 && ! prefix.match(/_d$/)) {
				src = prefix + '_d.png';
			} else {
				src = null;
			}
			
			if (src) {
				$('.js-carousel p.prev img').attr('src', src);
			}
		},
		
		next: function(stat) {
			var src = $('.js-carousel p.next img').attr('src');
			var prefix = src.replace(/\.png$/, '');
			var change = 0;
			if (stat == 1 && prefix.match(/_d$/)) {
				src = prefix.replace(/_d/, '') + '.png';
			} else if (stat == 0 && ! prefix.match(/_d$/)) {
				src = prefix + '_d.png';
			} else {
				src = null;
			}
			
			if (src) {
				$('.js-carousel p.next img').attr('src', src);
			}
		}
};

//カルーセル初期表示位置制御用ファンクサンプル
var startPosControl = {
		current: function() {
			var pos = 0;
			// カレントオブジェクトの位置を取得
			$('.js-carousel ul.cf li').each(function(idx){
				if ($(this).attr('class').match(/current/)){
					pos = idx;
				}
			});
			return pos;
		},
		select: function(stat) {
			var pos = 0;
			// 開催回キー(パラメータ)の位置を取得
			if (stat != null) {
				$('.js-carousel ul.cf li').each(function(idx){
					if ($(this).find('input[name="openNumKey"]').val() == stat){
						pos = idx;
					}
				});
			}
			return pos;
		}
};


//=================================================
//             ローディング　ファンクション    
//=================================================

/**
 * ローディングfunc: 単体でローディングを表示するにはこれ。画面ロック、リクエストがささった時にloadingを消去するために、単体での使用は推奨されない
 * 
 * @param submitFunction
 */
function loadImage(submitFunction){
	var dialogHtml = '<div class="loading04"></div>';
	
	console.log(submitFunction);
	
	// ダイアログの生成
	window.loading = $.tdrec.loadImage({
		useCloseButton : false,
		feedInSpeed : 100,
		contents :dialogHtml,
		close : function() {
			$('#loading_modalOverlay, #loading_modalDialog').remove();
		}
	});
	
	$('div.loading04 *').remove();
	$('div.loading04').append(appLoadingImage);
	
	window.loading.open();
	
	if (typeof submitFunction == 'function') {
		window.setTimeout(function() {
			submitFunction();
		}, 200);
	}
	
	return window.loading;
}

function openLoadImage(){
  var dialogHtml = '<div class="loading04"></div>';
  
  
  // ダイアログの生成
  window.loading = $.tdrec.loadImage({
    useCloseButton : false,
    feedInSpeed : 100,
    contents :dialogHtml,
    close : function() {
      $('#loading_modalOverlay, #loading_modalDialog').remove();
    }
  });
  
  $('div.loading04 *').remove();
  $('div.loading04').append(appLoadingImage);
  
  window.loading.open();
  
  return window.loading;
}

function closeLoadImage() {
	window.loading.close();
}

/**
 * ロック主体のローディングfunc
 * @param submitFunction
 * @returns
 */
function loadImageWithLock(submitFunction) {
	if (typeof tokenBtnLockObj == 'object') {
		tokenBtnLockObj.preProc = loadImage;
		//tokenBtnLockObj.postProc = closeLoadImage;
		
		tokenBtnLockFunc(null, submitFunction);
	} else {
		return loadImage(submitFunction);
	}	
}


/**
 * ローディングを仕掛ける
 */
var appLoadingImage = new Image(); // loading用イメージオブジェクトを保持

$(function() {

	$.widget('tdrec.loadImage', $.tdrec.dialogSmall, {
		options : {
			overlayClose : false
		},

		// コンテンツを設定
		_putContents : function() {
			return this._$modal.append($($.parseHTML(this.options.contents)));
		},

		_generateModalOverlay : function() {
			var $modalOverlay;
			$modalOverlay = $('<div>', {
				id : "loading_modalOverlay",
				"class" : "modalOverlay" 
			});
			if ($('body').find('#loading_modalOverlay')) {
				$modalOverlay.appendTo('body');
			}
			return $modalOverlay;
		},

	    open: function () {
	        //モーダルを表示
	        this._$modal.show();
	        var top, _this = this;
	        this._$modalOverlay.fadeIn(this.options.feedInSpeed);
	        top = document.documentElement.scrollTop || document.body.scrollTop;
	        this._$modal
	          .fadeIn(this.options.feedInSpeed, function () {
	            _this._trigger('open', null, {
	              options: _this.options,
	              dialog : _this._$modal
	            });
	          });
	        this._setHighLayer();
	      },

		close : function () {
			// ダイアログとオーバーレイを隠す
	    	this._$modal.hide();
	        this._$modalOverlay.hide();
	        
    		 // remove
	        this._$modalOverlay.remove();
	        this._$modal.remove();
	        
	        window.loading = undefined;
		}

	});
	
	// loading用イメージURL
	appLoadingImage.src = '/cgp/images/jp/pc/ico/ico_loading_02.gif';
	
	// ロック用のファンクションが定義されていれば、ロック取得/解放後のcallbackにloadingをセット
	if (typeof tokenBtnLockObj == 'object') {
		tokenBtnLockObj.preProc = loadImage;
		//tokenBtnLockObj.postProc = closeLoadImage;
	}
	
	/**
	 * ローディング中を表示
	 */
	$(document).on('click', 'a.loading2next, button.loading2next, input.loading2next', function(e) {
		if (typeof tokenBtnLockObj == 'object') {
			tokenBtnLockFunc(e);
		} else {
			loadImage();
		}
	}).on('submit', 'form.loading2next', function(e) {
		if (typeof tokenBtnLockObj == 'object') {
			tokenBtnLockFunc(e);
		} else {
			loadImage();
		}
	});

});

