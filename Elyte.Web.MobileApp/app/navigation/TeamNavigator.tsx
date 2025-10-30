import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import routes from './routes';
import TeamScreen from '../screen/team/TeamScreen';
import TeamCreateScreen from '../screen/team/TeamCreateScreen';
import TeamCreateSuccessScreen from '../screen/team/TeamCreateSuccessScreen';
import TeamProfileScreen from 'el/screen/team/TeamProfileScreen';
import JoinTeamRequestScreen from 'el/screen/team/JoinTeamRequestScreen';
import AthleteProfileScreen from 'el/screen/team/AthleteProfileScreen';
import InvitePlayersScreen from 'el/screen/team/InvitePlayersScreen';
import EditTeamProfileScreen from 'el/screen/team/EditTeamProfileScreen';


const Stack = createStackNavigator();

const TeamNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                ...TransitionPresets.SlideFromRightIOS,
            }}>
            <Stack.Screen name={routes.TeamList} component={TeamScreen} />
            <Stack.Screen name={routes.TeamProfile} component={TeamProfileScreen} />
            <Stack.Screen name={routes.EditTeamProfile} component={EditTeamProfileScreen} />
            <Stack.Screen name={routes.TeamCreate} component={TeamCreateScreen} />
            <Stack.Screen name={routes.TeamCreateSuccess} component={TeamCreateSuccessScreen} />
            <Stack.Screen name={routes.JoinTeamRequest} component={JoinTeamRequestScreen} />
            <Stack.Screen name={routes.AthleteProfile} component={AthleteProfileScreen} />
            <Stack.Screen name={routes.InvitePlayers} component={InvitePlayersScreen} />
        </Stack.Navigator>
    );
};

export default TeamNavigator;
