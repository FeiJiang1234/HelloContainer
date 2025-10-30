import React, { useState } from 'react';
import userService from 'el/api/userService';
import { ElKeyboardAvoidingView, ElTitle } from 'el/components';
import { useAuth } from 'el/utils';
import { LoginResult } from 'el/models/auth/loginResult';
import { RegisterCommand } from 'el/models/auth/registerCommand';
import { ResponseResult } from 'el/models/responseResult';
import { aes } from 'el/utils';
import RegisterForm from './components/RegisterForm';
import { ERROR, PENDING, SUCCESS } from 'el/store/slices/requestSlice';
import { useDispatch } from 'react-redux';
import { Box } from 'native-base';

export default function RegisterScreen() {
    const { login } = useAuth();
    const [registerError, setRegisterError] = useState('');
    const dispatch = useDispatch();

    const handleRegister = async (command: RegisterCommand) => {
        setRegisterError('');
        dispatch(PENDING());
        const data = {
            ...command,
            password: aes.encrypt(command.password),
            confirmationPassword: aes.encrypt(command.confirmationPassword),
            isMobile: true,
        };
        const res: ResponseResult<LoginResult> = await userService.register(data);
        if (res && res.code === 200) {
            login(res.value.token, true);
            dispatch(SUCCESS());
        } else {
            dispatch(ERROR());
            const errMessage =
            res && res.code === 400
                ? res.Message
                : 'Oh Sorry! We seem to be having some issues. Please try again.';
        setRegisterError(errMessage);
        }
    };

    return (
        <ElKeyboardAvoidingView withOffset>
            <ElTitle>Account Registration</ElTitle>
            <RegisterForm onSubmit={handleRegister} registerError={registerError} />
            <Box h={2}></Box>
        </ElKeyboardAvoidingView>
    );
}
