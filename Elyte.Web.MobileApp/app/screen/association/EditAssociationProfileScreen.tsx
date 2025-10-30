import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ERROR, PENDING, SUCCESS } from 'el/store/slices/requestSlice';
import { ResponseResult } from 'el/models/responseResult';
import { associationService } from 'el/api';
import { ElBody, ElButton, ElErrorMessage, ElInput, ElKeyboardAvoidingView, ElTextarea, ElTitle } from 'el/components';
import { Formik } from 'formik';
import RegionCascader from 'el/components/RegionCascader';
import { useElToast, useGoBack, validator } from 'el/utils';
import routes from 'el/navigation/routes';
import * as Yup from 'yup';
import { AssociationProfileModel } from 'el/models/association/associationProfileModel';

const validationSchema = Yup.object().shape({
    name: Yup.string().required().max(100).label('Name'),
    details: Yup.string().required().max(250).label('Details'),
    contactNumber: Yup.string().required().label('Contact Number'),
    contactEmail: Yup.string().required().email().label('Contact Email'),
    ...validator.address,
});

export default function EditLeagueProfileScreen({ navigation, route }) {
    useGoBack();
    const { id } = route.params;
    const dispatch = useDispatch();
    const [profile, setProfile] = useState<AssociationProfileModel>();
    const toast = useElToast();
    const initValue = {
        name: profile?.name,
        country: profile?.countryCode,
        countryName: profile?.country,
        state: profile?.stateCode,
        stateName: profile?.state,
        city: profile?.cityCode,
        cityName: profile?.city,
        details: profile?.details,
        contactNumber: profile?.phoneNumber,
        contactEmail: profile?.email
    };

    useEffect(() => {
        getAssociationProfile();
    }, [id]);

    const getAssociationProfile = async () => {
        dispatch(PENDING());
        const res: ResponseResult<AssociationProfileModel> = await associationService.getAssociationProfile(id);
        if (res && res.code === 200) {
            dispatch(SUCCESS());
            setProfile(res.value);
        } else {
            dispatch(ERROR());
        }
    };

    const handleSaveClick = async values => {
        dispatch(PENDING());
        values.AssociationId = id;
        const res: any = await associationService.updateAssociationProfile(id, values);
        if (res && res.code === 200) {
            dispatch(SUCCESS());
            navigation.navigate({
                name: routes.AssociationProfile,
                params: { refresh: true },
                merge: true,
            });
        } else {
            toast.error(res.Message);
            dispatch(ERROR());
        }
    };

    return (
        <ElKeyboardAvoidingView withOffset>
            <ElTitle>Edit Association Profile</ElTitle>
            {profile &&
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
                    }) =>
                        <>
                            <ElBody>Main information</ElBody>
                            <ElInput name="name" defaultValue={values.name} placeholder="Association Name" maxLength={100} onBlur={() => setFieldTouched('name')} onChangeText={handleChange('name')} />
                            <ElErrorMessage error={errors['name']} visible={touched['name']} />

                            <ElTextarea name="details" placeholder="Details" maxLength={250} onBlur={() => setFieldTouched('details')} onChangeText={handleChange('details')} defaultValue={values.details} />
                            <ElErrorMessage error={errors['details']} visible={touched['details']} />

                            <RegionCascader setFieldValue={setFieldValue} touched={touched} errors={errors} values={values} />

                            <ElBody>Contact Details</ElBody>
                            <ElInput name="contactNumber" keyboardType="numeric" placeholder="Association Contact Number" defaultValue={values.contactNumber} maxLength={11} onBlur={() => setFieldTouched('contactNumber')} onChangeText={handleChange('contactNumber')} />
                            <ElErrorMessage error={errors['contactNumber']} visible={touched['contactNumber']} />

                            <ElInput name="contactEmail" keyboardType="email-address" placeholder="Association Contact Email" defaultValue={values.contactEmail} maxLength={200} onBlur={() => setFieldTouched('contactEmail')} onChangeText={handleChange('contactEmail')} />
                            <ElErrorMessage error={errors['contactEmail']} visible={touched['contactEmail']} />

                            <ElButton onPress={handleSubmit} style={{ marginBottom: 8 }} disabled={isSubmitting}> Save </ElButton>
                        </>
                    }
                </Formik>
            }
        </ElKeyboardAvoidingView>
    );
}
