import React, { useState, useEffect, useRef } from 'react';
import { Box, MenuItem, IconButton } from '@mui/material';
import { Idiograph } from 'parts';
import { makeStyles } from '@mui/styles';
import { useHistory } from 'react-router-dom';
import { ElBox, ElSvgIcon, ElConfirm, ElMenu, ElTitle, ElButton } from 'components';
import { userService } from 'services';
import { useNotificationRouter,useDateTime } from 'utils';

const useStyles = makeStyles(theme => ({
    content: {
        borderRadius: theme.spacing(0.5),
        borderBottom: '1px solid #F0F2F7',
        '&:hover': {
            background: '#F0F2F7',
            borderBottom: '1px solid transparent',
        },
    },
}));

const Notifications = () => {
    const classes = useStyles();
    const history = useHistory();
    const menuRef = useRef();
    const { getProfileRoute } = useNotificationRouter();
    const [deleteDialogState, setDeleteDialogState] = useState(false);
    const [deleteAllDialogState, setDeleteAllDialogState] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [currentSelectNotification, setCurrentSelectNotification] = useState();
    const { utcToLocalMMDDYYHHmmss } = useDateTime();

    useEffect(() => getNotifications(), []);

    const getNotifications = async () => {
        const res = await userService.getNotifications();
        if (res && res.code === 200) {
            setNotifications(res.value.notificationList);
        }
    }

    const handleMenuClick = (e, notificationItem) => {
        menuRef.current.open(e.currentTarget);
        setCurrentSelectNotification(notificationItem);
    };

    const handleReadAllClick = async () => {
        const res = await userService.readAllNotification();
        if (res && res.code === 200) {
            getNotifications();
        }
    }

    const handleDeleteAllClick = () => {
        setDeleteAllDialogState(true);
    }

    const handleMarkAsReadMenuClick = async () => {
        menuRef.current.close();
        const res = await userService.readNotification(currentSelectNotification.id);
        if (res && res.code === 200) {
            getNotifications();
        }
    }

    const handleReadClick = (item) => {
        if (!item?.hasRead) userService.readNotification(item?.id);

        if (!item?.parameters) return;

        const params = JSON.parse(item?.parameters);
        const routerPath = getProfileRoute(item?.action, params?.Parameters || '');
        if (routerPath) {
            history.push(routerPath);
        }
    }

    const handleDeleteMenuClick = () => {
        menuRef.current.close();
        setDeleteDialogState(true);
    }

    const handleDeleteOkClick = async () => {
        const res = await userService.deleteNotifications([currentSelectNotification.id]);
        if (res && res.code === 200) {
            getNotifications();
        }
    }

    const handleDeleteAllOkClick = async () => {
        const ids = notifications.map(x => x.id);
        const res = await userService.deleteNotifications(ids);
        if (res && res.code === 200) {
            getNotifications();
        }
    }

    return (
        <Box>
            <ElTitle center>Notifications</ElTitle>
            {
                Array.isNullOrEmpty(notifications) && <ElBox center flex={1}>No Notifications</ElBox>
            }
            {
                !Array.isNullOrEmpty(notifications) &&
                <ElBox mt={-2}>
                    <ElButton variant="text" sx={{ background: "#FFFFFF" }} onClick={handleReadAllClick}>Read All</ElButton>
                    <span className="fillRemain"></span>
                    <ElButton variant="text" sx={{ background: "#FFFFFF" }} onClick={handleDeleteAllClick}>Delete All</ElButton>
                </ElBox>
            }

            {
                !Array.isNullOrEmpty(notifications) && notifications.map((item, index) => (
                    <Box key={item.id + "index" + index} pl={2} pr={1} pt={0.5} className={classes.content}>
                        <ElBox center mb={1.5}>
                            <Idiograph isShowDot={!item.hasRead} title={item.subject} centerTitle={item.content} subtitle={utcToLocalMMDDYYHHmmss(item.sendTime)} imgurl='images/bell.png' onClick={() => handleReadClick(item)} />
                            <span className="fillRemain"></span>
                            <IconButton onClick={event => handleMenuClick(event, item)}>
                                <ElSvgIcon light small name="options" />
                            </IconButton>
                        </ElBox>
                    </Box>
                ))
            }

            <ElMenu ref={menuRef}>
                <MenuItem onClick={handleMarkAsReadMenuClick}>Mark as read</MenuItem>
                <MenuItem onClick={handleDeleteMenuClick}>Delete</MenuItem>
            </ElMenu>

            <ElConfirm
                title="Are you sure to delete this notification?"
                keepMounted
                open={deleteDialogState}
                onNoClick={() => setDeleteDialogState(false)}
                onOkClick={handleDeleteOkClick}
            />

            <ElConfirm
                title="Are you sure to delete all notifications?"
                keepMounted
                open={deleteAllDialogState}
                onNoClick={() => setDeleteAllDialogState(false)}
                onOkClick={handleDeleteAllOkClick}
            />
        </Box>
    );
};

export default Notifications;
