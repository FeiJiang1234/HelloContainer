import userService from 'el/api/userService';
import { ElBody, ElConfirm, ElContainer, ElFlatList, ElMenu, ElTitle } from 'el/components';
import colors from 'el/config/colors';
import { ActionModel } from 'el/models/action/actionModel';
import { ERROR, PENDING, SUCCESS } from 'el/store/slices/requestSlice';
import { useGoBack ,useDateTime} from 'el/utils';
import useNotificationRouter from 'el/utils/useNotificationRouter';
import { Box, Column, Pressable, Row, Image, Text, Center } from 'native-base';
import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';

const NotificationScreen = () => {
    useGoBack();
    const [deleteAllDialogState, setDeleteAllDialogState] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const dispatch = useDispatch();
    const { getProfileRoute } = useNotificationRouter();
    const { utcToLocalMMDDYYHHmmss } = useDateTime();

    useEffect(() => {
        getNotifications();
    }, []);

    const getNotifications = async () => {
        const res: any = await userService.getNotifications();
        if (res && res.code === 200) {
            setNotifications(res.value.notificationList);
        }
    };

    const getOptions = (item) => {
        const options: ActionModel[] = [
            {
                label: 'Read',
                color: colors.blue,
                onPress: () => handleMarkAsReadMenuClick(item.id),
            },
            {
                label: 'Delete',
                color: colors.danger,
                onPress: () => handleDeleteOkClick(item.id),
            },
        ];
        return options;
    }

    const handleReadAllClick = async () => {
        const res: any = await userService.readAllNotification();
        if (res && res.code === 200) {
            getNotifications();
        }
    };

    const handleDeleteAllClick = () => {
        setDeleteAllDialogState(true);
    };

    const handleMarkAsReadMenuClick = async id => {
        const res: any = await userService.readNotification(id);
        if (res && res.code === 200) {
            getNotifications();
        }
    };

    const handleReadClick = item => {
        if (!item.hasRead) {
            userService.readNotification(item.id);
            const newNotifications = notifications.map(x =>
                x.id === item.id ? { ...x, hasRead: true } : x,
            );
            setNotifications(newNotifications);
        }
        if (!item.parameters) return;

        const params = JSON.parse(item?.parameters);
        getProfileRoute(item.action, params.Parameters);
    };

    const handleDeleteOkClick = async id => {
        dispatch(PENDING());
        const res: any = await userService.deleteNotifications([id]);
        if (res && res.code === 200) {
            dispatch(SUCCESS());
            getNotifications();
        } else {
            dispatch(ERROR());
        }
    };

    const handleDeleteAllOkClick = async () => {
        const ids = notifications.map(x => x.id);
        const res: any = await userService.deleteNotifications(ids);
        if (res && res.code === 200) {
            getNotifications();
            setDeleteAllDialogState(false);
        }
    };

    return (
        <ElContainer h="100%">
            <ElTitle>Notifications</ElTitle>
            {notifications.length !== 0 && (
                <Row justifyContent="space-between">
                    <Pressable onPress={handleReadAllClick} hitSlop={8}>
                        <Text fontSize={18}>Read All</Text>
                    </Pressable>
                    <Pressable onPress={handleDeleteAllClick} hitSlop={8}>
                        <Text fontSize={18}>Delete All</Text>
                    </Pressable>
                </Row>
            )}

            <ElFlatList
                data={notifications}
                listEmptyText="No Notifications"
                renderItem={({ item }) => (
                    <Pressable onPress={() => handleReadClick(item)} flex={1}>
                        <Row>
                            {!item.hasRead && <Box style={styles.unread}></Box>}
                            <Image
                                source={require('../../../assets/images/bell.png')}
                                style={{ width: 36, height: 36, borderRadius: 18 }}
                                alt="image"
                            />
                            <Column flex={1} ml={2}>
                                <Text>
                                    {item.subject}
                                </Text>
                                <ElBody
                                    size="sm"
                                    color={colors.secondary}>
                                    {item.content}
                                </ElBody>
                                <ElBody size="sm">{utcToLocalMMDDYYHHmmss(item.sendTime)}</ElBody>
                            </Column>
                            <Center ml={5}>
                                <ElMenu items={getOptions(item)}></ElMenu>
                            </Center>
                        </Row>
                    </Pressable>
                )}
            />
            <ElConfirm
                title="Delete all notifications"
                message="Are you sure to delete all notifications?"
                visible={deleteAllDialogState}
                onCancel={() => setDeleteAllDialogState(false)}
                onConfirm={handleDeleteAllOkClick}
            />
        </ElContainer>
    );
};

const styles = StyleSheet.create({
    unread: {
        position: 'absolute',
        top: -6,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#E95B5B',
    },
});

export default NotificationScreen;
