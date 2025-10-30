import React, { useState } from 'react';
import { ElBox, ElSvgIcon, ElDialog, ElButton } from 'components';
import { Box } from '@mui/material';
import { useProfileRoute } from 'utils';
import { leagueService, tournamentService } from 'services';
import IdiographRow from 'parts/Commons/idiographRow';

const OrganizationTeams = ({ teams, isAdminView, organizationType, organizationId, onRefresh, ...rest }) => {
    const { teamProfile } = useProfileRoute();
    const [openConfirmDiolog, setOpenConfirmDiolog] = useState();
    const [targetTeamId, setTargetTeamId] = useState();
    const [saving, setSaving] = useState(false);

    const handleRemoveClick = (teamId) => {
        setOpenConfirmDiolog(true);
        setTargetTeamId(teamId)
    }

    const getService = (type) => {
        if (type === "League") {
            return leagueService.removeTeamFromLeague(organizationId, targetTeamId);
        }
        if (type === "Tournament") {
            return tournamentService.removeTeamFromTournament(organizationId, targetTeamId);
        }
    }

    const handleYesClick = async () => {
        if (!organizationType) { return; }

        setSaving(true);
        const res = await getService(organizationType)
        if (res && res.code === 200) {
            setOpenConfirmDiolog(false);
            if (onRefresh) {
                onRefresh();
            }
        }
        setSaving(false);
    }

    return (
        <Box sx={rest.sx} pb={10}>
            {Array.isNullOrEmpty(teams) && <ElBox center>No Teams</ElBox>}
            {
                !Array.isNullOrEmpty(teams) && teams.map(item =>
                    <IdiographRow key={item.id} noDivider to={teamProfile(item.id)} title={item.title} subtitle={item.subtitle} centerTitle={item.centerTitle} imgurl={item.avatarUrl}>
                        {isAdminView && <ElSvgIcon light xSmall name="close" onClick={() => handleRemoveClick(item.id)} />}
                    </IdiographRow>
                )
            }
            {
                openConfirmDiolog &&
                <ElDialog open={openConfirmDiolog}
                    title="Are you sure you want to remove this team?"
                    actions={
                        <>
                            <ElButton onClick={() => setOpenConfirmDiolog(false)}>No</ElButton>
                            <ElButton className="green" onClick={handleYesClick} loading={saving}>Yes</ElButton>
                        </>
                    }>
                </ElDialog>
            }
        </Box>
    );
};

export default OrganizationTeams;
