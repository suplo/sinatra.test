/**
 * 検索ボックスを切り換える
 * @param boxName
 * @param dom
 */
function boxClick(boxName,dom){
	$('a.checkInnerBox').each(function(){
		if($(this).hasClass(boxName)){
			//checked
			var img = $(this).find('img').eq(0).attr('src');
			var index = img.lastIndexOf("_checked.png");
			if(index==-1){
				var newImg = img.substring(0,img.lastIndexOf(".png"))+'_checked.png';
				$(this).find('img').eq(0).attr('src',newImg);
			}
		}else{
			var img = $(this).find('img').eq(0).attr('src');
			var index = img.lastIndexOf("_checked.png");
			if(index!=-1){
				var newImg = img.substring(0,img.lastIndexOf('_checked.png'))+'.png';
				$(this).find('img').eq(0).attr('src',newImg);
			}
		}
    initOnlineGift(boxName);
	});

	$('div[itemname=box]').each(function (){
        if($(this).hasClass(boxName)){
           	 $(this).removeAttr('style');
        }else{
           	 $(this).attr('style','display: none;');
        }
	});

	//errorメッセージを表示しない
	$(".searchBoxMsg").css('display','none');
	//errorメッセージをクリア
	$("#searchBoxError").html('');

	$('.inner form input').removeClass('error');
	$('.inner form select').removeClass('error');
};

/**
 * 検索ボックス（ パッケージ or ホテル）のsubmit
 * @param name
 */
function packageHotelFormSubmit(name) {

	//errorメッセージを表示しない
	$(".searchBoxMsg").css('display','none');
	//errorメッセージをクリア
	$("#searchBoxError").html('');

	var errorHtml = [];

	//宿泊日をチェック
	var useDateErrorFlg = false;
	var result = $.tdrec_datepicker_ext.validateInput( $('#'+name+'UseDate'), function( msg ) {
		//宿泊日のerrorメッセージ
		errorHtml.push(formatMessage(msg));
    });
	if(!result){
		useDateErrorFlg = true;
	}
	if(useDateErrorFlg){
		$('#'+name+'UseDate').addClass('error');
	}else{
		$('#'+name+'UseDate').removeClass('error');
	}

	//泊数をチェック
	var stayDaysErrorFlg = false;
	if($('#'+name+'StayDays').val()==''){
		//泊数のerrorメッセージ
		errorHtml.push('・泊数を選択してください。');
		stayDaysErrorFlg = true;
	}else{
		if($('#'+name+'StayDays').val().match(/[^0-9]+/)){
			//泊数のerrorメッセージ
			errorHtml.push('・泊数の入力内容が正しくありません。');
			stayDaysErrorFlg = true;
		}
	}
	if(stayDaysErrorFlg){
		$('#'+name+'StayDays').addClass('error');
	}else{
		$('#'+name+'StayDays').removeClass('error');
	}

	//部屋数をチェック
	var roomsNumErrorFlg = false;
	if($('#'+name+'RoomsNum').val()==''){
		//部屋数のerrorメッセージ
		errorHtml.push('・部屋数を選択してください。');
		roomsNumErrorFlg = true;
	}else{
		if($('#'+name+'RoomsNum').val().match(/[^0-9]+/)){
			//部屋数のerrorメッセージ
			errorHtml.push('・部屋数の入力内容が正しくありません。');
			roomsNumErrorFlg = true;
		}
	}
	if(roomsNumErrorFlg){
		$('#'+name+'RoomsNum').addClass('error');
	}else{
		$('#'+name+'RoomsNum').removeClass('error');
	}

	//大人をチェック
	var adultNumErrorFlg = false;
	if($('#'+name+'AdultNum').val()=='' ||
			$('#'+name+'AdultNum').val()=='0'){
		//大人のerrorメッセージ
		errorHtml.push('・人数を選択してください。');
		adultNumErrorFlg = true;
	}else{
		if($('#'+name+'AdultNum').val().match(/[^0-9]+/)){
			//大人のerrorメッセージ
			errorHtml.push('・大人の入力内容が正しくありません。');
			adultNumErrorFlg = true;
		}
	}
	if(adultNumErrorFlg){
		$('#'+name+'AdultNum').addClass('error');
	}else{
		$('#'+name+'AdultNum').removeClass('error');
	}

	// 大人部屋人数をチェック
	var adultRoomNumErrorFlg = false;
	if($('#'+name+'AdultNum').val()/1 < $('#'+name+'RoomsNum').val()){
	  errorHtml.push('・部屋数を大人人数以内でご入力ください。');
	  adultRoomNumErrorFlg = true;
	}
	if(adultRoomNumErrorFlg){
	  $('#'+name+'RoomsNum').addClass('error');
  }else{
    $('#'+name+'RoomsNum').removeClass('error');
  }

	//子どもをチェック
	var childNumErrorFlg = false;
	if($('#'+name+'ChildNum').val()=='' || $('#'+name+'ChildNum').val().match(/[^0-9]+/)){
		//子どものerrorメッセージ
		errorHtml.push('・子どもの入力内容が正しくありません。');
		childNumErrorFlg = true;
	}
	if(childNumErrorFlg){
		$('#'+name+'ChildNum').addClass('error');
	}else{
		$('#'+name+'ChildNum').removeClass('error');
	}

	// お子様の情報をチェック
	var childInfoRangeArr = $('#childInfoRangeHid').val().split('|');
	var childErrorFlg = false;
	var $childDd = $('#'+name+'ChildDiv .'+name+'ChildCount').find("dd");
	for(var i = 0; i < $childDd.length; i++){
		var _val = $($childDd[i]).find('select').eq(0).val();
		if(jQuery.inArray(_val, childInfoRangeArr) == 0){
			childErrorFlg = true;
			$($childDd[i]).find('select').eq(0).addClass('error');
		}else{
			$($childDd[i]).find('select').eq(0).removeClass('error');
		}
	}
	if(childErrorFlg){
		//お子様の情報のerrorメッセージ
		errorHtml.push('・お子様の年齢の入力内容が正しくありません。');
	}

	// childBedRoomInform[]:age1_bed2_room3|age1_bed2_room3
	var $childDd = $('#'+name+'ChildDiv .'+name+'ChildCount').find("dd");

	var childInform = "";
	var bedShareNum = 0;
	var bedUseNum = 0;

	for(var i = 0; i < $childDd.length; i++){

		// 子供の年齢・学齢を得る
		var childAge = $($childDd[i]).find('select').eq(0).val();

		// 子供の年齢を得る
		var age = childAge.replace(/D/, '.1').replace(/U/, '.2');

		// ベッド情報
		var childBed;

		// VP check
		if(name=='package'){

			//  3才以下のお子様は添い寝利用となります
			if(age < 4){
				childBed = 3;
			}
			// ベッド,添い寝利用選択
			else if(age > 12.1){
				childBed = 1;
			}
			// 中学生以上のお子様はベッド利用となります
			else{
				childBed = $($childDd[i]).find('input.radio:checked').val();
				if(typeof(childBed) == "undefined"){
					childBed="";
				}
			}
		}

		// hotel page
		else{

			// 0才時のお子様は添い寝利用となります
			if(age == 0){
				childBed = 3;
			}

			// ベッド,添い寝利用選択
			else if(age > 12.1){
				childBed = 1;
			}
			// 中学生以上のお子様はベッド利用となります
			else{
				childBed = $($childDd[i]).find('input.radio:checked').val();
				if(typeof(childBed) == "undefined"){
					childBed="";
				}
			}
		}

		childInform =  childInform + childAge + "_" + childBed+"|";
		if(childBed==3){
			bedShareNum ++;
		}

		if(childBed==1){
			bedUseNum ++;
		}
	}

	//添い寝をチェック
	var bedShareNumErrorFlg = false;
	if(!adultNumErrorFlg){
		if(parseInt($('#'+name+'AdultNum').val(), 10) + bedUseNum < bedShareNum){
			bedShareNumErrorFlg = true;
			//添い寝のerrorメッセージ
			errorHtml.push('・添い寝希望のお子様の人数を、ベッド利用人数より多く設定することはできません。');
		}
	}

	//errorが空でない場合、errorメッセージを表示する
	if(useDateErrorFlg || stayDaysErrorFlg || roomsNumErrorFlg || adultNumErrorFlg || childNumErrorFlg || childErrorFlg || bedShareNumErrorFlg){
		$("#searchBoxError").html(errorHtml.join('<br/>'));
		$(".searchBoxMsg").css('display','block');
		return false;
	}

	loadImage(function(){
		//日程を設定ます
		useDateConvertOp($('#'+name+'UseDate').val(),name+"UseDate1");

		$('#'+name+'ChildAgeBedInform').val(childInform);
		$('#'+name+'FormId').submit();
	});
};

/**
 * 検索ボックス（チケット）のsubmit
 * @returns {Boolean}
 */
function ticketFormSubmit() {

	//errorメッセージを表示しない
	$(".searchBoxMsg").css('display','none');
	//errorメッセージをクリア
	$("#searchBoxError").html('');

	var errorHtml = [];

	//受取方法をチェック
	var parkTicketSalesFormErrorFlg = false;
	var parkTicketSalesForm=$('#ticketFormId input[name="parkTicketSalesForm"]:checked').val();
	if(parkTicketSalesForm!='1' && parkTicketSalesForm != '2'){
		//受取方法のerrorメッセージ
		errorHtml.push('・受取方法の入力内容が正しくありません。');
		parkTicketSalesFormErrorFlg = true;
	}

	//来園日をチェック
	var openTicketErrorFlg = false;
	var openTicket=$('#ticketFormId input[name="openTicket"]:checked').val();
	if(openTicket==undefined){
		var result = $.tdrec_datepicker_ext.validateInput( $('#ticketUseDateFromParam'), function( msg ) {
			errorHtml.push(formatMessage(msg));
	    });
		if(!result){
			openTicketErrorFlg = true;
		}
	}

	if(!openTicketErrorFlg && $('#ticketUseDateFromParam').val()!=''){
		var result = $.tdrec_datepicker_ext.validateInput( $('#ticketUseDateFromParam'), function( msg ) {
			//来園日のerrorメッセージ
			errorHtml.push(formatMessage(msg));
	    });
		if(!result){
			openTicketErrorFlg = true;
		}
	}

	if(openTicketErrorFlg){
		//来園日input addClass error
		$('#ticketUseDateFromParam').addClass('error');
	}else{
		//来園日input removeClass error
		$('#ticketUseDateFromParam').removeClass('error');
	}

	//errorが空でない場合、errorメッセージを表示する
	if(parkTicketSalesFormErrorFlg || openTicketErrorFlg){
		$("#searchBoxError").html(errorHtml.join('<br/>'));
		$(".searchBoxMsg").css('display','block');
		return false;
	}

	loadImage(function(){
		//日程を設定ます
		useDateConvertOp($('#ticketUseDateFromParam').val(),"ticketUseDateFromParam1");

		//form submit チケット一覧画面へ遷移
		$('#ticketFormId').submit();
	});
};

/**
 * 検索ボックス（オンラインギフト）のsubmit
 * @returns {Boolean}
 */
function giftFormSubmit() {

  //errorメッセージを表示しない
  $(".searchBoxMsg").css('display','none');
  //errorメッセージをクリア
  $("#searchBoxError").html('');

  var errorHtml = [];

  //受取方法をチェック
  var parkTicketSalesFormErrorFlg = false;
  var parkTicketSalesForm=$('#giftFormId input[name="parkTicketSalesForm"]:checked').val();
  if(parkTicketSalesForm!='1' && parkTicketSalesForm != '2'){
    //受取方法のerrorメッセージ
    errorHtml.push('・受取方法の入力内容が正しくありません。');
    parkTicketSalesFormErrorFlg = true;
  }

  //来園日をチェック
  var openTicketErrorFlg = false;
  var openTicket=$('#giftFormId input[name="openTicket"]:checked').val();
  if(openTicket==undefined){
    var result = $.tdrec_datepicker_ext.validateInput( $('#giftUseDateFromParam'), function( msg ) {
      errorHtml.push(formatMessage(msg));
      });
    if(!result){
      openTicketErrorFlg = true;
    }
  }

  if(!openTicketErrorFlg && $('#giftUseDateFromParam').val()!=''){
    var result = $.tdrec_datepicker_ext.validateInput( $('#giftUseDateFromParam'), function( msg ) {
      //来園日のerrorメッセージ
      errorHtml.push(formatMessage(msg));
      });
    if(!result){
      openTicketErrorFlg = true;
    }
  }

  if(openTicketErrorFlg){
    //来園日input addClass error
    $('#giftUseDateFromParam').addClass('error');
  }else{
    //来園日input removeClass error
    $('#giftUseDateFromParam').removeClass('error');
  }

  //errorが空でない場合、errorメッセージを表示する
  if(parkTicketSalesFormErrorFlg || openTicketErrorFlg){
    $("#searchBoxError").html(errorHtml.join('<br/>'));
    $(".searchBoxMsg").css('display','block');
    return false;
  }

  loadImage(function(){
    //日程を設定ます
    useDateConvertOp($('#giftUseDateFromParam').val(),"giftUseDateFromParam1");

    //form submit チケット一覧画面へ遷移
    $('#giftFormId').submit();
  });
};

/**
 * 検索ボックス（サービス）のsubmit
 * @param url
 * @returns {Boolean}
 */
function serviceFormSubmit() {

	//errorメッセージを表示しない
	$(".searchBoxMsg").css('display','none');
	//errorメッセージをクリア
	$("#searchBoxError").html('');

	var errorHtml = [];

	//来園日をチェック
	var useDateErrorFlg = false;
	var result = $.tdrec_datepicker_ext.validateInput( $('#serviceUseDateFromParam'), function( msg ) {
		//来園日のerrorメッセージ
		errorHtml.push(formatMessage(msg));
    });
	if(!result){
		useDateErrorFlg = true;
	}
	if(useDateErrorFlg){
		$('#serviceUseDateFromParam').addClass('error');
	}else{
		$('#serviceUseDateFromParam').removeClass('error');
	}

	//サービス内容をチェック
	var serviceErrorFlg = false;
	var _serviceContent = $('#serviceContent').val();
	if(_serviceContent!='0' && _serviceContent!='1' && _serviceContent!='2' && _serviceContent!='3' && _serviceContent!='4'){
		//サービス内容のerrorメッセージ
		errorHtml.push('・サービス内容が正しくありません。');
		serviceErrorFlg = true;
	}
	if(serviceErrorFlg){
		$('#serviceContent').addClass('error');
	}else{
		$('#serviceContent').removeClass('error');
	}

	//選択レストラン、ショーレストラン、ガイドツアー
	if(_serviceContent=='0' || _serviceContent=='1' || _serviceContent=='2'){

		//大人をチェック
		var adultNumErrorFlg = false;
		if($('#serviceAdultNum').val()=='' || $('#serviceAdultNum').val().match(/[^0-9]+/)){
			//大人のerrorメッセージ
			errorHtml.push('・大人の入力内容が正しくありません。');
			adultNumErrorFlg = true;
		}
		if(adultNumErrorFlg){
			$('#serviceAdultNum').addClass('error');
		}else{
			$('#serviceAdultNum').removeClass('error');
		}

		//子どもをチェック
		var childNumErrorFlg = false;
		if($('#serviceChildNum').val()=='' || $('#serviceChildNum').val().match(/[^0-9]+/)){
			//子どものerrorメッセージ
			errorHtml.push('・子どもの入力内容が正しくありません。');
			childNumErrorFlg = true;
		}
		if(childNumErrorFlg){
			$('#serviceChildNum').addClass('error');
		}else{
			$('#serviceChildNum').removeClass('error');
		}

		//お子様の情報をチェック
		var childInfoRangeArr = $('#childInfoRangeHid').val().split('|');
		var childErrorFlg = false;
		$('#serviceChildNumAdd select').each(function(){
			if(jQuery.inArray($(this).val(), childInfoRangeArr) == 0){
				$(this).addClass('error');
				childErrorFlg = true;
			}else{
				$(this).removeClass('error');
			}
		});

		if(childErrorFlg){
			//お子様の情報のerrorメッセージ
			errorHtml.push('・お子様の年齢の入力内容が正しくありません。');
		}

		if(!adultNumErrorFlg && !childNumErrorFlg && !childErrorFlg){
			if(!UseNumValidCheck.isValid()){
				adultNumErrorFlg = true;
				errorHtml.push(UseNumValidCheck.getMessage('required'));
			}
			if(!UseNumValidCheck.isU3ChildNum()){
				adultNumErrorFlg = true;
				errorHtml.push(UseNumValidCheck.getMessage('limit'));
			}
		}

		//errorが空でない場合、errorメッセージを表示する
		if(useDateErrorFlg || serviceErrorFlg || adultNumErrorFlg || childNumErrorFlg || childErrorFlg){
			$("#searchBoxError").html(errorHtml.join('<br/>'));
			$(".searchBoxMsg").css('display','block');
			return false;
		}
	}else{

    //BBQ店舗をチェック
    var bbqStoreErrorFlg = false;
    if(_serviceContent=='3'){
      var bbqStore = $('input:radio[name="bbqStore"]:checked').val();
      if("1"!==bbqStore && "2"!==bbqStore){
        errorHtml.push('・店舗の入力内容が正しくありません。');
        bbqStoreErrorFlg = true;
      }
    }

		//選択BBQ、ペットクラブを選択した時
		//errorが空でない場合、errorメッセージを表示する
		if(useDateErrorFlg || serviceErrorFlg || bbqStoreErrorFlg){
			$("#searchBoxError").html(errorHtml.join('<br/>'));
			$(".searchBoxMsg").css('display','block');
			return false;
		}
	}

    var url;

    //サービス内容＝レストランの場合、FSR001_サービス_レストラン一覧画面へ遷移
    if(_serviceContent=='0'){
      //レストラン一覧画面urlを取得する
      url = $('#serviceRestaurantListUrl').val();

      //日程を設定ます
      useDateConvertOp($('#serviceUseDateFromParam').val(),"serviceUseDateFromParam1");

      var childArr = [];
      $('#serviceChildNumAdd select option:selected').each(function(){
        childArr.push($(this).val());
      });
      //お子様の情報を設定ます
      $('#childAgeInform').val(childArr.join('|'));

      //form submit レストラン一覧画面へ遷移
      loadImage(function(){
        $('#serviceFormId').attr('action',url).submit();
      });
    }

    //サービス内容＝ショーレストランの場合、FSS001_サービス_ショーレストラン一覧画面へ遷移
    if(_serviceContent=='1'){
      //ショーレストラン一覧画面urlを取得する
      url = $('#serviceShowRestaurantListUrl').val();

      //日程を設定ます
      useDateConvertOp($('#serviceUseDateFromParam').val(),"serviceUseDateFromParam1");

      var childArr = [];
      $('#serviceChildNumAdd select option:selected').each(function(){
        childArr.push($(this).val());
      });
      //お子様の情報を設定ます
      $('#childAgeInform').val(childArr.join('|'));

      //form submit ショーレストラン一覧画面へ遷移
      loadImage(function(){
        $('#serviceFormId').attr('action',url).submit();
      });
    }

    //サービス内容＝BBQの場合、FSB001_サービス_BBQ_一覧画面へ遷移
    if(_serviceContent=='3'){
      //日程を設定ます
      useDateConvertOp($('#serviceUseDateFromParam').val(),"serviceUseDateFromParam1");
      //BBQ一覧画面urlを取得する
      var bbqStore = $('input:radio[name="bbqStore"]:checked').val();
      if("1"===bbqStore){
        url = $('#serviceBbqListUrl').val();
        //BBQ一覧画面へ遷移
        loadImage(function(){
          location.href = url+'?useDateFrom='+encodeURI($('#serviceUseDateFromParam1').val())+'&reservationStatus='+$("input[name=reservationStatus]").val();
        });
      } else {
        url = $('#serviceBbq2ListUrl').val();
        //通知メッセージの表示
        var notice_param = {};
        var isOpen = $('#bbq2OpenFlg').val()=='true';
        var nextUrl = $('#nextUrl').val();
        notice_param['contentsCD'] = '08';
        notice_param['multiItem'] = isOpen ? '1':'0';
        var promise = $.noticeMessage.checkhc(notice_param);
        promise.done(function() {
          //BBQ一覧画面へ遷移
          loadImage(function(){
            location.href = url+'?useDateFrom='+encodeURI($('#serviceUseDateFromParam1').val())+'&reservationStatus='+$("input[name=reservationStatus]").val();
          });
        });
      }
    }

    //サービス内容＝ガイドツアーの場合、FSG001_サービス_ガイドツアー一覧画面へ遷移
    if(_serviceContent=='2'){
      //ガイドツアー一覧画面urlを取得する
      url = $('#serviceGuideTourListUrl').val();

      //日程を設定ます
      useDateConvertOp($('#serviceUseDateFromParam').val(),"serviceUseDateFromParam1");

      var childArr = [];
      $('#serviceChildNumAdd select option:selected').each(function(){
        childArr.push($(this).val());
      });
      //お子様の情報を設定ます
      $('#childAgeInform').val(childArr.join('|'));

      //form submit ガイドツアー一覧画面へ遷移
      loadImage(function(){
        $('#serviceFormId').attr('action',url).submit();
      });
    }

    //サービス内容＝ペットクラブの場合、FSF001_サービス_設備予約画面へ遷移
    if(_serviceContent=='4'){
      //設備予約一覧画面urlを取得する
      url = $('#serviceEquipReservationListUrl').val();

      //ケージサイズを取得する
      var size = $('#serviceSizeTr input[type=radio]:checked').val();

      //日程を設定ます
      useDateConvertOp($('#serviceUseDateFromParam').val(),"serviceUseDateFromParam1");

      //設備予約一覧画面へ遷移
      loadImage(function(){
        location.href = url+'?useDate='+encodeURI($('#serviceUseDateFromParam1').val())+'&size='+size;
        return;
      });
    }

};

/**
 * パッケージ、ホテルの子どもを選択
 * @param name
 * @param dom
 */
function packageHotelChildNumChange(name,dom){

	//選択された子どもの値を取得する
	var childNum = $(dom).val();

	if(childNum==0){
		// 人目削除
		$('#'+name+'ChildDiv .'+name+'ChildCount').empty();

		//0人を選択した時、 お子様の情報を表示しない
		$('#'+name+'ChildDiv').hide();
	}else{
	    var oldNum = $('#'+name+'ChildDiv select').size();
	    if(oldNum==0){
			// 人目追加
			for(var i=0; i < childNum; i++){
				var index = i+1;
				var _html = $('#'+name+'ChildAgeAddTemplete').html().replace(/_0/g, '_'+index);
				_html = _html.replace(/0人目/g,index+'人目');
				if(name=='package'){
					_html = _html.replace(/packageHotelChildAgeChange\(0/g,'packageHotelChildAgeChange('+index);
				}else{
					_html = _html.replace(/packageHotelChildAgeChange\(0/g,'packageHotelChildAgeChange('+index);
				}
				//お子様の情報を設定ます
				$('#'+name+'ChildDiv .'+name+'ChildCount').append(_html);
			}
	    }else{
	    	if(childNum>oldNum){
	    		// 人目追加
				for(var i=oldNum; i < childNum; i++){
					var index = i+1;
					var _html = $('#'+name+'ChildAgeAddTemplete').html().replace(/_0/g, '_'+index);
					_html = _html.replace(/0人目/g,index+'人目');
					if(name=='package'){
						_html = _html.replace(/packageHotelChildAgeChange\(0/g,'packageHotelChildAgeChange('+index);
					}else{
						_html = _html.replace(/packageHotelChildAgeChange\(0/g,'packageHotelChildAgeChange('+index);
					}
					//お子様の情報を設定ます
					$('#'+name+'ChildDiv .'+name+'ChildCount').append(_html);
				}
	    	}else{
	    		$('#'+name+'ChildDiv .'+name+'ChildCount dt').each(function(i){
	    			if(i+1>childNum){
	    				$(this).remove();
	    			}
	    		});
	    		$('#'+name+'ChildDiv .'+name+'ChildCount dd').each(function(i){
	    			if(i+1>childNum){
	    				$(this).remove();
	    			}
	    		});
	    	}
	    }

		//お子様の情報を表示します
		$('#'+name+'ChildDiv').show();
	}
};

/**
 * パッケージ、ホテルのお子様を選択
 * @param index
 * @param name
 * @param btn
 */
function packageHotelChildAgeChange(index, name, btn){

	// 選択できるお子様の情報
	var changeFLg = $(btn).val();
	changeFLg = changeFLg.replace(/D/, '.1').replace(/U/, '.2');

	if(changeFLg==0){

		// ベッド
		$('#'+name+'_bed_'+index).attr("disabled","disabled").attr("style","display:none");
	    $('.'+name+'_bed_'+index).hide();
	    $('#'+name+'_bed_'+index).prop("checked", true);

		//  中学生以上のお子様はベッド利用となります
		$('.'+name+'_student_'+index).hide();

		 // 添い寝
		 $('#'+name+'_lyingbed_'+index).attr("disabled","disabled").attr("style","display:none");
		 $('.'+name+'_lyingbed_'+index).hide();

		 $('.'+name+'_baby_'+index).show();
	}
	// 1才～12才(小学生)→ベッド利用　or　添い寝の選択
	else if(changeFLg< 12.2){

		//パッケージ
		if("package"==name && changeFLg<= 3){
			// ベッド
			$('#'+name+'_bed_'+index).attr("disabled","disabled").attr("style","display:none");
		    $('.'+name+'_bed_'+index).hide();
		    $('#'+name+'_bed_'+index).prop("checked", true);

			//  中学生以上のお子様はベッド利用となります
			$('.'+name+'_student_'+index).hide();

			 // 添い寝
			 $('#'+name+'_lyingbed_'+index).attr("disabled","disabled").attr("style","display:none");
			 $('.'+name+'_lyingbed_'+index).hide();

			 $('.'+name+'_baby_'+index).show();
			 return ;
		}

		 // 添い寝
		 $('#'+name+'_lyingbed_'+index).removeAttr("disabled").removeAttr("style");
		 $('.'+name+'_lyingbed_'+index).show();

		 // ベッド
	     $('#'+name+'_bed_'+index).removeAttr("disabled").removeAttr("style");
	     $('.'+name+'_bed_'+index).show();

	     //  中学生以上のお子様はベッド利用となります
	     $('.'+name+'_student_'+index).hide();

	     $('.'+name+'_baby_'+index).hide();
	}
	// 12才(中学生)→(何も選択なし。ベッド利用必須。）
	else if(changeFLg> 12.1){

		// 添い寝
		$('#'+name+'_lyingbed_'+index).attr("disabled","disabled").attr("style","display:none");
		$('.'+name+'_lyingbed_'+index).attr("style","display:none");

		// ベッド
	    $('#'+name+'_bed_'+index).attr("disabled","disabled").attr("style","display:none");
	    $('.'+name+'_bed_'+index).attr("style","display:none");
	    $('#'+name+'_bed_'+index).prop("checked", true);

	    //  中学生以上のお子様はベッド利用となります
	    $('.'+name+'_student_'+index).show();
	    $('.'+name+'_baby_'+index).hide();
	}
}

/**
 * サービス内容を選択（その他のご予約）
 * @param dom
 */
function serviceContentChange(dom){

	//選択されたサービス内容の値を取得する
	var service = $(dom).val();

	// サービス内容の値をチェック
	if(service!='0' && service!='1' && service!='2' && service!='3' && service!='4'){
		return;
	}

	//利用日をクリアする
	$('#serviceUseDateFromParam').val('');

	//選択レストラン
	if(service=='0'){
		//カレンダー範囲を設定
		$('#serviceUseDateFromParam').tdrec_datepicker_ext_setDateRange(false, $.top.restaurantStartDate, $.top.restaurantEndDate); 
		$("#adult_inputNum").css('width', '3.5em');
		$("#child_inputNum").css('width', '3.5em');
		$("#adult_inputNum").html("大人<br><span class='bullet'>(18才～)</span>");
		$("#child_inputNum").html("子ども");
	}

	//選択ショーレストラン
	if(service=='1'){
		//カレンダー範囲を設定
		$('#serviceUseDateFromParam').tdrec_datepicker_ext_setDateRange(false, $.top.showRestaurantStartDate, $.top.showRestaurantEndDate);
		$("#adult_inputNum").css('width', '3.5em');
		$("#child_inputNum").css('width', '3.5em');
		$("#adult_inputNum").html("大人<br><span class='bullet'>(18才～)</span>");
		$("#child_inputNum").html("子ども");
	}

	//選択BBQ
	if(service=='3'){
		//カレンダー範囲を設定
		$('#serviceUseDateFromParam').tdrec_datepicker_ext_setDateRange(false, $.top.bbqStartDate, $.top.bbqEndDate);
	}

	//選択ガイドツアー
	if(service=='2'){
		//カレンダー範囲を設定
		$('#serviceUseDateFromParam').tdrec_datepicker_ext_setDateRange(false, $.top.guidetourStartDate, $.top.guidetourEndDate);
		//10189 ガイドツアーのみ大人(中学生以上)、子ども(小学生以下)に変更
		$("#adult_inputNum").css('width', '65px');
		$("#child_inputNum").css('width', '65px');
		$("#adult_inputNum").html("大人<br><span class='bullet'>(中学生以上)</span>");
		$("#child_inputNum").html("子ども<br><span class='bullet'>(小学生以下)</span>");
	}

	//選択ペットクラブ
	if(service=='4'){
		//カレンダー範囲を設定
		$('#serviceUseDateFromParam').tdrec_datepicker_ext_setDateRange(false, $.top.petclubStartDate, $.top.petclubEndDate);
	}

	if(service=='4'){
		//選択ペットクラブ
		$('#serviceSizeTr input[type=radio]').attr('name','serviceSize');
	}else{
		$('#serviceSizeTr input[type=radio]').removeAttr('name');
	}

    // BBQ店舗の表示制御
    var isBbq = service==='3';
    if (isBbq) {
      // BBQ店舗を表示する
      $('#bbqStoreTr').show();
      $('#bbqStoreTr input').removeAttr("disabled");
      $('#bbq2OpenFlg').removeAttr("disabled");
    } else {
      // BBQ店舗を表示しない
      $('#bbqStoreTr').hide();
      $('#bbqStoreTr input').attr("disabled","disabled");
      $('#bbq2OpenFlg').attr("disabled","disabled");
    }

    //選択ペットクラブかBBQ
    if(service=='3' || service=='4'){
      //人数を表示しない
      $('#servicePeopleNumberTr').hide();
      $('#serviceAdultNum').val('0');
      $('#serviceChildNum').val('0');

      //選択ペットクラブ
      if(service=='4'){
        //ケージサイズを表示する
        $('#serviceSizeTr').show();
      } else {
        //ケージサイズを表示しない
        $('#serviceSizeTr').hide();
      }

	}else{
		//選択レストランかショーレストラン
		if(service=='0' || service=='1'){

			//大人 pulldown
			var _adultNumSelectArr = $('#serviceRestaurantAdultNumSelect').html().split('|');
			var _adultNumSelectHtml = '';
			for(var i=0; i<_adultNumSelectArr.length; i++){
				_adultNumSelectHtml = _adultNumSelectHtml+'<option value="'+_adultNumSelectArr[i]+'">'+_adultNumSelectArr[i]+'人</option>';
			}

			//大人 pulldownを設定ます
			$('#serviceAdultNum').empty().append(_adultNumSelectHtml);

			//子ども pulldown
			var _childNumSelectArr = $('#serviceRestaurantChildNumSelect').html().split('|');
			var _childNumSelectHtml = '';
			for(var i=0; i<_childNumSelectArr.length; i++){
				_childNumSelectHtml = _childNumSelectHtml+'<option value="'+_childNumSelectArr[i]+'">'+_childNumSelectArr[i]+'人</option>';
			}

			//子どもpulldownを設定ます
			$('#serviceChildNum').empty().append(_childNumSelectHtml);
		}

		//選択ガイドツアー
		if(service=='2'){

			//大人 pulldown
			var _adultNumSelectArr = $('#serviceGuideTourAdultNumSelect').html().split('|');
			var _adultNumSelectHtml = '';
			for(var i=0; i<_adultNumSelectArr.length; i++){
				_adultNumSelectHtml = _adultNumSelectHtml+'<option value="'+_adultNumSelectArr[i]+'">'+_adultNumSelectArr[i]+'人</option>';
			}

			//大人 pulldownを設定ます
			$('#serviceAdultNum').empty().append(_adultNumSelectHtml);

			//子ども pulldown
			var _childNumSelectArr = $('#serviceGuideTourChildNumSelect').html().split('|');
			var _childNumSelectHtml = '';
			for(var i=0; i<_childNumSelectArr.length; i++){
				_childNumSelectHtml = _childNumSelectHtml+'<option value="'+_childNumSelectArr[i]+'">'+_childNumSelectArr[i]+'人</option>';
			}

			//子どもpulldownを設定ます
			$('#serviceChildNum').empty().append(_childNumSelectHtml);
		}

		//ペットクラブのケージサイズを表示しない
		$('#serviceSizeTr').hide();

		//人数を表示します
		$('#servicePeopleNumberTr').show();
	}

	//お子様の情報を表示しない
	$('#serviceChildDiv').hide();
	$('#serviceChildNumAdd').empty();
};

/**
 * その他のご予約  子どもclick
 * @param dom
 */
function serviceChildNumChange(dom){

	//選択された子どもの値を取得する
	var _val = $(dom).val();

	if(_val=='0'){
		//0人を選択した時、 お子様の情報を表示しない
		$('#serviceChildDiv').hide();
		$('#serviceChildNumAdd').empty();
	}else{
		// お子様の情報を表示します
		var num = parseInt(_val, 10);
		var oldNum = $('#serviceChildDiv select').size();
	    if(oldNum==0){
			var htmlArr = new Array();
			for(var i =1;i<=num;i++){
				htmlArr.push('<dt>'+i+'人目</dt><dd>'+$('#serviceChildAgesSelect').html()+'</dd>');
			}
			$('#serviceChildNumAdd').empty().append(htmlArr.join(''));
	    }else{
	    	if(num>oldNum){
				var htmlArr = new Array();
				for(var i =oldNum+1;i<=num;i++){
					htmlArr.push('<dt>'+i+'人目</dt><dd>'+$('#serviceChildAgesSelect').html()+'</dd>');
				}
				$('#serviceChildNumAdd').append(htmlArr.join(''));
	    	}else{
	    		$('#serviceChildNumAdd dt').each(function(i){
	    			if(i+1>num){
	    				$(this).remove();
	    			}
	    		});
	    		$('#serviceChildNumAdd dd').each(function(i){
	    			if(i+1>num){
	    				$(this).remove();
	    			}
	    		});
	    	}
	    }

		$('#serviceChildDiv').show();
	}
};

/* ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼　時間の表示形式:yyyyMMDD　▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ */
function useDateConvertOp(datepicker,input){

	var selectDate=$.datepicker.parseDate("yy/m/d", datepicker, {});
	$('#'+input).val($.datepicker.formatDate( "yymmdd", selectDate, {} ));
}

$(function() {

	//チケットのオープン click
	$("#openTicket").on('click', function (event) {
		if($("#openTicket").is(':checked')){
			if($("#ticketUseDateFromParam").length>0){
				//$("#useDateFromParam").val("");
				//来園日disable
				$("#ticketUseDateFromParam").datepicker("disable");
				$("#ticketUseDateFromParam").val("");
			}
		}else{
			if($("#ticketUseDateFromParam").length>0){
				//来園日enable
				$("#ticketUseDateFromParam").datepicker("enable");
			}
		}
	});

  //チケットのオープン（オンラインギフト） click
  $("#openTicket_").on('click', function (event) {
    if($("#openTicket_").is(':checked')){
      if($("#giftUseDateFromParam").length>0){
        //$("#useDateFromParam").val("");
        //来園日disable
        $("#giftUseDateFromParam").datepicker("disable");
        $("#giftUseDateFromParam").val("");
      }
    }else{
      if($("#giftUseDateFromParam").length>0){
        //来園日enable
        $("#giftUseDateFromParam").datepicker("enable");
      }
    }
  });

	//チケットの受取方法 click
	$('input:radio[name="parkTicketSalesForm"]').on('click', function (event) {

		//選択された受取方法の値を取得する
		var parkTicketSalesForm = $('input:radio[name="parkTicketSalesForm"]:checked').val();

		if("1"==parkTicketSalesForm){
			//受取方法を選択した時、カレンダーの開始日は今日
			$("#ticketUseDateFromParam").tdrec_datepicker_ext_setDateRange(false, $.top.eTicketStartDate);
		}else if("2"==parkTicketSalesForm){
			//配送を選択した時、カレンダーの開始日は今日＋７日
			$("#ticketUseDateFromParam").tdrec_datepicker_ext_setDateRange(false, $.top.deliveryTicketStartDate);
		}
		$("#ticketUseDateFromParam").val("");
	});

	UseNumValidCheck.init();

});

//ご利用人数選択チェック
var UseNumValidCheck={
	init: function() {
		this.message = {
			required : '・人数を選択してください。',
			limit : '・幼児（3才以下）のみのご予約は受け付けておりません。'
		}
	},
	getU3ChildNum:function(target){
		var cnt = 0;
		$(target).each(function(){
			var num = parseInt($(this).val());
			if (3 >= num){
				cnt++;
			}
		});
		return cnt;
	},
	isValid:function(){
		var adults = $("#serviceAdultNum").val();
		var childs = $("#serviceChildNum").val();
		//大人人数と子ども人数が１以下の場合、エラーを報告
		if((adults/1 + childs/1) <1 ){
			return false;
		}
		return true;
	},
	isU3ChildNum:function(){
		var adults = $("#serviceAdultNum").val();
		var childs = $("#serviceChildNum").val();
		// 3才以下のみの予約の場合
		if((childs/1) >0 ){
			var nums = UseNumValidCheck.getU3ChildNum('#serviceFormId #serviceChildDiv select');
			if((adults/1 + childs/1) == nums){
				return false;
			}
		}
		return true;
	},
	getMessage:function(key){
		return UseNumValidCheck.message[key];
	}
}

function formatMessage(msg){
	idx = msg.indexOf("・");
	if(idx == -1) {
		return '・'+msg;
	}
	return msg;
}

/**
 * オンラインギフトの検索条件を初期化
 */
function initOnlineGift(boxName){
  var isOnlineGift = boxName == 'gift';
  var isOpneTicket = $('#openTicket_:checked').length < 1;
  if (isOnlineGift && isOpneTicket) {
    $("#openTicket_").trigger('click');
  }
}
