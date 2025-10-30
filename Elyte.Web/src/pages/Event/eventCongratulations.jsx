import React from 'react';
import { ElButton, ElAddress } from 'components';
import { Typography, Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useLocation, useHistory } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        paddingLeft: '16px',
        paddingRight: '16px'
    },
    backgroundImg: {
        backgroundSize: 'cover',
        height: 250,
        width: '100%',
    },
    timeContainer: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    time: {
        fontSize: 25,
        fontWeight: 700,
        color: theme.palette.body.main
    },
    to: {
        display: 'flex',
        alignItems: 'center',
        fontSize: 20,
        fontWeight: 600,
        color: theme.palette.body.main,
        paddingRight: theme.spacing(2),
    },
    addToCalendar: {
        fontSize: 15,
        fontWeight: 600,
        color: '#17C476',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        paddingLeft: '16px',
        paddingRight: '16px'
    },
    buttonFont: {
        fontSize: 20,
        fontWeight: 500,
    },
    buttonShape: {
        width: 150,
        height: 70,
    },
}));

const EventCongratulations = () => {
    const classes = useStyles();
    const history = useHistory();
    const location = useLocation();
    const routerParams = location.state.params;

    const jumpToProfile = id => {
        history.push('/eventProfile', { params: id });
    };

    const jumpToShare = id => {
        history.push('/eventShare', { params: id });
    };

    return (
        <Box sx={{ marginTop: '-10px' }}>
            <Box className={classes.backgroundImg} style={{ backgroundImage: `url(${routerParams.imageUrl})` }}>
                <Typography align="center" sx={{ fontSize: 22, color: '#FFFFFF', fontWeight: 700 }} >CONGRATULATIONS!</Typography>
                <Typography align="center" sx={{ fontSize: 15, fontWeight: 500, color: '#C0C5D0' }}>
                    {routerParams.isEdit ? "You have updated event successfully!" : " You have successfully created a new event!"}
                </Typography>
            </Box>
            <Typography align="center" sx={{ fontSize: 30, color: '#000000', fontWeight: 700 }}>{routerParams.title}</Typography>
            <Typography align="center" sx={{ fontSize: 15, color: '#C0C5D0', fontWeight: 400 }}>{routerParams.sportOption}</Typography>
            <Box className={classes.container}>
                <Box mt={2} className={classes.timeContainer}>
                    <Typography className={classes.time}>{routerParams.startTime}</Typography>
                    <Box className={classes.to}>To</Box>
                    <Typography className={classes.time}>{routerParams.endTime}</Typography>
                </Box>
                <ElAddress mt={2} mb={2} country={routerParams.country} state={routerParams.state} city={routerParams.city} />
                <Typography align="center" className={classes.addToCalendar}>
                    *Added to the Team&apos;s calendar
                </Typography>
            </Box>

            <Box mt={3} mb={1} className={classes.buttonContainer}>
                <Box className={classes.buttonShape}>
                    <ElButton variant='outlined' media onClick={() => jumpToProfile(routerParams.id)}>
                        <Typography className={classes.buttonFont}>Back to profile</Typography>
                    </ElButton>
                </Box>
                <Box className={classes.buttonShape}>
                    <ElButton media onClick={() => jumpToShare(routerParams.id)}>
                        <Typography className={classes.buttonFont}>Share</Typography>
                    </ElButton>
                </Box>
            </Box>
        </Box>
    );
};

export default EventCongratulations;
