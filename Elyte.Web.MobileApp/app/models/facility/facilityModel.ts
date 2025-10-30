export interface FacilityModel {
    id: string;
    name: string;
    imageUrl: string;
    associationId: string;
    timeZone: string;
    phoneNumber: string;
    email: string;
    detail: string;
    halfHourPrice: number;
    oneHourPrice: number;
    exceedTwoHoursPrice: number;
    sportOption: string;
    workDays: string;
    workStartTime: string
    workEndTime: string
    street: string;
    isAdminView: boolean;
    isOwnerView: boolean;
    isFollow: boolean;
    country: string;
    countryCode: string;
    state: string;
    stateCode: string;
    city: string;
    cityCode: string;
}