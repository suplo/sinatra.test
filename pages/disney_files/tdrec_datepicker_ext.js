/**
 * 共通のカレンダー（FCW003_共通画面_カレンダー）
 * jquery.tdrec.effect.jsのtdrec_datepicker関数拡張
 * 
 * @date 2013-06-04
 * @author zhangxiong
 * @dependence jQuery
 * @dependence jquery-ui-1.10.3.custom.min.js
 * @dependence jquery.ui.datepicker.min.js
 * @dependence jquery.tdrec.common.js
 * @dependence tdrec_datepicker_ext_base.js
 * @dependence date.js
 * @dependence log.js
 * @dependence i18n.js
 */
(function( $ ) {

	"use strict";
	
	// jQueryの拡張
	$.fn.extend({

		/**
		 * jqueryUIのdatePickerを呼び出す
		 * 
		 * @param opt :
		 *            isMatchUnavailableDates (optional)
		 *            	{Boolean} 休日の配列からマッチした日付は選択できない、デフォルト:true 
		 *            isMatchPublicHolidays (optional)
		 *            	{Boolean} 祝日の配列からマッチした日付は赤字にする、デフォルト:true
		 *            isMatchStarLightPassportDates (optional)
		 *            	{Boolean} スターライトの配列からマッチした日付は選択できない、デフォルト:false
		 *            isMatchAfter6PassportDates (optional)
		 *            	{Boolean} アフター6の配列からマッチした日付は選択できない、デフォルト:false
		 *            minDate (必須) カレンダー選択範囲開始日
		 *            	{Date} Date Object
		 * 				{Object} 今日から日付のオフセット。例：{ days:5, months:1, years:-1 }
		 *            maxDate (required) カレンダー選択範囲終了日
		 *            	{Date} Date Object
		 * 				{Object} 今日から日付のオフセット。例：{ days:5, months:1, years:-1 }
		 *            それ以外はjqueryUIのdatepickerと同じ
		 */
		tdrec_datepicker_ext : function( opt ) {
			
			var 
				// alias
				$TDE = $.tdrec_datepicker_ext,
				isMobile = $TDE.getDaysAjaxOptions.isMobile,
				// デフォルトパラメータ
				defaultSettings = {
						isMatchUnavailableDates       : true,
						isMatchPublicHolidays         : true,
						isMatchStarLightPassportDates : false,
						isMatchAfter6PassportDates    : false,
						hasCustomUnavailableDates     : false,
						customUnavailableDates        : [],
						dateFormat                    : $TDE._datepicker_dateFormat,
						dateFormatString              : $TDE._dateFormatString,
						minDate                       : null,
						maxDate                       : null
				},
				// マージ
				settings = $.extend({}, defaultSettings, opt);
			
			// 期間開始日を解析
			settings.minDate = $TDE.parseDate( settings.minDate );
			
			// 期間終了日を解析
			settings.maxDate = $TDE.parseDate( settings.maxDate );

			// 日付キャッシュしなかった場合、再度キャッシュする
			if ( $TDE.hasNoDaysData(this) ) {
				// 祝日と休日情報をajaxで取得
				$TDE.getDaysWithAjax(this, settings.minDate, settings.maxDate, 
						settings.isMatchStarLightPassportDates, settings.isMatchAfter6PassportDates, true);
			}
			
			// SPの場合、カレンダー入力しては行けない
			if ( isMobile ) {
				this.prop('readonly',true).on('keypress keydown focus', function( e ) {
					e.preventDefault();
					//e.stopPropagation();
					//e.stopImmediatePropagation();  // stop jquery bing event
					
					// スマートフォンのキーボードを隠すようにします
					$(this).blur();
					
					return false;
				});
			}
			
			// date format : yyyy/MM/dd, length 10
			this.attr('maxlength', 10).attr('autocomplete', 'off')
			// ignore Enter key Event
			.on('keydown', function( e ) {
				if ( e.which === $.ui.keyCode.ENTER ) {
					e.preventDefault();
					e.stopPropagation();
					e.stopImmediatePropagation();
				}
			})
			// jquery.tdrec.effect.jsのtdrec_datepicker関数を利用
			.tdrec_datepicker( $.extend({
				buttonImage      : "/cgp/images/jp/pc/ico/ico_calender_01.png", // アイコンのパス修正
				buttonText       : i18n.isJP() ? '日付選択' : 'Choose Date',
				hideIfNoPrevNext : true,
				firstDay         : 1,
				constrainInput   : false,
				showOn           : "both",
				numberOfMonths   : isMobile ? 1 : 2,
				buttonImageOnly  : true,
				beforeShow : function( input, inst ) {
					// TODO JQuery datepicker オーバーレイはz-indexが最高になる: #33986
					setTimeout(function(){ 
			            $('.ui-datepicker').css('z-index', 55555); 
			        }, 100);
					
					// alias
					var $this = $(this);
					
					if ( $TDE.hasNoDaysData($this) ) {
						// 祝日と休日情報をajaxで取得
						log.warn('データまだキャッシュしたので、カレンダーを開けできない、同期にajaxで取得する', $this);
						$TDE.getDaysWithAjax($this, settings.minDate, settings.maxDate, 
								settings.isMatchStarLightPassportDates, settings.isMatchAfter6PassportDates, false);
					}
				},
				beforeShowDay : function( date ) {
					var $this = $(this), cachedData;
					
					// 休園日
					if (settings.isMatchUnavailableDates === true) {
						cachedData = $TDE.getDaysCache($this)['unavailableDates'];
						
						if ( $TDE.getDayInArray(date, cachedData) ) {
							return [ false, "unavailable", "休園日" ];
						}
					}
					
					// スターライト配列
					if (settings.isMatchStarLightPassportDates === true) {
						cachedData = $TDE.getDaysCache($this)['starLightPassportDates'];
						
						if ( $TDE.getDayInArray(date, cachedData) ) {
							return [ false, "unavailable", "スターライト日" ];
						}
					}
					
					// アフター6配列
					if (settings.isMatchAfter6PassportDates === true) {
						cachedData = $TDE.getDaysCache($this)['after6PassportDates'];
						
						if ( $TDE.getDayInArray(date, cachedData) ) {
							return [ false, "unavailable", "アフター6の日" ];
						}
					}
					
					// カスタム配列
					if (settings.hasCustomUnavailableDates === true) {
						if ($.inArray(date.getTime(), settings.customUnavailableDates) != -1) {
							return [ false, "unavailable", "予約不可" ];
						}
					}
					
					// 祝日
					if (settings.isMatchPublicHolidays === true) {
						cachedData = $TDE.getDaysCache($this)['publicHolidays'];
						
						var ph = $TDE.getDayInArray(date, cachedData);
						if ( ph ) {
							return [ true, "sun", ph['holidayName'] ];
						}
					}
					
					// 土曜日
					if ( date.getDay() === 6 ) {
						return [ true, "sat" ];
					} 
					
					// 日曜日
					if ( date.getDay() === 0 ) {
						return [ true, "sun" ];
					}

					return [ true, "" ];
				}
			}, settings));
			
			// Set default date
			//$( this ).datepicker( "setDate", new Date());
			
			return this;
		},
		
		/**
		 * カレンダー期間範囲が変わる([from] [,to])
		 * 
		 * @param from 予約開始時間(option)
		 * @param to 予約終了時間(option)
		 * 	Date: Date Object
		 * 	Object: 今日から日付のオフセット。例：{ days:5, months:1, years:-1 }
		 */	
		tdrec_datepicker_ext_setDateRange : function(holidayRefresh, from, to) {
			var 
				// 再度ajaxで日付情報を取得するフラグ
				refresh = false, 
				// alias
				$TDE = $.tdrec_datepicker_ext,
				isMobile = $TDE.getDaysAjaxOptions.isMobile,
				// datepicker setting
				settings = this.data('datepicker').settings;
				
			// setter
			if (from) {
				this.datepicker( "option", "minDate", $TDE.parseDate(from) );
				refresh = true;
			}
			if (to) {
				this.datepicker( "option", "maxDate", $TDE.parseDate(to) );
				refresh = true;
			}
			
			// getter
			var 
				f_ = this.datepicker( "option", "minDate" ),
				t_ = this.datepicker( "option", "maxDate" );
			
			if ( isMobile === true) {
				log.debug( this + 'will set new date range: ' + $.datepicker.formatDate('yymmdd', f_) + ', ' + $.datepicker.formatDate('yymmdd', t_) );
			} else {
				log.debug( this, 'will set new date range: ', $.datepicker.formatDate('yymmdd', f_), ', ', $.datepicker.formatDate('yymmdd', t_) );
			}
			
			if (refresh && holidayRefresh) {
				// キャッシュをクリア
				$TDE.cleanDaysCache(this);
				
				// 祝日と休日情報をajaxで取得
				$TDE.getDaysWithAjax(this, f_, t_, settings.isMatchStarLightPassportDates, settings.isMatchAfter6PassportDates, true);
			}
		},
		
		/**
		 * inputの日付を設定する
		 * 
		 * @param date 日付
		 * 	Date: a new Date
		 * 	Object: 今日から日付のオフセット。 例：{ days:5, months:1, years:-1 }
		 */
		tdrec_datepicker_ext_setInputDate : function(date) {
			var 
				// alias
				$TDE = $.tdrec_datepicker_ext,
				isMobile = $TDE.getDaysAjaxOptions.isMobile,
				// datepicker setting
				settings = this.data('datepicker').settings;
			
			// 休日を選択できないので、キャッシュした休日データは必要がある
			if ( $TDE.hasNoDaysData(this) ) {
				// getter
				var 
					f_ = this.datepicker( "option", "minDate" ),
					t_ = this.datepicker( "option", "maxDate" );
				
				// 祝日と休日情報をajaxで取得（同期）
				$TDE.getDaysWithAjax(this, f_, t_, settings.isMatchStarLightPassportDates, settings.isMatchAfter6PassportDates, false);
			}
			
			// convert to date
			var d = $TDE.parseDate(date),
				dmy = d.toString('yyyyMMdd'),
				tomorrow = new Date(d).add({days : 1}),
				cache = $TDE.getDaysCache(this);
			
			isMobile ? log.debug( this + ' will set date value: ' + dmy) : log.debug( this, ' will set date value: ', dmy);
			
			// 休日
			if ( (settings.isMatchUnavailableDates === true) && $TDE.getDayInArray(d, cache['unavailableDates']) ) {
				// 今呼び出してる関数に再帰する（明日が試す）
				isMobile ? log.info( this + ' ' + dmy + 'は休園日なので、明日が試す' ) : log.info( this, ' ', dmy, 'は休園日なので、明日が試す' );
				
				this.tdrec_datepicker_ext_setInputDate(tomorrow);
				return;
			}
			
			// スターライト
			if ( (settings.isMatchStarLightPassportDates === true) && $TDE.getDayInArray(d, cache['starLightPassportDates']) ) {
				// 今呼び出してる関数に再帰する（明日が試す）
				isMobile ? log.info( this + ' ' + dmy + 'はスターライト日なので、明日が試す' ) : log.info( this, ' ', dmy, 'はスターライト日なので、明日が試す' );
				
				this.tdrec_datepicker_ext_setInputDate(tomorrow);
				return;
			}
			
			// アフター6
			if ( (settings.isMatchAfter6PassportDates === true) && $TDE.getDayInArray(d, cache['after6PassportDates']) ) {
				// 今呼び出してる関数に再帰する（明日が試す）
				isMobile ? log.info( this + ' ' + dmy + 'はアフター6日なので、明日が試す' ) : log.info( this, ' ', dmy, 'はアフター6日なので、明日が試す' );
				
				this.tdrec_datepicker_ext_setInputDate(tomorrow);
				return;
			}
			
			// set date
			this.datepicker( "setDate", d );
		}
	});
})(jQuery);