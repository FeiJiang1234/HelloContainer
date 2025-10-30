import React, { useState } from 'react';
import { ElImageCropper, ElDialog } from 'components';
import { utils } from 'utils';

function ElImageUploader ({ children, crop, cropShape, onImageSelected, disabled }) {
    const [file, setFile] = useState(null);

    const onFileChange = async e => {
        setFile(e.target.files[0]);
    };

    const handleUploadImage = async croppedImage => {
        handleCorpDialogClose();
        if (onImageSelected) {
            let url = await utils.readFile(croppedImage);
            onImageSelected({ file: croppedImage, url });
        }
    };

    const handleCorpDialogClose = () => {
        setFile(null);
        const dt = new DataTransfer();
        const input = document.getElementById(`upload-file`);
        input.files = dt.files;
    }

    return (
        <>
            <label htmlFor="upload-file">{children}</label>
            {!disabled && <input id="upload-file" className='el-hide' type="file" single="true" onChange={onFileChange} accept=".png,.jpg,.jpeg,.bmp,.webp" />}
            {
                file && crop &&
                <ElDialog open={file && crop} onClose={handleCorpDialogClose} title="Crop image" >
                    <ElImageCropper onCropCompleted={handleUploadImage} file={file} cropShape={cropShape} />
                </ElDialog>
            }
        </>
    );
}

ElImageUploader.defaultProps = {
    crop: false,
    cropShape: "round",
};

export default ElImageUploader;
