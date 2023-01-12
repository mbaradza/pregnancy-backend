const User = require('../user/user.model');


// Create New User
async function create(userParam){
    // Validate
    const duplicate = await User.findOne({ chatId: userParam.chatId });
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

    return User.findOne({ chatId: user.chatId});

}


// Get All Users
async function getAll() {
    return await User.find({}).lean();
}


// Get One
async function getOne(_id) {
    return User.findById(_id);
}

async function findByChatId(chatId){
    return User.findOne({ chatId: chatId})
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
async function existsByEmail(email) {

    return User.exists({email:email});

}


module.exports = { create, getAll, getOne, update,findByChatId,existsByEmail};
