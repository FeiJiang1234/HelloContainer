import React, { useState, useEffect } from 'react';
import { ElButton, ElBox, ElDialog } from 'components';
import { authService, athleteService, teamService, leagueService, tournamentService } from 'services';
import { FormControl, RadioGroup, Typography } from '@mui/material';
import _ from 'lodash';
import OrganizationRegisterTeam from './organizationRegisterTeam';
import IdiographRow from 'parts/Commons/idiographRow';
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import BlankAccountCreate from 'pages/Organization/blankAccountCreate';
import StripeCheckout from './stripeCheckout';

const useStyles = makeStyles({
    dialogRoot: {
        "& .MuiPaper-root": {
            borderStyle: 'solid', borderColor: 'red'
        }
    }
});

export default function SelectTeamRegisterOrganization ({ type, organizationInfo, isOfficial, onCancel, onSuccess }) {
    const classes = useStyles();
    const currentUser = authService.getCurrentUser();
    const { id, sportType } = organizationInfo;
    const [teams, setTeams] = useState([]);
    const [teamId, setTeamId] = useState(null);
    const [isSelectTeam, setIsSelectTeam] = useState(true);
    const [isSelectPlayer, setIsSelectPlayer] = useState(false);
    const [isCreatePlayer, setIsCreatePlayer] = useState(false);
    const [rosters, setRosters] = useState([]);
    const [athletes, setAthletes] = useState([]);
    const [continueDisabled, setContinueDisabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [showPlayerNoNumberDialog, setShowPlayerNoNumberDialog] = useState(false);
    const [showTeamCountExceedDialog, setShowTeamCountExceedDialog] = useState(false);
    const [clientSecret, setClientSecret] = useState();

    useEffect(() => getUserManagedTeams(), []);

    useEffect(() => getTeamPlayers(), [teamId]);

    const getUserManagedTeams = async () => {
        const res = await athleteService.getAthleteManagedTeams(currentUser.id, type, id, sportType);
        if (res && res.code === 200) {
            setTeams(res.value);
        }
    }

    const getTeamPlayers = async () => {
        const res = await teamService.getTeamRoster(teamId, true, id);
        if (res && res.code === 200) {
            setRosters(res.value.map(x => ({ selectStatus: false, value: x })));
        }
    }

    const handleChange = (event) => {
        setContinueDisabled(false)
        setTeamId(event.target.value);
    };

    const handleContinue = () => {
        setIsSelectTeam(false);
        setIsSelectPlayer(true);
    }

    const handleAddBlankAccount = () => {
        setIsSelectPlayer(false);
        setIsCreatePlayer(true);
    }

    const handleSelect = (id) => {
        let clonedAthletes = _.cloneDeep(athletes)
        if (!clonedAthletes.includes(id)) {
            clonedAthletes.push(id);
            setAthletes(clonedAthletes);
        }
        else {
            clonedAthletes = clonedAthletes.filter((x) => { return x != id });
            setAthletes(clonedAthletes);
        }
    }

    const handleRegister = async () => {
        let hasPlayerNoNumber = rosters.some(x => !x.value.playerNumber && athletes.some(athleteId => athleteId == x.value.id));
        if (hasPlayerNoNumber) {
            setShowPlayerNoNumberDialog(true);
        } else {
            await doRegister();
        }
    }

    const doRegister = async () => {
        const res = await checkAllowTeamCount()
        if (res && res.code === 200 && res.value) {
            await processPaymentAndRegister();
        } else {
            setShowTeamCountExceedDialog(true);
        }
    }

    const checkAllowTeamCount = async () => {
        if (type == 'League') return leagueService.checkLeagueAllowTeamCount(id);
        if (type == 'Tournament') return tournamentService.checkTournamentAllowTeamCount(id);
    }

    const processPaymentAndRegister = async () => {
        setLoading(true);
        const res = await getPaymentService();
        if (isOfficial && res && res.code === 200) {
            var paymentUrl = res.value.paymentUrl;
            setClientSecret(paymentUrl);
            // onCancel();
        }
        if (!isOfficial && res && res.code === 200) {
            onCancel();
            onSuccess();
        }
        setLoading(false);
    }

    const getPaymentService = () => {
        if (type == 'League') return teamService.registerToLeague(teamId, id, { athleteIds: athletes });
        if (type == 'Tournament') return teamService.registerToTournament(teamId, id, { athleteIds: athletes });
    }

    const handleAddTeamToQueueClick = async () => {
        setLoading(true);
        setShowTeamCountExceedDialog(false);
        const res = await handleAddTeamToQueueService();
        if (res && res.code === 200) {
            window.elyte.success("join queue successfully!");
            onCancel();
        }
        setLoading(false);
    }

    const handleAddTeamToQueueService = () => {
        if (type == 'League') return leagueService.addTeamToQueue(id, teamId);
        if (type == 'Tournament') return tournamentService.addTeamToQueue(id, teamId);
    }

    const handleAutoAssignClick = async () => {
        setShowPlayerNoNumberDialog(false);
        await doRegister();
    }

    const handleCancelPlayerNumberClick = () => {
        setShowPlayerNoNumberDialog(false);
    }

    const handleCancelAddTeamToQueueClick = () => {
        setShowTeamCountExceedDialog(false);
    }

    return (
        <>
            {
                !clientSecret &&
                <ElDialog open={isSelectTeam} onClose={onCancel} title="Select a Team" subTitle="Choose the team you want to register for this League"
                    actions={<ElButton disabled={continueDisabled} onClick={handleContinue}>Select and continue</ElButton>}>
                    <FormControl style={{ width: '100%' }}>
                        {
                            <RadioGroup name="select team" value={teamId} onChange={handleChange}>
                                {teams.map((item, index) => (!item.isRequested || !item.isJoin) && <OrganizationRegisterTeam key={item.id + index} item={item} />)}
                            </RadioGroup>
                        }
                    </FormControl>
                </ElDialog>
            }
            {
                !clientSecret &&
                <ElDialog open={isSelectPlayer} onClose={onCancel} title="Create a Roster" subTitle="Select the teammates that will play in the League"
                    actions={<ElButton disabled={athletes.length == 0} loading={loading} onClick={handleRegister}>Register</ElButton>}>
                    <span className="text-btn-green" onClick={handleAddBlankAccount}>+ Athlete with no account</span>
                    {
                        Array.isNullOrEmpty(rosters) && <ElBox mt={2} center flex={1}>No player</ElBox>
                    }
                    {
                        !clientSecret && !Array.isNullOrEmpty(rosters) && <Box overflow='auto' maxHeight='300px'>
                            {rosters.map((item, index) => (
                                <IdiographRow key={index} noDivider
                                    title={`${item.value.title} (#${item.value.playerNumber ?? ""})`}
                                    subtitle={`(${item.value.role})`}
                                    centerTitle={item.value.blankAccountCode ? `ID: ${item.value.blankAccountCode}` : item.value.centerTitle}
                                    imgurl={item.value.avatarUrl}>
                                    {
                                        !athletes.includes(item.value.id) &&
                                        <ElButton small onClick={() => handleSelect(item.value.id)}>Select</ElButton>
                                    }
                                    {
                                        athletes.includes(item.value.id) &&
                                        <ElButton small onClick={() => handleSelect(item.value.id)} className="green">Selected</ElButton>
                                    }
                                </IdiographRow>
                            ))}
                        </Box>
                    }
                </ElDialog>
            }

            <StripeCheckout clientSecret={clientSecret} type={type} onCancel={() => setClientSecret('')} />

            <BlankAccountCreate
                isCreatePlayer={isCreatePlayer}
                onCancel={onCancel}
                teamId={teamId}
                organizationId={id}
                organizationType={type}
                onSuccess={() => {
                    setIsSelectPlayer(true);
                    setIsCreatePlayer(false);
                    getTeamPlayers();
                }} />

            <ElDialog open={showPlayerNoNumberDialog} subgreen
                title="Message" subTitle="At least one player has no number."
                actions={
                    <>
                        <ElButton onClick={handleCancelPlayerNumberClick}>Cancel</ElButton>
                        <ElButton onClick={handleAutoAssignClick}>Continue</ElButton>
                    </>
                }>
                <Typography>If press Continue, Player Number will be randomly generated when team registration is complete. <br /> If press Cancel, will cancel register.</Typography>
            </ElDialog>

            <ElDialog
                className={classes.dialogRoot}
                style={{ borderStyle: 'solid', borderColor: 'red' }}
                open={showTeamCountExceedDialog}
                onClose={handleCancelAddTeamToQueueClick}
                title="Bummer!" subTitle="We ran out of space!"
                actions={
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <ElButton sx={{ background: '#17C476', width: "150px" }} onClick={handleAddTeamToQueueClick}>Add Me!</ElButton>
                    </Box>
                }>
                <Typography>
                    We apologize, but it looks like there are no more available spots in this {type == 'League' ? 'League' : 'Tournament'}. <br /><br />
                    If you would like, we can send you a notification if a position opens back up by adding you to the queue!
                </Typography>
            </ElDialog>
        </>
    );
}