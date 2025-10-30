import React, { useState, useEffect, useImperativeHandle } from 'react';
import moment from 'moment';
import { Pressable, Row } from 'native-base';
import { ElBody, ElIcon } from 'el/components';
import { leagueService, tournamentService } from 'el/api';
import calendarService from 'el/api/calendarService';
import { monthOfYearList } from 'el/models/common';
import RenderTimeLine from './RenderTimeLine';
import colors from 'el/config/colors';

const CalendarDailyView = React.forwardRef<any, any>(({ date, isOrganizationAdminView, organizationType, organizationId }, ref) => {
    const [currentDate, setCurrentDate] = useState(date ? moment(date) : moment());
    const [scheduleList, setScheculeList] = useState<any>([]);
    const [dayViewTitle, setDayViewTitle] = useState<any>();

    useEffect(() => {
        initData();
    }, [currentDate, isOrganizationAdminView]);

    const initData = () => {
        let monthName = monthOfYearList[currentDate.month()].fullName;
        setDayViewTitle(monthName + ' ' + currentDate.date() + ', ' + currentDate.year());
        if (!isOrganizationAdminView) {
            return getItemsDisplayInCalendar(
                currentDate.format('YYYY-MM-DD'),
                currentDate.format('YYYY-MM-DD'),
            );
        }
        if (isOrganizationAdminView) {
            return getOrganizationDailyGames(
                currentDate.format('YYYY-MM-DD'),
                organizationType,
                organizationId,
            );
        }
    };

    const getItemsDisplayInCalendar = async (startDate, endDate) => {
        let serviceData = new Array();
        const res: any = await calendarService.getItemsDisplayInCalendar(startDate, endDate);
        if (res && res.code === 200 && res.value.length > 0) {
            serviceData = res.value;
        }
        setScheculeList(serviceData);
    };

    const getOrganizationDailyGames = async (targetDate, type, id) => {
        let res: any = {};
        switch (type) {
            case 'League':
                res = await leagueService.getLeagueGamesByDate(id, targetDate);
                break;
            case 'Tournament':
                res = await tournamentService.getTournamentGamesByDate(id, targetDate);
                break;
        }

        if (res && res.code === 200) setScheculeList(res.value);
    };

    const handlePreviousDayClick = () => {
        setCurrentDate(moment(currentDate.add(-1, 'd').format('YYYY-MM-DD')));
    };

    const handleNextDayClick = () => {
        setCurrentDate(moment(currentDate.add(1, 'd').format('YYYY-MM-DD')));
    };

    const handleReload = () => {
        getItemsDisplayInCalendar(
            currentDate.format('YYYY-MM-DD'),
            currentDate.format('YYYY-MM-DD'),
        );
    };

    useImperativeHandle(ref, () => ({
        getItemsDisplayInCalendar: () => handleReload()
    }));

    return (
        <>
            <Row justifyContent="space-between" alignItems="center" mb={2}>
                <Pressable onPress={handlePreviousDayClick}>
                    <ElIcon name="chevron-left" color={colors.primary}></ElIcon>
                </Pressable>
                <ElBody size="lg">{dayViewTitle}</ElBody>
                <Pressable onPress={handleNextDayClick}>
                    <ElIcon name="chevron-right" color={colors.primary}></ElIcon>
                </Pressable>
            </Row>

            <RenderTimeLine initData={scheduleList} onReload={handleReload} />
        </>
    );

});

export default CalendarDailyView;
