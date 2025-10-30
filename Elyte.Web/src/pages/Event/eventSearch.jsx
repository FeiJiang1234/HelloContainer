import React, { useState } from 'react';
import { ElTitle, ElSearchBox } from 'components';
import { Box } from '@mui/material';
import { eventService } from 'services';
import { makeStyles } from '@mui/styles';
import Idiograph from './../../parts/Commons/idiograph';
import { useLocation } from 'react-router-dom';
import { useProfileRoute } from 'utils';

const useStyles = makeStyles(theme => {
    return {
        itemLabel: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            '& svg': {
                stroke: theme.palette.body.light,
                strokeWidth: 0,
            },
            '& a': {
                textDecoration: 'none',
            },
        },
    };
});

const EventSearch = () => {
    const classes = useStyles();
    const location = useLocation();
    const events = location.state.param;
    const [searchedEvents, setSearchedEvents] = useState(events);
    const { eventProfile } = useProfileRoute();

    const searchEvents = async value => {
        const res = await eventService.searchEvent(value);
        setSearchedEvents(res.value);
    };

    return (
        <>
            <ElTitle center>Search Event</ElTitle>
            <ElSearchBox mb={2} onChange={searchEvents} />
            {!Array.isNullOrEmpty(searchedEvents) && searchedEvents.map((item) => (
                <Box key={item.id} mt={1} mb={1} className={classes.itemLabel}>
                    <Idiograph to={eventProfile(item.id)} title={item.title} imgurl={item.imageUrl} subtitle={item.city + ' ' + item.state + ' ' + item.country} />
                    <span className="fillRemain"></span>
                </Box>
            ))}
        </>
    );
};

export default EventSearch;
