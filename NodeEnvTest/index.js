function GetEnvironmentVariable(name)
{
    return name + ": " + process.env[name];
}

module.exports = function(context, req) {
    context.log('Node.js HTTP trigger function processed a request. RequestUri=%s', req.originalUrl);
    context.log(GetEnvironmentVariable('APP_FOO'));
    context.log(GetEnvironmentVariable('APP_Auth'));
    context.log(process.env.app_auth);
    context.log(GetEnvironmentVariable('APP_Slack_Token'));
    var age = 3;
    
    context.res = {
        // status: 400,
        body: `Wohoo! I'm ${age} years old!`
    };
    
    context.done();
};