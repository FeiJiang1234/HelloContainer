import MasonryList from "react-native-masonry-list";
import React, { useEffect, useState } from 'react';
import { Actionsheet, HStack, Text, useDisclose } from "native-base";
import colors from 'el/config/colors';
import { Pressable } from "react-native";
import { useImagePicker, utils } from "el/utils";
import { ActionModel } from "el/models/action/actionModel";
import ElActionsheet from "./ElActionsheet";

type PropType = {
    images: any;
    itemSource?: string[];
    allowOperation?: boolean;
    onUpload?: any;
    onDeleted?: any;
    [rest: string]: any;
};

const ElMediaList: React.FC<PropType> = ({ itemSource, images, allowOperation, onDeleted, onUpload,  ...rest }) => {
    const { isOpen, onOpen, onClose } = useDisclose();
    const [deleteImage, setDeleteImage] = useState<any>();
    const { openImagePickerAsync, image, getImageFormData } = useImagePicker();
    const options: ActionModel[] = [{ label: 'Delete', onPress: () => handleDeleteImage() }];

    useEffect(() => {
        if (!image || !image.uri) return;

        onUpload(getImageFormData())
    }, [image]);

    const handleLongPressImage = async (item) => {
        if (allowOperation) {
            setDeleteImage(item);
            onOpen();
        }
    }

    const handleDeleteImage = async () => {
        await onDeleted(deleteImage);
        onClose();
    }

    return (
        <>
            <HStack mt={3} mb={3} justifyContent="space-between">
                <Text color={colors.medium}>Pictures</Text>
                {allowOperation && <Pressable onPress={openImagePickerAsync}><Text style={{ color: colors.secondary, }}>+ Upload</Text></Pressable>}
            </HStack>
            {!utils.isArrayNullOrEmpty(images) && <MasonryList itemSource={itemSource} images={images} onLongPressImage={handleLongPressImage} {...rest} />}
            <ElActionsheet isOpen={isOpen} onClose={onClose} items={options}></ElActionsheet>
        </>
    );
};

export default ElMediaList;