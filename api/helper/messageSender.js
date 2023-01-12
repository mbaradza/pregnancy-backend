const trackerService = require("../services/user_tracker.service");
const messageService = require("../services/message.service")
const bot = require('../services/bot.service')

function sendMessage(){
trackerService.findAllActive().then((regs)=>{
  if (Array.isArray(regs) && regs.length > 0) {
    for (reg of regs){
      //New USER
      let messageDay = 0;
      let isNew = false
      let chatId = reg.chatId
      if(reg && reg.currentDay==0){
        messageDay=reg.pregnancyDayOnReg
        isNew=true;
      } else{
        if(!reg.intervalLocked){
          messageDay = reg.currentDay +1
        } else{
          messageDay = reg.currentDay
        }
      }
      if(messageDay<=285){
       const message = messageService.getByDay(messageDay).then(v=>{
         return v
       }).catch(err=>{
         console.log("DAY MESSAGE ERROR",err)
       });
      if(message){
       const weeklyDevotional = message.weeklyDevotional||null
       const dailyDevotional =  message.dailyDevotional|| null
       const dailyPrayer = message.dailyPrayer|| null
        if(isNew){
         const quotient = Math.floor(messageDay/8)
         let weeklyMessageDay = 1;
         if(quotient >0){
          weeklyMessageDay = 8*quotient
         }
         const weeklyMessage = messageService.getByDay(weeklyMessageDay).then(v=>{
          return v
        }).catch(err=>{
          console.log("DAY MESSAGE ERROR",err)
        });
        if(weeklyMessage){
          weeklyDevotional = weeklyMessage.weeklyDevotional
        }
        }
        if(!reg.weeklyDevotionalShared){
          if(weeklyDevotional!=null){
            bot.sendMessage(chatId, weeklyDevotional).then(r=>{
              //Weekly Dev
              trackerService.update(reg.id, { weeklyDevotionalShared: true })
              
               //Daily Dev
               if(dailyDevotional!=null){
               bot.sendMessage(chatId, dailyDevotional).then(r=>{
               trackerService.update(reg.id, { dailyDevotionalShared: true })
                 if(dailyPrayer!=null){
                  bot.sendMessage(chatId, dailyPrayer).then(r=>{
                    trackerService.update(reg.id, { dailyPrayerShared: true, intervalLocked: true })
                  }).catch(err=>{
                    console.log("Daily Prayer Error",err)
                  })
                }

               }).catch(err=>{
                 console.log("DAILY DEV ERROR",err)
               })
              }
              }).catch(err=>{
                  console.log("BOT ERROR=",err)
              });
          }else{
             //Daily Dev
             trackerService.update(reg.id, { weeklyDevotionalShared: true })
             if(dailyDevotional!=null && !re.dailyDevotionalShared){
              bot.sendMessage(chatId, dailyDevotional).then(r=>{
              trackerService.update(reg.id, { dailyDevotionalShared: true })
                if(dailyPrayer!=null && !reg.dailyPrayerShared){
                 bot.sendMessage(chatId, dailyPrayer).then(r=>{
                   trackerService.update(reg.id, { dailyPrayerShared: true, intervalLocked: true })
                 }).catch(err=>{
                   console.log("Daily Prayer Error",err)
                 })
               }

              }).catch(err=>{
                console.log("DAILY DEV ERROR",err)
              })
             }
          }
        }
        
      }
      }

    }

  }
}).catch(err=>{
console.log("Failed To Get Active Registrants",err)
})


}



module.exports = { sendMessage};
