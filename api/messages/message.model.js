const mongoose = require( 'mongoose');
const bcrypt = require('bcrypt-nodejs');

const Schema = mongoose.Schema;

const Message = new Schema({
    _id: { type: Schema.Types.ObjectId, auto: true },
    day:{ type: Number },
    week: {type: Number},
    trimester: {type: Number},
    dailyDevotional: {type: String},
    weeklyDevotional: {type: String},
    prayer: { type: String },
    deleted: {type: Boolean},
    introduction:{type: String}
});


module.exports = mongoose.model('Message', Message);
//OPTIONAL , SWAGGER , DEACTIVATE WHEN DEPLOYING TO PRODUCTION
/**
 * @swagger
 *  components:
 *    schemas:
 *      Message:
 *        type: object
 *        properties:
 *          _id:
 *            type: string
 *            readOnly: true
 *          day:
 *            type: number
 *          week:
 *            type: number
 *          trimester:
 *            type: number
 *          dailyDevotional:
 *            type: string  
 *          weeklyDevotional:
 *            type: string
 *          prayer:
 *            type: string
 *          introduction:
 *            type: string
 *      Messages:
 *        type: array
 *        items:
 *          $ref: '#/components/schemas/Message'
 * 
 */