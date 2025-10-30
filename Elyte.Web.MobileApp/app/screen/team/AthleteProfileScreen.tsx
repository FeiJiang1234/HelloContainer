import { Box, Center, Divider, Flex, HStack, Row, Text } from 'native-base';
import React, { useEffect, useState } from 'react';
import { Pressable } from 'react-native';
import { athleteService } from 'el/api';
import { ElAvatar, ElBody, ElButton, ElChatMessageButton, ElConfirm, ElMenu, ElScrollContainer, ElSwitch, H3, SportSelect } from 'el/components';
import colors from 'el/config/colors';
import { AthleteModel } from 'el/models/athlete/athleteModel';
import { ResponseResult } from 'el/models/responseResult';
import { useAuth, useElToast, useGoBack } from 'el/utils';
import { useDispatch } from 'react-redux';
import { ChatType, SportType } from 'el/enums';
import SwitchSvg from 'el/svgs/SwitchSvg';
import { StatsModel } from 'el/models/athlete/statsModel';
import _ from 'lodash';
import ElAddress from 'el/components/ElAddress';
import { ERROR, PENDING, SUCCESS } from 'el/store/slices/requestSlice';
import LevelBar from '../accountInfo/components/LevelBar';
import StatsSquare from '../accountInfo/components/StatsSquare';
import AthleteTabs from '../accountInfo/components/AthleteTabs';
import { ActionModel } from 'el/models/action/actionModel';
import ElReportDialog from 'el/components/ElReportDialog';
import { isPad } from 'el/config/constants';

export default function AthleteProfileScreen({ navigation, route }) {
    const { id } = route.params;
    useGoBack();
    const [isShowStats, setIsShowStats] = useState(true);
    const [isOfficial, setIsOfficial] = useState(true);
    const [stats, setStats] = useState<StatsModel[]>([]);
    const [profile, setProfile] = useState<any>({});
    const dispatch = useDispatch();
    const { user } = useAuth();
    const [sports, setSports] = useState<any[]>([]);
    const [currentSport, setCurrentSport] = useState<any>({ name: '' });
    const [isShowReport, setIsShowReport] = useState<boolean>(false);
    const [isShowBlock, setIsShowBlock] = useState<boolean>(false);
    const [noAthlete, setNoAthlete] = useState(false);
    const [width, setWidth] = useState(0);
    const toast = useElToast();

    const options: ActionModel[] = [
        {
            label: 'Report',
            onPress: () => setIsShowReport(true),
        },
        {
            label: 'Block',
            onPress: () => setIsShowBlock(true),
            isHide: profile?.isBlocked
        }
    ];

    useEffect(() => {
        navigation.addListener('focus', () => {
            getAthleteProfile();
        });
    }, []);

    useEffect(() => {
        if (!currentSport.name) return;

        getStats();
    }, [isOfficial, currentSport.name]);

    const getAthleteProfile = async () => {
        const res: ResponseResult<AthleteModel> = await athleteService.getAthleteById(id);
        if (res && res.code === 200) {
            if (res.value) {
                setProfile(res.value);
                getAthleteSports();
                var athleteSport = profileToAthleteSport(res.value);
                setCurrentSport(athleteSport);
            } else {
                setNoAthlete(true);
            }
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
            return athleteService.getBasketballStats(id, isOfficial);
        }
        if (currentSport.name === SportType.Soccer) {
            return athleteService.getSoccerStats(id, isOfficial);
        }

        return athleteService.getLowSportStats(id, isOfficial, currentSport.name);
    };

    const followUser = async () => {
        dispatch(PENDING());
        const res: any = await athleteService.followUser(user.id, id);
        if (res && res.code === 200) {
            getAthleteProfile();
            dispatch(SUCCESS());
        } else {
            dispatch(ERROR());
        }
    };

    const unfollowUser = async () => {
        dispatch(PENDING());
        const res: any = await athleteService.unfollowUser(user.id, id);
        if (res && res.code === 200) {
            getAthleteProfile();
            dispatch(SUCCESS());
        } else {
            dispatch(ERROR());
        }
    };

    const handleUnblockClick = async () => {
        const res: any = await athleteService.unblockAthlete(user.id, id);
        if (res && res.code === 200) {
            getAthleteProfile();
        }
    }

    const getAthleteSports = async () => {
        const res: any = await athleteService.getAthleteSports(id);
        if (res && res.code === 200) {
            setSports(res.value);
        }
    };

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
        // clone new object
        setCurrentSport(Object.assign({}, selectPort));
    }

    const handleReport = async values => {
        const res: any = await athleteService.complain(id, values);
        if (res && res.code === 200) {
            setIsShowReport(false);
            toast.success('We have received your report, and we will deal with it within 24 hours. Thanks.');
        }
    };

    const handleBlock = async () => {
        const res: any = await athleteService.blockAthlete(user.id, id);
        if (res && res.code === 200) {
            dispatch(SUCCESS());
            getAthleteProfile();
            toast.success('Block athlete successfully');
            setIsShowBlock(false);
        } else {
            dispatch(ERROR());
        }
    };

    const onLayout = event => {
        const { width } = event.nativeEvent.layout;
        setWidth(width);
    };

    return (
        <ElScrollContainer>
            {profile.id &&
                <>
                    <HStack direction="row" mt="4" mb="2" space={2}>
                        <ElAvatar uri={profile?.pictureUrl} size={80} />
                        <Box flex={1}>
                            <H3>{`${profile?.firstName} ${profile?.lastName}`}</H3>
                            <ElAddress my="1" {...profile} />
                            <HStack space={2} mt={2} onLayout={onLayout}>
                                {
                                    !profile?.isFollowed && !profile?.isSelf && !profile?.beBlocked && !profile?.isBlocked && <ElButton style={{ width: width / 2 }} size="sm" onPress={followUser}>Follow</ElButton>
                                }
                                {
                                    profile?.isFollowed && !profile?.isSelf && <ElButton style={{ width: width / 2 }} size="sm" onPress={unfollowUser}>Unfollow</ElButton>
                                }
                                {
                                    profile?.isBlocked && !profile?.isSelf && <ElButton style={{ width: width / 2 }} size="sm" onPress={handleUnblockClick}>UnBlock</ElButton>
                                }
                                {
                                    !profile?.isSelf && !profile?.isBlocked && !profile?.beBlocked && <ElChatMessageButton style={{ width: width / 2 }} size="sm" toUserId={id} chatType={ChatType.Personal} />
                                }
                            </HStack>
                        </Box>
                        <Box>
                            <ElMenu items={options} />
                        </Box>
                    </HStack>
                    {
                        !profile?.isBlocked &&
                        <>
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
                        </>
                    }
                </>
            }

            {profile.id && !profile?.isBlocked && isShowStats && stats.length > 0 && <StatsSquare userId={id} stats={stats} />}

            {profile.id && !profile?.isBlocked &&
                <>
                    <Divider my="2" />
                    {
                        profile.isFollowed && <AthleteTabs id={user.id} sportType={currentSport.name} profile={profile} />
                    }
                    {
                        !profile.isFollowed &&
                        <Center>
                            <Text
                                flexShrink={1}
                                fontSize={isPad ? 14 : 12}
                                ellipsizeMode="tail"
                                numberOfLines={1}
                                color={colors.medium} >
                                Visible after following
                            </Text>
                        </Center>
                    }
                    <Box h={2}></Box>
                </>
            }
            {isShowReport && <ElReportDialog isVisible={isShowReport} onCancel={() => setIsShowReport(false)} onSave={handleReport} />}
            {isShowBlock && (
                <ElConfirm
                    visible={isShowBlock}
                    title="Block athlete"
                    message="Are you sure you want to block this athlete?"
                    onConfirm={handleBlock}
                    onCancel={() => setIsShowBlock(false)}
                />
            )}
            {
                noAthlete && <ElBody style={{ textAlign: 'center', marginTop: 16 }}>Cannot find athlete</ElBody>
            }
            {
                profile?.isBlocked && <ElBody style={{ textAlign: 'center', marginTop: 16 }}>You had block athlete</ElBody>
            }
        </ElScrollContainer>
    );
}
