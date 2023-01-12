var cron = require('node-cron');
const messageSender = require('./messageSender');
const trackerService = require('../services/user_tracker.service')

function sendMessagesAtSeven() {
cron.schedule('0 7 * * *', () => {
  messageSender.sendMessage();
}, {
  scheduled: true,
  timezone: "Africa/Harare"
});
}
function sendMessagesAtTen() {
  cron.schedule('00 10 * * *', () => {
    messageSender.sendMessage();
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
  cron.schedule('0 6 * * *', () => {
    trackerService.updateInterval();
  },
    {
      scheduled: true,
      timezone: "Africa/Harare"
    });
}


module.exports = {sendMessagesAtSeven,sendMessagesAtTen,updateIntervalDayEnd,updateIntervalMorning}