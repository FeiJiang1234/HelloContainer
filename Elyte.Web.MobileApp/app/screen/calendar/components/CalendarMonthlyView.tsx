import React, { useState, useEffect } from 'react';
import { ElBody, ElIcon } from 'el/components';
import colors from 'el/config/colors';
import { monthOfYearList, weekTabs } from 'el/models/common';
import { LinearGradient } from 'expo-linear-gradient';
import { Box, Pressable, Row, Text } from 'native-base';
import { StyleSheet } from 'react-native';
import { utils } from 'el/utils';

const CalendarMonthlyView = ({ isOrganizationAdminView, initData, onInit, onDayClick }) => {
    const [monthDays, setMonthDays] = useState<any[]>([]);
    const [month, setMonth] = useState(new Date());
    const [monthTitle, setMonthTitle] = useState<any>();

    useEffect(() => {
        setMonthTitle(monthOfYearList[month.getMonth()].fullName + ' ' + month.getFullYear());
        let allMonthlyDays: any = getMonthInstance(month.getMonth(), month.getFullYear());
        drawMonthRowColumn(allMonthlyDays, []);

        if (onInit && !isOrganizationAdminView) {
            onInit(
                allMonthlyDays[0]?.currentDate,
                allMonthlyDays[allMonthlyDays.length - 1]?.currentDate,
            );
        }
    }, [month]);

    useEffect(() => {
        if (initData) {
            let allMonthlyDays = getMonthInstance(month.getMonth(), month.getFullYear());
            drawMonthRowColumn(allMonthlyDays, initData);
        }
    }, [initData]);

    const drawMonthRowColumn = (allMonthlyDays, data) => {
        let rowDays: any[] = Array();
        let colomnDays = Array();
        for (let index = 1; index <= allMonthlyDays.length; index++) {
            let day = allMonthlyDays[index - 1];
            const qty = Array.isArray(data) && data.find(x => x.date === day.currentDate);
            day['eventQty'] = qty && qty.eventQty;
            day['reminderQty'] = qty && qty.reminderQty;
            day['gameQty'] = qty && qty.gameQty;
            colomnDays.push(day);
            if (index % 7 === 0) {
                rowDays.push(colomnDays);
                colomnDays = [];
            }
        }
        setMonthDays(rowDays);
    };

    const getDateIsToday = (year, month, day) => {
        let all_date = year + '-' + month + '-' + day;
        let todaysDate = new Date();
        let years = todaysDate.getFullYear();
        let months = todaysDate.getMonth() + 1;
        let days = todaysDate.getDate();
        let all_dates = years + '-' + months + '-' + days;
        return all_dates === all_date;
    };

    const getMonth = month => {
        if (month === 0) {
            return 12;
        } else if (month === 13) {
            return 1;
        }
        return month;
    };

    const getYear = (month, year) => {
        if (month === 0) {
            return --year;
        } else if (month === 13) {
            return ++year;
        }
        return year;
    };

    const getDayInstance = (day, month, year, isCurrentMonth = false) => {
        year = getYear(month, year);
        month = getMonth(month);
        let week = new Date(year, month, day).getDay();
        let isToday = getDateIsToday(year, month, day);
        let months = month >= 10 ? month : '0' + month;
        let days = day >= 10 ? day : '0' + day;
        let currentDate = year + '-' + months + '-' + days;
        return { day, month, year, week, isCurrentMonth, currentDate, isToday };
    };

    const getMonthInstance = (monthIndex, year) => {
        let monthData: any[] = [];
        let currentMonthDays = new Date(year, monthIndex + 1, 0).getDate();
        let daysInMonth: any[] = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
            daysInMonth[1] = 29;
        }
        let addDaysFromPreMonth = new Array(12).fill(null).map((item, index) => {
            let day = new Date(year, index, 1).getDay();
            return day === 0 ? 0 : day;
        });
        let daysInPreviousMonth: any[] = daysInMonth;
        daysInPreviousMonth.unshift(daysInPreviousMonth.pop());
        let daysCountPrevious = daysInPreviousMonth[monthIndex];
        let forwardAddDays = addDaysFromPreMonth[monthIndex];

        //fill last month days
        for (; forwardAddDays > 0; forwardAddDays--) {
            let day_bean: any = getDayInstance(daysCountPrevious--, monthIndex, year, false);
            monthData.unshift(day_bean);
        }

        //fill current month days
        for (let i = 1; i <= currentMonthDays; i++) {
            let day_bean = getDayInstance(i, monthIndex + 1, year, true);
            monthData.push(day_bean);
        }

        //fill next month days
        for (let i = 42 - monthData.length, j = 0; j < i; ) {
            let day_bean = getDayInstance(++j, monthIndex + 2, year, false);
            monthData.push(day_bean);
        }
        return monthData;
    };

    const handlePreviousMonth = () => {
        let previousMonth = new Date(month.setMonth(month.getMonth() - 1));
        setMonth(previousMonth);
    };

    const handleNextMonth = () => {
        let nextMonth = new Date(month.setMonth(month.getMonth() + 1));
        setMonth(nextMonth);
    };

    const handleDayClick = day => {
        if (onDayClick) {
            onDayClick(day, isOrganizationAdminView);
        }
    };

    const getDayColor = day => {
        if (day.isToday) {
            return colors.white;
        }

        if (day.isCurrentMonth) {
            return colors.black;
        }

        return colors.medium;
    };

    return (
        <>
            <Row justifyContent="space-between" alignItems="center" mb={2}>
                <Pressable onPress={handlePreviousMonth}>
                    <ElIcon name="chevron-left" color={colors.primary}></ElIcon>
                </Pressable>

                <ElBody size="lg">{monthTitle}</ElBody>

                <Pressable onPress={handleNextMonth}>
                    <ElIcon name="chevron-right" color={colors.primary}></ElIcon>
                </Pressable>
            </Row>

            <Row>
                {weekTabs.map((item, index) => (
                    <LinearGradient
                        key={'week-' + index}
                        {...colors.linear}
                        style={[styles.week, index !== 0 && { marginLeft: 4 }]}>
                        <Text color={colors.white}>{item.name}</Text>
                    </LinearGradient>
                ))}
            </Row>

            {!utils.isArrayNullOrEmpty(monthDays) &&
                monthDays.map((rowDays, rowIndex) => {
                    return (
                        <Row key={'day-' + rowIndex}>
                            {!utils.isArrayNullOrEmpty(rowDays) &&
                                rowDays.map((item, columnIndex) => (
                                    <Pressable
                                        onPress={() => handleDayClick(item)}
                                        style={[
                                            styles.day,
                                            columnIndex !== 0 && { marginLeft: 4 },
                                            item.isToday && { backgroundColor: '#C0C5D0' },
                                        ]}
                                        key={'day-row-' + rowIndex + '-column-' + columnIndex}>
                                        <Text alignSelf="flex-start" color={getDayColor(item)}>
                                            {item.day}
                                        </Text>

                                        <Row position="absolute" bottom={0.5}>
                                            {item.eventQty > 0 && (
                                                <LinearGradient
                                                    {...colors.linear}
                                                    style={styles.dot}>
                                                    <Text color={colors.white}>
                                                        {item.eventQty}
                                                    </Text>
                                                </LinearGradient>
                                            )}
                                            {item.gameQty > 0 && (
                                                <LinearGradient
                                                    {...colors.linear}
                                                    style={styles.dot}>
                                                    <Text color={colors.white}>{item.gameQty}</Text>
                                                </LinearGradient>
                                            )}
                                            {item.reminderQty > 0 && (
                                                <Box style={styles.dot} bgColor={colors.secondary}>
                                                    <Text color={colors.white}>
                                                        {item.reminderQty}
                                                    </Text>
                                                </Box>
                                            )}
                                        </Row>
                                    </Pressable>
                                ))}
                        </Row>
                    );
                })}
        </>
    );
};

const styles = StyleSheet.create({
    week: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 32,
    },
    day: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 48,
        backgroundColor: colors.light,
        marginTop: 4,
    },
    dot: {
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default CalendarMonthlyView;
