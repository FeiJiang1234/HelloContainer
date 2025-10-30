import axios from 'axios';
import jwtDecode from 'jwt-decode';
import ReactDOM from 'react-dom'
import React from 'react';
import config from '../config';
import { ElLoadingMask } from 'components';

const tokenKey = 'token';
let currentRequestingQty = 0;

const request = axios.create({
    timeout: 30000,
    baseURL: config.apiUrl + '/api',
});

request.interceptors.response.use(
    res => {
        if (!res?.config?.hideGlobalLoading) {
            hideLoading();
        }

        return res?.data;
    },
    error => {
        if (!error?.config?.hideGlobalLoading) {
            hideLoading();
        }

        const expectedError = error.response && error.response.status >= 400 && error.response.status <= 600;
        if (expectedError) {
            if (!error.config?.hideGlobalErrorMessage) {
                window.elyte.error(error?.response?.data?.Message);
            }
            return Promise.resolve(error.response.data);
        }

        return Promise.resolve(null);
    },
);

request.interceptors.request.use((cfg) => {
    if (!cfg?.hideGlobalLoading) {
        displayLoading();
    }
    const token = getJwt();
    cfg.headers['Authorization'] = 'Bearer ' + token;
    return cfg;
});

const displayLoading = () => {
    if (currentRequestingQty === 0) {
        let div = document.createElement('div');
        div.id = `global-loading`;
        ReactDOM.render(<ElLoadingMask />, div)
        document.body.appendChild(div);
    }
    currentRequestingQty++;
}

const hideLoading = () => {
    currentRequestingQty--;

    if (currentRequestingQty === 0 && document.getElementById('global-loading')) {
        document.getElementById('global-loading').remove();
    }
}

function setJwt (token) {
    sessionStorage.setItem(tokenKey, token);
}

function removeJwt () {
    sessionStorage.removeItem(tokenKey);
}

function getJwt () {
    if (isTokenExpired()) {
        return null;
    }
    return sessionStorage.getItem(tokenKey);
}

function isTokenExpired () {
    const localJwt = sessionStorage.getItem(tokenKey);
    if (!localJwt) {
        return true;
    }
    const decodedToken = jwtDecode(localJwt);
    return Date.now() >= decodedToken.exp * 1000;
}

export default {
    get: request.get,
    post: request.post,
    put: request.put,
    delete: request.delete,
    getJwt,
    setJwt,
    removeJwt,
    isTokenExpired
};
