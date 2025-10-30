import React, { useState, useEffect } from 'react';
import { Box } from '@mui/system';
import { ElBody } from 'components';
import { tournamentService } from 'services';
import FileCategory from 'pages/Organization/fileCategory';
import OrganizationFileDialog from 'pages/Organization/organizationFileDialog';

const TournamentFile = ({ tournamentId }) => {
    const [tournamentFile, setTournamentFile] = useState({});
    const { termsAndConditions, waiverDoc, coviD19Waiver, additionalDoc, isAdmin } = tournamentFile;

    useEffect(() => getFiles(), []);

    const getFiles = async () => {
        const res = await tournamentService.getTournamentFiles(tournamentId);
        if (res && res.code === 200) setTournamentFile(res.value);
    };

    const getFileCount = () => {
        return termsAndConditions?.length + waiverDoc?.length + coviD19Waiver?.length + additionalDoc?.length;
    }

    const handleDeleteFile = async (fileId) => {
        const res = await tournamentService.deleteTournamentFile(tournamentId, fileId);
        if (res && res.code === 200) getFiles();
    };

    const handleAddFiles = async (formData) => {
        const res = await tournamentService.addTournamentFiles(tournamentId, formData);
        if (res && res.code === 200) getFiles();
    }

    return (
        <Box pb={10}>
            <Box mt={2} mb={2} className="flex-sb">
                <ElBody>All documents ({getFileCount() || 0})</ElBody>
                {isAdmin && <OrganizationFileDialog title="Add tournament files" onAddFiles={handleAddFiles} />}
            </Box>
            <FileCategory title="Terms and Conditions" files={termsAndConditions} onDeleteFile={handleDeleteFile} isShowDelete={isAdmin} />
            <FileCategory title="Waiver Doc" files={waiverDoc} onDeleteFile={handleDeleteFile} isShowDelete={isAdmin} />
            <FileCategory title="COVID19 Waiver" files={coviD19Waiver} onDeleteFile={handleDeleteFile} isShowDelete={isAdmin} />
            <FileCategory title="Additional Doc" files={additionalDoc} onDeleteFile={handleDeleteFile} isShowDelete={isAdmin} />
        </Box>
    );
};

export default TournamentFile;
