import React, { useState, useEffect } from 'react';
import { ElMediaList } from 'components';
import { athleteService } from 'services';
import { utils } from 'utils';

const ProfileMedias = ({ userId, isSelf }) => {
    const [mediaList, setMediaList] = useState();

    useEffect(() => getMediaList(), []);

    const getMediaList = async () => {
        const res = await athleteService.getMediaList(userId);
        if (res && res.code === 200) {
            setMediaList(res.value);
        }
    }

    const handleUpload = async (file) => {
        let formData = utils.formToFormData({ file });
        const res = await athleteService.addMedia(userId, formData);
        if (res && res.code === 200) {
            await getMediaList();
        }
    }

    const handleImageDeleted = async (item) => {
        const res = await athleteService.deleteMedia(userId, item.id);
        if (res && res.code === 200) {
            getMediaList();
        }
    }

    return <ElMediaList mediaList={mediaList} allowOperation={isSelf} onUploadSelectFile={handleUpload} onDeleted={handleImageDeleted} />
};


export default ProfileMedias;