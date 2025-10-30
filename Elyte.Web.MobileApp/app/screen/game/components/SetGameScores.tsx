import { gameService } from 'el/api';
import { ElButton, ElConfirm, ElDialog, ElIdiograph, ElLinkBtn } from 'el/components';
import colors from 'el/config/colors';
import { SportType } from 'el/enums';
import { PENDING, SUCCESS } from 'el/store/slices/requestSlice';
import { useElToast } from 'el/utils';
import { Box, Column, Input, Modal, Pressable, Row, ScrollView, Text } from 'native-base';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

const ScoreInput = ({ value, disabled, onChange, ...rest }) => {
    return (
        <Input
            keyboardType="numeric"
            textAlign="center"
            w={12}
            h={12}
            value={value?.toString() ?? '0'}
            onChange={({ nativeEvent: { text } }) => onChange(text)}
            isDisabled={disabled}
            {...rest}
        />
    );
};

const NotAssigned = ({children}) => {
    return <Row justifyContent='center' alignItems='center' space={1} bgColor={colors.light} borderRadius={8} p={2}>
        <Text bold>Not Assigned Points</Text>
        {children}
    </Row>
}

const SetGameScores = ({ open, onClose, game, reloadBracket }) => {
    const [teamId, setTeamId] = useState();
    const [athlete, setAthlete] = useState();
    const [players, setPlayers] = useState<any[]>([]);
    const [homeTeamNotAssignedScore, setHomeTeamNotAssignedScore] = useState(0);
    const [awayTeamNotAssignedScore, setAwayTeamNotAssignedScore] = useState(0);
    const [gameRound, setGameRound] = useState<any>({
        isSingleRound: true,
    });
    const [rounds, setRounds] = useState<any[]>([]);
    const [round, setRound] = useState<number>();
    const [showBasketballStats, setShowBasketballStats] = useState(false);
    const [showSoccerStats, setShowSoccerStats] = useState(false);
    const [savingScores, setSavingScores] = useState(false);
    const dispatch = useDispatch();
    const toast = useElToast();
    const [isSubmitScores, setIsSubmitScores] = useState(false);
    const [isEndGame, setIsEndGame] = useState(false);

    useEffect(() => {
        getRounds();
    }, []);

    useEffect(() => {
        if (!round) return;
        getScoresByRound();
    }, [round]);

    const getRounds = async () => {
        const res: any = await gameService.getRounds(game.id);
        if (res && res.code === 200) {
            setRounds(res.value);
            const lastRound = res.value.length === 0 ? 1 : res.value.length;
            setRound(lastRound);
        }
    };

    const getScoresByRound = async () => {
        dispatch(PENDING());
        const res: any = await gameService.getScoresByRound(game.id, round);
        dispatch(SUCCESS());
        if (res && res.code === 200) {
            setGameRound(res.value);
            setPlayers(res.value.athleteScores);
            setHomeTeamNotAssignedScore(res.value?.homeTeamNotAssignedScore ?? 0);
            setAwayTeamNotAssignedScore(res.value?.awayTeamNotAssignedScore ?? 0);
        }
    };

    const handleSaveScores = async () => {
        setSavingScores(true);
        const athletes = players.map(x => ({
            teamId: x.teamId,
            athleteId: x.athleteId,
            score: x.score,
        }));

        const homeTeamScore = getHomeTeamScore();
        const awayTeamScore = getAwayTeamScore();

        const res: any = await gameService.setScores(game.id, {
            round: round,
            homeTeamScore: homeTeamScore,
            awayTeamScore: awayTeamScore,
            homeTeamNotAssignedScore: homeTeamNotAssignedScore,
            awayTeamNotAssignedScore: awayTeamNotAssignedScore,
            athletes: athletes,
        });
        setSavingScores(false);
        if (res && res.code === 200) {
            toast.success('Save scores successfully');
            getRounds();
        }
    };

    const handleSubmitScores = async () => {
        const athletes = players.map(x => ({
            teamId: x.teamId,
            athleteId: x.athleteId,
            score: x.score,
        }));

        const homeTeamScore = getHomeTeamScore();
        const awayTeamScore = getAwayTeamScore();

        const res: any = await gameService.submitScores(game.id, {
            round: round,
            homeTeamScore: homeTeamScore,
            awayTeamScore: awayTeamScore,
            homeTeamNotAssignedScore: homeTeamNotAssignedScore,
            awayTeamNotAssignedScore: awayTeamNotAssignedScore,
            athletes: athletes,
        });
        if (res && res.code === 200) {
            setIsSubmitScores(false);
            toast.success('Submit scores successfully');
            if (gameRound.isSingleRound) {
                onClose();
                reloadBracket && reloadBracket();
            } else {
                getRounds();
                getScoresByRound();
            }
        }
    };

    const handleAthleteScoreChange = (athleteId, score) => {
        const newPlayers = players.map(x => {
            if (x.athleteId !== athleteId) return x;

            x.score = score;
            return x;
        });
        setPlayers(newPlayers);
    };

    const TeamScore = ({ id, name, score }) => {
        let bg: any = { bgColor: colors.light };
        if (!gameRound.isComplete && teamId === id) {
            bg = { variant: 'linear' };
        }
        if (gameRound.isComplete && gameRound.winnerId === id) {
            bg = { bgColor: colors.secondary };
        }

        const isHighlight =
            (!gameRound.isComplete && teamId === id) ||
            (gameRound.isComplete && gameRound.winnerId === id);

        return (
            <Pressable mb={1} flex={1} onPress={() => setTeamId(id)}>
                <Box
                    display="flex"
                    flex={1}
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius={8}
                    {...bg}>
                    <Text color={isHighlight ? colors.white : colors.dark}>{name}: </Text>
                    <Text color={isHighlight ? colors.white : colors.dark} ml={1} fontSize={24}>
                        {score}
                    </Text>
                </Box>
            </Pressable>
        );
    };

    const GameRound = ({ item }) => {
        const bg = round === item.round ? { variant: 'linear' } : { bgColor: colors.light };
        return (
            <Pressable mb={1} flex={1} onPress={() => setRound(item.round)}>
                <Box display="flex" flex={1} flexDirection="row" p={2} borderRadius={8} {...bg}>
                    <Text flex={1} color={round === item.round ? colors.white : colors.dark}>
                        Round {item.round}
                    </Text>
                    <Text flex={1} color={round === item.round ? colors.white : colors.dark}>
                        {item.winnerId === game.homeTeamId && game.homeTeamName}
                        {item.winnerId === game.awayTeamId && game.awayTeamName}
                    </Text>
                </Box>
            </Pressable>
        );
    };

    const toNum = val => (!val ? 0 : parseInt(val));

    const getHomeTeamScore = () => {
        var playersScore = players
            .filter(x => x.teamId === game.homeTeamId)
            .reduce((pre, cur) => toNum(cur.score) + pre, 0);
        return playersScore + toNum(homeTeamNotAssignedScore);
    };

    var playersScore = players
        .filter(x => x.teamId === game.awayTeamId)
        .reduce((pre, cur) => toNum(cur.score) + pre, 0);
    const getAwayTeamScore = () => {
        return playersScore + toNum(awayTeamNotAssignedScore);
    };

    const handleEndGame = async () => {
        const res: any = await gameService.endLowStatsGame(game.id);
        if (res && res.code === 200) {
            setIsEndGame(false);
            onClose();
            reloadBracket && reloadBracket();
        }
    };

    const handleUpdateBasketballLowStats = async (athleteId, data) => {
        const res: any = await gameService.updateBasketballLowStats(
            game.id,
            round,
            athleteId,
            data,
        );
        if (res && res.code === 200) {
            setShowBasketballStats(false);
        }
    };

    const handleUpdateSoccerLowStats = async (athleteId, data) => {
        const res: any = await gameService.updateSoccerLowStats(game.id, round, athleteId, data);
        if (res && res.code === 200) {
            setShowSoccerStats(false);
        }
    };

    const handleClickAthlete = item => {
        if (game.gameSportType !== SportType.Basketball && game.gameSportType !== SportType.Soccer)
            return;

        setAthlete(item);
        if (game.gameSportType === SportType.Basketball) {
            setShowBasketballStats(true);
        }
        if (game.gameSportType === SportType.Soccer) {
            setShowSoccerStats(true);
        }
    };

    const canEnd = () =>
        !gameRound.isSingleRound &&
        rounds.length > 0 &&
        rounds.every(x => x.isComplete) &&
        rounds.find(x => x.round === round);

    return (
        <>
            {open && (
                <Modal isOpen={open} onClose={onClose} avoidKeyboard={!showBasketballStats && !showSoccerStats}>
                    <Modal.Content style={{ marginTop: 'auto', width: '100%' }}>
                        <Modal.Body>
                            <ScrollView>
                                {!gameRound.isSingleRound && rounds.map(item => (
                                    <GameRound key={item.id} item={item} />
                                ))}
                                {canEnd() && (
                                    <ElLinkBtn onPress={() => setRound(rounds.length + 1)} my={1}>
                                        + Add Another Round
                                    </ElLinkBtn>
                                )}
                                {round && (
                                    <>
                                        <Row space={1} h={12}>
                                            <TeamScore id={game.homeTeamId} name={game.homeTeamName} score={getHomeTeamScore()} />
                                            <TeamScore id={game.awayTeamId} name={game.awayTeamName} score={getAwayTeamScore()} />
                                        </Row>
                                        {teamId === game.homeTeamId && (
                                            <NotAssigned>
                                                <ScoreInput value={homeTeamNotAssignedScore} disabled={gameRound.isComplete}
                                                    onChange={setHomeTeamNotAssignedScore} 
                                                />
                                            </NotAssigned>
                                        )}
                                        {teamId === game.awayTeamId && (
                                            <NotAssigned>
                                                <ScoreInput value={awayTeamNotAssignedScore} disabled={gameRound.isComplete}
                                                    onChange={setAwayTeamNotAssignedScore}
                                                />
                                            </NotAssigned>
                                        )}
                                        {players
                                            .filter(x => x.teamId == teamId)
                                            .map(item => (
                                                <Row mt={1} key={item.athleteId}>
                                                    <ElIdiograph
                                                        onPress={() => handleClickAthlete(item)}
                                                        title={item.athleteName}
                                                        subtitle={item.joinGameType}
                                                        imageUrl={item?.athletePictureUrl}
                                                    />
                                                    <ScoreInput
                                                        value={item.score}
                                                        onChange={text => handleAthleteScoreChange(item.athleteId, text)}
                                                        disabled={gameRound.isComplete}
                                                    />
                                                </Row>
                                            ))}
                                    </>
                                )}

                                {showBasketballStats && (
                                    <BasketballStats
                                        open={showBasketballStats}
                                        onClose={() => setShowBasketballStats(false)}
                                        handleSaveStats={(athleteId, stats) =>
                                            handleUpdateBasketballLowStats(athleteId, stats)
                                        }
                                        gameId={game.id}
                                        round={round}
                                        isComplete={gameRound.isComplete}
                                        athlete={athlete}
                                    />
                                )}
                                {showSoccerStats && (
                                    <SoccerStats
                                        open={showSoccerStats}
                                        onClose={() => setShowSoccerStats(false)}
                                        handleSaveStats={(athleteId, stats) =>
                                            handleUpdateSoccerLowStats(athleteId, stats)
                                        }
                                        gameId={game.id}
                                        isComplete={gameRound.isComplete}
                                        round={round}
                                        athlete={athlete}
                                    />
                                )}
                            </ScrollView>
                        </Modal.Body>
                        <Modal.Footer style={{ width: '100%' }}>
                            <Column flex={1}>
                                {!gameRound.isComplete && (
                                    <>
                                        <ElButton size="sm" mb={1} style={{ width: '100%' }}
                                            onPress={handleSaveScores} loading={savingScores}>
                                            Save
                                        </ElButton>
                                        <ElButton size="sm" mb={1} style={{ width: '100%' }}
                                            onPress={() => setIsSubmitScores(true)}>
                                            Submit Scores
                                        </ElButton>
                                    </>
                                )}
                                {canEnd() && (
                                    <ElButton
                                        size="sm"
                                        onPress={() => setIsEndGame(true)}
                                        style={{ width: '100%' }}>
                                        End Game
                                    </ElButton>
                                )}
                            </Column>
                        </Modal.Footer>
                    </Modal.Content>
                </Modal>
            )}
            <ElConfirm   
                message="Are you sure to submit scores?"
                visible={isSubmitScores}
                onCancel={() => setIsSubmitScores(false)}
                onConfirm={handleSubmitScores}/>
            <ElConfirm   
                message="Are you sure to end game?"
                visible={isEndGame}
                onCancel={() => setIsEndGame(false)}
                onConfirm={handleEndGame}/>
        </>
    );
};

const BasketballStats = ({
    open,
    onClose,
    gameId,
    isComplete,
    round,
    athlete,
    handleSaveStats,
}) => {
    const [stats, setStats] = useState<any>({
        teamId: athlete.teamId,
    });

    useEffect(() => {
        getStats();
    }, []);

    const getStats = async () => {
        const res: any = await gameService.getBasketballLowStats(gameId, round, athlete.athleteId);
        if (res && res.code === 200) {
            setStats(pre => ({ ...pre, ...res.value }));
        }
    };

    return (
        <>
            {open && (
                <ElDialog title="Basketball Stats" visible={open} onClose={onClose}>
                    <Row>
                        <ElIdiograph
                            title={athlete.athleteName}
                            subtitle={athlete.joinGameType}
                            imageUrl={athlete?.athletePictureUrl}
                        />
                    </Row>
                    <Row justifyContent="space-between" alignItems="center" mb={1}>
                        <Text>Assist</Text>
                        <ScoreInput
                            value={stats.assist}
                            disabled={isComplete}
                            onChange={text => setStats(pre => ({ ...pre, assist: text }))}
                        />
                    </Row>
                    <Row justifyContent="space-between" alignItems="center" mb={1}>
                        <Text>Rebnd</Text>
                        <ScoreInput
                            value={stats.rebnd}
                            disabled={isComplete}
                            onChange={text => setStats(pre => ({ ...pre, rebnd: text }))}
                        />
                    </Row>
                    <Row justifyContent="space-between" alignItems="center" mb={1}>
                        <Text>Steal</Text>
                        <ScoreInput
                            value={stats.steal}
                            disabled={isComplete}
                            onChange={text => setStats(pre => ({ ...pre, steal: text }))}
                        />
                    </Row>
                    <Row justifyContent="space-between" alignItems="center">
                        <Text>Block</Text>
                        <ScoreInput
                            value={stats.block}
                            disabled={isComplete}
                            onChange={text => setStats(pre => ({ ...pre, block: text }))}
                        />
                    </Row>
                    {!isComplete && (
                        <ElButton mt={1} onPress={() => handleSaveStats(athlete.athleteId, stats)}>
                            Save
                        </ElButton>
                    )}
                </ElDialog>
            )}
        </>
    );
};

const SoccerStats = ({ open, onClose, gameId, isComplete, round, athlete, handleSaveStats }) => {
    const [stats, setStats] = useState<any>({
        teamId: athlete.teamId,
    });

    useEffect(() => {
        getStats();
    }, []);

    const getStats = async () => {
        const res: any = await gameService.getSoccerLowStats(gameId, round, athlete.athleteId);
        if (res && res.code === 200) {
            setStats(pre => ({ ...pre, ...res.value }));
        }
    };

    return (
        <>
            {open && (
                <ElDialog title="Soccer Stats" visible={open} onClose={onClose}>
                    <Row>
                        <ElIdiograph
                            title={athlete.athleteName}
                            subtitle={athlete.joinGameType}
                            imageUrl={athlete?.athletePictureUrl}
                        />
                    </Row>
                    <Row justifyContent="space-between" alignItems="center" mb={1}>
                        <Text>Assist</Text>
                        <ScoreInput
                            value={stats.assist}
                            onChange={text => setStats(pre => ({ ...pre, assist: text }))}
                            disabled={isComplete}
                        />
                    </Row>
                    <Row justifyContent="space-between" alignItems="center" mb={1}>
                        <Text>TurnOver</Text>
                        <ScoreInput
                            value={stats.turnOver}
                            onChange={text => setStats(pre => ({ ...pre, turnOver: text }))}
                            disabled={isComplete}
                        />
                    </Row>
                    <Row justifyContent="space-between" alignItems="center" mb={1}>
                        <Text>Steal</Text>
                        <ScoreInput
                            value={stats.steal}
                            onChange={text => setStats(pre => ({ ...pre, steal: text }))}
                            disabled={isComplete}
                        />
                    </Row>
                    <Row justifyContent="space-between" alignItems="center" mb={1}>
                        <Text>Save</Text>
                        <ScoreInput
                            value={stats.save}
                            onChange={text => setStats(pre => ({ ...pre, save: text }))}
                            disabled={isComplete}
                        />
                    </Row>
                    <Row justifyContent="space-between" alignItems="center">
                        <Text>Corner</Text>
                        <ScoreInput
                            value={stats.corner}
                            onChange={text => setStats(pre => ({ ...pre, corner: text }))}
                            disabled={isComplete}
                        />
                    </Row>
                    {!isComplete && (
                        <ElButton mt={1} onPress={() => handleSaveStats(athlete.athleteId, stats)}>
                            Save
                        </ElButton>
                    )}
                </ElDialog>
            )}
        </>
    );
};

export default SetGameScores;
