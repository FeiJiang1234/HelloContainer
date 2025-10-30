import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ElSvgIcon } from 'components';
import { monthOfYearList, weekTabs } from '../models/common';
import * as moment from 'moment';
import _ from 'lodash';


const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        height: 70,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    titleContainer: {
        fontSize: '20px',
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gridGap: theme.spacing(0)
    },
    leftArrow: {
        gridColumnEnd: 'span 1'
    },
    lightArrow: {
        gridColumnEnd: 'span 1'
    },
    title: {
        gridColumnEnd: 'span 10',
        textAlign: 'center',
        color: theme.palette.body.main,
        fontWeight: 500,
    },
    button: {
        background: theme.bgPrimary,
        width: 44,
        flex: 1,
        minWidth: 44,
        marginRight: 2,
        marginLeft: 2,
        color: 'white',
        fontSize: 20,
        textAlign: 'center'
    },
    clickedButton: {
        background: theme.bgClicked
    },
    dayNumber: {
        color: '#c0c5d0',
        fontSize: 18
    }
}));

const CalendarWeeksTab = ({ onDayTabClick }) => {
    const classes = useStyles();
    const [weeklyViewTitle, setWeeklyViewTitle] = useState();
    const [currentSelectDay, setCurrentSelectDay] = useState(new Date());
    const [currentWeeks, setCurrentWeeks] = useState([]);

    let fullWeekDays = _.cloneDeep(weekTabs);

    useEffect(() => {
        if (!Array.isNullOrEmpty(currentWeeks)) {
            buildWeekViewTitle();
        }
    }, [currentWeeks]);

    useEffect(() => {
        var currentDayOfWeek = currentSelectDay.getDay();
        let currentWeek = fullWeekDays[currentDayOfWeek]

        //forward fill day into weekTabs;
        for (let index = 1; index <= currentWeek.forwardFillDays; index++) {
            let newDate = new Date(currentSelectDay);
            newDate.setDate(newDate.getDate() - index);
            fullWeekDays[currentDayOfWeek - index].date = newDate;
            fullWeekDays[currentDayOfWeek - index].day = newDate.getDate();
        }

        //fill current date into weekTabs;
        fullWeekDays[currentDayOfWeek].date = currentSelectDay;
        fullWeekDays[currentDayOfWeek].day = currentSelectDay.getDate();

        //back fill day into weekTabs
        for (let index = 1; index <= currentWeek.backFillDays; index++) {
            let newDate = new Date(currentSelectDay);
            newDate.setDate(newDate.getDate() + index);
            fullWeekDays[currentDayOfWeek + index].date = newDate;
            fullWeekDays[currentDayOfWeek + index].day = newDate.getDate();
        }
        setCurrentWeeks(fullWeekDays);
    }, [currentSelectDay]);

    const buildPreviousWeeks = () => {
        const firstOfWeek = currentWeeks[0].date;
        for (let index = 0; index < 7; index++) {
            let newDate = new Date(firstOfWeek);
            newDate.setDate(newDate.getDate() - (7 - index));
            fullWeekDays[index].date = newDate;
            fullWeekDays[index].day = newDate.getDate();
        }

        setCurrentWeeks(fullWeekDays);
        handleDayClick(fullWeekDays[fullWeekDays.length - 1]);
    }

    const buildWeekViewTitle = () => {
        const firstDay = new Date(currentWeeks[0].date);
        const lastDay = new Date(currentWeeks[currentWeeks.length - 1].date);
        let title = "";
        const isSameYear = firstDay.getFullYear() === lastDay.getFullYear();
        const isSameMonth = firstDay.getMonth() === lastDay.getMonth();

        if (isSameYear && isSameMonth) {
            title = monthOfYearList[firstDay.getMonth()].fullName + " " + firstDay.getDate() + " — " + lastDay.getDate() + ", " + firstDay.getFullYear();
            setWeeklyViewTitle(title);
            return;
        }

        if (!isSameYear) {
            title = monthOfYearList[firstDay.getMonth()].shortName + " " + firstDay.getDate() + ", " + firstDay.getFullYear() + " — ";
            title += monthOfYearList[lastDay.getMonth()].shortName + " " + lastDay.getDate() + ", " + lastDay.getFullYear();
            setWeeklyViewTitle(title);
            return;
        }

        if (!isSameMonth) {
            title = monthOfYearList[firstDay.getMonth()].shortName + " " + firstDay.getDate() + " — ";
            title += monthOfYearList[lastDay.getMonth()].shortName + " " + lastDay.getDate() + ", " + firstDay.getFullYear();
            setWeeklyViewTitle(title);
        }
    }

    const buildNextWeeks = () => {
        const firstOfWeek = currentWeeks[currentWeeks.length - 1].date;
        for (let index = 0; index < 7; index++) {
            let newDate = new Date(firstOfWeek);
            newDate.setDate(newDate.getDate() + index + 1);
            fullWeekDays[index].date = newDate;
            fullWeekDays[index].day = newDate.getDate();
        }

        setCurrentWeeks(fullWeekDays);
        handleDayClick(fullWeekDays[0]);
    }

    const handleDayClick = async (e) => {
        setCurrentSelectDay(e.date);
        if (onDayTabClick) {
            onDayTabClick(e.date);
        }
    }

    const handlePreviousWeek = () => {
        buildPreviousWeeks();
    }

    const handleNextWeek = () => {
        buildNextWeeks();
    }


    return (
        <Box>
            <Box className={classes.titleContainer}>
                <Box className={classes.leftArrow} onClick={handlePreviousWeek}>
                    <ElSvgIcon dark xSmall name="leftArrow"></ElSvgIcon>
                </Box>
                <Box className={classes.title}>
                    <Typography>{weeklyViewTitle}</Typography>
                </Box>
                <Box className={classes.rightArrow} onClick={handleNextWeek}>
                    <ElSvgIcon dark xSmall name="rightArrow"></ElSvgIcon>
                </Box>
            </Box>

            <Box mt={3} className={classes.root}>
                {
                    !Array.isNullOrEmpty(currentWeeks) && currentWeeks.map((item, index) => {
                        let classList = [classes.button]
                        if (moment(item.date).isSame(currentSelectDay, 'day')) {
                            classList.push(classes.clickedButton);
                        }
                        return (
                            <Box key={"week-tab-title-" + index} onClick={() => { handleDayClick(item) }} className={classList.join(" ")} >
                                <Box mt={1}>{item.name}</Box>
                                <Box className={classes.dayNumber}>{item.day || ""}</Box>
                            </Box>
                        );
                    })
                }
            </Box>
        </Box>
    );
}

export default CalendarWeeksTab; 