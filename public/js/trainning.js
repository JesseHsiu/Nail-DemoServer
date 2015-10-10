// $.ajax({
//         url: 'http://127.0.0.1:3000/test',
//         dataType: "jsonp",
//         jsonpCallback: "_testcb",
//         cache: false,
//         timeout: 5000,
//         success: function(data) {
//             obj = JSON.parse(data);
//             $("#test").append(obj.message);
//         },
//         error: function(jqXHR, textStatus, errorThrown) {
//             alert('error ' + textStatus + " " + errorThrown);
//         }
//     });

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

function sendEnd () {
    $.ajax({
        url: 'http://127.0.0.1:3000/trainning/end',
        dataType: "jsonp",
        jsonpCallback: "_testcb",
        cache: false,
        timeout: 5000,
        success: function(data) {
            obj = JSON.parse(data);
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


