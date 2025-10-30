import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { ElKeyboardAvoidingView, ElTitle } from 'el/components';
import colors from 'el/config/colors';
import { CameraSvg, PhotoSvg } from 'el/svgs';
import { useGoBack, useImagePicker } from 'el/utils';
import StatsSvg from 'el/svgs/statsSvg';
import { Box, Icon, Pressable, Row } from 'native-base';
import CreatePost from './components/CreatePost';
import ShareStats from './components/ShareStats';
import { isPad } from 'el/config/constants';

export default function PostCreateScreen({ navigation }) {
    useGoBack();
    const [postType, setPostType] = useState<string>('Camera');
    const { openImagePickerAsync, openCameraAsync, image, setImage } = useImagePicker();

    const handleOpenCamera = () => {
        setPostType('Camera');
        openCameraAsync();
    };

    const handleImagePicker = () => {
        setPostType('ImagePicker');
        openImagePickerAsync();
    };

    const handleShareStats = () => {
        setPostType('Stats');
    };

    const actions = [
        {
            onPress: handleOpenCamera,
            icon: <CameraSvg
                stroke={postType === 'Camera' ? colors.secondary : undefined}
                style={{ width: 27, height: 24 }}
            />
        },
        {
            onPress: handleImagePicker,
            icon: <PhotoSvg
                stroke={postType === 'ImagePicker' ? colors.secondary : undefined}
                style={{ width: 23, height: 23 }}
            />
        },
        {
            onPress: handleShareStats,
            icon: <StatsSvg
                stroke={postType === 'Stats' ? colors.secondary : undefined}
                style={{ width: 23, height: 23 }}
            />
        }
    ];

    return (
        <ElKeyboardAvoidingView keyboardDismissMode="interactive">
            <ElTitle>Create a post</ElTitle>
            <Row style={styles.actions}>
                {
                    actions.map((x, index) => <Pressable key={index} height={50} width={isPad ? "100px" : 60} alignItems="center" justifyContent="center" onPress={x.onPress}>
                        {x.icon}
                    </Pressable>)
                }
            </Row>

            {(postType === 'Camera' || postType === 'ImagePicker') && (
                <CreatePost image={image} setImage={setImage} />
            )}

            {postType === 'Stats' && <ShareStats />}
        </ElKeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    actions: {
        backgroundColor: colors.light,
        height: 50,
        alignItems: 'center',
        justifyContent: 'space-around',
        borderRadius: 10,
    },
});
