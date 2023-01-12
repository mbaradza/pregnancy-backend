
function checkDateIsValidFutureDate(currentDate,dateToCompareWith){
    return dateToCompareWith.getTime()>currentDate.getTime();
}

function isValidDate(date){
try{
if(String(date).length<8){
    return false
} else{
 const timestamp = Date.parse(date); 
 const convertedDate = new Date(timestamp)
 if(convertedDate && convertedDate.getTime()){

    return !isNaN(convertedDate.getTime())

 } else{
     return false;
 }
}
 
}catch(err){
    return false
}
}

function checkDateIsPast(currentDate,dateToCompareWith){
    return currentDate.getTime()>dateToCompareWith.getTime();
}

function isValidEmail(email){
    return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}

function isValidNumber(number){
    return !isNaN(number);
}


module.exports = { checkDateIsPast,checkDateIsValidFutureDate,isValidDate, isValidEmail,isValidNumber}