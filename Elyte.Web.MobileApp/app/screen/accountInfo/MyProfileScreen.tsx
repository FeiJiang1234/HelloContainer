import { Box, Column, Divider, Flex, HStack, Radio, ScrollView, Text } from 'native-base';
import React, { useEffect, useState } from 'react';
import { Pressable } from 'react-native';
import { athleteService } from 'el/api';
import { ElAvatar, ElBody, ElButton, ElDialog, ElKeyboardAvoidingView, ElMenu, ElRadio, ElSwitch, H3, SportSelect } from 'el/components';
import colors from 'el/config/colors';
import { AthleteModel } from 'el/models/athlete/athleteModel';
import { ResponseResult } from 'el/models/responseResult';
import routes from 'el/navigation/routes';
import { useAuth, useGoBack, useImagePicker } from 'el/utils';
import LevelBar from './components/LevelBar';
import StatsSquare from './components/StatsSquare';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'el/store/store';
import { GET_PROFILE } from 'el/store/slices/athleteSlice';
import { SportType } from 'el/enums';
import SwitchSvg from 'el/svgs/SwitchSvg';
import { StatsModel } from 'el/models/athlete/statsModel';
import _ from 'lodash';
import ElAddress from 'el/components/ElAddress';
import { ERROR, PENDING, SUCCESS } from 'el/store/slices/requestSlice';
import AthleteTabs from './components/AthleteTabs';
import { ActionModel } from 'el/models/action/actionModel';

export default function MyProfileScreen({ navigation }) {
    useGoBack();
    const profile = useSelector((state: RootState) => state.athlete);
    const dispatch = useDispatch();
    const { chooseAvatarAsync, image, setImage, getImageFormData } = useImagePicker();
    const { user } = useAuth();
    const [isShowStats, setIsShowStats] = useState(true);
    const [isOfficial, setIsOfficial] = useState(true);
    const [stats, setStats] = useState<StatsModel[]>([]);
    const [data, setData] = useState<any>({});
    const [changeDefaultSport, setChangeDefaultSport] = useState(false);
    const [sports, setSports] = useState<any[]>([]);
    const [defaultSport, setDefaultSport] = useState<any>();
    const [loading, setLoading] = useState(false);

    const [currentSport, setCurrentSport] = useState<any>({ name: '' });

    const options: ActionModel[] = [
        {
            label: 'View Team Invites',
            onPress: () => navigation.navigate(routes.TeamInvites, { id: user.id }),
        },
        {
            label: 'View Join Team Requests',
            onPress: () => navigation.navigate(routes.AthleteJoinTeamRequest, { id: user.id }),
        },
        {
            label: 'View Officiate Requests',
            onPress: () => navigation.navigate(routes.AthleteOfficiateRequest, { id: user.id }),
        },
        {
            label: 'Set Default Sport',
            onPress: () => {
                setDefaultSport(profile?.defaultSport);
                setChangeDefaultSport(true);
            },
        },
        {
            label: 'Delete Account',
            onPress: () => navigation.navigate(routes.DeleteAccount, { email: profile.email, phoneNumber: profile.phoneNumber }),
        },
    ];

    useEffect(() => {
        getAthleteProfile();
        getAthleteSports();
    }, []);

    useEffect(() => {
        if(!currentSport.name) return;

        getStats();
    }, [isOfficial, currentSport.name]);

    useEffect(() => {
        if (!image.uri) return;

        handleImageSelect();
    }, [image]);

    const getAthleteProfile = async () => {
        const res: ResponseResult<AthleteModel> = await athleteService.getAthleteById(user.id);
        if (res && res.code === 200) {
            var athleteSport = profileToAthleteSport(res.value);
            setCurrentSport(athleteSport);
            dispatch(GET_PROFILE(res.value));
        }
    };

    const getStats = async () => {
        dispatch(PENDING());
        const res: ResponseResult<StatsModel[]> | undefined = await getStatsService();
        if (res && res.code === 200) {
            setStats(res?.value);
            dispatch(SUCCESS());
        } else {
            setStats([]);
            dispatch(ERROR());
        }
    };

    const getStatsService = () => {
        if (currentSport.name === SportType.Basketball) {
            return athleteService.getBasketballStats(user.id, isOfficial);
        }
        if (currentSport.name === SportType.Soccer) {
            return athleteService.getSoccerStats(user.id, isOfficial);
        }
        
        return athleteService.getLowSportStats(user.id, isOfficial, currentSport.name);
    };

    const handleChangeStats = async stats => {
        const res: any = await getChangeStatsService(stats.fullStatsName);
        if (res && res.code === 200) getStats();
    };

    const getChangeStatsService = (statsName) => {
        if (currentSport.name === SportType.Basketball) {
            return athleteService.updateBasketballStats(user.id, data.id, { statsName, ...data });
        }
        if (currentSport.name === SportType.Soccer) {
            return athleteService.updateSoccerStats(user.id, data.id, { statsName, ...data });
        }
    };

    const handleImageSelect = async () => {
        dispatch(PENDING());
        const res: any = await athleteService.updateProfilePicture(user.id, getImageFormData());
        if (res && res.code === 200) {
            setImage({ uri: '' });
            await getAthleteProfile();
            dispatch(SUCCESS());
        } else {
            dispatch(ERROR());
        }
    };

    const getAthleteSports = async () => {
        const res: any = await athleteService.getAthleteSports(user.id);
        if (res && res.code === 200) {
            setSports(res.value);
        }
    };

    const handleSportConfirm = async () => {
        setLoading(true);
        const res: any = await athleteService.setAthleteDefaultSport(user.id, defaultSport);
        setLoading(false);
        if (res && res.code === 200) {
            setChangeDefaultSport(false);
            getAthleteProfile();
        }
    }

    const profileToAthleteSport = profile => {
        return {
            ...currentSport, 
            name: profile.defaultSport,
            level: profile.level,
            currentExperience: profile.currentExperience,
            nextLevelExperience: profile.nextLevelExperience
        };
    }

    const handleSelectedTabSport = async (value) => {
        let selectPort = sports.find(item => item.name == value);
        //clone new object
        setCurrentSport(Object.assign({}, selectPort));
    }

    return (
        <ElKeyboardAvoidingView withOffset>
            <HStack mt="4" mb="2" space={2}>
                <ElAvatar onPress={chooseAvatarAsync} uri={profile?.pictureUrl} size={80} />
                <Box flex={1}>
                    <H3>{`${profile?.firstName} ${profile?.lastName}`}</H3>
                    <ElAddress my="1" {...profile} />
                    <ElButton size="sm" onPress={() => navigation.navigate(routes.EditProfile)}>
                        Edit
                    </ElButton>
                </Box>
                <Box>
                    <ElMenu items={options} />
                </Box>
            </HStack>
            <SportSelect sportType={currentSport.name} onTabclick={handleSelectedTabSport} />
            <LevelBar
                mb={1}
                level={currentSport?.level}
                currentExperience={currentSport?.currentExperience}
                nextLevelExperience={currentSport?.nextLevelExperience}
            />

            <ElBody mt="1">{profile?.bio}</ElBody>

            <Flex direction="row" mb="2" align="center">
                <ElSwitch
                    fullWidth
                    flex={1}
                    mr={4}
                    value={isOfficial}
                    onToggle={setIsOfficial}
                    my={2}
                    textOn="Official"
                    textOff="Unofficial"
                />
                <Pressable onPress={() => setIsShowStats(!isShowStats)}>
                    <SwitchSvg fill={isShowStats ? colors.secondary : undefined} />
                </Pressable>
            </Flex>
            {
                isShowStats && stats.length>0 &&
                <StatsSquare userId={user.id} stats={stats} 
                    onPress={(id, order, isMain) => setData({ id, order, isMain, type: '' })} 
                    onSelectedItem={handleChangeStats} />
            }
            <Divider my="2" />
            <AthleteTabs id={user.id} sportType={currentSport.name} profile={profile} />
            <Box h={2}></Box>
            {changeDefaultSport && (
                <ElDialog
                    onClose={() => setChangeDefaultSport(false)}
                    visible={changeDefaultSport}
                    header={
                        <>
                            <H3 style={{ textAlign: 'center' }}>Select Profile Sport</H3>
                            <ElBody style={{ textAlign: 'center' }}>
                                Stats will display based on the sport selected below. You can choose
                                which sport is your default for your profile.
                            </ElBody>
                        </>
                    }
                    footer={<ElButton onPress={handleSportConfirm} loading={loading}>Confirm</ElButton>}>
                    <ScrollView maxH={200}>
                        <Radio.Group
                            name="defaultSportGroup"
                            value={defaultSport}
                            onChange={setDefaultSport}>
                            {sports.map(item => (
                                <ElRadio key={item?.name} value={item?.name}>
                                    <Column>
                                        <Text>{item.name}</Text>
                                        <Text fontSize={12} color={colors.secondary}>
                                            Level: {item.level || 1}
                                        </Text>
                                    </Column>
                                </ElRadio>
                            ))}
                        </Radio.Group>
                    </ScrollView>
                </ElDialog>
            )}
        </ElKeyboardAvoidingView>
    );
}
