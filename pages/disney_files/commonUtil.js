function bindDateInputId(id){
   $("#"+id).datepicker({
	   changeMonth: true,
		changeYear: true,
       dateFormat: 'yy-mm-dd'
   });
};		

function bindDateInputClass(className){
	   $("."+className).datepicker({
		   changeMonth: true,
			changeYear: true,
	       dateFormat: 'yy-mm-dd'
	   });
	};
	
function confirmFormSubmit(formId,url,msg){
	if(confirm(msg) == true){
		formSubmit(formId,url);
	}else{
		return false;
	}
};
function userConfirmFormSubmit(formId,url){
	var msg=$("#msg").val();
	if(confirm(msg) == true){
		formSubmit(formId,url);
	}else{
		return false;
	}
};
function formSubmit(formId,url){
	$("#"+formId).attr("action",url);
	$("#"+formId).submit();
};
function setMsg(){
	if($("#_memberType").attr("checked")){
		$("#msg").val("入力した内容を破棄してよろしいですか。");
	}else{
		$("#msg").val("よろしいですか。");
	}
};

/** 選択したチェックボックスの値を保つ */
function keepChecked(bitVaue){
	
	$('.allCheckBox').each(function() {
		var checkVal = $(this).val();
		
		if ((checkVal & bitValue) == checkVal) {
			$(this).click();
		};
	});
}

/**
 * すべて/空き有りのみ 変換
 * @param value(0:すべて,1:空き有りのみ)
 */
function emptyAllSwitch(value){
	
	// 空き有りのみ
	if(value=="1"){
		var emptyImg = $(".boxSearch02").find('img[class*="empty"]');
		emptyImg.removeAttr("onclick");
		emptyImg.addClass('noRoll');
		emptyImg.removeClass('roll');
		
		var allImg = $(".boxSearch02").find('img[class*="all"]');
		var allImgPath = allImg.attr("src");
		allImg.attr("src",allImgPath.replace("_o",""));
		allImg.removeClass('noRoll');
		allImg.addClass('roll');
	}
	// すべて
	else{
		var emptyImg = $(".boxSearch02").find('img[class*="empty"]');
		var emptyImgPath = emptyImg.attr("src");
		emptyImg.attr("src",emptyImgPath.replace("_o",""));
		emptyImg.removeClass('noRoll');
		emptyImg.addClass('roll');
		
		var allImg = $(".boxSearch02").find('img[class*="all"]');
		allImg.removeAttr("onclick");
		allImg.addClass('noRoll');
		allImg.removeClass('roll');
	}
}

/**
 * 同意するクリック
 */
function checkConfirm(){
	
	var $confirmImage = $('#confirmImage');
	var agreeCheckCount = $('#agreeCheck:checked').length;
	
	var src = $confirmImage.attr("src");
	//  同意するクリック  checked="false"
	if(agreeCheckCount == 0){
		$confirmImage.attr('src',src.replace(".png","_d.png"));
		$confirmImage.attr("disabled","disabled");
		$confirmImage.removeClass("roll");
		$confirmImage.addClass('noRoll');
		$confirmImage.removeClass('roll');
	}
	// 同意するクリック  checked="checked"
	else{
		$confirmImage.attr('src',src.replace("_d.png",".png"));
		$confirmImage.removeAttr("disabled");
		$confirmImage.removeClass('noRoll');
		$confirmImage.addClass('roll');
	};
}

/**
 * age check
 * @returns {true:error}
 */
function childAgeCheck(parentDivId,childClass){
	
	var ageErrorFlg = false;
	var ageErrorMsg='';
	for (var i=1; i<=$("#"+parentDivId).find("." + childClass).val(); i++){
		// 子供の年齢・学齢を得る
		var childAge = $("#"+parentDivId).find(".childAge_" + i).val();

		var childAgeList = $("#_childage").val();
		
		// 子供の年齢を得る
		if(childAge==''){
			if(ageErrorFlg == false){
				if (i18n.isJP()) {
					ageErrorMsg = $.i18nMessage('errors.required', ['・お子様の年齢']) + "<br>";
				}else{
					ageErrorMsg = "The age of children is required";
				}
			}
			ageErrorFlg =  true;
			$("#"+parentDivId).find(".childAge_" + i).addClass("error");
		}
		else if($.inArray(childAge,childAgeList.split('|')) == -1){
			if(ageErrorFlg == false){
				if (i18n.isJP()) {
					ageErrorMsg = $.i18nMessage('errors.invalid', ['・お子様の年齢の入力内容']) + "<br>";
				}else{
					ageErrorMsg = "There is an error in the age of children that you have entered";
				}
			}
			$("#"+parentDivId).find(".childAge_" + i).addClass("error");
			ageErrorFlg =  true;
		}else{
			$("#"+parentDivId).find(".childAge_" + i).removeClass("error");
		}
	} 
	 
	 return ageErrorMsg;
}

function isPC(){
	return $.tdrec != undefined && $.tdrec.dialogSmall != undefined;
}

/**
 * contentsを表示
 * @param contents
 */
function showMessage(contents){
	var contentsString;
	if(typeof contents  === 'string'){
		contentsString = contents;
	}else{
		contentsString = contents.html();
	}
	
	if(isPC()){
		// PC版想定
		// ダイアログの生成
		api_dialog_br = $.tdrec.dialogSmall({
				useCloseButton : true,
				feedInSpeed : 100,
				contents : contentsString,
				close : function() {
					$('#apierror_modalOverlay, #apierror_modalDialog').remove();
				}
			}); 
		api_dialog_br.open();
	}else{
		// SP版想定
		$.spSmallPopup(contentsString);
	}
};

/**
 * 予約前注意喚起ダイアログの表示（初回のみ）
 * @param key
 * @param val
 */
function showBeforeReserveCaution(key, val){
  var cookievalue = $.cookie(key);
  if (cookievalue == undefined || cookievalue==""){
    $.cookie(key, val, { path: '/', expires: 7 });  
    if ($('#beforeReserveCaution').length > 0) {
      //ダイアログの生成
      dialog_br = $.tdrec.dialogSmall({
        useCloseButton      : true,
        feedInSpeed         : 100,
        contents            : _.template($('#beforeReserveCaution').html(), {})
      });
      dialog_br.open();
      }
  };
  $('.close02').on('click', 'a', function (e) {
    e.preventDefault();
    dialog_br.close();
  });
}