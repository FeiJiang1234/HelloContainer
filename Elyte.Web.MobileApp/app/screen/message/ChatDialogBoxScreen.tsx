import React, { useEffect, useState, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Keyboard, Platform, StyleSheet, ActivityIndicator } from 'react-native';
import { Box, FlatList, Pressable, Row, Center, Input, Divider, Flex, Text } from 'native-base';
import { ElAvatar, ElContainer } from 'el/components';
import { useGoBack, useHideTabBar, utils, useDateTime, useSignalR, useAuth, useLoadMore } from 'el/utils';
import colors from 'el/config/colors';
import { ClipSvg, PaperAirplaneSvg, ForwardArrowSvg } from 'el/svgs';
import { userService } from 'el/api';
import CryptoJS from 'crypto-js';
import config from 'el/config/config';
import { SignalrEvent, ChatType } from 'el/enums';
import debounce from "lodash/debounce";
import { useDispatch } from 'react-redux';
import { PENDING, SUCCESS } from 'el/store/slices/requestSlice';
import { PageResult } from 'el/models/pageResult';
import { ResponseResult } from 'el/models/responseResult';
import { MessageModel } from 'el/models/message/messageModel';

global.historyUserChatRecord = [];

export default function ChatDialogBoxScreen({ navigation, route }) {
    useGoBack();
    useHideTabBar();
    const notTypingRef = useRef<any>();
    const { chatType, chatUserName, receiverId } = route.params;
    const { user } = useAuth();
    const { register, unregister, invokeSendTypingState, invokeMarkMessageAsRead, invokeSendMessage } = useSignalR();
    const [showTypingState, setShowTypingState] = useState(false);
    const [receiveContent, setReceiveContent] = useState<any>(null);
    const dispatch = useDispatch();
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const { data: messages, setData: setMessages, initData, loadMoreData, hasMore, pageNumber, pageSize } = useLoadMore();

    useEffect(() => {
        if (Platform.OS !== 'ios') return;
        const showSubscription = Keyboard.addListener('keyboardWillShow', (e) => setKeyboardHeight(e.endCoordinates.height));
        const hideSubscription = Keyboard.addListener('keyboardWillHide', () => setKeyboardHeight(0));

        return () => {
            if (Platform.OS !== 'ios') return;

            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    useEffect(() => {
        getChatMessageHistory();

        register(SignalrEvent.ReceiveMessage, handleReceiveMessage);

        if (chatType === ChatType.Personal) {
            notTypingRef.current = debounce(() => sendTypingState(false), 5000);
            register(SignalrEvent.ReceiveTypingState, handleReceiveTypingState);
        }
        return () => {
            unregister(SignalrEvent.ReceiveMessage);
            unregister(SignalrEvent.ReceiveTypingState);
        };
    }, []);

    useEffect(() => {
        if (!receiveContent) return;
        if (receiveContent.senderId === user.id) return;

        setMessages((m) => [receiveContent, ...m]);
    }, [receiveContent]);

    const sendTypingState = (typingState) => {
        if (chatType === ChatType.Personal) {
            invokeSendTypingState(SignalrEvent.SendTypingState, receiverId, typingState);
            notTypingRef.current && notTypingRef.current();
        }
    }

    const decrypt = (message) => CryptoJS.AES.decrypt(message, config.secretKey).toString(CryptoJS.enc.Utf8);
    const encrypt = (message) => CryptoJS.AES.encrypt(message, config.secretKey).toString();

    const getChatMessageHistory = async () => {
        dispatch(PENDING());
        const res: ResponseResult<PageResult<MessageModel>> = await userService.getChatMessageHistory(receiverId, chatType, 1, pageSize);
        dispatch(SUCCESS());

        if (res && res.code === 200) {
            const messageList: MessageModel[] = res.value.items.map((message) => ({ ...message, content: decrypt(message.content) }));
            initData(messageList);
        }
    }
    
    const loadMoreMessage = async () => {
        const res: ResponseResult<PageResult<MessageModel>> = await userService.getChatMessageHistory(receiverId, chatType, pageNumber, pageSize);
        if (res && res.code === 200) {
            const messageList: MessageModel[] = res.value.items.map((message) => ({ ...message, content: decrypt(message.content) }));
            loadMoreData(messageList);
        }
    };

    const handleReceiveMessage = (data) => {
        if (data.length <= 0) return;

        if ((data.chatType == ChatType.Personal && data.senderId == receiverId) || (data.chatType == ChatType.Team && data.receiverId == receiverId)) {
            data.content = decrypt(data.content);
            setReceiveContent(data);
            invokeMarkMessageAsRead(SignalrEvent.MarkMessageAsRead, receiverId);
        }
    }

    const handleReceiveTypingState = (typingState) => setShowTypingState(typingState);
    const handleMesssageSend = (data) => {
        if (data.length <= 0) return;
        
        const messageContent = encrypt(data);

        const sender = {
            senderId: user.id,
            senderName: `${user.firstName} ${user.lastName}`,
            senderProfileImage: user.pictureUrl
        };

        let message: MessageModel = { id: utils.generateUUID(), ...sender, sendFailed: true, content: data, createdDate: new Date(), isSender: true };
        setMessages((m) => [{...message, isSending: true}, ...m]);
        invokeSendMessage(SignalrEvent.SendMessage, receiverId, messageContent, sender, () => {
            message.sendFailed = false;
            const unSendingMessages = messages.filter(x=>!x.isSending);
            setMessages([message, ...unSendingMessages]);
        }, () => {
            message.sendFailed = true;
            const unSendingMessages = messages.filter(x=>!x.isSending);
            setMessages([message, ...unSendingMessages]);
        });

        if (chatType === ChatType.Personal) {
            sendTypingState(true);
        }
    }

    return (
        <ElContainer h='100%' pb={keyboardHeight}>
            <FlatList data={messages} inverted={true}
                onEndReached={loadMoreMessage}
                ListFooterComponent={!hasMore ? null : <ActivityIndicator style={{ marginTop: 8, marginBottom: 8 }} />}
                renderItem={({ item }) => <MessageItem message={item} />} />

            <MessageInputBox onMessageSend={handleMesssageSend} />

            {showTypingState && <Text mx={1} style={styles.typing}>{chatUserName} is writing...</Text>}
        </ElContainer>
    );
}

const MessageItem = ({ message }: { message: MessageModel }) => {
    const { fromNowFormat } = useDateTime();
    const { isSender } = message;

    return (
        <Row minH={50} my={2} style={{ flexGrow: 1 }} alignItems="flex-end">
            <Flex justify='center' align='flex-end' w={12} h={12}>
                {!isSender && <ElAvatar uri={message.senderProfileImage} size={42} />}
            </Flex>

            <Box flex={1}>
                {message.isSending && (
                    <ActivityIndicator
                        color={colors.primary}
                        style={{ position: 'absolute', left: -24, top: 8 }}
                    />
                )}
                <LinearGradient colors={isSender ? colors.linear.colors : ['#F5F5F5', '#F5F5F5']} style={styles.contentBox}>
                    <Center w="100%" h={10} justifyContent="space-between" flexDirection={"row"}>
                        <Text flex={1} mr={1} isTruncated style={[ styles.sender, { color: isSender ? '#FFFFFF' : '#000000' } ]}>{message.senderName}</Text>
                        <Text style={{ fontSize: 11, color: '#808A9E', marginRight: 16, textAlign: 'right' }}>{fromNowFormat(message.createdDate)}</Text>
                    </Center>
                    <Divider mx={1} w={'90%'} alignSelf="center" _light={{ opacity: 20, bg: isSender ? '#808A9E' : '#BFBFBF' }}></Divider>
                    <Box minH={10}>
                        <Text style={[styles.content, { color: isSender ? '#FFFFFF' : '#808A9E' }]}>{message.content}</Text>
                    </Box>
                </LinearGradient>
            </Box>

            <Flex justify='center' align='center' w={12} h={12}>
                {isSender && <ElAvatar size={42} uri={message.senderProfileImage} />}
                {!isSender && <ForwardArrowSvg/>}
            </Flex>
        </Row>
    );
}

type MessageInputBoxType = { 
    inputAccessoryViewID?: string
    onMessageSend: Function
    [rest: string]: any,
}

const MessageInputBox = ({ onMessageSend, ...rest}: MessageInputBoxType) => {
    const [content, setContent] = useState("");

    const handleMessageSend = () => {
        onMessageSend(content);
        setContent('');
        Keyboard.dismiss();
    }

    return (
        <Row h={50} style={styles.accessory}>
            <LinearGradient {...colors.linear} style={styles.icon}>
                <ClipSvg />
            </LinearGradient>
            <Box flex={1}>
                <Input borderWidth={0} bgColor={colors.light} autoCorrect={false} onSubmitEditing={handleMessageSend} returnKeyType='send' placeholder="Hello!…" variant="filled" value={content} onChangeText={setContent} {...rest}/>
            </Box>
            <Box style={[styles.icon, { backgroundColor: colors.secondary }]}>
                <Pressable onPress={handleMessageSend}>
                    <PaperAirplaneSvg />
                </Pressable>
            </Box>
        </Row>
    );
} 

const styles = StyleSheet.create({
    typing: {
        fontSize: 10, 
        color: colors.secondary
    },
    accessory: {
        backgroundColor: colors.light, 
        borderRadius: 32,
        alignItems: 'center'
    },
    icon: {
        borderRadius: 32, 
        width: 42, 
        height: 42, 
        marginLeft: 4,
        marginRight: 4, 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    sender: {
        fontWeight: '500', 
        marginLeft: 16, 
        fontSize: 15
    },
    contentBox: {
        height: '100%', 
        flex: 1, 
        marginLeft: 4, 
        marginRight: 4, 
        borderRadius: 15
    },
    content: {
        fontSize: 14, 
        marginLeft: 16, 
        marginRight: 16, 
        marginTop: 8, 
        marginBottom: 8 
    }
})