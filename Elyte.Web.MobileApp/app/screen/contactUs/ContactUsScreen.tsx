import userService from 'el/api/userService';
import { ElButton, ElContainer, ElErrorMessage, ElInput, ElTextarea, ElTitle } from 'el/components';
import { ERROR, PENDING, SUCCESS } from 'el/store/slices/requestSlice';
import { useElToast } from 'el/utils';
import { Formik } from 'formik';
import { Text } from 'native-base';
import React from 'react';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
    email: Yup.string().required().max(100).email().label('Email'),
    subject: Yup.string().required().max(100).label('Subject'),
    message: Yup.string().required().max(250).label('Message'),
});

export default function ContactUsScreen({ navigation }) {
    const toast = useElToast();
    const dispatch = useDispatch();

    const initValue = {
        email: '',
        subject: '',
        message: '',
    };

    const handleSubmitClick = async values => {
        dispatch(PENDING());
        const res: any = await userService.addContactUs(values);
        if (res && res.code === 200) {
            dispatch(SUCCESS());
            navigation.goBack();
            toast.success('Submit successfully!');

        } else {
            dispatch(ERROR());
        }
    };

    return (
        <ElContainer>
            <ElTitle>Contact Us</ElTitle>
            <Formik
                initialValues={initValue}
                validationSchema={validationSchema}
                onSubmit={values => handleSubmitClick(values)}>
                {({ handleChange, handleSubmit, errors, setFieldTouched, touched, isSubmitting }) => (
                    <>
                        <ElInput
                            name="email"
                            placeholder="Contact Email"
                            keyboardType="email-address"
                            textContentType="emailAddress"
                            onBlur={() => setFieldTouched('email')}
                            onChangeText={handleChange('email')}
                            maxLength={100}
                        />
                        <ElErrorMessage error={errors['email']} visible={touched['email']} />

                        <ElInput
                            name="subject"
                            placeholder="Subject"
                            onBlur={() => setFieldTouched('subject')}
                            onChangeText={handleChange('subject')}
                            maxLength={100}
                        />
                        <ElErrorMessage error={errors['subject']} visible={touched['subject']} />

                        <ElTextarea
                            name="message"
                            onChangeText={handleChange('message')}
                            placeholder="Message"
                            maxLength={250}
                        />
                        <ElErrorMessage error={errors['message']} visible={touched['message']} />

                        <ElButton onPress={handleSubmit} style={{ marginBottom: 8 }} disabled={isSubmitting}>
                            Submit
                        </ElButton>
                    </>
                )}
            </Formik>

            <Text textAlign="center">Or you can text to us directly via email:</Text>
            <Text textAlign="center" color="#2283F4">
                contact@elyte.com
            </Text>
        </ElContainer>
    );
}
