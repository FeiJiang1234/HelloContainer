import { FacilityModel } from 'el/models/facility/facilityModel';
import { ResponseResult } from 'el/models/responseResult';
import http from './httpService';

function getFacility(facilityId) {
    return http.get<null, ResponseResult<FacilityModel>>(`facilities/${facilityId}`);
}

function updateFacilityProfilePicture(facilityId, file) {
    const formData = new FormData();
    formData.append('File', file);
    formData.append('facilityId', facilityId);
    return http.put(`facilities/${facilityId}/profile-picture`, formData);
}

function getFacilityCalendar(facilityId, currentDate) {
    return http.get(`facilities/${facilityId}/calendar?currentDate=${currentDate}`);
}

function rentFacilityByAdmin(facilityId, data) {
    return http.put(`facilities/${facilityId}/admin-rental`, data);
}

function rentFacility(facilityId, data) {
    return http.put(`facilities/${facilityId}/rental`, data);
}

export default {
    getFacility,
    updateFacilityProfilePicture,
    getFacilityCalendar,
    rentFacilityByAdmin,
    rentFacility
};
