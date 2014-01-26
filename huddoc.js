function activate() {
  chrome.tabs.executeScript({code: 'activate()'});
  return true;
}

function deactivate() {
  chrome.tabs.executeScript({code: 'deactivate()'});
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

function initialize(tabId) {
  chrome.tabs.executeScript(tabId, {file: 'jquery-2.1.0.min.js'});
  chrome.tabs.executeScript(tabId, {file: 'show_messages.js'});
  chrome.tabs.insertCSS(tabId, {file: 'huddoc.css'});
  chrome.pageAction.show(tabId);
}

function dismantle(tabId) {
  chrome.pageAction.hide(tabId);
}

var Ajax = {
  request: function(method, url, callback, payload) {
    var req = new XMLHttpRequest();
    req.open(method, url);
    req.onreadystatechange = function() {
      if (req.readyState === 4) {
        callback(req.responseText, req);
      }
    };
    req.send(payload);
  },
  get: function(url, callback) {
    this.request('GET', url, callback);
  },
  post: function(url, payload, callback) {
    this.request('POST', url, callback, payload);
  }
};

var ruleset;

function urlInRuleset(url, ruleset) {
  for (i in ruleset) {
    if (url.match(new RegExp(ruleset[i].mask))) {
      console.log('url ' + url + ' matched rule ' + ruleset[i].mask);
      return true;
    }
  }
  console.log('url ' + url + ' does not match any rules');
  return false;
}

function moreMagic(tabId, url, ruleset) {
  if (urlInRuleset(url, ruleset)) {
    initialize(tabId);
  } else {
    dismantle(tabId);
  }
}

function checkForValidUrl(tabId, changeInfo, tab) {
  if (ruleset === undefined) {
    Ajax.get('ruleset.json', function(data) {
      ruleset = JSON.parse(data);
      moreMagic(tabId, tab.url, ruleset);
    });
  } else {
    moreMagic(tabId, tab.url, ruleset);
  }
};

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);

chrome.pageAction.onClicked.addListener(function () {
  toggle();
});
