import { athleteService } from 'el/api';
import userService from 'el/api/userService';
import { ElButton, ElErrorMessage, ElInput, ElKeyboardAvoidingView, ElTitle } from 'el/components';
import routes from 'el/navigation/routes';
import { ERROR, PENDING, SUCCESS } from 'el/store/slices/requestSlice';
import { useAuth, useCountDownSeconds, useElToast, useGoBack } from 'el/utils';
import { Formik } from 'formik';
import { Text } from 'native-base';
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';

const validationPhoneNumber = Yup.object().shape({
    phoneNumber: Yup.string().required().min(5).max(11).label('Phone Number'),
});

const validationSecurityCode = Yup.object().shape({
    securityCode: Yup.string().required().max(6).label('Security Code'),
});

export default function ChangePhoneNumberScreen({ navigation }) {
    useGoBack();
    const { user } = useAuth();
    const [showCodeBox, setShowCodeBox] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>();
    const [phoneNumber, setPhoneNumber] = useState('');
    const dispatch = useDispatch();
    const toast = useElToast();
    const { seconds, secondsIncrease } = useCountDownSeconds();

    useEffect(() => {
        getAthletecurrentUser();
    }, []);

    const handleChangePhone = async data => {
        dispatch(PENDING());
        let params = { userId: currentUser?.id, phoneNumber: phoneNumber, ...data };
        const res: any = await userService.resetPhoneNumber(params);
        if (res && res.code === 200) {
            dispatch(SUCCESS());
            toast.success('Change phone number successfully.');
            navigation.navigate(routes.MyProfile);
        } else {
            toast.error(res.Message);
            dispatch(ERROR());
        }
    };

    const getAthletecurrentUser = async () => {
        const res = await athleteService.getAthleteById(user.id);
        if (res && res.code === 200) setCurrentUser(res.value);
    };

    const getVerifyCode = async values => {
        dispatch(PENDING());
        setShowCodeBox(false);
        const res: any = await userService.sendPhoneCode({ phoneNumber: values.phoneNumber });
        if (res && res.code === 200) {
            setPhoneNumber(values.phoneNumber);
            dispatch(SUCCESS());
            secondsIncrease();
            setShowCodeBox(true);
        } else {
            dispatch(ERROR());
        }
    };

    return (
        <ElKeyboardAvoidingView withOffset>
            <ElTitle>Change Phone Number</ElTitle>
            <Text textAlign="center">Your current phone number is {currentUser?.phoneNumber}.</Text>

            <Formik
                initialValues={{ phoneNumber: '' }}
                validationSchema={validationPhoneNumber}
                onSubmit={values => getVerifyCode(values)}>
                {({ handleChange, handleSubmit, errors, setFieldTouched, touched,isSubmitting }) => (
                    <>
                        <ElInput
                            name="phoneNumber"
                            placeholder="New Phone Number"
                            keyboardType="numeric"
                            onBlur={() => setFieldTouched('phoneNumber')}
                            onChangeText={handleChange('phoneNumber')}
                            maxLength={11}
                        />

                        <ElErrorMessage
                            error={errors['phoneNumber']}
                            visible={touched['phoneNumber']}
                        />

                        <ElButton onPress={handleSubmit} disabled={seconds > 0 || isSubmitting} >
                            {seconds > 0 ? `Resend (${60 - seconds})` : 'Send'}
                        </ElButton>
                    </>
                )}
            </Formik>

            {showCodeBox && (
                <Formik
                    initialValues={{ securityCode: '' }}
                    validationSchema={validationSecurityCode}
                    onSubmit={values => handleChangePhone(values)}>
                    {({ handleChange, handleSubmit, errors, setFieldTouched, touched,isSubmitting }) => (
                        <>
                            <ElInput
                                name="securityCode"
                                placeholder="Code"
                                keyboardType="numeric"
                                onBlur={() => setFieldTouched('securityCode')}
                                onChangeText={handleChange('securityCode')}
                                maxLength={6}
                            />

                            <ElErrorMessage error={errors['securityCode']} visible={touched['securityCode']} />

                            <ElButton onPress={handleSubmit} disabled={isSubmitting}>Save</ElButton>
                        </>
                    )}
                </Formik>
            )}
        </ElKeyboardAvoidingView>
    );
}
