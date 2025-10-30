import React, { useEffect, useState, useReducer } from 'react';
import ReactDOM from 'react-dom'
import { styled } from '@mui/system';
import { Container, Box, Grid, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';
import * as signalR from "@microsoft/signalr";
import Header from './Header/header';
import Footer from './Footer/footer';
import { ElButton } from 'components';
import { ServerStateBar } from 'pageComponents';
import { useHistory } from 'react-router-dom';
import { useInitializeSignalR, useNotificationRouter } from 'utils';
import { signalRService, httpService } from 'services';
import { AppActions, appReducer, appStates } from '../../store/reducers/app.reducer';
import { NotificationButtonAction } from 'enums';
import { teamService, athleteService, authService } from 'services';
import copy from 'copy-to-clipboard';

const NotificationContainer = styled(Box)(() => {
    return {
        height: '125px',
        position: 'absolute',
        top: 10,
        width: 'calc(100% - 32px)',
        display: 'flex',
        justifyContent: 'center',
        animationName: 'fadeInDown',
        animationDuration: '1s !important',
        marginLeft: 16,
        marginRight: 16,
        zIndex: 8888,
        '@keyframes fadeInDown': {
            from: { opacity: 0, top: -125 },
            to: { opacity: 1, top: 10 }
        }
    }
});

const Backdrop = styled(Box)(() => {
    return {

        maxWidth: '600px',
        background: '#FFFFFF',
        borderRadius: 10,
        height: '125px',
    }
});

const GridItem = styled(Grid)(() => {
    return {
        display: 'flex',
        alignItems: 'center',
        height: '50px',
        paddingLeft: 16
    }
});

const ElyteIcon = styled('svg')(() => {
    return {
        width: '125px',
        height: '25px',
        marginLeft: -20,
        stroke: 'none',
        strokeWidth: 2,
    }
});

const useStyles = makeStyles(theme => ({
    noPadding: {
        padding: '0 !important'
    },
    container: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(10)
    },
}));

export default function Layout ({ children }) {
    const classes = useStyles();
    let containerClasses = [classes.container];
    const history = useHistory();
    const { signalrClient } = useInitializeSignalR();
    const [state, dispatch] = useReducer(appReducer, appStates);
    const [isShowFooter, setIsShowFooter] = useState(true);


    useEffect(() => setIsShowFooter(history.location.pathname !== "/chatBox"));

    useEffect(() => {
        if (signalrClient) {
            signalrClient.onreconnecting(() => dispatch({ type: AppActions.SetSiganlRConnectionState, payload: false }));
            signalrClient.onreconnected(() => dispatch({ type: AppActions.SetSiganlRConnectionState, payload: true }));
            window.signalR.onclose(() => {
                dispatch({ type: AppActions.SetSiganlRConnectionState, payload: false });
                if (!httpService.getJwt()) return;

                openSignalR();
            });

            if (signalrClient && signalrClient.state !== signalR.HubConnectionState.Connected) {
                openSignalR();
            }
        }
        signalRService.registerReceiveNotificationEvent(handleReceiveNotification);
    }, [signalrClient]);

    const openSignalR = async () => {
        try {
            if (signalrClient && signalrClient.state !== signalR.HubConnectionState.Connected) {
                await window.signalR.start();
                dispatch({ type: AppActions.SetSiganlRConnectionState, payload: true });
            }
        } catch (err) {
            setTimeout(() => openSignalR(), 1000);
        }
    }

    const handleReceiveNotification = (data) => {
        let div = document.createElement('div');
        div.id = data.id;
        ReactDOM.render(<NotificationItem item={data} routerHook={history} />, div)
        document.getElementById("root").appendChild(div);
    }

    switch (history.location.pathname) {
        case '/':
        case "/eventCongratulations":
        case "/eventProfile":
        case "/organizationTeamLineUp":
        case "/teamLineUp":
        case "/changeInGamePlayer":
        case "/chatBox":
            containerClasses.push(classes.noPadding);

    }

    return (
        <Box sx={{ overflow: 'auto', height: '100%' }}>
            <Header />
            {
                !state.isSignalRConnected && (history.location.pathname === "/chatBox" || history.location.pathname === "/chats") &&
                <ServerStateBar />
            }
            <Container maxWidth="sm" className={containerClasses.join(" ")} sx={{ marginTop: '10px' }}>
                {children}
            </Container>
            {isShowFooter && <Footer />}
        </Box>
    );
}

Layout.propTypes = {
    children: PropTypes.element.isRequired,
};

const NotificationItem = ({ item, routerHook }) => {
    const currentUser = authService.getCurrentUser();
    const { getProfileRoute } = useNotificationRouter();

    useEffect(() => setTimeout(() => document.getElementById(item.id)?.remove(), 5000), []);

    const handleNotificationClick = () => {
        routerHook.push(getProfileRoute(item?.action, item?.parameters));
        document.getElementById(item.id)?.remove();
    }

    const handleNotificationClose = (e, item) => {
        e.stopPropagation();
        document.getElementById(item.id)?.remove();
    }

    const handleJoinTeam = async (notificationId, teamId) => {
        const res = await teamService.athleteRequestToJoinTeam(currentUser.id, teamId);
        if (res && res.code === 200) {
            document.getElementById(notificationId)?.remove();
        }
    }

    const handlAcceptJoinTeamRequest = async (notificationId, teamId, requestId) => {
        const res = await teamService.approveAthleteJoinRequest(teamId, requestId);
        if (res && res.code === 200) {
            document.getElementById(notificationId)?.remove();
        }
    }

    const handlDeclineJoinTeamRequest = async (notificationId, teamId, requestId) => {
        const res = await teamService.rejectAthleteJoinRequest(teamId, requestId);
        if (res && res.code === 200) {
            document.getElementById(notificationId)?.remove();
        }
    }

    const handlAcceptTeamInvitation = async (notificationId, athleteId, requestId) => {
        const res = await athleteService.approveTeamInvite(athleteId, requestId);
        if (res && res.code === 200) {
            document.getElementById(notificationId)?.remove();
        }
    }

    const handlDeclineTeamInvitation = async (notificationId, athleteId, requestId) => {
        const res = await athleteService.declineTeamInvite(athleteId, requestId);
        if (res && res.code === 200) {
            document.getElementById(notificationId)?.remove();
        }
    }

    const handleCopyId = (notificationId, content) => {
        copy(content);
        window.elyte.success("copy successfully.");
        document.getElementById(notificationId)?.remove();
    }

    const handleNotificationBtnClick = (e, btnItem) => {
        e.stopPropagation();
        switch (btnItem.action) {
            case NotificationButtonAction.JoinTeam: handleJoinTeam(item.id, btnItem.parameters.teamId); return;
            case NotificationButtonAction.AcceptJoinTeamRequest: handlAcceptJoinTeamRequest(item.id, btnItem.parameters.teamId, btnItem.parameters.requestId); return;
            case NotificationButtonAction.DeclineJoinTeamRequest: handlDeclineJoinTeamRequest(item.id, btnItem.parameters.teamId, btnItem.parameters.requestId); return;
            case NotificationButtonAction.AcceptTeamInvitation: handlAcceptTeamInvitation(item.id, btnItem.parameters.athleteId, btnItem.parameters.invitationId); return;
            case NotificationButtonAction.DeclineTeamInvitation: handlDeclineTeamInvitation(item.id, btnItem.parameters.athleteId, btnItem.parameters.invitationId); return;
            case NotificationButtonAction.CopyOfficialId: handleCopyId(item.id, btnItem.parameters.officialId); return;
            default:
                break;
        }
    }

    return (
        <NotificationContainer>
            <Backdrop onClick={handleNotificationClick}>
                <Grid container direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ borderRadius: 3, background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), linear-gradient(180deg, rgba(220, 220, 220, 0.9) 0%, rgba(255, 255, 255, 0) 112.99%)', width: '100%' }}>
                    <GridItem item xs={10}>
                        <ElyteIcon><use xlinkHref={`/svgs/sprite.svg#elyte-logo`}></use></ElyteIcon>
                    </GridItem>
                    <GridItem item xs={2} sx={{ justifyContent: 'center' }} onClick={(e) => handleNotificationClose(e, item)} >
                        <CloseIcon />
                    </GridItem>
                    <GridItem item xs={12} sx={{ marginTop: -2 }}>
                        <Typography sx={{ color: '#000000', fontSize: 16, fontWeight: 400 }}>{item?.title || ''}</Typography>
                    </GridItem>
                    <GridItem item xs={12} sx={{ marginTop: -3 }}>
                        <Typography sx={{ color: '#808A9E', fontSize: 14, fontWeight: 400 }}>{item?.body + '' || ''}</Typography>
                        {
                            !Array.isNullOrEmpty(item?.buttons) && item?.buttons.map(btn =>
                                <ElButton key={btn.name} sx={{ marginRight: 2, minWidth: 0, padding: 0 }} small onClick={(e) => handleNotificationBtnClick(e, btn)}>{btn.name}</ElButton>
                            )
                        }
                    </GridItem>
                </Grid>
            </Backdrop>
        </NotificationContainer>
    );
}

