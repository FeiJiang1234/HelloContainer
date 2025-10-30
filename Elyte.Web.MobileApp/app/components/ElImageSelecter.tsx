import { useImagePicker } from 'el/utils';
import { Icon, Image, Input, Pressable } from 'native-base';
import React, { useEffect } from 'react';
import colors from '../config/colors';
import defaultStyles from '../config/styles';
import { StyleSheet, View } from 'react-native';
import { SelectPicture } from 'el/svgs';
import ElInput from './ElInput';

type PropType = {
    style?: any;
    defaultValue?: any;
    onImageSelected: Function;
    [rest: string]: any;
};

const ElImageSelecter: React.FC<PropType> = ({
    style,
    defaultValue,
    onImageSelected,
    ...rest
}) => {
    const { placeholder, name, } = rest;
    const { chooseAvatarAsync, image, setImage, getImageFormData } = useImagePicker();

    useEffect(() => {
        if (typeof defaultValue === "string") {
            setImage({ uri: defaultValue });
        }
    }, [defaultValue])

    useEffect(() => {
        if (!image.uri) return;

        onImageSelected && onImageSelected(getImageFormData());
    }, [image]);

    return (
        <>
            {!image.uri &&
                <Pressable onPress={chooseAvatarAsync} >
                    <ElInput
                        name={name}
                        placeholder={placeholder}
                        onPressIn={chooseAvatarAsync}
                        maxLength={20}
                        InputLeftElement={<Icon marginLeft={3} as={<SelectPicture />} size={5} />}
                        isReadOnly={true}
                    />
                </Pressable>
            }
            {
                image && image.uri &&
                <Pressable onPress={chooseAvatarAsync} >
                    <Image style={{ width: "100%", height: 300 }} source={{ uri: image.uri }} alt='image'></Image>
                </Pressable>
            }
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.light,
        borderRadius: 15,
        flexDirection: 'row',
        padding: 6,
        marginVertical: 10,
    }
});

export default ElImageSelecter;
