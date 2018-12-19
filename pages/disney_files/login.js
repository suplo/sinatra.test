/**
 * FLI用JS
 *
 * @dependence jQuery
 */
(function( $ ) {

	var ajaxFlag = true;

	var Login = {

		buttonLock : {
			isLocked: false,
			lock: function () {
				Login.buttonLock.isLocked = true;
			},
			unlock: function () {
				Login.buttonLock.isLocked = false;
			}
		},

    pageBack : function() {
      history.back();
    },

		/**
		 * 提出する
		 *
		 * @param url
		 */
		loginFormSubmit : function( url ) {
			// submit
			$("#postForm").attr("action", url).submit();
		},

		checkUserId : function( userId ) {

			var errormsg = null;

			// ユーザーIDは必須です
			if ( userId == '' ) {
				errormsg = $.i18nMessage('login.user.id.is.not.null');
			}
			// #8173
			else {
				// ユーザーIDのレングスをチェック
				if ( userId.length < 4 ) {
					errormsg = $.i18nMessage('login.user.id.leng.check');
				}
				// ユーザーIDのレングスをチェック
				else if ( userId.length > 64 ) {
					errormsg = $.i18nMessage('login.user.id.length.limit');

				}
//				// ユーザーIDのフォームをチェック
//				else {
//					var userIdFt = new RegExp('^[a-zA-Z0-9\\_\\-\\.]+$');
//
//					// ユーザーID 半角英数字
//					if ( !userIdFt.test(userId) ) {
//						errormsg = $.i18nMessage('login.user.id.is.alphNums.check');
//					}
//				}
			}

			return errormsg;
		},

		/**
		 * パスワードヒント取得
		 */
		ajaxGetPassMemo : function() {
			// ユーザーID
			var userId = $("#userId").val();

			var msg = this.checkUserId(userId);

			if ( null != msg ) {
				$("#pass").empty();
				$("#errorMessage").html(msg);
				return;
			}

			// URL
			var url = $("#getPassMemo").val();
			// リクエストを送信
			$.lifeobs.ajax({
				url : url,
				type : "POST",
				data : ({
					userId : userId
				}),
				async : false,
				dataType : "json",
				success : function( obj ) {

					if ( obj.errorMap.error != null ) {
						// エラーメッセージを表示
						$("#pass").empty();
						$("#errorMessage").html(obj.errorMap.error);
					}
					else {
						// 通常表示
						$("#errorMessage").empty();
						$("#pass").html(obj.passwordHint);
					}
				}
			});
		},

		/**
		 * login popup
		 *
		 * @param popupId
		 * @param url
		 */
		loginPopup : function( popupId, url ) {

			// ユーザーID
			var userId = $('#modalDialog').find("#userId").val();
			// パスワード
			var password = $('#modalDialog').find("#password").val();
			// URL
			var curUrl = $("#_currentUrl").val();

			// empty the error message
			if ($('#modalDialog').find(".isNotExit").hasClass("boxError01")) {
				$('#modalDialog').find(".isNotExit").find("p").empty();
				$('#modalDialog').find(".boxError01").removeClass("boxError01");
			}

			$('#modalDialog').find(".userIdMsg").empty();

			$('#modalDialog').find(".passwordMsg").empty();

			if (ajaxFlag) {

				ajaxFlag = false;
				Login.loginLoading();

				$.lifeobs.ajax({
					url : url,
					type : "POST",
					data : ({
						userId : userId,
						password : password,
						currentUrl : $('#modalDialog').find('#_currentUrl').val(),
						resultFlg : true
					}),
					dataType : "json",
					cache: false,
					success : function( obj ) {

						if ( obj.messageFlg != null && obj.messageFlg == true ) {
							var loginRecreateUrl = $('#_loginRecreate').val();

							if ( null != obj.toReseveUrl ) {
								window.location.replace(loginRecreateUrl + "?oldSessionId=" + obj.oldSessionId
												+ "&redirectURL=" + obj.toReseveUrl + "&key=" + obj.key);
							} else if ( null != obj.redirectURL) {
								window.location.replace(loginRecreateUrl + "?oldSessionId=" + obj.oldSessionId
										+ "&redirectURL=" + obj.redirectURL + "&key=" + obj.key);
							} else {
							  window.location.replace(loginRecreateUrl + "?oldSessionId=" + obj.oldSessionId
							      + "&key=" + obj.key
							      + "&redirectURL=" + curUrl);
							}
						}
						else {
							// エラーを表示します
							if ( null != obj.errorMap.userId ) {
								$('#modalDialog').find(".userIdMsg").html(obj.errorMap.userId);
							}

							// エラーを表示します
							if ( null != obj.errorMap.password ) {
								$('#modalDialog').find(".passwordMsg").html(obj.errorMap.password);
							}

							if ( null != obj.errorMap.isNotExit ) {
								var div = $('#modalDialog').find(".isNotExit");

								div.addClass("boxError01");
								// エラーを表示します
								div.find("p").html(obj.errorMap.isNotExit);
							}
							ajaxFlag = true;
							Login.loginLoadingOff();
						}
					},
					error: function (XMLHttpRequest) {
						var div = $('#modalDialog').find(".isNotExit");
						div.addClass("boxError01");
						div.find("p").html($.i18nMessage('login.connection.error'));
						ajaxFlag = true;
						Login.loginLoadingOff();
					}
				});
			}

		},

		resolveMasePopup : function(url) {
			$("#modalDialog .resolveMaseError").hide();
			$("#modalDialog .resolveMaseError").html("");
			if (ajaxFlag) {

				ajaxFlag = false;
				Login.loginLoading();

				$.lifeobs.ajax({
					url : url,
					type : "POST",
					data : ({
						userId : $('#modalDialog').find(".maseAddress").text()
					}),
					dataType : "json",
					cache: false,
					success : function( obj ) {
						if ( obj.messageFlg != null && obj.messageFlg == true ) {
							$("#modalDialog .resolveMaseSuccess").html($.i18nMessage('login.resolveMase.success'));
							$("#modalDialog .resolveMaseBtnArea").hide();
							$("#modalDialog .resolveMaseSuccess").show();
						} else {
							$("#modalDialog .resolveMaseError").html(obj.errorMap.resolveMaseError);
							$("#modalDialog .resolveMaseError").show();
						};
						ajaxFlag = true;
						Login.loginLoadingOff();
					},
					error: function (XMLHttpRequest) {
						$("#modalDialog .resolveMaseError").html($.i18nMessage('login.resolveMase.error'));
						$("#modalDialog .resolveMaseError").show();
						ajaxFlag = true;
						Login.loginLoadingOff();
					}
				});
			}

		},

		/**
		 * loginLoading
		 */
		loginLoading : function() {
			var div = $("#modalDialog div.loginLoading");
			var div2 = $("#modalDialog div.loading04");
			if (div.length == 0) {
				div = $("<div>", {
					"class": "overlay loginLoading"
				});
				var div2 = $("<div>", {
					"class": "overlay2 loading04"
				});
				div2.append(appLoadingImage);
				div.hide();
				div2.hide();
				$('#modalDialog').append(div).append(div2);
			};
			div.show();
			div2.show();
		},

		/**
		 * loginLoading off
		 */
		loginLoadingOff : function() {
			var div = $("#modalDialog div.loginLoading");
			var div2 = $("#modalDialog div.loading04");
			div2.hide();
			div.hide();
		},

		/**
		 * popup show
		 *
		 * @param url
		 * @param curUrl
		 */
		ajaxPopupShow : function( url, curUrl ) {

			// https://redmine.team-lab.com/OLOC102/issues/3418
			if ($("#modalDialog").length > 0) {
				return;
			}

			// 設定URL
			$("#_currentUrl").val(curUrl || window.location.pathname);

			// ログインボタンを押下
			var dialog = $.tdrec.dialogLogin({
				useBottomCloseButton : false,
				useCloseButton : true,
				contents : $("#hoPop").html(),
				_closeButtonHTML : $.i18nMessage('closeBtn'),
				close : function() {
					ajaxFlag = true;
					Login.loginLoadingOff();
					$("#modalDialog, #modalOverlay").remove();
				}
			}).open();

			// formのsubmitをフックしてログインボタンを押す
			$('#modalDialog #loginForm')
				.submit(function(event){
					event.preventDefault(); event.stopPropagation();
					$('#modalDialog .loginBtn01>a:has(img)').click();
					});
		},


		/**
     * popup to EnTop画面
     *
     * @param url
     * @param curUrl
     */
    ajaxToEnTop : function( url, curUrl ) {

      // https://redmine.team-lab.com/OLOC102/issues/3418
      if ($("#modalDialog").length > 0) {
        return;
      }

      // 設定URL
      $("#_currentUrl").val(curUrl || window.location.pathname);

      // ログインボタンを押下
      var dialog = $.tdrec.dialogSmall({
        useCloseButton : true,
        feedInSpeed : 100,
        contents : $("#toEnTop").html(),
        close : function() {
          $("#modalDialog, #modalOverlay").remove();
        }
      }).open();

    },

		/**
		 * jsp FIQ_予約情報照会 login
		 *
		 * @param reqMethod
		 * @param methodParams
		 */
		ajaxLogin : function( reqMethod, methodParams ) {
			// ユーザーID
			var userId = $("#_userId").val();
			// パスワード
			var password = $("#_password").val();
			// URL
			var url = $("#_loginUrl").val();

			//currentUrl
			var curUrl = $("#_currentUrl").val();

			var firstLogin = $("#_firstLogin").val();

			if (methodParams == "") {
          methodParams = document.referrer;
          var i = 0, methodParamsLength = methodParams.length;

          // redirectURLの値として全てのURLを渡すために【&】→【,】に置換する処理
          for(i; i < methodParamsLength; i++) {
            methodParams = methodParams.replace('&',',');
          }
			}

			if (curUrl !== undefined && curUrl !== '') {
				methodParams = curUrl;
			}

			// empty the error message
			if ($('#_loginConection').find(".isNotExit").hasClass("boxError01")) {
				$('#_loginConection').find(".isNotExit").find("p").empty();
				$('#_loginConection').find(".boxError01").removeClass("boxError01");
			}

			$('#_loginConection').find(".userIdMsg").empty();

			$('#_loginConection').find(".passwordMsg").empty();

			loadImage(function(){
				// リクエストを送信
				$.lifeobs.ajax({
					url : url,
					type : "POST",
					data : ({
						userId : userId,
						password : password,
						currentUrl : methodParams,
						resultFlg : true,
						firstLogin : firstLogin
					}),
					async : false,
					dataType : "json",
					cache: false,
					success : function( obj ) {
						if ( obj.messageFlg != null && obj.messageFlg == true ) {
							if (!obj.isActivate) {
								closeLoadImage();
								notActivatedMessage();
								return false;
							}
							var midUrl = $("#login_befUrl").val();

							if ( "" != midUrl && undefined != midUrl ) {
								methodParams = midUrl;
							}

							var loginRecreateUrl = $('#_loginRecreate').val();

							if ( null != obj.redirectURL) {
								window.location.replace(loginRecreateUrl + "?oldSessionId=" + obj.oldSessionId
										+ "&redirectURL=" + obj.redirectURL + "&key=" + obj.key);
							} else {
								window.location.replace(loginRecreateUrl + "?oldSessionId=" + obj.oldSessionId
								    + "&key=" + obj.key
								    + "&redirectURL=" + methodParams);
							}
						}
						else {
						  if (obj.clearPassword) {
                $("#_password").val("");
              }
							// パスワードをお忘れの方
							if ( reqMethod == '2' ) {
								var errMsgDiv = $('#_loginConection').find(".errorMsg");
								errMsgDiv.html("");

								if ( null != obj.errorMap.userId ) {
									errMsgDiv.append(obj.errorMap.userId + "<br/>");
								}

								if ( null != obj.errorMap.password ) {
									errMsgDiv.append(obj.errorMap.password + "<br/>");
								}

								if ( undefined != obj.errorMap.isNotExit && null != obj.errorMap.isNotExit ) {
									errMsgDiv.append(obj.errorMap.isNotExit);
								}
							}
							else {
								// sp用エラー配列
								var errors = [];
								if ( null != obj.errorMap.userId ) {
									// エラーを表示します
									$('#_loginConection').find(".userIdMsg").html(obj.errorMap.userId);
									errors.push(obj.errorMap.userId);
								}
								if ( null != obj.errorMap.password ) {
									// エラーを表示します
									$('#_loginConection').find(".passwordMsg").html(obj.errorMap.password);
									errors.push(obj.errorMap.password);
								}
								//spのみ
								if (($.tdrec == undefined || $.tdrec.dialogSmall == undefined) && errors.length != 0){
									$.fn.popupMessage( errors, true );
								}
								if ( undefined != obj.errorMap.isNotExit && null != obj.errorMap.isNotExit ) {
									var div = $('#_loginConection').find(".isNotExit");

									if ( div.length == 0 ) {
										errors.push(obj.errorMap.isNotExit);
										$.fn.popupMessage( errors, true );
									}
									else {
										div.addClass("boxError01");
										// エラーを表示します
										div.find("p").html(obj.errorMap.isNotExit);
										//spのみ
										if ($.tdrec == undefined || $.tdrec.dialogSmall == undefined){
											$.fn.popupMessage( obj.errorMap.isNotExit, true );
										}
									}
								}
							}
							closeLoadImage();
						}
					},
					error: function (XMLHttpRequest) {
						var div = $('#_loginConection').find(".isNotExit");
						if ( div.length == 0 ) {
							var errors = [];

							errors.push($.i18nMessage('login.connection.error'));
							popupValidationDialog('ログイン', 'firstPage', errors);
						}
						else {
							div.addClass("boxError01");
							// エラーを表示します
							div.find("p").html($.i18nMessage('login.connection.error'));
						}
						closeLoadImage();
					}
				});
			});
		},

		/**
		 * jsp FIQ_予約情報照会 inquire
		 *
		 */
		inquireSubmit : function() {
			loadImage(function(){
				$('#inputForm').submit();
			});
		},

		/**
		 * jsp FIQ_予約情報照会 login
		 *
		 * @param url
		 * @param subUrl
		 */
		ajaxSendMail : function( e, url, subUrl ) {
			if (Login.buttonLock.isLocked) {
				e.preventDefault();
				return;
			};

			// ユーザーID
			var mailUserId = $("#_mailUserId").val();

			// Csrf token
			var tokenName = $("#tokenName").val();
			var tokenValue = $("#tokenValue").val();

			$('#sendMailForPw').find(".mailUserIdMsg").empty();

			var msg = this.checkUserId(mailUserId);

			if ( null != msg ) {
				// msg show
				$('#sendMailForPw').find(".mailUserIdMsg").html(msg);
				return;
			}

			Login.buttonLock.lock();
			setTimeout(function(){
				Login.buttonLock.unlock();
			}, 5000);

			var data = (function() {
				var param = {
					'mailUserId'  : mailUserId
				};

				param[tokenName] = tokenValue;

				return param;
			})();

			loadImage(function(){
				$.lifeobs.ajax({
					url  : url,
					type : "POST",
					data : data,
					dataType : "json",
					cache: false,
					success : function( obj ) {
						if ( obj.messageFlg != null && obj.messageFlg == true ) {
							// ページをジャンプ
							window.location.replace(subUrl);
						}
						else {
							Login.buttonLock.unlock();
							// エラーを表示します
							if ( null != obj.errorMap.mailUserId ) {
								$('#sendMailForPw').find(".mailUserIdMsg").html(obj.errorMap.mailUserId);
							}
							else {
								$('#sendMailForPw').find(".mailUserIdMsg").html("");
							}
							closeLoadImage();
						}
					}
				});
			});
		}
	};

	if (!window.Login) {
		$(document).ready(function(){
			$('form.loginform:has(.btn)').submit(function(event){
				event.preventDefault(); event.stopPropagation();
				$('.btn a:has(img)', this).click();
			});

			$(document).on('click', '#modalDialog .resolveMaseBtn', function (e) {
				e.preventDefault();
				Login.resolveMasePopup((context.languageDiv == 2 ? '/en' : '') + '/fli/resolveMase/');
			});
			$("#sploginForm").submit(function(){
				Login.ajaxLogin('1', $("#_afterUrl").val());
				return false;
			});
		});
	};

	window.Login = Login;

})(jQuery);