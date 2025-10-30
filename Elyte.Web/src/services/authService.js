import jwtDecode from 'jwt-decode';
import http from './httpService';

async function login (user) {
    const res = await http.post(`login`, user, { hideGlobalErrorMessage: true, hideGlobalLoading: true });
    if (res && res.code === 200) {
        http.setJwt(res.value.token);
    }

    return res;
}

async function logout () {
    const res = await http.post(`logout`, {}, { hideGlobalErrorMessage: true, hideGlobalLoading: true });
    if (res && res.code === 200) {
        http.removeJwt();
        if (window.signalR) {
            window.signalR.stop();
        }
    }
    return res;
}

function getCurrentUser () {
    const jwt = http.getJwt();
    if (jwt) {
        return jwtDecode(jwt);
    }

    return null;
}

export default {
    login,
    logout,
    getCurrentUser,
};
