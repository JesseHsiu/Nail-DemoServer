var socket = io('http://localhost:8080');

var plotdata = [
  {
    x: ['sg1', 'sg2', 'sg3', 'sg4', 'sg5', 'sg6', 'sg7', 'sg8', 'sg9'],
    y: [500,500,500,500,500,500,500,500,500,500],
    type: 'bar',
    marker: {
      color: 'rgba(1,1,1,0.0)'
    }
    // marker:{
    //   color: ['rgba(204,204,204,1)', 'rgba(222,45,38,0.8)', 'rgba(204,204,204,1)', 'rgba(204,204,204,1)', 'rgba(204,204,204,1)']
    // },
  },
  {
    x: ['sg1', 'sg2', 'sg3', 'sg4', 'sg5', 'sg6', 'sg7', 'sg8', 'sg9'],
    y: [0,0,0,0,0,0,0,0,0,0],
    type: 'bar'
    // marker:{
    //   color: ['rgba(204,204,204,1)', 'rgba(222,45,38,0.8)', 'rgba(204,204,204,1)', 'rgba(204,204,204,1)', 'rgba(204,204,204,1)']
    // },
  }
];
var layout = {
  width: 600,
  height: 600,
  barmode: 'stack',
  yaxis:{
    range:[
      0,
     1024
    ],
    type:"linear",
    autorange:false,
    fixedrange:true,
    tickmode:"linear",
    dtick:100,
    ticks:""
  },
  showlegend:false,
  margin:{
    t:10,
    b:40,
    l:40,
    r:20
  }
};
// window.setInterval(function(){

//   $.ajax({
//       url: 'http://127.0.0.1:3000/SGValues',
//       dataType: "jsonp",
//       jsonpCallback: "_SGValues",
//       cache: false,
//       timeout: 5000,
//       success: function(data) {
//         // console.log(data)
//         obj = JSON.parse(data);
//         var values = obj.values.split(",");
//         // console.log(values[0])
//           // updatesFromResponse(data);
//         plotdata[1].y[0] = parseInt(values[0]) - plotdata[0].y[0];//- plotdata[0].y[0]
//         plotdata[1].y[1] = parseInt(values[1]) - plotdata[0].y[1];//- plotdata[0].y[1]
//         plotdata[1].y[2] = parseInt(values[2]) - plotdata[0].y[2];//- plotdata[0].y[2]
//         plotdata[1].y[3] = parseInt(values[3]) - plotdata[0].y[3];//- plotdata[0].y[3]
//         plotdata[1].y[4] = parseInt(values[4]) - plotdata[0].y[4];//- plotdata[0].y[4]
//         plotdata[1].y[5] = parseInt(values[5]) - plotdata[0].y[5];//- plotdata[0].y[5]
//         plotdata[1].y[6] = parseInt(values[6]) - plotdata[0].y[6];//- plotdata[0].y[6]
//         plotdata[1].y[7] = parseInt(values[7]) - plotdata[0].y[7];//- plotdata[0].y[7]
//         plotdata[1].y[8] = parseInt(values[8]) - plotdata[0].y[8];//- plotdata[0].y[8]
//         Plotly.newPlot('plotArea', plotdata, layout);
//       },
//       error: function(jqXHR, textStatus, errorThrown) {
//           // alert('error ' + textStatus + " " + errorThrown);
//       }
//   });
// }, 100);


socket.on('newSGValues', function (data) {
    var values = data.values;
    plotdata[1].y[0] = parseInt(values[0]) - plotdata[0].y[0];//- plotdata[0].y[0]
    plotdata[1].y[1] = parseInt(values[1]) - plotdata[0].y[1];//- plotdata[0].y[1]
    plotdata[1].y[2] = parseInt(values[2]) - plotdata[0].y[2];//- plotdata[0].y[2]
    plotdata[1].y[3] = parseInt(values[3]) - plotdata[0].y[3];//- plotdata[0].y[3]
    plotdata[1].y[4] = parseInt(values[4]) - plotdata[0].y[4];//- plotdata[0].y[4]
    plotdata[1].y[5] = parseInt(values[5]) - plotdata[0].y[5];//- plotdata[0].y[5]
    plotdata[1].y[6] = parseInt(values[6]) - plotdata[0].y[6];//- plotdata[0].y[6]
    plotdata[1].y[7] = parseInt(values[7]) - plotdata[0].y[7];//- plotdata[0].y[7]
    plotdata[1].y[8] = parseInt(values[8]) - plotdata[0].y[8];//- plotdata[0].y[8]
    Plotly.newPlot('plotArea', plotdata, layout);
});

function setBase () {
  for (var i = 0; i < 9; i++) {
    plotdata[0].y[i] = plotdata[0].y[i] + plotdata[1].y[i];
  };

  $.ajax({
        url: 'http://127.0.0.1:3000/baseSet',
        dataType: "jsonp",
        jsonpCallback: "_testcb",
        cache: false,
        timeout: 5000,
        success: function(data) {
          
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // alert('error ' + textStatus + " " + errorThrown);
        }
  });
}

function setShowingBase (argument) {
  
  var storeDataToArray = argument.split(",");
  for (var i = 0; i < 9; i++) {
    plotdata[0].y[i] = parseInt(storeDataToArray[i]);
  };
  // console.log(plotdata[0]);
}