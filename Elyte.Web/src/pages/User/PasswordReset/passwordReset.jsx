import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, FormHelperText } from '@mui/material';
import { ElButton, ElTitle, ElContent, ElLink, AccountContainer, ElInput } from 'components';
import { useForm } from "react-hook-form";
import { userService } from 'services';


const PasswordReset = () => {
    const history = useHistory();
    const [btnLoadingStatus, setBtnLoadingStatus] = useState(false);
    const [error, setError] = useState("");
    const { register, handleSubmit, formState: { errors } } = useForm();

    const handleContinueClick = async (data) => {
        setError("");
        setBtnLoadingStatus(true);
        const res = await userService.checkUserAccountIsExistence(data.account)
        setBtnLoadingStatus(false);
        if (res && res.code === 200 && res.value) {
            return history.push('/verification', { params: { email: res.value.email, phoneNumber: res.value.phoneNumber } });
        }

        setError("Your account does not exist, please check!");
    }

    return (
        <AccountContainer>
            <ElTitle>Password Reset</ElTitle>
            <form onSubmit={handleSubmit(handleContinueClick)} autoComplete="off">
                <ElInput label="Enter your email or phone number" errors={errors}
                    {...register("account", { required: { value: true, message: 'Please enter your email or phone number.' } })}
                />
                <ElContent mt={1} center>
                    Have any problem with reset? <ElLink green to="/contactUs">Contact us</ElLink>
                </ElContent>
                <Box mt={5}>
                    <ElButton type="submit" loading={btnLoadingStatus}>Continue</ElButton>
                    {error && <FormHelperText className='mb-8' error>{error}</FormHelperText>}
                    <ElContent mt={1} center>
                        New to Elyte? <ElLink green to="/register">Sign up for free.</ElLink>
                    </ElContent>
                </Box>
            </form>
        </AccountContainer>
    );
};

export default PasswordReset;
