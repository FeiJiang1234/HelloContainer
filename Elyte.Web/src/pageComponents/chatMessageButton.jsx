import React from 'react';
import { ElButton } from 'components';
import { useHistory } from 'react-router-dom';

const ChatMessageButton = ({ toUserId, chatType }) => {
    const history = useHistory();
    const handleChatToClick = () => {
        history.push("/chatBox", { params: { receiverId: toUserId, chatType: chatType } });
    }
    return <ElButton ml={1} small onClick={handleChatToClick}>Message</ElButton>
}

export default ChatMessageButton;