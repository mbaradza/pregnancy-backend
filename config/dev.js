let config = {
     
    mongo: {
        url: 'mongodb://localhost/PregnancyPrayer',
        
    },
    BOT_API: process.env.BOT_KEY,
    STRIPE_KEY_TEST: process.env.STRIPE_KEY_TEST,
    STRIPE_KEY_LIVE: process.env.STRIPE_KEY_LIVE,
    SUBSCRIPTION_PRICE_TEST: process.env.SUBSCRIPTION_PRICE_TEST,
    SUBSCRIPTION_PRICE_LIVE: process.env.SUBSCRIPTION_PRICE_LIVE

};

module.exports = config;
