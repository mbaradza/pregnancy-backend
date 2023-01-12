const UserTracker = require('../user_tracker/user_tracker.model');


// Create New User Tracker
async function create(userTrackerParam){
    // Validate
    const duplicate = await UserTracker.findOne({ chatId: userTrackerParam.chatId });
    if (duplicate) {
        return { 
            status: 409,
            message: 'User Tracker already Exists'
         };
    }
   

    let userTracker = new UserTracker(userTrackerParam);
    

    // Save User
    await userTracker.save();

    return UserTracker.findOne({ chatId: userTracker.chatId});

}


// Update User
async function update(id, userTrackerParam) {
    let userTracker = await UserTracker.findById(id);
    // Validate
    if (!userTracker) throw 'Tracker not Found';

    // Copy userParam
    Object.assign(userTracker, userTrackerParam);

    await userTracker.save();

    return UserTracker.findById(id);

}

async function getOne(chatId){

    return UserTracker.findOne({chatId: chatId});
}

async function findAllActive(){
    return UserTracker.find({$and:[{optedOut:false},{sessionCompleted:false},{registrationComplete:true}]})
}
async function updateInterval() {
    const trakcers =await UserTracker.find({intervalLocked:true});

    trakcers.map(m=>{
        m.intervalLocked=false;
        m.save();
    })
}

module.exports = { create,getOne, update,findAllActive, updateInterval};
