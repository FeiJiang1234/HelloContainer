export interface AthleteModel {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    gender: string;
    birthday: string;
    country: string;
    countryCode: string;
    state: string;
    stateCode: string;
    city: string;
    cityCode: string;
    bio: string;
    pictureUrl: string;
    isOpenToJoinBasketballTeam: boolean;
    isOpenToJoinSoccerTeam: boolean;
    isOpenToJoinBaseballTeam: boolean;
    isFollowed: boolean;
    isSelf: boolean;
    level: number;
    currentExperience: number;
    nextLevelExperience: number;
    isBlocked: boolean;
    beBlocked: boolean;
}
