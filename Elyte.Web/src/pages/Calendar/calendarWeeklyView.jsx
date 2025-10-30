import React, { useState, useEffect } from 'react';
import { calendarService, leagueService, tournamentService } from 'services';
import RenderTimeLine from './components/renderTimeLine';
import { CalendarWeeksTab } from 'pageComponents';
import * as moment from 'moment';

const CalendarWeeklyView = ({ isOrganizationAdminView, organizationType, organizationId }) => {
    const [currentSelectDay, setCurrentSelectDay] = useState(new Date());
    const [scheduleList, setScheculeList] = useState([]);

    const currentDate = moment(currentSelectDay).format("YYYY-MM-DD");

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
        const res = await calendarService.getItemsDisplayInCalendar(currentDate, currentDate);
        if (res && res.code === 200 && res.value.length > 0) {
            serviceData = res.value;
        }
        setScheculeList(serviceData);
    }

    const getOrganizationDailyGames = async () => {
        if (organizationType == "League") {
            const res = await leagueService.getLeagueGamesByDate(organizationId, currentDate);
            if (res && res.code === 200)
                setScheculeList(res.value);
        }
        if (organizationType == "Tournament") {
            const res = await tournamentService.getTournamentGamesByDate(organizationId, currentDate);
            if (res && res.code === 200)
                setScheculeList(res.value);
        }
    }

    const handleReload = () => {
        getItemsDisplayInCalendar();
    }

    return (
        <>
            <CalendarWeeksTab onDayTabClick={(day) => setCurrentSelectDay(day)}></CalendarWeeksTab>
            <RenderTimeLine initData={scheduleList} onReload={handleReload} />
        </>
    );
};

export default CalendarWeeklyView;