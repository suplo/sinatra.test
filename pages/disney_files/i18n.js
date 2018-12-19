/**
 * JSで言語を取得する
 * 
 * @date 2013-07-01
 * @author zhangxiong
 * @dependence log.js
 */
(function( window ) {
	
	var JS_PARAMTERS = (function( w, d ) {
		var scr = d.getElementsByTagName( 'SCRIPT' ),
			url = scr[ scr.length - 1 ].src,
			paramterStr = undefined, paramter = {};
		
		if ( url.indexOf('?') != -1 ) {
			paramterStr = url.substring( url.lastIndexOf('?') + 1 );
		}
		
		if (paramterStr) {
			var t = paramterStr.split( '&' );
			
			for ( var i = 0; i < t.length; i++) {
				var kv = t[i].split( '=' ), k = kv[0] || '', v = kv[1] || '';
				paramter[k] = v;
			}
		}
		
		return paramter;
	})(window, document);
	
	
	window.i18n = {
			languages : ['ja', 'en'],
			lang      : JS_PARAMTERS['isJP'] === 'true' ? 'ja' : 'en',
			isJP      : function() {
				return window.i18n.lang === 'ja';
			},
			isEN      : function() {
				return window.i18n.lang === 'en';
			},
	
			format: function() {
				
				var length = arguments.length;
				
				if (length == 0)
					return "";
				else if (length == 1)
					return arguments[0];
				
				var argsLen = length - 1;
				
				// replace {[0-9]+} variable to actual value
				var buffer = [], key = arguments[0], variableSymbol = false, syntaxErr = false, offset = 0;
				for (var i = 0; i < key.length; i++) {
					var char = key[i];
					
					if (char == '}' && !variableSymbol) {
						syntaxErr = true;
					}
					// catch a available variable
					else if (char == '}' && variableSymbol) {
						var index = parseInt(key.substring(i - offset + 1, i), 10);
						
						if (index >= argsLen) {
							buffer.push("NULL");
						}
						else {
							buffer.push(arguments[index + 1]);
						}
						
						variableSymbol = false;
						offset = 0;
					}
					else if (char == '{' && variableSymbol) {
						syntaxErr = true;
					}
					// variable start
					else if (char == '{' && !variableSymbol) {
						offset++;
						variableSymbol = true;
					}
					else if (variableSymbol) {
						offset++;
					}
					else {
						buffer.push(char);
					}
					
					if (syntaxErr)
						break;
				}
				
				// missing end '}'
				if (variableSymbol) {
					syntaxErr = true;
				}
				
				return syntaxErr ? key : buffer.join("");
			}

	};
	
	log.info('Page language: ' + i18n.lang );
	
})( window );

