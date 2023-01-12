const mongoose = require( 'mongoose');

const Schema = mongoose.Schema;

const User = new Schema({
    _id: { type: Schema.Types.ObjectId, auto: true },
    email:{ type: String },
    firstName: {type: String},
    surName: {type: String},
    role:{type: String,
        enum: ['user','admin']
    },
    chatId: {type: String},
    dateOfRegistration: {type: Date},
    currentPregnancyDay: { type: Number },
    expectedDeliveryDate: { type: Date },
    active: { type: Boolean },
    isSuspended: { type: Boolean },
    optedOut: {type: Boolean},
    reasonForOptingOut: {type: String}
});

module.exports = mongoose.model('user', User);
