const Moment = require('moment');
export function convertUnixStampToDate(unixStamp){
    let time = Moment.unix(unixStamp);
    return time.format("DD/MM/YYYY, h:mm:ss a");    
}