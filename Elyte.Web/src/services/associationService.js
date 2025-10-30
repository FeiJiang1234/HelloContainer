import http from './httpService';

function createAssociation (formData) {
    return http.post(`associations`, formData);
}

function getAssociationProfile (associationId) {
    return http.get(`associations/${associationId}/profile`);
}

function updateAssociationProfilePicture (associationId, file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('associationId', associationId);
    return http.put(`associations/${associationId}/profile-picture`, formData);
}

function updateAssociationProfile (associationId, formdata) {
    return http.put(`associations/${associationId}/profile`, formdata);
}

function getAssociationOfficiates (associationId) {
    return http.get(`associations/${associationId}/officiates`);
}

function getAssociationOfficiateRequests (associationId, isShowAll) {
    return http.get(`associations/${associationId}/officiate-requests?isShowAll=${!!isShowAll}`);
}

function acceptAssociationOfficiateRequest (associationId, requestId) {
    return http.put(`associations/${associationId}/officiate-request/${requestId}/acception`, {});
}

function declineAssociationOfficiateRequest (associationId, requestId) {
    return http.put(`associations/${associationId}/officiate-request/${requestId}/rejection`, {});
}

function getAssociationOrganizations (associationId, type) {
    return http.get(`associations/${associationId}/organizations?organizationType=${type || ''}`);
}

function becomeToOfficialAssociation (associationId, data) {
    return http.put(`associations/${associationId}/become-official-association`, data);
}

function getAllUsersNotAssociationAdmin (associationId, userName) {
    return http.get(`athletes/associations/${associationId}/not-admin?userName=${userName || ''}`);
}

function getAssociationAdmin (associationId) {
    return http.get(`associations/${associationId}/admins`);
}

function assignAssociationAdmin (associationId, athleteId) {
    return http.post(`associations/${associationId}/athletes/${athleteId}/admin`);
}

function cancelAssociationAdmin (associationId, athleteId) {
    return http.delete(`associations/${associationId}/athletes/${athleteId}/admin`);
}

function getAssociationFiles (associationId) {
    return http.get(`associations/${associationId}/files`);
}

function deleteAssociationFile (associationId, fileId) {
    return http.delete(`associations/${associationId}/files/${fileId}`);
}

function addAssociationFiles (associationId, formData) {
    return http.post(`associations/${associationId}/files`, formData);
}

function getContactUs (associationId) {
    return http.get(`associations/${associationId}/contacts`);
}

function searchAssociationsByName (name) {
    return http.get(`associations?associationname=${name}`);
}

function deleteAssociation (associationId) {
    return http.delete(`associations/${associationId}`);
}

export default {
    createAssociation,
    getAssociationProfile,
    updateAssociationProfilePicture,
    updateAssociationProfile,
    getAssociationOfficiates,
    getAssociationOfficiateRequests,
    acceptAssociationOfficiateRequest,
    declineAssociationOfficiateRequest,
    getAssociationOrganizations,
    becomeToOfficialAssociation,
    getAllUsersNotAssociationAdmin,
    assignAssociationAdmin,
    getAssociationFiles,
    deleteAssociationFile,
    addAssociationFiles,
    getContactUs,
    getAssociationAdmin,
    cancelAssociationAdmin,
    searchAssociationsByName,
    deleteAssociation
};