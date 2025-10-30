import { useIsFocused } from '@react-navigation/native';
import { leagueService } from 'el/api';
import {
    ElAvatar,
    ElBody,
    ElButton,
    ElLink,
    ElModal,
    H3,
    ElConfirm,
    ElMenu,
    ElKeyboardAvoidingView,
} from 'el/components';
import colors from 'el/config/colors';
import { OrganizationType } from 'el/enums';
import { ActionModel } from 'el/models/action/actionModel';
import { LeagueModel } from 'el/models/league/leagueModel';
import { ResponseResult } from 'el/models/responseResult';
import routes from 'el/navigation/routes';
import { ERROR, PENDING, SUCCESS } from 'el/store/slices/requestSlice';
import OfficiatesSvg from 'el/svgs/officiatesSvg';
import { useElStripe, useElToast, useGoBack, useImagePicker } from 'el/utils';
import { Box, Divider, FlatList, HStack, Row, Text } from 'native-base';
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import GameSchedule from '../game/components/GameSchedule';
import SelectTeamRegisterOrganization from '../organization/components/SelectTeamRegisterOrganization';
import OrganizationContactUs from '../organization/OrganizationContactUs';
import LeagueAdmins from './components/LeagueAdmins';
import LeagueBracket from './components/LeagueBracket';
import LeagueFacilities from './components/LeagueFacilities';
import LeagueGameHistories from './components/LeagueGameHistories';
import LeagueTeams from './components/LeagueTeams';
import ElReportDialog from 'el/components/ElReportDialog';
import { LinearGradient } from 'expo-linear-gradient';

export default function LeagueProfileScreen({ navigation, route }) {
    useGoBack({ backTo: routes.OrganizationList });
    const { id, refresh } = route.params;
    const [profile, setProfile] = useState<any>({});
    const tabs = [
        'Teams',
        'Schedule',
        'Brackets',
        'Game History',
        'Facilities',
        'Contact Us',
        'Admins',
    ];
    const [tab, setTab] = useState(tabs[0]);
    const { isAdminView, isOfficial, isOwner, paymentIsEnabled } = profile;
    const [canRegisterTo, setCanRegisterTo] = useState(false);
    const { clientSecret, setClientSecret, presentPayment } = useElStripe();
    const [showSelectTeamDialog, setShowSelectTeamDialog] = useState(false);
    const [openDeleteDialogOpen, setOpenDeleteDialogOpen] = useState(false);
    const teamRef = useRef<any>();
    const [team, setTeam] = useState<any>();
    const isFocused = useIsFocused();
    const dispatch = useDispatch();
    const { chooseAvatarAsync, image, setImage, getImageFormData } = useImagePicker();
    const [showReportDialog, setShowReportDialog] = useState(false);
    const toast = useElToast();
    const [hasLeague, setHasLeague] = useState(true);

    const options: ActionModel[] = [
        {
            label: 'Make an Admin',
            onPress: () =>
                navigation.navigate(routes.GetAllUsersToSelectAdmin, { id: id, type: 'League' }),
            isHide: !isOwner,
        },
        {
            label: 'Team Queue List',
            onPress: () => navigation.navigate(routes.LeagueTeamQueue, { id: id }),
        },
        {
            label: 'Make a Coordinator',
            onPress: () =>
                navigation.navigate(routes.AssignCoordinators, { id: id, type: 'League' }),
            isHide: !isOwner,
        },
        {
            label: 'Delete',
            onPress: () => setOpenDeleteDialogOpen(true),
            isHide: !isOwner || profile.hasTeams,
        },
        {
            label: 'Report',
            onPress: () => setShowReportDialog(true),
            isHide: isOwner || isAdminView
        }
    ];

    useEffect(() => {
        if (isFocused) {
            getTeamByTeamAdmin();
        }
    }, [isFocused]);

    useEffect(() => {
        getLeagueProfile();
        getCanRegisterTo();
        getPaymentHistory();
    }, [id]);

    useEffect(() => {
        if (!refresh) return;

        navigation.setParams({
            refresh: false,
        });

        getLeagueProfile();
    }, [refresh]);

    const getLeagueProfile = async () => {
        dispatch(PENDING());
        const res: ResponseResult<LeagueModel> = await leagueService.getLeague(id);
        if (res && res.code === 200) {
            dispatch(SUCCESS());
            if (res.value) {
                setProfile(res.value);
            }
            else {
                setHasLeague(false);
            }
        } else {
            dispatch(ERROR());
        }
    };

    useEffect(() => {
        if (!image.uri) return;

        handleImageSelect();
    }, [image]);

    const handleImageSelect = async () => {
        dispatch(PENDING());
        const res: any = await leagueService.updateLeagueProfilePicture(id, getImageFormData());
        if (res && res.code === 200) {
            dispatch(SUCCESS());
            setImage({ uri: '' });
            getLeagueProfile();
        } else {
            dispatch(ERROR());
        }
    }

    const getCanRegisterTo = async () => {
        const res: any = await leagueService.getCanRegisterTo(id);
        if (res && res.code === 200) setCanRegisterTo(res.value);
    };

    const getPaymentHistory = async () => {
        const res: any = await leagueService.getRegisterLeaguePayment(id);
        if (res && res.code === 200) setClientSecret(res?.value?.payUrl);
    };

    const handleRegisterClick = async () => {
        setShowSelectTeamDialog(true);
    };

    const handleRegisterSuccess = () => {
        setCanRegisterTo(false);
        getTeamByTeamAdmin();
        teamRef?.current.getLeagueTeams();
        if (paymentIsEnabled) {
            getPaymentHistory();
        }
    };

    const handleRegisterCancel = () => {
        setShowSelectTeamDialog(false);
        if (paymentIsEnabled) {
            getPaymentHistory();
        }
    };


    const getTeamByTeamAdmin = async () => {
        const res: any = await leagueService.getTeamByTeamAdmin(id);
        if (res && res.code === 200) setTeam(res.value);
    };

    const handleEditTeamRoster = () => {
        navigation.navigate(routes.OrganizationTeamLineUp, {
            organizationId: id,
            organizationType: OrganizationType.League,
            teamId: team.id,
            isAdminView: true,
            sportType: profile.sportType,
        });
    };

    const handleYesToDeleteClick = async () => {
        const res: any = await leagueService.deleteLeague(id);
        if (res && res.code === 200) {
            setOpenDeleteDialogOpen(false);
            navigation.navigate(routes.OrganizationList);
        }
    };

    const getRegisterButton = () => {
        if (!isOfficial)
            return <Box px={4} style={styles.register}>
                <ElButton onPress={handleRegisterClick}>Register to Play</ElButton>
            </Box>

        if (paymentIsEnabled && !clientSecret)
            return <Box px={4} style={styles.register}>
                <ElButton onPress={handleRegisterClick}>Register to Play ${profile.registerPrice}</ElButton>
            </Box>;

        if (clientSecret)
            return <Box px={4} style={styles.register}>
                <ElButton onPress={() => presentPayment(handleRegisterSuccess, null)}>Finish Registering</ElButton>
            </Box>

        return <Box px={4} style={styles.register}>
            <LinearGradient {...colors.linear} style={{ padding: 8, borderRadius: 8 }}>
                <Text color={colors.white} textAlign='center'>Cannot Register At This Time.</Text>
                <Text color={colors.white} textAlign='center'>The organization needs to configure their account.</Text>
            </LinearGradient>
        </Box>;
    }

    const handleSubmitComplaint = async (data) => {
        const res: any = await leagueService.complainLeague(id, data);
        if (res && res.code === 200) {
            setShowReportDialog(false);
            toast.success('We have received your report, and we will deal with it within 24 hours. Thanks.');
        }
    }

    return (
        <>
            {hasLeague &&
                <ElKeyboardAvoidingView withOffset>
                    <HStack mt="4" mb="2" space={2}>
                        <ElAvatar onPress={() => profile?.isAdminView && chooseAvatarAsync()} uri={profile?.imageUrl} size={80} />
                        <Box flex={1}>
                            <H3>{profile?.name}</H3>
                            <ElBody size="sm">Sport: {profile?.sportType}</ElBody>
                            <ElBody size="sm">Rank: {profile?.rank}</ElBody>
                            <ElBody size="sm">
                                Age Range: {profile.minAge} - {profile.maxAge}
                            </ElBody>
                            <ElBody size="sm">Game Type: {profile.gameType}</ElBody>
                            {profile?.isAdminView && (
                                <ElButton
                                    size="sm"
                                    onPress={() =>
                                        navigation.navigate(routes.EditLeagueProfile, { id: id })
                                    }>
                                    Edit
                                </ElButton>
                            )}
                        </Box>
                        <Box>
                            {isOfficial && <LinearGradient {...colors.linear} style={styles.offical}>
                                    <Text color={colors.white} textAlign='center' fontSize={8}>OFFICIAL</Text>
                                </LinearGradient>
                            }
                            <ElMenu items={options} />
                        </Box>
                    </HStack>
                    <ElBody mb="2">{profile?.details ?? 'No details now'}</ElBody>

                    <Row alignItems="center">
                        <OfficiatesSvg width="25" height="26" />
                        <ElLink
                            to={routes.Officiate}
                            params={{ id, isAdminView, type: OrganizationType.League }}
                            ml={2}>
                            <Text color={colors.primary}>Our Officiates</Text>
                        </ElLink>
                    </Row>

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
                        {tab === 'Teams' && (
                            <LeagueTeams
                                ref={teamRef}
                                leagueId={profile.id}
                                isAdminView={profile.isAdminView}
                                isLeagueGameStarted={profile.isLeagueGameStarted}
                            />
                        )}
                        {tab === 'Schedule' && (
                            <GameSchedule
                                isOfficial={profile.isOfficial}
                                isLowStats={profile.isLowStats} 
                                isAdmin={profile.isAdminView}
                                organizationId={profile.id}
                                organizationType={OrganizationType.League}
                            />
                        )}
                        {tab === 'Brackets' && <LeagueBracket profile={profile} />}
                        {tab === 'Game History' && (
                            <LeagueGameHistories leagueId={profile.id}
                            />
                        )}
                        {tab === 'Facilities' &&
                            <LeagueFacilities
                                ref={teamRef}
                                leagueId={profile.id}
                                isAdminView={profile.isAdminView}
                                isLeagueGameStarted={profile.isLeagueGameStarted}
                            />
                        }
                        {tab === 'Contact Us' &&
                            <OrganizationContactUs
                                organizationId={profile.id}
                                organizationType={OrganizationType.League}
                            />
                        }
                        {tab === 'Admins' && <LeagueAdmins profile={profile} />}
                    </Box>
                </ElKeyboardAvoidingView>
            }
            {
                !hasLeague && <ElBody style={{ textAlign: 'center', marginTop: 16 }}>Cannot find league</ElBody>
            }


            {team?.id && (
                <Box px={4} style={styles.register}>
                    <ElButton onPress={handleEditTeamRoster}>Edit Team Roster</ElButton>
                </Box>
            )}

            {!isAdminView && (canRegisterTo || clientSecret) && getRegisterButton()}
            {showSelectTeamDialog && (
                <ElModal
                    visible={showSelectTeamDialog}
                    onClose={() => setShowSelectTeamDialog(false)}>
                    <SelectTeamRegisterOrganization
                        type={OrganizationType.League}
                        organizationInfo={profile}
                        isOfficial={profile.officialId != null}
                        onCancel={handleRegisterCancel}
                        onSuccess={handleRegisterSuccess}
                    />
                </ElModal>
            )}
            <ElConfirm
                visible={openDeleteDialogOpen}
                title="Delete league"
                message="Are you sure you want to delete the current league?"
                onConfirm={handleYesToDeleteClick}
                onCancel={() => setOpenDeleteDialogOpen(false)}
            />
            <ElReportDialog isVisible={showReportDialog} onCancel={() => setShowReportDialog(false)} onSave={handleSubmitComplaint} />
        </>
    );
}

const styles = StyleSheet.create({
    register: {
        width: '100%',
        position: 'absolute',
        bottom: 8,
    },
    offical:{
        padding: 2, 
        borderRadius: 4, 
        position: 'absolute', 
        right: 0, 
        top: -14, 
        width: 50
    }
});
