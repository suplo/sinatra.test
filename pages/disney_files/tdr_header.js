/* ---------------------------------------------------------------

   TDR JavaScript Class

--------------------------------------------------------------- */

/* Create Link List
----------------------------------------------------------- */
var TdrCreateLink = function(obj, type, option, current, tmpl) {
    /* Set from Argument */
    this.obj = obj;
    this.type = type;
    this.option = option;
    this.current = current;
    this.tmpl = tmpl;
    /* Set Default Link Properties */
    this.default_option = {
        // 日本語
        ja: {
            label: '%u65E5%u672C%u8A9E',
            path: 'http://www.tokyodisneyresort.jp/',
            target: '_self'
        }
    };
    /* Set Default Current */
    this.default_current = '';
    /* Set Default DOM Node */
    this.default_tmpl = document.createElement('li');
};

TdrCreateLink.prototype.init = function() {
    var _this = this;

    /* Check Is this Language Panel */
    var is_lang_panel = _this.checkIsLang();
    /* Create Link List */
    _this.createLink(is_lang_panel);
};

TdrCreateLink.prototype.checkIsLang = function() {
    var _this = this;

    var flg = false;
    if(_this.obj.className === '_tdrh-nav-lang-panel') {
        flg = true;
        var ulNode = document.createElement('ul');
        _this.addClassToElem(ulNode, '_tdrh-nav-lang-list');
        _this.obj.appendChild(ulNode);
    }
    return flg;
};

TdrCreateLink.prototype.createLink = function(is_lang_panel) {
    var _this = this;

    /* Check type, tmpl, option, current values
	if they have non-value, set default values */
    var type		= !!_this.type ? _this.type : 'lang';
    var template	= !!_this.tmpl ? _this.tmpl : _this.default_tmpl;
    var current		= !!_this.current ? _this.current : _this.default_current;
    var config		= !!_this.option ? _this.option : _this.default_option;

    var cnt = 0;
    var target	= is_lang_panel ? _this.getElemByClass('ul', '_tdrh-nav-lang-list', _this.obj)[0] : _this.obj;
    /*	Set Class Prefix */
    var prefix	= '_tdr-ref-' + type + '-';

    for (var key in config) {
        if (config.hasOwnProperty(key)) {
            cnt++;
            /* Set vars */
            var lang = config[key];
            var node = template.cloneNode(true);

            /* Add unique class to link item */
            _this.addClassToElem(node, prefix + key);

            /* If Option has link set url and link label */
            var liInr;
            if(lang.path && key !== current) {
                liInr = document.createElement('a');
                liInr.setAttribute('href', lang.path);
                if(lang.target !== '_self') liInr.setAttribute('target', lang.target);
                liInr.innerHTML = unescape(lang.label);
            } else if(lang.path && key === current) {
                liInr = document.createElement('em');
                liInr.innerHTML = unescape(lang.label);
            }
            if(is_lang_panel && cnt % 5 === 0) {
                var ulNode = document.createElement('ul');
                _this.addClassToElem(ulNode, '_tdrh-nav-lang-list');
                _this.obj.appendChild(ulNode);
                target = _this.getElemByClass('ul', '_tdrh-nav-lang-list', document)[1];
            }
            node.appendChild(liInr);
            target.appendChild(node);
        }
    }
};

TdrCreateLink.prototype.addClassToElem = function(obj, className) {
    var _this = this;

    var classList = [];
    var classNames = '';

    classList.push(obj.className);
    classList.push(className);
    classNames = classList.join(' ');
    obj.className = classNames;
};

TdrCreateLink.prototype.getElemByClass = function(tagName, className, parentNode) {
    var _this = this;

    var targetElements = [];
    var allTagElements = parentNode.getElementsByTagName(tagName);
    for (var i = 0 , j = 0; i < allTagElements.length; i++) {
        var classNames = allTagElements[i].className.split(' ');
        for(var k = 0; k < classNames.length; k++) {
            if (classNames[k] == className) {
                targetElements[j] = allTagElements[i];
                j++;
            }
        }
    }
    return targetElements;
};

/* Navigation Visible Toggle
----------------------------------------------------------- */
var TdrToggleNav = function(obj, option) {
    /* Set from Argument */
    this.obj = obj;
    this.option = option;
    /* Set Toggle Target
	  (If target is not assigned, target is closest next element) */
    this.stats = {
        target:		this.obj,
        swticher:	this.obj,
        exclude:	this.obj
    };
    this.flg = true;
};

TdrToggleNav.prototype.init = function() {
    var _this = this;

    var config = _this.mergeObj(_this.stats, _this.option);
    config.target_parent = config.target.parentNode;
    config.exclude_parent = config.exclude.parentNode;

    _this.addClickEvent(config);
};

TdrToggleNav.prototype.mergeObj = function(obj1, obj2) {
    if (!obj2) {
        obj2 = {};
    }
    for (var name in obj2) {
        if (obj2.hasOwnProperty(name)) {
            obj1[name] = obj2[name];
        }
    }
    return obj1;
};

TdrToggleNav.prototype.addClickEvent = function(config) {
    var _this = this;

    document.onclick = function() {
        config.target.style.display = 'none';
        config.target_parent.style.zIndex = '0';

        config.exclude.style.display = 'none';
        config.exclude_parent.style.zIndex = '0';
        _this.flg = false;
    };

    _this.obj.onclick = function(e) {
        var evt = e || window.event;
        if(evt.stopPropagation) {
            evt.stopPropagation();
        } else {
            evt.cancelBubble = true;
        }
    };

    /* Fade action */
    config.switcher.onclick = function(e) {
        var evt = e || window.event;
        if(evt.preventDefault) {
            evt.preventDefault();
        } else {
            evt.returnValue = false;
        }

        var displayProperty = 'none';
        if(config.target.style.display === 'none' || !config.target.style.display) {
            displayProperty = 'block';
        }
        config.target.style.display = displayProperty;
        config.target_parent.style.zIndex = config.target_parent.style.zIndex === '1209' ? '0' : '1209';
        config.exclude.style.display = 'none';
        config.exclude_parent.style.zIndex = '0';
    };
};

if (window.addEventListener) {
	window.addEventListener('load', windowLoadFunc, false);
} else {
    window.attachEvent('onload', windowLoadFunc);
}

function windowLoadFunc() {
	/* -------------------------------------------------------------------
	   Settings
	------------------------------------------------------------------- */
	/* Resource host */
    var domain = '//www.disney.co.jp';
//    var domain = '//stg.disney.co.jp';
//    var domain = '//' + location.hostname;
	/* CSS File Path */
	var css_path = '/cgp/css/jp/pc/tdr_header.css';

    /* ---------------------------------------------------------------
		   load CSS File
    --------------------------------------------------------------- */
    var link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.setAttribute('href', css_path);
    document.getElementsByTagName('head')[0].appendChild(link);
    if (link.addEventListener) {
        link.addEventListener('load', _tdr_header_structure, false);
    } else {
        link.attachEvent('onload', _tdr_header_structure);
    }

    /* ---------------------------------------------------------------

	   Start of TDR Header Structure

	--------------------------------------------------------------- */
	function _tdr_header_structure() {

		/* ---------------------------------------------------------------

		   TDR Header Structure

		--------------------------------------------------------------- */

        /* Markup
		----------------------------------------------------------- */
            var _tdr_header = '<div class="_tdrh">' +
                '<div class="_tdrh-article">' +
                '<p class="_tdrh-section _tdrh-logo"><a href="http://www.disney.co.jp/home.html?ex_cmp=fromTDR" target="_blank" class="_tdrh-logo-mark">Disney</a></p>' +
                '<div class="_tdrh-section _tdrh-nav">' +
                '<div class="_tdrh-nav-lang">' +
                '<p class="_tdrh-nav-lang-opener"><a href="#"><span class="_tdrh-nav-lang-icon"></span>Language</a></p>' +
                '<div class="_tdrh-nav-lang-panel">' +
                '<p class="_tdrh-nav-lang-closer"><a href="#">%CLOSE_UP%</a></p>' +
                '<!-- /._tdrh-nav-lang-panel --></div>' +
                '<!-- /._tdrh-nav-lang --></div><!--' +
                '--><div class="_tdrh-nav-disney _tdrh-lang-limited _tdrh-lang-is-ja">' +
                '<div class="_tdrh-nav-disney-panel">' +
                '<p class="_tdrh-nav-disney-opener"><a href="#"><span class="_tdrh-nav-disney-icon"><span></span></span>%OTHER_DISNEY_SITE%</a></p>' +
                '<ul class="_tdrh-nav-disney-list"></ul>' +
                '<!-- /._tdrh-nav-disney-panel --></div>' +
                '<!-- /._tdrh-nav-disney --></div>' +
                '<!-- /. _tdrh-nav --></div>' +
                '<!-- /._tdrh-article --></div>' +
                '<!-- /._tdrh --></div>';

        _tdr_header = _tdr_header.replace('%CLOSE_UP%', unescape('%u9589%u3058%u308B'));
        _tdr_header = _tdr_header.replace('%OTHER_DISNEY_SITE%', unescape('%u4ED6%u306E%u30C7%u30A3%u30BA%u30CB%u30FC%u30B5%u30A4%u30C8'));
        _tdr_header = conversionStringToNode(_tdr_header);

		/* Prepend Header Code
		----------------------------------------------------------- */
		var bodyFirstChild = document.getElementsByTagName('body')[0].firstChild || null;
        var DisnyJp = document.getElementById('DisnyJp');
		if(DisnyJp !== null) {
            var DisnyJpStyle = DisnyJp.style;
			DisnyJpStyle.zIndex = '1209';
			DisnyJp.appendChild(_tdr_header);
		}else{
			document.body.insertBefore(_tdr_header, bodyFirstChild);
		}

		/* Current Language
		----------------------------------------------------------- */
        var tdrh = getElemByClass('div', '_tdrh')[0];
        var current_lang = document.getElementById('_tdr-header-lang').className;
        addClassToElem(tdrh, '_tdrh-lang-' + current_lang);

		/* Current Protocol
		----------------------------------------------------------- */
		var current_protocol = location.protocol.replace(':', '');
        addClassToElem(tdrh, '_tdrh-protocol-' + current_protocol);

		/* ---------------------------------------------------------------

		   TDR Header Configure

		--------------------------------------------------------------- */
        var tdrCreateLinkPanel = new TdrCreateLink(getElemByClass('div', '_tdrh-nav-lang-panel')[0], 'lang', {
		/* Languages Start
		----------------------------------------------------------- */
            // 日本語
            ja: {
                label: '%u65E5%u672C%u8A9E',
				path: '/top/',
				target: '_self'
			},
            // English
            en: {
                label: 'English',
                path: '/en/top/',
				target: '_self'
			},
            // 簡体中文
            sc: {
                label: '%u7C21%u4F53%u4E2D%u6587',
				path: 'http://www.tokyodisneyresort.jp/sc/',
				target: '_self'
			},
            // 繁体中文
            tc: {
                label: '%u7E41%u4F53%u4E2D%u6587',
				path: 'http://www.tokyodisneyresort.jp/tc/',
				target: '_self'
			},
            // 한국어
            kr: {
                label: '%uD55C%uAD6D%uC5B4',
				path: 'http://www.tokyodisneyresort.jp/kr/',
				target: '_self'
			},
            // ภาษาไทย
            th: {
                label: '%u0E20%u0E32%u0E29%u0E32%u0E44%u0E17%u0E22',
                path: 'http://www.tokyodisneyresort.jp/th/',
                target: '_self'
            },
            // Bahasa Indonesia
            id: {
                label: 'Bahasa%20Indonesia',
                path: 'http://www.tokyodisneyresort.jp/id/',
                target: '_self'
            }
        /* Languages End
		----------------------------------------------------------- */
		}, current_lang);

		var tdrCreateLinkSelectBox = new TdrCreateLink(getElemByClass('ul', '_tdrh-nav-disney-list')[0], 'sites', {
		/* Other Disney Sites Start
		----------------------------------------------------------- */
            // Disney.jpホーム
            disney: {
                label: 'Disney.jp%u30DB%u30FC%u30E0',
                path: 'http://www.disney.co.jp/home.html?ex_cmp=fromTDR',
				target: '_blank'
			},
            // ショッピング
            shopping: {
                label: '%u30B7%u30E7%u30C3%u30D4%u30F3%u30B0',
                path: 'http://www.disney.co.jp/shopping.html?ex_cmp=fromTDR',
				target: '_blank'
			},
            // 劇場映画
            movie: {
                label: '%u5287%u5834%u6620%u753B',
                path: 'http://www.disney.co.jp/movie.html?ex_cmp=fromTDR',
				target: '_blank'
			},
            // ブルーレイ・デジタル配信
            studio: {
                label: '%u30D6%u30EB%u30FC%u30EC%u30A4%u30FB%u30C7%u30B8%u30BF%u30EB%u914D%u4FE1',
                path: 'http://www.disney.co.jp/studio.html?ex_cmp=fromTDR',
				target: '_blank'
			},
            // テレビ
            tv: {
                label: '%u30C6%u30EC%u30D3',
                path: 'http://www.disney.co.jp/tv.html?ex_cmp=fromTDR',
				target: '_blank'
			},
            // ミュージック
            music: {
                label: '%u30DF%u30E5%u30FC%u30B8%u30C3%u30AF',
                path: 'http://www.disney.co.jp/music.html?ex_cmp=fromTDR',
				target: '_blank'
			},
            // モバイル
            mobile: {
                label: '%u30E2%u30D0%u30A4%u30EB',
                path: 'http://www.disney.co.jp/mobile.html?ex_cmp=fromTDR',
				target: '_blank'
			},
            // パーク＆リゾート
            park: {
                label: '%u30D1%u30FC%u30AF%uFF06%u30EA%u30BE%u30FC%u30C8',
                path: 'http://www.disney.co.jp/park.html?ex_cmp=fromTDR',
				target: '_blank'
			},
            // イベント・ライブ
            eventlive: {
                label: '%u30A4%u30D9%u30F3%u30C8%u30FB%u30E9%u30A4%u30D6',
                path: 'http://www.disney.co.jp/eventlive.html?ex_cmp=fromTDR',
				target: '_blank'
			},
            // ゲーム
            games: {
                label: '%u30B2%u30FC%u30E0',
                path: 'http://www.disney.co.jp/games.html?ex_cmp=fromTDR',
				target: '_blank'
			},
            // キッズ
            kids: {
                label: '%u30AD%u30C3%u30BA',
                path: 'http://kids.disney.co.jp/home.html?ex_cmp=fromTDR',
				target: '_blank'
			},
            // スター・ウォーズ
            starwars: {
                label: '%u30B9%u30BF%u30FC%u30FB%u30A6%u30A9%u30FC%u30BA',
                path: 'http://starwars.disney.co.jp/home.html?ex_cmp=fromTDR',
				target: '_blank'
			}
		/* Other Disney Sites End
		----------------------------------------------------------- */
		});

		/* Create Language Panel and Select Box Menu Link List
		----------------------------------------------------------- */
		tdrCreateLinkPanel.init();
		tdrCreateLinkSelectBox.init();

		/* -------------------------------------------------------------------
		   Program
		------------------------------------------------------------------- */
        var tdrToggleNavOpener = new TdrToggleNav(getElemByClass('div', '_tdrh-nav-lang')[0], {
            target:		getElemByClass('div', '_tdrh-nav-lang-panel')[0],
            switcher:	getElemByClass('p', '_tdrh-nav-lang-opener')[0].getElementsByTagName('a')[0],
            exclude:	getElemByClass('ul', '_tdrh-nav-disney-list')[0]
		});

        var tdrToggleNavCloser = new TdrToggleNav(getElemByClass('div', '_tdrh-nav-lang')[0], {
            target:		getElemByClass('div', '_tdrh-nav-lang-panel')[0],
            switcher:	getElemByClass('p', '_tdrh-nav-lang-closer')[0].getElementsByTagName('a')[0],
            exclude:	getElemByClass('ul', '_tdrh-nav-disney-list')[0]
		});

        var tdrToggleNavSelectBox = new TdrToggleNav(getElemByClass('div', '_tdrh-nav-disney')[0], {
            target:		getElemByClass('ul', '_tdrh-nav-disney-list')[0],
            switcher:	getElemByClass('p', '_tdrh-nav-disney-opener')[0].getElementsByTagName('a')[0],
            exclude:	getElemByClass('div', '_tdrh-nav-lang-panel')[0]
		});

		/* Set to Language Panel and Select Box Click Event
		----------------------------------------------------------- */
		tdrToggleNavOpener.init();
		tdrToggleNavCloser.init();
		tdrToggleNavSelectBox.init();

		function conversionStringToNode(str) {
			var context = document;
			var fragment = context.createDocumentFragment();
            var tmp = fragment.appendChild(context.createElement("div"));
            tmp.innerHTML = str;
			return tmp.childNodes[0];
		}

        function getElemByClass(tagName, className){
            var targetElements = [];
            var allTagElements = document.getElementsByTagName(tagName);
            for (var i = 0 , j = 0; i < allTagElements.length; i++) {
                var classNames = allTagElements[i].className.split(' ');
                for(var k = 0; k < classNames.length; k++) {
                    if (classNames[k] == className) {
                        targetElements[j] = allTagElements[i];
                        j++;
                    }
                }
            }
            return targetElements;
        }

        function addClassToElem(obj, className) {
            var classList = [];
            var classNames = '';

            classList.push(obj.className);
            classList.push(className);
            classNames = classList.join(' ');
            obj.className = classNames;
        }
	}
	/* ---------------------------------------------------------------

	   End of TDR Header Structure

	--------------------------------------------------------------- */
}
