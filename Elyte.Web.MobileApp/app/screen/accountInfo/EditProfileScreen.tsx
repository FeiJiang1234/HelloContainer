import { Formik } from 'formik';
import React, { useRef } from 'react';
import {
    ElButton,
    ElDatePicker,
    ElErrorMessage,
    ElInput,
    ElKeyboardAvoidingView,
    ElTextarea,
    ElTitle,
} from 'el/components';
import { useAuth, useDateTime, useGoBack, validator } from 'el/utils';
import * as Yup from 'yup';
import { athleteService } from 'el/api';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'el/store/store';
import { UPDATE_PROFILE } from 'el/store/slices/athleteSlice';
import { ScrollView } from 'react-native';
import RegionCascader from 'el/components/RegionCascader';
import { ERROR, PENDING, SUCCESS } from 'el/store/slices/requestSlice';
import { Row, Text } from 'native-base';
import routes from 'el/navigation/routes';

const LIMITED_AGE = 13 * 365 * 24 * 60 * 60 * 1000;
const MAX_DATE = new Date().getTime() - LIMITED_AGE;

const validationSchema = Yup.object().shape({
    firstName: Yup.string().required().max(20).label('First Name'),
    lastName: Yup.string().required().max(20).label('Last Name'),
    birthday: Yup.date()
        .max(new Date(MAX_DATE), 'Birthdate does not meet the requirements')
        .label('Birthday'),
    ...validator.address,
    bio: Yup.string().required().max(300).label('Bio'),
});

export default function EditProfileScreen({ navigation }) {
    useGoBack();
    const profile = useSelector((state: RootState) => state.athlete);
    const initValue = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        birthday: profile.birthday,
        bio: profile.bio,
        country: profile.countryCode,
        countryName: profile.country,
        state: profile.stateCode,
        stateName: profile.state,
        city: profile.cityCode,
        cityName: profile.city,
    };
    const dispatch = useDispatch();
    const { format } = useDateTime();
    const { user } = useAuth();
    const scrollView = useRef<ScrollView>(null);

    const handleSaveClick = async values => {
        dispatch(PENDING());
        values['athleteId'] = user.id;
        const res: any = await athleteService.updateProfile(user.id, values);
        if (res && res.code === 200) {
            dispatch(SUCCESS());
            dispatch(
                UPDATE_PROFILE({
                    firstName: values.firstName,
                    lastName: values.lastName,
                    birthday: format(values.birthday),
                    bio: values.bio,
                    countryCode: values.country,
                    country: values.countryName,
                    stateCode: values.state,
                    state: values?.stateName,
                    cityCode: values.city,
                    city: values?.cityName,
                }),
            );
            navigation.goBack();
        } else {
            dispatch(ERROR());
        }
    };

    return (
        <ElKeyboardAvoidingView ref={scrollView}>
            <ElTitle>Edit Athlete Profile</ElTitle>
            <Formik
                initialValues={initValue}
                validationSchema={validationSchema}
                onSubmit={values => handleSaveClick(values)}>
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
                            defaultValue={initValue.firstName}
                            name="firstName"
                            placeholder="First Name"
                            onBlur={() => setFieldTouched('firstName')}
                            onChangeText={handleChange('firstName')}
                            maxLength={20}
                        />
                        <ElErrorMessage error={errors['firstName']} visible={touched['firstName']} />

                        <ElInput
                            defaultValue={initValue.lastName}
                            name="lastName"
                            placeholder="Last Name"
                            onBlur={() => setFieldTouched('lastName')}
                            onChangeText={handleChange('lastName')}
                            maxLength={20}
                        />
                        <ElErrorMessage error={errors['lastName']} visible={touched['lastName']} />

                        <Row alignItems="center" my={1}>
                            <Text>Phone Number: </Text>
                            <ElButton
                                size="sm"
                                onPress={() => navigation.navigate(routes.ChangePhoneNumber)}>
                                Update
                            </ElButton>
                        </Row>

                        <ElDatePicker
                            name="birthday"
                            placeholder="Birthday"
                            onSelectedDate={item => setFieldValue('birthday', item)}
                            defaultValue={initValue.birthday}
                        />
                        <ElErrorMessage error={errors['birthday']} visible={true} />

                        <RegionCascader
                            setFieldValue={setFieldValue}
                            touched={touched}
                            errors={errors}
                            values={values}
                        />

                        <ElTextarea
                            defaultValue={initValue.bio}
                            name="bio"
                            onChangeText={handleChange('bio')}
                            placeholder="Bio"
                            onFocus={() => scrollView?.current?.scrollToEnd()}
                            maxLength={250}
                        />

                        <ElButton onPress={handleSubmit} style={{ marginBottom: 8 }} disabled={isSubmitting}>
                            Save
                        </ElButton>
                    </>
                )}
            </Formik>
        </ElKeyboardAvoidingView>
    );
}
