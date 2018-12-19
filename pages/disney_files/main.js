// ----------------------------------------------------------------------------
// Rollover
// ----------------------------------------------------------------------------
$(function() {
	$('body').on('mouseenter', '.roll', function() {
		var src = $(this).attr('src');

		if ( $(this).hasClass('noRoll') ) {
			return;
		}

		$(this).attr('src', src.replace(/\.(gif|png|jpg)$/, '_o.$1'));

	}).on('mouseleave', '.roll', function() {
		var src = $(this).attr('src');

		if ( $(this).hasClass('noRoll') ) {
			return;
		}

		$(this).attr('src', src.replace(/_o/, ''));
	});
});

// ----------------------------------------------------------------------------
// Plan Sheet Rollover
// ----------------------------------------------------------------------------
$(function(){
  var target = $('.boxPlan03 .month td');

  target.find('.hover').hide();
  target.hover(function(){
    $(this).find('.hover').stop(true, false).fadeToggle(80);
  });
});


// ----------------------------------------------------------------------------
// Castle
// ----------------------------------------------------------------------------

$(function(){
  var footer = $('#footer .inner'), footerHegith = footer.outerHeight(), bg = $('#castle, #castleMorning, #castleNoon, #castleNight'), bgHeight = bg.height(), footerPos = $(document).height() - footerHegith - bgHeight, bottomPos = $(document).height() - $(window).height() - footerHegith;

  if($(window).scrollTop() >= bottomPos){
    bg.css({'position': 'absolute', 'top': footerPos});
  }else{
    bg.css({'position': 'fixed', 'bottom': '0', 'top': 'auto'});
  }

  $(window).scroll(function(){
    var footer = $('#footer .inner'), footerHegith = footer.outerHeight(), bg = $('#castle, #castleMorning, #castleNoon, #castleNight'), bgHeight = bg.height(), footerPos = $(document).height() - footerHegith - bgHeight, bottomPos = $(document).height() - $(window).height() - footerHegith;

    if($(this).scrollTop() >= bottomPos){
      bg.css({'position': 'absolute', 'top': footerPos});
    }else{
      bg.css({'position': 'fixed', 'bottom': '0', 'top': 'auto'});
    }
  });
});


// ----------------------------------------------------------------------------
// Swap Image
// ----------------------------------------------------------------------------

$(function () {
    if (!$('#swapImage').length) {
        return;
	}

    var target = $('#swapImage');

    target.each(function () {
        var mainImg = $(this).find('.photoMain img'),
            mainCap = $(this).find('.caption'),
	        thumbnail = $(this).find('.photoThumb li');

	    thumbnail.on('click', function (e) {
	        e.preventDefault();

            var anc = $(this).find('a'),
                changeImg = anc.attr('href'),
                changeCap = anc.attr('data-caption');

	        $(this).addClass('current').siblings('li').removeClass('current');
            mainImg.attr('src', changeImg);
	        mainCap.text(changeCap);
        });
    });
});

//----------------------------------------------------------------------------
//Disable Next Button
//----------------------------------------------------------------------------
function agreeCheckboxCheck(checkboxId, nextBtnId) {
  // helper constants
  var helperVariables = {
      imgExtension: '.png',
      imgDisabledSuffix: '_d',
      imgFocusedSuffix: '_o'
  };
  var helperFunctions = {
      toggleActiveStatus: function (path) {
        var temp = path.substring(0, path.length - helperVariables.imgExtension.length);
        if (temp.substring(temp.length - helperVariables.imgDisabledSuffix.length, temp.length) === helperVariables.imgDisabledSuffix) {
          return temp.substring(0, temp.length - helperVariables.imgDisabledSuffix.length) + helperVariables.imgExtension;
        } else {
          return temp + helperVariables.imgDisabledSuffix + helperVariables.imgExtension;
        }
      },
      turnOnActiveStatus: function (path) {
        var temp = path.substring(0, path.length - helperVariables.imgExtension.length);
        if (temp.substring(temp.length - helperVariables.imgDisabledSuffix.length, temp.length) === helperVariables.imgDisabledSuffix) {
          return temp.substring(0, temp.length - helperVariables.imgDisabledSuffix.length) + helperVariables.imgExtension;
        } else {
          return path;
        }
      },
      turnOffActiveStatus: function (path) {
        var temp = path.substring(0, path.length - helperVariables.imgExtension.length);
        if (temp.substring(temp.length - helperVariables.imgDisabledSuffix.length, temp.length) === helperVariables.imgDisabledSuffix) {
          return path;
        } else {
          return temp + helperVariables.imgDisabledSuffix + helperVariables.imgExtension;
        }
      },
      isActive: function (path) {
        var temp = path.substring(0, path.length - helperVariables.imgExtension.length);
        if (temp.substring(temp.length - helperVariables.imgDisabledSuffix.length, temp.length) === helperVariables.imgDisabledSuffix) {
          return false;
        } else {
          return true;
        }
      }
  };

  if (checkboxId == undefined) {
    checkboxId = $('.listForm02 input[type=checkbox]').attr('id');
    if (checkboxId == undefined) {
      return;
    }
  }
  if (nextBtnId == undefined) {
    nextBtnId = $('.listBtn01 input[type=image]').attr('id');
    if (nextBtnId == undefined) {
      return;
    }
  }
  var $nextBtn = $('#' + nextBtnId);
  var $checkbox = $('.listForm02 #' + checkboxId);
  if ($checkbox.length <= 0 || $nextBtn.length <= 0) {
    return;
  }
  if ($checkbox.is(':checked')) {
    $nextBtn.removeAttr('disabled');
    $nextBtn.attr('src', helperFunctions.turnOnActiveStatus($nextBtn.attr('src')));
  } else {
    $nextBtn.attr('disabled', 'disabled');
    $nextBtn.attr('src', helperFunctions.turnOffActiveStatus($nextBtn.attr('src')));
    $nextBtn.css('border', 'none');
  }
}
