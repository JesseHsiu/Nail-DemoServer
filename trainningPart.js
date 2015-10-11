var app = require('./server.js');
var shell = require('shelljs');
var fs = require('fs');
var csv = require("fast-csv");

//==== storing data part --- Trainning ====
var trainningPart ={

  csvStream : null,
  finished : false,
  currentGesture : 0,
  currentTime : 0,
  writableStream : null,
  SGsBase : app.locals.SGs,
  // TODO: need to identify current swipe gesture, times.
  // 
  // var receivedString = "0 10 11 12 13 14 15 16 17 18"
  // currentSwipe = 5
  // currentTime = 5
  // app.locals.SGs.calibrationBase = [1,1,1,1,1,1,1,1,1]
  nextTask: function () {
    
    if (this.currentGesture < 4)
    {
      this.currentGesture++;
      
      return;
    }

    if (this.currentTime < 9)
    {
      this.currentTime++;
      this.currentGesture = 0;
      return;
    }
    else
    {
      this.finished = true;
      return;
    }

  },
  recordData: function(receivedString) {
    needToStoreData = receivedString.split(" ")
    console.log(needToStoreData)



    if (this.writableStream === null)
    {
      this.writableStream = fs.createWriteStream("./data/origin/T"+ this.currentTime + "_d"+ this.currentGesture  + ".csv")
    };

    if (this.csvStream === null)
    {
      this.csvStream = csv.createWriteStream({headers: true});
      this.csvStream.pipe(this.writableStream);
    };
    
    // writableStream.on("finish", function(){
      // console.log("DONE!");
    // });
    
    // for (var i = 0; i < 100; i++) {
    
    this.csvStream.write({sg0: needToStoreData[1] - this.SGsBase.calibrationBase[0], sg2: needToStoreData[2] - this.SGsBase.calibrationBase[1], sg3: needToStoreData[3] - this.SGsBase.calibrationBase[2], sg4: needToStoreData[4] - this.SGsBase.calibrationBase[3], sg5: needToStoreData[5] - this.SGsBase.calibrationBase[4], sg6: needToStoreData[6] - this.SGsBase.calibrationBase[5], sg7: needToStoreData[7] - this.SGsBase.calibrationBase[6], sg8: needToStoreData[8] - this.SGsBase.calibrationBase[7], sg9: needToStoreData[9] - this.SGsBase.calibrationBase[8]});
    // };
  },
  endOfrecording: function (callback) {
    // this.csvStream.end();
    // this.nextTask();
    // this.writableStream = null;
    // this.csvStream = null;

    this.csvStream.end();
    var tmp = this;
    this.csvStream.on("end", function(){
      
      tmp.nextTask();
      tmp.csvStream = null;
      tmp.writableStream = null;
      callback('ok');
    });

  },

  generateModel: function  () {
    shell.cd('data')
    shell.cd('origin')

    shell.exec('python preprocessed.py', {silent:true}).output;

    shell.cd('..')
    shell.cd('calculated') 
    shell.exec('python mergeFiles.py', {silent:true}).output;
    shell.exec('python csv2libsvm.py', {silent:true}).output;
    shell.cd('..')
    shell.cd('..')
  },
  clearDatas: function () {

    this.finished = false;
    this.currentGesture = 0;
    this.currentTime = 0;

    shell.rm('./data/origin/*.csv');
    shell.rm('./data/calculated/*.csv');

    shell.rm('./data/mlFiles/*.ml');
    shell.rm('./data/mlFiles/*.predict');
    shell.rm('./data/mlFiles/*.scale');
  }

}

module.exports = trainningPart;