import React from 'react';
import { useGoBack, useImagePicker } from 'el/utils';
import { Flex } from 'native-base';
import { organizationTypes } from 'el/enums';
import {
    ElAvatar,
    ElBody,
    ElButton,
    ElErrorMessage,
    ElInput,
    ElKeyboardAvoidingView,
    ElSelect,
    ElSelectEx,
    ElTextarea,
    ElTitle,
} from 'el/components';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Pressable } from 'react-native';

const validationSchema = Yup.object().shape({
    name: Yup.string().required().max(100).label('Name'),
    bio: Yup.string().required().max(250).label('Bio'),
    organizationType: Yup.string().required().label('OrganizationType'),
});

export default function OrganizationCreateScreen({ navigation }) {
    useGoBack();
    const { chooseAvatarAsync, image } = useImagePicker();

    const initValue = {
        name: '',
        bio: '',
        organizationType: '',
    };

    const handleCreateClick = values => {
        const organizationType = organizationTypes.find(x => x.value === values.organizationType);
        if (organizationType && organizationType.router) {
            navigation.navigate(organizationType.router, { imageUri: image.uri, ...values });
        }
    };

    return (
        <ElKeyboardAvoidingView withOffset>
            <ElTitle>Create Organization</ElTitle>
            <Formik
                initialValues={initValue}
                validationSchema={validationSchema}
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
                            {!image.uri && <ElBody mt={1}>Choose profile image</ElBody>}
                        </Flex>
                        <ElInput
                            name="name"
                            placeholder="Name your Organization"
                            onBlur={() => setFieldTouched('name')}
                            onChangeText={handleChange('name')}
                            maxLength={100}
                        />
                        <ElErrorMessage error={errors['name']} visible={touched['name']} />

                        <ElTextarea
                            name="bio"
                            placeholder="Organization Bio"
                            onBlur={() => setFieldTouched('bio')}
                            onChangeText={handleChange('bio')}
                            maxLength={250}
                        />
                        <ElErrorMessage error={errors['bio']} visible={touched['bio']} />

                        <ElSelectEx
                            items={organizationTypes}
                            name="organizationType"
                            onValueChange={value => setFieldValue('organizationType', value)}
                            placeholder="Organization type"
                        />
                        <ElErrorMessage error={errors['organizationType']} visible={touched['organizationType']} />

                        <ElButton
                            disabled={!image?.uri || isSubmitting}
                            onPress={handleSubmit}
                            style={{ marginBottom: 8 }}>
                            Create Organization
                        </ElButton>
                    </>
                )}
            </Formik>
        </ElKeyboardAvoidingView>
    );
}
