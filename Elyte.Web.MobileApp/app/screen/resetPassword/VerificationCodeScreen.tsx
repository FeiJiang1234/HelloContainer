import React, { useState } from 'react';
import { ElButton, ElContainer, ElLink, ElRadio, ElTitle } from 'el/components';
import userService from 'el/api/userService';
import { useDispatch } from 'react-redux';
import { ERROR, PENDING, SUCCESS } from 'el/store/slices/requestSlice';
import routes from 'el/navigation/routes';
import { Box, Radio, Text } from 'native-base';

export default function VerificationCodeScreen({ navigation, route }) {
    const { email, phoneNumber } = route.params;
    const [account, setAccount] = useState('');
    const dispatch = useDispatch();

    const handleVerifiyClick = async () => {
        dispatch(PENDING());
        const res: any = await userService.sendVerificationCode(account);
        if (res && res.code === 200) {
            dispatch(SUCCESS());
            navigation.navigate(routes.OneTimePassCode, {
                account: account,
            });
        } else {
            dispatch(ERROR());
        }
    };

    const encryptionEmail = v => {
        var cbData = v.split('');
        cbData.splice(1, v.indexOf('@') - 2, '****');
        return cbData.join('');
    };

    const encryptionPhone = v => {
        var cbData = v.split('');
        cbData.splice(3, v.length - 7, '****');
        return cbData.join('');
    };

    return (
        <ElContainer>
            <ElTitle>Verification Code</ElTitle>
            <Radio.Group name="verifyType" value={account} onChange={setAccount}>
                <ElRadio value={phoneNumber}>
                    <Box p={2}>Get a code texted on {encryptionPhone(phoneNumber ?? '')}</Box>
                </ElRadio>
                <ElRadio value={email}>
                    <Box p={2}>Get a code emailed to: {encryptionEmail(email ?? '')}</Box>
                </ElRadio>
            </Radio.Group>
            <ElButton onPress={handleVerifiyClick} disabled={!account}>
                Continue
            </ElButton>
            <Text textAlign="center" mt={2}>
                New to Elyte? <ElLink to={routes.Register}>Sign up for free</ElLink>
            </Text>
        </ElContainer>
    );
}
