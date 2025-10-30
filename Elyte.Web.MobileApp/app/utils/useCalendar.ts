import colors from 'el/config/colors';
import { Platform } from 'react-native';
import { useEffect } from 'react';
import * as Calendar from 'expo-calendar';
import { CalendarEvent } from 'el/models/calendar/CalendarEvent';

const useCalendar = () => {
    useEffect(() => {
        requestCalendarPermission();
    }, []);

    const requestCalendarPermission = async () => {
        await Calendar.requestCalendarPermissionsAsync();
    };

    const getDefaultCalendarSource = async () => {
        const defaultCalendar = await Calendar.getDefaultCalendarAsync();
        return defaultCalendar.source;
    };

    const createCalendar = async (calendarName) => {
        const defaultCalendarSource: any =
            Platform.OS === 'ios'
                ? await getDefaultCalendarSource()
                : { isLocalAccount: true, name: calendarName };
        const newCalendarID = await Calendar.createCalendarAsync({
            title: calendarName,
            color: colors.primary,
            entityType: Calendar.EntityTypes.EVENT,
            sourceId: defaultCalendarSource.id,
            source: defaultCalendarSource,
            name: 'internalCalendarName',
            ownerAccount: 'personal',
            accessLevel: Calendar.CalendarAccessLevel.OWNER,
        });

        return newCalendarID;
    };

    const getCalendarId = async (calendarName) => {
        const calendars = await Calendar.getCalendarsAsync('event');
        const elyteCalendar = calendars.find(x => x.title === calendarName);
        if (elyteCalendar) return elyteCalendar.id;

        return await createCalendar(calendarName);
    };

    const createEvent = async (calendarName, data) => {
        const { title, startDate, endDate, location, alertTime } = data;
        const alertOffset = alertTime ? -alertTime : -5;
        const calendarId = await getCalendarId(calendarName);
        const newEvent: CalendarEvent = {
            title: title,
            startDate: startDate,
            endDate: getEndDate(startDate, endDate),
            location: location,
            alarms: [{ relativeOffset: alertOffset,  method: Calendar.AlarmMethod.ALERT }]
        };
        const eventId = await Calendar.createEventAsync(calendarId, newEvent);
        return eventId;
    };

    const updateEvent = async (id, data) => {
        const { title, startDate, endDate, location, alertTime } = data;
        const alertOffset = alertTime ? -alertTime : -5;

        const newEvent: CalendarEvent = {
            title: title,
            startDate: startDate,
            endDate: getEndDate(startDate, endDate),
            location: location,
            alarms: [{ relativeOffset: alertOffset,  method: Calendar.AlarmMethod.ALERT }],
        };
        await Calendar.updateEventAsync(id, newEvent);
    };

    const deleteEvent = async (id) => {
        await Calendar.deleteEventAsync(id);
    };

    const getEndDate = (startDate, endDate) => {
        if(endDate) return endDate;

        const timeInOneHour = new Date(startDate);
        timeInOneHour.setHours(timeInOneHour.getHours() + 1);
        return timeInOneHour;
    }

    return { createEvent, updateEvent, deleteEvent };
};

export default useCalendar;
