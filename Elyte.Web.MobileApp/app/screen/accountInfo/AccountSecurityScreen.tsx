import userService from 'el/api/userService';
import { ElButton, ElErrorMessage, ElInput, ElKeyboardAvoidingView, ElTitle } from 'el/components';
import { aes, useElToast, useGoBack, validator } from 'el/utils';
import { Box } from 'native-base';
import React, { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { PENDING, SUCCESS } from 'el/store/slices/requestSlice';

const validatePasswordMessage =
    'Password length betweent 8 and 18, include alphanumeric and start with letter';

const validationSchema = Yup.object().shape({
    oldPassword: Yup.string()
        .required(validatePasswordMessage)
        .matches(validator.strongPasswordPartten, validatePasswordMessage),
    newPassword: Yup.string()
        .required(validatePasswordMessage)
        .matches(validator.strongPasswordPartten, validatePasswordMessage),
    confirmationNewPassword: Yup.string()
        .required(validatePasswordMessage)
        .oneOf([Yup.ref('newPassword'), null], 'The two passwords you entered did not match'),
});

const initValue = {
    oldPassword: '',
    newPassword: '',
    confirmationNewPassword: '',
};

export default function AccountSecurityScreen({ navigation }) {
    useGoBack();
    const [changePasswordError, setchangePasswordError] = useState('');
    const dispatch = useDispatch();
    const toast = useElToast();

    const handlerChangePassword = async data => {
        dispatch(PENDING());
        const res: any = await userService.updatePassword({
            ...data,
            oldPassword: aes.encrypt(data.oldPassword).toString(),
            newPassword: aes.encrypt(data.newPassword).toString(),
            confirmationNewPassword: aes.encrypt(data.confirmationNewPassword).toString(),
        });
        dispatch(SUCCESS());

        if (res && res.code === 200) {
            toast.success('Change password successfully');
            return navigation.goBack();
        }

        if (res && res.Code === 400) {
            return setchangePasswordError(res.Message);
        }

        setchangePasswordError('Change password unsuccessfully, please try again later.');
    };

    return (
        <ElKeyboardAvoidingView withOffset>
            <ElTitle>Change Your Password</ElTitle>
            <Formik
                initialValues={initValue}
                validationSchema={validationSchema}
                onSubmit={values => handlerChangePassword(values)}>
                {({ handleChange, handleSubmit, errors, setFieldTouched, touched, isSubmitting }) => (
                    <>
                        <ElInput
                            name="oldPassword"
                            placeholder="Old Password"
                            secureTextEntry
                            textContentType="password"
                            onBlur={() => setFieldTouched('oldPassword')}
                            onChangeText={handleChange('oldPassword')}
                            maxLength={18}
                        />
                        <ElErrorMessage
                            error={errors['oldPassword']}
                            visible={touched['oldPassword']}
                        />

                        <ElInput
                            name="newPassword"
                            placeholder="New Password"
                            secureTextEntry
                            textContentType="password"
                            onBlur={() => setFieldTouched('newPassword')}
                            onChangeText={handleChange('newPassword')}
                            maxLength={18}
                        />
                        <ElErrorMessage
                            error={errors['newPassword']}
                            visible={touched['newPassword']}
                        />

                        <ElInput
                            name="confirmationNewPassword"
                            placeholder="Confirm New Password"
                            secureTextEntry
                            textContentType="password"
                            onBlur={() => setFieldTouched('confirmationNewPassword')}
                            onChangeText={handleChange('confirmationNewPassword')}
                            maxLength={18}
                        />
                        <ElErrorMessage
                            error={errors['confirmationNewPassword']}
                            visible={touched['confirmationNewPassword']}
                        />

                        {changePasswordError && (
                            <Box pl={2}>
                                <ElErrorMessage error={changePasswordError} visible={true} />
                            </Box>
                        )}

                        <ElButton onPress={handleSubmit} disabled={isSubmitting}>Save</ElButton>
                    </>
                )}
            </Formik>
        </ElKeyboardAvoidingView>
    );
}
