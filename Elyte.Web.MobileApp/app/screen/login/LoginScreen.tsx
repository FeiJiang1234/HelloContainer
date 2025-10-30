import React, { useState } from 'react';
import { authService } from 'el/api';
import { ElContainer, ElLink, ElTitle } from 'el/components';
import { useAuth, aes, useSignalR } from 'el/utils';
import LoginForm from './components/LoginForm';
import routes from 'el/navigation/routes';
import { LoginCommand } from 'el/models/auth/loginCommand';
import { LoginResult } from 'el/models/auth/loginResult';
import { ResponseResult } from 'el/models/responseResult';
import { Text } from 'native-base';
import { useDispatch } from 'react-redux';
import { ERROR, PENDING, SUCCESS } from 'el/store/slices/requestSlice';

export default function LoginScreen() {
    const { login } = useAuth();
    const { open } = useSignalR();
    const [loginError, setLoginError] = useState('');
    const dispatch = useDispatch();

    const handleLogin = async (command: LoginCommand) => {
        setLoginError('');
        dispatch(PENDING());
        const data = {
            account: command.account,
            password: aes.encrypt(command.password),
            isMobile: true,
        }
        const res: ResponseResult<LoginResult> = await authService.login(data);
        if (res && res.code === 200) {
            login(res.value.token);
            open();
            dispatch(SUCCESS());
        } else {
            dispatch(ERROR());
            setLoginError(res?.Message);
        }
    };

    return (
        <ElContainer>
            <ElTitle>Account Login</ElTitle>
            <LoginForm onSubmit={handleLogin} loginError={loginError} />
            <Text textAlign="center">
                New to Elyte? <ElLink to={routes.Register}>Sign up for free</ElLink>
            </Text>
        </ElContainer>
    );
}
