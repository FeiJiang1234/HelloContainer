import { Box, Radio } from 'native-base';
import React, { useState } from 'react';
import { athleteService, userService } from 'el/api';
import {
    ElBody,
    ElButton,
    ElContainer,
    ElErrorMessage,
    ElInput,
    ElRadio,
    ElTitle,
} from 'el/components';
import { useAuth, useElToast, useGoBack } from 'el/utils';
import { useDispatch } from 'react-redux';
import _ from 'lodash';
import { ERROR, PENDING, SUCCESS } from 'el/store/slices/requestSlice';
import { Formik } from 'formik';
import * as Yup from 'yup';
import colors from 'el/config/colors';

const validationSchema = Yup.object().shape({
    passCode: Yup.string().length(6, 'Please enter your 6-digits code.'),
});

const initValue = {
    passCode: '',
};

export default function DeleteAccountScreen({ navigation, route }) {
    useGoBack();
    const { user, logout } = useAuth();
    const { email, phoneNumber } = route.params;
    const [account, setAccount] = useState('');
    const [isSendingCode, setIsSendingCode] = useState(false);
    const dispatch = useDispatch();
    const toast = useElToast();

    const handleDeleteAccount = async values => {
        dispatch(PENDING());
        const res: any = await athleteService.deleteAccount(user.id, values.passCode);
        dispatch(SUCCESS());

        if (res && res.code === 200) {
            toast.success('Delete account successfully.');
            logout();
        }
        else{
            toast.error(res.Message);
        }
    };

    const handleVerifiyClick = async () => {
        dispatch(PENDING());
        const res: any = await userService.sendVerificationCode(account);
        dispatch(SUCCESS());
        if (res && res.code === 200) {
            setIsSendingCode(true);
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
            <ElTitle>Delete account</ElTitle>
            <ElBody style={{ textAlign: 'center', marginBottom: 16, color: colors.danger }}>
                This cannot be undone! Be sure you want to delete your account.
            </ElBody>
            {
                !isSendingCode &&
                <>
                    <Radio.Group name="verifyType" value={account} onChange={setAccount}>
                        <ElRadio value={phoneNumber}>
                            <Box p={2}>Get a code texted on {encryptionPhone(phoneNumber ?? '')}</Box>
                        </ElRadio>
                        <ElRadio value={email}>
                            <Box p={2}>Get a code emailed to: {encryptionEmail(email ?? '')}</Box>
                        </ElRadio>
                    </Radio.Group>
                    <ElButton onPress={handleVerifiyClick} disabled={!account}>
                        Send
                    </ElButton>
                </>
            }
            {
                isSendingCode &&
                <Formik
                    initialValues={initValue}
                    validationSchema={validationSchema}
                    onSubmit={values => handleDeleteAccount(values)}>
                    {({ handleChange, handleSubmit, errors, setFieldTouched, touched, values }) => (
                        <>
                            <ElInput
                                name="passCode"
                                keyboardType="numeric"
                                placeholder="6-digits code"
                                onBlur={() => setFieldTouched('passCode')}
                                onChangeText={handleChange('passCode')}
                                maxLength={6}
                            />
                            <ElErrorMessage error={errors['passCode']} visible={touched['passCode']} />
                            <ElButton onPress={handleSubmit} disabled={!values.passCode}>
                                Confirm
                            </ElButton>
                        </>
                    )}
                </Formik>

            }
        </ElContainer>
    );
}
