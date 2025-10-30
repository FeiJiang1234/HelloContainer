import { AssociationProfileModel } from 'el/models/association/associationProfileModel';
import { ResponseResult } from 'el/models/responseResult';
import http from './httpService';

function getContactUs(associationId) {
    return http.get(`associations/${associationId}/contacts`);
}

function createAssociation(data) {
    return http.post(`associations`, data);
}

function getAssociationProfile(associationId) {
    return http.get<null, ResponseResult<AssociationProfileModel>>(`associations/${associationId}/profile`);
}

function deleteAssociation(associationId) {
    return http.delete(`associations/${associationId}`);
}

function updateAssociationProfile(associationId, formData) {
    return http.put(`associations/${associationId}/profile`, formData);
}

function getAssociationOfficiates(associationId) {
    return http.get(`associations/${associationId}/officiates`);
}

function getAssociationOfficiateRequests(associationId, isShowAll) {
    return http.get(`associations/${associationId}/officiate-requests?isShowAll=${!!isShowAll}`);
}

function acceptAssociationOfficiateRequest(associationId, requestId) {
    return http.put(`associations/${associationId}/officiate-request/${requestId}/acception`, {});
}

function declineAssociationOfficiateRequest(associationId, requestId) {
    return http.put(`associations/${associationId}/officiate-request/${requestId}/rejection`, {});
}

function updateAssociationProfilePicture(associationId, file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('associationId', associationId);
    return http.put(`associations/${associationId}/profile-picture`, formData);
}

function getAllUsersNotAssociationAdmin(associationId, userName) {
    return http.get(`athletes/associations/${associationId}/not-admin?userName=${userName || ''}`);
}

function assignAssociationAdmin(associationId, athleteId) {
    return http.post(`associations/${associationId}/athletes/${athleteId}/admin`);
}

function getAssociationAdmin(associationId) {
    return http.get(`associations/${associationId}/admins`);
}

function cancelAssociationAdmin(associationId, athleteId) {
    return http.delete(`associations/${associationId}/athletes/${athleteId}/admin`);
}

function getAssociationOrganizations(associationId, type = '') {
    return http.get(`associations/${associationId}/organizations?organizationType=${type}`);
}

export default {
    getAllUsersNotAssociationAdmin,
    assignAssociationAdmin,
    getContactUs,
    createAssociation,
    getAssociationProfile,
    deleteAssociation,
    updateAssociationProfile,
    updateAssociationProfilePicture,
    getAssociationOfficiates,
    getAssociationOfficiateRequests,
    acceptAssociationOfficiateRequest,
    declineAssociationOfficiateRequest,
    getAssociationAdmin,
    cancelAssociationAdmin,
    getAssociationOrganizations
};
