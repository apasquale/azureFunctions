var https = require('https');
var _ = require('lodash');

var options = {
  host: 'slack.com',
  port: '443',
  path: '/api/chat.postMessage?token='+process.env.app_auth_logn+'&username=Pask%20Ghost&icon_emoji=%3Aghost%3A&pretty=1',
  method: 'GET'
};
//https://slack.com/api/chat.postMessage?&channel=C5CQ4HC6A&text=viapost&username=Pask%20Ghost&icon_emoji=%3Aghost%3A&pretty=1

function postMessage(context) {
    
    var message = '&channel=' + req.body.channel + '&text=' + encodeURI(req.body.message);

    context.res = {
        body: message
    };

    // var dbreq = https.request(options, function(res) {
    //     var msg = '';
    //     res.setEncoding('utf8');
    //     res.on('data', function(chunk) {
    //         msg += chunk;
    //     });
    //     res.on('end', function() {
    //         var myresult = JSON.parse(msg);
            
    //         var message = "*Here are the available channels:*";
  
            
  
    //         context.res = {
    //             body: message
    //         };
    //         context.done();
    //     });
    // });
    // dbreq.end();
}


module.exports = function(context, req) {
    context.log('Node.js HTTP trigger function processed a request. RequestUri=%s', req.originalUrl);

    postMessage(context);
};