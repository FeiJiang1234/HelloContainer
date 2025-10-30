import React from 'react';
import { Box, useMediaQuery } from '@mui/material';
import { ElMenuBtn, ElSvgIcon, } from 'components';
import { Idiograph } from 'parts';
import { makeStyles, useTheme } from '@mui/styles';
import * as moment from 'moment';
import { GameStatus } from 'enums';
import { useHistory } from 'react-router-dom';

const outcome = {
    borderRadius: '50px',
    color: '#ffffff',
    padding: '5px 10px',
    '& .idiograph-title': {
        color: "#ffffff"
    },
    '& .idiograph-center-title': {
        color: "#ffffff"
    },
    '& .idiograph-sub-title': {
        color: '#ffffff'
    }
};

const useStyles = makeStyles(theme => ({
    root: {
        position: 'relative'
    },
    center: {
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)'
    },
    score: {
        padding: theme.spacing(1),
        background: theme.bgPrimary,
        color: 'white',
        borderRadius: '5px',
        fontWeight: 'bold'
    },
    winner: {
        backgroundColor: '#17C476',
        ...outcome
    },
    tie: {
        background: theme.bgPrimary,
        ...outcome
    },
}));


const GameRow = ({ game, menuItems = [] }) => {
    const classes = useStyles();
    const history = useHistory();
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));
    const isTie = game.gameStatus === GameStatus.Confirmed && game.winnerId === null;
    const isHomeWinner = game.winnerId == game.homeTeamId;
    const isAwayWinner = game.winnerId == game.awayTeamId;

    const showRank = (count, rank) => {
        if (count && rank) return `Rank: ${count}, ${rank}`;
        return null;
    }

    const showPlayerCount = (starter, substituter) => {
        if (starter !== undefined && substituter !== undefined) return `${starter} Starters,<br /> ${substituter} Subs`;

        return null;
    }

    const handleGameOnClick = () => {
        if (game.gameStatus == "Confirmed")
            history.push('/gamePost', { gameId: game.id, gameSportType: game.gameSportType });
        else
            history.push("/gameProfile", { params: { id: game.id } })
    }

    const getOutcomesStyle = (isWinner) => {
        if(isTie) return classes.tie;
        if(isWinner) return classes.winner;
        return '';
    }


    return (
        <Box className={classes.root}>
            <Box mt={2} className="flex-sb y-center" onClick={handleGameOnClick}>
                <Box className={`y-center ${getOutcomesStyle(isHomeWinner)}`} style={{ maxWidth: isDesktop ? '200px' : '150px' }}>
                    <Idiograph to={null}
                        centerTitle={showRank(game.teamCount, game.homeTeamRank)}
                        subtitle={showPlayerCount(game.homeTeamStarter, game.homeTeamSubstituter)}
                        title={game.homeTeamName}
                        imgurl={game.homeTeamImageUrl}
                    />
                </Box>
                {
                    game.gameStatus === null && game.startTime &&
                    <Box pb={1} pr={3} className={`${classes.center} primary-bold`}>
                        {game.startTime && moment(game.startTime).format('MM.DD.YYYY')}
                    </Box>
                }
                {
                    game.gameStatus !== null && game.gameStatus !== GameStatus.Confirmed &&
                    <Box pb={1} pr={3} className={`${classes.center} primary-bold`}>InProgress</Box>
                }
                {
                    game.gameStatus === GameStatus.Confirmed &&
                    <Box className={[classes.center, classes.score]}>
                        {`${game.homeTeamScore} / ${game.awayTeamScore}`}
                    </Box>
                }
                <Box className={`y-center ${getOutcomesStyle(isAwayWinner)}`} style={{ maxWidth: isDesktop ? '200px' : '150px'  }}>
                    <Idiograph to={null} reverse
                        title={game.awayTeamName}
                        centerTitle={showRank(game.teamCount, game.awayTeamRank)}
                        subtitle={showPlayerCount(game.awayTeamStarter, game.awayTeamSubstituter)}
                        imgurl={game.awayTeamImageUrl}
                    />
                    {
                        game.awayTeamName && game.homeTeamName && !Array.isNullOrEmpty(menuItems) &&
                        <Box style={{ width: 30, height: 30 }}>
                            <ElMenuBtn items={menuItems} >
                                <ElSvgIcon light small name="options" />
                            </ElMenuBtn>
                        </Box>
                    }

                </Box>
            </Box>
        </Box>
    );
};

export default GameRow;