const AND_SIGN = '&';

function sendRequest(url, params, callback) {
    //var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    var http = new XMLHttpRequest();

    http.open('POST', url, true);
    http.setRequestHeader('Content-type', 'application/json');

    // alert('I am here');
    http.onreadystatechange = callback(http);

    http.send(JSON.stringify(params));
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split(AND_SIGN);
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) === variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    console.log('Query variable %s not found', variable);
    return null;
}

function submitScore(score) {
    // var url = 'https://verokhina.vkpartner.ru/server.php';
    var url = 'https://2c48b2eb.ngrok.io/~Viktoria/server.php';
    var params = {
        'score': score,
        'viewer_id': getQueryVariable('viewer_id'),
        'api_id': getQueryVariable('api_id'),
        'auth_key': getQueryVariable('auth_key')
    };

    sendRequest(url, params, function(http) {
        return function() {
            console.log("Update!");
            if (http.readyState == 4 && http.status == 200) {
                console.log(http.responseText);
                alert(http.responseText);
            }
        }
    });
}
