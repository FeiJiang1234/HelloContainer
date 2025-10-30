import React, { useEffect, useState } from 'react';
import { teamService } from 'el/api';
import { useDispatch } from 'react-redux';
import { ERROR, PENDING, SUCCESS } from 'el/store/slices/requestSlice';
import { TeamModel } from 'el/models/team/teamModel';
import { ResponseResult } from 'el/models/responseResult';
import {
    ElAgeRange,
    ElButton,
    ElErrorMessage,
    ElInput,
    ElKeyboardAvoidingView,
    ElSelectEx,
    ElTextarea,
    ElTitle,
} from 'el/components';
import { Formik } from 'formik';
import { GenderTypes } from 'el/enums';
import RegionCascader from 'el/components/RegionCascader';
import { useGoBack, validator } from 'el/utils';
import routes from 'el/navigation/routes';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
    name: Yup.string().required().max(100).label('Name'),
    bio: Yup.string().required().max(250).label('Bio'),
    gender: Yup.string().required().label('Gender'),
    ...validator.ageRange,
    ...validator.address,
});

export default function EditTeamProfileScreen({ navigation, route }) {
    useGoBack();
    const { id } = route.params;
    const dispatch = useDispatch();
    const [profile, setProfile] = useState<TeamModel>();
    const initValue = {
        name: profile?.name,
        bio: profile?.bio,
        gender: profile?.gender,
        minAge: profile?.minAge,
        maxAge: profile?.maxAge,
        country: profile?.countryCode,
        countryName: profile?.country,
        state: profile?.stateCode,
        stateName: profile?.state,
        city: profile?.cityCode,
        cityName: profile?.city,
    };

    useEffect(() => {
        getTeamProfile();
    }, [id]);

    const getTeamProfile = async () => {
        dispatch(PENDING());
        const res: ResponseResult<TeamModel> = await teamService.getTeamProfile(id);
        if (res && res.code === 200) {
            dispatch(SUCCESS());
            setProfile(res.value);
        } else {
            dispatch(ERROR());
        }
    };

    const handleSaveClick = async values => {
        dispatch(PENDING());
        const res: any = await teamService.updateProfile(id, values);
        if (res && res.code === 200) {
            dispatch(SUCCESS());
            navigation.navigate({
                name: routes.TeamProfile,
                params: { refresh: true },
                merge: true,
            });
        } else {
            dispatch(ERROR());
        }
    };

    return (
        <ElKeyboardAvoidingView withOffset>
            <ElTitle>Edit Team Profile</ElTitle>
            {profile && (
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
                                name="name"
                                placeholder="Name your Team"
                                onBlur={() => setFieldTouched('name')}
                                onChangeText={handleChange('name')}
                                defaultValue={values.name}
                                maxLength={100}
                            />
                            <ElErrorMessage error={errors['name']} visible={touched['name']} />

                            <ElTextarea
                                name="bio"
                                onChangeText={handleChange('bio')}
                                placeholder="Add Teams Bio"
                                defaultValue={values.bio}
                                maxLength={250}
                            />
                            <ElErrorMessage error={errors['bio']} visible={touched['bio']} />

                            <ElSelectEx
                                name="gender"
                                items={GenderTypes}
                                onvalueChange={value => setFieldValue('gender', value)}
                                placeholder="Gender"
                                defaultValue={values.gender}
                            />
                            <ElErrorMessage error={errors['gender']} visible={touched['gender']} />

                            <ElAgeRange
                                setFieldTouched={setFieldTouched}
                                errors={errors}
                                touched={touched}
                                handleChange={handleChange}
                                defaultValues={values}
                            />

                            <RegionCascader
                                setFieldValue={setFieldValue}
                                touched={touched}
                                errors={errors}
                                values={values}
                            />

                            <ElButton onPress={handleSubmit} style={{ marginBottom: 8 }} disabled={isSubmitting}>
                                Save
                            </ElButton>
                        </>
                    )}
                </Formik>
            )}
        </ElKeyboardAvoidingView>
    );
}
