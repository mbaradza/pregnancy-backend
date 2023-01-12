const mongoose = require( 'mongoose');

const Schema = mongoose.Schema;

const UserTracker = new Schema({
    _id: { type: Schema.Types.ObjectId, auto: true },
    chatId:{ type: String },
    userId: {type: String},
    currentDay: {type: Number},
    pregnancyDayOnReg: { type: Number },
    expectedDeliveryDate: {type: Date}, 
    firstIntroductionSent: {type: Boolean},
    introductionComplete: {type: Boolean},
    emailSaved: {type: Boolean},
    registrationComplete: {type: Boolean},
    weeklyDevotionalShared: {type: Boolean},
    dailyDevotionalShared: {type: Boolean},
    dailyPrayerShared: {type: Boolean},
    sessionCompleted: {type: Boolean},
    optedOut: {type: Boolean},
    reasonGiven: {type: Boolean},
    intervalLocked: {type: Boolean}
});

module.exports = mongoose.model('UserTracker',UserTracker);
