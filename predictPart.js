var app = require('./server.js');
var shell = require('shelljs');
var fs = require('fs');
var csv = require("fast-csv");

//==== storing data part --- Predict ====
var predictPart ={
  csvStream : csv.createWriteStream({headers: true}),
  SGsBase : app.locals.SGs,
  recordData: function(receivedString) {
    needToStoreData = receivedString.split(" ")
    console.log(needToStoreData)

    this.csvStream = csv.createWriteStream({headers: true});
    writableStream = fs.createWriteStream("./data/predict/predict.csv");
    // writableStream.on("finish", function(){
      // console.log("DONE!");
    // });
     
    this.csvStream.pipe(writableStream);
    // for (var i = 0; i < 100; i++) {
    this.csvStream.write({sg0: needToStoreData[1] - this.SGsBase.calibrationBase[0], sg2: needToStoreData[2] - this.SGsBase.calibrationBase[1], sg3: needToStoreData[3] - this.SGsBase.calibrationBase[2], sg4: needToStoreData[4] - this.SGsBase.calibrationBase[3], sg5: needToStoreData[5] - this.SGsBase.calibrationBase[4], sg6: needToStoreData[6] - this.SGsBase.calibrationBase[5], sg7: needToStoreData[7] - this.SGsBase.calibrationBase[6], sg8: needToStoreData[8] - this.SGsBase.calibrationBase[7], sg9: needToStoreData[9] - this.SGsBase.calibrationBase[8]});
    // };
  },
  endOfrecording: function () {
    this.csvStream.end();
  },
  generateModel: function  () {
    shell.cd('data')
    shell.cd('predict')

    shell.exec('python preprocessed.py', {silent:true}).output;

    shell.cd('..')
    shell.cd('calculated_p') 
    shell.exec('python csv2libsvm.py', {silent:true}).output;
    shell.cd('..')
    shell.cd('..')
  },


  predictOnModel: function () {
    shell.cd('data')
    shell.cd('mlFiles')
    shell.exec('svm-scale trainning.ml > trainning.ml.scale', {silent:true}).output;
    shell.exec('svm-scale predict.ml > predict.ml.scale', {silent:true}).output;
    shell.exec('python predictNow.py', {silent:true}).output;
    shell.cd('..')
    shell.cd('..')

    fs.readFile('./data/mlFiles/predict.ml.predict', 'utf8', function (err,data) {
      if (err) {
        return -1;
      }
      data = data.split("\n");
      resultOfML = data[0].replace(/\s/g, "X");

      return int(resultOfML);
    });
  },
  clearDatas: function (argument) {
    shell.rm('./data/predict/*.csv');
    shell.rm('./data/calculated_p/*.csv');

    shell.rm('./data/mlFiles/predict.ml');
    shell.rm('./data/mlFiles/predict.ml.scale');
    shell.rm('./data/mlFiles/predict.ml.predict');
  },
}

module.exports = predictPart;