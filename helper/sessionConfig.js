const sessKey = require('../config/dev').Session_Key;
const express_session = require('express-session');
const redisHost = require('../config/dev').REDIS_HOST;
const redisPort = require('../config/dev').REDIS_PORT;
const redis = require('redis');
const redisStore = require('connect-redis')(express_session)
const client = redis.createClient();
const uuid = require('uuid/v4')
const sessionAge = require('../config/dev').SESSION_MAXAGE;

let session = {
genid: ()=>{
return uuid()
},
name:"pregnancyPrayer",
secret: sessKey,
resave: false,
saveUninitialized: true,
store: new redisStore({host: redisHost,port: redisPort,client: client, ttl: 100}),
cookie:{
    //True if using https
    secure: true,
    //In Milliseconds
    maxAge: sessionAge
}
}

module.exports = session;