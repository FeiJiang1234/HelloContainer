import http from './httpService';

function createEvent (data) {
    return http.post(`events`, data);
}

function getEventProfile (eventId) {
    return http.get(`events/${eventId}/profile`);
}

function searchEvent (value) {
    return http.get(`events?eventName=${value || ''}`);
}

function searchUnsharedEvent (value) {
    return http.get(`events/unsharing?eventName=${value || ''}`);
}

function getEventParticipants (eventId) {
    return http.get(`events/${eventId}/participants`);
}

function updateEvent (eventId, data) {
    return http.put(`events/${eventId}`, data);
}

function deleteEvent (eventId) {
    return http.delete(`events/${eventId}`);
}

function exitEvent (eventId) {
    return http.delete(`events/${eventId}/exit`);
}

function shareEvent (eventId, shareType) {
    return http.put(`events/${eventId}/share`, { shareType });
}

export default {
    createEvent,
    getEventProfile,
    searchEvent,
    searchUnsharedEvent,
    getEventParticipants,
    updateEvent,
    deleteEvent,
    exitEvent,
    shareEvent
};