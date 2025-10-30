import { teamService } from 'el/api';
import {
    ElActionsheet,
    ElBody,
    ElButton,
    ElContainer,
    ElFlatList,
    ElIdiograph,
    ElModal,
    ElTitle,
} from 'el/components';
import { BasketballPosition, OrganizationType, SoccerPosition, SportType } from 'el/enums';
import { ActionModel } from 'el/models/action/actionModel';
import { useElToast, useGoBack, useProfileRoute } from 'el/utils';
import { Box, Pressable, Row, useDisclose } from 'native-base';
import React, { useState, useEffect } from 'react';
import BlankAccountCreate from './components/BlankAccountCreate';
import { LineupLayout, Selected, Unselected } from './components/Lineup';

const OrganizationTeamLineUpScreen = ({ navigation, route }) => {
    useGoBack();
    const { organizationId, organizationType, teamId, isAdminView, sportType } = route.params;
    const [members, setMembers] = useState<any[]>([]);
    const [isCreatePlayer, setIsCreatePlayer] = useState(false);
    const [loading, setLoading] = useState(false);
    const toast = useElToast();

    useEffect(() => {
        getTeamMembers();
    }, []);

    const getTeamMembers = async () => {
        const res: any = await teamService.getTeamPlayersByOrganizationId(
            teamId,
            organizationId,
            organizationType,
        );
        if (res && res.code === 200 && res.value) {
            setMembers(res.value);
        }
    };

    const handlePlayerChange = (id, data) => {
        const newMembers = members.map(player => {
            if (player.id === id) {
                return { ...player, ...data };
            }
            return player;
        });
        setMembers(newMembers);
    };

    const handleConfirmLineup = async () => {
        setLoading(true);
        members.forEach(x => (x.athleteId = x.id));
        const res: any = await getConfirmLineupService();
        setLoading(false);
        if (res && res.code === 200) {
            toast.success('update lineup successfully.');
            getTeamMembers();
        } else {
            toast.error(res.Message);
        }
    };

    const getConfirmLineupService = () => {
        if (organizationType == OrganizationType.League)
            return teamService.updateLeagueLineup(teamId, organizationId, { lineups: members });
        if (organizationType == OrganizationType.Tournament)
            return teamService.updateTournamentLineup(teamId, organizationId, { lineups: members });
    };

    const handleCreatePlayer = async data => {
        const res: any = await handleCreatePlayerService(data);
        if (res && res.code === 200) {
            setIsCreatePlayer(false);
            getTeamMembers();
        }
    };

    const handleCreatePlayerService = data => {
        if (organizationType == OrganizationType.League)
            return teamService.addLeagueBlankAccount(teamId, organizationId, data);

        if (organizationType == OrganizationType.Tournament)
            return teamService.addTournamentBlankAccount(teamId, organizationId, data);
    };

    return (
        <ElContainer h="100%">
            <ElTitle>Team Line Up</ElTitle>
            <Row>
                <LineupLayout
                    player={<ElBody>Player</ElBody>}
                    signIn={<ElBody>Sign In</ElBody>}
                    pos={<ElBody>Pos</ElBody>}
                />
            </Row>
            <Box flex={1}>
                <ElFlatList
                    data={members}
                    renderItem={({ item }) => (
                        <PlayerItem
                            sportType={sportType}
                            isAdminView={isAdminView}
                            item={item}
                            onPlayerChange={handlePlayerChange}
                        />
                    )}
                />
            </Box>
            {isAdminView && (
                <Row mb={1}>
                    <Box flex={1} mr={1}>
                        <ElButton onPress={() => setIsCreatePlayer(true)}>Blank Player</ElButton>
                    </Box>
                    <Box flex={1} ml={1}>
                        <ElButton
                            variant="secondary"
                            onPress={handleConfirmLineup}
                            loading={loading}>
                            Confirm
                        </ElButton>
                    </Box>
                </Row>
            )}
            <ElModal visible={isCreatePlayer} onClose={() => setIsCreatePlayer(false)}>
                <BlankAccountCreate onCreatePlayer={handleCreatePlayer} />
            </ElModal>
        </ElContainer>
    );
};

const PlayerItem = ({ sportType, isAdminView, item, onPlayerChange }) => {
    const { goToAthleteProfile } = useProfileRoute();
    const { isOpen: isOpenSignIn, onOpen: onOpenSignIn, onClose: onCloseSignIn } = useDisclose();
    const { isOpen: isOpenPos, onOpen: onOpenPos, onClose: onClosePos } = useDisclose();

    const signInItems: ActionModel[] = [
        {
            label: 'S',
            onPress: () => onPlayerChange(item.id, { isJoinOrganization: true, isStarter: true }),
        },
        {
            label: 'B',
            onPress: () => onPlayerChange(item.id, { isJoinOrganization: true, isStarter: false }),
        },
        {
            label: 'N/A',
            onPress: () => onPlayerChange(item.id, { isJoinOrganization: false, isStarter: false }),
        },
    ];

    const positionItems = (): ActionModel[] => {
        const positions = getPositions();
        const positionMenu: ActionModel[] = positions.map(x => ({
            label: x,
            onPress: () => onPlayerChange(item.id, { position: x }),
        }));
        return positionMenu;
    };

    const getPositions = () => {
        if (sportType === SportType.Basketball) return Object.values(BasketballPosition);
        if (sportType === SportType.Soccer) return Object.values(SoccerPosition);

        return [];
    };

    return (
        <>

            <LineupLayout
                player={
                    <ElIdiograph
                        onPress={() => !item.isBlankAccount && goToAthleteProfile(item.id)}
                        title={item.title}
                        subtitle={item.subtitle}
                        centerTitle={item.blankAccountCode ? `ID: ${item.blankAccountCode}` : item.centerTitle}
                        imageUrl={item.avatarUrl}
                    />
                }
                signIn={
                    <Pressable onPress={onOpenSignIn} disabled={!isAdminView}>
                        {item.isJoinOrganization && item.isStarter && <Selected>S</Selected>}
                        {item.isJoinOrganization && !item.isStarter && <Unselected>B</Unselected>}
                        {!item.isJoinOrganization && <Unselected>N/A</Unselected>}
                    </Pressable>
                }
                pos={
                    <Pressable onPress={onOpenPos} disabled={!isAdminView}>
                        {item.isJoinOrganization && <Unselected>{item.position}</Unselected>}
                    </Pressable>
                }
            />
            <ElActionsheet isOpen={isOpenSignIn} onClose={onCloseSignIn} items={signInItems}></ElActionsheet>
            <ElActionsheet isOpen={isOpenPos} onClose={onClosePos} items={positionItems()}></ElActionsheet>
        </>
    );
};

export default OrganizationTeamLineUpScreen;
