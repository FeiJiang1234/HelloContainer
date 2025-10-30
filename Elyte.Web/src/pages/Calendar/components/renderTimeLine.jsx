import React, { useState, useEffect, useRef, useContext } from 'react';
import { Box, Typography, Divider, MenuItem } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useHistory } from 'react-router-dom';
import { ElDialog, ElMenu } from 'components';
import ReminderForm from './reminderForm';
import { athleteService, calendarService, eventService, gameService } from 'services';
import * as moment from 'moment';
import { AppActions } from '../../../store/reducers/app.reducer';
import { AppContext } from '../../../App';

const timeRows = [
    { time: '12am' },
    { time: '1am' },
    { time: '2am' },
    { time: '3am' },
    { time: '4am' },
    { time: '5am' },
    { time: '6am' },
    { time: '7am' },
    { time: '8am' },
    { time: '9am' },
    { time: '10am' },
    { time: '11am' },
    { time: 'Noon' },
    { time: '1pm' },
    { time: '2pm' },
    { time: '3pm' },
    { time: '4pm' },
    { time: '5pm' },
    { time: '6pm' },
    { time: '7pm' },
    { time: '8pm' },
    { time: '9pm' },
    { time: '10pm' },
    { time: '11pm' },
];

const useStyles = makeStyles(theme => ({
    timestapWrraper: {
        width: 44,
        color: theme.palette.body.light,
        fontSize: 12,
        fontWeight: 500,
    },
    timeRow: {
        display: 'flex',
        height: 50,
        alignItems: 'center'
    },
    timelineContainer: {
        width: '100%',
        height: 1150,
        position: 'relative'
    },
    schedule: {
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        maxWidth: theme.breakpoints.values.sm - theme.spacing(10),
        position: 'absolute',
        background: 'linear-gradient(179.38deg, #1F345D 16.7%, #080E1B 115.63%)',
        marginBottom: '1.5px',
        marginTop: '1.5px'
    },
    scheduleEventColor: {
        background: 'linear-gradient(180deg, #2599FB 6.84%, #006BC5 100%)'
    },
    scheduleReminderColor: {
        background: 'linear-gradient(179.38deg, #1F345D 16.7%, #080E1B 115.63%)'
    },
    scheduleTitle: {
        fontSize: 15,
        color: '#FFFFFF'
    },
    scheduleAddress: {
        fontSize: 11,
        color: '#F0F2F7'
    }
}));

export default function RenderTimeLine ({ initData, onReload, onEditGame, onCreateGame }) {
    const classes = useStyles();
    const menuRef = useRef();
    const timelineRef = useRef(null);
    const history = useHistory();
    const { dispatch } = useContext(AppContext);
    const [selectItem, setSelectItem] = useState({});
    const [scheduleList, setScheduleList] = useState([]);
    const [reminderData, setReminderData] = useState();
    const [dialogTitle, setDialogTitle] = useState("Edit Reminder");
    const isGame = selectItem?.type === 'game';
    const isReminder = selectItem?.type === 'reminder';
    const isEvent = selectItem?.type === "event";
    const { isAdmin, gameStatus, title } = selectItem;

    useEffect(() => buildScheduleList(), [initData]);

    const buildScheduleList = () => {
        let sortedData = initData.filter(x => x.startTime && x.endTime).sort((a, b) => { return new Date(a.startTime) - new Date(b.startTime); });

        for (let i = 0; i < sortedData.length; i++) {
            let overlapSchedules = buildOverlapSchedules(sortedData);
            calculateScheduleSizeAndLocation(sortedData, overlapSchedules);
        }

        setScheduleList(sortedData);
    }

    const buildOverlapSchedules = (sortedData) => {
        let overlapSchedules = new Array();
        let minDateTime = "";
        let maxDateTime = "";
        let notDraw = sortedData.filter(x => !x.isDraw);
        for (let index = 0; index < notDraw.length; index++) {
            const element = notDraw[index];

            if (index === 0) {
                minDateTime = element.startTime;
                maxDateTime = element.endTime;
                overlapSchedules.push(element);
                continue;
            }

            if (isInDuringDateTime(element.startTime, minDateTime, maxDateTime) || isInDuringDateTime(element.endTime, minDateTime, maxDateTime)) {
                overlapSchedules.push(element);
                if (new Date(element.startTime) < new Date(minDateTime)) {
                    minDateTime = element.startTime;
                }

                if (new Date(element.endTime) > new Date(maxDateTime)) {
                    maxDateTime = element.endTime;
                }
            }
        }

        return overlapSchedules;
    }

    const calculateScheduleSizeAndLocation = (sortedData, overlapSchedules) => {
        const xOffset = 40;
        let baseWidth = Math.round((timelineRef.current.clientWidth - xOffset) / overlapSchedules.length);
        let basePixel = 0.846;
        for (let index = 0; index < overlapSchedules.length; index++) {
            const element = overlapSchedules[index];
            let originData = sortedData.find(x => x.id === element.id);
            if (originData) {
                let height = (convertDateToMinutes(originData.endTime) - convertDateToMinutes(originData.startTime)) * basePixel;
                let locationX = index > 0 ? index * baseWidth + index : index * baseWidth;
                originData["location"] = { x: locationX + xOffset + 'px', y: convertDateToMinutes(originData.startTime) * basePixel + 'px' };
                originData["size"] = { width: baseWidth + 'px', height: (height - 3) + 'px' };
                originData["isDraw"] = true;
            }
        }
    }

    const convertDateToMinutes = (time) => {
        if (!time) return 0;
        let d = moment(time);
        return d.hours() * 60 + d.minutes();
    }

    const isInDuringDateTime = (currentTime, startTime, endTime) => {
        return new Date(currentTime) < new Date(endTime) && new Date(currentTime) >= new Date(startTime);
    }

    const handleBoxClick = async (e, item) => {
        if(item.type === 'game' && !item.isAdmin){
            redirectToGame(item);
        }else{
            setSelectItem(item);
            menuRef.current.open(e.currentTarget);
        }
    }

    const handleCreateReminderClosed = () => {
        setReminderData(null);
        if (onReload) {
            onReload();
        }
    }

    const handleMenuDeleteClick = async () => {
        menuRef.current.close();
        if (!selectItem) return;

        const service = isReminder ?
            athleteService.deleteCalendarReminder(selectItem.id) :
            eventService.deleteEvent(selectItem.id);
        const res = await service;
        if (res && res.code === 200 && res.value) {
            dispatch({ type: AppActions.RefreshAlarmQueue });
            if (onReload) {
                onReload();
            }
        }
    };

    const handleMenuExitClick = async () => {
        menuRef.current.close();
        if (!selectItem) return;
        const service = isReminder ?
            athleteService.deleteCalendarReminder(selectItem.id) :
            eventService.exitEvent(selectItem.eventId);
        const res = await service;
        if (res && res.code === 200 && res.value) {
            dispatch({ type: AppActions.RefreshAlarmQueue });
            if (onReload) {
                onReload();
            }
        }
    };

    const handleMenuEditClick = async () => {
        menuRef.current.close();
        if (isReminder) {
            const result = await calendarService.getReminderDetailById(selectItem.id);
            if (result && result.code === 200 && result.value) {
                setReminderData({ isEdit: true, ...result.value });
                setDialogTitle("Edit Reminder");
            }
            return;
        }

        if (isEvent) {
            const res = await eventService.getEventProfile(selectItem.id);
            if (res && res.code === 200 && res.value) {
                let eventDate = moment(res.value.startTime).format("YYYY-MM-DD");
                let startTime = moment(res.value.startTime).format("HH:mm");
                let endTime = moment(res.value.endTime).format("HH:mm");
                history.push('/eventpage', {
                    params: {
                        ...res.value,
                        eventDate: eventDate,
                        startTime: startTime,
                        endTime: endTime,
                        isEdit: true
                    }
                });
            }
        }

        if (isGame) {
            onEditGame && onEditGame(selectItem);
        }
    };

    const handleMenuViewClick = async () => {
        menuRef.current.close();
        if (isEvent) {
            history.push('/eventProfile', { params: selectItem.id });
            return;
        }

        if (isReminder) {
            const result = await calendarService.getReminderDetailById(selectItem.id);
            if (result && result.code === 200 && result.value) {
                setReminderData({ isEdit: false, ...result.value });
                setDialogTitle("Reminder Detail");
            }
            return;
        }

        if (isGame) {
            await redirectToGame(selectItem);
        }
    }
    
    async function redirectToGame(item) {
        const res = await gameService.getGameProfile(item.id);
        if (res && res.code === 200) {
            if (res.value.gameStatus == "Confirmed")
                history.push('/gamePost', { gameId: res.value.id, gameSportType: res.value.gameSportType });

            else
                history.push("/gameProfile", { params: item });
        }
    }

    return <>
        <Box ml={1.5} mr={1.5} mt={1} mb={20}>
            <Box className={classes.timelineContainer} ref={timelineRef}>
                {
                    scheduleList.map((item, index) => {
                        return <React.Fragment key={'timeline-box-' + index}>
                            <Box onClick={(e) => { handleBoxClick(e, item) }} className={[classes.schedule, item?.type === "event" ? classes.scheduleEventColor : classes.scheduleReminderColor].join(" ")}
                                style={{
                                    width: item?.size?.width,
                                    height: item?.size?.height,
                                    top: item?.location?.y,
                                    left: item?.location?.x,
                                    paddingLeft: 4
                                }}>

                                <Box>
                                    {<Typography className={classes.scheduleTitle}>{item.title ? item.title : 'Game TBD'}</Typography>}
                                    {item.address && <Typography className={classes.scheduleAddress}>{item.address}</Typography>}
                                </Box>
                            </Box>
                        </React.Fragment>
                    })
                }
                {
                    timeRows.map((item, index) => (
                        <React.Fragment key={'timeline-scale-' + index} >
                            <Box className={classes.timeRow} onClick={() => onCreateGame && onCreateGame()}>
                                <Box className={classes.timestapWrraper}>{item.time}</Box>
                            </Box>
                            <Divider />
                        </React.Fragment>
                    ))
                }
            </Box>
        </Box>

        <ElMenu ref={menuRef}>
            {(!isGame || (isGame && title)) && <MenuItem onClick={handleMenuViewClick}>View</MenuItem>}
            {(!isGame || (isGame && !gameStatus)) && isAdmin && <MenuItem onClick={handleMenuEditClick}>Edit</MenuItem>}
            {!isGame && isAdmin && <MenuItem onClick={handleMenuDeleteClick}>Delete</MenuItem>}
            {!isGame && !isAdmin && <MenuItem onClick={handleMenuExitClick}>Exit</MenuItem>}
        </ElMenu>

        {
            !!reminderData &&
            <ElDialog open={!!reminderData} onClose={() => setReminderData(null)} title={dialogTitle}>
                <ReminderForm initData={reminderData} onCreateReminderPopupClosed={handleCreateReminderClosed} />
            </ElDialog>
        }
    </>
}
