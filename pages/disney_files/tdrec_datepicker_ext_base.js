/**
 * 共通のカレンダー 
 * 
 * @date 2013-06-04
 * @author zhangxiong
 * @dependence jQuery
 * @dependence jquery.ui.datepicker.min.js
 * @dependence jquery.tdrec.common.js
 * @dependence date.js
 * @dependence log.js
 * @dependence i18n.js
 * @dependence i18nMessage.js
 * @dependence jquery.sleep.js
 */
(function( $ ) {

	"use strict";

	// グローバル関数
	$.tdrec_datepicker_ext = {

		_datepicker_dateFormat : i18n.isEN() ? 'M/d/yy' : 'yy/m/d',
		_dateFormatString      : 'yyyy/M/d',
						
			
		// 休日、祝日取得するパラメータ
		getDaysAjaxOptions : {
			'url'      : '', // ajaxリクエストURL
			'isMobile' : false // 端末判断用
		},

		/**
		 * パラメータ拡張
		 * 
		 * @param opt
		 * 		{Object} 拡張項目
		 */
		extendDaysAjaxOptions : function( opt ) {
			$.extend($.tdrec_datepicker_ext.getDaysAjaxOptions, opt);
			log.info('datepicker config:', $.tdrec_datepicker_ext.getDaysAjaxOptions);
		},

		/**
		 * 祝日や休日など情報をキャッシュする
		 * 
		 * @param target
		 * 		{jQuery} the object bind the data
		 * @param datas
		 * 		{Object} データ
		 * @return {jQuery}
		 */
		setDaysCache : function( target, datas ) {
			if ( $.tdrec_datepicker_ext.getDaysAjaxOptions.isMobile === false ) {
				log.debug($(target), ' will set new cache: ', datas);
				return $(target).data('daysCache', datas);
			} 
			else {
				log.debug($(target) + ' will set new cache: ' + datas);
				return $(target).jqmData('daysCache', datas);
			}
		},
		
		/**
		 * キャッシュされた祝日や休日など情報を取得する
		 * 
		 * @param target
		 * 		{jQuery} the object
		 */
		getDaysCache : function( target ) {
			return $.tdrec_datepicker_ext.getDaysAjaxOptions.isMobile ? 
					$(target).jqmData('daysCache') : $(target).data('daysCache');
		},

		/**
		 * キャッシュしたデータをクリアする
		 * 
		 * @param target
		 * 		{jQuery}
		 * @return {jQuery}
		 */
		cleanDaysCache : function( target ) {
			if ( $.tdrec_datepicker_ext.getDaysAjaxOptions.isMobile === false ) {
				log.debug(target, ' clean cache');
				return target.removeData('daysCache');
			}
			else {
				log.debug(target + ' clean cache');
				return target.jqmRemoveData('daysCache');
			}
		},

		/**
		 * trueの場合キャッシュしない
		 * 
		 * @param target
		 * 		{jQuery}
		 * @returns {Boolean}
		 */
		hasNoDaysData : function( target ) {
			return $.tdrec_datepicker_ext.getDaysAjaxOptions.isMobile ? 
					!target.jqmData('daysCache') : !target.data('daysCache');
		},

		/**
		 * 祝日と休日情報をajaxで取得
		 * 
		 * @param target {jQuery}
		 * @param from   {Date} 予約開始時間
		 * @param to     {Date} 予約終了時間
		 * @param isMatchStarLightPassportDates {Boolean} スターライトの配列からマッチするフラグ
		 * @param isMatchAfter6PassportDates    {Boolean} アフター6の配列からマッチするフラグ
		 * @param async  {boolean} 同期/非同期
		 */
		getDaysWithAjax : function( target, from, to, isMatchStarLightPassportDates, isMatchAfter6PassportDates, async ) {

			// alias
			var $TDE = $.tdrec_datepicker_ext, ajaxOptions = $TDE.getDaysAjaxOptions;

			// ajax URLチェック
			if ( $.trim(ajaxOptions['url']).length === 0 ) {
				throw 'please set options, ex: \r $.tdrec_datepicker_ext.extendDaysOptions({ \r'
						+ '\t url : "path to url" \r' + '});';
			}

			// 祝日と休日情報をajaxで取得
			$.lifeobs.ajax($.extend({
				url : '',
				type : 'POST',
				async : async || false,
				cache : false,
				dataType : 'json',
				data : {
					'targetDateFrom'                : $.datepicker.formatDate('yymmdd', from),
					'targetDateTo'                  : $.datepicker.formatDate('yymmdd', to),
					'isMatchStarLightPassportDates' : isMatchStarLightPassportDates,
					'isMatchAfter6PassportDates'    : isMatchAfter6PassportDates
				}
			}, ajaxOptions)

			).fail(function( jqXHR, textStatus, errorThrown ) {
				var msg = 'FCW003_共通カレンダーサーバーへ通信エラー';
				//alert(msg);
				log.error(target, ' \n', msg + ': ' + textStatus);

			}).done(function( data, textStatus, jqXHR ) {
				if ( data.error ) {
					// alert(data.error);
					log.error(target, ' \n：' + data.error);
					return;
				}

				// カレンダー情報 {"useDate":"20131103","holidayDiv":"1","holidayName":"文化の日"}
				$TDE.setDaysCache(target, data);
				
				// データがキャッシュされた後にreadonlyを削除する
				target.removeAttr('readonly');
			});
		},

		/**
		 * Date or Object to convert to Date, throw exception if date is invalid
		 * 
		 * @param date
		 * 		Date: a new Date Object: 今日から日付のオフセット。 例：{ days:5, months:1, years:-1 }
		 * @returns {Date}
		 */
		parseDate : function( date ) {
			if ( $.tdrec_datepicker_ext.isValidateDate(date) ) {
				return $.type(date) === 'date' ? date : Date.today().add(date);
			}
			else {
				throw date + ' is only object or date object';
			}
		},

		/**
		 * Falseの場合は無効となる
		 * 
		 * @param date
		 * 		Date: a new Date Object: 今日から日付のオフセット。 例：{ days:5, months:1, years:-1 }
		 * @returns {Boolean}
		 */
		isValidateDate : function( date ) {
			return date && ($.type(date) === 'date' || $.type(date) === 'object');
		},

		/**
		 * find the date in array
		 * 
		 * @param date
		 * 		{Date} a date
		 * @param data
		 * 		{Array} data array
		 * @returns {Object}
		 */
		getDayInArray : function( date, datas ) {
			// See docs: http://api.jqueryui.com/datepicker/#option-dateFormat
			// "yy-mm-dd" -> "20070126"
			var dmy = $.datepicker.formatDate('yymmdd', date);

			for ( var i = 0; i < datas.length; i++) {
				if ( datas[ i ]['useDate'] === dmy ) {
					return datas[ i ];
				}
			}
		},
		
		
		/**
		 * validate datepicker input
		 * 
		 * @param ele {jQuery}
		 * @param failedCallback {function} バリデーションがエラーの場合が呼び出される
		 * @returns {Boolean}
		 */
		validateInput : function( ele, failedCallback ) {
			if ( !ele ) {
				throw 'The method [validateInputFormat], argument [ele] is required';
			}
			
			if ( !failedCallback ) {
				throw 'The method [validateInputFormat], argument [failedCallback] is required';
			}

			// エラーメッセージ
			var 
				ERR_LENGTH_ZERO            = $.i18nMessage('errors.required.date', (i18n.isJP() ? ['日程'] : ['Date'])),
				ERR_DATE_FORMATE           = $.i18nMessage('errors.invalid', (i18n.isJP() ? ['日程'] : ['Date'])),
				ERR_CACHED_NOTFOUND        = $.i18nMessage('calendar.js.cache.notfound'),
				ERR_OUTOF_RANGE            = $.i18nMessage('calendar.validate.err.outof.range'), 
				//ERR_PUBLICHOLIDAYS         = $.i18nMessage('calendar.validate.err.publish.holidays'),
				ERR_UNAVAILABLEDATES       = $.i18nMessage('calendar.validate.err.unavailable.dates'),
				ERR_STARLIGHTPASSPORTDATES = $.i18nMessage('calendar.validate.err.starlightpassport.dates'),
				ERR_AFTER6PASSPORTDATES    = $.i18nMessage('calendar.validate.err.after6passport.dates'),
				
				v = ele.val();

			// 必須性チェック
			if ( $.trim(v).length === 0 ) {
				failedCallback.call(ele, ERR_LENGTH_ZERO);
				return false;
			}
			
			var dateRegex = i18n.isEN() ? /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\/(\d{1,2})\/(\d{4})$/ : /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/;
			var matches = dateRegex.exec( v );

			// フォーマットチェック1
			if ( !matches ) {
				failedCallback.call(ele, ERR_DATE_FORMATE);
				return false;
			}

			var y_ = i18n.isEN() ? parseInt( matches[3], 10 ) : parseInt( matches[1], 10 ),
					m_ = i18n.isEN() ? matches[1] : parseInt( matches[2], 10 ) - 1,
					d_ = i18n.isEN() ? parseInt( matches[2], 10 ) : parseInt( matches[3], 10 );

			if (i18n.isEN()) {
				switch (m_) {
				case 'Jan':m_=0;break;
				case 'Feb':m_=1;break;
				case 'Mar':m_=2;break;
				case 'Apr':m_=3;break;
				case 'May':m_=4;break;
				case 'Jun':m_=5;break;
				case 'Jul':m_=6;break;
				case 'Aug':m_=7;break;
				case 'Sep':m_=8;break;
				case 'Oct':m_=9;break;
				case 'Nov':m_=10;break;
				case 'Dec':m_=11;break;
				default:m_=12;
				}
			}
			var composedDate = new Date(y_, m_, d_);

			// フォーマットチェック2
			if ( composedDate.getMonth() !== m_ || composedDate.getDate() !== d_ || composedDate.getFullYear() !== y_ ) {
				failedCallback.call(ele, ERR_DATE_FORMATE);
				return false;
			}
			
			
			var $TDE = $.tdrec_datepicker_ext, cachedDays = $TDE.getDaysCache( ele ), depth = 50,
				minDate = ele.datepicker( "option", "minDate" ),
				maxDate = ele.datepicker( "option", "maxDate" );
				
			// キャッシュしたデータがない場合
			if ( !cachedDays ) {
				
				// wait 1 seconds
				$.wait(1000);
				
				var retry = 0;
				
				do {
					// retry
					cachedDays = $TDE.getDaysCache( ele );
					
					if (cachedDays) break;
					
					retry++;
				} while ( retry < depth );
				
				if ( !cachedDays ) {
					failedCallback.call(ele, ERR_CACHED_NOTFOUND);
					return false;
				}
			}
			// データは指定した範囲が以外の場合
			else if ( composedDate.between(minDate, maxDate) === false ) {
				failedCallback.call(ele, ERR_OUTOF_RANGE);
				return false;
			}
			else {
				var cacheObj = null;
				
				// 休園日
				if ( ele.datepicker( "option", "isMatchUnavailableDates" ) === true ) {
					cacheObj = $TDE.getDayInArray(composedDate, $TDE.getDaysCache(ele)['unavailableDates']);
					
					if ( cacheObj ) {
						failedCallback.call(ele, ERR_UNAVAILABLEDATES);
						return false;
					}
				}
				
				// スターライト配列
				if ( ele.datepicker( "option", "isMatchStarLightPassportDates" ) === true ) {
					cacheObj = $TDE.getDayInArray(composedDate, $TDE.getDaysCache(ele)['starLightPassportDates']);
					
					if ( cacheObj ) {
						failedCallback.call(ele, ERR_STARLIGHTPASSPORTDATES);
						return false;
					}
				}
				
				// アフター6配列
				if ( ele.datepicker( "option", "isMatchAfter6PassportDates" ) === true ) {
					cacheObj = $TDE.getDayInArray(composedDate, $TDE.getDaysCache(ele)['after6PassportDates']);
					
					if ( cacheObj ) {
						failedCallback.call(ele, ERR_AFTER6PASSPORTDATES);
						return false;
					}
				}
				
				// 祝日 TODO 祝日は選べる
				/*
				if ( ele.datepicker( "option", "isMatchPublicHolidays" ) === true ) {
					cacheObj = $TDE.getDayInArray(composedDate, $TDE.getDaysCache(ele)['publicHolidays']);
					
					if ( cacheObj ) {
						failedCallback.call(ele, ERR_PUBLICHOLIDAYS);
						return false;
					}
				}
				*/
			}
			
			return true;
		}
	};

})(jQuery);