import userService from 'el/api/userService';
import {
    ElButton,
    ElContainer,
    ElErrorMessage,
    ElInput,
    ElLink,
    ElLinkBtn,
    ElTitle,
} from 'el/components';
import React, { useState } from 'react';
import routes from 'el/navigation/routes';
import { ERROR, PENDING, SUCCESS } from 'el/store/slices/requestSlice';
import { Formik } from 'formik';
import { Text } from 'native-base';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import colors from 'el/config/colors';
import { useCountDownSeconds } from 'el/utils';

const validationSchema = Yup.object().shape({
    passCode: Yup.string().length(6, 'Please enter your 6-digits code.'),
});

const initValue = {
    passCode: '',
};

const OneTimePassCodeScreen = ({ navigation, route }) => {
    const { account } = route.params;
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const { seconds, secondsIncrease } = useCountDownSeconds();

    const handleContinueClick = async data => {
        setError('');
        dispatch(PENDING());
        var res: any = await userService.validateVerificationCodeIsValid(account, data.passCode);
        if (res && res.code === 200) {
            dispatch(SUCCESS());
            navigation.navigate(routes.EnterNewPass, { account: account, code: data.passCode });
        } else {
            dispatch(ERROR());
            setError(res.Message);
        }
    };

    const handleResendClick = async () => {
        dispatch(PENDING());
        const res: any = await userService.sendVerificationCode(account);
        if (res && res.code === 200) {
            dispatch(SUCCESS());
            secondsIncrease();
        } else {
            dispatch(ERROR());
        }
    };

    return (
        <ElContainer>
            <ElTitle>One time password code</ElTitle>
            <Formik
                initialValues={initValue}
                validationSchema={validationSchema}
                onSubmit={values => handleContinueClick(values)}>
                {({ handleChange, handleSubmit, errors, setFieldTouched, touched, values, isSubmitting }) => (
                    <>
                        <ElInput
                            name="passCode"
                            keyboardType="numeric"
                            placeholder="6-digits code"
                            onBlur={() => setFieldTouched('passCode')}
                            onChangeText={handleChange('passCode')}
                            maxLength={6}
                        />
                        <ElErrorMessage
                            error={errors['passCode'] ?? error}
                            visible={touched['passCode']}
                        />

                        <Text textAlign="center" my={2}>
                            Problems with Code?{' '}
                            <ElLinkBtn
                                style={{
                                    color: seconds !== 0 ? colors.disabled : colors.secondary,
                                }}
                                onPress={() => seconds === 0 && handleResendClick()}>
                                Resend{seconds > 0 ? `(${60 - seconds})` : ''}
                            </ElLinkBtn>
                        </Text>

                        <ElButton onPress={handleSubmit} disabled={!values.passCode || isSubmitting}>
                            Continue
                        </ElButton>
                    </>
                )}
            </Formik>
            <Text textAlign="center" mt={2}>
                New to Elyte? <ElLink to={routes.Register}>Sign up for free</ElLink>
            </Text>
        </ElContainer>
    );
};

export default OneTimePassCodeScreen;
