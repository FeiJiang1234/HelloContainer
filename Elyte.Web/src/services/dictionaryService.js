import http from './httpService';

function getAthleteActiveTeamsNameAndId (sportType, athleteId) {
    return http.get(`dictionary/teams?sportType=${sportType}&athleteId=${athleteId}`);
}

function getCountries () {
    return http.get(`dictionary/region/countries`, { hideGlobalErrorMessage: true, hideGlobalLoading: true });
}

function getStates (countryCode) {
    return http.get(`dictionary/region/${countryCode}/states`, { hideGlobalErrorMessage: true, hideGlobalLoading: true });
}

function getCities (stateCode) {
    return http.get(`dictionary/region/${stateCode}/cities`, { hideGlobalErrorMessage: true, hideGlobalLoading: true });
}

function getOrganizations (name) {
    return http.get(`dictionary/organizations?name=${name || ''}`);
}

export default {
    getAthleteActiveTeamsNameAndId,
    getCountries,
    getStates,
    getCities,
    getOrganizations,
};