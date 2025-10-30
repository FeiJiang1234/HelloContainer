import React, { useEffect, useState } from 'react';
import ElMediaList from "el/components/ElMediaList";
import { teamService } from 'el/api';
import { utils } from 'el/utils';
import { useDispatch } from 'react-redux';
import { ERROR, PENDING, SUCCESS } from 'el/store/slices/requestSlice';

export default function ProfileMedias({ teamId }) {
    const dispatch = useDispatch();
    const [mediaList, setMediaList] = useState<any[]>([]);
    const [isTeamPlayer, setIsTeamPlayer] = useState(false);

    useEffect(() => { getMediaList();getIsTeamPlayer(); }, []);

    const getMediaList = async () => {
        dispatch(PENDING());
        const res: any = await teamService.getMediaList(teamId);
        if (res && res.code === 200) {
            dispatch(SUCCESS());
            setMediaList(res.value);
        } else {
            dispatch(ERROR());
        }
    }

    const handleUpload = async (file) => {
        dispatch(PENDING());
        let formData = utils.formToFormData({ file }, false);
        const res: any = await teamService.addMedia(teamId, formData);
        if (res && res.code === 200) {
            dispatch(SUCCESS());
            setMediaList([]);
            await getMediaList();
        } else {
            dispatch(ERROR());
        }
    }

    const handleDeleteImage = async (item) => {
        dispatch(PENDING());
        const res: any = await teamService.deleteMedia(teamId, item.id);
        if (res && res.code === 200) {
            dispatch(SUCCESS());
            await getMediaList();
        } else {
            dispatch(ERROR());
        }
    }

    const getIsTeamPlayer = async () => {
        dispatch(PENDING());
        const res: any = await teamService.isTeamPlayer(teamId);
        if (res && res.code === 200) {
            dispatch(SUCCESS());
            setIsTeamPlayer(res.value);
        } else {
            dispatch(ERROR());
        }
    }

    return <ElMediaList images={mediaList} allowOperation={isTeamPlayer} sorted={true} onUpload={handleUpload} onDeleted={handleDeleteImage}></ElMediaList>
}

