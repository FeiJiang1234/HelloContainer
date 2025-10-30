import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import { ElButton, ElOptionButton, ElDialog } from 'components';
import { Typography } from '@mui/material';
import { gameService } from 'services';
import { GameStatus } from 'enums';

const useStyles = makeStyles(theme => ({
    dialogDescription: {
        textAlign: 'center',
        color: theme.palette.body.light,
        fontSize: 15,
    },
    dialogGameId: {
        textAlign: 'center',
        color: theme.palette.body.main,
        fontSize: 18,
        marginTop: theme.spacing(1),
    }
}));

const CallCoordinator = ({ game }) => {
    const classes = useStyles();
    const [recordIdOfCallingCoordinator, setRecordIdOfCallingCoordinator] = useState();
    const [startCallCoordinatorStatus, setStartCallCoordinatorStatus] = useState(false);
    const [isShowCancelCallingCoordinator, setIsShowCancelCallingCoordinator] = useState(false);

    const handleCallCoordinatorClick = async () => {
        if (game.gameStatus !== GameStatus.Paused) {
            const res = await gameService.pauseGame(game.id);
            if (res && res.code === 200) {
                callCoordinator();
            }
        }
        if (game.gameStatus === GameStatus.Paused) {
            callCoordinator();
        }
    }

    const callCoordinator = async () => {
        const callCoordinatorRes = await gameService.callCoordinator(game.id);
        if (callCoordinatorRes && callCoordinatorRes.code === 200) {
            setRecordIdOfCallingCoordinator(callCoordinatorRes.value);
            setStartCallCoordinatorStatus(true)
        }
    }

    const handleResumeAfterCallingCoordinatorClick = async () => {
        const resumeRes = await gameService.resumeGame(game.id);
        const finishCallingCoordinatorRes = await gameService.finishCallingCoordinator(game.id, recordIdOfCallingCoordinator);
        if (resumeRes && resumeRes.code === 200 && finishCallingCoordinatorRes && finishCallingCoordinatorRes.code === 200) setStartCallCoordinatorStatus(false);
    }

    const handleCancelCallingCoordinatorClick = async () => {
        const cancelRes = await gameService.cancelCallingCoordinator(game.id, recordIdOfCallingCoordinator);
        const resumeRes = await gameService.resumeGame(game.id);
        if (cancelRes && cancelRes.code === 200 && resumeRes && resumeRes.code === 200) {
            setStartCallCoordinatorStatus(false);
            setIsShowCancelCallingCoordinator(true);
        }
    }

    return (
        <>
            <ElOptionButton iconName="callCoordinator" onClick={handleCallCoordinatorClick}>Call Coordinator</ElOptionButton>
            {startCallCoordinatorStatus &&
                <ElDialog open={startCallCoordinatorStatus} subgreen
                    title="Call Coordinator" subTitle="Coordinators have been notified that assistance is required"
                    actions={
                        <>
                            <ElButton onClick={handleCancelCallingCoordinatorClick}>Cancel</ElButton>
                            <ElButton onClick={handleResumeAfterCallingCoordinatorClick}>Resume</ElButton>
                        </>
                    }>
                    <Typography className={classes.dialogDescription}>If press Resume, direct user to Sport Module for the sport being played. If press Cancel, will cancel calling coordinator</Typography>
                    <Typography className={classes.dialogGameId}>Game ID: {game.gameCode}</Typography>
                </ElDialog>
            }
            {isShowCancelCallingCoordinator &&
                <ElDialog open={isShowCancelCallingCoordinator} subred
                    title="Call Coordinator" subTitle="Your request for assistance has been canceled"
                    actions={
                        <ElButton onClick={() => setIsShowCancelCallingCoordinator(false)}>Close</ElButton>
                    }>
                    <Typography className={classes.dialogDescription}>Press Close, will direct officiate to the main play screen</Typography>
                    <Typography className={classes.dialogGameId}>Game ID: {game.gameCode}</Typography>
                </ElDialog>
            }
        </>
    );
};

export default CallCoordinator;
