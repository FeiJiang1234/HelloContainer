import React, { useState, useEffect } from 'react';
import { Typography, Grid } from '@mui/material';
import { ElButton, ElInput, ElTitle } from 'components';
import { authService, userService, athleteService } from 'services';
import { useForm } from "react-hook-form";
import { useHistory } from 'react-router-dom';
import { useCountDownSeconds } from 'utils';

export default function ChangePhoneNumber () {
    const history = useHistory();
    const user = authService.getCurrentUser();
    const { register, handleSubmit, getValues, formState: { errors } } = useForm();
    const [showCodeBox, setShowCodeBox] = useState(false);
    const [currentUser, setCurrentUser] = useState();
    const [newPhoneNumber, setNewPhoneNumber] = useState('');
    const { seconds, secondsIncrease } = useCountDownSeconds();

    useEffect(() => getAthletecurrentUser(), [])

    const handleChangePhone = async (data) => {
        let params = { userId: currentUser?.id, ...data };
        const res = await userService.resetPhoneNumber(params);
        if (res && res.code === 200) {
            history.push('/myProfile');
        }
    }

    const getAthletecurrentUser = async () => {
        const res = await athleteService.getAthleteById(user.id);
        if (res && res.code === 200) setCurrentUser(res.value);
    }

    const getVerifyCode = async () => {
        setShowCodeBox(false);
        let { phoneNumber } = getValues();
        const res = await userService.sendPhoneCode({ phoneNumber });
        if (res && res.code === 200) {
            secondsIncrease();
            setShowCodeBox(true);
        }
    }

    return (
        <form onSubmit={handleSubmit(handleChangePhone)} autoComplete="off">
            <ElTitle center>Change Phone Number</ElTitle>
            <Typography variant="subtitle1" sx={{ textAlign: 'center' }}>
                Your current phone number is {currentUser?.phoneNumber}.
            </Typography>
            <Grid container direction="row" justifyContent="space-between" alignItems="center">
                <Grid item xs={7}>
                    <ElInput label="New Phone Number" errors={errors} inputProps={{ minLength: 5, maxLength: 15 }}
                        {...register("phoneNumber", { required: { value: true, message: 'This field is required.' }, onChange: (e) => setNewPhoneNumber(e.target.value) })}
                    />
                </Grid>
                <Grid item xs={5} >
                    <ElButton sx={{ marginLeft: 2, marginTop: 1 }} fullWidth={false} disabled={seconds > 0 || !newPhoneNumber.length} onClick={() => getVerifyCode()}>
                        {seconds > 0 ? `Resend (${60 - seconds})` : "Send"}
                    </ElButton>
                </Grid>
            </Grid>
            {
                showCodeBox &&
                <>
                    <ElInput label="Code" errors={errors} inputProps={{ maxLength: 6 }}
                        {...register("securityCode", { required: { value: true, message: 'This field is required.' } })}
                    />
                    <ElButton sx={{ marginTop: 2 }} type="submit">Save</ElButton>
                </>
            }
        </form >
    );
}
