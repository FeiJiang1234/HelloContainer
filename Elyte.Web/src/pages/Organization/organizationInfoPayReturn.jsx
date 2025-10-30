import React, { useEffect, useState } from 'react';
import { ElAvatar, ElLink } from 'components';
import { leagueService, tournamentService, facilityService } from 'services';
import { Box, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { OrganizationType } from 'enums';

const useStyles = makeStyles(() => ({
    info: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
    }
}));

const OrganizationInfoPayReturn = ({ organizationId, organizationType }) => {
    const [profile, setProfile] = useState({});
    const classes = useStyles();

    useEffect(() => {
        if (organizationId)
            getProfile();
    }, []);


    const getProfile = async () => {
        const res = await getProfileService();
        if (res && res.code === 200) setProfile(res.value);
    }

    const getProfileService = () => {
        if (organizationType === OrganizationType.League)
            return leagueService.getLeague(organizationId);
        if (organizationType === OrganizationType.Tournament)
            return tournamentService.getTournament(organizationId);
        if (organizationType === OrganizationType.Facility)
            return facilityService.getFacility(organizationId);
    }

    const getProfileLink = () => {
        if (organizationType === OrganizationType.League)
            return { pathname: '/leagueProfile', state: { params: organizationId } };
        if (organizationType === OrganizationType.Tournament)
            return { pathname: '/tournamentProfile', state: { params: organizationId } };
        if (organizationType === OrganizationType.Facility)
            return { pathname: '/facilityProfile', state: { params: organizationId } };
    }

    return <>
        <ElLink to={getProfileLink}>
            <Box mt={3} className={classes.info}>
                <ElAvatar src={profile?.imageUrl} />
                <Typography ml={1} className="profile-title">{profile?.name}</Typography>
            </Box>
        </ElLink>
    </>

};

export default OrganizationInfoPayReturn;