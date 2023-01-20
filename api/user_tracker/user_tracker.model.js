const mongoose = require( 'mongoose');

const Schema = mongoose.Schema;

const UserTracker = new Schema({
    _id: { type: Schema.Types.ObjectId, auto: true },
    chatId:{ type: String },
    userId: {type: String},
    currentDay: {type: Number},
    pregnancyDayOnReg: { type: Number },
    expectedDeliveryDate: {type: Date}, 
    introductionComplete: {type: Boolean},
    emailSaved: {type: Boolean},
    registrationComplete: {type: Boolean},
    hasSubscribed: {type: Boolean},
    dailyDevotionalsShared: {type: Boolean},
    dailyMessagesShared:{type: Boolean},
    sessionCompleted: {type: Boolean},
    optedOut: {type: Boolean},
    reasonGiven: {type: Boolean},
    intervalLocked: {type: Boolean},
    newSubscriber: {type: Boolean}
});

module.exports = mongoose.model('UserTracker',UserTracker);
