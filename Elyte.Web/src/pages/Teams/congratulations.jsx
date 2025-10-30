import React, { useEffect, useState } from 'react';
import { ElBox, ElTitle, ElButton, ElBody, ElAddress, ElAvatar } from 'components';
import { Typography, Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useLocation, useHistory } from 'react-router-dom';
import { utils } from 'utils';
import { teamService } from 'services';

const useStyles = makeStyles(theme => ({
    img: {
        width: theme.spacing(2.3),
        height: theme.spacing(1.5),
        marginLeft: theme.spacing(1),
    },
    root: {
        textAlign: 'center',
        color: theme.palette.body.main,
        fontSize: '12px',
        '& .notice': {
            fontWeight: '500',
            fontSize: '15px',
        },
        '& .title': {
            fontWeight: 'bolder',
            fontSize: '25px',
            color: '#000000',
        },
        '& .tip': {
            fontWeight: '400',
            fontSize: '12px',
            color: '#C0C5D0',
        },
        '& svg': {
            stroke: theme.palette.body.main,
            marginRight: theme.spacing(1),
        },
    }
}));

const Congratulations = () => {
    const classes = useStyles();
    const location = useLocation();
    const routerParams = location?.state?.params;
    const [url, setUrl] = useState();
    const [address, setAddress] = useState({});
    const history = useHistory();

    if (!routerParams) {
        history.push('/');
    }

    if (routerParams?.image[0]) {
        utils.readFile(routerParams.image[0]).then(d => {
            setUrl(d);
        });
    }

    useEffect(() => {
        getTeamProfile();
    }, []);

    const getTeamProfile = async () => {
        const res = await teamService.getTeamProfile(routerParams.id);
        if (res && res.code === 200) {
            setAddress({ country: res.value.country, state: res.value.state, city: res.value.city });
        }
    }

    const handleGoToProfile = () => {
        history.push("/teamProfile", { params: routerParams.id });
    }

    return (
        <Box p={2} className={classes.root}>
            <ElTitle>CONGRATULATIONS!</ElTitle>
            <Typography className="notice">You have successfully created a new team!</Typography>
            <Box className='x-center' mt={6} mb={4}>
                <ElAvatar src={url} xlarge />
            </Box>
            <Typography className="title">{routerParams.name}</Typography>
            <Typography className="tip">{routerParams.sportType}</Typography>
            <Box align="center" mt={2} mb={2}>
                <ElBody>{routerParams.bio}</ElBody>
            </Box>
            <ElBox center mb={6}>
                <ElAddress className="profile-address" hideLocationIcon country={address?.country} state={address?.state} city={address?.city} />
            </ElBox>
            <ElButton onClick={handleGoToProfile}>Go to Team&apos;s profile</ElButton>
        </Box>
    );
};

export default Congratulations;
