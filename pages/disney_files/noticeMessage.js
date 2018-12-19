$(function () {
	$.noticeMessage = {};

	$.noticeMessage.isJp = context.languageDiv == 1;

	$.noticeMessage.dialogOpen = function(contents) {
		$.noticeMessage.dialog = $.tdrec.dialogSmall({
			close: function (e, ui) {
				$.noticeMessage.dialog.init();
			},
			useCloseButton: true,
			feedInSpeed:100,
			modalOffsetY:150,
			useBottomCloseButton: true,
			removeOnClose: true,
			contents: contents
		})
		$.noticeMessage.dialog.open();
	};

  $.noticeMessage.check = function(param) {
    var d = $.Deferred();
    // ajax通信によりダイアログメッセージを取得する
    // ダイアログメッセージが存在する場合はダイアログ表示
    loadImage(
      $.ajax({
        type: "POST",
        url: "/common/notice/",
        dataType: "json",
        data : param,
        success : function(message) {
          // ダイアログメッセージが存在する場合はダイアログ表示
          if (message != null) {
            closeLoadImage();
            $.noticeMessage.activationDialogHtml = $.noticeMessage.isJp ?
                '<h2 class="hdgModal01">ご予約の際のご注意</h2>' : '<h2 class="hdgModal01">For Online Bookings</h2>';
            $.noticeMessage.activationDialogHtml += '<div class="boxModal13">#NOTICE-MESSAGE#</div><ul class="listModal02"><div><li class="check listForm02"><input type="checkbox" name="accept" id="accept" class="checkbox js-accept" />';
            $.noticeMessage.activationDialogHtml += $.noticeMessage.isJp ?
                '<label for="accept" class="checkboxLabel">同意する</label>' : '<label for="accept" class="checkboxLabel">Check this box to proceed.</label>';
            $.noticeMessage.activationDialogHtml += '</li></div><br/>';
            $.noticeMessage.activationDialogHtml += $.noticeMessage.isJp ?
                '<li><input type="image" src="/cgp/images/jp/pc/btn/btn_next_04.png" alt="次へ" id="btnNext" class="roll js-confirm"></li>' :
                '<li><input type="image" src="/cgp/images/en/pc/btn/btn_next_04.png" alt="next" id="btnNext" class="roll js-confirm"></li>';
            $.noticeMessage.activationDialogHtml += '</ul>';
            $.noticeMessage.activationDialogHtml = $.noticeMessage.activationDialogHtml.replace('#NOTICE-MESSAGE#', message);
            $.noticeMessage.dialogOpen($.noticeMessage.activationDialogHtml);
            // ボタンの表示制御
            agreeCheckboxCheck('accept', 'btnNext');
            // ポップアップの「はい」が押下されたときの
            $(document).on('click', '.js-confirm', function (e) {
              $.noticeMessage.dialog.close();
              d.resolve();
            }).on('click', '.js-cancel', function (e) {
              $.noticeMessage.dialog.close();
              d.reject();
            }).on('click', '.js-accept', function (e) {
              agreeCheckboxCheck('accept', 'btnNext');
            });
          } else {
            d.resolve();
          }
        },
        error: function (XMLHttpRequest) {
          closeLoadImage();
          d.reject();
        }
      })
    );
    return d.promise();
  };

  // 2017/02/19越えたら不要
  // ショー・バレンタイン・ナイト2017（2017/02/19迄の通知メッセージ）
  $.noticeMessage.checkvd = function(param) {
    var d = $.Deferred();
    // ajax通信によりダイアログメッセージを取得する
    // ダイアログメッセージが存在する場合はダイアログ表示
    loadImage(
      $.ajax({
        type: "POST",
        url: "/common/notice/",
        dataType: "json",
        data : param,
        success : function(message) {
          // ダイアログメッセージが存在する場合はダイアログ表示
          if (message != null) {
            closeLoadImage();
            $.noticeMessage.activationDialogHtml = $.noticeMessage.isJp ?
                '<h2 class="hdgModal01">鑑賞券ご購入前に必ずご確認ください</h2>' : '<h2 class="hdgModal01">EN_鑑賞券ご購入前に必ずご確認ください</h2>';
            $.noticeMessage.activationDialogHtml += '<div class="boxModal13">#NOTICE-MESSAGE#</div><ul class="listModal02"><div><li class="check listForm02"><input type="checkbox" name="accept" id="accept" class="checkbox js-accept" />';
            $.noticeMessage.activationDialogHtml += '</li></div><br/>';
            $.noticeMessage.activationDialogHtml += $.noticeMessage.isJp ?
                '<li><input type="image" src="/cgp/images/jp/pc/btn/btn_agree_01.png" alt="確認した" id="btnNext" class="roll js-confirm"></li>' :
                '<li><input type="image" src="/cgp/images/en/pc/btn/btn_agree_01.png" alt="agree" id="btnNext" class="roll js-confirm"></li>';
            $.noticeMessage.activationDialogHtml += '</ul>';
            $.noticeMessage.activationDialogHtml = $.noticeMessage.activationDialogHtml.replace('#NOTICE-MESSAGE#', message);
            $.noticeMessage.dialogOpen($.noticeMessage.activationDialogHtml);

            // ポップアップの「確認した」が押下されたときの
            $(document).on('click', '.js-confirm', function (e) {
              $.noticeMessage.dialog.close();
              d.resolve();
            });
          } else {
            d.resolve();
          }
        },
        error: function (XMLHttpRequest) {
          closeLoadImage();
          d.reject();
        }
      })
    );
    return d.promise();
  };
  // アクセシブルルーム通知メッセージ
  $.noticeMessage.checkhc = function(param) {
    var d = $.Deferred();
    // ajax通信によりダイアログメッセージを取得する
    // ダイアログメッセージが存在する場合はダイアログ表示
    $.ajax({
      type: "POST",
      url: "/common/notice/",
      dataType: "json",
      data : param,
      success : function(message) {
        // ダイアログメッセージが存在する場合はダイアログ表示
        if (message != null) {
          $.noticeMessage.activationDialogHtml = $.noticeMessage.isJp ?
              '<h2 class="hdgModal01">予約前にお読みください</h2>' : '<h2 class="hdgModal01">Please read below before proceeding.</h2>';
          $.noticeMessage.activationDialogHtml += '<div class="boxModal13">#NOTICE-MESSAGE#</div><ul class="listModal02"><div><li class="check listForm02"><input type="checkbox" name="accept" id="accept" class="checkbox js-accept" />';
          $.noticeMessage.activationDialogHtml += '</li></div><br/>';
          $.noticeMessage.activationDialogHtml += $.noticeMessage.isJp ?
              '<li><input type="image" src="/cgp/images/jp/pc/btn/btn_agree_01.png" alt="確認した" id="btnNext" class="roll js-confirm"></li>' :
              '<li><input type="image" src="/cgp/images/en/pc/btn/btn_agree_01.png" alt="agree" id="btnNext" class="roll js-confirm"></li>';
          $.noticeMessage.activationDialogHtml += '</ul>';
          $.noticeMessage.activationDialogHtml = $.noticeMessage.activationDialogHtml.replace('#NOTICE-MESSAGE#', message);
          $.noticeMessage.dialogOpen($.noticeMessage.activationDialogHtml);

          // ポップアップの「確認した」が押下されたときの
          $(document).on('click', '.js-confirm', function (e) {
            $.noticeMessage.dialog.close();
            d.resolve();
          });
        } else {
          d.resolve();
        }
      },
      error: function (XMLHttpRequest) {
        d.reject();
      }
    });
    return d.promise();
  };
});