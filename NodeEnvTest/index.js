function GetEnvironmentVariable(name)
{
    return name + ": " + process.env[name];
}

module.exports = function(context, req) {
    context.log('Node.js HTTP trigger function processed a request. RequestUri=%s', req.originalUrl);
    context.log(GetEnvironmentVariable('APP_FOO'));
    
    context.res = {
        body: `Confirming APP_FOO is: ${process.env.app_foo}`
    };
    
    context.done();
};