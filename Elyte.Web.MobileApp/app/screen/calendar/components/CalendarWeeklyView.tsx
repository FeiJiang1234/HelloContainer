import React, { useState, useEffect, useImperativeHandle } from 'react';
import moment from 'moment';
import calendarService from 'el/api/calendarService';
import { leagueService, tournamentService } from 'el/api';
import CalendarWeeksTab from './CalendarWeeksTab';
import RenderTimeLine from './RenderTimeLine';

const CalendarWeeklyView = React.forwardRef<any, any>(({ isOrganizationAdminView, organizationType, organizationId }, ref) => {
    const [currentSelectDay, setCurrentSelectDay] = useState(new Date());
    const [scheduleList, setScheculeList] = useState<any[]>([]);

    const currentDate = moment(currentSelectDay).format('YYYY-MM-DD');

    useEffect(() => {
        if (!isOrganizationAdminView) {
            getItemsDisplayInCalendar();
        }
        if (isOrganizationAdminView) {
            getOrganizationDailyGames();
        }
    }, [currentSelectDay, isOrganizationAdminView]);

    const getItemsDisplayInCalendar = async () => {
        let serviceData = new Array();
        const res: any = await calendarService.getItemsDisplayInCalendar(currentDate, currentDate);
        if (res && res.code === 200 && res.value.length > 0) {
            serviceData = res.value;
        }
        setScheculeList(serviceData);
    };

    const getOrganizationDailyGames = async () => {
        if (organizationType == 'League') {
            const res: any = await leagueService.getLeagueGamesByDate(organizationId, currentDate);
            if (res && res.code === 200) setScheculeList(res.value);
        }
        if (organizationType == 'Tournament') {
            const res: any = await tournamentService.getTournamentGamesByDate(
                organizationId,
                currentDate,
            );
            if (res && res.code === 200) setScheculeList(res.value);
        }
    };

    useImperativeHandle(ref, () => ({
        getItemsDisplayInCalendar: () => getItemsDisplayInCalendar()
    }));

    return (
        <>
            <CalendarWeeksTab onDayTabClick={setCurrentSelectDay} />
            <RenderTimeLine initData={scheduleList} onReload={getItemsDisplayInCalendar} />
        </>
    );
});

export default CalendarWeeklyView;
