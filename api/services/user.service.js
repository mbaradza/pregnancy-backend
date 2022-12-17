const Secret = require('../../config/dev').Secret;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');
const User = require('../user/user.model');


// Authenticate Users
async function authenticate({ email, password}) {
    const user = await User.findOne({ email });
    if (user && bcrypt.compareSync(password, user.password)) {
        const {password, ...userWithoutPassword } = user.toObject();
        //Set A USer Token That Expires After 3 Days
        const token = jwt.sign({ sub: user.id }, Secret,{expiresIn:'3d'});
    

        return {
            ...userWithoutPassword,
            token
        };
    }
}


// Create New User
async function create(userParam){
    // Validate
    const duplicate = await User.findOne({ email: userParam.email });
    if (duplicate) {
        return { 
            status: 409,
            message: 'User already Exists'
         };
    }
   

    let user = new User(userParam);
    //Set Registration Date To Current Date
    user.dateOfRegistration = new Date();

    // Save User
    await user.save();

    return User.findOne({ email: user.email});

}


// Get All Users
async function getAll() {
    return await User.find({}).lean();
}


// Get One
async function getOne(_id) {
    return User.findById(_id);
}


// Update User
async function update(id, userParam) {
    let user = await User.findById(id);
    // Validate
    if (!user) throw 'User not Found';

    // Copy userParam
    Object.assign(user, userParam);

    await user.save();

    return User.findById(id);

}

async function checkEmailRegistration(email) {
    return await User.findOne({ email });

    }



//Delete user
async function _delete(id) {
    await User.deleteOne({_id: id});
}

module.exports = { authenticate, create, getAll, getOne, update, delete: _delete,checkEmailRegistration};
