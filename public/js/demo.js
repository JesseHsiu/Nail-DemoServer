
function testAddData () {
    $.post( "http://127.0.0.1:3000/", { datas: "0 10 11 12 13 14 15 16 17 18" } );
}
function testAddInitData () {
    $.post( "http://127.0.0.1:3000/", { datas: "0 0 0 0 0 0 0 0 0 0" } );
}



function sendStart () {
    $.ajax({
        url: 'http://127.0.0.1:3000/predict/start',
        dataType: "jsonp",
        jsonpCallback: "_testcb",
        cache: false,
        timeout: 5000,
        success: function(data) {
        	obj = JSON.parse(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('error ' + textStatus + " " + errorThrown);
        }
    });
}


function sendEnd () {
    $.ajax({
        url: 'http://127.0.0.1:3000/predict/end',
        dataType: "jsonp",
        jsonpCallback: "_testcb",
        cache: false,
        timeout: 5000,
        success: function(data) {
            obj = JSON.parse(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('error ' + textStatus + " " + errorThrown);
        }
    });
}

function startGesture () {
    if ($('#startDemoBtn').hasClass('active') == false)
    {
        $('#startDemoBtn').addClass('active');
        sendStart();
    }
    else
    {
        $('#startDemoBtn').removeClass('active');
        sendEnd();
    }    
}

function clearData () {
    $.ajax({
        url: 'http://127.0.0.1:3000/predict/reset',
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