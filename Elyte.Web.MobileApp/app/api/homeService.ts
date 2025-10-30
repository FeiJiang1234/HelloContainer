import { PageResult } from 'el/models/pageResult';
import { ResponseResult } from 'el/models/responseResult';
import http from './httpService';

function getData(pageNumber, pageSize, type, name) {
    return http.get<null, ResponseResult<PageResult<any>>>(
        `mobile/homes/retrieval?type=${type}&name=${name}&pageNumber=${pageNumber}&pagesize=${pageSize}`,
    );
}

export default {
    getData,
};
