function upTest () {
    $.ajax({
        url: 'http://10.4.28.5:3000/demo/0',
        dataType: "jsonp",
        jsonpCallback: "_testcb",
        cache: false,
        timeout: 5000,
        success: function(data) {
        },
        error: function(jqXHR, textStatus, errorThrown) {
        }
    });
}

function rightTest () {
    $.ajax({
        url: 'http://10.4.28.5:3000/demo/1',
        dataType: "jsonp",
        jsonpCallback: "_testcb",
        cache: false,
        timeout: 5000,
        success: function(data) {
        },
        error: function(jqXHR, textStatus, errorThrown) {
        }
    });
}

function downTest () {
    $.ajax({
        url: 'http://10.4.28.5:3000/demo/2',
        dataType: "jsonp",
        jsonpCallback: "_testcb",
        cache: false,
        timeout: 5000,
        success: function(data) {
        },
        error: function(jqXHR, textStatus, errorThrown) {
        }
    });
}

function leftTest () {
    $.ajax({
        url: 'http://10.4.28.5:3000/demo/3',
        dataType: "jsonp",
        jsonpCallback: "_testcb",
        cache: false,
        timeout: 5000,
        success: function(data) {
        },
        error: function(jqXHR, textStatus, errorThrown) {
        }
    });
}

function tapTest () {
    $.ajax({
        url: 'http://10.4.28.5:3000/demo/4',
        dataType: "jsonp",
        jsonpCallback: "_testcb",
        cache: false,
        timeout: 5000,
        success: function(data) {
        },
        error: function(jqXHR, textStatus, errorThrown) {
        }
    });
}