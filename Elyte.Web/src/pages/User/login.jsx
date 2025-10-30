import React, { useState, useContext } from 'react';
import { useHistory, } from 'react-router-dom';
import { Box, FormHelperText } from '@mui/material';
import { ElButton, ElLink, AccountContainer, ElTitle, ElContent, ElInput } from 'components';
import { useDispatch } from 'react-redux';
import { useForm } from "react-hook-form";
import { authService } from 'services';
import { UserConstants } from '../../store/actions';
import { validator, aes } from 'utils';
import { AppActions } from '../../store/reducers/app.reducer';
import { AppContext } from '../../App';


const Login = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { dispatch: appDispatch } = useContext(AppContext);
    const [loadingStatus, setLoadingStatus] = useState(false);
    const [loginError, setLoginError] = useState("");
    const { register, handleSubmit, trigger, formState: { errors } } = useForm();

    const handlerLoginClick = async (data) => {
        setLoginError("");
        setLoadingStatus(true);
        data.password = aes.encrypt(data.password);
        const res = await authService.login(data);
        setLoadingStatus(false);
        if (res && res.code === 200) {
            dispatch({ type: UserConstants.LOGIN, payload: { user: res?.value } });
            appDispatch({ type: AppActions.RefreshAlarmQueue });
            return history.push('/');
        }else{
            return setLoginError(res?.Message);
        }
    }

    return (
        <AccountContainer hideGoBack>
            <ElTitle>Account Login</ElTitle>
            <form onSubmit={handleSubmit(handlerLoginClick)} autoComplete="off">
                <ElInput label="Email or Phone Number" errors={errors}
                    {...register("account", {
                        required: { value: true, message: 'Please enter your account.' },
                        onChange: () => setLoginError("")
                    })}
                />
                <ElInput label="Password" type="password" errors={errors}
                    {...register("password", {
                        required: { message: 'Please enter your password.' },
                        validate: { rule1: v => validator.isStrongPassword(v) || 'Password length betweent 8 and 18, include alphanumeric and start with letter!' },
                        onBlur: () => trigger('password'),
                        onChange: () => setLoginError("")
                    })}
                />
                <ElContent center mt={1}>
                    Forgot your password? You can do a <ElLink green to="/passwordReset">Password Reset</ElLink> or <ElLink green to="/contactUs">Contact Us</ElLink> for help.
                </ElContent>
                <span className="fillRemain"></span>
                <Box mb={5}>
                    {loginError && <FormHelperText className='mb-8' error>{loginError}</FormHelperText>}
                    <ElButton type="submit" loading={loadingStatus}>Sign In</ElButton>
                    <ElContent center mt={1}>
                        New to Elyte? <ElLink green to="/register">Sign up for free.</ElLink>
                    </ElContent>
                </Box>
            </form>
        </AccountContainer>
    );
};

export default Login;
