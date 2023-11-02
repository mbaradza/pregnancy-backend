const config = require( '../../config' );
const TelegramBot = require( 'node-telegram-bot-api' );
const userTrackerService = require( '../services/user_tracker.service' );
const userService = require( '../services/user.service' );
const utilService = require( '../services/utils.service' );
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot( config.BOT_API, { polling: true } );
const messageSender = require( '../helper/messageSender' );

bot.on( 'message', async ( msg ) =>
{
    const chatId = msg.chat.id;
    const fname = msg.from.first_name
    const lname = msg.from.last_name;
    if ( msg && msg.text.toLowerCase().includes( '\/start' ) )
    {
        const chatId = msg.chat.id;
        let userTracker = await userTrackerService.getOne( chatId ).then( value =>
        {
            return value
        } ).catch( err =>
        {
            console.log( "ERROR", err )
        } )
        const secondIntroMessage = "<b>Introduction</b> \nPraying scripture for your baby is a God pleasing way to both talk and listen to our Father."
            + "When we pray scripture, we use God's own words to help express our feelings, worries, requests"
            + " and praises. At the same time we allow His words to speak His truth and His heart back to us.\n\n"
            + "<b>About this Bot</b>\n Pregnancy Prayer Guide Bot is a Bot created for the Christian mother-to-be which gives a day-by-day guide "
            + "of her pregnancy plus a daily prayer for her growing child.\n"
            + "This Bot serves to encourage mummy-to-be and pray the word of God over your baby daily for the entire 280 days <em>(40 weeks)</em>  "
            + "gestation period. \n \n"
        const emailRequest = `Now lets start by registering.\n Enter your email address (example: msthompson@gmail.com):`
        if ( !userTracker )
        {
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

            user = await userService.create( user ).then( u =>
            {
                return u
            } ).catch( err =>
            {
                console.log( "ERROR", err )
            } );
            if ( user )
            {
                bot.sendMessage( chatId, ` Hello <b>${ fname }</b> \n \n ${ secondIntroMessage }`, { parse_mode: "HTML" } ).then( async r =>
                {
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
                    userTracker = await userTrackerService.create( userTracker ).then(
                        bot.sendMessage( chatId, emailRequest )
                    );

                } ).catch( err =>
                {
                    console.log( "BOT ERROR", err )
                } );

            }
        } else
        {

            if ( !userTracker.registrationComplete )
            {
                if ( !userTracker.emailSaved )
                {
                    const secondEmailReq = `Welcome back <b>${ fname }</b>,We realised you did not complete your registration. Please`
                        + ` go ahead and enter your email address <b>(example: msthompson@gmail.com):</b>  `
                    bot.sendMessage( chatId, secondEmailReq, { parse_mode: "HTML" } );

                }

                else if ( userTracker.currentDay == 0 && !userTracker.expectedDeliveryDate )
                {
                    const expectedDeliveryDateMessage = `Welcome back <b style="color:blue;"><em>${ fname }<em></b>,We realised you did not complete your registration.Please`
                        + ` go ahead and enter your Expected Date Of Delivery (EDD) <b>(format: YYYY-MM-DD: Example: 2023-01-13):</b> `
                    bot.sendMessage( chatId, expectedDeliveryDateMessage, { parse_mode: "HTML" } );
                }

            }
            else
            {
                if ( !userTracker.sessionCompleted )
                {
                    const continuationMessage = ` Welcome back <b><em>${ fname }</em></b>, We will continue sending you daily devotionals and prayers`
                        + " from where we left last time,enjoy!! "
                    bot.sendMessage( chatId, continuationMessage, { parse_mode: "HTML" } );
                } else
                {
                    bot.sendMessage( chatId, ` Welcome back <b><em>${ fname }</em></b>, It seems like you completed the last session for your `
                        + " pregnancy,Please revisit the messages we shared with you last time if you are pregnant again!!", { parse_mode: "HTML" } );
                }
            }


        }
    } else
    {
        let user = await userService.findByChatId( chatId );
        let userTracker = await userTrackerService.getOne( chatId );

        const message = String( msg.text ).trim();
        const invalidEmail = ` The entered email <b> ${ message } </b> is invalid,please. Please re-enter your email address <b>(example: msthompson@gmail.com):</b> `
        if ( userTracker && !userTracker.emailSaved )
        {

            if ( !utilService.isValidEmail( message ) )
            {
                bot.sendMessage( chatId, invalidEmail, { parse_mode: "HTML" } );

            } else
            {
                const duplicateEmail = await userService.existsByEmail( message ).then( v =>
                {
                    return v
                } ).catch( e =>
                {
                    console.log( "Email Duplicate Validation", e )
                } )
                if ( duplicateEmail )
                {
                    bot.sendMessage( chatId, ` The provided email <b> ${ message } </b> has been registered by another user already, please provide another email, to proceed:`
                        , { parse_mode: "HTML" } );
                } else
                {
                    //Save the Email 
                    userService.update( user._id, { email: message } )
                    userTrackerService.update( userTracker._id, { emailSaved: true } )
                    bot.sendMessage( chatId, ` Please enter your Expected Date Of Delivery(EDD) <b> (format: YYYY-MM-DD: Example: 2023-01-13) </b> `,
                        { parse_mode: "HTML" } );
                }
            }
        }
        else if ( userTracker && !userTracker.expectedDeliveryDate )
        {
            if ( utilService.isValidDate( message ) )
            {
                var timestamp = Date.parse( message )
                var convertedDate = new Date( timestamp );
                var today = new Date( new Date().setUTCHours( 0, 0, 0, 0 ) )

                if ( utilService.checkDateIsValidFutureDate( new Date(), convertedDate ) )
                {
                    const currentPregnancyDay = Math.floor( ( convertedDate.getTime() - today.getTime() ) / ( 1000 * 3600 * 24 ) )

                    if ( currentPregnancyDay >= 280 )
                    {
                        bot.sendMessage( chatId, `Your EXPECTED DATE OF DELIVERY <b> ${ message }</b> is out of the expected range.`
                            + ` Please verify and re-enter EXPECTED DATE OF DELIVERY: `, { parse_mode: "HTML" } )
                    } else
                    {
                        userService.update( user._id, { expectedDeliveryDate: convertedDate, currentPregnancyDay: ( 280 - currentPregnancyDay ) } )
                        userTrackerService.update( userTracker._id, { expectedDeliveryDate: convertedDate, registrationComplete: true, pregnancyDayOnReg: ( 280 - currentPregnancyDay ) } )
                        const weeks = Math.floor( ( 280 - currentPregnancyDay ) / 7 )
                        const days = ( 280 - currentPregnancyDay ) % 7

                        bot.sendMessage( chatId, ` Thank you <b>${ fname }</b> for registering with Pregnancy Prayer Bot. Congratulations you are <b><em>${ weeks } </em></b> week(s) and <b><em>${ days }</em></b> day(s) pregnant.`
                            + " \n\n Do you want to be motivated and inspired daily using the word of God?"
                            + "In case of an error, click /update to correct the entered data ", { parse_mode: "HTML" } )
                    }
                } else
                {
                    bot.sendMessage( chatId, " Your EXPECTED DATE OF DELIVERY should not be a past date.You entered a past date"
                        + ` <b> ${ message }</b>. Please re-nter the EXPECTED DATE OF DELIVERY: `, { parse_mode: "HTML" } )
                }

            } else
            {
                bot.sendMessage( chatId, " Your EXPECTED DATE OF DELIVERY should be a valid date in the format YYYY-MM-DD.You entered an invalid response"
                    + `<em> ${ message } </em>. Please re-nter the EXPECTED DATE OF DELIVERY: `, { parse_mode: "HTML" } );
            }
        }
        else if ( message.toLowerCase().includes( '\/update' ) || message == 'update' )
        {

            bot.sendMessage( chatId, "<b>Which field do you want to update? </b>", updateOptions )

        }
        setTimeout( () => { messageSender.sendMessage( bot, true ) }, 300000 )
    }
} )
bot.on( "callback_query", async ( msg ) =>
{
    const data = msg.data
    const chatId = msg.from.id
    const fname = msg.from.first_name;
    let user = await userService.findByChatId( chatId );

    if ( data == 'updateEDD' )
    {
        bot.sendMessage( chatId, ` Please enter your correct <b>EDD</b> (format: YYYY-MM-DD):`,
            { reply_markup: { force_reply: true }, parse_mode: "HTML" } ).then( ( msg ) =>
            {
                bot.onReplyToMessage( msg.chat.id, msg.message_id, async ( message ) =>
                {
                    if ( utilService.isValidDate( message.text ) )
                    {
                        var timestamp = Date.parse( message.text )
                        var convertedDate = new Date( timestamp );
                        var today = new Date( new Date().setUTCHours( 0, 0, 0, 0 ) )

                        if ( utilService.checkDateIsValidFutureDate( new Date(), convertedDate ) )
                        {
                            const currentPregnancyDay = Math.floor( ( convertedDate.getTime() - today.getTime() ) / ( 1000 * 3600 * 24 ) )

                            if ( currentPregnancyDay >= 280 )
                            {
                                bot.sendMessage( chatId, `Your EXPECTED DATE OF DELIVERY <b> ${ message.text }</b> is out of the expected range.`
                                    + ` Please verify and RE-START THE UPDATE PROCESS: `, updateOptions )
                            } else
                            {
                                let userTracker = await userTrackerService.getOne( chatId );
                                if ( user && user._id )
                                {
                                    userService.update( user._id, { expectedDeliveryDate: convertedDate, currentPregnancyDay: ( 280 - currentPregnancyDay ) } );
                                }
                                userTrackerService.update( userTracker._id, {
                                    expectedDeliveryDate: convertedDate, pregnancyDayOnReg: ( 280 - currentPregnancyDay ),
                                    dailyDevotionalsShared: false, dailyMessagesShared: false, currentDay: ( 280 - currentPregnancyDay )
                                } )
                                const weeks = Math.floor( ( 280 - currentPregnancyDay ) / 7 )
                                const days = ( 280 - currentPregnancyDay ) % 7

                                bot.sendMessage( chatId, `Your EDD has been updated to <em>${ message.text }</em>. Congratulations you are <b><em>${ weeks } </em></b> week(s) and <b><em>${ days }</em></b> day(s) pregnant.`
                                    + "<em>In case of any other errors, click /update to correct the entered data </em>", { parse_mode: "HTML" } )
                            }
                        } else
                        {
                            bot.sendMessage( chatId, " Your EXPECTED DATE OF DELIVERY should not be a past date.You entered a past date"
                                + ` <b> ${ message.text }</b>. PLEASE RE-START THE UPDATE PROCESS: `, updateOptions )
                        }

                    } else
                    {
                        bot.sendMessage( chatId, " Your EXPECTED DATE OF DELIVERY should be a valid date in the format YYYY-MM-DD.You entered an invalid response"
                            + `<em> ${ message } </em>. PLEASE RE-START THE UPDATE PROCESS: `, updateOptions );
                    }

                } )
            } )
    }
    else if ( data == 'updateEMAIL' )
    {
        bot.sendMessage( chatId, ` Please enter your correct <b>EMAIL ADDRESS</b>:`,
            { reply_markup: { force_reply: true }, parse_mode: "HTML" } ).then( ( msg ) =>
            {
                bot.onReplyToMessage( msg.chat.id, msg.message_id, async ( message ) =>
                {
                    if ( !utilService.isValidEmail( message.text ) )
                    {
                        await bot.sendMessage( chatId, `INVALID EMAIL ${ message.text } ENTERED, PLEASE RESELECT THE UPDATE OPTION AND PROCEED:`, updateOptions )
                    } else
                    {
                        const duplicateEmail = await userService.existsByEmail( message.text )
                        if ( duplicateEmail )
                        {
                            bot.sendMessage( chatId, ` The provided email <b> ${ message.text } </b> has been registered by another user already, 
                    please provide another email, to proceed or if this user is you and you want to maintain the email, press cancel:`,
                                updateOptions );
                        } else
                        {
                            //Save the Email 
                            if ( user && user._id )
                            {
                                userService.update( user._id, { email: message.text } );
                            }
                            bot.sendMessage( chatId, `Your Email has been successfully update to ${ message.text } `,
                                { parse_mode: "HTML" } );
                        }
                    }
                } )
            } )
    } else if ( data == 'cancelUpdate' )
    {
        bot.sendMessage( chatId, "Your update request has been cancelled. Click /update if ever you want to update data",
            { parse_mode: "HTML", reply_markup: { remove_keyboard: true } } )
    }
} )
const updateOptions = {
    reply_markup: {
        inline_keyboard: [
            [
                {
                    text: 'EDD',
                    callback_data: 'updateEDD'
                }
            ],
            [
                {
                    text: 'EMAIL',
                    callback_data: 'updateEMAIL'
                }
            ],
            [
                {
                    text: 'CANCEL',
                    callback_data: 'cancelUPDATE'
                }
            ]
        ],
        remove_keyboard: true
    },
    parse_mode: 'HTML'
};

module.exports = bot