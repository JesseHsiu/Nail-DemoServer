var currentGesture = 0;
var trainningIsEnd = false;
var gestures = {
  UP: 0,
  RIGHT: 1,
  DOWN: 2,
  LEFT: 3,
  TAP: 4,
};

$(document).ready(function() {
    $.ajax({
        url: 'http://127.0.0.1:3000/trainning/sync',
        dataType: "jsonp",
        jsonpCallback: "_testcb",
        cache: false,
        timeout: 5000,
        success: function(data) {
            obj = JSON.parse(data);
            console.log(Boolean(obj.finished))
            currentGesture = parseInt(obj.currentGesture)

            if (obj.finished === "true")
            {
                $('#startTrainningBtn').addClass('disabled');
            };
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('error ' + textStatus + " " + errorThrown);
        }
    });
});

function sendStart () {
    $.ajax({
        url: 'http://127.0.0.1:3000/trainning/start',
        dataType: "jsonp",
        jsonpCallback: "_testcb",
        cache: false,
        timeout: 5000,
        success: function(data) {

        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('error ' + textStatus + " " + errorThrown);
        }
    });
}

function testAddData () {
    $.post( "http://127.0.0.1:3000/", { datas: "0 10 11 12 13 14 15 16 17 18" } );
}
function testAddInitData () {
    $.post( "http://127.0.0.1:3000/", { datas: "0 0 0 0 0 0 0 0 0 0" } );
}



function sendEnd () {
    $.ajax({
        url: 'http://127.0.0.1:3000/trainning/end',
        dataType: "jsonp",
        jsonpCallback: "_testcb",
        cache: false,
        timeout: 5000,
        success: function(data) {
            obj = JSON.parse(data);
            currentGesture = parseInt(obj.currentGesture)
            if (obj.finished === "true")
            {
                $('#startTrainningBtn').addClass('disabled');
            };
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('error ' + textStatus + " " + errorThrown);
        }
    });
}

function startTrainning () {
    if ($('#startTrainningBtn').hasClass('active') == false)
    {
        $('#startTrainningBtn').addClass('active');
        sendStart();
    }
    else
    {
        $('#startTrainningBtn').removeClass('active');
        sendEnd();
    }    
}

function buildModel () {
    $.ajax({
        url: 'http://127.0.0.1:3000/trainning/buildmodel',
        dataType: "jsonp",
        jsonpCallback: "_testcb",
        cache: false,
        timeout: 5000,
        success: function(data) {

        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('error ' + textStatus + " " + errorThrown);
        }
    });
}

function clearData () {
    $.ajax({
        url: 'http://127.0.0.1:3000/trainning/reset',
        dataType: "jsonp",
        jsonpCallback: "_testcb",
        cache: false,
        timeout: 5000,
        success: function(data) {
            
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('error ' + textStatus + " " + errorThrown);
        }
    });
}


