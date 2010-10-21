function updateLabel(label, enabled)
{
	var settingName = label.value.replace(/ (ON|OFF|[?]+)$/, "");
	if (enabled) {
		label.style.color = "#080";
		label.value = settingName + " ON";
	} else {
		label.style.color = "#800";
		label.value = settingName + " OFF";
	}
}

/* updates the label with id labelId in all windows */
function updateLabels(labelId, enabled) 
{
	var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);  
	var enumerator = wm.getEnumerator("navigator:browser");  
	while (enumerator.hasMoreElements()) {  
		var win = enumerator.getNext();
		updateLabel(win.document.getElementById(labelId), enabled);
	}
	updateLabel(window.document.getElementById(labelId), enabled);
}

/* updates the value of the element with id elementId in all windows */
function updateValues(elementId, value)
{
	var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);  
	var enumerator = wm.getEnumerator("navigator:browser");  
	while (enumerator.hasMoreElements()) {  
		var win = enumerator.getNext();
		win.document.getElementById(elementId).value = value;
	}
	window.document.getElementById(elementId).value = value;
}

function toggleCookies(event)
{
	// alert("toggleCookies() event.target.nodeName=" + event.target.nodeName + " event.target.value=" + event.target.value);

	var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);

	if (prefs.getIntPref("network.cookie.cookieBehavior") == 0) {
		prefs.setIntPref("network.cookie.cookieBehavior", 2);
	} else {
		prefs.setIntPref("network.cookie.cookieBehavior", 0);
	}

	updateLabels("quick-cookies-label", prefs.getIntPref("network.cookie.cookieBehavior") == 0);
}

function toggleJavascript(event)
{
	var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
	prefs.setBoolPref("javascript.enabled", !prefs.getBoolPref("javascript.enabled"));
	updateLabels("quick-javascript-label", prefs.getBoolPref("javascript.enabled"));
}

function setProxy(host, port)
{
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

	updateValues("quick-proxy-value", document.getElementById("quick-proxy-value").value);
}

/* if proxy is enabled and user changes proxy spec, update */
function updateProxy(event)
{
	var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
	if (prefs.getIntPref("network.proxy.type") == 1) {
		var proxy = document.getElementById("quick-proxy-value").value.split(':');
		var port = parseInt(proxy[1]);
		// window.dump("toggleProxy() proxy[0]=" + proxy[0] + " port=" + port);
		if (!isNaN(port)) {
			setProxy(proxy[0], port);
			updateValues("quick-proxy-value", document.getElementById("quick-proxy-value").value);
		}
	}
}

function toggleProxy(event)
{
	// alert("toggleProxy() event.target.nodeName=" + event.target.nodeName + " event.target.value=" + event.target.value);
	// window.dump("toggleProxy() event.target.nodeName=" + event.target.nodeName + " event.target.value=" + event.target.value);

	var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
	if (prefs.getIntPref("network.proxy.type") != 1) {
		var proxy = document.getElementById("quick-proxy-value").value.split(':');
		var port = parseInt(proxy[1]);
		// window.dump("toggleProxy() proxy[0]=" + proxy[0] + " port=" + port);
		if (!isNaN(port)) {
			setProxy(proxy[0], port);
			prefs.setIntPref("network.proxy.type", 1);
			updateValues("quick-proxy-value", document.getElementById("quick-proxy-value").value);
		} else {
			alert("not a valid proxy - should be host:port");
		}
	} else {
		prefs.setIntPref("network.proxy.type", 0);
	}
	
	updateLabels("quick-proxy-label", prefs.getIntPref("network.proxy.type") == 1);
}

function quickTogglesInit(event)
{
	// log("quickTogglesInit() event.target.value=" + event.target.value + " event.target.type=" + event.target.type);
	var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);

	updateLabels("quick-cookies-label", prefs.getIntPref("network.cookie.cookieBehavior") == 0);
	updateLabels("quick-javascript-label", prefs.getBoolPref("javascript.enabled"));
	updateLabels("quick-proxy-label", prefs.getIntPref("network.proxy.type") == 1);

	updateValues("quick-proxy-value", prefs.getCharPref("network.proxy.http") + ":" + prefs.getIntPref("network.proxy.http_port"));
}

/* vim:set sw=8 noet: */
