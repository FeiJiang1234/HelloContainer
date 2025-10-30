import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import { ElButton, ElDialog } from 'components';
import { Typography } from '@mui/material';
import { gameService } from 'services';
import { useGameRoute } from 'utils';

const useStyles = makeStyles(theme => ({
    startGameBtn: {
        fontSize: '20px !important',
        fontWeight: '500 !important',
        marginTop: theme.spacing(5),
    },
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


const StartGame = ({ game }) => {
    const classes = useStyles();
    const [startGameDialogStatus, setStartGameDialogStatus] = useState(false);
    const [loading, setLoading] = useState(false);
    const { goScoreBoard } = useGameRoute();

    const handleStartGame = async () => {
        setLoading(true);
        const res = await gameService.startGame(game.id);
        if (res && res.code === 200) {
            goScoreBoard(game.id, game.gameSportType);
        }
        setLoading(false);
    }

    const handleShowStartGameDialog = () => {
        setStartGameDialogStatus(true);
    }

    return (
        <>
            <ElButton className={classes.startGameBtn} onClick={handleShowStartGameDialog} media ml={3} mr={3}>
                Start Game
            </ElButton>
            {
                startGameDialogStatus &&
                <ElDialog open={startGameDialogStatus} onClose={() => setStartGameDialogStatus(false)} subgreen
                    title="Start Game?"
                    subTitle={`Are you sure you want to start this game?`}
                    actions={
                        <>
                            <ElButton onClick={handleStartGame} loading={loading}>Yes</ElButton>
                            <ElButton onClick={() => setStartGameDialogStatus(false)}>No</ElButton>
                        </>
                    }>
                    <Typography className={classes.dialogGameId}>Game ID: {game.gameCode}</Typography>
                </ElDialog>
            }
        </>
    );
};

export default StartGame;
