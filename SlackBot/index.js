var https = require('https');

var options = {
  host: 'slack.com',
  port: '443',
  path: '',
  method: 'GET'
};

function postMessage(context, req) {
    context.log('In post message');

    var authtoken = req.body.authToken;
    if(!authtoken) {
        context.log('Getting auth token from env');
        authtoken = process.env.app_auth_logn;
    }

    var message = '/api/chat.postMessage?token=' + authtoken + '&channel=' + encodeURI(req.body.channel) + '&username=' + encodeURI(req.body.username) + '&text=' + encodeURI(req.body.message) + '&icon_emoji=' + encodeURI(req.body.emoji);

    options.path = message

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

function readMessage(context, req) {
    context.log('In read message');

    var authtoken = req.body.authToken;
    if(!authtoken) {
        context.log('Getting auth token from env');
        authtoken = process.env.app_auth_logn;
    }

    var message = '/api/channels.history?token=' + authtoken + '&channel=' + encodeURI(req.body.channel) + '&count=' + req.body.count;

    options.path = message

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
        res.on('error', function(err) {
            context.res = {
                error: err
            };
            context.done();
        });
    });
    slackSend.end();
}

function readMessage(context, req) {
    context.log('In read message');
    
    var excludeArchive = req.body.excludeArchive;
    if(!excludeArchive) {
        excludeArchive = false;
    }

    var excludeMembers = req.body.excludeMembers;
    if(!excludeMembers) {
        excludeMembers = true;
    }

    var authtoken = req.body.authToken;
    if(!authtoken) {
        context.log('Getting auth token from env');
        authtoken = process.env.app_auth_logn;
    }

    var message = '/api/channels.list?token=' + authtoken + '&exclude_archived=' + excludeArchive +  '&exclude_members=' + excludeMembers + '&pretty=1';

    options.path = message

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
        res.on('error', function(err) {
            context.res = {
                error: err
            };
            context.done();
        });
    });
    slackSend.end();
}

module.exports = function(context, req) {
    context.log('Node.js HTTP trigger function processed a request. RequestUri=%s', req.originalUrl);
    context.log('Calling command: ' + req.body.command);
    switch (req.body.command)
    {
        case "post":
            postMessage(context, req);
            break;
        case "read":
            readMessage(context, req);
            break;
        case "list":
            listChannels(context, req);
            break;
        default: 
            context.res = {
                status: 400,
                body: `Incorrect function: ${req.body.command} Only 'post' 'list' and 'read' are supported at this stage`
            };
            context.done();
    }
};