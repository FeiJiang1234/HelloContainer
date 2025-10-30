import * as Calendar from 'expo-calendar';

export interface CalendarEvent {
    title: string;
    location?: string;
    startDate: Date;
    endDate: Date;
    alarms: Calendar.Alarm[];
}
