import React, { useEffect, useState } from 'react';
import { Typography, Box, Divider, Badge } from '@mui/material';
import { styled } from '@mui/system';
import { ElBox, ElBody, ElSvgIcon, ElButton, ElAvatar, ElTabs, ElMenuBtn, ElImageUploader, NoScrollBox, ElDialog } from 'components';
import { useLocation, useHistory } from 'react-router-dom';
import { tournamentService } from 'services';
import { usePaymentAccounts } from 'utils';
import { OrganizationType } from 'enums';
import TournamentTeams from './tournamentTeams';
import TournamentBracket from './tournamentBracket';
import TournamentFacilities from './tournamentFacilities';
import TournamentGameHistories from './tournamentGameHistories';
import SelectTeamRegisterOrganization from './../Organization/selectTeamRegisterOrganization';
import { GameSchedule, BecomeOfficialDialog } from 'pageComponents';
import OrganizationContactUs from '../Organization/organizationContactUs';
import TournamentFile from './tournamentFile';
import PaymentIcon from 'pages/Organization/paymentIcon';
import OrganizationInfo from 'pages/Organization/organizationInfo';
import OurOfficiates from 'pages/Organization/ourOfficiates';
import TournamentAdmins from './tournamentAdmins';
import StripeCheckout from 'pages/Organization/stripeCheckout';

const RegisterButton = styled(ElButton)(({ theme }) => {
    return {
        position: 'fixed',
        bottom: theme.spacing(10),
        left: 0,
        right: 0,
        margin: '0 auto',
        width: 'max-content'
    };
});

const WaitForConfigBox = styled(ElBox)(({ theme }) => {
    return {
        position: 'fixed',
        background: theme.bgPrimary,
        bottom: theme.spacing(10),
        left: 0,
        right: 0,
        margin: '0 auto',
        width: 'max-content',
        color: 'white',
        borderRadius: 6,
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    };
});


const TournamentProfile = () => {
    const history = useHistory();
    const location = useLocation();
    const [profile, setProfile] = useState({});
    const tournamentId = location?.state?.params;
    const [showBecomeOfficailDialog, setShowBecomeOfficailDialog] = useState(false);
    const [showSelectTeamDialog, setShowSelectTeamDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const { paymentAccounts, getPaymentAccounts, configPaymentAccount } = usePaymentAccounts();
    const { isOfficial, paymentIsEnabled } = profile;
    const [canRegisterTo, setCanRegisterTo] = useState(false);
    const [showConfigStripeDialog, setShowConfigStripeDialog] = useState(false);
    const [payment, setPayment] = useState([]);
    const [team, setTeam] = useState();
    const [clientSecret, setClientSecret] = useState('');

    const menuItems = [
        {
            text: 'Request Official Id',
            onClick: () => history.push('/becomeOfficial', { params: { organizationName: profile.name } }),
            hide: !profile.isAdminView || isOfficial
        },
        {
            text: 'Become Official',
            onClick: () => setShowBecomeOfficailDialog(true),
            hide: !profile.isAdminView || isOfficial
        },
        {
            text: 'Team Queue List',
            onClick: () => history.push("/tournamentTeamQueue", tournamentId),
        },
        {
            text: 'Make an Admin',
            onClick: () => history.push("/getAllUsersToSelectAdmin", { params: { id: tournamentId, type: 'Tournament' } }),
            hide: !profile.isOwner
        },
        {
            text: 'Make a Coordinator',
            onClick: () => history.push("/getAllUsersToSelectCoordinators", { params: { id: tournamentId, type: 'Tournament' } }),
            hide: !profile.isOwner
        },
        {
            text: 'Config Stripe Account',
            onClick: () => configPaymentAccount(OrganizationType.Tournament, tournamentId),
            hide: !profile.isOwner || !isOfficial || paymentIsEnabled
        },
        {
            text: 'Delete',
            onClick: () => setShowDeleteDialog(true),
            hide: !profile.isOwner || profile.hasTeams
        }
    ];

    useEffect(() => {
        getTournamentProfile();
        getPaymentAccounts();
        getCanRegisterTo();
        getTeamByTeamAdmin();
        getPaymentHistory();
    }, []);

    const getCanRegisterTo = async () => {
        const res = await tournamentService.getCanRegisterTo(tournamentId);
        if (res && res.code === 200) setCanRegisterTo(res.value);
    }

    const getTournamentProfile = async () => {
        const res = await tournamentService.getTournament(tournamentId);
        if (res && res.code === 200) setProfile(res.value);
    }

    const getTeamByTeamAdmin = async () => {
        const res = await tournamentService.getTeamByTeamAdmin(tournamentId);
        if (res && res.code === 200) setTeam(res.value);
    }

    const getRegisterButton = () => {
        if (!isOfficial)
            return <RegisterButton onClick={handleRegisterClick}>Register to Play</RegisterButton>;
        if (paymentIsEnabled && !payment?.payUrl)
            return <RegisterButton onClick={handleRegisterClick}>Register to Play ${profile.registerPrice}</RegisterButton>;
        if (payment?.payUrl)
            return <RegisterButton onClick={() => setClientSecret(payment?.payUrl)}>Finish Registering</RegisterButton>;

        return <WaitForConfigBox>
            <ElBox style={{ fontWeight: 'bold' }}>Cannot Register At This Time</ElBox>
            <ElBox>The organization needs to configure their account.</ElBox>
        </WaitForConfigBox>;
    }


    const getPaymentHistory = async () => {
        const res = await tournamentService.getRegisterTournamentPayment(tournamentId);
        if (res && res.code === 200) setPayment(res.value);
    };

    const handlerEditProfileClick = () => history.push('/editTournamentProfile', { params: profile })

    const handleImageSelect = async (image) => {
        const res = await tournamentService.updateTournamentProfilePicture(tournamentId, image.file);
        if (res && res.code === 200) getTournamentProfile();
    }

    const handleRegisterClick = () => {
        setShowSelectTeamDialog(true);
    }

    const handleBecomeClick = async (data) => {
        const isChoosePaymentAccount = data.paymentAccount !== undefined && data.paymentAccount !== '';

        const res = await tournamentService.becomeToOfficialTournament(tournamentId, data);
        if (res && res.code === 200) {
            setShowBecomeOfficailDialog(false);

            if (!isChoosePaymentAccount) {
                return setShowConfigStripeDialog(true);
            }

            window.elyte.success("Your tournament is an official organization now!");
            getTournamentProfile();
        }
    }

    const handleYesToDeleteClick = async () => {
        const res = await tournamentService.deleteTournament(tournamentId);
        if (res && res.code === 200) {
            setShowDeleteDialog(false);
            history.push('/');
        }
    }

    const handleLaterClick = () => {
        setShowConfigStripeDialog(false);
        getTournamentProfile();
    }

    const handleConfigureClick = () => {
        setShowConfigStripeDialog(false);
        configPaymentAccount(OrganizationType.Tournament, tournamentId);
    }

    return (
        <NoScrollBox>
            <StripeCheckout clientSecret={clientSecret} type={'Tournament'} onCancel={() => setClientSecret('')} />
            <ElBox center>
                <ElImageUploader crop onImageSelected={handleImageSelect} disabled={!profile.isAdminView}>
                    <ElAvatar src={profile.imageUrl} large />
                </ElImageUploader>
                <ElBox col pl={2} flex={1} pr={1}>
                    <Badge anchorOrigin={{ vertical: 'top', horizontal: 'right', }} invisible={!isOfficial} badgeContent={"OFFICIAL"} color="primary">
                        <Typography className="profile-title y-center">
                            {profile.name}
                            {profile.isOwner && isOfficial && <PaymentIcon paymentIsEnabled={paymentIsEnabled} />}
                        </Typography>
                    </Badge>
                    <OrganizationInfo>Sport: {profile.sportType}</OrganizationInfo>
                    <OrganizationInfo>Rank: {profile.rank}</OrganizationInfo>
                    <OrganizationInfo>Age Range: {profile.minAge} - {profile.maxAge}</OrganizationInfo>
                    <OrganizationInfo>Game Type: {profile.gameType}</OrganizationInfo>
                    <Box mt={1} className='flex-sb'>
                        {
                            profile.isAdminView && <ElButton className="operation-btn" onClick={handlerEditProfileClick}>Edit</ElButton>
                        }
                    </Box>
                </ElBox>
                <Box mt={2} alignSelf="flex-start">
                    <ElMenuBtn items={menuItems}>
                        <ElSvgIcon light small name="options" />
                    </ElMenuBtn>
                </Box>
            </ElBox>
            <ElBody mt={2} mb={2}>{profile.details ?? 'No details now'}</ElBody>
            <OurOfficiates id={tournamentId} type={OrganizationType.Tournament} isAdminView={profile.isAdminView} />
            <Divider className='mt-16 mb-16' />
            <ProfileTab profile={profile} tournamentId={tournamentId}></ProfileTab>
            {
                !profile.isAdminView && (canRegisterTo || payment?.payUrl) && getRegisterButton()
            }
            {
                team?.id && <RegisterButton onClick={() => history.push("/organizationTeamLineUp", { organizationId: tournamentId, organizationType: OrganizationType.Tournament, teamId: team.id, isAdminView: true, sportType: profile.sportType })}>
                    Edit Team Roster
                </RegisterButton>
            }
            <BecomeOfficialDialog open={showBecomeOfficailDialog} paymentAccounts={paymentAccounts} onClose={() => setShowBecomeOfficailDialog(false)} onBecomeClick={handleBecomeClick} />
            {
                showSelectTeamDialog &&
                <SelectTeamRegisterOrganization type={OrganizationType.Tournament} organizationInfo={profile} isOfficial={profile.officialId != null} onCancel={() => setShowSelectTeamDialog(false)} onSuccess={() => setCanRegisterTo(false)} />
            }
            <ElDialog open={showDeleteDialog}
                title="Are you sure you want to delete the current tournament?"
                actions={
                    <>
                        <ElButton onClick={handleYesToDeleteClick}>Yes</ElButton>
                        <ElButton onClick={() => setShowDeleteDialog(false)}>No</ElButton>
                    </>
                }>
            </ElDialog>
            {
                showConfigStripeDialog &&
                <ElDialog open={showConfigStripeDialog}
                    title="Your tournament is already an Official Organization, but you need to configure your stripe account to accept payments."
                    actions={
                        <>
                            <ElButton onClick={handleLaterClick}>Later</ElButton>
                            <ElButton onClick={handleConfigureClick}>Configure Now</ElButton>
                        </>
                    }>
                </ElDialog>
            }
        </NoScrollBox>
    );
};

export default TournamentProfile;

const ProfileTab = ({ profile, tournamentId }) => {
    const tabs = ['Teams', 'Schedule', 'Brackets', 'Game History', 'Facilities', 'Documentation', 'Contact Us', 'Admins'];
    const [tab, setTab] = useState(tabs[0]);

    return (
        <>
            <ElTabs tabs={tabs} tab={tab} onTabChange={(e) => setTab(e)}></ElTabs>
            {tab === 'Teams' && <TournamentTeams isAdminView={profile.isAdminView} isLeagueGameStarted={profile.isLeagueGameStarted} />}
            {tab === 'Admins' && <TournamentAdmins profile={profile} />}
            {tab === 'Brackets' && <TournamentBracket profile={profile} />}
            {tab === "Schedule" && <GameSchedule isOfficial={profile.isOfficial} isLowStats={profile.isLowStats} isAdmin={profile.isAdminView} organizationId={tournamentId} organizationType={OrganizationType.Tournament} />}
            {tab === 'Facilities' && <TournamentFacilities />}
            {tab === 'Game History' && <TournamentGameHistories tournamentId={tournamentId} />}
            {tab === 'Documentation' && <TournamentFile tournamentId={tournamentId} />}
            {tab === 'Contact Us' && <OrganizationContactUs organizationId={tournamentId} organizationType={OrganizationType.Tournament} />}
        </>
    );
}