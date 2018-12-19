
/**
 * Protect window.console method calls. eg. console is not defined 
 * on IE unless dev tools are open, and IE doesn't define console
 * 
 * @author zhangxiong
 */
(function( window ) {
	
	if ( !window.console ) {
		window.console = {};
	}
	
	// union of Chrome, Firefox, IE and safari console methods
	var methods = ["log", "info", "warn", "error", "debug", "trace", "dir", "group",
	               "groupCollapsed", "groupEnd", "time", "timeEnd", "profile", "profileEnd",
	               "dirxml", "assert", "count", "markTimeline", "timeStamp", "clear"
	             ];
	
	for ( var i = 0; i < methods.length; i++) {
		if ( !window.console[ methods[i] ]) {
			window.console[ methods[i] ] = function() {
				// var args = Array.prototype.splice.call(arguments, 0, arguments.length);
				// alert( args.join(',') );
			};
		}
	}
	
	window.log = window.log || window.console;
	
	// if jQuery is defined, bind to jQuery
	if ( window.jQuery ) {
		jQuery.log = window.console;
	}
	
	/**
	$.log = function() {
		if (console && console.debug) {
			var args = Array.prototype.splice.call(arguments, 0, arguments.length);
			
			console.debug.apply(console, args);
		}
	};
	*/
})(window);