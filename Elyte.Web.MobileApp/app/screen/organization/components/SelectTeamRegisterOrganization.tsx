import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { athleteService, leagueService, teamService, tournamentService } from 'el/api';
import { useAuth, useElStripe } from 'el/utils';
import {
    ElBody,
    ElButton,
    ElDialog,
    ElErrorMessage,
    ElIdiograph,
    ElLinkBtn,
    ElModal,
    ElRadio,
    ElScrollContainer,
    H3,
} from 'el/components';
import { Box, Divider, Radio, Row, Text } from 'native-base';
import colors from 'el/config/colors';
import { OrganizationType } from 'el/enums';
import BlankAccountCreate from './BlankAccountCreate';

export default function SelectTeamRegisterOrganization({
    type,
    organizationInfo,
    isOfficial,
    onCancel,
    onSuccess,
}) {
    const { user } = useAuth();
    const [teams, setTeams] = useState([]);
    const [teamId, setTeamId] = useState<any>(null);
    const [rosters, setRosters] = useState<any[]>([]);
    const { id, sportType } = organizationInfo;
    const [step, setStep] = useState('selectTeam');
    const [athletes, setAthletes] = useState<any[]>([]);
    const [showPlayerNoNumberDialog, setShowPlayerNoNumberDialog] = useState(false);
    const [showTeamCountExceedDialog, setShowTeamCountExceedDialog] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isCreatePlayer, setIsCreatePlayer] = useState(false);
    const { presentPaymentDirect } = useElStripe();

    useEffect(() => {
        getUserManagedTeams();
    }, []);

    const getUserManagedTeams = async () => {
        const res: any = await athleteService.getAthleteManagedTeams(user.id, type, id, sportType);
        if (res && res.code === 200) {
            setTeams(res.value);
        }
    };

    useEffect(() => {
        getTeamPlayers();
    }, [teamId]);

    const getTeamPlayers = async () => {
        const res: any = await teamService.getTeamRoster(teamId, true, id);
        if (res && res.code === 200) {
            setRosters(res.value.map(x => ({ selectStatus: false, value: x })));
        }
    };

    const handleSelect = id => {
        let clonedAthletes: any = _.cloneDeep(athletes);
        if (!clonedAthletes.includes(id)) {
            clonedAthletes.push(id);
            setAthletes(clonedAthletes);
        } else {
            clonedAthletes = clonedAthletes.filter(x => {
                return x != id;
            });
            setAthletes(clonedAthletes);
        }
    };

    const handleRegister = async () => {
        setError('');
        let hasPlayerNoNumber = rosters.some(
            x => !x.value.playerNumber && athletes.some(athleteId => athleteId == x.value.id),
        );
        if (hasPlayerNoNumber) {
            setShowPlayerNoNumberDialog(true);
        } else {
            await doRegister();
        }
    };

    const handleAutoAssignClick = async () => {
        setShowPlayerNoNumberDialog(false);
        await doRegister();
    };

    const doRegister = async () => {
        const res: any = await checkAllowTeamCount();
        if (res && res.code === 200 && res.value) {
            await processPaymentAndRegister();
        } else {
            setShowTeamCountExceedDialog(true);
        }
    };

    const checkAllowTeamCount = async () => {
        if (type == OrganizationType.League) {
            return leagueService.checkLeagueAllowTeamCount(id);
        }
        if (type == OrganizationType.Tournament) {
            return tournamentService.checkTournamentAllowTeamCount(id);
        }
    };

    const processPaymentAndRegister = async () => {
        setLoading(true);
        const res: any = await getPaymentService();
        setLoading(false);

        if (res && res.code === 200) {
            if (isOfficial) {
                var paymentUrl = res.value.paymentUrl;
                const paySuccess = () => {
                    onSuccess && onSuccess();
                    onCancel();
                };
                const payFailed = () => onCancel();
                await presentPaymentDirect(paymentUrl, paySuccess, payFailed);
            }

            if (!isOfficial) {
                onSuccess();
                onCancel();
            }
        } else {
            setError(res.Message);
        }
    };

    const getPaymentService = () => {
        if (type == OrganizationType.League)
            return teamService.registerToLeague(teamId, id, { athleteIds: athletes });
        if (type == OrganizationType.Tournament)
            return teamService.registerToTournament(teamId, id, { athleteIds: athletes });
    };

    const handleAddTeamToQueueClick = async () => {
        setShowTeamCountExceedDialog(false);
        const res: any = await handleAddTeamToQueueService();
        if (res && res.code === 200) {
            onCancel();
        }
    };

    const handleAddTeamToQueueService = () => {
        if (type == OrganizationType.League) return leagueService.addTeamToQueue(id, teamId);
        if (type == OrganizationType.Tournament)
            return tournamentService.addTeamToQueue(id, teamId);
    };

    const handleCreatePlayer = async data => {
        const res: any = await handleCreatePlayerService(data);
        if (res && res.code === 200) {
            setIsCreatePlayer(false);
            getTeamPlayers();
        }
    };

    const handleCreatePlayerService = data => {
        if (type == OrganizationType.League)
            return teamService.addLeagueBlankAccount(teamId, id, data);

        if (type == OrganizationType.Tournament)
            return teamService.addTournamentBlankAccount(teamId, id, data);
    };

    return (
        <ElScrollContainer style={{ paddingTop: 8 }}>
            {step === 'selectTeam' && (
                <>
                    <H3 style={{ textAlign: 'center' }}>Select a Team</H3>
                    <ElBody textAlign="center" mb={4}>
                        Choose the team you want to register for this Organization
                    </ElBody>
                    <Radio.Group name="teamRadioGroup" value={teamId} onChange={setTeamId}>
                        {teams.map(
                            (item: any) =>
                                (!item.isRequested || !item.isJoin) && (
                                    <ElRadio
                                        key={item.id}
                                        value={item.id}
                                        onPress={() => setTeamId(item.id)}>
                                        <ElIdiograph
                                            onPress={() => setTeamId(item.id)}
                                            title={item.title}
                                            subtitle={item.subtitle}
                                            centerTitle={item.centerTitle}
                                            imageUrl={item.avatarUrl}
                                            style={{ flex: 1 }}
                                        />
                                    </ElRadio>
                                ),
                        )}
                    </Radio.Group>
                    <ElButton disabled={!teamId} onPress={() => setStep('selectPlayer')}>
                        Select and continue
                    </ElButton>
                </>
            )}

            {step === 'selectPlayer' && (
                <>
                    <H3 style={{ textAlign: 'center' }}>Create a Roster</H3>
                    <ElBody textAlign="center" mb={4}>
                        Select the teammates that will play in the Organization
                    </ElBody>
                    <ElLinkBtn onPress={() => setIsCreatePlayer(true)}>
                        + Athlete with no account
                    </ElLinkBtn>
                    {rosters.map((item: any) => (
                        <React.Fragment key={item.value.id}>
                            <Row my={2} alignItems="center" justifyContent="center">
                                <Box flex={1} overflow="hidden" mr={1}>
                                    <ElIdiograph
                                        title={`${item.value.title} (#${item.value.playerNumber ?? ''
                                            })`}
                                        subtitle={`(${item.value.role})`}
                                        centerTitle={
                                            item.value.blankAccountCode
                                                ? `ID: ${item.value.blankAccountCode}`
                                                : item.value.centerTitle
                                        }
                                        imageUrl={item.value.avatarUrl}
                                        style={{ flex: 1 }}
                                    />
                                </Box>

                                {!athletes.includes(item.value.id) && (
                                    <ElButton
                                        size="sm"
                                        onPress={() => handleSelect(item.value.id)}>
                                        Select
                                    </ElButton>
                                )}
                                {athletes.includes(item.value.id) && (
                                    <ElButton
                                        variant="secondary"
                                        size="sm"
                                        onPress={() => handleSelect(item.value.id)}>
                                        Selected
                                    </ElButton>
                                )}
                            </Row>
                            <Divider my="1" />
                        </React.Fragment>
                    ))}
                    <ElErrorMessage error={error} visible={true} my={1} />

                    <ElButton
                        disabled={athletes.length == 0}
                        onPress={handleRegister}
                        loading={loading}>
                        Register
                    </ElButton>
                </>
            )}

            <ElDialog
                visible={showPlayerNoNumberDialog}
                onClose={() => setShowPlayerNoNumberDialog(false)}
                header={
                    <>
                        <H3 style={{ textAlign: 'center' }}>Message</H3>
                        <Text color={colors.secondary} textAlign="center">
                            At least one player has no number.
                        </Text>
                    </>
                }
                footer={
                    <Row>
                        <Box flex={1} mr={1}>
                            <ElButton onPress={() => setShowPlayerNoNumberDialog(false)}>
                                Cancel
                            </ElButton>
                        </Box>
                        <Box flex={1} mr={1}>
                            <ElButton onPress={handleAutoAssignClick}>Continue</ElButton>
                        </Box>
                    </Row>
                }>
                <Text mb={2}>
                    If press Continue, Player Number will be randomly generated when team
                    registration is complete.
                </Text>
                <Text>If press Cancel, will cancel register.</Text>
            </ElDialog>

            <ElDialog
                visible={showTeamCountExceedDialog}
                onClose={() => setShowTeamCountExceedDialog(false)}
                header={
                    <>
                        <H3 style={{ textAlign: 'center' }}>Bummer</H3>
                        <ElBody textAlign="center">We ran out of space!</ElBody>
                    </>
                }
                footer={
                    <Row>
                        <Box flex={1}>
                            <ElButton variant="secondary" onPress={handleAddTeamToQueueClick}>
                                Add Me!
                            </ElButton>
                        </Box>
                    </Row>
                }>
                <Text mb={2}>
                    We apologize, but it looks like there are no more available spots in this{' '}
                    {type == OrganizationType.League
                        ? OrganizationType.League
                        : OrganizationType.Tournament}
                    .
                </Text>
                <Text>
                    If you would like, we can send you a notification if a position opens back
                    up by adding you to the queue!
                </Text>
            </ElDialog>

            <ElModal visible={isCreatePlayer} onClose={() => setIsCreatePlayer(false)}>
                <BlankAccountCreate onCreatePlayer={handleCreatePlayer} />
            </ElModal>
        </ElScrollContainer>
    );
}
