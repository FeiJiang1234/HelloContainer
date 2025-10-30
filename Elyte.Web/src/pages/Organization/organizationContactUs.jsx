import React, { useEffect, useState } from 'react';
import { ElSvgIcon } from 'components';
import { Grid, Divider, Box } from '@mui/material';
import { leagueService, tournamentService, associationService } from 'services';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(({
    title: {
        fontSize: 15,
        weight: 400,
        color: '#B0B8CB'
    },
    content: {
        fontSize: 15,
        weight: 400,
        color: '#808A9E'
    }
}));

const OrganizationContactUs = ({ organizationId, organizationType }) => {
    const [leagueContactUs, setLeagueContactUs] = useState({});
    const classes = useStyles();

    useEffect(() => {
        getContacts();
    }, []);

    const getContacts = async () => {
        const res = await getContactService();
        if (res && res.code === 200) setLeagueContactUs(res.value[0]);
    }

    const getContactService = () => {
        if (organizationType === 'League')
            return leagueService.getContactUs(organizationId);
        if (organizationType === 'Tournament')
            return tournamentService.getContactUs(organizationId);
        if (organizationType === 'Association')
            return associationService.getContactUs(organizationId);
    }


    return (
        <Box flexGrow={1} mt={2}>
            <Grid container spacing={1}>
                <Grid item xs={12}><Box className={classes.title}>Phone (Owner)</Box></Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={1}><ElSvgIcon light small name="phone" /></Grid>
                <Grid item xs={11}><Box className={classes.content}>{leagueContactUs.phoneNumber}</Box></Grid>
            </Grid>
            <Divider className="divider" />
            <Grid container spacing={1}>
                <Grid item xs={12}><Box className={classes.title}>Email (Owner)</Box></Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={1}><ElSvgIcon light small name="email" /></Grid>
                <Grid item xs={11}><Box className={classes.content}>{leagueContactUs.email}</Box></Grid>
            </Grid>
        </Box>
    );
};

export default OrganizationContactUs;
