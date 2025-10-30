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
import { BasketballPosition, SoccerPosition, SportType } from 'el/enums';
import { ActionModel } from 'el/models/action/actionModel';
import { ERROR, PENDING, SUCCESS } from 'el/store/slices/requestSlice';
import { useElToast, useGoBack, useProfileRoute } from 'el/utils';
import { Box, Pressable, Row, Text, useDisclose } from 'native-base';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import BlankAccountCreate from '../organization/components/BlankAccountCreate';
import { LineupLayout, Selected, Unselected } from '../organization/components/Lineup';

export default function GameTeamLineUpScreen({ navigation, route }) {
    useGoBack();
    const { teamId, gameId, gameCode, sportType, organizationId, organizationType } = route.params;
    const [isCreatePlayer, setIsCreatePlayer] = useState(false);
    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const toast = useElToast();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!teamId) {
            return;
        }
        getTeamMembersInOrganization();
    }, []);

    const getTeamMembersInOrganization = async () => {
        let res: any = null;
        if (organizationType === 'League') {
            res = await teamService.getLeagueTeamRoster(teamId, organizationId, gameId);
        }

        if (organizationType === 'Tournament') {
            res = await teamService.getTournamentTeamRoster(teamId, organizationId, gameId);
        }

        if (res && res.code === 200 && res.value) {
            setMembers(res.value);
        }
    };

    const handleCreatePlayer = async data => {
        const res: any = await handleCreatePlayerService(data);
        if (res && res.code === 200) {
            setIsCreatePlayer(false);
            getTeamMembersInOrganization();
        }else{
            toast.error(res.Message);
        }
    };

    const handleCreatePlayerService = data => {
        if (organizationType == 'League')
            return teamService.createBlankAthleteToLeagueTeam(teamId, organizationId, data);

        if (organizationType == 'Tournament')
            return teamService.createBlankAthleteToTournamentTeam(teamId, organizationId, data);
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
        dispatch(PENDING());
        members.forEach(x => (x.athleteId = x.id));
        const res: any = await teamService.updateGameLineup(teamId, gameId, { lineups: members });
        if (res && res.code === 200) {
            dispatch(SUCCESS());
            toast.success('update lineup successfully.');
            navigation.goBack();
        } else {
            toast.error(res.Message);
            dispatch(ERROR());
        }
    };

    return (
        <ElContainer h="100%">
            <ElTitle>Team Line Up</ElTitle>
            <ElBody textAlign="center">Game ID: {gameCode}</ElBody>
            {members.length === 0 && (
                <Text mt={2} textAlign="center">
                    No Players
                </Text>
            )}
            {members.length !== 0 && (
                <>
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
                                <NormalPlayerItem
                                    sportType={sportType}
                                    item={item}
                                    onPlayerChange={handlePlayerChange}
                                />
                            )}
                        />
                    </Box>
                </>
            )}
            <Row mb={1}>
                <Box flex={1} mr={1}>
                    <ElButton onPress={() => setIsCreatePlayer(true)}>Blank Player</ElButton>
                </Box>
                <Box flex={1} ml={1}>
                    <ElButton variant="secondary" onPress={handleConfirmLineup} loading={loading}>
                        Confirm
                    </ElButton>
                </Box>
            </Row>
            <ElModal visible={isCreatePlayer} onClose={() => setIsCreatePlayer(false)}>
                <BlankAccountCreate onCreatePlayer={handleCreatePlayer} />
            </ElModal>
        </ElContainer>
    );
}

const NormalPlayerItem = ({ item, sportType, onPlayerChange }) => {
    const { goToAthleteProfile } = useProfileRoute();
    const { isOpen: isOpenSignIn, onOpen: onOpenSignIn, onClose: onCloseSignIn } = useDisclose();
    const { isOpen: isOpenPos, onOpen: onOpenPos, onClose: onClosePos } = useDisclose();

    const signInItems: ActionModel[] = [
        {
            label: 'S',
            onPress: () => onPlayerChange(item.id, { joinGameType: 'Starter' }),
        },
        {
            label: 'B',
            onPress: () => onPlayerChange(item.id, { joinGameType: 'Substituter' }),
        },
    ];

    const positionItems = () => {
        const positions = getPositions();
        const positionMenu = positions.map(x => ({
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
                    <Pressable onPress={onOpenSignIn}>
                        {item.joinGameType == 'Starter' && <Selected>S</Selected>}
                        {item.joinGameType == 'Substituter' && <Unselected>B</Unselected>}
                        {item.joinGameType == null && <Unselected>N/A</Unselected>}
                    </Pressable>
                }
                pos={
                    <Pressable onPress={onOpenPos}>
                        <Unselected>{item.position}</Unselected>
                    </Pressable>
                }
            />
            <ElActionsheet isOpen={isOpenSignIn} onClose={onCloseSignIn} items={signInItems}></ElActionsheet>
            <ElActionsheet isOpen={isOpenPos} onClose={onClosePos} items={positionItems()}></ElActionsheet>
        </>
    );
};
