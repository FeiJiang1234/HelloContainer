import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ElButton, ElSelect, ElDateTimePicker, ElGroupSelect } from 'components';
import { useForm } from "react-hook-form";
import * as moment from 'moment';
import { tournamentService, leagueService } from 'services';


const useStyles = makeStyles(() => ({
    buttonWrapper: {
        display: 'flex',
        gap: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        '& > *': {
            flex: 1,
        }
    }
}));

const organizationServices = [
    {
        type: 'Tournament',
        getOfficiates: tournamentService.getTournamentOfficiates,
        getFreeOfficiates: tournamentService.getTournamentFreeOfficiates,
        getAvailableFacilitiesForGame: tournamentService.getAvailableFacilitiesForTournamentGame,
        getUneditedGames: tournamentService.getTournamentUneditedGames,
        editGameInfo: tournamentService.editTournamentGameInfo,
        profileRoute: '/tournamentProfile'
    },
    {
        type: 'League',
        getOfficiates: leagueService.getLeagueOfficiates,
        getFreeOfficiates: leagueService.getLeagueFreeOfficiates,
        getAvailableFacilitiesForGame: leagueService.getAvailableFacilitiesForLeagueGame,
        getUneditedGames: leagueService.getLeagueUneditedGames,
        editGameInfo: leagueService.editLeagueGameInfo,
        profileRoute: '/leagueProfile'
    }
];

export default function CreateGameInfo ({ isOfficial, isLowStats, date, organizationId, organizationType, onCancel }) {
    const history = useHistory();
    const classes = useStyles();
    const { register, handleSubmit, getValues, control, formState: { errors } } = useForm();
    const [btnLoadingStatus, setBtnLoadingStatus] = useState(false);
    const [facilities, setFacilities] = useState([]);
    const [officiates, setOfficiates] = useState([]);
    const [games, setGames] = useState([]);

    useEffect(() => {
        getOriginalOfficiates();
        getGames();
    }, []);


    const getOriginalOfficiates = async () => {
        const res = await organizationServices.find(x => x.type === organizationType)?.getOfficiates(organizationId);
        if (res && res.code === 200) {
            const users = res.value.map(x => ({ label: x.name, value: x.athleteId }));
            setOfficiates([...users]);
        }
    }

    const getOfficiates = async (gameId, startTime, endTime) => {
        const res = await organizationServices.find(x => x.type === organizationType)?.getFreeOfficiates(organizationId, gameId, startTime, endTime);
        if (res && res.code === 200) {
            const users = res.value.map(x => ({ label: x.name, value: x.athleteId }));
            setOfficiates([...users]);
        }
    }

    const getFacilities = async (startTime, endTime) => {
        const res = await organizationServices.find(x => x.type === organizationType)?.getAvailableFacilitiesForGame(organizationId, startTime, endTime);
        if (res && res.code === 200) {
            const resultFacilities = res.value.map(x => ({ label: x.name, value: x.id }));
            setFacilities([...resultFacilities]);
        }
    }

    const getGames = async () => {
        const res = await organizationServices.find(x => x.type === organizationType)?.getUneditedGames(organizationId);

        if (res && res.code === 200) {
            let groupGames = [];

            for (var i = 0; i < res.value.length; i++) {
                groupGames.push({
                    groupName: 'Round ' + (i + 1),
                    data: res.value[i].games.map(x => ({
                        value: x.id,
                        label: x.gameParty
                            ? (x.isPlayoffs ? x.gameParty + ' (PlayOffs)' : x.gameParty)
                            : (x.isPlayoffs ? 'Game TBD' + ' (PlayOffs)' : 'Game TBD'),
                    }))
                });
            }

            setGames([...groupGames]);
        }
    }

    const handleSaveClick = async (data) => {
        setBtnLoadingStatus(true);
        const service = organizationServices.find(x => x.type === organizationType);
        if (service) {
            const res = await service?.editGameInfo(organizationId, data);
            if (res && res.code === 200) history.push(service.profileRoute, { params: organizationId });
        }
        setBtnLoadingStatus(false);
    };

    const validateStartTime = (value) => {
        const isValidTime = moment(value).isSameOrBefore(new Date(), 'minute');
        return isValidTime ? 'Select time cannot equal or less than now!' : null;
    }

    const validateEndTime = (value) => {
        const isSameDay = moment(value).isSame(getValues('startTime'), 'day');
        if (!isSameDay) {
            return "Start and end date time must be on the same day!";
        }
        const isValidTime = moment(value).isSameOrBefore(getValues('startTime'), 'minute');
        return isValidTime ? 'Select time cannot equal or less than start time!' : null;
    }

    const handleGameDateTimeChanged = () => {
        const startDateTime = getValues('startTime');
        const endDateTime = getValues('endTime');
        if (startDateTime && endDateTime) {
            getOfficiates(getValues('gameId'), startDateTime, endDateTime);
            getFacilities(startDateTime, endDateTime);
        }
    }

    return (
        <form onSubmit={handleSubmit(handleSaveClick)} autoComplete="off">
            <ElGroupSelect label="Select Game" options={games} errors={errors}
                {...register("gameId", { required: { value: true, message: 'This field is required.' } })}
            />
            <ElDateTimePicker control={control} name="startTime" label="Select start time" type="datetime" errors={errors} defaultValue={date}
                onClose={handleGameDateTimeChanged}
                rules={{ validate: { rule1: v => validateStartTime(v) } }}
            />
            <ElDateTimePicker control={control} name="endTime" label="Select end time" type="datetime" errors={errors} defaultValue={date}
                onClose={handleGameDateTimeChanged}
                rules={{ validate: { rule1: v => validateEndTime(v) } }}
            />
            {!isLowStats && <ElSelect label="Choose Officiate" options={officiates} errors={errors} {...register("officiateId")} />}
            {
                isOfficial && !isLowStats &&
                <ElSelect label="Choose facility" options={facilities} errors={errors} {...register("facilityId")} />
            }
            <Box className={classes.buttonWrapper}>
                <ElButton media onClick={() => onCancel()}>Cancel</ElButton>
                <ElButton media type="submit" loading={btnLoadingStatus} className="green">Save</ElButton>
            </Box>
        </form>
    );
}