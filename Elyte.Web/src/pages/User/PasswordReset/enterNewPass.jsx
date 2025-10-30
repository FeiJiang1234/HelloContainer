import React, { useState } from 'react';
import { Box } from '@mui/material';
import { ElButton, ElInput, AccountContainer, ElTitle, ElContent, ElLink } from 'components';
import { useForm } from "react-hook-form";
import { validator, aes } from 'utils';
import { useHistory, useLocation } from 'react-router';
import { userService } from 'services';


const EnterNewPass = () => {
    const history = useHistory();
    const location = useLocation();
    const params = location.state?.params;
    const [btnLoadingStatus, setBtnLoadingStatus] = useState(false);
    const { register, handleSubmit, getValues, trigger, formState: { errors } } = useForm();

    const handlerConfirmClick = async e => {
        setBtnLoadingStatus(true);
        var res = await userService.resetPassword({
            account: params.account,
            password: aes.encrypt(e.password).toString(),
            passcode: params.code,
        });
        setBtnLoadingStatus(false);

        if (res && res.code === 200 && res.value) {
            history.push('/login');
        }
    };

    return (
        <AccountContainer>
            <ElTitle>Confirm the new Password</ElTitle>
            <form onSubmit={handleSubmit(handlerConfirmClick)} autoComplete="off">
                <ElInput name="email" disabled value={params.account} />
                <ElInput label="Password" type="password" errors={errors}
                    {...register("password", {
                        required: { value: true, message: 'Please enter your password.' },
                        validate: {
                            rule1: v => validator.isStrongPassword(v) || 'Password length betweent 8 and 18, include alphanumeric and start with letter!'
                        },
                        onBlur: () => trigger('password')
                    })}
                />
                <ElInput label="Confirm Password" type="password" errors={errors}
                    {...register("confirmationPassword", {
                        required: { value: true, message: 'Please enter your password again.' },
                        validate: {
                            rule1: v => v === getValues("password") || 'The two passwords you entered did not match!'
                        },
                        onBlur: () => trigger('confirmationPassword')
                    })}
                />
                <Box mt={5}>
                    <ElButton type="submit" loading={btnLoadingStatus}>Submit</ElButton>
                    <ElContent mt={1} center>
                        New to Elyte? <ElLink green to="/register">Sign up for free.</ElLink>
                    </ElContent>
                </Box>
            </form>
        </AccountContainer>
    );
};

export default EnterNewPass;
