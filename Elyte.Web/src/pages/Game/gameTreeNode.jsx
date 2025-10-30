import React, { useState, useRef } from 'react';
import { makeStyles } from '@mui/styles';
import { Box, MenuItem } from '@mui/material';
import { ElMenu, ElDialog, ElSvgIcon, ElConfirm } from 'components';
import ForfeitGame from './forfeitGame';
import { utils } from 'utils';
import { GameStatus, OrganizationType } from 'enums';
import * as moment from 'moment';
import { Idiograph } from 'parts';
import UpdateGameInfo from '../Game/updateGameInfo';
import { useHistory } from 'react-router-dom';
import { gameService, leagueService, tournamentService } from 'services';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Tooltip from '@mui/material/Tooltip';
import SetGameScores from './setGameScores';

const outcome = {
    borderRadius: '50px',
    color: '#ffffff',
    padding: '5px 10px',
    '& .idiograph-title': {
        color: '#ffffff',
    },
    '& .idiograph-center-title': {
        color: '#ffffff',
    },
    '& .idiograph-sub-title': {
        color: '#ffffff',
    },
};

const useStyles = makeStyles(theme => ({
    root: {
        display: 'inline-block',
        background: '#F0F2F7',
        borderRadius: 10,
        padding: 8,
    },
    team: {
        width: '160px',
        height: '43px',
        padding: 4,
        background: '#FFFFFF',
        borderRadius: '5px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        '& .idiograph-title': {
            whiteSpace: 'nowrap',
        },
    },
    bottom: {
        color: theme.palette.body.main,
        fontSize: '11px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.spacing(1),
        height: 40,
        cursor: 'pointer',
    },
    officiate: {
        position: 'absolute',
        top: '-8px',
        left: '-6px',
    },
    postpone: {
        position: 'absolute',
        top: '-8px',
        right: '-6px',
    },
    winner: {
        backgroundColor: '#17C476',
        ...outcome,
    },
    tie: {
        background: theme.bgPrimary,
        ...outcome,
    },
}));

export default function GameTreeNode ({
    game,
    onForfeit,
    isOfficial,
    isLowStats,
    organizationId,
    organizationType,
    onDeleted,
    reloadBracket
}) {
    const classes = useStyles();
    const [forfeitedGame, setForfeitedGame] = useState(null);
    const [openUpdateGameDialog, setOpenUpdateGameDialog] = useState(false);
    const [openPostponeGameDialog, setOpenPostponeGameDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showSetScores, setShowSetScores] = useState(false);
    const history = useHistory();
    const isTie = game.gameStatus === GameStatus.Confirmed && game.winnerId === null;
    const isHomeWinner = game.winnerId == game.homeTeamId;
    const isAwayWinner = game.winnerId == game.awayTeamId;
    const viewMenuRef = useRef();

    const handleClose = () => setForfeitedGame(null);

    const handleForfeit = async teamId => {
        await onForfeit(game.id, teamId, organizationId);
        handleClose();
    };

    const handleViewGame = () => {
        if (game.gameStatus == 'Confirmed')
            history.push('/gamePost', { gameId: game.id, gameSportType: game.gameSportType });
        else history.push('/gameProfile', { params: { id: game.id } });
    };

    const getOutcomesStyle = isWinner => {
        if (isTie) return classes.tie;
        if (isWinner) return classes.winner;
        return '';
    };
    const handleYesToDeleteClick = async () => {
        const res = await gameService.deleteGame(game.id);
        if (res && res.code === 200) {
            setShowDeleteDialog(false);
            onDeleted && onDeleted(game);
        }
    };

    const handleGameClick = (e) => {
        const isManager = game.isOfficiate || game.isAdmin || game.isCoordinator;
        const isGameStarted = game.gameStatus == null;

        if(!isManager || (isManager && !isGameStarted)) {
            handleViewGame();
        }

        if (isManager && isGameStarted) {
            viewMenuRef.current.open(e.currentTarget);
        }
    }

    const handleScheduleGameClick = () => {
        setOpenUpdateGameDialog(true);
        viewMenuRef.current.open();
    }

    const handleForfeitClick = () => {
        setForfeitedGame(game);
        viewMenuRef.current.open();
    }

    const handleDeleteClick = () => {
        setShowDeleteDialog(true);
        viewMenuRef.current.open();
    }

    const handlePostponeClick = () => {
        setOpenPostponeGameDialog(true);
        viewMenuRef.current.open();
    }

    const handlePostponeGame = async () => {
        const res = await getPostponeService();
        if (res && res.code === 200) {
            reloadBracket && reloadBracket();
        }
    }

    const getPostponeService = () => {
        if (organizationType == OrganizationType.League) {
            return leagueService.postponeGame(organizationId, game.id);
        }

        if (organizationType == OrganizationType.Tournament) {
            return tournamentService.postponeGame(organizationId, game.id);
        }
    };

    const handleSetScores = () => {
        setShowSetScores(true);
        viewMenuRef.current.open();
    }

    return (
        <Box className={`${classes.root} hand`}>
            <Box onClick={handleGameClick}>
                <Box className={[classes.team, getOutcomesStyle(isHomeWinner)].join(' ')} mb={1}>
                    <Idiograph
                        title={game.homeTeamName}
                        centerTitle={
                            !utils.isGuidEmpty(game.homeTeamId) &&
                            `Rank: ${game.teamCount}, ${game.homeTeamRank}`
                        }
                        imgurl={game.homeTeamImageUrl}
                    />
                    {game.isOfficiate && (
                        <ElSvgIcon className={classes.officiate} light xSmall name="officiates" />
                    )}
                    {game.isPostponed && (
                        <Tooltip title="Postponed" placement="top">
                            <AccessTimeIcon className={classes.postpone} fontSize="small" />
                        </Tooltip>
                    )}

                </Box>
                <Box className={[classes.team, getOutcomesStyle(isAwayWinner)].join(' ')}>
                    <Idiograph
                        title={game.awayTeamName}
                        centerTitle={
                            !utils.isGuidEmpty(game.awayTeamId) &&
                            `Rank: ${game.teamCount}, ${game.awayTeamRank}`
                        }
                        imgurl={game.awayTeamImageUrl}
                    />
                </Box>
                <Box mt={1} className={classes.bottom}>
                    {
                        game.gameStatus === null &&
                        <span>Game will be on</span>
                    }
                    {
                        game.gameStatus === GameStatus.Confirmed &&
                        <span className="primary-bold">Game was in</span>
                    }
                    <span className="primary-bold">
                        {game.startTime && moment(game.startTime).format('MM.DD.YYYY')}
                    </span>
                </Box>
            </Box>

            <ElMenu ref={viewMenuRef}>
                <MenuItem onClick={handleViewGame}>Game Page</MenuItem>
                {(game.isAdmin || game.isCoordinator) && isLowStats && !utils.isGuidEmpty(game.homeTeamId) && !utils.isGuidEmpty(game.awayTeamId) && <MenuItem onClick={handleSetScores}>Set Scores</MenuItem>}
                {
                    game.isAdmin && game.gameStatus == null &&
                    <MenuItem onClick={handleScheduleGameClick}>Schedule Game</MenuItem>
                }
                {
                    (game.isOfficiate || game.isAdmin || game.isCoordinator) &&
                    game.gameStatus == null &&
                    !utils.isGuidEmpty(game.homeTeamId) &&
                    !utils.isGuidEmpty(game.awayTeamId) &&
                    game.winnerId == null &&
                    <MenuItem onClick={() => { handleForfeitClick() }}>Assign a Forfeit</MenuItem>
                }
                {
                    (game.isAdmin || game.isCoordinator) && game.gameStatus == null && game.isRoundRobin &&
                    <MenuItem onClick={() => { handleDeleteClick() }}>Delete</MenuItem>
                }
                {
                    game.isAdmin && game.gameStatus == null && game.isRoundRobin && !game.isPostponed &&
                    <MenuItem onClick={() => { handlePostponeClick() }}>Postpone</MenuItem>
                }
            </ElMenu>

            <ForfeitGame
                onClose={handleClose}
                game={forfeitedGame}
                onForfeit={handleForfeit}>
            </ForfeitGame>

            {
                openUpdateGameDialog && 
                <ElDialog open={openUpdateGameDialog} onClose={() => setOpenUpdateGameDialog(false)} title="Edit Game">
                    <UpdateGameInfo
                        isOfficial={isOfficial}
                        isLowStats={isLowStats}
                        gameInfo={game}
                        organizationId={organizationId}
                        organizationType={organizationType}
                        onCancel={() => setOpenUpdateGameDialog(false)}
                        reloadBracket={reloadBracket} />
                </ElDialog>
            }
            {
                openPostponeGameDialog && <ElConfirm
                    title="Postpone Game"
                    content="Are you sure you want to postpone the current game?"
                    open={openPostponeGameDialog}
                    onNoClick={() => setOpenPostponeGameDialog(false)}
                    onOkClick={handlePostponeGame}
                />
            }
            {
                showDeleteDialog && <ElConfirm
                    title="Delete Game"
                    content="Are you sure you want to delete the current game?"
                    open={showDeleteDialog}
                    onNoClick={() => setShowDeleteDialog(false)}
                    onOkClick={handleYesToDeleteClick}
                />
            }
            {showSetScores && <SetGameScores open={showSetScores} onClose={() => setShowSetScores(false)} game={game} reloadBracket={reloadBracket}/>}
        </Box>
    );
}
