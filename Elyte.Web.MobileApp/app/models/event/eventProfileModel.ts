export interface EventProfileModel {
    id: string;
    eventId: string;
    creatorId: string;
    createdDate: Date;
    title: string;
    details: string;
    imageUrl: string;
    startTime: Date;
    endTime: Date;
    teamId: string;
    teamName: string;
    country: string;
    countryCode: string;
    state: string;
    stateCode: string;
    city: string;
    cityCode: string;
    sportOption: string;
    venue: boolean;
    alertTime: number;
    isRegistered: boolean;
    isCreator: boolean;
    address: string;
    mobileCalendarEventId: string;
}
