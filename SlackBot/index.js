var https = require('https');

var options = {
  host: 'slack.com',
  port: '443',
  path: '/api/chat.postMessage?token='+process.env.app_auth_logn,
  method: 'GET'
};
//https://slack.com/api/chat.postMessage?&channel=C5CQ4HC6A&text=viapost&username=Pask%20Ghost&icon_emoji=%3Aghost%3A&pretty=1

function postMessage(context, req) {
    
    var message = '&channel=' + encodeURI(req.body.channel) + '&username=' + encodeURI(req.body.username) + '&text=' + encodeURI(req.body.message) + '&icon_emoji=' + encodeURI(req.body.emoji);

    context.log('Responding with: ', message);
    context.log('Options: ', options);

    var slackSend = https.request(options, function(res) {
        var msg = '';
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            msg += chunk;
        });
        res.on('end', function() {
            var myresult = JSON.parse(msg);
    
            context.res = {
                body: myresult
            };
            context.done();
        });
    });
    slackSend.end();
}


module.exports = function(context, req) {
    context.log('Node.js HTTP trigger function processed a request. RequestUri=%s', req.originalUrl);

    postMessage(context, req);
};