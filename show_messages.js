"use strict";

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

function huddoc_message() {
  console.log('never fear, huddoc is here!');
}

function pixelate(measure) {
  return "" + measure + "px";
}

function getTopOffset(top) {
  var el = document.getElementsByTagName('body')[0];
  var style = window.getComputedStyle(el);
  var marginTop = style.getPropertyValue('margin-top');
  var diff = marginTop.match(/[0-9]+/);
  return top - parseInt(diff);
}

function getPosition(selector) {
  var el = jQuery(selector);
  var style = window.getComputedStyle(el);
}

function ghost(selector) {
  var el = jQuery(selector);
  if (el.length === 0) { return false; } // guard
  var g = document.createElement('div');

  g.className = 'huddoc_box';
  g.style.width = pixelate(el.width());
  g.style.height = pixelate(el.height());
  g.style.top = pixelate(getTopOffset(el.offset().top));
  g.style.left = pixelate(el.offset().left);

  document.body.appendChild(g);

  return g;
}

function addMessage(g, rule) {
  if (!g) { return false }; // guard
  var c = '';

  if (rule.title) {
    c += '<span class="huddoc_title">' + rule.title + '</span> ';
  }
  
  if (rule.description) {
    c += '<span class="huddoc_description">' + rule.description + '</span> ';
  }

  if (rule.email) {
    c += '<a href="mailto:' + rule.email + '" class="huddoc_link">email</a> ';
  }

  if (rule.url) {
    c += '<a href="' + rule.url + '" class="huddoc_link">info</a> ';
  }

  g.innerHTML = c;

  return g;
}

var ruleset;

function loadRules() {
  Ajax.get(chrome.extension.getURL('ruleset.json'), function(data, request) {
    ruleset = JSON.parse(data);
  });
}

function check_mask(mask) {
  var re = new RegExp(mask);
  if (window.location.href.match(re)) {
    return true;
  }
  return false;
}

function activate() {
  for (var i in ruleset) {
    var rule = ruleset[i];
    if (check_mask(rule.match)) {
      var el = ghost(rule.selector);
      addMessage(el, rule);
    }
  }
}

function deactivate() {
  jQuery('.huddoc_box').remove();
}

huddoc_message();
loadRules();