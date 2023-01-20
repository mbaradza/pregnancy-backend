const config = require('../../config')
const stripe = require('stripe')(config.STRIPE_KEY_TEST);
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(config.BOT_API, { polling: false });
const userTrackerService = require('../services/user_tracker.service')

exports.success = async (req, res) => {

    const success_message = `Congratulations <b><em>${req.query.fname}</em></b> Your Payment Has Been Successful.`
  
    const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
    if(session && session.customer){
    const chatId = req.query.chat_id
    const track = req.query.track
    await bot.sendMessage(chatId,success_message,{parse_mode:"HTML"}).then(async msg=>{
        await userTrackerService.update(track,{hasSubscribed: true,newSubscriber: true})
    })

    res.redirect(`https://t.me/PregnancyPrayerBot?chat_id=${chatId}`) 
    }
};

exports.failure = async(req, res) => {
    const failure_message = ` Dear <b><em>${req.query.fname}</em></b> Your Payment Has Been Cancelled`
                           +`. If this was a mistake please use the previously generated payment link (if it hasn't expired) to try again or send the message <em>Pay</em>.`
    const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
    if(session && session.customer){
    const chatId = req.query.chat_id
    await bot.sendMessage(chatId,failure_message,{parse_mode:"HTML"})
    res.redirect(`https://t.me/PregnancyPrayerBot?chat_id=${chatId}`) 
    
}
}
