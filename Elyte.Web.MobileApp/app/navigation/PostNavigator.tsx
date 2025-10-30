import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import routes from './routes';
import PostScreen from 'el/screen/post/PostScreen';
import PostCreateScreen from 'el/screen/post/PostCreateScreen';
import MyProfileScreen from 'el/screen/accountInfo/MyProfileScreen';
import EditProfileScreen from 'el/screen/accountInfo/EditProfileScreen';
import AccountSecurityScreen from 'el/screen/accountInfo/AccountSecurityScreen';
import PaymentHistoryScreen from 'el/screen/accountInfo/PaymentHistoryScreen';
import ChatUserListScreen from 'el/screen/message/ChatUserListScreen';
import ChatDialogBoxScreen from 'el/screen/message/ChatDialogBoxScreen';
import FindChatUserScreen from 'el/screen/message/FindChatUserScreen';
import TeamInvitesScreen from 'el/screen/accountInfo/TeamInvitesScreen';
import ChangePhoneNumberScreen from 'el/screen/accountInfo/ChangePhoneNumberScreen';
import SearchScreen from 'el/screen/search/SearchScreen';
import NotificationScreen from 'el/screen/notification/NotificationScreen';
import AthleteOfficiateRequestScreen from 'el/screen/accountInfo/AthleteOfficiateRequestScreen';
import AthleteJoinTeamRequestScreen from 'el/screen/accountInfo/AthleteJoinTeamRequestScreen';
import DeleteAccountScreen from 'el/screen/accountInfo/DeleteAccountScreen';

const Stack = createStackNavigator();

const PostNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false, ...TransitionPresets.SlideFromRightIOS }} initialRouteName={routes.PostList}>
            <Stack.Screen name={routes.PostList} component={PostScreen} />
            <Stack.Screen name={routes.PostCreate} component={PostCreateScreen} />
            <Stack.Screen name={routes.MyProfile} component={MyProfileScreen} />
            <Stack.Screen name={routes.DeleteAccount} component={DeleteAccountScreen} />
            <Stack.Screen name={routes.AthleteOfficiateRequest} component={AthleteOfficiateRequestScreen} />
            <Stack.Screen name={routes.AthleteJoinTeamRequest} component={AthleteJoinTeamRequestScreen} />
            <Stack.Screen name={routes.TeamInvites} component={TeamInvitesScreen} />
            <Stack.Screen name={routes.EditProfile} component={EditProfileScreen} />
            <Stack.Screen name={routes.ChangePhoneNumber} component={ChangePhoneNumberScreen} />
            <Stack.Screen name={routes.AccountSecurity} component={AccountSecurityScreen} />
            <Stack.Screen name={routes.PaymentHistory} component={PaymentHistoryScreen} />
            <Stack.Screen name={routes.ChatUserList} component={ChatUserListScreen} />
            <Stack.Screen name={routes.ChatDialogBox} component={ChatDialogBoxScreen} />
            <Stack.Screen name={routes.FindChatUser} component={FindChatUserScreen} />
            <Stack.Screen name={routes.Search} component={SearchScreen} />
            <Stack.Screen name={routes.Notification} component={NotificationScreen} />
        </Stack.Navigator>
    );
};

export default PostNavigator;
