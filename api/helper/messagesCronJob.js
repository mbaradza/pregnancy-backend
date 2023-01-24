var cron = require('node-cron');
const messageSender = require('./messageSender');
const trackerService = require('../services/user_tracker.service')

function sendMessagesAtSeven() {
cron.schedule('0 07 * * *', () => {
  messageSender.sendMessage();
}, {
  scheduled: true,
  timezone: "Africa/Harare"
});
}

function sendMessagesAtNine() {
  cron.schedule('0 09 * * *', () => {
    messageSender.sendMessage();
  }, {
    scheduled: true,
    timezone: "Africa/Harare"
  });
  }
function sendMessagesAtEleven() {
    cron.schedule('0 11 * * *', () => {
      messageSender.sendMessage();
    }, {
      scheduled: true,
      timezone: "Africa/Harare"
    });
    }

  function sendMessagesAtOne() {
      cron.schedule('0 13 * * *', () => {
        messageSender.sendMessage();
      }, {
        scheduled: true,
        timezone: "Africa/Harare"
      });
    }
  
  function sendMessagesAtThree() {
      cron.schedule('0 15 * * *', () => {
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
  cron.schedule('0 05 * * *', () => {
    trackerService.updateInterval();
  },
    {
      scheduled: true,
      timezone: "Africa/Harare"
    });
}


module.exports = {sendMessagesAtSeven,updateIntervalDayEnd,updateIntervalMorning,
  sendMessagesAtThree,sendMessagesAtOne,sendMessagesAtEleven,sendMessagesAtNine}