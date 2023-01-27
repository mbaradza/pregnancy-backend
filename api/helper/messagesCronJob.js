var cron = require('node-cron');
const messageSender = require('./messageSender');
const trackerService = require('../services/user_tracker.service')
const bot = require('../services/bot.service')

function sendMessagesAtSeven() {
cron.schedule('0 07 * * *', () => {
  messageSender.sendMessage(bot,false);
}, {
  scheduled: true,
  timezone: "Africa/Harare"
});
}

function sendMessagesAtEleven() {
    cron.schedule('0 11 * * *', () => {
      messageSender.sendMessage(bot,false);
    }, {
      scheduled: true,
      timezone: "Africa/Harare"
    });
    }
  function sendMessagesAtThree() {
      cron.schedule('0 15 * * *', () => {
        messageSender.sendMessage(bot,false);
      }, {
        scheduled: true,
        timezone: "Africa/Harare"
      });
    }

function updateIntervalDayEnd(){
  cron.schedule('0 22 * * *', () => {
    trackerService.updateInterval();
  },
    {
      scheduled: true,
      timezone: "Africa/Harare"
    });
}
function updateIntervalMorning(){
  cron.schedule('0 05 * * *', () => {
    trackerService.updateInterval();
  },
    {
      scheduled: true,
      timezone: "Africa/Harare"
    });
}


module.exports = {sendMessagesAtSeven,updateIntervalDayEnd,updateIntervalMorning,
  sendMessagesAtThree,sendMessagesAtEleven}