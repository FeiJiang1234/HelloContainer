import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ElSvgIcon } from 'components';
import RenderTimeLine from './components/renderTimeLine';
import { calendarService, leagueService, tournamentService } from 'services';
import { monthOfYearList } from '../../models/common';
import * as moment from 'moment';

const useStyles = makeStyles(theme => ({
    calendarTitleContainer: {
        fontSize: '20px',
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gridGap: theme.spacing(0)
    },
    calendarLeftArrow: {
        gridColumnEnd: 'span 1'
    },
    calendarRightArrow: {
        gridColumnEnd: 'span 1'
    },
    calendarTitle: {
        gridColumnEnd: 'span 10',
        textAlign: 'center',
        color: theme.palette.body.main,
        fontWeight: 500,
    }
}));

const CalendarDailyView = ({ date, isOrganizationAdminView, organizationType, organizationId }) => {
    const classes = useStyles();
    const [currentDate, setCurrentDate] = useState(date ? moment(date) : moment());
    const [scheduleList, setScheculeList] = useState([]);
    const [dayViewTitle, setDayViewTitle] = useState();

    useEffect(() => {
        let monthName = monthOfYearList[currentDate.month()].fullName;
        setDayViewTitle(monthName + " " + currentDate.date() + ", " + currentDate.year());
        if (!isOrganizationAdminView) {
            return getItemsDisplayInCalendar(currentDate.format("YYYY-MM-DD"), currentDate.format("YYYY-MM-DD"));
        }
        if (isOrganizationAdminView) {
            return getOrganizationDailyGames(currentDate.format("YYYY-MM-DD"), organizationType, organizationId);
        }
    }, [currentDate, isOrganizationAdminView]);

    const getItemsDisplayInCalendar = async (startDate, endDate) => {
        let serviceData = new Array();
        const eventsAndReminders = await calendarService.getItemsDisplayInCalendar(startDate, endDate);
        if (eventsAndReminders && eventsAndReminders.code === 200 && eventsAndReminders.value.length > 0) {
            serviceData = eventsAndReminders.value;
        }
        setScheculeList(serviceData);
    }

    const getOrganizationDailyGames = async (targetDate, type, id) => {
        let res = {};
        switch (type) {
            case "League": res = await leagueService.getLeagueGamesByDate(id, targetDate); break;
            case "Tournament": res = await tournamentService.getTournamentGamesByDate(id, targetDate); break;
        }

        if (res && res.code === 200)
            setScheculeList(res.value);
    }

    const handlePreviousDayClick = () => {
        setCurrentDate(moment(currentDate.add(-1, 'd').format("YYYY-MM-DD")));
    }

    const handleNextDayClick = () => {
        setCurrentDate(moment(currentDate.add(1, 'd').format("YYYY-MM-DD")));
    }

    const handleReload = () => {
        getItemsDisplayInCalendar(currentDate.format("YYYY-MM-DD"), currentDate.format("YYYY-MM-DD"));
    }

    return <>
        <Box className={classes.calendarTitleContainer}>
            <Box className={classes.calendarLeftArrow} onClick={handlePreviousDayClick}>
                <ElSvgIcon dark xSmall name="leftArrow"></ElSvgIcon>
            </Box>
            <Box className={classes.calendarTitle}>
                <Typography>{dayViewTitle}</Typography>
            </Box>
            <Box className={classes.calendarRightArrow} onClick={handleNextDayClick}>
                <ElSvgIcon dark xSmall name="rightArrow"></ElSvgIcon>
            </Box>
        </Box>
        <RenderTimeLine initData={scheduleList} onReload={handleReload} />
    </>
};

export default CalendarDailyView;