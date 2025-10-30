export interface TeamModel {
    id: string;
    name: string;
    gender: string;
    sportType: string;
    maxAge: number;
    minAge: number;
    bio: string;
    level: number;
    currentExperience: number;
    nextLevelExperience: number;
    imageUrl: string;
    isAdminView: boolean;
    isFollow: boolean;
    isJoin: boolean;
    isOwner: boolean;
    country: string;
    countryCode: string;
    state: string;
    stateCode: string;
    city: string;
    cityCode: string;
}
