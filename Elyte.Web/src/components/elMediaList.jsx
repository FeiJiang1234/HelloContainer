import React, { useRef, useState } from 'react';
import { Box, ImageList, ImageListItem, Typography } from '@mui/material';
import { ElLinkBtn, ElConfirm } from 'components';

const imageTypeWhiteList = [
    "image/jpeg",
    "image/png",
    "image/bmp",
    "image/jpg",
    "image/webp",
];

export default function ElMediaList({ mediaList, allowOperation, onUploadSelectFile, onDeleted }) {
    const uploadInputRef = useRef(null);
    const [dialogState, setDialogState] = useState(false);
    const [selectedImage, setSelectedImage] = useState();

    const handleUpload = async ({ target }) => {
        if (target && target.files[0]) {
            if (imageTypeWhiteList.some(x => x === target.files[0].type)) {
                return onUploadSelectFile(target.files[0]);
            }

            window.elyte.error("We only allow JPG, JPEG, BMP, WEBP and PNG files types to be uploaded as images");
        }

        uploadInputRef.current.value = null;
    }

    const handleUploadClick = () => {
        uploadInputRef.current && uploadInputRef.current.click();
    }

    const handleIamgeClick = (item) => {
        if (allowOperation) {
            setDialogState(true);
            setSelectedImage(item);
        }
    }

    const handleOnOkClick = () => {
        if (onDeleted) {
            onDeleted(selectedImage);
        }
    }

    return (
        <>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography mt={1} mr={1} sx={{ fontWeight: 500 }} >Pictures</Typography>
                <input ref={uploadInputRef} type="file" accept=".png,.jpg,.jpeg,.bmp,.webp" style={{ display: "none" }} onChange={handleUpload} />
                {
                    allowOperation && <ElLinkBtn onClick={handleUploadClick} variant="contained" mt={1}>+ Upload</ElLinkBtn>
                }
            </Box>
            {
                !Array.isNullOrEmpty(mediaList) &&
                <Box mt={2} sx={{ height: 650, overflowY: 'scroll' }}>
                    <ImageList variant="masonry" cols={2} gap={4}>
                        {
                            mediaList.map((item) =>
                                <ImageListItem key={item.id}>
                                    <img src={`${item.imageUrl}?w=248&fit=crop&auto=format`} srcSet={`${item.imageUrl}?w=248&fit=crop&auto=format&dpr=2 2x`} loading="lazy" onClick={() => handleIamgeClick(item)} />
                                </ImageListItem>
                            )
                        }
                    </ImageList>
                </Box>
            }
            <ElConfirm
                title="Warning"
                content="Do you want to delete this media?"
                open={dialogState}
                onNoClick={() => setDialogState(false)}
                onOkClick={handleOnOkClick}
            />
        </>
    );
}