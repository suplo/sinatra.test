/**
 * Add _xhr param before Ajax send request ,  
 * 
 * Ajax request, check 計画閉塞,緊急閉塞,バックエンド閉塞 status.
 * 
 * @date 2013-10-11
 * @author xuelizhong
 * @dependence jQuery 1.9 or later
 * @dependence ajax.authc.js
 */
var defaultTimeout = 360000;
(function( window, $) {
	
	// Using jQuery.ajaxSetup() to accumulate Global data Parameters for Ajax Request
	$.ajaxSetup({
		data : {
			_xhr : ''
		}
	});
	
	
	/**
	 * 閉塞処理
	 * 
	 */
	function lifeObstructionInterceptor(data, textStatus, jqXHR, setting, callback) {
		try {
			var json = $.parseJSON(jqXHR.responseText) || {};
			
			// 閉塞処理, json is respone
			if ( json[ 'isDead' ] == true ) {
				 window.location.replace( json.failUrl );
				 return;
			}
			
			// ログイン必要があれば
			if (setting && setting.checkLogin === true) {
				// ログイン状態を判断する
				$.authc.ajax._loginInterceptor(data, textStatus, jqXHR, undefined);
			}
		} catch (e) {
			// ignore this error
		}
		
		if ( $.isFunction(callback) ) {
			callback.call( this, data, textStatus, jqXHR );
		}
	};
	
	/**
	 *  $.lifeobs.ajax({})
	 */
	$.lifeobs = {
		
		ajax : function( orignSetting ) {
			
			var setting = $.extend({}, orignSetting);
			
			// override success function to be interceptored for lifeobstruction
			if (orignSetting.success) {
				setting.success = function(data, textStatus, jqXHR) {
					//console.log(1);
					lifeObstructionInterceptor( data, textStatus, jqXHR, setting, orignSetting.success );
				};
			}
			if (orignSetting.timeout) {
				setting.timeout = orignSetting.timeout;
			} else {
				setting.timeout = 360000;
			}
			
			// if use jQuery deferred Object(dependency jQuery 1.5 or later)
			return $.ajax(setting)
				.fail(function(jqXHR, textStatus, errorThrown) {
					//$.unblockUI();
				})
				.always(function(contextObj, status, jqXHR) {
					//console.log(2);
					lifeObstructionInterceptor( contextObj, status, jqXHR, setting );
				});
		}
	};
	
	$.lifeobs.ajax._lifeObstructionInterceptor = lifeObstructionInterceptor;
	
	
})( window, jQuery);