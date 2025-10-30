import { EventProfileModel } from 'el/models/event/eventProfileModel';
import { ResponseResult } from 'el/models/responseResult';
import { utils } from 'el/utils';
import http from './httpService';

function createEvent(data, file) {
    const formData = utils.formToFormData(data, {});
    formData.append('File', file);
    return http.post(`events`, formData);
}

function getEventProfile(eventId) {
    return http.get<null, ResponseResult<EventProfileModel>>(`events/${eventId}/profile`);
}

function searchEvent(value) {
    return http.get(`events?eventName=${value || ''}`);
}

function searchUnsharedEvent(value) {
    return http.get(`events/unsharing?eventName=${value || ''}`);
}

function getEventParticipants(eventId) {
    return http.get(`events/${eventId}/participants`);
}

function updateEvent(eventId, data) {
    const formData = utils.formToFormData(data, {});
    formData.append('File', data.image);
    return http.put(`events/${eventId}`, formData);
}

function deleteEvent(eventId) {
    return http.delete(`events/${eventId}`);
}

function exitEvent(eventId) {
    return http.delete(`events/${eventId}/exit`);
}

function shareEvent(eventId, shareType) {
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