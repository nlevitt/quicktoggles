// if ("undefined" == typeof(XULSchoolChrome)) {  
//   var XULSchoolChrome = {  
//     /** 
//      * Initializes this object. 
//      */  
//     init : function() {  
//       this.obsService =  
//         Cc["@mozilla.org/observer-service;1"].getService(Ci.nsIObserverService);  
//     }  
//   };  
//   
//   /** 
//    * Constructor. 
//    */  
//   (function() {  
//     this.init();  
//   }).apply(XULSchoolChrome);  
// };  


if ("undefined" == typeof(QuickToggles)) {  
	var QuickToggles = {  
		init : function(event) {
			// alert("init() event.target.nodeName=" + event.target.nodeName + " event.target.value=" + event.target.value);
			var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
			// alert("init() prefs=" + prefs);
			// alert("init() prefs.getIntPref('network.cookie.cookieBehavior')=" + prefs.getIntPref("network.cookie.cookieBehavior"));
			// alert('init() window.document.getElementById("quick-cookies-label")=' + window.document.getElementById("quick-cookies-label"));

			// i'm not sure why this.foo() doesn't work here, but does work elsewhere
			QuickToggles.updateLabels("quick-cookies-label", prefs.getIntPref("network.cookie.cookieBehavior") == 0);
			// QuickToggles.updateLabel(window.document.getElementById("quick-cookies-label"), prefs.getIntPref("network.cookie.cookieBehavior") == 0);
			QuickToggles.updateLabels("quick-javascript-label", prefs.getBoolPref("javascript.enabled"));
			QuickToggles.updateLabels("quick-proxy-label", prefs.getIntPref("network.proxy.type") == 1);
		
			QuickToggles.updateValues("quick-proxy-value", prefs.getCharPref("network.proxy.http") + ":" + prefs.getIntPref("network.proxy.http_port"));
		},

		updateLabel : function(label, enabled) {
			// alert("updateLabel() label=" + label + " enabled=" + enabled);
			var settingName = label.value.replace(/ (ON|OFF|[?]+)$/, "");
			if (enabled) {
				label.style.color = "#080";
				label.value = settingName + " ON";
			} else {
				label.style.color = "#800";
				label.value = settingName + " OFF";
			}
		},
		
		/* updates the label with id labelId in all windows */
		updateLabels : function(labelId, enabled) {
			// alert("updateLabels() labelId=" + labelId + " enabled=" + enabled);
			var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);  
			var enumerator = wm.getEnumerator("navigator:browser");  
			while (enumerator.hasMoreElements()) {  
				var win = enumerator.getNext();
				this.updateLabel(win.document.getElementById(labelId), enabled);
			}
			this.updateLabel(window.document.getElementById(labelId), enabled);
		},
		
		/* updates the value of the element with id elementId in all windows */
		updateValues : function(elementId, value) {
			var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);  
			var enumerator = wm.getEnumerator("navigator:browser");  
			while (enumerator.hasMoreElements()) {  
				var win = enumerator.getNext();
				win.document.getElementById(elementId).value = value;
			}
			window.document.getElementById(elementId).value = value;
		},
		
		toggleCookies : function(event) {
			// alert("toggleCookies() event.target.nodeName=" + event.target.nodeName + " event.target.value=" + event.target.value);
		
			var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
		
			if (prefs.getIntPref("network.cookie.cookieBehavior") == 0) {
				prefs.setIntPref("network.cookie.cookieBehavior", 2);
			} else {
				prefs.setIntPref("network.cookie.cookieBehavior", 0);
			}
		
			this.updateLabels("quick-cookies-label", prefs.getIntPref("network.cookie.cookieBehavior") == 0);
		},
		
		toggleJavascript : function(event) {
			// alert("toggleJavascript() event.target.nodeName=" + event.target.nodeName + " event.target.value=" + event.target.value);
			var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
			prefs.setBoolPref("javascript.enabled", !prefs.getBoolPref("javascript.enabled"));
			this.updateLabels("quick-javascript-label", prefs.getBoolPref("javascript.enabled"));
		},
		
		setProxy : function(host, port) {
			var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
		
			prefs.setCharPref("network.proxy.http", host);
			prefs.setCharPref("network.proxy.ftp", host);
			prefs.setCharPref("network.proxy.gopher", host);
			prefs.setCharPref("network.proxy.ssl", host);
			prefs.setCharPref("network.proxy.socks", host);
		
			prefs.setIntPref("network.proxy.http_port", port);
			prefs.setIntPref("network.proxy.ftp_port", port);
			prefs.setIntPref("network.proxy.gopher_port", port);
			prefs.setIntPref("network.proxy.ssl_port", port);
			prefs.setIntPref("network.proxy.socks_port", port);
		
			this.updateValues("quick-proxy-value", document.getElementById("quick-proxy-value").value);
		},
		
		/* if proxy is enabled and user changes proxy spec, update */
		updateProxy : function(event) {
			var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
			if (prefs.getIntPref("network.proxy.type") == 1) {
				var proxy = document.getElementById("quick-proxy-value").value.split(':');
				var port = parseInt(proxy[1]);
				// window.dump("toggleProxy() proxy[0]=" + proxy[0] + " port=" + port);
				if (!isNaN(port)) {
					this.setProxy(proxy[0], port);
					this.updateValues("quick-proxy-value", document.getElementById("quick-proxy-value").value);
				}
			}
		},
		
		toggleProxy : function(event) {
			// alert("toggleProxy() event.target.nodeName=" + event.target.nodeName + " event.target.value=" + event.target.value);
			// window.dump("toggleProxy() event.target.nodeName=" + event.target.nodeName + " event.target.value=" + event.target.value);
		
			var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
			if (prefs.getIntPref("network.proxy.type") != 1) {
				var proxy = document.getElementById("quick-proxy-value").value.split(':');
				var port = parseInt(proxy[1]);
				// window.dump("toggleProxy() proxy[0]=" + proxy[0] + " port=" + port);
				if (!isNaN(port)) {
					this.setProxy(proxy[0], port);
					prefs.setIntPref("network.proxy.type", 1);
					this.updateValues("quick-proxy-value", document.getElementById("quick-proxy-value").value);
				} else {
					alert("not a valid proxy - should be host:port");
				}
			} else {
				prefs.setIntPref("network.proxy.type", 0);
			}
			
			this.updateLabels("quick-proxy-label", prefs.getIntPref("network.proxy.type") == 1);
		},
	};
}

try { 
	// alert("adding window onload listeners");
	var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);  
	var enumerator = wm.getEnumerator("navigator:browser");  
	while (enumerator.hasMoreElements()) {  
		var win = enumerator.getNext();
		win.addEventListener("load", QuickToggles.init, false); 
	}
	// alert("added window onload listeners");
} catch (e) { 
	alert("caught exception adding event listener for QuickToggles.init(): " + e); 
}

/* vim:set sw=8 noet: */
