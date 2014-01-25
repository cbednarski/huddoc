function activate() {
    chrome.browserAction.setBadgeBackgroundColor({color: [0,255,128,255]});
    chrome.browserAction.setBadgeText({text: "On"});
    chrome.tabs.executeScript({code: 'activate()'});
    return true;
}

function deactivate() {
    chrome.browserAction.setBadgeBackgroundColor({color: [255,0,128,255]});
    chrome.browserAction.setBadgeText({text: "Off"});
    return false;
}

var activated = deactivate();
var initialized = false;

function toggle() {
    if (activated) {
        activated = deactivate();
    } else {
        activated = activate();
    }
}

chrome.browserAction.onClicked.addListener(function() {
    if (!initialized) {
        chrome.tabs.executeScript(null, {file: 'jquery-2.1.0.min.js'});
        chrome.tabs.executeScript(null, {file: 'show_messages.js'});
        initialized = true;
        // Wait for the extension DOM to load. Kinda kludgey
        setTimeout(toggle, 100);
    } else {
        toggle();
    }
});

