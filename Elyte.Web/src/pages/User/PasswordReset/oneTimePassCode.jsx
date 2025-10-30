import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { ElButton, AccountContainer, ElTitle, ElContent, ElLink, ElInput } from 'components';
import { useForm } from "react-hook-form";
import { useCountDownSeconds, validator } from 'utils';
import { userService } from 'services';

const OneTimePassCode = () => {
    const history = useHistory();
    const location = useLocation();
    const params = location.state?.params;
    const [btnLoadingStatus, setBtnLoadingStatus] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { seconds, secondsIncrease } = useCountDownSeconds();

    const handleContinueClick = async (data) => {
        setBtnLoadingStatus(true);
        var res = await userService.validateVerificationCodeIsValid(params?.account, data.passCode);
        setBtnLoadingStatus(false);
        if (res && res.code === 200) {
            history.push('/enterNewPass', { params: { account: params?.account, code: data.passCode } });
        }
    }

    const handleResendClick = async () => {
        const res = await userService.sendVerificationCode(params?.account);
        if (res && res.code === 200) {
            secondsIncrease();
        }
    }

    return (
        <AccountContainer>
            <ElTitle>One time password code</ElTitle>
            <form onSubmit={handleSubmit(handleContinueClick)} autoComplete="off">
                <ElInput label="6-digits code" errors={errors} inputProps={{ maxLength: 6, minLength: 6 }}
                    {...register("passCode", {
                        required: { value: true, message: 'Please enter your 6-digits code.' },
                        validate: {
                            rule1: v => validator.isPositiveInteger(v) || 'Please enter your 6-digits code!'
                        },
                    })}
                />
                <ElContent mt={1} center>
                    Problems with Code?<Button variant="text"
                        sx={{ color: '#17C476', textTransform: 'Capitalize' }}
                        disabled={seconds > 0}
                        onClick={handleResendClick}
                    >Resend{seconds > 0 ? `(${60 - seconds})` : ""}</Button>
                </ElContent>
                <Box mt={5}>
                    <ElButton type="submit" loading={btnLoadingStatus}>Continue</ElButton>
                    <ElContent mt={1} center>
                        New to Elyte? <ElLink green to="/register">Sign up for free.</ElLink>
                    </ElContent>
                </Box>
            </form>
        </AccountContainer>
    );
};

export default OneTimePassCode;
