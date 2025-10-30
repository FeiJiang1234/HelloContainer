import React, { useState, useEffect } from 'react';
import { Box } from '@mui/system';
import { ElBody } from 'components';
import { leagueService } from 'services';
import FileCategory from 'pages/Organization/fileCategory';
import OrganizationFileDialog from 'pages/Organization/organizationFileDialog';

const LeagueFile = ({ leagueId }) => {
    const [leagueFile, setleagueFile] = useState({});
    const { termsAndConditions, waiverDoc, coviD19Waiver, additionalDoc, isAdmin } = leagueFile;

    useEffect(() => getFiles(), []);

    const getFiles = async () => {
        const res = await leagueService.getLeagueFiles(leagueId);
        if (res && res.code === 200) setleagueFile(res.value);
    };

    const getFileCount = () => {
        return termsAndConditions?.length + waiverDoc?.length + coviD19Waiver?.length + additionalDoc?.length;
    }

    const handleDeleteFile = async (fileId) => {
        const res = await leagueService.deleteLeagueFile(leagueId, fileId);
        if (res && res.code === 200) getFiles();
    };

    const handleAddFiles = async (formData) => {
        const res = await leagueService.addLeagueFiles(leagueId, formData);
        if (res && res.code === 200) getFiles();
    }

    return (
        <>
            <Box mt={1} mb={1} className="flex-sb">
                <ElBody>All documents ({getFileCount() || 0})</ElBody>
                {isAdmin && <OrganizationFileDialog title="Add league files" onAddFiles={handleAddFiles} />}
            </Box>
            <FileCategory title="Terms and Conditions" files={termsAndConditions} onDeleteFile={handleDeleteFile} isShowDelete={isAdmin} />
            <FileCategory title="Waiver Doc" files={waiverDoc} onDeleteFile={handleDeleteFile} isShowDelete={isAdmin} />
            <FileCategory title="COVID19 Waiver" files={coviD19Waiver} onDeleteFile={handleDeleteFile} isShowDelete={isAdmin} />
            <FileCategory title="Additional Doc" files={additionalDoc} onDeleteFile={handleDeleteFile} isShowDelete={isAdmin} />
        </>
    );
};

export default LeagueFile;
