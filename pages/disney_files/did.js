$(function () {
	$.did = {};

	$.did.dialogOpen = function(contents) {
		$.did.dialog = $.tdrec.dialogSmall({
			close: function (e, ui) {
				$.did.dialog.init();
			},
			useCloseButton: true,
			feedInSpeed:100,
			modalOffsetY:150,
			useBottomCloseButton: true,
			removeOnClose: true,
			contents: contents
		})
		$.did.dialog.open();
	};

	$.did.verify = function(url) {
		$("#modalDialog .verifyError").hide();
		$("#modalDialog .verifyError").html("");
		loadImage(function(){
			$.ajax({
				type: "POST",
				url: url,
				dataType: "json",
				success: function (response) {
					if ( response.messageFlg != null && response.messageFlg == true ) {
						$("#modalDialog .verifySuccess").html(context.languageDiv == 1 ? 'メールを再送信しました。<br>ご登録いただいたメールアドレスに届いているメールを開いていただき、ユーザー登録の完了手続きを行ってください。' : 'The email has been sent to you again.<br>Please follow the procedures in the email which we sent to the address you registered to complete your user registration.');
						$("#modalDialog .verifyBtnArea").hide();
						$("#modalDialog .verifySuccess").show();
					} else {
						$("#modalDialog .verifyError").html(response.errorMap.verifyError);
						$("#modalDialog .verifyError").show();
					};
					closeLoadImage();
					$.did.dialog._setHighLayer();
				},
				error: function (XMLHttpRequest) {
					$("#modalDialog .verifyError").html(context.languageDiv == 1 ? 'エラーが発生しました。' : 'An error has occrurred.');
					$("#modalDialog .verifyError").show();
					closeLoadImage();
					$.did.dialog._setHighLayer();
				}
			});
		});
	};

	$.did.resolveMase = function(url) {
		$("#content .resolveMaseError").hide();
		$("#content .resolveMaseError").html("");
		loadImage(function(){
			$.ajax({
				type: "POST",
				url: url,
				data : ({
					userId : $('#content').find(".maseAddress:first").text()
				}),
				dataType: "json",
				success: function (response) {
					if ( response.messageFlg != null && response.messageFlg == true ) {
						$("#content .resolveMaseSuccess").html(context.languageDiv == 1 ? 'メールを送信しました。' : 'We have sent you a confirmation email.');
						$("#content .resolveMaseBtnArea").hide();
						$("#content .resolveMaseSuccess").show();
					} else {
						$("#content .resolveMaseError").html(response.errorMap.resolveMaseError);
						$("#content .resolveMaseError").show();
					};
					closeLoadImage();
				},
				error: function (XMLHttpRequest) {
					$("#content .resolveMaseError").html(context.languageDiv == 1 ? 'エラーが発生しました。' : 'An error has occrurred.');
					$("#content .resolveMaseError").show();
					closeLoadImage();
				}
			});
		});
	};

	if (context.isNeedNoActivationNotification) {
	  notActivatedMessage();
	};

	$(document).on('click', '#modalDialog .verifyBtn', function (e) {
    e.preventDefault();
    $.did.verify((context.languageDiv == 2 ? '/en' : '') + '/fli/verify/');
  });

	$(document).on('click', '#content .resolveMaseBtn', function (e) {
		e.preventDefault();
		$.did.resolveMase((context.languageDiv == 2 ? '/en' : '') + '/fli/resolveMase/');
	});
});

function notActivatedMessage(){
  $.did.activationDialogHtml = '<div class="error"><div class="boxModal15"><div class="boxError01an">';
  $.did.activationDialogHtml += context.languageDiv == 1
    ? '<p>メールアドレスの確認ができていません。</p>' +
        '<br>URLがついたメールをご登録のメールアドレス宛にお送りしました。そのURLにアクセスしますとメールアドレスの確認が完了します。<br>' +
        '手続き完了後、右上の[×]でこのメッセージを閉じていただき、ログインを行ってください。<br><br>' +
        'ログインの際は、メールアドレスの確認が必要となります。詳しくは、<a href="https://reserve.tokyodisneyresort.jp/info/detail/1101/" target="_blank">こちら</a>'
        : '<p>Your email address has not been confirmed.</p>' +
          '<br>An email with a URL has been sent to your account. Click the link to confirm your email address.<br>' +
          'When you have finished, click {x} to close this window and login.<br><br>' +
          'You must complete the email confirmation to login to this site. For details, click <a href="https://reserve.tokyodisneyresort.jp/en/info/detail/1101/" target="_blank">here.</a>';
//  $.did.activationDialogHtml += '<div class="mailError verifyError" style="display: none;"></div><div class="mailSafe verifySuccess" style="display: none;"></div><div class="mailBtn verifyBtnArea">';
//  $.did.activationDialogHtml += context.languageDiv == 1
//    ? '<p class="close02"><a href="javascript:void(0);"><img width="142" height="32" class="roll js-confirm" src="/cgp/images/jp/pc/btn/btn_agree_01.png" alt="確認した"></a></p>'
//    : '<p class="close02"><a href="javascript:void(0);"><img width="142" height="32" class="roll js-confirm" src="/cgp/images/en/pc/btn/btn_agree_01.png" alt="Confirm"></a></p>';
  $.did.activationDialogHtml += '</div></div></div>';

  $.did.dialogOpen($.did.activationDialogHtml);
};