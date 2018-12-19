/**
 * ajax request, check login status (dependency Apache shiro security)
 * 
 * dependency(jQuery　v1.9 or later , jquery.blockUI.js)
 * 
 * @date 2012-09-04
 * @author zhangxiong
 */
(function( window, $) {
	
	/**
	 * if user isn't login, redirect to login url
	 * 
	 */
	function loginInterceptor(data, textStatus, jqXHR, callback) {
		try {
			var json = $.parseJSON(jqXHR.responseText) || {};
			
			// no login, json is respone
			if ( json[ 'isLogin' ] == false ) {
				 window.location.replace( json.failUrl );
				 return;
			}
			// role check fail
			else if ( json[ 'hasRoles' ] == false ) {
				window.location.replace( json.failUrl );
				return;
			}
		} catch (e) {
			// ignore this error
		}
		
		if ( $.isFunction(callback) ) {
			callback.call(this, data, textStatus, jqXHR );
		}
	};
	
	/**
	 *  $.authc.ajax({})
	 */
	$.authc = {
		
		ajax : function( orignSetting ) {
			
			var setting = $.extend({}, orignSetting);
			
			// override success function to be interceptored for login
			if (orignSetting.success) {
				setting.success = function(data, textStatus, jqXHR) {
					//console.log(1);
					loginInterceptor( data, textStatus, jqXHR, orignSetting.success );
				};
			}
			
			// if use jQuery deferred Object(dependency jQuery 1.5 or later)
			return $.ajax(setting)
				.fail(function(jqXHR, textStatus, errorThrown) {
					//$.unblockUI();
					_blockUI('サーバーはエラーが発生したので, もう一度やってください。', 5000);
				})
				.always(function(contextObj, status, jqXHR) {
					//console.log(2);
					loginInterceptor( contextObj, status, jqXHR );
				});
		}
	};
	
	// ajax.lifeobstrucation.jsで使います
	$.authc.ajax._loginInterceptor = loginInterceptor;
	
	/**
	 * ajax blockUI
	 * 
	 */
	var _blockUI = $.authc.ajax['_blockUI'] = function( message, timeout, onUnblock ) {
		$.blockUI({
			css : {
				border : 'none',
				padding : '15px',
				backgroundColor : '#000',
				'-webkit-border-radius' : '10px',
				'-moz-border-radius' : '10px',
				opacity : .5,
				color : '#fff'
			},
			baseZ : 1040,
			message : message || null,
			timeout : timeout || 0,
			onUnblock : onUnblock || null
		});
	};
})( window, jQuery);

