const mongoose = require( 'mongoose');
const bcrypt = require('bcrypt-nodejs');

const Schema = mongoose.Schema;

const User = new Schema({
    _id: { type: Schema.Types.ObjectId, auto: true },
    email:{ type: String },
    firstName: {type: String},
    surName: {type: String},
    role:{type: String,
        enum: ['user','admin']
    },
    facebookID: {type: String},
    dateOfRegistration: {type: Date},
    currentPregnancyDay: { type: Number },
    dateOfConception: { type: Date },
    expectedBirthDate: { type: Date },
    password: { type: String },
    preferredColor: { type: String },
    active: { type: Boolean },
    lastLoginDate: { type: Date },
    loginCount: { type: Number },
    isSuspended: { type: Boolean },
    hasJournal: { type: Boolean },
    hasDevotional: { type: Boolean }, 
});

User.pre('save', function (next) {
    if(this.password) {
        if(this.isModified('password') || this.isNew) {
                this.hash(this.password, (hashErr, hash) => {
                    if(hashErr) {
                        return next(hashErr);
                    }
                    this.password = hash;
                    return next();
                });

        }
        else {
            return next();
        }
    }
    else {
        return next();
    }
});

User.methods = {
    hash(password, callback){
        return bcrypt.hash(password,null, null, function(err, hash){
            if(err) {
                return callback(err);
            }
            else {

                return callback(null, hash)
            }
        });
},

authenticate(password, callback){
    bcrypt.compare(password, this.password, function(err, result) {
        if(err) {
            return callback(err);
        }
        callback(null, result);
    });
}
}

module.exports = mongoose.model('User', User);
//OPTIONAL , SWAGGER , DEACTIVATE WHEN DEPLOYING TO PRODUCTION
/**
 * @swagger
 *  components:
 *    schemas:
 *      User:
 *        type: object
 *        required: [email, password,role,firstName,lastName, currentPregnancyDay,]
 *        properties:
 *          _id:
 *            type: string
 *            readOnly: true
 *          email:
 *            type: string
 *            format: email
 *          password:
 *            type: string
 *            writeOnly: true
 *          role:
 *            type: string
 *          firstName:
 *            type: string  
 *          lastName:
 *            type: string
 *          currentPregnancyDay:
 *            type: number
 *          dateOfConception:
 *            type: string
 *            format: date
 *          expectedBirthDate:
 *            type: string
 *            format: date
 *          preferredColor:
 *            type: string
 *          active:
 *            type: boolean
 *          lastLoginDate:
 *            type: string
 *            format: date
 *          loginCount:
 *            type: number
 *          isSuspended:
 *            type: boolean
 *          hasJournal:
 *            type: boolean
 *          hasDevotional:
 *            type: boolean
 * 
 *      Login:
 *        type: object
 *        properties:
 *          email:
 *            type: string
 *          password: 
 *            type: string
 *      Users:
 *        type: array
 *        items:
 *          $ref: '#/components/schemas/User'
 * 
 */