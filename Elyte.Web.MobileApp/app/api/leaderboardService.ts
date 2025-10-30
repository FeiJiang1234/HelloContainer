import { PageResult } from 'el/models/pageResult';
import { ResponseResult } from 'el/models/responseResult';
import http from './httpService';

function getData (condition) {
    return http.post<null, ResponseResult<PageResult<any>>>(`leaderboard`, condition);
}

export default {
    getData
};