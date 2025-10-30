import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Image, Text, Pressable } from 'native-base';
import { ElButton, ElIcon, ElTextarea } from 'el/components';
import colors from 'el/config/colors';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'el/store/store';
import { useElToast, useFile } from 'el/utils';
import { ERROR, PENDING, SUCCESS } from 'el/store/slices/requestSlice';
import { useNavigation } from '@react-navigation/native';
import { postService } from 'el/api';
import { ResponseResult } from 'el/models/responseResult';
import { PostModel } from 'el/models/post/PostModel';
import { GET_LATEST_POSTS } from 'el/store/slices/postSlice';
import { Formik } from 'formik';

const CreatePost = ({ image, setImage }) => {
    const posts = useSelector((state: RootState) => state.posts);
    const dispatch = useDispatch();
    const { isFileOverSize, fileOverSizeMessage, getImageFormData } = useFile(image);
    const navigation: any = useNavigation();
    const toast = useElToast();


    const onSubmit = async values => {
        if (!values.details) return;

        dispatch(PENDING());
        const res: any = await postService.create(values, getImageFormData());
        if (res && res.code === 200) {
            await getLatestPosts();
            navigation.goBack();
            dispatch(SUCCESS());
        } else {
            toast.error(res.Message);
            dispatch(ERROR());
        }
    };

    const getLatestPosts = async () => {
        const res: ResponseResult<PostModel[]> = await postService.getLatestPosts(
            posts[0]?.createdDate,
        );
        dispatch(GET_LATEST_POSTS(res.value));
    };

    return (
        <>
            {image.uri && (
                <View>
                    <Pressable
                        onPress={() => setImage({ uri: '' })}
                        style={{ position: 'absolute', top: 4, right: 0, zIndex: 1 }}>
                        <ElIcon name="close-circle" size={28} color={colors.danger} />
                    </Pressable>
                    <Image style={styles.thumbnail} source={{ uri: image.uri }} alt="image" />
                </View>
            )}

            <View>
                {isFileOverSize && (
                    <Text style={{ color: colors.danger }}>{fileOverSizeMessage}</Text>
                )}
            </View>

            <Formik initialValues={{ details: '' }} onSubmit={values => onSubmit(values)}>
                {({ handleChange, handleSubmit, values, isSubmitting }) => (
                    <>
                        <ElTextarea
                            name="details"
                            onChangeText={handleChange('details')}
                            placeholder="Say something"
                        />
                        <ElButton
                            style={{ marginBottom: 8 }}
                            disabled={!values['details'] || isFileOverSize || isSubmitting}
                            onPress={handleSubmit}>
                            Create a post
                        </ElButton>
                    </>
                )}
            </Formik>
        </>
    );
};

const styles = StyleSheet.create({
    thumbnail: {
        marginTop: 16,
        height: 300,
        resizeMode: 'contain',
    },
});

export default CreatePost;
