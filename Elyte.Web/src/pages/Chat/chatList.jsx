import React, { useEffect, useReducer, useState } from 'react';
import { SpeedDial, Container } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { makeStyles } from '@mui/styles';
import { useHistory } from 'react-router-dom';
import { NoScrollBox, ElSearchBox, ElTitle } from 'components';
import ChatHistoryItem from './components/chatHistoryItem';
import { userService, authService, signalRService } from 'services';
import { AppActions, appReducer, appStates } from '../../store/reducers/app.reducer';
import { ChatType } from 'enums';
import _ from 'lodash';
import CryptoJS from 'crypto-js';
import config from '../../config';


const useStyles = makeStyles(theme => {
    return {
        speedDialContainer: {
            position: 'fixed',
            bottom: theme.spacing(10),
            zIndex: 1,
        },
        speedDial: {
            position: 'absolute',
            bottom: 0,
            right: theme.spacing(4),
        },
    };
});

const ChatList = () => {
    const classes = useStyles();
    const history = useHistory();
    const [state, dispatch] = useReducer(appReducer, appStates);
    const currentUser = authService.getCurrentUser();
    const [keyword, setKeyword] = useState("");

    useEffect(() => {
        signalRService.registerRefreshChatListEvent(buildChatList);
        return () => signalRService.unregisterRefreshChatListEvent();
    }, []);

    useEffect(() => getChatUserList(), [keyword]);

    const getChatUserList = async () => {
        const res = await userService.getChatUserList(currentUser.id);
        if (res && res.code === 200) {
            buildChatList(res.value);
        }
    }

    const buildChatList = (newChatList) => {
        if (Array.isNullOrEmpty(newChatList)) return;

        let oldChatList = _.cloneDeep(state.chatList);
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

        dispatch({ type: AppActions.UpdateChatList, payload: filterChatList });
    }

    const handleHistoryItemClick = async (senderId, chatUserName, chatType) => {
        switch (chatType) {
            case ChatType.Personal:
                userService.markUserMessageAsRead(senderId);
                break;
            case ChatType.Team:
                userService.markGroupMessageAsRead(senderId);
                break;
        }

        history.push("/chatBox", { params: { receiverId: senderId, chatUserName: chatUserName, chatType: chatType } })
    }

    return (
        <NoScrollBox>
            <ElTitle center>Messages</ElTitle>
            <ElSearchBox mb={2} onChange={setKeyword} />
            {
                !Array.isNullOrEmpty(state.chatList) && state.chatList.map((item, index) =>
                    <ChatHistoryItem key={`chat-history-item-${index}`}
                        unreadMessageCount={item.unreadMessageCount}
                        name={item.chatUserName}
                        imageUrl={item.chatUserProfileImage}
                        date={item.createdDate}
                        content={item.content}
                        chatType={item.chatType}
                        onClick={() => handleHistoryItemClick(item.toUserId, item.chatUserName, item.chatType)} />
                )
            }
            <Container maxWidth="sm" className={classes.speedDialContainer}>
                <SpeedDial ariaLabel="SpeedDial" className={classes.speedDial} icon={<AddIcon />} onClick={() => history.push('/addChatUser')} />
            </Container>
        </NoScrollBox>
    );
};

export default ChatList;
