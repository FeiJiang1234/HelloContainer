import http from './httpService';

function getTerm (termType, isPreview) {
    return http.get(`terms?type=${termType}&isPreview=${!!isPreview}`);
}

export default {
    getTerm
};