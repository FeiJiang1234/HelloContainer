import React, { useEffect, useState } from 'react';
import ElMediaList from "el/components/ElMediaList";
import { athleteService } from 'el/api';
import { utils } from 'el/utils';
import { useDispatch } from 'react-redux';
import { ERROR, PENDING, SUCCESS } from 'el/store/slices/requestSlice';

export default function ProfileMedias({ userId, isSelf }) {
    const dispatch = useDispatch();
    const [mediaList, setMediaList] = useState<any[]>([]);

    useEffect(() => { getMediaList() }, []);

    const getMediaList = async () => {
        dispatch(PENDING());
        const res: any = await athleteService.getMediaList(userId);
        if (res && res.code === 200) {
            dispatch(SUCCESS());
            setMediaList([]);
            setMediaList(res.value);
        } else {
            dispatch(ERROR());
        }
    }

    const handleUpload = async (file) => {
        dispatch(PENDING());
        let formData = utils.formToFormData({ file }, false);
        const res: any = await athleteService.addMedia(userId, formData);
        if (res && res.code === 200) {
            dispatch(SUCCESS());
            await getMediaList();
        } else {
            dispatch(ERROR());
        }
    }

    const handleDeleteImage = async (item) => {
        dispatch(PENDING());
        const res: any = await athleteService.deleteMedia(userId, item.id);
        if (res && res.code === 200) {
            dispatch(SUCCESS());
            await getMediaList();
        } else {
            dispatch(ERROR());
        }
    }

    return <ElMediaList images={mediaList} allowOperation={isSelf} isCanDelete={isSelf} sorted={true} onUpload={handleUpload} onDeleted={handleDeleteImage}></ElMediaList>
}

