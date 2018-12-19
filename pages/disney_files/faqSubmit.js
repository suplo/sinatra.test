var transitionToHelpPage = function() {
  var keyWord1 = $("#rn_KeywordText_1_Text").val();
  var keyWord2 = $("#rn_KeywordText_2_Text").val();
  var faqListURL = "https://faq.tokyodisneyresort.jp/reserve/faq_list.html";
  var faqURL = "https://faq.tokyodisneyresort.jp/reserve/faq.html";
  var URL = faqListURL;

  if((keyWord1 == "" || keyWord1 == undefined) && (keyWord2 !== "" && keyWord2 !== undefined)) {
    URL = faqListURL + "?category=" + keyWord2;
  }
  if((keyWord1 !== "" && keyWord1 !== undefined) && (keyWord2 == "" || keyWord2 == undefined)) {
    keyWord1 = escapeHtml(keyWord1);
    URL = faqURL + "?key=" + encodeURIComponent(keyWord1);
  }
  if((keyWord1 !== "" && keyWord1 !== undefined) && (keyWord2 !== "" && keyWord2 !== undefined)) {
    URL = faqURL + "?key=" + encodeURIComponent(keyWord1) + "&category=" + keyWord2;
  }

  window.open(URL);
};

var escapeHtml = (function (String) {
  var escapeMap = {
    '&': '&amp;',
    "'": '&#x27;',
    '`': '&#x60;',
    '"': '&quot;',
    '<': '&lt;',
    '>': '&gt;'
  };
  var escapeReg = '[';
  var reg;
  for (var p in escapeMap) {
    if (escapeMap.hasOwnProperty(p)) {
      escapeReg += p;
    }
  }
  escapeReg += ']';
  reg = new RegExp(escapeReg, 'g');
  return function escapeHtml (str) {
    str = (str === null || str === undefined) ? '' : '' + str;
    return str.replace(reg, function (match) {
      return escapeMap[match];
    });
  };
}(String));