import http from './httpService';

function getItemsDisplayInCalendar (startDate, endDate) {
    return http.get(`calendar/items/${startDate}/${endDate}`);
}

function getMonthlyViewData (startDate, endDate) {
    return http.get(`calendar/events-and-reminders/every-day-quantity/${startDate}/${endDate}/list`);
}

function getReminderDetailById (reminderId) {
    return http.get(`calendar/${reminderId}/detail`);
}

export default {
    getItemsDisplayInCalendar,
    getMonthlyViewData,
    getReminderDetailById,
};