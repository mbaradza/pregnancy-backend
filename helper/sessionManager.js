const redisHost = require('../config/dev').REDIS_HOST;
const express_session = require('express-session');
const redisPort = require('../config/dev').REDIS_PORT;
const redis = require('redis');
const redisStore = require('connect-redis')(express_session)
const client = redis.createClient();
const sessionAge = require('../config/dev').SESSION_MAXAGE;

 var store= new redisStore({host: redisHost,port: redisPort,client: client, ttl: 10});

createSession = async (req,session,user) =>{


let sessionKey = session.key;
let online = false;

if(user.token){
    online = true
   let newSessionKey = {...user,online};
   
    if(!sessionKey ||sessionKey.username!=user.username){ 
       req.session.key =newSessionKey;
        req.session.cookie.maxAge = sessionAge;
           await store.set(user._id,req.session,async (err)=>{
                if (err) throw err
            })
         await req.session.save();
       
    }else{
       
        let oldSessionRemainingTime= req.session.cookie.maxAge
        req.session.key =newSessionKey;
        req.session.cookie.maxAge = oldSessionRemainingTime;
           await store.set(user._id,req.session,async (err)=>{
                if (err) throw err
            })
         await req.session.save();
    }
      
}

}

sessionExpired= async(session, username)=>{
    let previousSessionExpired = true;
    if( session && session.key && session.key.username==username){
        if(session.cookie.maxAge>0){
            previousSessionExpired = false
        }   
    }
return previousSessionExpired;
}

validateSession = (user,appName)=>{
    var sess;
    store.get(user.id,(err,sess)=>{
     sess = sess;
    })
    return sess;
}



module.exports = { createSession , sessionExpired,validateSession,store}





