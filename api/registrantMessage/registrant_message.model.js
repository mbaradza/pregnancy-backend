const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema
const registrantMessageSchema = new mongoose.Schema({
    _id: { type: Schema.Types.ObjectId, auto: true },
 
sentOn: Date,
messageDay: Number,
messageId: String,
message: String,
user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
 },
 sentMessageId: String,
 email: String,
});
// model
const RegistrantMessage = mongoose.model('registrant_message', registrantMessageSchema);

module.exports = { RegistrantMessage : RegistrantMessage };
/**
 * @swagger
 *  components:
 *    schemas:
 *      RegistrantMessage:
 *        type: object
 *        properties:
 *          _id:
 *            type: string
 *            readOnly: true
 *          sentOn:
 *            type: string
 *            format: Date
 *          message:
 *            type: string
 *          user:
 *            type: string
 *          email:
 *            type: string
 *          sentMessageId:
 *            type: string
 *      RegistrantMessages:
 *        type: array
 *        items:
 *          $ref: '#/components/schemas/RegistrantMessage'
 * 
 */