/**
 * 日付共通JS関数
 * 
 * @date 2013-10-16
 * @author zhangxiong
 */
(function() {

	/**
	 * 曜日を取得
	 * 
	 * @param useDate {Date} 日付
	 * @returns {String} 曜日
	 */
	var getWeekOfDateFn_ = function getWeekOfDate( useDate ) {

		if (i18n.isJP()) {
			var day = useDate.getDay(),

			w = [ '(日)', '(月)', '(火)', '(水)', '(木)', '(金)', '(土)' ];
		
		} else {
			var day = useDate.getDay(),
			
			w = [ '(Sun)', '(Mon)', '(Tue)', '(Wed)', '(Thu)', '(Fri)', '(Sat)' ];
		}

		return w[ day ];
	};
	
	window['getWeekOfDate'] = getWeekOfDateFn_;

})();
