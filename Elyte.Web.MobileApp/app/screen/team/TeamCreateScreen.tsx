import React from 'react';
import {
    ElAgeRange,
    ElAvatar,
    ElBody,
    ElButton,
    ElErrorMessage,
    ElInput,
    ElKeyboardAvoidingView,
    ElSelectEx,
    ElTextarea,
    ElTitle,
} from 'el/components';
import { useGoBack, useImagePicker, validator } from 'el/utils';
import { Formik } from 'formik';
import { Flex, Pressable } from 'native-base';
import { SportTypes, GenderTypes } from 'el/enums';
import { teamService } from 'el/api';
import * as Yup from 'yup';
import RegionCascader from 'el/components/RegionCascader';
import routes from 'el/navigation/routes';
import { ERROR, PENDING, SUCCESS } from 'el/store/slices/requestSlice';
import { useDispatch } from 'react-redux';

const validationSchema = Yup.object().shape({
    name: Yup.string().required().max(100).label('Name'),
    bio: Yup.string().required().max(250).label('Bio'),
    sportType: Yup.string().required().label('SportType'),
    gender: Yup.string().required().label('Gender'),
    ...validator.ageRange,
    ...validator.address,
});

export default function TeamCreateScreen({ navigation }) {
    useGoBack();
    const { chooseAvatarAsync, image, getImageFormData } = useImagePicker();
    const dispatch = useDispatch();

    const initValue = {
        name: '',
        bio: '',
        sportType: '',
        gender: '',
        minAge: '',
        maxAge: '',
        country: '',
        state: '',
        city: '',
        zipcode: '',
    };

    const handleCreateTeamClick = async data => {
        dispatch(PENDING());
        const res: any = await teamService.createTeam(data, getImageFormData());
        if (res && res.code === 200 && res.value) {
            dispatch(SUCCESS());
            navigation.navigate(routes.TeamCreateSuccess, {
                id: res.value,
            });
        } else {
            dispatch(ERROR());
        }
    };

    return (
        <ElKeyboardAvoidingView withOffset>
            <ElTitle>Create Team</ElTitle>
            <Formik
                initialValues={initValue}
                validationSchema={validationSchema}
                onSubmit={values => handleCreateTeamClick(values)}>
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
                        <ElBody>Main information</ElBody>
                        <Flex align="center" my={2}>
                            <ElAvatar onPress={chooseAvatarAsync} size={81} uri={image.uri} />
                            {!image.uri && <ElBody mt={1}>Choose profile image</ElBody>}
                        </Flex>
                        <ElInput
                            name="name"
                            placeholder="Name your Team"
                            onBlur={() => setFieldTouched('name')}
                            onChangeText={handleChange('name')}
                            maxLength={100}
                        />
                        <ElErrorMessage error={errors['name']} visible={touched['name']} />

                        <ElTextarea
                            name="bio"
                            onChangeText={handleChange('bio')}
                            placeholder="Add Teams Bio"
                            maxLength={250}
                        />
                        <ElErrorMessage error={errors['bio']} visible={touched['bio']} />

                        <ElBody>Details</ElBody>
                        <ElSelectEx
                            items={SportTypes}
                            name="sportType"
                            onValueChange={value => setFieldValue('sportType', value)}
                            placeholder="Choose a sport"
                        />
                        <ElErrorMessage error={errors['sportType']} visible={touched['sportType']}
                        />

                        <ElSelectEx
                            items={GenderTypes}
                            name="gender"
                            onValueChange={value => setFieldValue('gender', value)}
                            placeholder="Gender"
                        />
                        <ElErrorMessage error={errors['gender']} visible={touched['gender']} />

                        <ElAgeRange
                            setFieldTouched={setFieldTouched}
                            errors={errors}
                            touched={touched}
                            handleChange={handleChange}
                        />

                        <RegionCascader
                            setFieldValue={setFieldValue}
                            touched={touched}
                            errors={errors}
                            values={values}
                        />

                        <ElInput
                            name="zipcode"
                            placeholder="Zip Code"
                            onBlur={() => setFieldTouched('zipcode')}
                            onChangeText={handleChange('zipcode')}
                        />
                        <ElButton
                            disabled={!image?.uri || isSubmitting}
                            onPress={handleSubmit}
                            style={{ marginBottom: 8 }}>
                            Create Team
                        </ElButton>
                    </>
                )}
            </Formik>
        </ElKeyboardAvoidingView>
    );
}
