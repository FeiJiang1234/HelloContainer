import React, { useState, useRef, useEffect } from 'react';
import { Box, Divider, IconButton, MenuItem, Typography, SpeedDial, SpeedDialIcon, SpeedDialAction, Container } from '@mui/material';
import { ElBox, ElTitle, ElSvgIcon, ElMenu, ElSearchBox, ElDialog, ElLinkBtn } from 'components';
import { makeStyles } from '@mui/styles';
import { useHistory } from 'react-router-dom';
import CalendarMonthlyView from './calendarMonthlyView'
import CalendarWeeklyView from './calendarWeeklyView';
import CalendarDailyView from './calendarDailyView';
import ReminderForm from './components/reminderForm';
import { calendarService, eventService, athleteService, authService, leagueService, tournamentService } from 'services';
import EventIcon from '@mui/icons-material/Event';
import NotificationAddIcon from '@mui/icons-material/NotificationAdd';
import AddIcon from '@mui/icons-material/Add';


const useStyles = makeStyles(theme => {
    return {
        viewOptions: {
            float: 'right',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '15px',
            fontWeight: '500',
            color: theme.palette.body.main
        },
        speedDialContainer: {
            position: 'fixed',
            bottom: theme.spacing(10),
            zIndex: 1,
        },
        speedDial: {
            position: 'absolute',
            bottom: 0,
            right: theme.spacing(4),
            '& svg': {
                fill: 'white'
            },
            '& .MuiSpeedDial-fab': {
                background: theme.bgPrimary,
            },
            '& .MuiSpeedDial-actions': {
                background: theme.bgPrimary,
                borderRadius: '100px 100px 10px 10px',
            },
            '& .MuiSpeedDial-actions.MuiSpeedDial-actionsClosed': {
                background: 'none',
            },
            '& .MuiSpeedDialAction-fab': {
                backgroundColor: 'transparent',
            },
            '& .MuiFab-root': {
                boxShadow: 'none',
            },
        },
    };
});


export default function Calendar () {
    const history = useHistory();
    const classes = useStyles();
    const [userClickDate, setUserClickDate] = useState();
    const calendarViewMenuRef = useRef();
    const adminViewMenuRef = useRef();
    const [showSpeedDial, setShowSpeedDial] = useState(false);
    const [openCalendarViewType, setOpenCalendarViewType] = useState("monthly");
    const [calendarViewTypeTitle, setCalendarViewTypeTitle] = useState("Monthly View");
    const [currentStartDate, setCurrentStartDate] = useState();
    const [currentEndDate, setCurrentEndDate] = useState();
    const [showReminder, setShowReminder] = useState(false);
    const currentUser = authService.getCurrentUser();
    const [athleteManagedOrganizations, setAthleteManagedOrganizations] = useState();
    const [calendarName, setCalendarName] = useState();
    const [calendarOrganizationType, setCalendarOrganizationType] = useState();
    const [calendarOrganizationId, setCalendarOrganizationId] = useState();
    const [isOrganizationAdminView, setIsOrganizationAdminView] = useState(false);

    useEffect(() => getAthleteManagedOrganization(), []);

    useEffect(() => {
        switch (openCalendarViewType) {
            case "monthly":
                setCalendarViewTypeTitle("Monthly View");
                break;
            case "weekly":
                setCalendarViewTypeTitle("Weekly View");
                break;
            case "daily":
                setCalendarViewTypeTitle("Day View");
                break;
        }
    }, [openCalendarViewType]);

    const getAthleteManagedOrganization = async () => {
        let res = await athleteService.getAthleteManagedOrganizations(currentUser.id);
        if (res && res.code === 200 && res.value?.length > 0) {
            setAthleteManagedOrganizations(res.value);
        }
    }

    const [viewInitData, setViewInitData] = useState([]);

    const handleCreateReminderClick = () => {
        setShowReminder(true);
        setShowSpeedDial(false);
    }

    const handleCreateEventClick = () => {
        setShowSpeedDial(false);
        history.push('/eventpage');
    }

    const handleSelectCalendarViewType = (e) => {
        calendarViewMenuRef.current.open(e.currentTarget);
    }

    const handleOpenAdminViewType = (e) => {
        adminViewMenuRef.current.open(e.currentTarget);
    }

    const handleCalendarInit = async (startDate, endDate) => {
        setCurrentStartDate(startDate);
        setCurrentEndDate(endDate);
        let res = await calendarService.getMonthlyViewData(startDate, endDate);
        if (res && res.code === 200 && res.value?.length > 0) {
            setViewInitData(res.value);
        }
    }

    const handleCalendarViewTypeChanged = (type) => {
        setOpenCalendarViewType(type);
        calendarViewMenuRef.current.close();
    }

    const handleDayClick = (date, isOrganizationAdmin) => {
        if (isOrganizationAdmin) {
            setIsOrganizationAdminView(true);
        }
        setUserClickDate(date.currentDate);
        setOpenCalendarViewType("daily");
    }

    const handleCreateReminderClosed = () => {
        setShowReminder(false);
        handleCalendarInit(currentStartDate, currentEndDate);
    }

    const searchEvents = async (data) => {
        const res = await eventService.searchEvent(data);
        history.push('/eventSearch', { param: res.value })
    };

    const getOrganizationDailyGameQty = async (organizationType, organizationId, organizationName) => {
        if (organizationType === 'League') {
            setCalendarOrganizationType(organizationType);
            setCalendarOrganizationId(organizationId);
            setIsOrganizationAdminView(true);
            const res = await leagueService.getLeagueAdminViewGamesData(organizationId, currentStartDate, currentEndDate)
            if (res && res.code === 200) {
                setViewInitData(res.value);
                setCalendarName(organizationName);
                adminViewMenuRef.current.close();
            }
        }
        if (organizationType === 'Tournament') {
            setCalendarOrganizationType(organizationType);
            setCalendarOrganizationId(organizationId);
            setIsOrganizationAdminView(true);
            const res = await tournamentService.getTournamentAdminViewGamesData(organizationId, currentStartDate, currentEndDate)
            if (res && res.code === 200) {
                setViewInitData(res.value);
                setCalendarName(organizationName);
                adminViewMenuRef.current.close();
            }
        }
    }

    const handlePersonalView = () => {
        handleCalendarInit(currentStartDate, currentEndDate);
        setCalendarName();
        setIsOrganizationAdminView(false);
        adminViewMenuRef.current.close();
    }

    return (
        <>
            <ElTitle center>{calendarName} Calendar</ElTitle>
            <ElSearchBox mb={2} onChange={searchEvents} />
            <Box display="flex" mb={1} >
                <ElLinkBtn large onClick={handleOpenAdminViewType}>Admin view</ElLinkBtn>
                <span className="fillRemain"></span>
                <ElBox className={classes.viewOptions}>
                    <Typography fontWeight={500}>{calendarViewTypeTitle}</Typography>
                    <IconButton onClick={handleSelectCalendarViewType}>
                        <ElSvgIcon dark xSmall name="expandMore" />
                    </IconButton>
                </ElBox>
            </Box>
            <Container maxWidth="sm" className={classes.speedDialContainer}>
                <SpeedDial ariaLabel="SpeedDial" className={classes.speedDial} icon={<SpeedDialIcon icon={<AddIcon />} />} open={showSpeedDial} onClick={() => { setShowSpeedDial(!showSpeedDial) }}>
                    <SpeedDialAction icon={<EventIcon />} tooltipTitle="Event" onClick={() => handleCreateEventClick()} />
                    <SpeedDialAction icon={<NotificationAddIcon />} tooltipTitle="Reminder" onClick={() => handleCreateReminderClick()} />
                </SpeedDial>
            </Container>
            <Divider className='divider' />
            {
                openCalendarViewType === "monthly" && <CalendarMonthlyView isOrganizationAdminView={isOrganizationAdminView} initData={viewInitData} onInit={handleCalendarInit} onDayClick={handleDayClick} />
            }
            {
                openCalendarViewType === "weekly" && <CalendarWeeklyView isOrganizationAdminView={isOrganizationAdminView} organizationType={calendarOrganizationType} organizationId={calendarOrganizationId} />
            }
            {
                openCalendarViewType === "daily" && <CalendarDailyView date={userClickDate} isOrganizationAdminView={isOrganizationAdminView} organizationType={calendarOrganizationType} organizationId={calendarOrganizationId} />
            }
            <Box sx={{ height: (theme) => theme.spacing(10) }}></Box>
            <ElMenu ref={calendarViewMenuRef}>
                <MenuItem onClick={() => { handleCalendarViewTypeChanged("monthly") }}>Monthly View</MenuItem>
                <MenuItem onClick={() => { handleCalendarViewTypeChanged("weekly") }}>Weekly View</MenuItem>
                <MenuItem onClick={() => { handleCalendarViewTypeChanged("daily") }}>Day View</MenuItem>
            </ElMenu>
            <ElMenu ref={adminViewMenuRef} left anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'left' }}>
                <MenuItem onClick={handlePersonalView}>personal</MenuItem>
                {
                    !Array.isNullOrEmpty(athleteManagedOrganizations) && athleteManagedOrganizations.map((item, index) => (
                        <Box key={item.id + "-" + index} className={classes.itemLabel}>
                            <MenuItem onClick={() => { getOrganizationDailyGameQty(item.organizationType, item.organizationId, item.name) }}>{item.name}</MenuItem>
                        </Box>
                    ))
                }
            </ElMenu>

            <ElDialog open={showReminder} onClose={() => setShowReminder(false)} title="Create reminder">
                <ReminderForm onCreateReminderPopupClosed={handleCreateReminderClosed} />
            </ElDialog>
        </>
    );
}
