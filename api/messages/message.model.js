const mongoose = require( 'mongoose');

const Schema = mongoose.Schema;

const messageSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, auto: true },
    day:{ type: Number },
    week: {type: Number},
    trimester: {type: Number},
    weeklyDevelopment: {type: String},
    dailyDevelopment: {type: String},
    prayer: { type: String },
    trimesterDevotional: {type: String},
    weeklyDevotional: {type: String},
    dailyDevotional: {type: String},
    dailyScripture: {type: String},
    deleted: {type: Boolean},
    introduction:{type: String}
});


const Message= mongoose.model('message', messageSchema);
module.exports= {Message: Message}