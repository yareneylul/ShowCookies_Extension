chrome.i18n = chrome.i18n || {};
chrome.i18n = (function() {

  var supportedLocales = 
	[{"code":"tr", "name":"Turkish"}];
	
  function syncFetch(file, fn) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", chrome.extension.getURL(file), false);
    xhr.onreadystatechange = function() {
      if(this.readyState == 4 && this.responseText != "") {
        fn(this.responseText);
      }
    };
    try {
      xhr.send();
    }
    catch (e) {
      // File not found
    }
  }

  function parseString(msgData, args) {
    if (msgData.placeholders == undefined && args == undefined)
      return msgData.message.replace(/\$\$/g, '$');

    function safesub(txt, re, replacement) {
      var dollaRegex = /\$\$/g, dollaSub = "~~~I18N~~:";
      txt = txt.replace(dollaRegex, dollaSub);
      txt = txt.replace(re, replacement);
      var undollaRegex = /~~~I18N~~:/g, undollaSub = "$$$$";
      txt = txt.replace(undollaRegex, undollaSub);
      return txt;
    }

    var $n_re = /\$([1-9])/g;
    var $n_subber = function(_, num) { return args[num - 1]; };

    var placeholders = {};
    for (var name in msgData.placeholders) {
      var content = msgData.placeholders[name].content;
      placeholders[name.toLowerCase()] = safesub(content, $n_re, $n_subber);
    }
    var message = safesub(msgData.message, $n_re, $n_subber);
    message = safesub(message, /\$(\w+?)\$/g, function(full, name) {
      var lowered = name.toLowerCase();
      if (lowered in placeholders)
        return placeholders[lowered];
      return full; // 'foo'
    });
    message = message.replace(/\$\$/g, '$');

    return message;
  }

  var l10nData = undefined;

  var theI18nObject = {
    _getL10nData: function() {
      var result = { locales: [] };
      if(preferences.useCustomLocale && preferences.customLocale != null)
      	result.locales.push(preferences.customLocale);
      // 1: Kullanıcının şu anki yerel ayarı eklenir
      result.locales.push(navigator.language.replace('-', '_'));
      // 2: aynı mı?
      if (navigator.language.length > 2)
        result.locales.push(navigator.language.substring(0, 2));
      // 3: default
      if (result.locales.indexOf("tr") == -1)
        result.locales.push("tr");

      result.messages = {};
      for (var i = 0; i < result.locales.length; i++) {
        var locale = result.locales[i];
        var file = "_locales/" + locale + "/messages.json";
        syncFetch(file, function(text) {
          result.messages[locale] = JSON.parse(text);
        });
      }

      return result;
    },

    _setL10nData: function(data) {
      l10nData = data;
    },

    getMessage: function(messageID, args) {
      if (l10nData == undefined) {
        chrome.i18n._setL10nData(chrome.i18n._getL10nData());
      }
      if (typeof args == "string")
        args = [args];
      for (var i = 0; i < l10nData.locales.length; i++) {
        var map = l10nData.messages[l10nData.locales[i]];
        // Yerel ayara sahip olunmalı ve yerel ayarda mesaj bulunmalıdır.
        if (map && messageID in map)
          return parseString(map[messageID], args);
      }
      return "";
    },
    
    //Returns the list of locales that are actually present in the locale directory
    getExistingLocales: function (){
     var existingLocales = [];
  	 for (var i = 0; i < supportedLocales.length; i++) {
        var locale = supportedLocales[i].code;
        var file = "_locales/" + locale + "/messages.json";

        var xhr = new XMLHttpRequest();
		xhr.open("GET", chrome.extension.getURL(file), false);
		xhr.onreadystatechange = function() {
		};
		try {
		  xhr.send();
		  existingLocales.push(supportedLocales[i]);
		}
		catch (e) {
		}
  	  }
  	  return existingLocales;
	}
    
  };

  return theI18nObject;
})();
