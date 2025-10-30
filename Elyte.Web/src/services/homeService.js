import http from './httpService';

function getData (type, name) {
    return http.get(`homes/retrieval?type=${type || ''}&name=${name || ''}`);
}

export default {
    getData
};