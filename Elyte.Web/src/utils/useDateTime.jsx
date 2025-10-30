import * as moment from 'moment';

export default function useDateTime() {
    const utcToLocalDatetime = date => {
        let localTime = moment.utc(date).toDate();
        return moment(localTime).format('YYYY-MM-DD HH:mm');
    };

    const utcToLocalDate = date => {
        let localTime = moment.utc(date).toDate();
        return moment(localTime).format('YYYY-MM-DD');
    };

    const fromNow = date => {
        return moment.utc(date).local().fromNow();
    };

    const utcToLocalMMDDYYHHmmss = date => {
        let localTime = moment.utc(date).toDate();
        return moment(localTime).format('MM/DD/YYYY HH:mm:ss');
    };

    return { utcToLocalDatetime, utcToLocalDate, fromNow ,utcToLocalMMDDYYHHmmss};
}
