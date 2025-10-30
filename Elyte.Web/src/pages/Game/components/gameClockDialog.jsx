import React from 'react';
import { ElButton, ElDialog, ElSelect, ElForm } from 'components';
import { Grid, Typography } from '@mui/material';
import { gameService } from 'services';
import { GameClock } from 'models';
import { useForm } from "react-hook-form";
import { useGameClock } from 'utils';

const GameClockDialog = ({ gameId, defaultGameClock, onClose }) => {
    const form = useForm();
    const defaultClock = useGameClock(defaultGameClock);
    const { register } = form;


    const handleChangeGameClock = async (data) => {
        const clockTime = `${data.hour}:${data.minute}:${data.second}`;
        const res = await gameService.changeGameClock(gameId, clockTime);
        if (res && res.code === 200) {
            onClose();
            window.elyte.success("Change game time successfully!");
        }
    }

    return (
        <ElDialog open={true} title="Change Game Clock" onClose={onClose}>
            <ElForm form={form} onSubmit={handleChangeGameClock}>
                <Grid container direction="row" justifyContent="space-between" alignItems="center" >
                    <Grid item xs={3}>
                        <ElSelect options={GameClock.hours} {...register("hour")} defaultValue={defaultClock.hour} />
                    </Grid>
                    <Grid item xs={1.5} sx={{ textAlign: 'center' }}><Typography variant="h3">:</Typography></Grid>
                    <Grid item xs={3}>
                        <ElSelect options={GameClock.minutes} {...register("minute")} defaultValue={defaultClock.minute} />
                    </Grid>
                    <Grid item xs={1.5} sx={{ textAlign: 'center' }}><Typography variant="h3">:</Typography></Grid>
                    <Grid item xs={3}>
                        <ElSelect options={GameClock.seconds} {...register("second")} defaultValue={defaultClock.second} />
                    </Grid>
                </Grid>
                <ElButton type="submit">Confirm</ElButton>
            </ElForm>
        </ElDialog>
    );
}

export default GameClockDialog;