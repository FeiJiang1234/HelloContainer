import React, { useState, useEffect } from 'react';
import { useAuth, useElToast, useGoBack, useImagePicker, useProfileRoute } from 'el/utils';
import { Box, Divider, FlatList, HStack } from 'native-base';
import {
    ElAvatar,
    ElBody,
    ElButton,
    ElChatMessageButton,
    ElConfirm,
    ElMenu,
    ElScrollContainer,
    H3,
} from 'el/components';
import { teamService } from 'el/api';
import { ResponseResult } from 'el/models/responseResult';
import { TeamModel } from 'el/models/team/teamModel';
import ElAddress from 'el/components/ElAddress';
import LevelBar from '../accountInfo/components/LevelBar';
import TeamStats from './components/TeamStats';
import TeamRoster from './components/TeamRoster';
import routes from 'el/navigation/routes';
import TeamJoinedOrganizationList from './components/TeamJoinedOrganizationList';
import TeamJoinedGames from './components/TeamJoinedGames';
import { useDispatch } from 'react-redux';
import { ERROR, PENDING, SUCCESS } from 'el/store/slices/requestSlice';
import { ActionModel } from 'el/models/action/actionModel';
import ProfileMedias from './components/ProfileMedias';
import { ChatType } from 'el/enums';
import { isPad } from 'el/config/constants';
import * as Yup from 'yup';
import ElReportDialog from 'el/components/ElReportDialog';

const validates = Yup.object().shape({
    complainedText: Yup.string().required().max(500).label('Description'),
});

const initValue = {
    complainedText: '',
};

export default function TeamProfileScreen({ navigation, route }) {
    useGoBack({ backTo: routes.TeamList });
    const { id, refresh } = route.params;
    const [profile, setProfile] = useState<TeamModel>();
    const [openDeleteDialogOpen, setOpenDeleteDialogOpen] = useState(false);
    const tabs = ['Roster', 'Organizations', 'Games', 'Stats', 'Media'];
    const [tab, setTab] = useState(tabs[0]);
    const { user } = useAuth();
    const toast = useElToast();
    const { saveCurrentRouteForGoback } = useProfileRoute();
    const dispatch = useDispatch();
    const { chooseAvatarAsync, image, setImage, getImageFormData } = useImagePicker();
    const [isShowReport, setIsShowReport] = useState(false);
    const [noTeam, setNoTeam] = useState(false);
    const [width, setWidth] = useState(0);

    const styles: any = [];
    if (!isPad) {
        styles.push({ width: width / 2 });
    }

    useEffect(() => {
        getTeamProfile();
    }, [id]);

    useEffect(() => {
        if (!refresh) return;

        navigation.setParams({
            refresh: false,
        });
        getTeamProfile();
    }, [refresh]);

    useEffect(() => {
        if (!image.uri) return;

        handleImageSelect();
    }, [image]);

    const options: ActionModel[] = [
        {
            label: 'Invite Players',
            onPress: () => {
                saveCurrentRouteForGoback(routes.InvitePlayers);
                navigation.navigate(routes.InvitePlayers, { teamId: profile?.id });
            },
            isHide: !profile?.isAdminView,
        },
        {
            label: 'Make an Admin',
            onPress: () => {
                saveCurrentRouteForGoback(routes.GetAllUsersToSelectAdmin);
                navigation.navigate(routes.Organization, {
                    screen: routes.GetAllUsersToSelectAdmin,
                    params: { id: id, type: 'Team' },
                });
            },
            isHide: !profile?.isOwner,
        },
        {
            label: 'Delete',
            onPress: () => setOpenDeleteDialogOpen(true),
            isHide: !profile?.isOwner,
        },
        {
            label: 'Report',
            onPress: () => setIsShowReport(true),
            isHide: profile?.isOwner || profile?.isAdminView
        }
    ]

    const getTeamProfile = async () => {
        dispatch(PENDING());
        const res: ResponseResult<TeamModel> = await teamService.getTeamProfile(id);
        if (res && res.code === 200) {
            dispatch(SUCCESS());
            if (res.value) {
                setProfile(res.value);
            } else {
                setNoTeam(true);
            }
        } else {
            dispatch(ERROR());
        }
    }

    const handleJoinTeamClick = async team => {
        const res: any = await teamService.athleteRequestToJoinTeam(user.id, team.id);
        if (res && res.code === 200) {
            getTeamProfile();
        } else {
            toast.error(res.Message);
        }
    }

    const handleImageSelect = async () => {
        dispatch(PENDING());
        const res: any = await teamService.updateTeamProfilePicture(id, getImageFormData());
        if (res && res.code === 200) {
            setImage({ uri: '' });
            await getTeamProfile();
            dispatch(SUCCESS());
        } else {
            dispatch(ERROR());
        }
    }

    const handleYesToDeleteClick = async () => {
        const res: any = await teamService.deleteTeam(id);
        if (res && res.code === 200) {
            toast.success('Delete team successfully.');
            navigation.navigate(routes.TeamList);
            setOpenDeleteDialogOpen(false);
        } else {
            toast.error(res.Message);
        }
    }

    const handleReport = async (data) => {
        data.complainedBy = user.id;
        const res: any = await teamService.complainTeam(id, data);
        if (res && res.code === 200) {
            setIsShowReport(false);
            toast.success('We have received your report, and we will deal with it within 24 hours. Thanks.');
        }
    }

    const onLayout = event => {
        const { width } = event.nativeEvent.layout;
        setWidth(width);
    };

    return <ElScrollContainer>
        {noTeam ? (<ElBody style={{ textAlign: 'center', marginTop: 16 }}>Can not find Team</ElBody>) :
            (
                <>
                    <HStack mt="4" mb="2" space={2}>
                        <ElAvatar onPress={() => profile?.isAdminView && chooseAvatarAsync()} uri={profile?.imageUrl} size={80} />
                        <Box flex={1}>
                            <H3>{profile?.name}</H3>
                            <ElBody size="sm">Sport: {profile?.sportType}</ElBody>
                            <ElBody size="sm">
                                Age Range: {profile?.minAge} - {profile?.maxAge}
                            </ElBody>
                            <ElAddress {...profile} />
                            <HStack space={2} mt={2} onLayout={onLayout}>
                                {
                                    profile?.isAdminView && <ElButton style={styles} size="sm" onPress={() => navigation.navigate(routes.EditTeamProfile, { id: id })}>Edit</ElButton>
                                }
                                {
                                    profile?.isJoin === false && !profile?.isAdminView && <ElButton style={styles} size="sm" onPress={() => handleJoinTeamClick(profile)}>Join team</ElButton>
                                }
                                {
                                    profile?.isJoin === null && !profile?.isAdminView && <ElButton size="sm">Requesting</ElButton>
                                }
                                {
                                    (profile?.isJoin || profile?.isOwner) && <ElChatMessageButton style={styles} toUserId={id} chatType={ChatType.Team}></ElChatMessageButton>
                                }
                            </HStack>
                        </Box>
                        <Box>
                            <ElMenu items={options} />
                        </Box>
                    </HStack>
                    <LevelBar
                        mb={1}
                        level={profile?.level}
                        currentExperience={profile?.currentExperience}
                        nextLevelExperience={profile?.nextLevelExperience}
                    />
                    <ElBody>{profile?.bio ?? 'No bio now'}</ElBody>
                    <Divider my="2" />
                    <FlatList
                        data={tabs}
                        keyExtractor={p => p}
                        ItemSeparatorComponent={() => <Box w={2} />}
                        renderItem={({ item }) => (
                            <ElButton
                                onPress={() => setTab(item)}
                                variant={item !== tab ? 'disabled' : 'contained'}
                                size="sm">
                                {item}
                            </ElButton>
                        )}
                        horizontal={true}
                    />
                    <Box mb={2}>
                        {tab === 'Roster' && <TeamRoster team={profile} />}
                        {tab === 'Organizations' && (
                            <TeamJoinedOrganizationList
                                teamId={profile?.id}
                                isAdminView={profile?.isAdminView}
                                sportType={profile?.sportType}
                            />
                        )}
                        {tab === 'Games' && <TeamJoinedGames teamId={profile?.id} />}
                        {tab === 'Stats' && (
                            <TeamStats
                                id={profile?.id}
                                sportType={profile?.sportType}
                                pictureUrl={profile?.imageUrl}
                                name={profile?.name}
                                state={profile?.state}
                                city={profile?.city}
                            />
                        )}
                        {tab === 'Media' && <ProfileMedias teamId={profile?.id}  />}
                    </Box>
                </>
            )
        }
        <ElConfirm
            visible={openDeleteDialogOpen}
            title="Delete team"
            message="Are you sure you want to delete the current team?"
            onCancel={() => setOpenDeleteDialogOpen(false)}
            onConfirm={handleYesToDeleteClick}
        />
        {isShowReport && <ElReportDialog isVisible={isShowReport} onCancel={() => setIsShowReport(false)} onSave={handleReport} />}
    </ElScrollContainer>
}
