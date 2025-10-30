import React, { useEffect, useState } from 'react';
import { ElButton, ElConfirm, ElDialog, ElLinkBtn } from 'components';
import { Box, TextField } from '@mui/material';
import { gameService } from 'services';
import { Idiograph } from 'parts';
import { DarkBox, NewBox } from './components/scoreBoardBox';
import { makeStyles } from '@mui/styles';
import { styled } from '@mui/system';
import { SportType } from 'enums';

const useStyles = makeStyles(() => {
    return {
        scoreInput: {
            '& .MuiInputBase-root': {
                width: '60px',
                backgroundColor: '#F0F2F7',
                marginRight: '10px',
                color: '#1F345C',
                '& input': {
                    textAlign: 'center'
                }
            }
        },
    };
});

export const WinnerBox = styled((props) => (<NewBox {...props} />))(() => { 
    return { 
        background: '#17C476', 
        color: 'white' 
    } 
});

const SetGameScores = ({ open, onClose, game, reloadBracket }) => {
    const classes = useStyles();
    const [teamId, setTeamId] = useState();
    const [athlete, setAthlete] = useState();
    const [players, setPlayers] = useState([]);
    const [homeTeamNotAssignedScore, setHomeTeamNotAssignedScore] = useState(0);
    const [awayTeamNotAssignedScore, setAwayTeamNotAssignedScore] = useState(0);
    const [gameRound, setGameRound] = useState({
        isSingleRound: true
    });
    const [rounds, setRounds] = useState([]);
    const [round, setRound] = useState();
    const [showBasketballStats, setShowBasketballStats] = useState(false);
    const [showSoccerStats, setShowSoccerStats] = useState(false);
    const [savingScores, setSavingScores] = useState(false);
    const [isSubmitScores, setIsSubmitScores] = useState(false);
    const [isEndGame, setIsEndGame] = useState(false);

    useEffect(() => {
        getRounds();
    }, []);
    
    useEffect(() => {
        if(!round) return;
        getScoresByRound();
    }, [round]);

    const getRounds = async () => {
        const res = await gameService.getRounds(game.id);
        if (res && res.code === 200) {
            setRounds(res.value);
            const lastRound = res.value.length === 0 ? 1 : res.value.length;
            setRound(lastRound);
        }
    }

    const getScoresByRound = async () => {
        const res = await gameService.getScoresByRound(game.id, round);
        if (res && res.code === 200) {
            setGameRound(res.value);
            setPlayers(res.value.athleteScores);
            setHomeTeamNotAssignedScore(res.value?.homeTeamNotAssignedScore ?? 0);
            setAwayTeamNotAssignedScore(res.value?.awayTeamNotAssignedScore ?? 0);
        }
    }

    const handleSaveScores = async () => {
        setSavingScores(true);
        const athletes = players.map(x => ({
            teamId: x.teamId,
            athleteId: x.athleteId,
            score: x.score
        }));


        const homeTeamScore = getHomeTeamScore();
        const awayTeamScore = getAwayTeamScore();

        const res = await gameService.setScores(game.id, {
            round: round,
            homeTeamScore: homeTeamScore,
            awayTeamScore: awayTeamScore,
            homeTeamNotAssignedScore: homeTeamNotAssignedScore,
            awayTeamNotAssignedScore: awayTeamNotAssignedScore,
            athletes: athletes,
        });
        setSavingScores(false);
        if (res && res.code === 200) {
            window.elyte.success("Save scores successfully");
            getRounds();
        }
    };
    
    const handleSubmitScores = async () => {
        const athletes = players.map(x => ({
            teamId: x.teamId,
            athleteId: x.athleteId,
            score: x.score
        }));

        const homeTeamScore = getHomeTeamScore();
        const awayTeamScore = getAwayTeamScore();

        const res = await gameService.submitScores(game.id, {
            round: round,
            homeTeamScore: homeTeamScore,
            awayTeamScore: awayTeamScore,
            homeTeamNotAssignedScore: homeTeamNotAssignedScore,
            awayTeamNotAssignedScore: awayTeamNotAssignedScore,
            athletes: athletes,
        });
        if (res && res.code === 200) {
            window.elyte.success("Submit scores successfully");
            if(gameRound.isSingleRound){
                onClose();
                reloadBracket && reloadBracket();
            }else{
                getRounds();
                getScoresByRound();
            }
        }
    };

    const handleAthleteScoreChange = (athleteId, score) => {
        const newPlayers = players.map(x=> {
            if(x.athleteId !== athleteId) return x;

            x.score = score;
            return x;
        });
        setPlayers(newPlayers);
    }

    const TeamScore = ({ children, id, ...rest }) => {
        if (id === teamId && !gameRound.isComplete)
            return (
                <DarkBox flex={1} onClick={() => setTeamId(id)} style={{ height: 70 }} {...rest}>
                    {children}
                </DarkBox>
            );

        if(gameRound.winnerId === id){
          return <WinnerBox flex={1} onClick={() => setTeamId(id)} style={{ height: 70 }} {...rest}>
                {children}
            </WinnerBox>
        }

        return (
            <NewBox flex={1} onClick={() => setTeamId(id)}  style={{ height: 70 }} {...rest}>
                {children}
            </NewBox>
        );
    };

    const GameRound = ({ item }) => {
        if (round === item.round)
            return (
                <DarkBox mb={1} onClick={() => setRound(item.round)} style={{ height: 50 }}>
                    <Box flex={1}>Round {item.round}</Box> 
                    <Box fontSize={20} flex={1}>
                        {item.winnerId === game.homeTeamId && game.homeTeamName}
                        {item.winnerId === game.awayTeamId && game.awayTeamName}
                    </Box>
                </DarkBox>
            );
        return (
            <NewBox mb={1} onClick={() => setRound(item.round)} style={{ height: 50 }}>
                <Box flex={1}>Round {item.round}</Box> 
                <Box fontSize={20} flex={1}>
                    {item.winnerId === game.homeTeamId && game.homeTeamName}
                    {item.winnerId === game.awayTeamId && game.awayTeamName}
                </Box>
            </NewBox>
        );
    };

    const getHomeTeamScore = () => {
        var playersScore = players.filter(x=>x.teamId === game.homeTeamId).reduce((pre, cur) => toNum(cur.score) + pre, 0);
        return playersScore + toNum(homeTeamNotAssignedScore);
    }
    
    const getAwayTeamScore = () => {
        var playersScore = players.filter(x=>x.teamId === game.awayTeamId).reduce((pre, cur) => toNum(cur.score) + pre, 0);
        return playersScore + toNum(awayTeamNotAssignedScore);
    }

    const handleEndGame = async () => {
        const res = await gameService.endLowStatsGame(game.id);
        if (res && res.code === 200) {
            onClose();
            reloadBracket && reloadBracket();
        }
    };

    const toNum = (val) => !val ? 0 : parseInt(val);

    const handleUpdateBasketballLowStats = async (athleteId, data) => {
        const res = await gameService.updateBasketballLowStats(game.id, round, athleteId, data);
        if (res && res.code === 200) {
            setShowBasketballStats(false);
        }
    }

    const handleUpdateSoccerLowStats = async (athleteId, data) => {
        const res = await gameService.updateSoccerLowStats(game.id, round, athleteId, data);
        if (res && res.code === 200) {
            setShowSoccerStats(false);
        }
    }

    const handleClickAthlete = (item) => {
        if(game.gameSportType !== SportType.Basketball && game.gameSportType !== SportType.Soccer) 
            return;

        setAthlete(item);
        if(game.gameSportType === SportType.Basketball){
            setShowBasketballStats(true);
        }
        if(game.gameSportType === SportType.Soccer){
            setShowSoccerStats(true);
        }
    }
    
    const canEnd = () => !gameRound.isSingleRound && rounds.length > 0 && rounds.every(x=>x.isComplete) && rounds.find(x=>x.round === round);

    return (
        <>
            {open && (
                <ElDialog
                    title="Set Scores"
                    subTitle="Set the score for the game"
                    open={open}
                    onClose={onClose} 
                    contentStyle={{ overflow: 'auto' }}>
                    {!gameRound.isSingleRound && rounds
                        .map(item => (
                        <GameRound key={item.id} item={item} />
                    ))}
                    {canEnd() && <ElLinkBtn onClick={() => setRound(rounds.length + 1)} mb={1}>+ Add Another Round</ElLinkBtn>}
                    {
                        round &&
                        <>
                            <Box display="flex">
                                <TeamScore id={game.homeTeamId} mr={1}>
                                    <Box>{game.homeTeamName}: </Box>
                                    <Box ml={1} fontSize={24}>
                                        {getHomeTeamScore()}
                                    </Box>
                                </TeamScore>
                                <TeamScore id={game.awayTeamId} ml={1}>
                                    <Box>{game.awayTeamName}: </Box>
                                    <Box ml={1} fontSize={24}>
                                        {getAwayTeamScore()}
                                    </Box>
                                </TeamScore>
                            </Box>
                            {
                                teamId === game.homeTeamId &&
                                <NewBox mt={1} flex={1}>
                                    <Box ml={1} fontSize={18} display='flex' alignItems='center'>
                                        <Box mr={1}>Not Assigned Points</Box>
                                        <TextField className={classes.scoreInput} value={homeTeamNotAssignedScore} onChange={(e) => setHomeTeamNotAssignedScore(e.target.value)} disabled={gameRound.isComplete}/>
                                    </Box>
                                </NewBox>
                            }
                            {
                                teamId === game.awayTeamId &&
                                <NewBox mt={1} flex={1}>
                                    <Box ml={1} fontSize={18} display='flex' alignItems='center'>
                                        <Box mr={1}>Not Assigned Points</Box>
                                        <TextField className={classes.scoreInput} value={awayTeamNotAssignedScore}  onChange={(e) => setAwayTeamNotAssignedScore(e.target.value)} disabled={gameRound.isComplete}/>
                                    </Box>
                                </NewBox>
                            }
                            {players
                                .filter(x => x.teamId == teamId)
                                .map(item => (
                                    <Box display="flex" mt={1} key={item.athleteId}>
                                        <Idiograph className='hand'
                                            onClick={() => handleClickAthlete(item)}
                                            title={item.athleteName}
                                            subtitle={item.joinGameType}
                                            imgurl={item?.athletePictureUrl}
                                        />

                                        <TextField className={classes.scoreInput} value={item.score} onChange={(e) => handleAthleteScoreChange(item.athleteId, e.target.value)} disabled={gameRound.isComplete}/>
                                    </Box>
                            ))}
                            {!gameRound.isComplete &&  
                                <>
                                    <ElButton mt={1} onClick={handleSaveScores} loading={savingScores}>Save</ElButton>
                                    <ElButton mt={1} onClick={() => setIsSubmitScores(true)}>Submit Scores</ElButton>
                                </>
                            }
                        </>
                    }
                    {canEnd() && <ElButton mt={1} onClick={() => setIsEndGame(true)}>End Game</ElButton>}
                    {
                        showBasketballStats && 
                        <BasketballStats 
                            open={showBasketballStats} 
                            onClose={() => setShowBasketballStats(false)} 
                            handleSaveStats={(athleteId, stats) => handleUpdateBasketballLowStats(athleteId, stats)} 
                            gameId={game.id}
                            round={round}
                            isComplete={gameRound.isComplete}
                            athlete={athlete}/>
                    }
                    {
                        showSoccerStats && 
                        <SoccerStats 
                            open={showSoccerStats} 
                            onClose={() => setShowSoccerStats(false)} 
                            handleSaveStats={(athleteId, stats) => handleUpdateSoccerLowStats(athleteId, stats)} 
                            gameId={game.id}
                            isComplete={gameRound.isComplete}
                            round={round}
                            athlete={athlete}/>
                    }

                    <ElConfirm   
                        title="Submit Scores"
                        content="Are you sure to submit scores?"
                        open={isSubmitScores}
                        onNoClick={() => setIsSubmitScores(false)}
                        onOkClick={handleSubmitScores}/>
                    <ElConfirm   
                        title="End game"
                        content="Are you sure to end game?"
                        open={isEndGame}
                        onNoClick={() => setIsEndGame(false)}
                        onOkClick={handleEndGame}/>
                </ElDialog>
            )}
        </>
    );
};


const BasketballStats = ({ open, onClose, gameId, isComplete, round, athlete, handleSaveStats }) => {
    const classes = useStyles();
    const [stats, setStats] = useState({
        teamId: athlete.teamId
    });

    useEffect(() => {
        getStats();
    }, [])
    

    const getStats = async () => {
        const res = await gameService.getBasketballLowStats(gameId, round, athlete.athleteId);
        if (res && res.code === 200) {
            setStats(pre => ({ ...pre, ...res.value }))
        }
    }

    return (
        <>
            {open && (
                <ElDialog
                    title="Basketball Stats"
                    open={open}
                    onClose={onClose} 
                    contentStyle={{ overflow: 'auto' }}>
                    <Idiograph className='hand'
                        title={athlete.athleteName}
                        subtitle={athlete.joinGameType}
                        imgurl={athlete?.athletePictureUrl}
                    />
                    <Box display="flex" justifyContent='space-between' alignItems='center' mb={1}>
                        <Box>Assist</Box>
                        <TextField className={classes.scoreInput} value={stats.assist} onChange={(e) => setStats(pre => ({ ...pre, assist: e.target.value }))} disabled={isComplete}/>
                    </Box>
                    <Box display="flex" justifyContent='space-between' alignItems='center' mb={1}>
                        <Box>Rebnd</Box>
                        <TextField className={classes.scoreInput} value={stats.rebnd} onChange={(e) => setStats(pre => ({ ...pre, rebnd: e.target.value }))} disabled={isComplete}/>
                    </Box>
                    <Box display="flex" justifyContent='space-between' alignItems='center' mb={1}>
                        <Box>Steal</Box>
                        <TextField className={classes.scoreInput} value={stats.steal} onChange={(e) => setStats(pre => ({ ...pre, steal: e.target.value }))} disabled={isComplete}/>
                    </Box>
                    <Box display="flex" justifyContent='space-between' alignItems='center'>
                        <Box>Block</Box>
                        <TextField className={classes.scoreInput} value={stats.block} onChange={(e) => setStats(pre => ({ ...pre, block: e.target.value }))} disabled={isComplete}/>
                    </Box>
                    {!isComplete && <ElButton mt={1} onClick={() => handleSaveStats(athlete.athleteId, stats)}>Save</ElButton>}
                </ElDialog>
            )}
        </>
    );
};

const SoccerStats = ({ open, onClose, gameId, isComplete, round, athlete, handleSaveStats }) => {
    const classes = useStyles();
    const [stats, setStats] = useState({
        teamId: athlete.teamId
    });

    useEffect(() => {
        getStats();
    }, [])

    const getStats = async () => {
        const res = await gameService.getSoccerLowStats(gameId, round, athlete.athleteId);
        if (res && res.code === 200) {
            setStats(pre => ({ ...pre, ...res.value }))
        }
    }

    return (
        <>
            {open && (
                <ElDialog
                    title="Soccer Stats"
                    open={open}
                    onClose={onClose} 
                    contentStyle={{ overflow: 'auto' }}>
                    <Idiograph className='hand'
                        title={athlete.athleteName}
                        subtitle={athlete.joinGameType}
                        imgurl={athlete?.athletePictureUrl}
                    />
                    <Box display="flex" justifyContent='space-between' alignItems='center' mb={1}>
                        <Box>Assist</Box>
                        <TextField className={classes.scoreInput} value={stats.assist} onChange={(e) => setStats(pre => ({ ...pre, assist: e.target.value }))} disabled={isComplete}/>
                    </Box>
                    <Box display="flex" justifyContent='space-between' alignItems='center' mb={1}>
                        <Box>TurnOver</Box>
                        <TextField className={classes.scoreInput} value={stats.turnOver} onChange={(e) => setStats(pre => ({ ...pre, turnOver: e.target.value }))} disabled={isComplete}/>
                    </Box>
                    <Box display="flex" justifyContent='space-between' alignItems='center' mb={1}>
                        <Box>Steal</Box>
                        <TextField className={classes.scoreInput} value={stats.steal} onChange={(e) => setStats(pre => ({ ...pre, steal: e.target.value }))} disabled={isComplete}/>
                    </Box>
                    <Box display="flex" justifyContent='space-between' alignItems='center' mb={1}>
                        <Box>Save</Box>
                        <TextField className={classes.scoreInput} value={stats.save} onChange={(e) => setStats(pre => ({ ...pre, save: e.target.value }))} disabled={isComplete}/>
                    </Box>
                    <Box display="flex" justifyContent='space-between' alignItems='center'>
                        <Box>Corner</Box>
                        <TextField className={classes.scoreInput} value={stats.corner} onChange={(e) => setStats(pre => ({ ...pre, corner: e.target.value }))} disabled={isComplete}/>
                    </Box>
                    {!isComplete && <ElButton mt={1} onClick={() => handleSaveStats(athlete.athleteId, stats)}>Save</ElButton>}
                </ElDialog>
            )}
        </>
    );
};

export default SetGameScores;
