const xlsxFile = require("read-excel-file/node");
const Message = require("../messages/message.model").Message;
const fs = require("fs");

async function create(messageParams){   
    const message = new Message(messageParams);
    await message.save();
    return Message.findOne({ _id: message._id });
    
}

async function createMany(messageParams){   
    try{
    if(Array.isArray(messageParams)&& messageParams.length>0){
        try{
      messageParams.map((d)=>{
          
          if(d.day){ 
          let request_message = d['message']
          if(request_message){
              d['message'] = request_message.replace(/’/g,"'").replace(/‘/g,"'").replace("\\","");
          }
                 
        const message = new Message(d);  
         message.save()
          }
         
        })
       }catch(err){
       }
    }
    return {upload:"success"};
}catch(err){
    const messages= await Message.find({});  
    if(Array.isArray(messages)&&messages.length>0){
        return {upload:"incomplete"}
    }else{
      return  {upload:"failed"}
    }    
}
}


async function getAll() {
    return await Message.find({$or:[{deleted: false},{deleted:{$exists: false}}]}).lean().sort({day:1});
}

async function getOne(_id) {
    return Message.findById(_id);
}

async function update(id, messageParams) {
    let message = await Message.findById(id);

   
    if (!message) throw 'message not Found';

    
    Object.assign(message, messageParams);

    await message.save();

    return await  Message.findById(id).lean();

}

async function _delete(id) {
    let message = await Message.findById(id);
    message.deleted =true;
    await message.save();
}

async function getByDay(day) {
    return await Message.findOne({day:day,deleted: false}).lean();
}

async function uploadMessages(){
    const path = "./files/messages.xlsx";
    if(!await Message.exists({deleted:false}) && fs.existsSync(path)){
    await xlsxFile(path, { getSheets: true }).then(async(sheets) => {
        const sheetData = await getDailyDevelopmentsFromSheets(sheets[0].name);
        
         await createMany(sheetData)
         .then(message => {
             console.log("First Upload Complete",message) 
          })
         .catch(err=>{
             console.log("Excel Upload Error",err)
         });

        const devData = await getDailyDevortionalsFromSheets(sheets[1].name)
        if(Array.isArray(devData) && devData.length>0){
            devData.map(async d=>{
              const messageToUpdate = await getByDay(d.day) 
              if(messageToUpdate) {
                  await update(messageToUpdate._id, d)
              }
            })
           }
         });
        }
    }


    async function getDailyDevelopmentsFromSheets(sheet){
        var data =[];
        await xlsxFile('./files/messages.xlsx', { sheet: `${sheet}` }).then((rows) => { 
            for (i in rows){
                      if(!isNaN(rows[i][0]) && !isNaN(rows[i][1])){
                          let week = rows[i][1]
                          let trimester = 1;
                          if(week>12 && week<25){
                              trimester = 2
                          } else if(week>=25){
                              trimester = 3
                          }
    
                        data.push({day: rows[i][0],week:week,trimester:trimester,dailyDevelopment:String(rows[i][2]),
                            weeklyDevelopment:String(rows[i][3]),prayer:String(rows[i][4]),deleted:false ,introduction:rows[1][5]});
                      }
                }
        })
     
        return data;
    }
    async function getDailyDevortionalsFromSheets(sheet){
        var data =[];
        await xlsxFile('./files/messages.xlsx', { sheet: `${sheet}` }).then((rows) => { 
            for (i in rows){
                      if(!isNaN(rows[i][2])){
    
                        data.push({day:rows[i][2],trimesterDevotional: rows[i][0],weeklyDevotional:rows[i][1],dailyDevotional:rows[i][4],dailyScripture: rows[i][3]});
                      }
                }
        })
     
        return data;
    }
    
    
    


module.exports = { create, getAll, getOne, update, delete: _delete,createMany,getByDay,uploadMessages}