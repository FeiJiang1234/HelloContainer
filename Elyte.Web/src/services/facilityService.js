import http from './httpService';

function getFacility (facilityId) {
    return http.get(`facilities/${facilityId}`);
}

function getFacilityCalendar (facilityId, currentDate) {
    return http.get(`facilities/${facilityId}/calendar?currentDate=${currentDate}`);
}

function createFacility (formData) {
    return http.post(`facilities`, formData);
}

function updateFacility (facilityId, formdata) {
    return http.put(`facilities/${facilityId}`, formdata);
}

function updateFacilityProfileImage (facilityId, formData) {
    return http.put(`facilities/${facilityId}/profile-picture`, formData);
}

function updateFacilityRentalPrice (facilityId, data) {
    return http.put(`facilities/${facilityId}/rental-price`, data);
}

function updateFacilityWorkDays (facilityId, data) {
    return http.put(`facilities/${facilityId}/working-days`, data);
}

function rentFacility (facilityId, data) {
    return http.put(`facilities/${facilityId}/rental`, data);
}

function rentFacilityByAdmin (facilityId, data) {
    return http.put(`facilities/${facilityId}/admin-rental`, data);
}

function closeFacilityTimeBlock (facilityId, data) {
    return http.put(`facilities/${facilityId}/close-time-block`, data);
}

function openFacilityTimeBlock (facilityId, data) {
    return http.put(`facilities/${facilityId}/open-time-block`, data);
}

function getConnectedAccountUrl (facilityId) {
    return http.post(`facilities/stripe-account/link?facilityId=${facilityId}`);
}

function getFacilityAdmins (facilityId) {
    return http.get(`facilities/${facilityId}/admins`);
}

function assignFacilityAdmin (facilityId, athleteId) {
    return http.post(`facilities/${facilityId}/admin`, { AthleteId: athleteId });
}

function cancelFacilityAdmin (facilityId, athleteId) {
    return http.put(`facilities/${facilityId}/admin`, { AthleteId: athleteId });
}

function getAllUsersNotFacilityAdmin (facilityId, userName) {
    return http.get(`athletes/facilities/${facilityId}/not-admin?userName=${userName || ''}`);
}

function GetFacilityInfoByPayment (paymentUrl) {
    return http.get(`facilities/facilityInfo?paymentUrl=${paymentUrl}`);
}

export default {
    getFacility,
    createFacility,
    updateFacility,
    updateFacilityProfileImage,
    getFacilityCalendar,
    updateFacilityRentalPrice,
    updateFacilityWorkDays,
    rentFacility,
    rentFacilityByAdmin,
    closeFacilityTimeBlock,
    openFacilityTimeBlock,
    getConnectedAccountUrl,
    getFacilityAdmins,
    assignFacilityAdmin,
    cancelFacilityAdmin,
    getAllUsersNotFacilityAdmin,
    GetFacilityInfoByPayment
};