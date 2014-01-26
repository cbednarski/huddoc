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
