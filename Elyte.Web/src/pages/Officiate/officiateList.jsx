import React, { useState, useEffect } from 'react';
import { ElTitle, ElBox, ElLinkBtn, ElSvgIcon, ElDialog, ElButton } from 'components';
import { Box, Divider, Typography } from '@mui/material';
import { useHistory, useLocation } from 'react-router-dom';
import { leagueService, tournamentService, associationService, athleteService } from 'services';
import IdiographRow from 'parts/Commons/idiographRow';
import { useProfileRoute } from 'utils';
import { styled } from '@mui/system';
import RequestItem from './components/requestItem';

const Label = styled(Typography)(() => { return { color: '#B0B8CB', fontSize: 15, fontWeight: 500 }; });

const OfficiateList = () => {
    const history = useHistory();
    const location = useLocation();
    const routerParams = location.state.params;
    const [officiateList, setOfficiateList] = useState([]);
    const [officiateRequestList, setOfficiateRequestList] = useState([]);
    const [saving, setSaving] = useState(false);
    const { athleteProfile } = useProfileRoute();
    const [openConfirmDiolog, setOpenConfirmDiolog] = useState();
    const [targetAthleteId, setTargetAthleteId] = useState();

    useEffect(() => initQuery(), [routerParams]);

    const initQuery = () => {
        getOfficiates();
        if (routerParams.isAdminView) {
            getOfficiateRequests();
        }
    }

    const buildQueryOfficiateService = () => {
        if (routerParams.type === "League") {
            return leagueService.getLeagueOfficiates(routerParams.id);
        }

        if (routerParams.type === "Tournament") {
            return tournamentService.getTournamentOfficiates(routerParams.id);
        }

        if (routerParams.type === "Association") {
            return associationService.getAssociationOfficiates(routerParams.id);
        }
    }

    const buildOfficiateRequestService = () => {
        if (routerParams.type === "League") {
            return leagueService.getLeagueOfficiateRequests(routerParams.id);
        }

        if (routerParams.type === "Tournament") {
            return tournamentService.getTournamentOfficiateRequests(routerParams.id);
        }

        if (routerParams.type === "Association") {
            return associationService.getAssociationOfficiateRequests(routerParams.id);
        }
    }

    const removeOfficiate = () => {
        if (routerParams.type === "League") {
            return athleteService.removeLeagueOfficiate(targetAthleteId, routerParams.id);
        }

        if (routerParams.type === "Tournament") {
            return athleteService.removeTournamentOfficiate(targetAthleteId, routerParams.id);
        }

        if (routerParams.type === "Association") {
            return athleteService.removeAssociationOfficiate(targetAthleteId, routerParams.id);
        }
    }

    const getOfficiateRequests = async () => {
        const res = await buildOfficiateRequestService();
        if (res && res.code === 200) {
            setOfficiateRequestList(res.value);
        }
    }

    const getOfficiates = async () => {
        const res = await buildQueryOfficiateService();
        if (res && res.code === 200) {
            setOfficiateList(res.value);
        }
    }

    const handleBecomeOfficiateClick = () => {
        history.push('/becomeOfficiate', location.state);
    }

    const handleViewAllClick = () => {
        history.push('/officiateRequests', location.state);
    }

    const handleRemoveClick = (athleteId) => {
        setOpenConfirmDiolog(true);
        setTargetAthleteId(athleteId)
    }

    const handleYesClick = async () => {
        setSaving(true);
        const res = await removeOfficiate()
        if (res && res.code === 200) {
            setOpenConfirmDiolog(false);
            setOfficiateList(officiateList.filter(item => item.athleteId != targetAthleteId));
        }
        setSaving(false);
    }

    return (
        <>
            <ElTitle center>Officiate List</ElTitle>
            <ElLinkBtn mb={2} onClick={handleBecomeOfficiateClick}>+ Become an officiate</ElLinkBtn>
            <Divider />
            <Box className='scroll-container' mt={2} sx={{ maxHeight: (theme) => `calc(100vh - ${theme.spacing(35)})` }}>
                {
                    Array.isNullOrEmpty(officiateList) && <ElBox center>No Officiates</ElBox>
                }
                {
                    routerParams.isAdminView && !Array.isNullOrEmpty(officiateRequestList) &&
                    <>
                        <Box sx={{ display: 'flex' }}>
                            <Label>Requesting to Join</Label>
                            <span className="fillRemain"></span>
                            <ElLinkBtn onClick={handleViewAllClick}>View All</ElLinkBtn>
                        </Box>
                        {
                            !Array.isNullOrEmpty(officiateRequestList) &&
                            officiateRequestList.map(item => <RequestItem
                                key={'officiate-request-' + item.requestId}
                                organizationType={routerParams.type}
                                organizationId={routerParams.id}
                                item={item} onHandleSuccess={() => initQuery()} />)
                        }
                    </>
                }
                {
                    routerParams.isAdminView && <Label sx={{ marginTop: 2 }}>Registered Officiates</Label>
                }
                {
                    !Array.isNullOrEmpty(officiateList) && officiateList.map((item) =>
                        <IdiographRow key={'officiate-' + item.athleteId} noDivider title={item.name}
                            to={athleteProfile(item.athleteId)}
                            subtitle={<>{item.officiateType === 'Association' && <Typography>({item.officiateType})</Typography>}</>}
                            imgurl={item.pictureUrl}>
                            {routerParams.isAdminView && <ElSvgIcon light xSmall name="close" onClick={() => handleRemoveClick(item.athleteId)} />}

                        </IdiographRow>
                    )
                }
                {
                    openConfirmDiolog &&
                    <ElDialog open={openConfirmDiolog}
                        title="Are you sure you want to remove this officiate?"
                        actions={
                            <>
                                <ElButton onClick={() => setOpenConfirmDiolog(false)}>No</ElButton>
                                <ElButton className="green" onClick={handleYesClick} loading={saving}>Yes</ElButton>
                            </>
                        }>
                    </ElDialog>
                }
            </Box>
        </>
    );
};

export default OfficiateList;
