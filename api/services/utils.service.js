
async function checkDateIsPast(currentDate,dateToCompareWith){

    if(currentDate.getTime()>dateToCompareWith.getTime()){
        return true
    }else{
        return false
    }
}

module.exports = { checkDateIsPast }