var app = require('./server.js');
var Promise = require('bluebird');
var adb = require('adbkit');
var shell = require('shelljs');
var android_ip_address = "10.4.28.54";

var watch_adb_Gesture = {
  right: 'shell input swipe 250 200 5 200',
  left: 'shell input swipe 5 150 300 150',
  down: 'shell input swipe 260 40 260 300',
  up: 'shell input swipe 260 250 260 30',
  tap : 'shell input tap 150 150'
}

// var watchClient = adb.createClient(); //actually is phone, sorry


// var option = {
//       port : 5555,
//       host : android_ip_address,
//       bin : 'adb'
//     }
// var watchRealClient = undefined;

var phoneID = undefined;
var watchID = undefined;

var smartWatchControl = {
  connect: function () {

    shell.exec('adb kill-server', {silent:false,async:true},function (code, output) {
      shell.exec('adb devices', {silent:false,async:true},function (code, output) {
        shell.exec('adb forward tcp:4444 localabstract:/adb-hub', {silent:false,async:true},function (code, output) {
          shell.exec('adb connect localhost:4444', {silent:false,async:true});
        });
      });  
    });
    
    
    
    

    // watchClient.connect(android_ip_address, "5555", function () {
      
    //   watchClient.listDevices()
    //     .then(function (devices) {
    //       return Promise.map(devices, function(device) {
    //         phoneID = device.id;
    //         return watchClient.forward(device.id, 'tcp:4444', 'localabstract:/adb-hub');
    //       })
    //     })
    //     .then(function() {
    //       console.log('Done.');
          // shell.exec('adb -s' + android_ip_address + ':5555 connect localhost:4444', {silent:false,async:true});
          // shell.exec('adb -s' + android_ip_address + ':5555 connect localhost:4444', {silent:false,async:true});
          // watchRealClient = adb.createClient(option);
          // console.log("connectWatch")
          // watchRealClient.connect('localhost', "4444", function () {
          //   console.log("hhihi");
          //   watchRealClient.listDevices()
          //     .then(function (devices) {
          //       return Promise.map(devices, function(device) {
          //         watchID = device.id;
          //         return;
          //       })
          //     })
          //     .then(function() {
          //       console.log('Done.');
          //     })
          //     .catch(function(err) {
          //       console.error('Something went wrong:', err.stack);
          //     })
          // });
    //     })
    //     .catch(function(err) {
    //       console.error('Something went wrong:', err.stack);
    //     })
    // });

    


  },
  swipeUp: function () {
    shell.exec('adb -s localhost:4444 ' + watch_adb_Gesture.up);
    // watchRealClient.shell(watchID, watch_adb_Gesture.up);
  },
  swipeDown: function () {
    shell.exec('adb -s localhost:4444 ' + watch_adb_Gesture.down);
    // watchRealClient.shell(watchID, watch_adb_Gesture.down);
  },
  swipeRight: function () {
    shell.exec('adb -s localhost:4444 ' + watch_adb_Gesture.right);
    // watchRealClient.shell(watchID, watch_adb_Gesture.right);
  },
  swipeLeft: function () {
    shell.exec('adb -s localhost:4444 ' + watch_adb_Gesture.left);
    // watchRealClient.shell(watchID, watch_adb_Gesture.left);
  },
  tap: function () {
    shell.exec('adb -s localhost:4444 ' + watch_adb_Gesture.tap);
    // watchRealClient.shell(watchID, watch_adb_Gesture.tap);
  },
  disconnect: function () {
    shell.exec('adb forward --remove-all',{silent:false,async:true});
    // watchRealClient.disconnect(watchID)
    // watchClient.disconnect(phoneID);
  }
}

module.exports = smartWatchControl;