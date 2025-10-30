import React from 'react';
import userService from 'el/api/userService';
import { ElButton, ElContainer, ElErrorMessage, ElInput, ElLink, ElTitle } from 'el/components';
import routes from 'el/navigation/routes';
import { aes, validator } from 'el/utils';
import { Formik } from 'formik';
import { Text } from 'native-base';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { ERROR, PENDING, SUCCESS } from 'el/store/slices/requestSlice';

const validatePasswordMessage =
    'Password length betweent 8 and 18, include alphanumeric and start with letter';

const validationSchema = Yup.object().shape({
    password: Yup.string()
        .required(validatePasswordMessage)
        .matches(validator.strongPasswordPartten, validatePasswordMessage),
    confirmationPassword: Yup.string()
        .required(validatePasswordMessage)
        .oneOf([Yup.ref('password'), null], 'The two passwords you entered did not match'),
});

const initValue = {
    password: '',
    confirmationPassword: '',
};

const EnterNewPassScreen = ({ navigation, route }) => {
    const { account, code } = route.params;
    const dispatch = useDispatch();

    const handlerConfirmClick = async values => {
        dispatch(PENDING());
        var res: any = await userService.resetPassword({
            account: account,
            password: aes.encrypt(values.password).toString(),
            passcode: code,
        });
        if (res && res.code === 200 && res.value) {
            dispatch(SUCCESS());
            navigation.navigate(routes.Login);
        } else {
            dispatch(ERROR());
        }
    };

    return (
        <ElContainer>
            <ElTitle>Confirm the new Password</ElTitle>
            <Formik
                initialValues={initValue}
                validationSchema={validationSchema}
                onSubmit={values => handlerConfirmClick(values)}>
                {({ handleChange, handleSubmit, errors, setFieldTouched, touched, values, isSubmitting }) => (
                    <>
                        <ElInput name="email" isDisabled={true} value={account} />
                        <ElInput
                            name="password"
                            placeholder="Password"
                            secureTextEntry
                            textContentType="password"
                            onBlur={() => setFieldTouched('password')}
                            onChangeText={handleChange('password')}
                            maxLength={18}
                        />
                        <ElErrorMessage error={errors['password']} visible={touched['password']} />

                        <ElInput
                            name="confirmationPassword"
                            placeholder="Confirm Password"
                            secureTextEntry
                            textContentType="password"
                            onBlur={() => setFieldTouched('confirmationPassword')}
                            onChangeText={handleChange('confirmationPassword')}
                            maxLength={18}
                        />
                        <ElErrorMessage
                            error={errors['confirmationPassword']}
                            visible={touched['confirmationPassword']}
                        />

                        <ElButton
                            onPress={handleSubmit}
                            disabled={!values.password || !values.confirmationPassword || isSubmitting}>
                            Submit
                        </ElButton>
                        <Text textAlign="center" mt={2}>
                            New to Elyte? <ElLink to={routes.Register}>Sign up for free</ElLink>
                        </Text>
                    </>
                )}
            </Formik>
        </ElContainer>
    );
};

export default EnterNewPassScreen;
