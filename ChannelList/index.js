module.exports = function(context, req) {
    context.log('Node.js HTTP trigger function processed a request. RequestUri=%s', req.originalUrl);
    context.log(GetEnvironmentVariable('APP_FOO'));
    
    context.res = {
        body: `We have the following channels:
- #general: Company wide announcements and work place matters
- #random: Non-work banter and water cooler conversation
- #bad-code: Discussion of some of the more _interesting_ code we have found in our travels
- #rants: We are all friends here... go nuts and let it all out
- #ebooks: Free daily ebooks delivered to you
- #accelerator-chat: Discussion of the Apps Dev accelerator sessions`
    };
    
    context.done();
};