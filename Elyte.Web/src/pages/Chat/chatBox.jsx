import React, { useEffect, useRef, useState, useReducer } from 'react';
import { Box, Divider, Typography, InputBase } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { ElSvgIcon } from 'components';
import { styled } from '@mui/material/styles';
import MessageItem from './components/messageItem';
import { userService, authService, signalRService } from 'services';
import { AppActions, appReducer, appStates } from '../../store/reducers/app.reducer'
import CryptoJS from 'crypto-js';
import { utils } from 'utils';
import config from 'config';
import debounce from "lodash/debounce";
import { ChatType } from 'enums';

const InputArea = styled(Box)(({ theme }) => ({
    background: '#F0F2F7',
    minHeight: theme.spacing(6),
    borderRadius: theme.spacing(4),
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    justifyContent: 'space-between',
}));

const ButtonBox = styled(Box)(({ theme }) => ({
    width: theme.spacing(6),
    height: theme.spacing(4.5),
    borderRadius: theme.spacing(4),
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
}));

const ChatBox = () => {
    const pageNumberRef = useRef(1);
    const pageSize = 10;
    const history = useHistory();
    const container = useRef(null);
    const notTypingRef = useRef();
    const [state, dispatch] = useReducer(appReducer, appStates);
    const currentUser = authService.getCurrentUser();
    const { receiverId, chatUserName, chatType } = history.location.state.params;
    const [receiveContent, setReceiveContent] = useState(null);
    const [showTypingState, setShowTypingState] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasData, setHasData] = useState(true);

    useEffect(() => {
        getChatMessageHistory();
        signalRService.registerReceiveMessageEvent(handleReceiveMessage);
        if (!isGroupChat()) {
            notTypingRef.current = debounce(() => sendTypingState(false), 5000);
            signalRService.registerReceiveTypingStateEvent(handleReceiveTypingState);
        }
        return () => {
            signalRService.unregisterReceiveMessageEvent();
            signalRService.unregisterReceiveTypingStateEvent();
        };
    }, []);

    useEffect(() => {
        scrollToBottom();
        if (!receiveContent) return;
        if (receiveContent.senderId === currentUser.id) return;

        dispatch({ type: AppActions.UpdateChatHistoryList, payload: [...state.chatHistoryList, receiveContent] });
    }, [receiveContent]);

    useEffect(() => {
        if (!isLoadingMore) return;
        pageNumberRef.current += 1;
        getChatMessageHistory();
    }, [isLoadingMore]);

    useEffect(() => {
        if (!isLoadingMore) {
            return scrollToBottom();
        }
        container.current.scrollTop = container.current.clientHeight;
        setIsLoadingMore(false);
    }, [state.chatHistoryList]);

    const isGroupChat = () => chatType !== ChatType.Personal;

    const decrypt = (message) => CryptoJS.AES.decrypt(message, config.secretKey).toString(CryptoJS.enc.Utf8);
    const encrypt = (message) => CryptoJS.AES.encrypt(message, config.secretKey).toString();

    const getChatMessageHistory = async () => {
        const res = await userService.getChatMessageHistory(receiverId, chatType, pageNumberRef.current, pageSize);
        if (res && res.code === 200 && res.value && !Array.isNullOrEmpty(res.value.items)) {
            const messageList = res.value.items.map((message) => { return { ...message, content: decrypt(message.content) } });
            messageList.reverse();
            setHasData(res.value.totalCount < state.chatHistoryList.length + messageList.length);
            dispatch({ type: AppActions.UpdateChatHistoryList, payload: [...messageList, ...state.chatHistoryList] });
        }
    }

    const scrollToBottom = () => {
        const scrollHeight = container.current.scrollHeight;
        const height = container.current.clientHeight;
        const maxScrollTop = scrollHeight - height;
        container.current.scrollTop = maxScrollTop > 0 ? maxScrollTop + 100 : 0;
    }

    const resendMessage = () => {
        if (Array.isNullOrEmpty(state.chatHistoryList)) return;

        const failedMessages = state.chatHistoryList.filter(x => x.sendFailed);
        if (failedMessages.length <= 0) return;
        
        for (const message of failedMessages) {
            const sender = {
                senderId: currentUser.id,
                senderName: `${currentUser.firstName} ${currentUser.lastName}`,
                senderProfileImage: currentUser.pictureUrl
            };

            const content = encrypt(message.content);
            signalRService.sendMessage(receiverId, content, sender).then(() => {
                let m = state.chatHistoryList.find(x => x.id === message.id);
                m.sendFailed = false;
                m.createdDate = new Date();
            }).catch(() => { return; });
        }
    }

    const sendTypingState = (typingState) => {
        signalRService.sendTypingState(receiverId, typingState).catch(() => { return; });
    }

    const handleReceiveMessage = (data) => {
        if (data.length <= 0) return;

        if ((data.chatType == ChatType.Personal && data.senderId == receiverId)
            || (data.chatType == ChatType.Team && data.receiverId == receiverId)) {
            data.content = decrypt(data.content);
            setReceiveContent(data);
            signalRService.markMessageAsRead(receiverId);
        }
    }

    const handleMessageSendClick = (data) => {
        resendMessage();
        if (data.length <= 0) return;
        const messageContent = CryptoJS.AES.encrypt(data, config.secretKey).toString();
        const sender = {
            senderId: currentUser.id,
            senderName: `${currentUser.firstName} ${currentUser.lastName}`,
            senderProfileImage: currentUser.pictureUrl
        };

        let message = { id: utils.generateUUID(), ...sender, sendFailed: true, content: data, createdDate: new Date(), isSender: true };

        signalRService.sendMessage(receiverId, messageContent, sender).then(() => {
            message.sendFailed = false;
            dispatch({ type: AppActions.UpdateChatHistoryList, payload: [...state.chatHistoryList, message] });
        }).catch(() => {
            dispatch({ type: AppActions.UpdateChatHistoryList, payload: [...state.chatHistoryList, message] });
        });

        if (!isGroupChat()) {
            sendTypingState(true);
            notTypingRef.current && notTypingRef.current();
        }
    }

    const handleReceiveTypingState = (typingState) => {
        setShowTypingState(typingState);
    }

    const handleChatBoxScroll = () => {
        const currentHeight = container.current.scrollTop;
        if (!isLoadingMore && currentHeight <= 100) {
            setIsLoadingMore(true);
        }
    }

    return (
        <Box sx={{ height: "calc(100vh - 80px)" }}>
            <Box ref={container} sx={{ height: "calc(100% - 100px)", overflowY: 'auto' }} onScroll={handleChatBoxScroll}>
                {hasData && isLoadingMore && <Box display="flex" justifyContent="center">Loading more...</Box>}
                {
                    !Array.isNullOrEmpty(state.chatHistoryList) && state.chatHistoryList.map((m) => <MessageItem key={m.id} message={m} />)
                }
            </Box>
            <Divider sx={{ marginBottom: 2, marginTop: 2 }} />

            <MessageInputBox userName={chatUserName} isShowTypingState={showTypingState} onMessageSendClick={handleMessageSendClick} />
        </Box>
    );
};

export default ChatBox;


const MessageInputBox = ({ userName, isShowTypingState, onMessageSendClick }) => {
    const [chatContent, setChatContent] = useState('');

    const handleKeyUp = (e) => {
        if (e.key.toLowerCase() !== "enter") return;
        setChatContent('');
        if (onMessageSendClick) {
            onMessageSendClick(chatContent);
        }
    }

    const handleSendMessageClick = () => {
        setChatContent('');
        if (onMessageSendClick) {
            onMessageSendClick(chatContent);
        }
    }
    return (
        <>
            <InputArea>
                <ButtonBox sx={{ background: 'linear-gradient(179.38deg, #1F345D 16.7%, #080E1B 115.63%)' }}>
                    <ElSvgIcon dark xSmall name="clip" />
                </ButtonBox>
                <InputBase sx={{ width: '100%' }} fullWidth placeholder="Type text..." value={chatContent} onChange={(e) => setChatContent(e.target.value)} onKeyUp={handleKeyUp} />
                <ButtonBox sx={{ background: '#17C476' }} onClick={handleSendMessageClick}>
                    <ElSvgIcon dark xSmall name="sendCursor" />
                </ButtonBox>
            </InputArea>
            {
                isShowTypingState &&
                <Typography sx={{ fontSize: 10, marginTop: 1, marginLeft: 4, color: '#17C476' }}>{userName} typing…</Typography>
            }
        </>)
}