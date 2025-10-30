import React, { useState, useEffect } from 'react';
import { Text, Row, Divider, Box, FlatList, Pressable, Badge } from 'native-base';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ElIcon, ElTitle, ElSearch, ElAvatar, ElContainer } from 'el/components';
import routes from 'el/navigation/routes';
import colors from 'el/config/colors';
import { userService } from 'el/api';
import { useAuth, useGoBack, utils, useSignalR, useDateTime } from 'el/utils';
import CryptoJS from 'crypto-js';
import config from 'el/config/config';
import _ from 'lodash';
import { SignalrEvent, ChatType } from 'el/enums';
import { useDispatch } from 'react-redux';
import { PENDING, SUCCESS } from 'el/store/slices/requestSlice';

export default function ChatUserListScreen({ navigation }) {
    useGoBack();
    const { user } = useAuth();
    const { register, unregister } = useSignalR();
    const [keyword, setKeyword] = useState("");
    const [userList, setUserList] = useState<Array<any>>();
    const [refreshing, setRefreshing] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        navigation.addListener('focus', () => {
            getChatUserList();
        });

        register(SignalrEvent.RefreshChatList, buildChatList);

        return () => unregister(SignalrEvent.RefreshChatList);
    }, []);
 
    useEffect(() => {
        getChatUserList();
    }, [keyword]);

    const getChatUserList = async () => {
        dispatch(PENDING());
        setRefreshing(true);
        const res: any = await userService.getChatUserList(user.id);
        dispatch(SUCCESS());
        setRefreshing(false);
        if (res && res.code === 200) {
            buildChatList(res.value);
        }
    }

    const buildChatList = (newChatList) => {
        if (utils.isArrayNullOrEmpty(newChatList)) return;

        let oldChatList: Array<any> = [];

        for (const chatItem of newChatList) {
            let oldItem = oldChatList.find(x => x.toUserId === chatItem.toUserId);
            if (oldItem) {
                oldItem.content = CryptoJS.AES.decrypt(chatItem.content, config.secretKey).toString(CryptoJS.enc.Utf8);
                oldItem.createdDate = chatItem.createdDate;
                oldItem.unreadMessageCount = chatItem.unreadMessageCount;
            }
            else {
                oldChatList.push({ ...chatItem, content: CryptoJS.AES.decrypt(chatItem.content, config.secretKey).toString(CryptoJS.enc.Utf8) });
            }
        }

        let filterChatList = oldChatList;
        if (keyword) {
            filterChatList = oldChatList.filter(x => x.chatUserName.toUpperCase().indexOf(keyword.toUpperCase()) !== -1);
        }

        setUserList(filterChatList);
    }

    const handleHistoryItemClick = async (item) => {
        switch (item.chatType) {
            case ChatType.Personal:
                userService.markUserMessageAsRead(item.toUserId);
                break;
            case ChatType.Team:
                userService.markGroupMessageAsRead(item.toUserId);
                break;
        }

        navigation.navigate(routes.ChatDialogBox, { receiverId: item.toUserId, chatUserName: item.chatUserName, chatType: item.chatType });
    }

    return (
        <ElContainer h='100%'>
            <ElTitle>Messages</ElTitle>
            <ElSearch onKeywordChange={setKeyword} />
            <FlatList
                data={userList}
                keyExtractor={p => p.toUserId}
                onRefresh={() => getChatUserList()}
                refreshing={false}
                renderItem={({ item }) => <ChatUserItem message={item} onPress={() => handleHistoryItemClick(item)} />}
            />
            <LinearGradient {...colors.linear} style={styles.fab}>
                <Pressable onPress={() => navigation.navigate(routes.FindChatUser)}>
                    <ElIcon name="plus" color={colors.white} size={26} />
                </Pressable>
            </LinearGradient>
        </ElContainer>
    );
}

const styles = StyleSheet.create({
    fab: {
        width: 55,
        height: 55,
        position: 'absolute',
        bottom: 16,
        right: 0,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

const ChatUserItem = ({ message, onPress }) => {
    const { fromNowFormat } = useDateTime();

    const isShowMessageCountBadge = message.chatType === ChatType.Team ? !!message.unreadMessageCount : false;

    return (
        <Pressable flex={1} onPress={onPress}>
            <Row alignItems="center" style={{ paddingBottom: 5, paddingTop: 5 }}>
                {
                    isShowMessageCountBadge && <Badge colorScheme="info" zIndex={1} mb={8} mr={-5} rounded="full">{message.unreadMessageCount > 99 ? "99+" : message.unreadMessageCount}</Badge>
                }
                <ElAvatar onPress={onPress} size={48} uri={message.chatUserProfileImage} />
                <Box ml={1} flex={1}>
                    <Row justifyContent="space-between" >
                        <Text style={{ fontSize: 15, color: '#000000', fontWeight: '500' }} flex={1} isTruncated={true}>{message.chatUserName}</Text>
                        <Text style={{ fontSize: 11, color: '#808A9E', fontWeight: '500' }} ml={1}>{fromNowFormat(message.createdDate)}</Text>
                    </Row>
                    <Text isTruncated style={{ color: message.unreadMessageCount ? '#000000' : '#808A9E', fontWeight: message.unreadMessageCount ? '600' : '400' }}>{message.content}</Text>
                </Box>
            </Row>
            <Divider my={0.5} />
        </Pressable>
    );
}
