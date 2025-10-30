import { teamService } from 'el/api';
import {
    ElBody,
    ElButton,
    ElContainer,
    ElFlatList,
    ElIdiograph,
    ElPicker,
    ElTitle,
} from 'el/components';
import { ActionModel } from 'el/models/action/actionModel';
import { useElToast, useGoBack, useProfileRoute } from 'el/utils';
import { Box, Row, Text } from 'native-base';
import React, { useState, useEffect } from 'react';
import { LineupLayout, Selected, Unselected } from '../organization/components/Lineup';

const ChangeInGamePlayerScreen = ({ route }) => {
    useGoBack();
    const { gameId, gameCode, teamId } = route.params;
    const [members, setMembers] = useState<any[]>([]);
    const toast = useElToast();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getGameTeamRoster();
    }, [gameId]);

    const getGameTeamRoster = async () => {
        const res: any = await teamService.getTeamGameRoster(teamId, gameId);
        if (res && res.code === 200 && res.value) {
            setMembers(res.value);
        }
    };

    const handlePlayerChange = (athleteId, data) => {
        const newMembers = members.map(player => {
            if (player.athleteId === athleteId) {
                return { ...player, ...data };
            }
            return player;
        });
        setMembers(newMembers);
    };

    const handleConfirmLineup = async () => {
        setLoading(true);
        const res: any = await teamService.changeGamePlayers(teamId, gameId, { players: members });
        setLoading(false);
        if (res && res.code === 200) {
            toast.success('update lineup successfully.');
            getGameTeamRoster();
        }
    };

    return (
        <ElContainer h="100%">
            <ElTitle>Substitutions</ElTitle>
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
                            keyExtractor={(item: any) => item.athleteId.toString()}
                            renderItem={({ item }) => (
                                <NormalPlayerItem item={item} onPlayerChange={handlePlayerChange} />
                            )}
                        />
                    </Box>
                </>
            )}
            <Box mb={1}>
                <ElButton variant="secondary" onPress={handleConfirmLineup} loading={loading}>
                    Confirm
                </ElButton>
            </Box>
        </ElContainer>
    );
};

const NormalPlayerItem = ({ item, onPlayerChange }) => {
    const { goToAthleteProfile } = useProfileRoute();
    const signInItems: ActionModel[] = [
        {
            label: 'S',
            onPress: () => onPlayerChange(item.athleteId, { isInGame: true }),
        },
        {
            label: 'B',
            onPress: () => onPlayerChange(item.athleteId, { isInGame: false }),
        },
    ];

    return (
        <LineupLayout
            player={
                <ElIdiograph
                    onPress={() => !item.isBlankAccount && goToAthleteProfile(item.athleteId)}
                    title={item.athleteName}
                    subtitle={item.subtitle}
                    centerTitle={item.blankAccountCode ? `ID: ${item.blankAccountCode}` : item.centerTitle}
                    imageUrl={item.avatarUrl}
                />
            }
            signIn={
                <ElPicker items={signInItems} onSelectedItem={i => i.onPress()}>
                    {item.isInGame && <Selected>S</Selected>}
                    {!item.isInGame && <Unselected>B</Unselected>}
                </ElPicker>
            }
            pos={<Unselected>{item.position}</Unselected>}
        />
    );
};

export default ChangeInGamePlayerScreen;
