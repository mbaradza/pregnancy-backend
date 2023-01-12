const config = require('../../config');
const TelegramBot = require('node-telegram-bot-api');
const userTrackerService = require('../services/user_tracker.service');
const userService = require('../services/user.service');
const utilService = require('../services/utils.service');
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(config.BOT_API, { polling: true });

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    
    if (msg && msg.text.toLowerCase().includes('\/start')) {
        const chatId = msg.chat.id;
        let userTracker = await userTrackerService.getOne(chatId).then(value=>{
            return value
        }).catch(err=>{
            console.log("ERROR",err)
        })
        const secondIntroMessage ="Praying scripture for your baby is a God pleasing way to both talk and listen to our Father." 
                                +"When we pray scripture, we use God's own words to help express our feelings, worries, requests"
                                +"and praises. At the same time we allow His words to speak His truth and His heart back to us.";
        const emailRequest = `Now We Proceed to the registration process. Please go ahead and enter your EMAIL ADDRESS(example: msthompson@gmail.com):`
        if (!userTracker) {
            // Create New USer    
            let user = {
                chatId: chatId,
                firstName: msg.from.first_name,
                surName: msg.from.last_name,
                role: 'user',
                active: true,
                isSuspended: false,
                optedOut: false,

            }

            user = await userService.create(user).then(u=>{
              return u
            }).catch(err=>{
                console.log("ERROR",err)  
            });
            if (user) {
                
                    bot.sendMessage(chatId, `Wellcome to pregnancy prayer ${msg.from.first_name}`).then(async r=>{
                    userTracker = {
                        chatId: chatId,
                        userId: user.id,
                        currentDay: 0,
                        firstIntroductionSent: true,
                        introductionComplete: false,
                        emailSaved: false,
                        registrationComplete: false,
                        weeklyDevotionalShared: false,
                        dailyDevotionalShared: false,
                        dailyPrayerShared: false,
                        sessionCompleted: false,
                        optedOut: false,
                        reasonGiven: false,
                        intervalLocked: false
                    }
                    userTracker = await userTrackerService.create(userTracker).then(ut=>{
                        return ut;
                    }).catch(err=>{
                        console.log("User Tracker Error")
                    });
                     //Second Intro Message
                    bot.sendMessage(chatId, secondIntroMessage).then(r=>{
                    userTrackerService.update(userTracker._id, { introductionComplete: true })
                    bot.sendMessage(chatId, emailRequest);
                    }).catch(err=>{
                        console.log("BOT ERROR=",err)
                    });

                    }).catch(err=>{
                        console.log("BOT ERROR",err)
                    });             
                
            }
        } else {

            if (!userTracker.registrationComplete) {
                if (!userTracker.emailSaved) {
                    const secondEmailReq = `Wellcome back ${msg.from.first_name},We realiased you did not complete your registration. Please`
                           +"go ahead and enter your EMAIL ADDRESS(example: msthompson@gmail.com):"   
                    bot.sendMessage(chatId, secondEmailReq);

                } else if (userTracker.currentDay == 0 && !userTracker.pregnancyDayOnReg) {
                    const currentPrenancyDayMessage = `Wellcome back ${msg.from.first_name},We realiased you did not complete your registration. Please`
                                                      +"go ahead and enter your CURRENT PREGNANCY DAY (format: number between 1 to 285: Example: 3):"
                    bot.sendMessage(chatId, currentPrenancyDayMessage);
                }
                else if (userTracker.currentDay == 0 && !userTracker.expectedDeliveryDate) {
                    const expectedDeliveryDateMessage = `Wellcome back ${msg.from.first_name},We realiased you did not complete your registration.Please`
                    +"go ahead and enter your EXPECTED DATE OF DELIVERY (format: dd/MM/YYYY: Example: 01/08/2023):"
                    bot.sendMessage(chatId, expectedDeliveryDateMessage);
                }

            }
            else {
                if (!userTracker.sessionCompleted) {
                    const continuationMessage = `Wellcome back ${msg.from.first_name}, We will continue with sending you daily devotionals and prayers`
                                +"from where we left last time,enjoy!!"
                    bot.sendMessage(chatId, continuationMessage);
                } else {
                    bot.sendMessage(chatId, `Wellcome back ${msg.from.first_name}, It seems like you completed the last session for your `
                      +"pregnancy,Please revisit the messages we shared with you last time if you are pregnant again!!");
                }
            }


        }
    } else{
        let user = await userService.findByChatId(chatId).then(u=>{
            return u
        }).catch(err=>{
            console.log("---ERROR",err)
        })
        let userTracker = await userTrackerService.getOne(chatId).then(value=>{
            return value
        }).catch(err=>{
            console.log("ERROR",err)
        })
        
       const message =String(msg.text).trim();

        if (!userTracker.emailSaved) {
            const invalidEmail = `The entered email is invalid,please. Please re-enter your EMAIL ADDRESS(example: msthompson@gmail.com):`
        
            if(!utilService.isValidEmail(message))  { 
            bot.sendMessage(chatId, invalidEmail);

            }else{
                const duplicateEmail = await userService.existsByEmail(message).then(v=>{
                    return v
                }).catch(e=>{
                    console.log("Email Duplicate Validation",e)
                })
                if(duplicateEmail){
                bot.sendMessage(chatId, `The provided email ${message} has been registered by another user already, please provide another email, to proceed:`);
                } else{
                //Save the Email 
                userService.update(user._id, {email: message})
                userTrackerService.update(userTracker._id,{emailSaved:true})
                bot.sendMessage(chatId, `Please enter your CURRENT PREGNANCY DAY (format: number between 1 to 285: Example: 3)`);
                }
            }
        } else if (userTracker.currentDay == 0 && !userTracker.pregnancyDayOnReg) {
    
            if(utilService.isValidNumber(message) && Number(message)<=285){
                userService.update(user._id, {currentPregnancyDay: Number(message)})
                userTrackerService.update(userTracker._id,{pregnancyDayOnReg:Number(message)})
                bot.sendMessage(chatId, `Please enter your EXPECTED DATE OF DELIVERY (format: YYYY-MM-DD: Example: 2023-01-13)`);
            } else{
                bot.sendMessage(chatId, `Your CURRENT PREGNANCY DAY should be a number between 1 - 285. You entered an invalid response ${message}.` 
                +"Please re-enter the CURRENT PREGNANCY DAY:");  
            }
            
        }
        else if (userTracker.currentDay == 0 && !userTracker.expectedDeliveryDate) {
            if(utilService.isValidDate(message)){
                var timestamp = Date.parse(message)
                var convertedDate = new Date(timestamp);
                if(utilService.checkDateIsValidFutureDate(new Date(),convertedDate)){
                    userService.update(user._id, {expectedDeliveryDate: convertedDate})
                    userTrackerService.update(userTracker._id,{expectedDeliveryDate:convertedDate,registrationComplete: true})
                    bot.sendMessage(chatId, "Your have completed your registration. Now seat back and relax whilest we through God walk with"
                    +"you through your pregnancy process! We will be sharing with you some daily devortinals and daily prayers that will help make your"
                    +"beautiful journey easier")
                } else{
                    bot.sendMessage(chatId, "Your EXPECTED DATE OF DELIVERY should not be a past date.You entered a past date"
                   +`${message}. Please re-nter the EXPECTED DATE OF DELIVERY: `)
                }

            } else{
                bot.sendMessage(chatId, "Your EXPECTED DATE OF DELIVERY should be a valid date in the format YYYY-MM-DD.You entered an invalid response"
                +` ${message}. Please re-nter the EXPECTED DATE OF DELIVERY: `);  
            }
        }
    }
})

module.exports = bot