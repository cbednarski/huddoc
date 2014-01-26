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

function ghost(selector) {
  var el = jQuery(selector);
  var g = document.createElement('div');

  g.className = '.huddoc_box';
  // g.style.display = 'block';
  // g.style.position = 'absolute';
  g.style.width = pixelate(el.width());
  g.style.height = pixelate(el.height());
  g.style.top = pixelate(getTopOffset(el.offset().top));
  g.style.left = pixelate(el.offset().left);
  // g.style.background = 'rgba(255,255,128,.4)';
  // g.style.color = '#fff';
  // g.style.font = 'bold 14px helvetica, arial, sans-serif';
  // g.style.zIndex = '9999999';

  document.body.appendChild(g);

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
      el.innerHTML = '<b style="font-size:30px;">' + rule.title + '</b> '
       + rule.description + ' <a style="color: #f00; text-decoration: none;" href="mailto:'
       + rule.email + '">email</a>';
    }
  }
}

huddoc_message();
loadRules();