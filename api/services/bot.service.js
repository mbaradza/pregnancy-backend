const config = require('../../config');
const TelegramBot = require('node-telegram-bot-api');
const userTrackerService = require('../services/user_tracker.service');
const userService = require('../services/user.service');
const utilService = require('../services/utils.service');
const stripeService = require('../services/stripe.service')
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(config.BOT_API, { polling: true });
const messageSender = require('../helper/messageSender');

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const fname = msg.from.first_name
    const lname = msg.from.last_name;
    if (msg && msg.text.toLowerCase().includes('\/start')) {
        const chatId = msg.chat.id;
        let userTracker = await userTrackerService.getOne(chatId).then(value => {
            return value
        }).catch(err => {
            console.log("ERROR", err)
        })
        const secondIntroMessage = "<b>Introduction</b> \nPraying scripture for your baby is a God pleasing way to both talk and listen to our Father."
            + "When we pray scripture, we use God's own words to help express our feelings, worries, requests"
            + " and praises. At the same time we allow His words to speak His truth and His heart back to us.\n\n"
            +"<b>About this Bot</b>\n Pregnancy Prayer Guide Bot is a Bot created for the Christian mother-to-be which gives a day-by-day guide "
            +"of her pregnancy plus a daily prayer for her growing child.\n"
            +"This Bot serves to encourage mummy-to-be and pray the word of God over your baby daily for the entire 280 days <em>(40 weeks)</em>  "
            +"gestation period. \n \n"
        const emailRequest = `Now lets start by registering.\n Enter your EMAIL ADDRESS(example: msthompson@gmail.com):`
        if (!userTracker) {
            // Create New USer    
            let user = {
                chatId: chatId,
                firstName: fname,
                surName: lname,
                role: 'user',
                active: true,
                isSuspended: false,
                optedOut: false,

            }

            user = await userService.create(user).then(u => {
                return u
            }).catch(err => {
                console.log("ERROR", err)
            });
            if (user) {
                bot.sendMessage(chatId, ` Hello <b>${fname}</b> \n \n ${secondIntroMessage}`, { parse_mode: "HTML" }).then(async r => {
                    userTracker = {
                        chatId: chatId,
                        userId: user._id,
                        currentDay: 0,
                        introductionComplete: true,
                        emailSaved: false,
                        registrationComplete: false,
                        dailyDevotionalsShared: false,
                        dailyMessagesShared: false,
                        sessionCompleted: false,
                        optedOut: false,
                        reasonGiven: false,
                        intervalLocked: false
                    }
                    userTracker = await userTrackerService.create(userTracker).then(
                        bot.sendMessage(chatId, emailRequest)
                    );

                }).catch(err => {
                    console.log("BOT ERROR", err)
                });

            }
        } else {

            if (!userTracker.registrationComplete) {
                if (!userTracker.emailSaved) {
                    const secondEmailReq = `Welcome back <b>${fname}</b>,We realised you did not complete your registration. Please`
                        + ` go ahead and enter your EMAIL ADDRESS <b>(example: msthompson@gmail.com):</b>  `
                    bot.sendMessage(chatId, secondEmailReq, { parse_mode: "HTML" });

                } 
                // else if (userTracker.currentDay == 0 && !userTracker.pregnancyDayOnReg) {
                //     const currentPrenancyDayMessage = `Welcome back <b>${fname}</b>,We realised you did not complete your registration. Please`
                //         + ` go ahead and enter your CURRENT PREGNANCY DAY <b>(format: number between 1 to 280: Example: 3):`
                //     bot.sendMessage(chatId, currentPrenancyDayMessage, { parse_mode: "HTML" });
                // }
                else if (userTracker.currentDay == 0 && !userTracker.expectedDeliveryDate) {
                    const expectedDeliveryDateMessage = `Welcome back <b style="color:blue;"><em>${fname}<em></b>,We realised you did not complete your registration.Please`
                        + ` go ahead and enter your EXPECTED DATE OF DELIVERY <b>(format: dd/MM/YYYY: Example: 01/08/2023):</b> `
                    bot.sendMessage(chatId, expectedDeliveryDateMessage, { parse_mode: "HTML" });
                }

            }
            else {
                if (!userTracker.sessionCompleted) {
                    const continuationMessage = ` Welcome back <b><em>${fname}</em></b>, We will continue sending you daily devotionals and prayers`
                        + " from where we left last time,enjoy!! "
                    bot.sendMessage(chatId, continuationMessage, { parse_mode: "HTML" });
                } else {
                    bot.sendMessage(chatId, ` Welcome back <b><em>${fname}</em></b>, It seems like you completed the last session for your `
                        + " pregnancy,Please revisit the messages we shared with you last time if you are pregnant again!!", { parse_mode: "HTML" });
                }
            }


        }
    } else {
        let user = await userService.findByChatId(chatId).then(u => {
            return u
        }).catch(err => {
            console.log("USER ERROR", err)
        })
        let userTracker = await userTrackerService.getOne(chatId);

        const message = String(msg.text).trim();
        if (!userTracker.emailSaved) {
            const invalidEmail = ` The entered email <b> ${message} </b> is invalid,please. Please re-enter your EMAIL ADDRESS <em>(example: msthompson@gmail.com):</em> `

            if (!utilService.isValidEmail(message)) {
                bot.sendMessage(chatId, invalidEmail, { parse_mode: "HTML" });

            } else {
                const duplicateEmail = await userService.existsByEmail(message).then(v => {
                    return v
                }).catch(e => {
                    console.log("Email Duplicate Validation", e)
                })
                if (duplicateEmail) {
                    bot.sendMessage(chatId, ` The provided email <b> ${message} </b> has been registered by another user already, please provide another email, to proceed:`
                        , { parse_mode: "HTML" });
                } else {
                    //Save the Email 
                    userService.update(user._id, { email: message })
                    userTrackerService.update(userTracker._id, { emailSaved: true })
                    bot.sendMessage(chatId, ` Please enter your EXPECTED DATE OF DELIVERY <b> (format: YYYY-MM-DD: Example: 2023-01-13) </b> `,
                    { parse_mode: "HTML" });
                }
            }
        }
        else if (!userTracker.expectedDeliveryDate) {
            if (utilService.isValidDate(message)) {
                var timestamp = Date.parse(message)
                var convertedDate = new Date(timestamp);
                var today = new Date()

                if (utilService.checkDateIsValidFutureDate(new Date(), convertedDate)) {
                    const currentPregnancyDay = 280-Math.floor((convertedDate.getTime()- today.getTime())/(1000*3600*24))
                    if(currentPregnancyDay<0){
                        bot.sendMessage(chatId, " Your EXPECTED DATE OF DELIVERY is out of the expected range."
                        + ` <b> ${message}</b>. Please verify and re-enter EXPECTED DATE OF DELIVERY: `, { parse_mode: "HTML" })
                    }else{
                    userService.update(user._id, { expectedDeliveryDate: convertedDate, currentPregnancyDay: currentPregnancyDay})
                    userTrackerService.update(userTracker._id, { expectedDeliveryDate: convertedDate, registrationComplete: true ,pregnancyDayOnReg: currentPregnancyDay})
                    const weeks = Math.floor(userTracker.currentPregnancyDay / 7)
                    const days = userTracker.currentPregnancyDay % 7

                    bot.sendMessage(chatId, ` Thank you <b>${fname}</b> for registering with Pregnancy Prayer Bot. Congratulations you are <b><em>${weeks} </em></b> week(s) and <b><em>${days}</em></b> day(s) pregnant.`
                        + " \n\n Do you want to be motivated and inspired daily using the word of God?"
                        +"Subscribe /here for $4.99 and receive our Pregnancy Prayer Guide Devotional daily ",{ parse_mode: "HTML" })
                    }
                } else {
                    bot.sendMessage(chatId, " Your EXPECTED DATE OF DELIVERY should not be a past date.You entered a past date"
                        + ` <b> ${message}</b>. Please re-nter the EXPECTED DATE OF DELIVERY: `, { parse_mode: "HTML" })
                }

            } else {
                bot.sendMessage(chatId, " Your EXPECTED DATE OF DELIVERY should be a valid date in the format YYYY-MM-DD.You entered an invalid response"
                    + `<em> ${message} </em>. Please re-nter the EXPECTED DATE OF DELIVERY: `, { parse_mode: "HTML" });
            }
        } 
        else if(message.toLowerCase().includes('\/subscribe') || message.toLowerCase().includes('\/here') || message=='subscribe'){
            if(!userTracker.hasSubscribed){
                bot.sendMessage(chatId, "<b>The subscription amount is </b> <em><b>USD$4.99</b></em>.Please click <b>'Pay'</b> to go to the payment page",{
                parse_mode: 'HTML',
                reply_markup: {
                  keyboard: [['Pay'], ['Not Now']],
                  remove_keyboard: true
                }
            },
            {parse_mode: "HTML"})
       
        }else{
            bot.sendMessage(chatId, "You already have a running subscription, if you have any queries please call/whatsapp <em>+263777807782</em>",{ parse_mode: "HTML",
            reply_markup:{remove_keyboard: true} })        
          }

        } else if(msg.text.toLowerCase()=='pay'){
            if(!userTracker.hasSubscribed){
            await bot.sendMessage(chatId,`Dear <em>${fname}</em> A payment link is being generated below, please click the link and proceed to make your payment!`,{
              parse_mode: 'HTML',reply_markup:{remove_keyboard: true}})
            const paymentURL = await stripeService.checkout(chatId,fname,userTracker._id);
            if(paymentURL && paymentURL!='null'){
                await bot.sendMessage(chatId,paymentURL);
            } else{
                await bot.sendMessage(chatId,"An error occurred wilest generating the payment url.Please send the word <em>Pay</em> to try again later"
                ,{parse_mode: 'HTML'});
            }
             
              
            }
             else{
                bot.sendMessage(chatId, "You already have a running subscription, if you have any queries please call/whatsapp <em>+263777807782</em>",{ 
                    parse_mode: 'HTML',
                    reply_markup:{remove_keyboard: true}
                })            
            }
        
        } else if(msg.text.toLowerCase().replace(/\s/g, '')=='notnow'){
            bot.sendMessage(chatId, "You can take your time, and whenever you decide to subscribe, just send the word <em>pay</em> and we will take it from there. ",
            { parse_mode: "HTML",reply_markup:{remove_keyboard: true}})   
          
        }
       setTimeout(messageSender.sendMessage(bot,true), 240000)
    }
})

module.exports = bot