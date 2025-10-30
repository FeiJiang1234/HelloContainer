import React from 'react';
import { Formik } from 'formik';
import { ElButton, ElErrorMessage, ElInput, ElLink } from 'el/components';
import routes from 'el/navigation/routes';
import * as Yup from 'yup';
import { validator } from 'el/utils';
import { Text } from 'native-base';

const validatePasswordMessage =
    'Password length betweent 8 and 18, include alphanumeric and start with letter';

const validationSchema = Yup.object().shape({
    account: Yup.string().required('Please enter your account.'),
    password: Yup.string()
        .required(validatePasswordMessage)
        .matches(validator.strongPasswordPartten, validatePasswordMessage),
});

const initValue = {
    account: '',
    password: '',
};

export default function LoginForm({ onSubmit, loginError }) {
    return (
        <Formik
            initialValues={initValue}
            validationSchema={validationSchema}
            onSubmit={values => onSubmit(values)}>
            {({ handleChange, handleSubmit, errors, setFieldTouched, touched,isSubmitting }) => (
                <>
                    <ElInput
                        name="account"
                        placeholder="Email or Phone number"
                        keyboardType="email-address"
                        textContentType="emailAddress"
                        onBlur={() => setFieldTouched('account')}
                        onChangeText={handleChange('account')}
                        maxLength={100}
                    />
                    <ElErrorMessage error={errors['account']} visible={touched['account']} />

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

                    <Text textAlign="center" my={2}>
                        Forgot the password? Request for a{' '}
                        <ElLink to={routes.ResetPassword}>Password Reset</ElLink> or{' '}
                        <ElLink to={routes.ContactUs}>Contact us</ElLink>
                    </Text>

                    <ElErrorMessage error={loginError} visible={loginError} />
                    <ElButton onPress={handleSubmit} style={{ marginBottom: 8 }} disabled={isSubmitting}>
                        Sign in
                    </ElButton>
                </>
            )}
        </Formik>
    );
}
