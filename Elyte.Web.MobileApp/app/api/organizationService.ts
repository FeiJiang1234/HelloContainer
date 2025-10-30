import http from './httpService';

function createOfficialRequest(athleteId, dataForm) {
    return http.post(`athletes/${athleteId}/official-requests`, dataForm);
}

function getOfficialIds(athleteId) {
    return http.get(`athletes/${athleteId}/official-ids`);
}

function getOrganizations(organizationName) {
    return http.get(`organizations/list?organizationName=${organizationName}`);
}

function teamSearchOrganizations(teamId, organizationName) {
    return http.get(`organizations/list/team/${teamId}?organizationName=${organizationName}`);
}

export default {
    createOfficialRequest,
    getOrganizations,
    teamSearchOrganizations,
    getOfficialIds,
};
