import { CityResult } from './../models/dictionary/cityResult';
import { StateResult } from './../models/dictionary/stateResult';
import { ResponseResult } from './../models/responseResult';
import { CountryResult } from './../models/dictionary/countryResult';
import http from './httpService';

function getAthleteActiveTeamsNameAndId(sportType, athleteId) {
    return http.get(`dictionary/teams?sportType=${sportType}&athleteId=${athleteId}`);
}

function getCountries() {
    return http.get<ResponseResult<CountryResult[]>>(`dictionary/region/countries`);
}

function getStates(countryCode) {
    return http.get<ResponseResult<StateResult[]>>(`dictionary/region/${countryCode}/states`);
}

function getCities(stateCode) {
    return http.get<ResponseResult<CityResult[]>>(`dictionary/region/${stateCode}/cities`);
}

function getOrganizations(name = '') {
    return http.get(`dictionary/organizations?name=${name}`);
}

export default {
    getCountries,
    getStates,
    getCities,
    getOrganizations,
    getAthleteActiveTeamsNameAndId
};
