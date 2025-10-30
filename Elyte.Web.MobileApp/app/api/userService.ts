import { MessageModel } from 'el/models/message/messageModel';
import { PageResult } from 'el/models/pageResult';
import { LoginResult } from '../models/auth/loginResult';
import { RegisterCommand } from '../models/auth/registerCommand';
import { ResponseResult } from '../models/responseResult';
import http from './httpService';

async function register(user: RegisterCommand) {
    const res = await http.post<RegisterCommand, ResponseResult<LoginResult>>(`register`, user);
    return res;
}

function addContactUs(data) {
    return http.post(`contact-us`, data);
}

function checkUserAccountIsExistence(account) {
    return http.get(`users/check/existence?account=${account}`);
}

function sendVerificationCode(account) {
    return http.put(`users/verification-code/sending`, { account: account });
}

function validateVerificationCodeIsValid(account, passcode) {
    return http.get(`users/${account}/verification-code/validation?code=${passcode}`);
}

function resetPassword(data) {
    return http.put(`reset-password`, data);
}

function resetPhoneNumber(params) {
    return http.put('users/phone-number', params)
}

function sendPhoneCode(params) {
    return http.post('users/security-code/sending', params)
}

function updatePassword(data) {
    return http.put(`password`, data);
}

function getNotifications() {
    return http.get(`users/notification/list`);
}

function readNotification(notificationId) {
    return http.put(`users/notification/${notificationId}/read`);
}

function readAllNotification() {
    return http.put(`users/notifications/mark-as-read`, {});
}

function deleteNotifications(notificationIds) {
    return http.put(`users/notifications/deletion`, { notificationIds });
}

function getChatUserList(userId) {
    return http.get(`users/${userId}/chat-user/list`);
}

function getChatMessageHistory(receiverId, chatType, pageNumber, pageSize) {
    return http.get<null, ResponseResult<PageResult<MessageModel>>>(`users/chat-users/${receiverId}/history?chatType=${chatType}&pageNumber=${pageNumber || 0}&pageSize=${pageSize || 0}`);
}

function markUserMessageAsRead(senderId) {
    return http.put(`users/${senderId}/chat-user-message/read`, {});
}

function markGroupMessageAsRead(groupId) {
    return http.put(`users/${groupId}/chat-group-message/read`, {});
}

function logout(token) {
    return http.post(`mobile/users/logout`, {
        token: token
    });
}

function getStripePublishableKey() {
    return http.get(`stripe-publishable-key`);
}

export default {
    register,
    addContactUs,
    checkUserAccountIsExistence,
    sendVerificationCode,
    validateVerificationCodeIsValid,
    resetPassword,
    resetPhoneNumber,
    sendPhoneCode,
    updatePassword,
    getNotifications,
    readNotification,
    readAllNotification,
    deleteNotifications,
    getChatUserList,
    getChatMessageHistory,
    markUserMessageAsRead,
    markGroupMessageAsRead,
    logout,
    getStripePublishableKey
};
