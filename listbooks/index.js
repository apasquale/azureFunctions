var https = require('https');
var _ = require('lodash');

var listPath = '/2/files/list_folder';
var searchPath = '/2/files/search';
var getPath = '/2/sharing/create_shared_link';

var options = {
  host: 'api.dropboxapi.com',
  port: '443',
  path: listPath,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Authorization': process.env.app_auth
  }
};

function QueryStringToJSON(myargs) {            
    var pairs = myargs.split('&');
    
    var result = {};
    pairs.forEach(function(pair) {
        pair = pair.split('=');
        result[pair[0]] = decodeURIComponent(pair[1] || '');
    });

    return JSON.parse(JSON.stringify(result));
}

function buildMessage(item, msg) {
  msg += "\n\t- " + item.name;
  return msg;
}

function listEbooks(context) {
    options.path = listPath;
    var listData = JSON.stringify({
      'path': '/ebooks'
    });
    var dbreq = https.request(options, function(res) {
        var msg = '';
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            msg += chunk;
        });
        res.on('end', function() {
            var myresult = JSON.parse(msg);
            
            var message = "These are the ebooks I have:";
  
            _.each(myresult.entries, function(item) {message = buildMessage(item, message)});
  
            context.res = {
                body: message
            };
            context.done();
        });
    });
    dbreq.write(listData);
    dbreq.end();
}

function searchEbooks(context, searchTerm) {
    options.path = searchPath;
    
    var searchData = JSON.stringify({
        'path': '/ebooks',
        'query': searchTerm,
        'start': 0,
        'max_results': 100
    });
    
    var dbreq = https.request(options, function(res) {
        var msg = '';
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            msg += chunk;
        });
        res.on('end', function() {
            var myresult = JSON.parse(msg);
            var message = `These are the ebooks I have that matches (${searchTerm}):`;
            
            if(myresult.matches.length > 0){
                var matchdata = _.map(myresult.matches, 'metadata');
                _.each(matchdata, function(item) {message = buildMessage(item, message)});
            }
            else {
                message += "\n\tNo matches found";
            }
  
            context.res = {
                body: message
            };
            context.done();
        });
    });
    dbreq.write(searchData);
    dbreq.end();
}

function getEbook(context, getTerm) {
    options.path = getPath;
    
    var getData = JSON.stringify({
        'path': `/ebooks/${getTerm}`,
        'short_url': true
    });
    
    var dbreq = https.request(options, function(res) {
        var msg = '';
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            msg += chunk;
        });
        res.on('end', function() {
            var myresult = JSON.parse(msg);
            var message = `You requested (${getTerm}) `;
            
            if(myresult.error_summary) {
                message += `Error found: ${myresult.error_summary.replace(/\//g, " ")}`; 
            }
            else {
                message += "Here is what I found:";
                message += `\n\t- Book: <${myresult.url}|${getTerm}>`;
            }
  
            context.res = {
                body: message
            };
            context.done();
        });
    });
    dbreq.write(getData);
    dbreq.end();
}

module.exports = function(context, req) {
    context.log(`Node.js HTTP trigger function processed a request. RequestUri=${req.originalUrl}. Body=${req.body}`);
    var bodyjson = QueryStringToJSON(req.body);
    if ((bodyjson && bodyjson.token == process.env.app_slack_token)) {
        var commandArgs = bodyjson.text.trim().split("+");
        var command = commandArgs[0];
        var terms = commandArgs.slice(1).join(" ");
        context.log('commandArgs: %s. command: %s, terms: %s', commandArgs, command, terms);
        context.log('bodyjson: %s', bodyjson);
        
        if(!command) {
            command = 'list';
        }
        
        switch (command)
        {
            case "list":
                listEbooks(context);
                break;
            case "search":
                searchEbooks(context, terms);
                break;
            case "get":
                getEbook(context, terms);
                break;
            default: 
                context.res = {
                    status: 400,
                    body: `Incorrect function: ${command} Only 'list', 'search' and 'get' are supported at this stage`
                };
                context.done();
        }
    }
    else {
       context.res = {
            status: 400,
            body: "Incorrect token"
        };
        context.done();
    }
};