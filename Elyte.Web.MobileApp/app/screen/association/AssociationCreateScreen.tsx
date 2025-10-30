import React, { useEffect, useState } from 'react';
import { useElToast, useGoBack, useImagePicker, utils, validator } from 'el/utils';
import { Flex } from 'native-base';
import { ElAvatar, ElBody, ElButton, ElErrorMessage, ElInput, ElKeyboardAvoidingView, ElTextarea, ElTitle } from 'el/components';
import { Formik } from 'formik';
import * as Yup from 'yup';
import RegionCascader from 'el/components/RegionCascader';
import { associationService } from 'el/api';
import { useDispatch } from 'react-redux';
import { ERROR, PENDING, SUCCESS } from 'el/store/slices/requestSlice';
import routes from 'el/navigation/routes';

const validationBasic = {
    name: Yup.string().required().max(100).label('Name'),
    details: Yup.string().required().max(250).label('Details'),
}

const validationContact = {
    contactNumber: Yup.string().required().max(11).label('Contact Number'),
    contactEmail: Yup.string().required().max(200).email().label('Contact Email')
}

const validationStep1 = Yup.object().shape({
    name: Yup.string().required().max(100).label('Name'),
    ...validator.address
});

const validationOfficalStep2 = Yup.object().shape({
    ...validationBasic,
    registerPrice: Yup.number().required().label('Price to Register ($)'),
    paymentAccount: Yup.number().required().label('Payment Account'),
    ...validationContact
});

const validationUnofficalStep2 = Yup.object().shape({
    ...validationBasic,
    ...validationContact
});

export default function AssociationCreateScreen({ navigation, route }) {
    useGoBack();
    const { imageUri, name, bio } = route.params;
    const dispatch = useDispatch();
    const { chooseAvatarAsync, image, setImage, getImageFormData } = useImagePicker();
    const [hideCreateAssociation, setHideCreateAssociation] = useState(false);
    const [isOfficial, setIsOfficial] = useState(false);
    const toast = useElToast();

    useEffect(() => {
        setImage({ uri: imageUri });
    }, [imageUri]);

    const initValue: any = {
        name: name,
        officialId: '',
        details: bio,
        country: '',
        state: '',
        city: '',
        registerPrice: 0,
        paymentAccount: '',
        contactNumber: '',
        contactEmail: ''
    };

    const handleCreateClick = async values => {
        if (!hideCreateAssociation) setHideCreateAssociation(true);

        if (hideCreateAssociation) {
            dispatch(PENDING());
            const imageFile: any = getImageFormData();
            if (!imageFile) {
                toast.error("Image is required.");
            }

            const formData = utils.formToFormData(values, {});
            formData.append('File', imageFile);
            const res: any = await associationService.createAssociation(formData);
            if (res && res.code === 200 && res.value) {
                dispatch(SUCCESS());
                navigation.navigate(routes.AssociationCreateSuccess, {
                    id: res.value,
                });
            } else {
                dispatch(ERROR());
            }
        }
    };

    const buildPageTitle = () => {
        if (!hideCreateAssociation) return 'Create An Association';

        return isOfficial ? "Official Association Details" : "Unofficial Association Details";
    };

    return (
        <ElKeyboardAvoidingView withOffset>
            <ElTitle>{buildPageTitle()}</ElTitle>
            <Formik
                initialValues={initValue}
                validationSchema={!hideCreateAssociation ? validationStep1 : isOfficial ? validationOfficalStep2 : validationUnofficalStep2}
                onSubmit={values => handleCreateClick(values)}>
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
                        </Flex>

                        <ElInput defaultValue={initValue.name} name="name" placeholder="Name your Association" maxLength={100} onBlur={() => setFieldTouched('name')} onChangeText={handleChange('name')} />
                        <ElErrorMessage error={errors['name']} visible={touched['name']} />

                        {!hideCreateAssociation && (
                            <>
                                <ElTextarea name="details" placeholder="Details" maxLength={250} onBlur={() => setFieldTouched('details')} onChangeText={handleChange('details')} defaultValue={initValue.details} />
                                <ElErrorMessage error={errors['details']} visible={touched['details']} />

                                <RegionCascader setFieldValue={setFieldValue} touched={touched} errors={errors} values={values} />

                                <ElButton disabled={!image?.uri} onPress={handleSubmit} style={{ marginBottom: 8 }}>Next Step</ElButton>
                            </>
                        )}

                        {hideCreateAssociation && (
                            <>
                                {isOfficial &&
                                    <>
                                        <ElBody>Payment Details</ElBody>

                                        <ElInput name="registerPrice" placeholder="Price to Register ($)" keyboardType="numeric" onBlur={() => setFieldTouched('registerPrice')} onChangeText={handleChange('registerPrice')} defaultValue={initValue.registerPrice} />
                                        <ElErrorMessage error={errors['registerPrice']} visible={touched['registerPrice']} />

                                        <ElInput defaultValue={initValue.paymentAccount} name="paymentAccount" placeholder="Name your Association" onBlur={() => setFieldTouched('paymentAccount')} onChangeText={handleChange('paymentAccount')} />
                                        <ElErrorMessage error={errors['paymentAccount']} visible={touched['paymentAccount']} />

                                        <RegionCascader setFieldValue={setFieldValue} touched={touched} errors={errors} values={values} />
                                        <ElButton disabled={!image?.uri} onPress={handleSubmit} style={{ marginBottom: 8 }}>Next Step</ElButton>
                                    </>
                                }
                                <ElInput name="contactNumber" keyboardType="numeric" placeholder="Association Contact Number" maxLength={11} onBlur={() => setFieldTouched('contactNumber')} onChangeText={handleChange('contactNumber')} />
                                <ElErrorMessage error={errors['contactNumber']} visible={touched['contactNumber']} />

                                <ElInput name="contactEmail" keyboardType="email-address" placeholder="Association Contact Email" maxLength={200} onBlur={() => setFieldTouched('contactEmail')} onChangeText={handleChange('contactEmail')} />
                                <ElErrorMessage error={errors['contactEmail']} visible={touched['contactEmail']} />

                                <ElButton onPress={handleSubmit} style={{ marginBottom: 8 }} disabled={isSubmitting}>Create Association</ElButton>
                            </>
                        )}
                    </>
                )}
            </Formik>
        </ElKeyboardAvoidingView>
    );
}
