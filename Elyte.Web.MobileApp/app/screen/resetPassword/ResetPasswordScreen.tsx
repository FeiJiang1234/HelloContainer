import userService from 'el/api/userService';
import { ElButton, ElContainer, ElErrorMessage, ElInput, ElLink, ElTitle } from 'el/components';
import routes from 'el/navigation/routes';
import { ERROR, PENDING, SUCCESS } from 'el/store/slices/requestSlice';
import { Formik } from 'formik';
import { Text } from 'native-base';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
    account: Yup.string().max(100).required('Please enter your email or phone number.'),
});

const initValue = {
    account: '',
};

export default function ResetPasswordScreen({ navigation, route }) {
    const [error, setError] = useState('');
    const dispatch = useDispatch();

    const handleContinueClick = async values => {
        setError('');
        dispatch(PENDING());
        const res: any = await userService.checkUserAccountIsExistence(values.account);
        if (res && res.code === 200 && res.value) {
            dispatch(SUCCESS());
            navigation.navigate(routes.VerificationCode, {
                email: res.value.email,
                phoneNumber: res.value.phoneNumber,
            });
        } else {
            dispatch(ERROR());
            setError('Your account does not exist, please check!');
        }
    };

    return (
        <ElContainer>
            <ElTitle>Password Reset</ElTitle>
            <Formik
                initialValues={initValue}
                validationSchema={validationSchema}
                onSubmit={values => handleContinueClick(values)}>
                {({ handleChange, handleSubmit, setFieldTouched, values, isSubmitting }) => (
                    <>
                        <ElInput
                            name="account"
                            placeholder="Enter your email or phone number"
                            onBlur={() => setFieldTouched('account')}
                            onChangeText={handleChange('account')}
                            maxLength={100}
                        />
                        <ElErrorMessage error={error} visible={error} />

                        <Text textAlign="center" my={2}>
                            Have any problem with reset?{' '}
                            <ElLink to={routes.ContactUs}>Contact us</ElLink>
                        </Text>
                        <ElButton onPress={handleSubmit} disabled={!values.account || isSubmitting}>Continue</ElButton>
                        <Text textAlign="center" mt={2}>
                            New to Elyte? <ElLink to={routes.Register}>Sign up for free</ElLink>
                        </Text>
                    </>
                )}
            </Formik>
        </ElContainer>
    );
}
