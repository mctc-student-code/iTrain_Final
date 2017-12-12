var moment = require('moment');
//use this function to clean up the dates entered by users
function formatDate(date) {

    m = moment.utc(date);

    return m.parseZone().format('dddd, MMMM Do YYYY, h:mm a');
}

module.exports = {
    formatDate : formatDate
};
