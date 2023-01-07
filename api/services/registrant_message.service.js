const RegistrantMessage = require("../registrantMessage/registrant_message.model").RegistrantMessage;
const mongoose = require('mongoose');



async function create(registrantMessageParams){   
    const registrantMessage = new RegistrantMessage(registrantMessageParams);
    await registrantMessage.save();
    return RegistrantMessage.findOne({ _id: registrantMessage._id });
    
}

async function getAll() { 
    
    return await RegistrantMessage.find({}).lean()
    .exec();
}

async function getOne(_id) {
    return RegistrantMessage.findById(_id)

}

async function update(id, registrantMessageParams) {
    let registrantMessage = await RegistrantMessage.findById(id);

   
    if (!registrantMessage) throw 'RegistrantMessage not Found';

    
    Object.assign(registrantMessage, registrantMessageParams);

    await registrantMessage.save();

    return await  RegistrantMessage.findById(id);

}

async function _delete(id) {
    await RegistrantMessage.deleteOne({_id: id});
}

async function getByUser(user) {
   const user_id = mongoose.Types.ObjectId(user);
   try{

    const msg = await RegistrantMessage.findOne({user: user_id}).sort({sentOn: -1}).limit(1);
    return msg;
}catch(err){
console.log(err)
}
}  

module.exports = { create, getAll, getOne, update, delete: _delete,getByUser};