import http from './httpService';

function getData (condition) {
    return http.post(`leaderboard`, condition);
}

export default {
    getData
};