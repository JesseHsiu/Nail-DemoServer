var app = require('./server.js');
var http = require('http');
var qs = require('querystring');

var remoteIPAddress = '10.4.28.33';
var portNumber = 3000;


var smartTVControl = {
  swipeUp: function () {
    this.sendRequest('0');    
  },
  swipeDown: function () {
    this.sendRequest('2');
  },
  swipeRight: function () {
    this.sendRequest('1');
  },
  swipeLeft: function () {
    this.sendRequest('3');
  },
  tap: function () {
    this.sendRequest('4');
  },
  sendRequest: function(gesture)
  {

    var postData = qs.stringify({
      'msg' : gesture
    });

    var options = {
      hostname: remoteIPAddress,
      port: portNumber,
      path: '/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': postData.length
      }
    };

    var req = http.request(options, function(res) {
      res.setEncoding('utf8');
    });

    req.write(postData);
    req.end();
  }
}

module.exports = smartTVControl;