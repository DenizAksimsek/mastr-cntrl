const moment = require('moment');

exports.formatDateTime = function formatDateTime() {
    const dateTime = moment.utc().utcOffset('+0300').format('YYYY-MM-DDTHH:mm:ss') + '+0300';
    return dateTime;
};
