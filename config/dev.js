let config = {
     
    mongo: {
        url: 'mongodb://localhost/PregnancyPrayer'
    },
 
    Session_Key :process.env.SESSION_KEY,
    Secret : process.env.SECRET,
    REDIS_HOST : process.env.REDIS_HOST,
    REDIS_PORT : process.env.REDIS_PORT,
    SESSION_MAXAGE: process.env.SESSION_MAXAGE || 3*24*60*60*1000, 

};

module.exports = config;
