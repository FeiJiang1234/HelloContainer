import React, { useState, useEffect } from 'react';
import { gameService } from 'services';
import { Box, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ElBox, ElTitle } from 'components';
import { useLocation } from 'react-router-dom';
import { useProfileRoute } from 'utils';
import { Idiograph } from 'parts';
import { Selected, Unselected } from './components/lineUp';

const useStyles = makeStyles(theme => ({
    subTitle: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 600,
        color: theme.palette.body.main
    }
}));

const GameRoster = () => {
    const classes = useStyles();
    const [roster, setRoster] = useState([]);
    const location = useLocation();
    const gameId = location?.state?.params;

    var teamName1 = null
    var teamName2 = null;
    var team1Roster = new Array();
    var team2Roster = new Array();

    useEffect(() => {
        getGameRoster();
    }, []);

    const getGameRoster = async () => {
        const res = await gameService.getGameRoster(gameId);
        if (res && res.code === 200 && res.value) { 
            setRoster(res.value);
        }
    };

    if (roster.length > 0) {
        teamName1 = roster[0].teamName;
        for (var i = 0; i < roster.length; i++) {
            if (roster[i].teamName != teamName1) {
                teamName2 = roster[i].teamName;
                break;
            }
        }
        for (var j = 0; j < roster.length; j++) {
            if (roster[j].teamName == teamName1) {
                team1Roster.push(roster[j]);
            }
            if (roster[j].teamName == teamName2) {
                team2Roster.push(roster[j]);
            }
        }
    }

    return (
        <>
            <ElTitle center>Rosters</ElTitle>
            <Box mt={2}>
                {
                    Array.isNullOrEmpty(roster) &&
                    <ElBox mt={2} center flex={1}>Not assigned yet</ElBox>
                }
                <Box className={classes.subTitle} mb={3} >{teamName1}</Box>      
                <Box display='flex'>
                    <Typography flex={1}>Player</Typography>
                    <Typography width={100} textAlign='center'>Sign In</Typography>
                    <Typography width={40} textAlign='center'>Pos</Typography>
                </Box>

                <GameRosterList players={team1Roster}></GameRosterList>
                <Box className={classes.subTitle} mt={3} mb={3}>{teamName2}</Box>
                <Box display='flex'>
                    <Typography flex={1}>Player</Typography>
                    <Typography width={100} textAlign='center'>Sign In</Typography>
                    <Typography width={40} textAlign='center'>Pos</Typography>
                </Box>
                <GameRosterList players={team2Roster}></GameRosterList>
            </Box>
        </>
    );
};

export default GameRoster;

const GameRosterList = ({ players }) => {
    const { athleteProfile } = useProfileRoute();

    return (
        <>
            {
                players.length > 0 && players.map(item => (
                    <Box display='flex' mt={1} key={item.playerId}>
                        <Box flex={1}>
                            <Idiograph 
                                to={item.isBlankAccount ? null : athleteProfile(item.playerId)}
                                title={item.playerName}
                                subtitle={item.joinGameType}
                                imgurl={item?.playerPictureUrl} />
                        </Box>
                        <Box width={100} display='flex' justifyContent='center'>
                            {item.isInGame ? <Selected>S</Selected> : <Unselected>B</Unselected>}
                        </Box>
                        <Box width={40} display='flex' justifyContent='center'>
                            <Unselected>{item.position}</Unselected>
                        </Box>
                    </Box>
                ))
            }
        </>
    );
};
