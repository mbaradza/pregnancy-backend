var cron = require('node-cron');
const messageSender = require('./messageSender');
const trackerService = require('../services/user_tracker.service')

function sendMessagesAtSeven() {
cron.schedule('*/2 * * * *', () => {
  messageSender.sendMessage();
}, {
  scheduled: true,
  timezone: "Africa/Harare"
});
}

function updateIntervalDayEnd(){
  cron.schedule('*/3 * * * *', () => {
    trackerService.updateInterval();
  },
    {
      scheduled: true,
      timezone: "Africa/Harare"
    });
}
function updateIntervalMorning(){
  cron.schedule('0 23 * * *', () => {
    trackerService.updateInterval();
  },
    {
      scheduled: true,
      timezone: "Africa/Harare"
    });
}


module.exports = {sendMessagesAtSeven,updateIntervalDayEnd,updateIntervalMorning}