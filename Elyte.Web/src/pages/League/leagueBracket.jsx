import React, { useEffect, useState } from 'react';
import { Divider, Typography, IconButton, Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { leagueService, gameService } from 'services';
import { ElSvgIcon, ElBox, ElConfirm, ElMenuBtn, ElSwitch, ElDialog, ElLinkBtn } from 'components';
import { useRounds } from 'utils';
import { OrganizationType, PlayoffsType } from 'enums';
import GameTree from '../Game/gameTree';
import AssignNewGame from 'pages/Game/assignNewGame';
import GameTreeNode from './../Game/gameTreeNode';

const useStyles = makeStyles(() => ({
    container: {
        position: 'relative',
    },
    noRobin: {
        display: 'flex',
        justifyContent: 'space-between',
        overflow: 'auto',
    },
    robinRowDouble: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    robinRowSingle: {
        display: 'flex',
        justifyContent: 'center',
    },
}));

const LeagueBracket = ({ profile }) => {
    const classes = useStyles();
    const { id, playoffsType, isOfficial, isAdminView, isLowStats } = profile;
    const [isPlayoffs, setIsPlayoffs] = useState(false);
    const [games, setGames] = useState([]);
    const [teams, setTeams] = useState([]);
    const [openAssignGameDialog, setOpenAssignGameDialog] = useState(false);
    const [open, setOpen] = useState(false);
    let bracketType = isPlayoffs ? playoffsType : PlayoffsType.RoundRobin.replace(' ', '');
    const { round, rounds, roundMenu, setDefaultRound, setRounds } = useRounds(bracketType);

    useEffect(() => {
        setGames([]);
        setRounds([]);
        getBracketRounds();
        getLeagueTeams();
    }, [id, bracketType]);

    useEffect(() => {
        if (!round) return;
        getBracketByRound();
    }, [round]);

    const generateBracket = async () => {
        const res = isPlayoffs
            ? await leagueService.autoAssignPlayoffsGameTeam(id)
            : await leagueService.autoAssignSeasonGameTeam(id);
        if (res && res.code === 200) {
            getBracketRounds();
            getBracketByRound();
        }
        setOpen(false);
    };

    const getBracketRounds = async () => {
        const res = await leagueService.getBracketRounds(id, isPlayoffs);
        if (res && res.code === 200) {
            setRounds(res.value.rounds);
            setDefaultRound(res.value.currentRound);
        }
    };

    const getLeagueTeams = async () => {
        const res = await leagueService.getLeagueTeams(id);
        if (res && res.code === 200) setTeams(res.value);
    };

    const getBracketByRound = async () => {
        const res = await leagueService.getBracketByRound(id, round?.value, isPlayoffs);
        if (res && res.code === 200) setGames(res.value);
    };

    const handleForfeit = async (gameId, teamId, leagueId) => {
        const res = await gameService.forfeitLeagueGame(gameId, teamId, leagueId);
        if (res && res.code === 200) getBracketByRound();
    };

    const handleAssignGame = async data => {
        const res = await leagueService.assignGame(id, data);
        if (res && res.code === 200) {
            setOpenAssignGameDialog(false);
            getBracketRounds();
            getBracketByRound();
        }
    };

    const reAssembleGameArr = games => {
        const arr = [];
        let minArr = [];
        games.forEach(game => {
            if (minArr.length === 2) {
                minArr = [];
            }
            if (minArr.length === 0) {
                arr.push(minArr);
            }
            minArr.push(game);
        });
        return arr;
    };

    return (
        <Box pb={10}>
            {isAdminView && (
                <Box mt={2} mb={2} className="flex-sb">
                    {!isPlayoffs && (
                        <span className="text-btn" onClick={() => setOpenAssignGameDialog(true)}>
                            Assign Manually
                        </span>
                    )}
                    <span className="fillRemain"></span>
                    <ElLinkBtn onClick={() => setOpen(true)}>Auto Assign</ElLinkBtn>
                </Box>
            )}

            {profile.playoffsType !== 'NoPlayoffs' && (
                <ElSwitch
                    on="On"
                    off="Off"
                    isOn={isPlayoffs}
                    text="Show playoffs"
                    toggle={() => setIsPlayoffs(!isPlayoffs)}></ElSwitch>
            )}

            <Divider className="divider" />

            {!Array.isNullOrEmpty(roundMenu) && (
                <ElBox center>
                    <Typography>{round?.text}</Typography>
                    <span className="fillRemain"></span>
                    <ElMenuBtn items={roundMenu}>
                        <IconButton>
                            <ElSvgIcon dark xSmall name="expandMore"></ElSvgIcon>
                        </IconButton>
                    </ElMenuBtn>
                </ElBox>
            )}

            {bracketType !== PlayoffsType.RoundRobin.replace(' ', '') && (
                <Box className={`${classes.container} ${classes.noRobin}`}>
                    {games.map(item => (
                        <GameTree
                            key={item.id}
                            game={item}
                            onForfeit={handleForfeit}
                            isOfficial={isOfficial}
                            isLowStats={isLowStats}
                            organizationId={id}
                            organizationType={OrganizationType.League}
                            reloadBracket ={() => {
                                getBracketRounds();  
                                getBracketByRound();
                            }}
                        />
                    ))}
                </Box>
            )}

            {bracketType == PlayoffsType.RoundRobin.replace(' ', '') && (
                <Box className={`${classes.container} ${classes.robin}`}>
                    {reAssembleGameArr(games).map((item, index) => (
                        <Box
                            key={index}
                            className={
                                item.length % 2 == 0
                                    ? classes.robinRowDouble
                                    : classes.robinRowSingle
                            }
                            mb={4}>
                            {item.map(game => (
                                <GameTreeNode
                                    key={game.id}
                                    game={game}
                                    onForfeit={handleForfeit}
                                    isOfficial={isOfficial}
                                    isLowStats={isLowStats}
                                    organizationId={id}
                                    organizationType={OrganizationType.League}
                                    onDeleted={game => {
                                        setGames(games.filter(item => item.id != game.id));
                                    }}
                                    reloadBracket ={() => {
                                        getBracketRounds();  
                                        getBracketByRound();
                                    }}
                                />
                            ))}
                        </Box>
                    ))}
                </Box>
            )}

            <ElConfirm
                title={
                    isPlayoffs
                        ? 'Are you sure to auto assign teams for playoffs games?'
                        : 'Are you sure to auto assign teams for season games?'
                }
                keepMounted
                open={open}
                onNoClick={() => setOpen(false)}
                onOkClick={() => generateBracket()}
            />

            <ElDialog open={openAssignGameDialog} onClose={() => setOpenAssignGameDialog(false)}>
                <AssignNewGame
                    rounds={rounds}
                    teams={teams}
                    onSave={handleAssignGame}
                    onCancel={() => setOpenAssignGameDialog(false)}></AssignNewGame>
            </ElDialog>
        </Box>
    );
};

export default LeagueBracket;
