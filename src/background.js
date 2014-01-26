"use strict";

function activate(tabId) {
  chrome.tabs.executeScript(tabId, {code: 'activate()'});
  return true;
}

function deactivate(tabId) {
  chrome.tabs.executeScript(tabId, {code: 'deactivate()'});
  return false;
}

var activated = [];

function toggle(tabId) {
  if (activated[tabId]) {
    activated[tabId] = deactivate(tabId);
  } else {
    activated[tabId] = activate(tabId);
  }
}

function initialize(tabId) {
  chrome.tabs.executeScript(tabId, {file: 'jquery-2.1.0.min.js'});
  chrome.tabs.executeScript(tabId, {file: 'ajax.js'});
  chrome.tabs.executeScript(tabId, {file: 'in_browser.js'});
  chrome.tabs.insertCSS(tabId, {file: 'huddoc.css'});
  chrome.pageAction.show(tabId);
}

function dismantle(tabId) {
  chrome.pageAction.hide(tabId);
}

var ruleset;

function urlInRuleset(url, ruleset) {
  for (var i in ruleset) {
    if (url.match(new RegExp(ruleset[i].mask))) {
      // console.log('url ' + url + ' matched rule ' + ruleset[i].mask);
      return true;
    }
  }
  // console.log('url ' + url + ' does not match any rules');
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

chrome.pageAction.onClicked.addListener(function (tab) {
  toggle(tab.id);
});
