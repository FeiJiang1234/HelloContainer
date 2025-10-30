import React, { useState } from 'react';
import { ElButton, ElDialog, ElFileUploader } from 'components';
import { useFile, utils } from 'utils';
import { FileUploadType } from 'enums';
import { useForm } from 'react-hook-form';

const OrganizationFileDialog = ({ title, onAddFiles }) => {
    const [showAddFilesDialog, setShowAddFilesDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit } = useForm();
    const { setFiles, setFormDataFiles, isFileOverSize, cleanFile } = useFile();

    const handleAddFiles = async (data) => {
        setLoading(true);
        const formData = utils.formToFormData(data);
        setFormDataFiles(formData);
        await onAddFiles(formData);
        setLoading(false);
        handleCloseAddFilesDialog();
    }

    const handleOpenAddFilesDialog = () => setShowAddFilesDialog(true);
    const handleCloseAddFilesDialog = () => {
        setShowAddFilesDialog(false);
        cleanFile();
    }

    return (
        <>
            <span className="text-btn-green" onClick={() => handleOpenAddFilesDialog()}>+ Add new</span>
            {
                showAddFilesDialog &&
                <ElDialog open={showAddFilesDialog} onClose={handleCloseAddFilesDialog} title={title}
                    actions={
                        <>
                            <ElButton onClick={handleCloseAddFilesDialog}>Cancel</ElButton>
                            <ElButton className="green" loading={loading} onClick={handleSubmit(handleAddFiles)} disabled={isFileOverSize()}>Save</ElButton>
                        </>
                    }>
                    <form autoComplete="off" onSubmit={handleSubmit(handleAddFiles)}>
                        <ElFileUploader label="Terms and Conditions*" type={FileUploadType.TermsAndConditions} onRegister={register} onSetFiles={setFiles} />
                        <ElFileUploader label="Waiver Doc*" type={FileUploadType.WaiverDoc} onRegister={register} onSetFiles={setFiles} />
                        <ElFileUploader label="COVID 19 Waiver" type={FileUploadType.COVID19Waiver} onRegister={register} onSetFiles={setFiles} />
                        <ElFileUploader label="Additional Documents" type={FileUploadType.AdditionalDoc} onRegister={register} onSetFiles={setFiles} />
                    </form>
                </ElDialog>
            }
        </>
    );
};

export default OrganizationFileDialog;