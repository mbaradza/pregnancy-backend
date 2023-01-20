const trackerService = require("../services/user_tracker.service");
const messageService = require("../services/message.service")
const bot = require('../services/bot.service')

function sendMessage(){
trackerService.findAllActive().then(async (regs)=>{
  if (Array.isArray(regs) && regs.length > 0) {
    for (reg of regs){
      //New USER
      let messageDay = 0;
      let isNew = false
      let chatId = reg.chatId
      let newSubscriber = reg.newSubscriber
      if(reg && reg.currentDay==0){
        messageDay=reg.pregnancyDayOnReg
        isNew=true;
      } else{
          messageDay = reg.currentDay +1
        
      }
      if(messageDay>0 && messageDay<=280){
        if(messageDay!=reg.currentDay){
        trackerService.update(reg._id, { currentDay: messageDay })
        }
       const message =await messageService.getByDay(messageDay)
      if(message){

       let trimesterDevotional = message.trimesterDevotional||null
       let weeklyDevotional = message.weeklyDevotional||null
       let dailyDevotional =  message.dailyDevotional|| null
       let dailyScripture = message.dailyScripture || null
       let dailyPrayer = message.prayer|| null
       let weeklyDevelopment = message.weeklyDevelopment|| null
       let dailyDevelopment = message.dailyDevelopment || null
       

        if(isNew || reg.newSubscriber){
         const quotient = Math.floor(messageDay/8)
         let weeklyMessageDay = 1;
         let trimesterMessageDay = 1;
         if(reg.newSubscriber){
         if (messageDay>84 && messageDay<=189){
          trimesterMessageDay = 85
         } else if(messageDay>189){
          trimesterMessageDay = 190
         }
        }
         if(quotient >0){
          weeklyMessageDay = 8*quotient
         }
         const weeklyMessage = await messageService.getByDay(weeklyMessageDay)
        if(weeklyMessage && isNew){
          weeklyDevelopment = weeklyMessage.weeklyDevelopment 
        }
         const trimesterMessage = await messageService.getByDay(trimesterMessageDay)
         if(reg.newSubscriber){
           if(weeklyMessage){
          weeklyDevotional = weeklyMessage.weeklyDevotional
           }
          if(trimesterMessage){
            trimesterDevotional = trimesterMessage.trimesterDevotional;
          }
          }
         
        
        }
       let dailyMessage= `\n <b><em>You\`re on day</em></b> <b>${messageDay}</b> \n \n`
       if(!reg.dailyMessagesShared){
        if(weeklyDevelopment!='null'){
          dailyMessage = dailyMessage +`\n <b>Weekly Development</b> \n ${weeklyDevelopment} \n \n`
                         +`<b>Daily Development</b> \n ${dailyDevelopment} \n \n <b>Today's Prayer</b> \n ${dailyPrayer}`
          if(!reg.hasSubscribed) {
            dailyMessage = dailyMessage+'\n\n Please click the /subscribe link to get more useful information'
          }             
                
        }else{
          dailyMessage = dailyMessage +`\n <b>Daily Development</b> \n ${dailyDevelopment} \n \n <b>Today's Prayer</b> \n ${dailyPrayer}`
        }
        bot.sendMessage(chatId, dailyMessage,{parse_mode:"HTML"}).then(async r=>{
          await trackerService.update(reg._id, { dailyMessagesShared: true })
        })
      }
        if(reg.hasSubscribed){
           if(!reg.dailyDevotionalsShared){
            let devotional = ''
            if(trimesterDevotional&&trimesterDevotional!='null'){
              devotional = devotional +`\n <b>Trimester Devotional</b> \n ${trimesterDevotional} \n \n`
                            
            } 
            if(weeklyDevotional&& weeklyDevotional!='null'){
              devotional = devotional +`\n <b>Weekly Devotional</b> \n ${weeklyDevotional} \n \n`
                                
            }
            if(dailyDevotional && dailyDevotional!='null'){
              devotional = devotional +`\n <b>Daily Devotional</b> \n ${dailyDevotional} \n \n`
            }

            if(dailyScripture && dailyScripture!='null'){
              devotional = devotional +`\n <b>Daily Scripture</b> \n ${dailyScripture} \n \n`
            }
            bot.sendMessage(chatId, devotional,{parse_mode:"HTML"}).then(async r=>{
              await trackerService.update(reg._id, { dailyDevotionalsShared: true ,newSubscriber: false})
            })
        }
        
      }
      await trackerService.update(reg._id, { intervalLocked: true })
      }
    }
  }
}
})
}



module.exports = { sendMessage}
