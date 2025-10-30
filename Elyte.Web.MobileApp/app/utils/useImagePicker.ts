import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

const useImagePicker = () => {
    const [image, setImage] = useState({ uri: '' });

    const openImagePickerAsync = async () => {
        let permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permission.granted === false) {
            alert('Permission to access media is required!');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
        });
        if (result.canceled === true) {
            return;
        }

        setImage({ uri: result.assets[0].uri });
    };

    const chooseAvatarAsync = async () => {
        let permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permission.granted === false) {
            alert('Permission to access media is required!');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 4],
        });
        if (result.canceled === true) {
            return;
        }

        setImage({ uri: result.assets[0].uri });
    };

    const openCameraAsync = async () => {
        let permission = await ImagePicker.requestCameraPermissionsAsync();

        if (permission.granted === false) {
            alert('Permission to access camera is required!');
            return;
        }

        let result = await ImagePicker.launchCameraAsync();
        if (result.canceled) return;

        setImage({ uri: result.assets[0].uri });
    };

    const getImageFormData = () => {
        if (!image?.uri) return null;

        const filename = image.uri.split('/').pop();
        const type = image.uri.substring(image.uri.lastIndexOf('.') + 1);
        const photo = { uri: image.uri, name: filename, type: `image/${type}` };
        return photo;
    };

    return { openImagePickerAsync, chooseAvatarAsync, openCameraAsync, image, setImage, getImageFormData };
};

export default useImagePicker;
