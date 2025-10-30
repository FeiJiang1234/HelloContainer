import http from './httpService';

async function register (user) {
    const res = await http.post(`register`, user, { hideGlobalLoading: true });
    if (res && res.code === 200) {
        http.setJwt(res.value.token);
    }
    return res;
}

function checkUserAccountIsExistence (account) {
    return http.get(`users/check/existence?account=${account}`, { hideGlobalLoading: true });
}

function sendVerificationCode (account) {
    return http.put(`users/verification-code/sending`, { account: account }, { hideGlobalLoading: true });
}

function validateVerificationCodeIsValid (account, passcode) {
    return http.get(`users/${account}/verification-code/validation?code=${passcode}`, { hideGlobalLoading: true });
}

function updatePassword (data) {
    return http.put(`password`, data, { hideGlobalLoading: true, hideGlobalErrorMessage: true });
}

function resetPassword (data) {
    return http.put(`reset-password`, data, { hideGlobalLoading: true });
}

function addContactUs (data) {
    return http.post(`contact-us`, data);
}

function getNotifications () {
    return http.get(`users/notification/list`);
}

function readNotification (notificationId) {
    return http.put(`users/notification/${notificationId}/read`);
}

function getChatUserList (userId) {
    return http.get(`users/${userId}/chat-user/list`);
}

function getChatMessageHistory (receiverId, chatType, pageNumber, pageSize) {
    return http.get(`users/chat-users/${receiverId}/history?chatType=${chatType}&pageNumber=${pageNumber || 0}&pageSize=${pageSize || 0}`, { hideGlobalLoading: true });
}

function markUserMessageAsRead (senderId) {
    return http.put(`users/${senderId}/chat-user-message/read`, {}, { hideGlobalLoading: true });
}

function markGroupMessageAsRead (groupId) {
    return http.put(`users/${groupId}/chat-group-message/read`, {}, { hideGlobalLoading: true });
}

function checkIsExistUnreadItem () {
    return http.get(`users/existence/unread-item`, { hideGlobalLoading: true });
}

function readAllNotification () {
    return http.put(`users/notifications/mark-as-read`, {});
}

function deleteNotifications (notificationIds) {
    return http.put(`users/notifications/deletion`, { notificationIds });
}

function sendPhoneCode (params) {
    return http.post('users/security-code/sending', params)
}

function resetPhoneNumber (params) {
    return http.put('users/phone-number', params)
}

function getStripePublishableKey () {
    return http.get(`stripe-publishable-key`);
}

export default {
    register,
    checkUserAccountIsExistence,
    sendVerificationCode,
    validateVerificationCodeIsValid,
    updatePassword,
    addContactUs,
    getNotifications,
    readNotification,
    resetPassword,
    getChatUserList,
    getChatMessageHistory,
    markUserMessageAsRead,
    markGroupMessageAsRead,
    checkIsExistUnreadItem,
    readAllNotification,
    deleteNotifications,
    resetPhoneNumber,
    sendPhoneCode,
    getStripePublishableKey
};
