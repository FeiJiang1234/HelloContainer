import { userService } from 'services';

export const UserConstants = {
    READ_NOTIFICATION: "READ_NOTIFICATION",
    LOGIN: 'LOGIN',
};

export const ReadNotification = (notificationId) => dispatch => {
    userService.readNotification(notificationId).then((res) => {
        if (res.code === 200) {
            dispatch({ type: UserConstants.READ_NOTIFICATION });
        }
    });
};
