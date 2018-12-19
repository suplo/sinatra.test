/**
 * i18n Message
 *
 * @date 2013-12-20
 * @author zhangxiong
 * @dependence jQuery
 * @dependence log.js
 * @dependence i18n.js
 */
(function( $ ) {

	"use strict";


	// ==============================================================================
	// 多言語 メッセージ定義
	// ==============================================================================

	var Map = {

		'ja' : {

			// ------------------- 共通メッセージ (commons_ja_JP.properties) ------------
			'errors.required' : '{0}は必須です。',
			'errors.required.date' : '{0}を入力してください。',
			'errors.invalid' : '{0}は正しくありません。',
			'errors.invalidData' : '{0}が{1}ではありません。',
			'errors.invalidInput' : '{0}の入力内容が正しくありません。',
			'errors.maxlength' : '{0}の長さが最大値({1})を超えています。',
			'errors.maxlength1' : '{0}の長さは必ず{1}～{2}の間に',
			'error.time.compare' : '{0}の開始日には終了日よりも前の日を指定してください。',
			'errors.noData' : '該当データがありません。',
			'message.updateConfirm' : '更新してよろしいですか?',
			'message.createConfirm' : '登録は完了です。',
			'errors.number.invalid' : '{0}は数字で入力してください。',
			'done.success' : '完了しました',
			'empty.data.enter' : '{0}を必ずご入力下さい。',
			'empty.data.select' : '{0}を選択してください。',
			'invalid.charset' : '{0}が不正です。',
			'delete.confirm' : '削除してよろしいですか?',
			'delete.success' : '削除完了しました',
			'delete.failed' : '削除失敗しました',
			'errors.totalNum.over' : '一度にご予約いただける人数は合計8名様までです。8名様以内の人数を入力してください。',
			'errors.totalWheelAndStretcher.over' : 'ストレッチャー利用台数及び、車イスでのテーブル利用希望台数の合計がご利用人数を超えています。ご利用人数以内の人数をご入力ください。',
			'errors.child.age.under3' : '幼児（3才以下）のみのご予約は受け付けておりません。',
			'js.popupMessage.confirmation' : 'ご確認ください',
			'js.popupMessage.close' : '閉じる',
			'common.room' : '部屋',
			'common.beduse' : 'ベッド',
			'common.bedshare' : '添い寝',

			// ------------------- メッセージ (src/main/i18n/jp/tdr/ec/web/package_ja_JP.properties) ------------
			'calendar.validate.err.outof.range' : '指定された日付は期間外です。',
			'calendar.validate.err.publish.holidays' : '該当日付は祝日なので、他のご選んでください。',
			'calendar.validate.err.unavailable.dates' : '該当日付は休日なので、他のご選んでください。',
			'calendar.validate.err.starlightpassport.dates' : '該当日付はスターライトなので、他のご選んでください。',
			'calendar.validate.err.after6passport.dates' : '該当日付はアフター6なので、他のご選んでください。',
			'calendar.js.cache.notfound' : 'エラーが発生しました。再度検索ボタンをクリックしてください。',

			'fcw.favorite.json.convert.error' : 'パラメータ「{0}」はフォーマットが不正です',
			'fcw.favorite.add.success' : '検討リストに追加しました',
			'fcw.favorite.update.success' : '条件を変更しました',
			'fcw.favorite.delete.required' : '削除したい検討リストを選択してください',

			//----------------------- お子様情報 --------------------------------------
			'rooms.num' : '{0}部屋',
			'people.num' : ['1人目：','2人目：','3人目：','4人目：','5人目：','6人目：','7人目：','8人目：','9人目：','10人目：','11人目：','12人目：','13人目：','14人目：','15人目：'],
			'child.message' : '子どもの年齢<span class="cautionText">[必須]</span>',
			'child.Bedshare' : ' 添い寝',
			'child.age.12' : '中学生以上のお子様はベッド利用となります',
			'child.age.below3' : '3才以下のお子様は添い寝利用となります',
			'child.age.below1' : '0才のお子様は添い寝利用となります',
			'child.validation.error' : 'お子様の年齢を選択してください。',
			'child.beduse.error' : 'ベッド利用区分内容が正しくありません。',
			'child.bedshare.over' : '添い寝希望のお子様の人数を、ベッド利用人数より多く設定することはできません。',

			//----------------ログイン メッセージ-----------------------------
			'login.user.id.is.not.null' : 'ユーザーIDは必須です',
			'login.user.id.leng.check' : 'ユーザーIDは4～64文字で入力してください',
			'login.user.id.length.limit' : 'ユーザーIDは半角英数記号、64文字以下で入力してください',
			'login.user.id.is.alphNums.check' : 'ユーザーIDは半角英数記号で入力してください',
			'login.connection.error' : 'エラーが発生しました。もう一度お手続きを行ってください。',
			'login.resolveMase.success' : 'メールを送信しました。',
			'login.resolveMase.error' : 'エラーが発生しました。',
			'closeBtn' : '<p class=\"loginClose01\"><a href=\"javascript:void(0);\"><img src=\"/cgp/images/jp/pc/btn/btn_close_03.png\" width=\"56\" height=\"60\" alt=\"閉じる\" class=\"roll\"></a></p>',
			'hotelCloseBtn' : '<p class=\"close01\">\n  <a href=\"javascript:void(0);\">\n    <img src=\"/cgp/images/jp/pc/btn/btn_close_03.png\" width=\"56\" height=\"60\" alt=\"閉じる\" class=\"roll\">\n  </a>\n</p>',
			'bottomCloseBtn' : '<p class=\"close02\">\n  <a href=\"javascript:void(0);\">\n    <img src=\"/cgp/images/jp/pc/btn/btn_close_04.png\" width=\"99\" height=\"44\" alt=\"閉じる\" class=\"roll\">\n  </a>\n</p>',

			//----------------FAH_予約・購入履歴 メッセージ-----------------------------
			'product.is.not.selected' : '商品を少なくとも1つ選択してください。',

			//----------------FIQ_予約情報照会 メッセージ-----------------------------
			'mail.list.open' : 'メール送信履歴を開く',
			'mail.list.close' : 'メール送信履歴を閉じる',

			//------------------favorite----------------
			'favorite.use.date.is.not.null' : '宿泊日は必須です。',

			// 検索条件選択
			'common.search.cond.select.none': '指定なし',
			'common.search.cond.room.moreThanAdult' : '部屋数を大人人数以内でご入力ください。',
			'common.search.cond.night.error' : '泊数の入力内容が正しくありません。',
			'common.search.cond.adult.error' : '大人人数の入力内容が正しくありません。',
			'common.search.cond.room.error' : '部屋数の入力内容が正しくありません。',
			'common.search.cond.child.error' : '子供人数の入力内容が正しくありません。',

			'vp.search.child.attention': 'オフィシャルホテル、パートナーホテル宿泊希望の場合は４才以上のお子様は「ベッド利用」をお選びください。',

			'favorite.empty.icon':'空室のみ',
			'favorite.empty.wording':'空き有りのみ',
			'favorite.all.icon':'すべて',

			'favorite.list':'Favorite.List',

			// 予約特典関係
			'privilege.title1'			: '当予約をキャンセルする事で、<br>以下の宿泊予約特典もキャンセルされます。<br>キャンセルしてもよろしいですか？',
			'privilege.sp.title1'			: '当予約をキャンセルする事で、以下の宿泊予約特典もキャンセルされます。<br>キャンセルしてもよろしいですか？',
			'privilege.title2'			: '当予約をキャンセルするには、<br>以下のように宿泊予約特典を変更する必要があります。',
			'privilege.type'			: '種別',
			'privilege.date'			: '日程',
			'privilege.cancelBefore'	: 'キャンセル前人数',
			'privilege.cancelAfter'		: 'キャンセル後人数',
			'privilege.yes'				: 'はい',
			'privilege.no'				: 'いいえ',
			'privilege.confirmation'	: '確認しました',
			'privilege.error'			: '予約キャンセル可否チェックでエラーが発生しました。',

			//DID対応
			'lackOfProfile.error'		: 'お客様のユーザー情報が不足しているため、新規予約、変更、キャンセルができません。恐れ入りますが、ユーザー情報を更新してください。',
			'under13.error'				: '2015年2月5日より13才未満の方は本サイトでの予約・購入をすることができなくなりました誠に申し訳ありません。',
      //Online Gift
      'onlinegift.title':'オンラインギフト',
      'onlinegift.message.limit.over' : '選択可能なメッセージは{0}件までとなります。',

      //Mobile e-ticket
      'eTicket.limit.over':'選択可能なチケットは10枚までとなります。',

		},

		'en' : {

			// ------------------- 共通メッセージ (commons_en_US.properties) ------------
			'errors.required' : 'Please enter your {0}.',
			'errors.required.date' : 'Please enter your {0}.',
			'errors.invalid' : '{0} is error',
			'errors.invalidData' : '{0} must be {1}',
			'errors.invalidInput' : '{0} is not correct',
			'errors.maxlength' : 'The {0} max length is ({1})',
			'errors.maxlength1' : 'the length of {0} must be between {1} and {2}',
			'error.time.compare' : 'Please specify a {0} earlier than the end date to the start date',
			'errors.noData' : 'No data',
			'message.updateConfirm' : 'Are you sure you want to update',
			'message.createConfirm' : 'Registration is complete',
			'errors.number.invalid' : '{0} must is a numbers',
			'done.success' : 'complete',
			'empty.data.enter' : 'Please enter the {0}',
			'empty.data.select' : 'Please enter the {0}',
			'invalid.charset' : '{0} you entered is not valid.',
			'delete.confirm' : 'Are you sure you want to delete?',
			'delete.success' : 'Delete completion',
			'delete.failed' : 'Delete failed',
			'js.popupMessage.confirmation' : 'Confirmation',
			'js.popupMessage.close' : 'Close',
			'common.room' : 'room',
			'common.beduse' : 'Bed',
			'common.bedshare' : 'Bedshare',

			// ------------------- メッセージ (src/main/i18n/jp/tdr/ec/web/package_en_US.properties) ------------
			'calendar.validate.err.outof.range' : 'Date specified is out of the period',
			'calendar.validate.err.publish.holidays' : 'The day is public holiday, please choose others',
			'calendar.validate.err.unavailable.dates' : 'The day is holiday, please choose others',
			'calendar.validate.err.starlightpassport.dates' : 'The day is star-light passport , please choose others',
			'calendar.validate.err.after6passport.dates' : 'The day is after-6-passport, please choose others',
			'calendar.js.cache.notfound' : 'An error has occrurred, please try again.',

			'fcw.favorite.json.convert.error' : "Paramter「{0}」's format is invalid",
			'fcw.favorite.add.success' : 'Added to Checklist',
			'fcw.favorite.update.success' : 'Checklist update success',
			'fcw.favorite.delete.required' : 'Please select a checklist that you want to delete',

			//----------------------- お子様情報 --------------------------------------
			'rooms.num' : '{0}',
			//'people.num' : ['First:','Second:','Third:','Fourth:','Fifth:','Sixth:','Seventh:','Eighth:','Ninth:','Tenth:','Eleventh:','Twelfth:','Thirteenth:','Fourteenth:','Fifteenth:'],
			'people.num' : ['Child 1:','Child 2:','Child 3:','Child 4:','Child 5:','Child 6:','Child 7:','Child 8:','Child 9:','Child 10:','Child 11:','Child 12:','Child 13:','Child 14:','Child 15:'],
			'child.message' : 'Child Information<span class="cautionText">*</span>',
			'child.Bedshare' : ' Bedshare',
			'child.age.12' : 'Bedshare unavailable for secondary school-age child',
			'child.age.below3' : 'Bedshare only for children ages 3 or under',
			'child.age.below1' : 'Infants before age one will be counted as bedshare',
			'child.validation.error' : 'The age of children is required.',
			'child.beduse.error' : 'There\'s error in bed use option of child.',
			'child.bedshare.over' : 'The number of bedsharing children cannot exceed the number of people using beds.',

			//----------------ログイン メッセージ-----------------------------
			'login.user.id.is.not.null' : 'Please enter your user ID.',
			'login.user.id.leng.check' : 'Your user ID must be at least 4 characters.',
			'login.user.id.length.limit' : 'Your user ID must be at most 64 characters.',
			'login.user.id.is.alphNums.check' : 'Please use letters and numbers only when inputting your user ID.',
			'login.connection.error' : 'An error occurred. Please try again.',
			'login.resolveMase.success' : 'We have sent you a confirmation email.',
			'login.resolveMase.error' : 'An error has occrurred.',
			'closeBtn' : '<p class=\"loginClose01\"><a href=\"javascript:void(0);\"><img src=\"/cgp/images/en/pc/btn/btn_close_03.png\" width=\"56\" height=\"60\" alt=\"Close\" class=\"roll\"></a></p>',
			'hotelCloseBtn' : '<p class=\"close01\">\n  <a href=\"javascript:void(0);\">\n    <img src=\"/cgp/images/en/pc/btn/btn_close_03.png\" width=\"56\" height=\"60\" alt=\"close\" class=\"roll\">\n  </a>\n</p>',
			'bottomCloseBtn' : '<p class=\"close02\">\n  <a href=\"javascript:void(0);\">\n    <img src=\"/cgp/images/en/pc/btn/btn_close_04.png\" width=\"99\" height=\"44\" alt=\"close\" class=\"roll\">\n  </a>\n</p>',

			//----------------FAH_予約・購入履歴 メッセージ-----------------------------
			'product.is.not.selected' : 'Please select at least one product',

			//----------------FIQ_予約情報照会 メッセージ-----------------------------
			'mail.list.open' : 'Open',
			'mail.list.close' : 'Close',

			//------------------favorite----------------
			'favorite.use.date.is.not.null' : 'Please enter your Use Date.',

			// 検索条件選択
			'common.search.cond.select.none': 'None',
			'common.search.cond.room.moreThanAdult' : 'The number of rooms should not exceed the number of adults staying.',
			'common.search.cond.night.error' : 'No. of nights is not correct.',
			'common.search.cond.adult.error' : 'No. of adults (18+) is not correct.',
			'common.search.cond.room.error' : 'No. of rooms is not correct.',
			'common.search.cond.child.error' : 'No. of children is not correct.',

			'favorite.empty.icon':'Available Only',
			'favorite.empty.wording':'Available Only',
			'favorite.all.icon':'Total',
			
			'favorite.list':'Favorite.List',

			// 予約特典関係
			'privilege.title1'        : 'By canceling the reservation,<br>these Online Reservation Privileges will be canceled as well.<br>Is this OK?',
			'privilege.sp.title1'     : 'By canceling the reservation, these Online Reservation Privileges will be canceled as well.<br>Is this OK?',
			'privilege.title2'        : 'To cancel this reservation,<br>you must change Online Reservation Privileges as follows.',
			'privilege.type'          : 'Type',
			'privilege.date'          : 'Date',
			'privilege.cancelBefore'  : 'Number of Persons (Before you cancel)',
			'privilege.cancelAfter'   : 'Number of Persons (After you cancel)',
			'privilege.yes'           : 'Yes',
			'privilege.no'            : 'No',
			'privilege.confirmation'  : 'Confirm',
			'privilege.error'         : 'The canceling reservation availability check error has occurred.',

			//DID対応
			'lackOfProfile.error'     : 'Additional user information is required to make, change or cancel your reservation. Please update your information.',
			'under13.error'           : 'As of February 5, 2015, you must be age 13 or older to make reservations and purchases on this site. We regret any inconvenience this may have caused you.',
			//Online Gift
			'onlinegift.title'        :'Disney Online Gift'
		}
	};

	// ==============================================================================
	// 多言語取得の関数
	// ==============================================================================

	/**
	 * 多言語メッセージを取得する
	 *
	 * Usage:
	 * $.i18nMessage('errors.maxlength')
	 * $.i18nMessage('errors.maxlength', [], 'en')
	 * $.i18nMessage('errors.maxlength', ['userId', '10'])
	 * $.i18nMessage('errors.maxlength', ['userId', '10'], 'en')
	 * $.i18nMessage('errors.maxlength', ['userId', '10'], 'ja')
	 *
	 * @param key  {String} i18n key
	 * @param args {Array}  Message arguments
	 * @param lang {String} ja / en
	 */
	$.i18nMessage = function( key, args, lang ) {
		if ( !key ) {
			return '';
		}

		lang = lang || window.i18n.lang;

		var value = Map[lang][key], _args = args || [];

		if ( !value ) {
			return '';
		}

		for (var i = 0; i < _args.length; i++) {
			value = value.replace( new RegExp('\\{' + i + '\\}', 'g'), _args[i]);
		}

		return value;
	};

})(jQuery);