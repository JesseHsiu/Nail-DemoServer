var app = require('./server.js');
var Promise = require('bluebird');
var adb = require('adbkit');
var android_ip_address = "10.4.28.54";

var adb_Gesture = {
  right: 'input swipe 200 900 700 900',
  left: 'input swipe 700 900 200 900',
  down: 'input swipe 450 1200 450 500',
  up: 'input swipe 450 500 450 1200',
  tap : 'input keyevent KEYCODE_HOME'
}

var phoneClient = adb.createClient();
var phoneID = undefined;

var smartPhoneControl = {
  connect: function () {
    
    
    phoneClient.connect(android_ip_address, "5555", function () {
      
      phoneClient.listDevices()
        .then(function (devices) {
          return Promise.map(devices, function(device) {
            phoneID = device.id;
            return;
            // phoneClient.shell(device.id, 'echo $RANDOM')
          })
        })
        .then(function() {
          console.log('Done.')
        })
        .catch(function(err) {
          console.error('Something went wrong:', err.stack)
        })
    });
  },
  swipeUp: function () {
    phoneClient.shell(phoneID, adb_Gesture.up);
  },
  swipeDown: function () {
    phoneClient.shell(phoneID, adb_Gesture.down);
  },
  swipeRight: function () {
    phoneClient.shell(phoneID, adb_Gesture.right);
  },
  swipeLeft: function () {
    phoneClient.shell(phoneID, adb_Gesture.left);
  },
  tap: function () {
    phoneClient.shell(phoneID, adb_Gesture.tap);
  },
  disconnect: function () {
    phoneClient.disconnect(phoneID);
  }
}

module.exports = smartPhoneControl;