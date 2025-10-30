import React, { useState } from 'react';
import { Formik } from 'formik';
import {
    ElButton,
    ElCheckbox,
    ElDatePicker,
    ElInput,
    ElLink,
    ElSelectEx,
    ElErrorMessage,
} from 'el/components';
import routes from 'el/navigation/routes';
import * as Yup from 'yup';
import { validator } from 'el/utils';
import { Box } from 'native-base';
import RegionCascader from 'el/components/RegionCascader';
import { SportType } from 'el/enums';

const validatePasswordMessage =
    'Password length betweent 8 and 18, include alphanumeric and start with letter';
const LIMITED_AGE = 13 * 365 * 24 * 60 * 60 * 1000;
const MAX_DATE = new Date().getTime() - LIMITED_AGE;

const validationSchema = Yup.object().shape({
    firstName: Yup.string().required().max(20).label('First Name'),
    lastName: Yup.string().required().max(20).label('Last Name'),
    email: Yup.string().required().max(100).email().label('Email'),
    phoneNumber: Yup.string().required().max(11).label('Phone Number'),
    gender: Yup.string().required().label('Gender'),
    birthday: Yup.date()
        .max(new Date(MAX_DATE), 'Birthdate does not meet the requirements')
        .label('Birthday'),
    password: Yup.string()
        .required(validatePasswordMessage)
        .matches(validator.strongPasswordPartten, validatePasswordMessage),
    confirmationPassword: Yup.string().oneOf(
        [Yup.ref('password'), null],
        'The two passwords you entered did not match',
    ),
    ...validator.address,
    sportType:Yup.string().required().label('Sport Type'),
});

const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
];
const sportTypes = Object.keys(SportType).map(typeName => { return { label: typeName, value: SportType[typeName] } });

export default function RegisterForm({ onSubmit, registerError }) {
    const date13YrsAgo = new Date();
    date13YrsAgo.setFullYear(date13YrsAgo.getFullYear() - 13);

    const initValue = {
        firstName: '',
        lastName: '',
        email: '',
        gender: '',
        birthday: date13YrsAgo,
        phoneNumber: '',
        password: '',
        confirmationPassword: '',
        country: '',
        state: '',
        city: '',
        sportType: '',
    };

    const [agreeTerms, setAgreeTerms] = useState(false);
    const [showBlankCode, setShowBlankCode] = useState(false);

    return (
        <Formik
            initialValues={initValue}
            validationSchema={validationSchema}
            onSubmit={values => onSubmit(values)}>
            {({
                handleChange,
                handleSubmit,
                errors,
                setFieldTouched,
                touched,
                setFieldValue,
                values,
                isSubmitting
            }) => (
                <>
                    <ElInput
                        name="firstName"
                        placeholder="First Name"
                        onBlur={() => setFieldTouched('firstName')}
                        onChangeText={handleChange('firstName')}
                        maxLength={20}
                    />
                    <ElErrorMessage error={errors['firstName']} visible={touched['firstName']} />

                    <ElInput
                        name="lastName"
                        placeholder="Last Name"
                        onBlur={() => setFieldTouched('lastName')}
                        onChangeText={handleChange('lastName')}
                        maxLength={20}
                    />
                    <ElErrorMessage error={errors['lastName']} visible={touched['lastName']} />

                    <ElInput
                        name="email"
                        placeholder="Email"
                        keyboardType="email-address"
                        textContentType="emailAddress"
                        onBlur={() => setFieldTouched('email')}
                        onChangeText={handleChange('email')}
                        maxLength={100}
                    />
                    <ElErrorMessage error={errors['email']} visible={touched['email']} />

                    <ElInput
                        name="phoneNumber"
                        keyboardType="numeric"
                        placeholder="Phone Number"
                        onBlur={() => setFieldTouched('phoneNumber')}
                        onChangeText={handleChange('phoneNumber')}
                        maxLength={11}
                    />
                    <ElErrorMessage error={errors['phoneNumber']} visible={touched['phoneNumber']} />

                    <ElSelectEx
                        items={genderOptions}
                        name="gender"
                        onValueChange={value => setFieldValue('gender', value)}
                        placeholder="Gender"
                    />
                    <ElErrorMessage error={errors['gender']} visible={touched['gender']} />

                    <ElSelectEx
                        items={sportTypes}
                        name="sportType"
                        onValueChange={value => setFieldValue('sportType', value)}
                        placeholder="Preferred Sport"
                    />
                    <ElErrorMessage error={errors['sportType']} visible={touched['sportType']} />

                    <ElDatePicker
                        name="birthday"
                        placeholder="Birthday"
                        onSelectedDate={item => setFieldValue('birthday', item)}
                        defaultValue={date13YrsAgo}
                    />
                    <ElErrorMessage error={errors['birthday']} visible={true} />

                    <RegionCascader
                        setFieldValue={setFieldValue}
                        touched={touched}
                        errors={errors}
                        values={values}
                    />

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
                    <ElErrorMessage error={errors['confirmationPassword']} visible={touched['confirmationPassword']} />
                    <Box my={2}>
                        <ElCheckbox value={agreeTerms} onValueChange={setAgreeTerms}>
                            {'By creating an account you agree to\nour '}
                            <ElLink to={routes.TermsOfService}>Terms of Service</ElLink> and{' '}
                            <ElLink to={routes.PrivacyPolicy}>Privacy Policy</ElLink>
                        </ElCheckbox>
                    </Box>
                    <ElErrorMessage error={registerError} visible={registerError} />
                    <ElButton
                        onPress={handleSubmit}
                        disabled={!agreeTerms || isSubmitting}
                        style={{ marginBottom: 8 }}>
                        Create an account
                    </ElButton>

                    <ElCheckbox value={showBlankCode} onValueChange={setShowBlankCode}>
                        Have a blank account code?
                    </ElCheckbox>
                    {showBlankCode && (
                        <ElInput
                            name="blankAccountCode"
                            placeholder="Blank Account Code"
                            onBlur={() => setFieldTouched('blankAccountCode')}
                            onChangeText={handleChange('blankAccountCode')}
                        />
                    )}
                </>
            )}
        </Formik>
    );
}
