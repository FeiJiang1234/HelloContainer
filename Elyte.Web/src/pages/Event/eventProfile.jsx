import React, { useEffect, useState } from 'react';
import { ElBox, ElBody, ElAddress, ElButton } from 'components';
import { Typography, Box, Divider, CardMedia, Tabs, Tab } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useLocation, useHistory } from 'react-router-dom';
import { eventService, athleteService, authService } from 'services';
import moment from 'moment';
import { Idiograph } from 'parts';
import { useProfileRoute } from 'utils';

const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        paddingRight: theme.spacing(2),
        paddingLeft: theme.spacing(2),
        paddingBottom: theme.spacing(10)
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    timeContainer: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    time: {
        fontSize: 18,
        fontWeight: 700,
        color: theme.palette.body.main
    },
    to: {
        fontSize: 15,
        fontWeight: 650,
        color: theme.palette.body.main
    },
    tab: {
        '& .MuiTabs-indicator': {
            display: 'none',
        },
    },
    tabWrapper: {
        margin: '0 auto'
    },
    itemLabel: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        '& svg': {
            stroke: theme.palette.body.light,
            strokeWidth: 0,
            width: '20px',
            height: '20px',
        },
    }
}));

const EventProfile = () => {
    const classes = useStyles();
    const currentUser = authService.getCurrentUser();
    const history = useHistory();
    const location = useLocation();
    const eventId = location.state.params;
    const [profile, setProfile] = useState();
    const [url, setUrl] = useState();
    const [value, setValue] = useState(0);
    const [participants, setParticipants] = useState([]);
    const { athleteProfile } = useProfileRoute();
    const [noEvent, setNoEvent] = useState(false);

    useEffect(() => getMyEventProfile(), []);

    useEffect(() => {
        if(!profile) return;

        getParticipants();
    }, [profile]);

    const getMyEventProfile = async () => {
        const res = await eventService.getEventProfile(eventId);
        if (res && res.code === 200) {
            if(res.value){
                setProfile(res.value);
            }else{
                setNoEvent(true);
            }
        }

        setUrl(res.value?.imageUrl ? res.value.imageUrl : 'images/EventCongratulations.png');
    }

    const getParticipants = async () => {
        const res = await eventService.getEventParticipants(profile.id);
        setParticipants(res.value);
    };

    const handleRegisterClick = async () => {
        await athleteService.registerToEvent(currentUser.id, profile.eventId);
        const res = await eventService.getEventProfile(eventId);
        setProfile(res.value);
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleShareClick = () => {
        history.push('/eventShare', { params: eventId });
    };

    const handleFollowClick = async (athleteId) => {
        const res = await athleteService.followUser(currentUser.id, athleteId);
        if (res && res.code === 200) {
            getParticipants();
        }
    };

    const handleUnfollowClick = async (athleteId) => {
        const res = await athleteService.unfollowUser(currentUser.id, athleteId);
        if (res && res.code === 200) {
            getParticipants();
        }
    };

    return (
        <>
            {
                profile
                &&
                <>
                    <CardMedia image={url} component="img" sx={{ marginTop: '-10px' }} />
                        <Box className={classes.container}>
                            <Box mt={2} className={classes.header}>
                                <Box >
                                    <Typography sx={{ fontSize: 25, color: '#000000', fontWeight: 700 }} >{profile.title}</Typography>
                                    <Typography sx={{ fontSize: 15, color: 'body.light', fontWeight: 400 }} >{profile.sportOption}</Typography>
                                </Box>
                                <Box>
                                    <Typography className={classes.time}>
                                        {moment(profile.startTime).format('YYYY-MM-DD hh:mm a')}
                                    </Typography>
                                    <Typography className={classes.to}>To</Typography>
                                    <Typography className={classes.time}>
                                        {moment(profile.endTime).format('YYYY-MM-DD hh:mm a')}
                                    </Typography>
                                </Box>
                            </Box>
                            <ElBody mt={2}>{profile.details}</ElBody>
                            <ElAddress mt={2} mb={2} className="profile-address" country={profile.country} state={profile.state} city={profile.city} />
                            <Divider className="mb-8" />
                            <Tabs ml={10} variant="scrollable" className={classes.tab} value={value} onChange={handleChange}>
                                <Tab className={classes.tabWrapper} value={0} disableRipple={true} icon={<ElButton disabled={value !== 0} small component="a">Participants</ElButton>} />
                                <Tab className={classes.tabWrapper} value={1} disableRipple={true} icon={<ElButton disabled={value !== 1} small component="a">Event Details</ElButton>} />
                            </Tabs>
                            {
                                value === 0 &&
                                <Box>
                                    {
                                        !Array.isNullOrEmpty(participants) &&
                                        participants.map((item) => (
                                            <Box key={item.id} mt={1} mb={1} className={classes.itemLabel}>
                                                <Idiograph to={athleteProfile(item.id)} title={item.title} centerTitle={item.centerTitle} subtitle={item.subtitle} imgurl={item.avatarUrl}></Idiograph>
                                                <span className="fillRemain"></span>
                                                {
                                                    !item.isFollowed && item.id != currentUser.id &&
                                                    <ElButton small onClick={() => handleFollowClick(item.id)}>Follow</ElButton>
                                                }
                                                {
                                                    item.isFollowed && item.id != currentUser.id &&
                                                    <ElButton small onClick={() => handleUnfollowClick(item.id)}>Unfollow</ElButton>
                                                }
                                            </Box>
                                        ))
                                    }
                                    {Array.isNullOrEmpty(participants) && <ElBox center>No event participant</ElBox>}
                                </Box>
                            }
                            {!profile.isRegistered && <ElButton className="mt-16" onClick={() => handleRegisterClick()}>Register to the event</ElButton>}
                            {profile.isCreator && <ElButton className="mt-16" onClick={() => handleShareClick()}>Share</ElButton>}
                        </Box>
                </>
            }
            {
                noEvent && <Typography mt={4} sx={{ textAlign: 'center', color: '#808A9E' }}>Cannot find event</Typography>
            }
        </>
    );
};

export default EventProfile;