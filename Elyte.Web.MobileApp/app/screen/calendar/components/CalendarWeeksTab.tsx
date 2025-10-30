import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { weekTabs, monthOfYearList } from 'el/models/common';
import { Box, Row, Text, Pressable, HStack } from 'native-base';
import { StyleSheet } from 'react-native';
import { ElBody, ElIcon } from 'el/components';
import colors from 'el/config/colors';
import { utils } from 'el/utils';
import { LinearGradient } from 'expo-linear-gradient';
import moment from 'moment';

const CalendarWeeksTab = ({ onDayTabClick }) => {
    const [weeklyViewTitle, setWeeklyViewTitle] = useState<any>();
    const [currentSelectDay, setCurrentSelectDay] = useState(new Date());
    const [currentWeeks, setCurrentWeeks] = useState<any[]>([]);
    let fullWeekDays: any[] = _.cloneDeep(weekTabs);

    useEffect(() => {
        if (!utils.isArrayNullOrEmpty(currentWeeks)) {
            buildWeekViewTitle();
        }
    }, [currentWeeks]);

    useEffect(() => {
        var currentDayOfWeek = currentSelectDay.getDay();
        let currentWeek = fullWeekDays[currentDayOfWeek];

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
    };

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
    };

    const buildWeekViewTitle = () => {
        const firstDay = new Date(currentWeeks[0].date);
        const lastDay = new Date(currentWeeks[currentWeeks.length - 1].date);
        const isSameYear = firstDay.getFullYear() === lastDay.getFullYear();
        const isSameMonth = firstDay.getMonth() === lastDay.getMonth();
        let title = '';
        const firstDayMonth = monthOfYearList[firstDay.getMonth()];
        const lastDayMonth = monthOfYearList[lastDay.getMonth()];

        if (isSameYear && isSameMonth) {
            title =
                firstDayMonth.fullName +
                ' ' +
                firstDay.getDate() +
                ' — ' +
                lastDay.getDate() +
                ', ' +
                firstDay.getFullYear();
            setWeeklyViewTitle(title);
            return;
        }

        if (!isSameYear) {
            title =
                firstDayMonth.shortName +
                ' ' +
                firstDay.getDate() +
                ', ' +
                firstDay.getFullYear() +
                ' — ';
            title +=
                lastDayMonth.shortName + ' ' + lastDay.getDate() + ', ' + lastDay.getFullYear();
            setWeeklyViewTitle(title);
            return;
        }

        if (!isSameMonth) {
            title = firstDayMonth.shortName + ' ' + firstDay.getDate() + ' — ';
            title +=
                lastDayMonth.shortName + ' ' + lastDay.getDate() + ', ' + firstDay.getFullYear();
            setWeeklyViewTitle(title);
        }
    };

    const handleDayClick = async e => {
        setCurrentSelectDay(e.date);
        if (onDayTabClick) {
            onDayTabClick(e.date);
        }
    };

    const isToday = item => moment(item.date).isSame(currentSelectDay, 'day');

    return (
        <Box>
            <Row justifyContent="space-between" alignItems="center" mb={2}>
                <Pressable onPress={buildPreviousWeeks}>
                    <ElIcon name="chevron-left" color={colors.primary}></ElIcon>
                </Pressable>

                <ElBody size="lg">{weeklyViewTitle}</ElBody>

                <Pressable onPress={buildNextWeeks}>
                    <ElIcon name="chevron-right" color={colors.primary}></ElIcon>
                </Pressable>
            </Row>

            <HStack space={2}>
                {currentWeeks.map((item, index) => (
                    <LinearGradient
                        key={'week-tab-title-' + index}
                        {...(isToday(item) ? colors.linearBlue : colors.linear)}
                        style={styles.day}>
                        <Pressable size={10} alignItems="center" justifyContent="center" onPress={() => handleDayClick(item)}>
                            <Text color={colors.white}>{item.name}</Text>
                            <Text color={colors.white}>{item.day || ''}</Text>
                        </Pressable>
                    </LinearGradient>
                ))}
            </HStack>
        </Box>
    );
};

const styles = StyleSheet.create({
    day: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 4,
        paddingBottom: 4,
    },
});

export default CalendarWeeksTab;
