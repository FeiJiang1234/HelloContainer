import React from 'react';
import { default as ElButton } from './ElButton';
import { useNavigation } from '@react-navigation/native';
import routes from 'el/navigation/routes';

const ElChatMessageButton = ({ toUserId, chatType, ...rest }) => {
    const navigation: any = useNavigation();
    const handleChatToClick = () => {
        navigation.navigate(routes.ChatDialogBox, { receiverId: toUserId, chatType: chatType });
    }
    return <ElButton size="sm" {...rest} onPress={handleChatToClick}>Message</ElButton>
}

export default ElChatMessageButton;