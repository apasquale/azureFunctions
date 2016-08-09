var https = require('https');
var _ = require('lodash');

var options = {
  host: 'slack.com',
  port: '443',
  path: '/api/channels.list?token='+process.env.app_slack_authtoken+'&pretty=1',
  method: 'GET'
};

function buildMessage(item, msg) {
  msg += '\n\t- ' + item.name + ': ' + item.purpose.value;
  return msg;
}

function listChannels(context) {
    
    var dbreq = https.request(options, function(res) {
        var msg = '';
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            msg += chunk;
        });
        res.on('end', function() {
            var myresult = JSON.parse(msg);
            
            var message = "Here are the available channels:";
  
            _.each(myresult.channels, function(item) {message = buildMessage(item, message)});
  
            context.res = {
                body: message
            };
            context.done();
        });
    });
    dbreq.end();
}


module.exports = function(context, req) {
    context.log('Node.js HTTP trigger function processed a request. RequestUri=%s', req.originalUrl);

    listChannels(context);
};