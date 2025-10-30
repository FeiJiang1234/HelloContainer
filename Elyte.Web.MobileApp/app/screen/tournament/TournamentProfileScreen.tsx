import { ElAvatar, ElBody, ElButton, ElConfirm, ElKeyboardAvoidingView, ElLink, ElMenu, ElModal, H3 } from 'el/components';
import { useElStripe, useElToast, useGoBack, useImagePicker } from 'el/utils';
import { Box, Divider, FlatList, HStack, Row, Text } from 'native-base';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ERROR, PENDING, SUCCESS } from 'el/store/slices/requestSlice';
import { tournamentService } from 'el/api';
import { TournamentModel } from 'el/models/tournament/tournamentModel';
import { ResponseResult } from 'el/models/responseResult';
import routes from 'el/navigation/routes';
import OfficiatesSvg from 'el/svgs/officiatesSvg';
import { OrganizationType } from 'el/enums';
import colors from 'el/config/colors';
import { ActionModel } from 'el/models/action/actionModel';
import SelectTeamRegisterOrganization from '../organization/components/SelectTeamRegisterOrganization';
import { StyleSheet } from 'react-native';
import TournamentTeams from './components/TournamentTeams';
import OrganizationContactUs from '../organization/OrganizationContactUs';
import { useIsFocused } from '@react-navigation/native';
import TournamentAdmins from './components/TournamentAdmins';
import TournamentBracket from './components/TournamentBracket';
import TournamentFacilities from './components/TournamentFacilities';
import TournamentGameHistories from './components/TournamentGameHistories';
import GameSchedule from '../game/components/GameSchedule';
import ElReportDialog from 'el/components/ElReportDialog';
import { LinearGradient } from 'expo-linear-gradient';

export default function TournamentProfileScreen({ navigation, route }) {
    useGoBack({ backTo: routes.OrganizationList });
    const dispatch = useDispatch();
    const { chooseAvatarAsync, image, setImage, getImageFormData } = useImagePicker();
    const toast = useElToast();
    const [profile, setProfile] = useState<any>({});
    const { isAdminView, isOfficial, isOwner, paymentIsEnabled } = profile;
    const [canRegisterTo, setCanRegisterTo] = useState(false);
    const { id, refresh } = route.params;
    const [payment, setPayment] = useState<any>({});
    const [showSelectTeamDialog, setShowSelectTeamDialog] = useState(false);
    const teamRef = useRef<any>();
    const [team, setTeam] = useState<any>();
    const isFocused = useIsFocused();
    const { clientSecret, setClientSecret, presentPayment } = useElStripe();
    const [showReportDialog, setShowReportDialog] = useState(false);

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
    const [openDeleteDialogOpen, setOpenDeleteDialogOpen] = useState<any>(false);
    const options: ActionModel[] = [
        {
            label: 'Make an Admin',
            onPress: () =>
                navigation.navigate(routes.GetAllUsersToSelectAdmin, { id: id, type: 'Tournament' }),
            isHide: !isOwner,
        },
        {
            label: 'Team Queue List',
            onPress: () => navigation.navigate(routes.TournamentTeamQueue, { id: id }),
        },
        {
            label: 'Make a Coordinator',
            onPress: () =>
                navigation.navigate(routes.AssignCoordinators, { id: id, type: 'Tournament' }),
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
        getTournamentProfile();
        getCanRegisterTo();
        getPaymentHistory();
    }, [id]);

    useEffect(() => {
        if (!refresh) return;

        navigation.setParams({
            refresh: false,
        });

        getTournamentProfile();
    }, [refresh]);

    const getTournamentProfile = async () => {
        dispatch(PENDING());
        const res: ResponseResult<TournamentModel> = await tournamentService.getTournament(id);
        if (res && res.code === 200) {
            dispatch(SUCCESS());
            setProfile(res.value);
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
        const res: any = await tournamentService.updateTournamentProfilePicture(id, getImageFormData());
        if (res && res.code === 200) {
            setImage({ uri: '' });
            await getTournamentProfile();
            dispatch(SUCCESS());
        } else {
            dispatch(ERROR());
        }
    };

    const getCanRegisterTo = async () => {
        const res: any = await tournamentService.getCanRegisterTo(id);
        if (res && res.code === 200) setCanRegisterTo(res.value);
    };

    const getPaymentHistory = async () => {
        const res: any = await tournamentService.getRegisterTournamentPayment(id);
        if (res && res.code === 200) setClientSecret(res?.value?.payUrl);
    };

    const handleYesToDeleteClick = async () => {
        dispatch(PENDING());
        const res: any = await tournamentService.deleteTournament(id)
        if (res && res.code === 200) {
            dispatch(SUCCESS());
            setOpenDeleteDialogOpen(false);
            navigation.navigate(routes.OrganizationList);
        } else {
            toast.error(res.Message);
            dispatch(ERROR());
        }
    }

    const handleRegisterClick = () => {
        setShowSelectTeamDialog(true);
    };

    useEffect(() => {
        if (isFocused) {
            getTeamByTeamAdmin();
        }
    }, [isFocused]);

    const handleRegisterSuccess = () => {
        setCanRegisterTo(false);
        getTeamByTeamAdmin();
        teamRef?.current.getTournamentTeams();
        if (paymentIsEnabled) {
            getPaymentHistory();
        }
    };

    const getTeamByTeamAdmin = async () => {
        dispatch(PENDING());
        const res: any = await tournamentService.getTeamByTeamAdmin(id);
        if (res && res.code === 200) {
            dispatch(SUCCESS());
            setTeam(res.value);
        } else {
            toast.error(res.Message);
            dispatch(ERROR());
        }
    };

    const handleEditTeamRoster = () => {
        navigation.navigate(routes.OrganizationTeamLineUp, {
            organizationId: id,
            organizationType: OrganizationType.Tournament,
            teamId: team.id,
            isAdminView: true,
            sportType: profile.sportType,
        });
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

    const handleRegisterCancel = () => {
        setShowSelectTeamDialog(false);
        if (paymentIsEnabled) {
            getPaymentHistory();
        }
    };

    const handleSubmitComplaint = async (data) => {
        const res: any = await tournamentService.complainTournament(id, data);
        if (res && res.code === 200) {
            setShowReportDialog(false);
            toast.success('We have received your report, and we will deal with it within 24 hours. Thanks.');
        }
    }

    return (
        <>
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
                        {profile?.isAdminView &&
                            <ElButton
                                size="sm"
                                onPress={() =>
                                    navigation.navigate(routes.EditTournamentProfile, { id: id })
                                }>
                                Edit
                            </ElButton>
                        }
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
                        params={{ id, isAdminView, type: OrganizationType.Tournament }}
                        ml={2}>
                        <Text color={colors.primary}>Our Officiates</Text>
                    </ElLink>
                </Row>
                <Divider my="2" />
                <FlatList
                    data={tabs}
                    keyExtractor={p => p}
                    ItemSeparatorComponent={() => <Box w={2} />}
                    renderItem={({ item }) =>
                        <ElButton
                            onPress={() => setTab(item)}
                            variant={item !== tab ? 'disabled' : 'contained'}
                            size="sm">
                            {item}
                        </ElButton>
                    }
                    horizontal={true}
                />

                <Box mb={2}>
                    {tab === 'Teams' && (
                        <TournamentTeams
                            ref={teamRef}
                            tournamentId={profile.id}
                            isAdminView={profile.isAdminView}
                            isTournamentGameStarted={profile.isLeagueGameStarted}
                        />
                    )}
                    {tab === 'Schedule' && (
                        <GameSchedule
                            isLowStats={false}
                            isOfficial={profile.isOfficial}
                            isAdmin={profile.isAdminView}
                            organizationId={profile.id}
                            organizationType={OrganizationType.Tournament}
                        />
                    )}
                    {tab === 'Brackets' && <TournamentBracket profile={profile} />}
                    {tab === 'Game History' && (
                        <TournamentGameHistories tournamentId={profile?.id}
                        />
                    )}
                    {tab === 'Facilities' &&
                        <TournamentFacilities
                            ref={teamRef}
                            tournamentId={profile.id}
                            isAdminView={profile.isAdminView}
                            isTournamentGameStarted={profile.isTournamentGameStarted}
                        />
                    }
                    {tab === 'Contact Us' && (
                        <OrganizationContactUs
                            organizationId={profile.id}
                            organizationType={OrganizationType.Tournament}
                        />
                    )}
                    {tab === 'Admins' && <TournamentAdmins profile={profile} />}
                </Box>
            </ElKeyboardAvoidingView>

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
                        type={OrganizationType.Tournament}
                        organizationInfo={profile}
                        isOfficial={profile.officialId != null}
                        onCancel={handleRegisterCancel}
                        onSuccess={handleRegisterSuccess}
                    />
                </ElModal>
            )}

            <ElConfirm
                visible={openDeleteDialogOpen}
                title="Delete tournament"
                message="Are you sure you want to delete the current tournament?"
                onConfirm={handleYesToDeleteClick}
                onCancel={() => setOpenDeleteDialogOpen(false)}
            />
            <ElReportDialog isVisible={showReportDialog} onCancel={() => setShowReportDialog(false)} onSave={handleSubmitComplaint} />
        </>
    )
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
