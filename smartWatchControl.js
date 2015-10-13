var app = require('./server.js');
var Promise = require('bluebird');
var adb = require('adbkit');
var android_ip_address = "10.4.28.54";

var watch_adb_Gesture = {
  right: 'input swipe 250 200 5 200',
  left: 'input swipe 5 150 300 150',
  down: 'input swipe 260 40 260 300',
  up: 'input swipe 260 250 260 30',
  tap : 'shell input tap 150 150'
}

var watchClient = adb.createClient();
var watchID = undefined;

var smartWatchControl = {
  connect: function () {

    watchClient.connect(android_ip_address, "5555", function () {
      
      watchClient.listDevices()
        .then(function (devices) {
          return Promise.map(devices, function(device) {
            watchID = device.id;
            return watchClient.forward(device.id, 'tcp:4444', 'localabstract:/adb-hub')
          })
        })
        .then(function() {
          console.log('Done.');
        })
        .catch(function(err) {
          console.error('Something went wrong:', err.stack);
        })
    });
  },
  swipeUp: function () {
    watchClient.shell(watchID, adb_Gesture.up);
  },
  swipeDown: function () {
    watchClient.shell(watchID, adb_Gesture.down);
  },
  swipeRight: function () {
    watchClient.shell(watchID, adb_Gesture.right);
  },
  swipeLeft: function () {
    watchClient.shell(watchID, adb_Gesture.left);
  },
  tap: function () {
    watchClient.shell(watchID, adb_Gesture.tap);
  },
  disconnect: function () {
    watchClient.disconnect(watchID);
  }
}

module.exports = smartWatchControl;