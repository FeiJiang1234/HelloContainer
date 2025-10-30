import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ElSvgIcon } from 'components';
import { monthOfYearList, weekTabs } from '../../models/common';


const useStyles = makeStyles(theme => {
    return {
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
            fontWeight: 500
        },
        calendarWeekContainer: {
            display: 'flex',
            minHeight: 44,
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingTop: theme.spacing(3)

        },
        weekContent: {
            background: theme.bgPrimary,
            minWidth: 44,
            flex: 1,
            marginRight: 2,
            marginLeft: 2,
            marginBottom: 2,
            color: 'white',
            fontSize: 20,
            minHeight: 44,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        dayViewContainer: {
            display: 'flex',
            minHeight: 44,
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        dayContent: {
            minWidth: 44,
            flex: 1,
            margin: 2,
            fontSize: 15,
            minHeight: 70,
            display: 'flex',
            justifyContent: 'center',
            background: '#F0F2F7',
            flexDirection: 'column',
            alignItems: 'center',
        },
        dayText: {
            flex: 1,
        },
        isToday: {
            background: '#C0C5D0',
            color: '#FFFFFF'
        },
        inMonthDay: {
            color: '#000000',
        },
        notInMonthDay: {
            color: theme.palette.body.light,
        },
        eventDot: {
            borderRadius: '50%',
            background: 'linear-gradient(179.38deg, #1F345D 16.7%, #080E1B 115.63%)',
            width: 20,
            height: 20,
            color: '#FFFFFF',
            fontSize: 8,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 1,
            marginBottom: 1
        },
        reminderDot: {
            borderRadius: '50%',
            background: '#17C476',
            width: 20,
            height: 20,
            color: '#FFFFFF',
            fontSize: 8,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 1,
            marginBottom: 1
        }
    };
});

const CalendarMonthlyView = ({ isOrganizationAdminView, initData, onInit, onMonthChanged, onDayClick }) => {
    const classes = useStyles();
    const [monthDays, setMonthDays] = useState([]);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [currentSelectYearMonthName, setCurrentSelectYearMonthName] = useState();

    useEffect(() => {
        setCurrentSelectYearMonthName(monthOfYearList[currentMonth.getMonth()].fullName + " " + currentMonth.getFullYear())
        let allMonthlyDays = getMonthInstance(currentMonth.getMonth(), currentMonth.getFullYear());
        drawMonthRowColumn(allMonthlyDays, []);
        if (onMonthChanged) {
            onMonthChanged(monthOfYearList[currentMonth.getMonth()].fullName + " " + currentMonth.getFullYear());
        }
        if (onInit && !isOrganizationAdminView) {
            onInit(allMonthlyDays[0]?.currentDate, allMonthlyDays[allMonthlyDays.length - 1]?.currentDate);
        }

    }, [currentMonth]);

    useEffect(() => {
        if (initData) {
            let allMonthlyDays = getMonthInstance(currentMonth.getMonth(), currentMonth.getFullYear());
            drawMonthRowColumn(allMonthlyDays, initData);
        }
    }, [initData]);


    const drawMonthRowColumn = (allMonthlyDays, data) => {
        let rowDays = Array();
        let colomnDays = Array();
        for (let index = 1; index <= allMonthlyDays.length; index++) {
            let day = allMonthlyDays[index - 1];
            const dailyEventAndReminderQty = Array.isArray(data) && data.find(x => x.date === day.currentDate);
            day['eventQty'] = dailyEventAndReminderQty && dailyEventAndReminderQty.eventQty;
            day['reminderQty'] = dailyEventAndReminderQty && dailyEventAndReminderQty.reminderQty;
            day['gameQty'] = dailyEventAndReminderQty && dailyEventAndReminderQty.gameQty;
            colomnDays.push(day);
            if (index % 7 === 0) {
                rowDays.push(colomnDays);
                colomnDays = [];
            }
        }
        setMonthDays(rowDays)
    }

    const getDateIsToday = (year, month, day) => {
        let all_date = year + '-' + month + '-' + day;
        let todaysDate = new Date();
        let years = todaysDate.getFullYear();
        let months = todaysDate.getMonth() + 1;
        let days = todaysDate.getDate();
        let all_dates = years + '-' + months + '-' + days;
        return all_dates === all_date;
    }

    const getMonth = (month) => {
        if (month == 0) {
            return 12;
        } else if (month == 13) {
            return 1;
        }
        return month;
    }

    const getYear = (month, year) => {
        if (month == 0) {
            return --year;
        } else if (month == 13) {
            return ++year;
        }
        return year;
    }

    const getDayInstance = (day, month, year, isCurrentMonth = false) => {
        year = getYear(month, year);
        month = getMonth(month);
        let week = new Date(year, month, day).getDay();
        let isToday = getDateIsToday(year, month, day);
        let months = month >= 10 ? month : '0' + month;
        let days = day >= 10 ? day : '0' + day;
        let currentDate = year + '-' + months + '-' + days;
        return { day, month, year, week, isCurrentMonth, currentDate, isToday };
    }

    const getMonthInstance = (monthIndex, year) => {
        let monthData = [];
        let currentMonthDays = new Date(year, (monthIndex + 1), 0).getDate();
        let daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
            daysInMonth[1] = 29
        }
        let addDaysFromPreMonth = new Array(12)
            .fill(null)
            .map((item, index) => {
                let day = new Date(year, index, 1).getDay();
                return day === 0 ? 0 : day;
            });
        let daysInPreviousMonth = [].concat(daysInMonth);
        daysInPreviousMonth.unshift(daysInPreviousMonth.pop());
        let daysCountPrevious = daysInPreviousMonth[monthIndex];
        let forwardAddDays = addDaysFromPreMonth[monthIndex];
        //fill last month days
        for (; forwardAddDays > 0; forwardAddDays--) {
            let day_bean = getDayInstance(daysCountPrevious--, monthIndex, year, false);
            monthData.unshift(day_bean);
        }
        //fill current month days
        for (let i = 1; i <= currentMonthDays; i++) {
            let day_bean = getDayInstance(i, monthIndex + 1, year, true);
            monthData.push(day_bean)
        }
        //fill next month days
        for (let i = 42 - monthData.length, j = 0; j < i;) {
            let day_bean = getDayInstance(++j, monthIndex + 2, year, false);
            monthData.push(day_bean)
        }
        return monthData;
    }

    const handlePreviousMonth = () => {
        let previousMonth = new Date(currentMonth.setMonth(currentMonth.getMonth() - 1));
        setCurrentMonth(previousMonth);
    }

    const handleNextMonth = () => {
        let nextMonth = new Date(currentMonth.setMonth(currentMonth.getMonth() + 1));
        setCurrentMonth(nextMonth);
    }

    const handleDayClick = (day) => {
        if (onDayClick) {
            onDayClick(day, isOrganizationAdminView)
        }
    }

    return (<>
        <Box className={classes.calendarTitleContainer}>
            <Box className={classes.calendarLeftArrow} onClick={handlePreviousMonth}>
                <ElSvgIcon dark xSmall name="leftArrow"></ElSvgIcon>
            </Box>
            <Box className={classes.calendarTitle}>
                <Typography>{currentSelectYearMonthName}</Typography>
            </Box>
            <Box className={classes.calendarRightArrow} onClick={handleNextMonth}>
                <ElSvgIcon dark xSmall name="rightArrow"></ElSvgIcon>
            </Box>
        </Box>

        <Box className={classes.calendarWeekContainer}>
            {
                weekTabs.map((item, index) => (
                    <Box key={"week-content-" + index} className={classes.weekContent}>{item.name}</Box>
                ))
            }
        </Box>
        {
            Array.isArray(monthDays) && monthDays.map((rowDays, rowIndex) => {
                const getDayStyle = (day) => {
                    if (day.isToday) {
                        return classes.isToday;
                    }

                    if (day.isCurrentMonth) {
                        return classes.inMonthDay;
                    }

                    return classes.notInMonthDay;
                };
                return (
                    <Box key={"day-view-row-index-" + rowIndex} className={classes.dayViewContainer}>
                        {
                            Array.isArray(rowDays) && rowDays.map((item, columnIndex) => (
                                <Box key={"day-view-row-" + rowIndex + "-column-" + columnIndex} className={[classes.dayContent, getDayStyle(item)].join(' ')} onClick={() => handleDayClick(item)} >
                                    <Box className={classes.dayText}>{item.day}</Box>
                                    {item.eventQty > 0 && <Box className={classes.eventDot}>{item.eventQty}</Box>}
                                    {item.gameQty > 0 && <Box className={classes.eventDot}>{item.gameQty}</Box>}
                                    {item.reminderQty > 0 && <Box className={classes.reminderDot}>{item.reminderQty}</Box>}
                                </Box>
                            ))
                        }
                    </Box>
                )
            })
        }
    </>
    );
};

export default CalendarMonthlyView;