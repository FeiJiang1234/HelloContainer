import { gameService, leagueService } from 'el/api';
import { ElActionsheet, ElConfirm, ElDialog, ElIcon, ElLinkBtn, ElSwitch } from 'el/components';
import { OrganizationType } from 'el/enums';
import { PlayoffsType } from 'el/enums/playoffsType';
import AssignNewGame from 'el/screen/game/components/AssignNewGame';
import GameBracketTree from 'el/screen/game/components/GameBracketTree';
import GameTreeNode from 'el/screen/game/components/GameTreeNode';
import { useElToast, useGesture, useRounds } from 'el/utils';
import { Box, Divider, FlatList, Pressable, Row, Text, useDisclose } from 'native-base';
import React, { useEffect, useState } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { Extrapolation, interpolate, useAnimatedStyle } from 'react-native-reanimated';

const LeagueBracket = ({ profile }) => {
    const { id, playoffsType, isOfficial, isAdminView } = profile;
    const [isPlayoffs, setIsPlayoffs] = useState(false);
    const [games, setGames] = useState([]);
    const [teams, setTeams] = useState([]);
    const [open, setOpen] = useState(false);
    const [openAssignGameDialog, setOpenAssignGameDialog] = useState(false);
    const toast = useElToast();

    let bracketType = isPlayoffs ? playoffsType : PlayoffsType.RoundRobin.replace(' ', '');
    const { round, rounds, roundMenu, setRounds, setDefaultRound } = useRounds(bracketType);
    const { initAnimation, position, scale, panGesture, pinchGesture } = useGesture();
    const composedGestures = Gesture.Race(panGesture, pinchGesture);
    const { isOpen, onOpen, onClose } = useDisclose();
    const animatedStyles = useAnimatedStyle(() => {
        const scaleInterpolate = interpolate(scale.value, [0, 1.2], [0, 1.2], {
            extrapolateLeft: Extrapolation.CLAMP,
            extrapolateRight: Extrapolation.CLAMP,
        });
        return {
            transform: [
                { translateX: position.value.x },
                { translateY: position.value.y },
                { scale: scaleInterpolate },
            ],
        };
    });

    useEffect(() => {
        setGames([]);
        setRounds([]);
        getBracketRounds();
        getLeagueTeams();
    }, [id, bracketType, profile.gamesNumber]);

    useEffect(() => {
        if (!round) return;
        getBracketByRound();
        initAnimation();
    }, [round, profile.totalTeamsAllowed, profile.gamesNumber]);

    const handleAutoAssign = async () => {
        const res: any = isPlayoffs
            ? await leagueService.autoAssignPlayoffsGameTeam(id)
            : await leagueService.autoAssignSeasonGameTeam(id);
        if (res && res.code === 200) {
            getBracketRounds();
            getBracketByRound();
        }
        setOpen(false);
    };

    const getBracketRounds = async () => {
        const res: any = await leagueService.getBracketRounds(id, isPlayoffs);
        if (res && res.code === 200) {
            setRounds(res.value.rounds);
            setDefaultRound(res.value.currentRound);
        }
    };

    const getLeagueTeams = async () => {
        const res: any = await leagueService.getLeagueTeams(id);
        if (res && res.code === 200) setTeams(res.value);
    };

    const getBracketByRound = async () => {
        const res: any = await leagueService.getBracketByRound(id, round?.value, isPlayoffs);
        if (res && res.code === 200) setGames(res.value);
    };

    const handleForfeit = async (gameId, teamId, leagueId) => {
        const res: any = await gameService.forfeitLeagueGame(gameId, teamId, leagueId);
        if (res && res.code === 200) getBracketByRound();
    };

    const handleAssignGame = async data => {
        const res: any = await leagueService.assignGame(id, data);
        if (res && res.code === 200) {
            setOpenAssignGameDialog(false);
            getBracketRounds();
            getBracketByRound();
        } else {
            toast.error(res.Message);
        }
    };

    return (
        <>
            {isAdminView && (
                <Row alignItems="center" my={2}>
                    {!isPlayoffs && (
                        <ElLinkBtn onPress={() => setOpenAssignGameDialog(true)}>
                            Assign Manually
                        </ElLinkBtn>
                    )}
                    <Box flex={1}></Box>
                    <ElLinkBtn onPress={() => setOpen(true)}>Auto Assign</ElLinkBtn>
                </Row>
            )}
            {profile.playoffsType !== 'NoPlayoffs' && (
                <ElSwitch text="Show playoffs" value={isPlayoffs} onToggle={setIsPlayoffs} my={2} />
            )}
            <Divider />
            {roundMenu.length !== 0 && (
                <Row justifyContent="space-between" my={2}>
                    <Text>{round?.label}</Text>
                    <Pressable onPress={onOpen}>
                        <ElIcon name="chevron-down" />
                    </Pressable>
                </Row>
            )}
            <Box overflow="hidden">
                {bracketType !== PlayoffsType.RoundRobin.replace(' ', '') && (
                    <GestureDetector gesture={composedGestures}>
                        <Animated.View
                            style={[
                                { display: 'flex', flexDirection: 'row', justifyContent: 'center' },
                                animatedStyles,
                            ]}>
                            {games.map((game: any) => (
                                <GameBracketTree
                                    key={game.id}
                                    game={game}
                                    onForfeit={handleForfeit}
                                    onUpdateGameSuccess={getBracketByRound}
                                    isOfficial={isOfficial}
                                    isLowStats={profile.isLowStats}
                                    organizationId={id}
                                    organizationType={OrganizationType.League}
                                />
                            ))}
                        </Animated.View>
                    </GestureDetector>
                )}
            </Box>

            {bracketType === PlayoffsType.RoundRobin.replace(' ', '') && (
                <FlatList
                    data={games}
                    keyExtractor={(game: any) => game.id}
                    ItemSeparatorComponent={() => <Box w={2} />}
                    renderItem={({ item }) => (
                        <GameTreeNode
                            game={item}
                            onForfeit={handleForfeit}
                            onUpdateGameSuccess={getBracketByRound}
                            isOfficial={isOfficial}
                            isLowStats={profile.isLowStats}
                            organizationId={id}
                            organizationType={OrganizationType.League}
                            onDeleted={game => {
                                setGames(games.filter((x: any) => x.id !== game.id));
                            }}
                            reloadBracket ={() => {
                                getBracketRounds();  
                                getBracketByRound();
                            }}
                        />
                    )}
                    horizontal={true}
                />
            )}

            <ElConfirm
                visible={open}
                title="Auto Assign"
                message={
                    isPlayoffs
                        ? 'Are you sure to auto assign teams for playoffs games?'
                        : 'Are you sure to auto assign teams for season games?'
                }
                onCancel={() => setOpen(false)}
                onConfirm={handleAutoAssign}
            />

            <ElDialog
                title="Assign Game"
                visible={openAssignGameDialog}
                onClose={() => setOpenAssignGameDialog(false)}>
                <AssignNewGame
                    rounds={rounds}
                    teams={teams}
                    onSave={handleAssignGame}
                    onCancel={() => setOpenAssignGameDialog(false)}
                />
            </ElDialog>

            <ElActionsheet isOpen={isOpen} onClose={onClose} items={roundMenu} />
        </>
    );
};

export default LeagueBracket;
