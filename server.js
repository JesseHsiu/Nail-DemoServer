//==== Import Modules ====
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');
var shell = require('shelljs');
var fs = require('fs');
var csv = require("fast-csv");



//==== State Machine ====
var stateMachine = {
  IDLE: 0,
  RECORDING: 1,
  DEMOING: 2,
};

var controlThing = {
  NONE: 0,
  SMARTTV: 1,
  PHONE: 2,
  WATCH: 3,
};


var appStateMachine = stateMachine.IDLE;
var appControlThing = controlThing.NONE;


//==== Express Settings ====
app.use( bodyParser.json() ); 
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

// Web Interface. "ajax"
app.get('/', function(req, res){
   // res.render('index.html');
   res.sendFile(__dirname + '/index.html');
});

app.listen(3000);


// parameter for global use


//==== trainning part ====


//==== predict part ====

//==== storing data part --- Trainning ====
var trainningPart ={

  csvStream : csv.createWriteStream({headers: true}),
  currentSwipe : 0,
  currentTime : 0,
  // TODO: need to identify current swipe gesture, times.
  // 
  // var receivedString = "0 10 11 12 13 14 15 16 17 18"
  // currentSwipe = 5
  // currentTime = 5
  // calibrationBase = [1,1,1,1,1,1,1,1,1]
  // 
  recordData: function(receivedString, currentSwipe, currentTime, calibrationBase) {
    needToStoreData = receivedString.split(" ")
    console.log(needToStoreData)

    this.csvStream = csv.createWriteStream({headers: true});
    writableStream = fs.createWriteStream("./data/origin/T"+ currentTime + "_d"+ currentSwipe  + ".csv");
    // writableStream.on("finish", function(){
      // console.log("DONE!");
    // });
     
    this.csvStream.pipe(writableStream);
    // for (var i = 0; i < 100; i++) {
    this.csvStream.write({sg0: needToStoreData[1] - calibrationBase[0], sg2: needToStoreData[2] - calibrationBase[1], sg3: needToStoreData[3] - calibrationBase[2], sg4: needToStoreData[4] - calibrationBase[3], sg5: needToStoreData[5] - calibrationBase[4], sg6: needToStoreData[6] - calibrationBase[5], sg7: needToStoreData[7] - calibrationBase[6], sg8: needToStoreData[8] - calibrationBase[7], sg9: needToStoreData[9] - calibrationBase[8]});
    // };
  },
  endOfrecording: function () {
    this.csvStream.end();
  },

  generateModel: function  () {
    shell.cd('data')
    shell.cd('origin')

    shell.exec('python main.py', {silent:true}).output;

    shell.cd('..')
    shell.cd('calculated') 
    shell.exec('python main.py', {silent:true}).output;
    shell.exec('python csv2libsvm.py', {silent:true}).output;
    shell.cd('..')
    shell.cd('..')
  },
  clearDatas: function (argument) {
    // body...
  }

}

//==== storing data part --- Predict ====
var predictPart ={
  csvStream : csv.createWriteStream({headers: true}),

  recordData: function(receivedString, calibrationBase) {
    needToStoreData = receivedString.split(" ")
    console.log(needToStoreData)

    this.csvStream = csv.createWriteStream({headers: true});
    writableStream = fs.createWriteStream("./data/predict/predict.csv");
    // writableStream.on("finish", function(){
      // console.log("DONE!");
    // });
     
    this.csvStream.pipe(writableStream);
    // for (var i = 0; i < 100; i++) {
    this.csvStream.write({sg0: needToStoreData[1] - calibrationBase[0], sg2: needToStoreData[2] - calibrationBase[1], sg3: needToStoreData[3] - calibrationBase[2], sg4: needToStoreData[4] - calibrationBase[3], sg5: needToStoreData[5] - calibrationBase[4], sg6: needToStoreData[6] - calibrationBase[5], sg7: needToStoreData[7] - calibrationBase[6], sg8: needToStoreData[8] - calibrationBase[7], sg9: needToStoreData[9] - calibrationBase[8]});
    // };
  },
  endOfrecording: function () {
    this.csvStream.end();
  },
  predictOnModel: function () {
    shell.cd('data')
    shell.cd('mlFiles')
    shell.exec('svm-scale trainning.ml > trainning.ml.scale', {silent:true}).output;
    shell.exec('svm-scale needToPredict.ml > needToPredict.ml.scale', {silent:true}).output;
    shell.exec('python main.py', {silent:true}).output;
    shell.cd('..')
    shell.cd('..')

    fs.readFile('./data/mlFiles/needToPredict.ml.predict', 'utf8', function (err,data) {
      if (err) {
        return -1;
      }
      data = data.split("\n");
      resultOfML = data[0].replace(/\s/g, "X");

      return int(resultOfML);
    });
  },
  clearDatas: function (argument) {
    // body...
  },
}


// === GET SG VALUES PART ===

var foo = function() {
  console.log("Foo Called");
};

app.post('/', function(req, res) {
  console.log(req.rawHeaders);
  foo();
  res.sendStatus(200);
});