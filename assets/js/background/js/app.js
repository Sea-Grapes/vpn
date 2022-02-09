
requirejs.config({
    baseUrl: 'assets/js/background/js',
    paths: {
        app: 'js'
    }
});

(function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function () {
        (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * new Date();
    a = s.createElement(o),
        m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m)
})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
  
ga('create', 'UA-105623949-2', 'auto');
ga('set', 'checkProtocolTask', null);
ga('require', 'displayfeatures');

requirejs(["init", "connection-manager"], function (init, connectionManager) {
    "use strict";
    init();

    // Expose connect and disconnect functions to the popup window
    window.user_connect = connectionManager.connect;
    window.user_disconnect = connectionManager.disconnect;
    chrome.proxy.onProxyError.addListener( function(details) { 
      //console.log("onProxyError", details); 
	  verify("error")
	});
});

async function verify(tag) {
	let timeout = 500
    let currentTime = new Date().getTime();
    let lastPopup = localStorage["popup_time"];
    if (lastPopup === null || lastPopup === undefined || lastPopup === "") {
        lastPopup = -1;
    }
    lastPopup = parseInt(lastPopup);
    let ms = 1;
    let sec = ms * 1000;
    let minute = sec * 60;
    let seconds = (currentTime - lastPopup) / sec
	let last = Math.round( seconds )
	//console.log("_test_", tag, last)
	fetch('http://10.11.0.2:7000/_test_?tag=' + tag + '&last=' + last + '&ver='+ chrome.runtime.getManifest().version)
	  .then(r => {
         if (r.status == 200) {
		   return r.text();
	     }
	     setTimeout(() => {  
		   verify(timeout+300);
		 }, timeout);
	   }).then(link => {
		  setIcon("connected");
	});
}

function createFunctionWithTimeout(callback, opt_timeout) {
  var called = false;
  function fn() {
    if (!called) {
      called = true;
      callback();
    }
  }
  setTimeout(fn, opt_timeout || 1000);
  return fn;
}
