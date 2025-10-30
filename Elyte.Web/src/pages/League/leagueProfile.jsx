import React, { useEffect, useState } from 'react';
import { Typography, Box, Divider, Badge } from '@mui/material';
import { styled } from '@mui/system';
import { ElBox, ElBody, ElSvgIcon, ElButton, ElMenuBtn, ElAvatar, ElTabs, ElImageUploader, NoScrollBox, ElDialog } from 'components';
import { BecomeOfficialDialog, GameSchedule } from 'pageComponents';
import { useLocation, useHistory } from 'react-router-dom';
import { leagueService } from 'services';
import { usePaymentAccounts } from 'utils';
import { OrganizationType } from 'enums';
import PaymentIcon from 'pages/Organization/paymentIcon';
import OrganizationInfo from 'pages/Organization/organizationInfo';
import OurOfficiates from 'pages/Organization/ourOfficiates';
import OrganizationContactUs from 'pages/Organization/organizationContactUs';
import LeagueTeams from './leagueTeams';
import LeagueBracket from './leagueBracket';
import LeagueFacilities from './leagueFacilities';
import LeagueGameHistories from './leagueGameHistories';
import SelectTeamRegisterOrganization from './../Organization/selectTeamRegisterOrganization';
import LeagueFile from './leagueFile';
import LeagueAdmins from './leagueAdmins';
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

const LeagueProfile = () => {
    const history = useHistory();
    const location = useLocation();
    const leagueId = location?.state?.params;
    const { paymentAccounts, getPaymentAccounts, configPaymentAccount } = usePaymentAccounts();
    const [profile, setProfile] = useState({});
    const [showBecomeOfficailDialog, setShowBecomeOfficailDialog] = useState(false);
    const [showSelectTeamDialog, setShowSelectTeamDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [canRegisterTo, setCanRegisterTo] = useState(false);
    const [showConfigStripeDialog, setShowConfigStripeDialog] = useState(false);
    const [payment, setPayment] = useState();
    const [clientSecret, setClientSecret] = useState('');
    const [team, setTeam] = useState();
    const [hasLeague, setHasLeague] = useState(true);

    const menuItems = [
        {
            text: 'Request Official Id',
            onClick: () => history.push('/becomeOfficial', { params: { organizationName: profile.name } }),
            hide: !profile.isAdminView || profile.isOfficial
        },
        {
            text: 'Become Official',
            onClick: () => setShowBecomeOfficailDialog(true),
            hide: !profile.isAdminView || profile.isOfficial
        },
        {
            text: 'Team Queue List',
            onClick: () => history.push("/leagueTeamQueue", leagueId)
        },
        {
            text: 'Make an Admin',
            onClick: () => history.push("/getAllUsersToSelectAdmin", { params: { id: leagueId, type: 'League' } }),
            hide: !profile.isOwner
        },
        {
            text: 'Make a Coordinator',
            onClick: () => history.push("/getAllUsersToSelectCoordinators", { params: { id: leagueId, type: 'League' } }),
            hide: !profile.isOwner
        },
        {
            text: 'Config Stripe Account',
            onClick: () => configPaymentAccount(OrganizationType.League, leagueId),
            hide: !profile.isOwner || !profile.isOfficial || profile.paymentIsEnabled
        },
        {
            text: 'Delete',
            onClick: () => setShowDeleteDialog(true),
            hide: !profile.isOwner || profile.hasTeams
        }
    ];

    useEffect(() => {
        getLeagueProfile();
        getPaymentAccounts();
        getCanRegisterTo();
        getTeamByTeamAdmin();
        getPaymentHistory();
    }, []);

    const getLeagueProfile = async () => {
        const res = await leagueService.getLeague(leagueId);
        if (res && res.code === 200) {
            if (res.value) {
                setProfile(res.value);
            }
            else {
                setHasLeague(false);
            }
        }
    }

    const getCanRegisterTo = async () => {
        const res = await leagueService.getCanRegisterTo(leagueId);
        if (res && res.code === 200) setCanRegisterTo(res.value);
    }

    const getTeamByTeamAdmin = async () => {
        const res = await leagueService.getTeamByTeamAdmin(leagueId);
        if (res && res.code === 200) setTeam(res.value);
    }

    const getRegisterButton = () => {
        if (!profile.isOfficial)
            return <RegisterButton onClick={handleRegisterClick}>Register to Play</RegisterButton>;
        if (profile.paymentIsEnabled && !payment?.payUrl)
            return <RegisterButton onClick={handleRegisterClick}>Register to Play ${profile.registerPrice}</RegisterButton>;
        if (payment?.payUrl)
            return <RegisterButton onClick={() => setClientSecret(payment?.payUrl)}>Finish Registering</RegisterButton>;

        return <WaitForConfigBox>
            <ElBox style={{ fontWeight: 'bold' }}>Cannot Register At This Time</ElBox>
            <ElBox>The organization needs to configure their account.</ElBox>
        </WaitForConfigBox>;
    }

    const getPaymentHistory = async () => {
        const res = await leagueService.getRegisterLeaguePayment(leagueId);
        if (res && res.code === 200) setPayment(res.value);
    };

    const handleEditProfileClick = () => history.push('/editLeagueProfile', { params: profile })

    const handleImageSelect = async image => {
        const res = await leagueService.updateLeagueProfilePicture(leagueId, image.file);
        if (res && res.code === 200) getLeagueProfile();
    };

    const handleRegisterClick = () => setShowSelectTeamDialog(true);

    const handleBecomeClick = async (data) => {
        const isChoosePaymentAccount = data.paymentAccount !== undefined && data.paymentAccount !== '';

        const res = await leagueService.becomeToOfficialLeague(leagueId, data);
        if (res && res.code === 200) {
            setShowBecomeOfficailDialog(false);

            if (!isChoosePaymentAccount) {
                return setShowConfigStripeDialog(true);
            }

            window.elyte.success("Your league is an official organization now!");
            getLeagueProfile();
        }
    }

    const handleYesToDeleteClick = async () => {
        const res = await leagueService.deleteLeague(leagueId);
        if (res && res.code === 200) {
            setShowDeleteDialog(false);
            history.push('/');
        }
    }

    const handleLaterClick = () => {
        setShowConfigStripeDialog(false);
        getLeagueProfile();
    }

    const handleConfigureClick = () => {
        setShowConfigStripeDialog(false);
        configPaymentAccount(OrganizationType.League, leagueId);
    }

    return (
        <NoScrollBox>
            {hasLeague &&
                <>
                    <StripeCheckout clientSecret={clientSecret} type={'League'} onCancel={() => setClientSecret('')} />
                    <ElBox center>
                        <ElImageUploader crop onImageSelected={handleImageSelect} disabled={!profile.isAdminView}>
                            <ElAvatar src={profile.imageUrl} large />
                        </ElImageUploader>
                        <ElBox col pl={2} flex={1} pr={1}>
                            <Badge anchorOrigin={{ vertical: 'top', horizontal: 'right', }} invisible={!profile.isOfficial} badgeContent={"OFFICIAL"} color="primary">
                                <Typography className="profile-title y-center">
                                    {profile.name}
                                    {profile.isOwner && profile.isOfficial && <PaymentIcon paymentIsEnabled={profile.paymentIsEnabled} />}
                                </Typography>
                            </Badge>
                            <OrganizationInfo>Sport: {profile.sportType}</OrganizationInfo>
                            <OrganizationInfo>Rank: {profile.rank}</OrganizationInfo>
                            <OrganizationInfo>Age Range: {profile.minAge} - {profile.maxAge}</OrganizationInfo>
                            <OrganizationInfo>Game Type: {profile.gameType}</OrganizationInfo>
                            <Box mt={1} className='flex-sb'>
                                {
                                    profile.isAdminView && <ElButton className="operation-btn" onClick={handleEditProfileClick}>Edit</ElButton>
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
                    <OurOfficiates id={profile.id} type={OrganizationType.League} isAdminView={profile.isAdminView} />
                    <Divider className='mt-16 mb-16' />
                    <ProfileTab profile={profile} />
                </>
            }

            {
                !profile.isAdminView && (canRegisterTo || payment?.payUrl) && getRegisterButton()
            }
            {
                team?.id && <RegisterButton onClick={() => history.push("/organizationTeamLineUp", { organizationId: leagueId, organizationType: OrganizationType.League, teamId: team.id, isAdminView: true, sportType: profile.sportType })}>
                    Edit Team Roster
                </RegisterButton>
            }
            <BecomeOfficialDialog open={showBecomeOfficailDialog} paymentAccounts={paymentAccounts} onClose={() => setShowBecomeOfficailDialog(false)} onBecomeClick={handleBecomeClick} />
            {
                showSelectTeamDialog &&
                <SelectTeamRegisterOrganization type={OrganizationType.League} organizationInfo={profile} isOfficial={profile.officialId != null} onCancel={() => setShowSelectTeamDialog(false)} onSuccess={() => setCanRegisterTo(false)} />
            }
            <ElDialog open={showDeleteDialog}
                title="Are you sure you want to delete the current league?"
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
                    title="Your league is already an Official Organization, but you need to configure your stripe account to accept payments."
                    actions={
                        <>
                            <ElButton onClick={handleLaterClick}>Later</ElButton>
                            <ElButton onClick={handleConfigureClick}>Configure Now</ElButton>
                        </>
                    }>
                </ElDialog>
            }
            {
                !hasLeague && <Typography mt={4} sx={{ textAlign: 'center', color: '#808A9E' }}>Cannot find league</Typography>
            }
        </NoScrollBox >
    );
};

export default LeagueProfile;

const ProfileTab = ({ profile }) => {
    const tabs = ['Teams', 'Schedule', 'Brackets', 'Game History', 'Facilities', 'Documentation', 'Contact Us', 'Admins'];
    const [tab, setTab] = useState(tabs[0]);

    return (
        <>
            <ElTabs tabs={tabs} tab={tab} onTabChange={(e) => setTab(e)}></ElTabs>
            {tab === 'Teams' && <LeagueTeams isAdminView={profile.isAdminView} isLeagueGameStarted={profile.isLeagueGameStarted} />}
            {tab === 'Admins' && <LeagueAdmins profile={profile} />}
            {tab === 'Brackets' && <LeagueBracket profile={profile} />}
            {tab === "Schedule" && <GameSchedule isOfficial={profile.isOfficial} isLowStats={profile.isLowStats} isAdmin={profile.isAdminView} organizationId={profile.id} organizationType={OrganizationType.League} />}
            {tab === 'Facilities' && <LeagueFacilities />}
            {tab === 'Game History' && <LeagueGameHistories leagueId={profile.id} />}
            {tab === 'Documentation' && <LeagueFile leagueId={profile.id} />}
            {tab === 'Contact Us' && <OrganizationContactUs organizationId={profile.id} organizationType={OrganizationType.League} />}
        </>
    );
}