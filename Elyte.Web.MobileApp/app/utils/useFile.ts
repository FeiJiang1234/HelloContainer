import { useState, useEffect } from 'react';
import config from '../config/config';
import * as FileSystem from 'expo-file-system';

export default function useFile(file) {
    const [isFileOverSize, setIsFileOverSize] = useState(false);

    useEffect(() => {
        calculateFileSize();
    }, [file]);

    const calculateFileSize = async () => {
        if (!file?.uri) {
            setIsFileOverSize(false);
            return;
        }

        const fileInfo: any = await FileSystem.getInfoAsync(file.uri);
        const isOverSize = fileInfo?.size > config.fileMaxBytes;
        setIsFileOverSize(isOverSize);
    };

    const getMaxFileSize = () => {
        return `${(config.fileMaxBytes / 1024 ** 2).toFixed(0)} MB`;
    };

    const getImageFormData = () => {
        if (!file?.uri) return null;

        const filename = file.uri.split('/').pop();
        const type = file.uri.substring(file.uri.lastIndexOf('.') + 1);
        const photo = { uri: file.uri, name: filename, type: `image/${type}` };
        return photo;
    };

    const fileOverSizeMessage = `File Size cannot exceed ${getMaxFileSize()}`;

    return { isFileOverSize, fileOverSizeMessage, getImageFormData };
}
