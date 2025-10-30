import React, { useState, useEffect } from 'react';
import { ElMediaList } from 'components';
import { teamService } from 'services';
import { utils } from 'utils';

const ProfileMedias = ({ teamId}) => {
    const [mediaList, setMediaList] = useState();
    const [isTeamPlayer, setIsTeamPlayer] = useState();

    useEffect(() => {getMediaList();getIsTeamPlayer();}, []);

    const getMediaList = async () => {
        const res = await teamService.getMediaList(teamId);
        if (res && res.code === 200) {
            setMediaList(res.value);
        }
    }

    const handleUpload = async (file) => {
        let formData = utils.formToFormData({ file });
        const res = await teamService.addMedia(teamId, formData);
        if (res && res.code === 200) {
            await getMediaList();
        }
    }

    const handleImageDeleted = async (item) => {
        const res = await teamService.deleteMedia(teamId, item.id);
        if (res && res.code === 200) {
            getMediaList();
        }
    }

    const getIsTeamPlayer = async () => {
        const res = await teamService.isTeamPlayer(teamId);
        if (res && res.code === 200) {
            setIsTeamPlayer(res.value);
        }
    }

    return <ElMediaList mediaList={mediaList} allowOperation={isTeamPlayer} onUploadSelectFile={handleUpload} onDeleted={handleImageDeleted} />
};


export default ProfileMedias;