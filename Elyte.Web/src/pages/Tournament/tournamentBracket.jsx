import React, { useEffect, useState } from 'react';
import { Divider, Typography, IconButton, Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { tournamentService, gameService } from 'services';
import { ElSvgIcon, ElBox, ElConfirm, ElMenuBtn, ElDialog, ElLinkBtn } from 'components';
import { useRounds } from 'utils';
import GameTree from '../Game/gameTree';
import { OrganizationType, PlayoffsType } from 'enums';
import AssignNewGame from 'pages/Game/assignNewGame';

const useStyles = makeStyles(() => ({
    container: {
        position: 'relative',
    },
    noRobin: {
        display: 'flex',
        justifyContent: 'space-between',
        overflow: 'auto',
    },
}));

const TournamentBracket = ({ profile }) => {
    const classes = useStyles();
    const { id, tournamentType, isOfficial, isAdminView, isLowStats } = profile;
    const [games, setGames] = useState([]);
    const [open, setOpen] = useState(false);
    const { round, rounds, roundMenu, setDefaultRound, setRounds } = useRounds(tournamentType);
    const [teams, setTeams] = useState([]);
    const [openAssignGameDialog, setOpenAssignGameDialog] = useState(false);
    const isRoundRobin = tournamentType === PlayoffsType.RoundRobin.replace(' ', '');

    useEffect(() => {
        getBracketRounds();
        getTournamentTeams();
    }, [id]);

    useEffect(() => {
        if (!round) return;
        getBracketByRound();
    }, [round]);

    const handleAutoAssignGameTeam = async () => {
        const res = await tournamentService.autoAssignGameTeam(id);
        if (res && res.code === 200) {
            getBracketRounds();
            getBracketByRound();
        }
        setOpen(false);
    };

    const getBracketRounds = async () => {
        const res = await tournamentService.getBracketRounds(id);
        if (res && res.code === 200) {
            setRounds(res.value.rounds);
            setDefaultRound(res.value.currentRound);
        }
    };

    const getBracketByRound = async () => {
        const res = await tournamentService.getBracketByRound(id, round?.value);
        if (res && res.code === 200) setGames(res.value);
    };

    const handleForfeit = async (gameId, teamId, tournamentId) => {
        const res = await gameService.forfeitTournamentGame(gameId, teamId, tournamentId);
        if (res && res.code === 200) getBracketByRound();
    };

    const getTournamentTeams = async () => {
        const res = await tournamentService.getTournamentTeams(id);
        if (res && res.code === 200) setTeams(res.value);
    };

    const handleAssignGame = async data => {
        const res = await tournamentService.assignGame(id, data);
        if (res && res.code === 200) {
            setOpenAssignGameDialog(false);
            getBracketRounds();
            getBracketByRound();
        }
    };

    return (
        <Box pb={10}>
            {isAdminView && (
                <Box mt={2} className="flex-sb">
                    {isRoundRobin && (
                        <span className="text-btn" onClick={() => setOpenAssignGameDialog(true)}>
                            Assign Manually
                        </span>
                    )}
                    <ElLinkBtn onClick={() => setOpen(true)}>Auto Assign</ElLinkBtn>
                </Box>
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
            <Box className={`${classes.container} ${classes.noRobin}`}>
                {games.map(item => (
                    <GameTree
                        key={item.id}
                        game={item}
                        onForfeit={handleForfeit}
                        isOfficial={isOfficial}
                        isLowStats={isLowStats}
                        organizationId={id}
                        organizationType={OrganizationType.Tournament}
                        onDeleted={game => {
                            setGames(games.filter(gameItem => gameItem.id != game.id));
                        }}
                        reloadBracket ={() => {
                            getBracketRounds();  
                            getBracketByRound();
                        }}
                    />
                ))}
            </Box>

            <ElConfirm
                title="Are you sure to auto assign teams?"
                keepMounted
                open={open}
                onNoClick={() => setOpen(false)}
                onOkClick={() => handleAutoAssignGameTeam()}
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

export default TournamentBracket;
