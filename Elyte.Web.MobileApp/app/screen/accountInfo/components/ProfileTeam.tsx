import { athleteService, teamService } from 'el/api';
import { useAuth, useProfileRoute } from 'el/utils';
import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { ElConfirm, ElIdiograph, ElList, ElMenu, ElSearch, ElSwitch } from 'el/components';
import { ActionModel } from 'el/models/action/actionModel';
import { Box, Center, HStack } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import routes from 'el/navigation/routes';

export default function ProfileTeam({ profile, sportType }) {
    const [teams, setMyteams] = useState<any[]>([]);
    const [open, setOpen] = useState(false);
    const [teamId, setTeamId] = useState(null);
    const [toggleStatus, setToggleStatus] = useState<boolean>(false);
    const [athleteProfile, setAthleteProfile] = useState(profile);
    const { user } = useAuth();
    const navigation: any = useNavigation();
    const { saveCurrentRouteForGoback } = useProfileRoute();
    const { goToTeamProfile } = useProfileRoute();

    useEffect(() => {
        getAthleteJoinedTeams('');
    }, []);

    useEffect(() => {
        if (sportType === 'Basketball') {
            setToggleStatus(athleteProfile.isOpenToJoinBasketballTeam);
        }
        if (sportType === 'Soccer') {
            setToggleStatus(athleteProfile.isOpenToJoinSoccerTeam);
        }
        if (sportType === 'Baseball') {
            setToggleStatus(athleteProfile.isOpenToJoinBaseballTeam);
        }
    }, [athleteProfile, sportType]);

    const getAthleteJoinedTeams = async (name) => {
        const res: any = await teamService.getAthleteActiveTeams(athleteProfile.id, name);
        if (res && res.code === 200) {
            setMyteams(res.value);
        }
    };

    const toggleOpenToJoinTeam = async e => {
        if (e) {
            await athleteService.openToJoinTeam(sportType, profile.id);
        } else {
            await athleteService.closeToJoinTeam(sportType, profile.id);
        }

        const res = await athleteService.getAthleteById(user.id);
        setAthleteProfile(res.value);
    };

    const searchTeams = value => {
        getAthleteJoinedTeams(value);
    };

    const leaveTeam = async () => {
        const res: any = await athleteService.leaveTeam(user.id, teamId);
        if (res && res.code === 200) {
            setOpen(false);
            getAthleteJoinedTeams('');
        }
    };

    const handleClose = () => {
        setOpen(false);
        setTeamId(null);
    };

    const handleLeaveTeamClick = item => {
        setOpen(true);
        setTeamId(item.id);
    };

    const handleViewRequestClick = item => {
        saveCurrentRouteForGoback(routes.JoinTeamRequest);
        navigation.navigate(routes.JoinTeamRequest, { id: item.id });
    };

    const getOptions = (item) => {
        const options: ActionModel[] = [
            {
                label: 'Requests',
                onPress: () => handleViewRequestClick(item),
                isHide: !(item.isAdminView && user.id === profile.id),
            },
            {
                label: 'Leave',
                onPress: () => handleLeaveTeamClick(item),
                isHide: item.isAdminView,
            },
        ];
        return options;
    }

    return (
        <>
            <ElSearch onKeywordChange={searchTeams} />
            {athleteProfile.isSelf && (
                <ElSwitch
                    text="Open to new Teams"
                    value={toggleStatus}
                    onToggle={toggleOpenToJoinTeam}
                />
            )}
            <Box mt={2}>
                <ElList
                    my={2}
                    data={teams}
                    renderItem={({ item }) => (
                        <HStack>
                            <ElIdiograph
                                onPress={() => goToTeamProfile(item.id)}
                                title={item.title}
                                centerTitle={item.centerTitle}
                                subtitle={item.subtitle}
                                imageUrl={item.avatarUrl}
                            />
                            <Center>
                                <ElMenu items={getOptions(item)}></ElMenu>
                            </Center>
                        </HStack>
                    )}
                />
            </Box>
            {open && (
                <ElConfirm
                    message="Are you sure to leave team?"
                    visible={open}
                    onConfirm={() => leaveTeam()}
                    onCancel={handleClose}
                />
            )}
        </>
    );
}
