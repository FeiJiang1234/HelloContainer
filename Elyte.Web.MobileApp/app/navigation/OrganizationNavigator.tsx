import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import routes from './routes';
import OrganizationScreen from '../screen/organization/OrganizationScreen';
import OrganizationCreateScreen from 'el/screen/organization/OrganizationCreateScreen';
import LeagueCreateScreen from 'el/screen/league/LeagueCreateScreen';
import LeagueCreateSuccessScreen from 'el/screen/league/LeagueCreateSuccessScreen';
import LeagueProfileScreen from 'el/screen/league/LeagueProfileScreen';
import OfficiateScreen from 'el/screen/organization/OfficiateScreen';
import BecomeOfficiateScreen from 'el/screen/organization/BecomeOfficiateScreen';
import GameProfileScreen from 'el/screen/game/GameProfileScreen';
import TournamentProfileScreen from 'el/screen/tournament/TournamentProfileScreen';
import FacilityProfileScreen from 'el/screen/facility/FacilityProfileScreen';
import AssociationProfileScreen from 'el/screen/association/AssociationProfileScreen';
import BasketballScoreBoardScreen from 'el/screen/game/basketball/BasketballScoreBoardScreen';
import SoccerScoreBoardScreen from 'el/screen/game/soccer/SoccerScoreBoardScreen';
import GamePostScreen from 'el/screen/game/GamePostScreen';
import BasketballLogScreen from 'el/screen/game/basketball/BasketballLogScreen';
import BasketballPositionSelectorScreen from 'el/screen/game/basketball/BasketballPositionSelectorScreen';
import GameRecapScreen from 'el/screen/game/GameRecapScreen';
import BasketballFoulScreen from 'el/screen/game/basketball/BasketballFoulScreen';
import BasketballActionEditScreen from 'el/screen/game/basketball/BasketballActionEdit';
import BasketballStatsScreen from 'el/screen/game/basketball/BasketballStatsScreen';
import GameRosterScreen from 'el/screen/game/GameRosterScreen';
import GameStatRecordersScreen from 'el/screen/game/GameStatRecordersScreen';
import BasketballAthleteStatsScreen from 'el/screen/game/basketball/BasketballAthleteStatsScreen';
import SoccerPositionSelectorScreen from 'el/screen/game/soccer/SoccerPositionSelectorScreen';
import SoccerFoulScreen from 'el/screen/game/soccer/SoccerFoulScreen';
import SoccerLogScreen from 'el/screen/game/soccer/SoccerLogScreen';
import SoccerCardScreen from 'el/screen/game/soccer/SoccerCardScreen';
import SoccerStatsScreen from 'el/screen/game/soccer/SoccerStatsScreen';
import SoccerAthleteStatsScreen from 'el/screen/game/soccer/SoccerAthleteStatsScreen';
import SoccerActionEditScreen from 'el/screen/game/soccer/SoccerActionEdit';
import OrganizationTeamLineUpScreen from 'el/screen/organization/OrganizationTeamLineUpScreen';
import GameTeamLineUpScreen from 'el/screen/game/GameTeamLineUpScreen';
import ChangeInGamePlayerScreen from 'el/screen/game/ChangeInGamePlayerScreen';
import GetAllUsersToSelectAdminScreen from 'el/screen/athlete/GetAllUsersToSelectAdminScreen';
import LeagueTeamQueueListScreen from 'el/screen/league/LeagueTeamQueueListScreen';
import EditLeagueProfileScreen from 'el/screen/league/EditLeagueProfileScreen';
import AssignCoordinatorsScreen from 'el/screen/organization/AssignCoordinatorsScreen';
import TournamentCreateScreen from 'el/screen/tournament/TournamentCreateScreen';
import TournamentCreateSuccessScreen from 'el/screen/tournament/TournamentCreateSuccessScreen';
import AssociationCreateScreen from 'el/screen/association/AssociationCreateScreen';
import AssociationCreateSuccessScreen from 'el/screen/association/AssociationCreateSuccessScreen';
import EditTournamentProfileScreen from 'el/screen/tournament/EditTournamentProfileScreen';
import EditAssociationProfileScreen from 'el/screen/association/EditAssociationProfileScreen';
import TournamentTeamQueueListScreen from 'el/screen/tournament/TournamentTeamQueueListScreen';
import AssociationOrganizationListScreen from 'el/screen/association/AssociationOrganizationListScreen';
import FacilityCalendar from 'el/screen/facility/FacilityCalendar';
import LowSportStatsScreen from 'el/screen/game/lowStatsSport/LowSportStatsScreen';

const Stack = createStackNavigator();

const OrganizationNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                ...TransitionPresets.SlideFromRightIOS,
            }}
            initialRouteName={routes.OrganizationList}>
            <Stack.Screen name={routes.OrganizationList} component={OrganizationScreen} />
            <Stack.Screen name={routes.OrganizationCreate} component={OrganizationCreateScreen} />
            <Stack.Screen name={routes.OrganizationTeamLineUp} component={OrganizationTeamLineUpScreen} />
            <Stack.Screen name={routes.GetAllUsersToSelectAdmin} component={GetAllUsersToSelectAdminScreen} />
            <Stack.Screen name={routes.AssignCoordinators} component={AssignCoordinatorsScreen} />
            <Stack.Screen name={routes.Officiate} component={OfficiateScreen} />
            <Stack.Screen name={routes.BecomeOfficiate} component={BecomeOfficiateScreen} />
            <Stack.Screen name={routes.LeagueCreate} component={LeagueCreateScreen} />
            <Stack.Screen name={routes.LeagueCreateSuccess} component={LeagueCreateSuccessScreen} />
            <Stack.Screen name={routes.LeagueProfile} component={LeagueProfileScreen} />
            <Stack.Screen name={routes.EditLeagueProfile} component={EditLeagueProfileScreen} />
            <Stack.Screen name={routes.LeagueTeamQueue} component={LeagueTeamQueueListScreen} />
            <Stack.Screen name={routes.TournamentCreate} component={TournamentCreateScreen} />
            <Stack.Screen name={routes.TournamentCreateSuccess} component={TournamentCreateSuccessScreen} />
            <Stack.Screen name={routes.TournamentProfile} component={TournamentProfileScreen} />
            <Stack.Screen name={routes.EditTournamentProfile} component={EditTournamentProfileScreen} />
            <Stack.Screen name={routes.TournamentTeamQueue} component={TournamentTeamQueueListScreen} />
            <Stack.Screen name={routes.GameProfile} component={GameProfileScreen} />
            <Stack.Screen name={routes.GamePost} component={GamePostScreen} />
            <Stack.Screen name={routes.GameRecap} component={GameRecapScreen} />
            <Stack.Screen name={routes.GameRoster} component={GameRosterScreen} />
            <Stack.Screen name={routes.GameStatRecorders} component={GameStatRecordersScreen} />
            <Stack.Screen name={routes.GameTeamLineUp} component={GameTeamLineUpScreen} />
            <Stack.Screen name={routes.ChangeInGamePlayer} component={ChangeInGamePlayerScreen} />
            <Stack.Screen name={routes.BasketballScoreBoard} component={BasketballScoreBoardScreen} />
            <Stack.Screen name={routes.BasketballPositionSelector} component={BasketballPositionSelectorScreen} />
            <Stack.Screen name={routes.BasketballLog} component={BasketballLogScreen} />
            <Stack.Screen name={routes.BasketballFoul} component={BasketballFoulScreen} />
            <Stack.Screen name={routes.BasketballActionEdit} component={BasketballActionEditScreen} />
            <Stack.Screen name={routes.BasketballStats} component={BasketballStatsScreen} />
            <Stack.Screen name={routes.BasketballAthleteStats} component={BasketballAthleteStatsScreen} />
            <Stack.Screen name={routes.SoccerScoreBoard} component={SoccerScoreBoardScreen} />
            <Stack.Screen name={routes.SoccerPositionSelector} component={SoccerPositionSelectorScreen} />
            <Stack.Screen name={routes.SoccerFoul} component={SoccerFoulScreen} />
            <Stack.Screen name={routes.SoccerLog} component={SoccerLogScreen} />
            <Stack.Screen name={routes.SoccerCard} component={SoccerCardScreen} />
            <Stack.Screen name={routes.SoccerStats} component={SoccerStatsScreen} />
            <Stack.Screen name={routes.SoccerAthleteStats} component={SoccerAthleteStatsScreen} />
            <Stack.Screen name={routes.SoccerActionEdit} component={SoccerActionEditScreen} />
            <Stack.Screen name={routes.LowSportStats} component={LowSportStatsScreen} />
            <Stack.Screen name={routes.FacilityProfile} component={FacilityProfileScreen} />
            <Stack.Screen name={routes.AssociationProfile} component={AssociationProfileScreen} />
            <Stack.Screen name={routes.EditAssociationProfile} component={EditAssociationProfileScreen} />
            <Stack.Screen name={routes.AssociationCreate} component={AssociationCreateScreen} />
            <Stack.Screen name={routes.AssociationCreateSuccess} component={AssociationCreateSuccessScreen} />
            <Stack.Screen name={routes.AssociationOrganizationList} component={AssociationOrganizationListScreen} />
            <Stack.Screen name={routes.FacilityCalendar} component={FacilityCalendar} />
        </Stack.Navigator>
    );
};

export default OrganizationNavigator;
