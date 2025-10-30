export interface AssociationProfileModel {
    id: string;
    name: string;
    code: string;
    imageUrl: string;
    details: string;
    email: string;
    phoneNumber: string;
    isAdminView: boolean;
    isOwner: boolean;
    officialId: string;
    isOfficial: boolean;
    paymentAccount: number;
    registerPrice: number;
    country: string;
    countryCode: string;
    state: string;
    stateCode: string;
    city: string;
    cityCode: string;
}
