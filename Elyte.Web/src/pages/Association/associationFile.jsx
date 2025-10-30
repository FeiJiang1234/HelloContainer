import React, { useState, useEffect } from 'react';
import { Box } from '@mui/system';
import { ElBody } from 'components';
import { associationService } from 'services';
import FileCategory from 'pages/Organization/fileCategory';
import OrganizationFileDialog from 'pages/Organization/organizationFileDialog';

const AssociationFile = ({ associationId }) => {
    const [associationFile, setassociationFile] = useState({});
    const { termsAndConditions, waiverDoc, coviD19Waiver, additionalDoc, isAdmin } = associationFile;

    useEffect(() => getFiles(), []);

    const getFiles = async () => {
        const res = await associationService.getAssociationFiles(associationId);
        if (res && res.code === 200) setassociationFile(res.value);
    };

    const getFileCount = () => {
        return termsAndConditions?.length + waiverDoc?.length + coviD19Waiver?.length + additionalDoc?.length;
    }

    const handleDeleteFile = async (fileId) => {
        const res = await associationService.deleteAssociationFile(associationId, fileId);
        if (res && res.code === 200) getFiles();
    };

    const handleAddFiles = async (formData) => {
        const res = await associationService.addAssociationFiles(associationId, formData);
        if (res && res.code === 200) getFiles();
    }

    return (
        <Box pb={10}>
            <Box mt={2} mb={2} className="flex-sb">
                <ElBody>All documents ({getFileCount()})</ElBody>
                {isAdmin && <OrganizationFileDialog title="Add association files" onAddFiles={handleAddFiles} />}
            </Box>
            <FileCategory title="Terms and Conditions" files={termsAndConditions} onDeleteFile={handleDeleteFile} isShowDelete={isAdmin} />
            <FileCategory title="Waiver Doc" files={waiverDoc} onDeleteFile={handleDeleteFile} isShowDelete={isAdmin} />
            <FileCategory title="COVID19 Waiver" files={coviD19Waiver} onDeleteFile={handleDeleteFile} isShowDelete={isAdmin} />
            <FileCategory title="Additional Doc" files={additionalDoc} onDeleteFile={handleDeleteFile} isShowDelete={isAdmin} />
        </Box>
    );
};

export default AssociationFile;
