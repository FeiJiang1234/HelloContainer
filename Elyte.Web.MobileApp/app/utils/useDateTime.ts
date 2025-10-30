var moment = require('moment');

export default function useDateTime() {
    const utcToLocalDatetime = (date, format = 'YYYY-MM-DD HH:mm') => {
        let localTime = moment.utc(date).toDate();
        return moment(localTime).format(format);
    };

    const utcToLocalDate = (date, format = 'YYYY-MM-DD') => {
        let localTime = moment.utc(date).toDate();
        return moment(localTime).format(format);
    };

    const fromNow = date => {
        moment.suppressDeprecationWarnings = true;
        return moment.utc(date).local().fromNow();
    };

    const fromNowFormat = date => {
        moment.suppressDeprecationWarnings = true;
        return moment.utc(date).local().fromNow()
            .replace('seconds', 'sec')
            .replace('minutes', 'min')
            .replace('minute', 'min')
            .replace('hour', 'hr');
    };

    const format = (date, format = 'YYYY-MM-DD') => {
        return moment(date).format(format);
    };

    const utcToLocalMMDDYYHHmmss = date => {
        let localTime = moment.utc(date).toDate();
        return moment(localTime).format('MM/DD/YYYY HH:mm:ss');
    };

    return { utcToLocalDatetime, utcToLocalDate, fromNow, fromNowFormat, format,utcToLocalMMDDYYHHmmss };
}
