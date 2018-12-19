$(function() {

	$.widget('tdrec.apiErrorDialog', $.tdrec.dialogSmall, {

		options : $.extend({
			useCloseButton : true, // 上の右クローズボタン
			feedInSpeed : 150, // ダイアログを表示するスピード
			modalOffsetY : 100
		}, {}),

		// コンテンツを設定
		_putContents : function() {
			return this._$modal.append($($.parseHTML(this.options.contents)));
		},

		_generateModalOverlay : function() {
			var $modalOverlay;
			$modalOverlay = $('<div>', {
				id : "apierror_modalOverlay",
				"class" : "modalOverlay"
			});
			if ($('body').find('#apierror_modalOverlay')) {
				$modalOverlay.appendTo('body');
			}
			return $modalOverlay;
		},

		_generateModal : function() {
			return $('<div>', {
				id : "apierror_modalDialog",
				"class" : this.options._className
			});
		}

	});

});

/**
 * APIでエラーが発生した場合、エラーメッセージのオーバーレイ表示
 *
 * @param msg
 */
function apiErrorDialog(msg){

	// ダイアログの生成
	api_dialog_br = $.tdrec.apiErrorDialog({
			useCloseButton : true,
			feedInSpeed : 100,
			contents :$('#apiErrorCaution').html(),
			close : function() {
				$('#apierror_modalOverlay, #apierror_modalDialog').remove();
			}
		});

	if(msg!=null && msg!=''){
		$(".apiMsgContents").append(msg);
		api_dialog_br.open();
	}

};


/* ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼　一定時間経過後にポップアップ表示をさせ、同画面を再描画させる　▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ */
function reloadSelf(status) {
	//エラーメッセージを表示する
	var $errorbox = $('#apiMsg_modalDialog').find('.errorMsgBox');
	//clean the errors
	$errorbox.contents().remove();

	if (status === 435) {
	  if(i18n.isJP()){
	    $errorbox.append('ご購入の処理に失敗しました。[RRC3005]<br />お手数ですが再度ご購入をお願い致します。');
	  } else {
	    $errorbox.append("Your booking has not been processed. [RRC3005] <br/>We're sorry, but please return to the Reservation/Purchasing Top Page and start again.");
	  }

	} else {
	  $errorbox.append('ただいまサーバが混み合っております。<br />しばらく時間を置いてから、再度ご購入をお願い致します。');
	}


	$.tdrec.dialogSmall({
		useCloseButton : true,
		feedInSpeed : 100,
		contents :$('#apiMsg_modalDialog').html()
	}).open();
	// 5秒後に自画面遷移
	setTimeout(function() {
		window.location.replace($('#prev').val());
	}, 5000);
	$('body').on('click', '.dialogClose', function (e) {
		$('#modalOverlay, #modalDialog').remove();
	});
};
