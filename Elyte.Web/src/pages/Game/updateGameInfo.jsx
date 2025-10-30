import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ElButton, ElDateTimePicker, ElSelect } from 'components';
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
        getTeams: tournamentService.getTournamentTeams,
        profileRoute: '/tournamentProfile'
    },
    {
        type: 'League',
        getOfficiates: leagueService.getLeagueOfficiates,
        getFreeOfficiates: leagueService.getLeagueFreeOfficiates,
        getAvailableFacilitiesForGame: leagueService.getAvailableFacilitiesForLeagueGame,
        getUneditedGames: leagueService.getLeagueUneditedGames,
        editGameInfo: leagueService.editLeagueGameInfo,
        getTeams: leagueService.getLeagueTeams,
        profileRoute: '/leagueProfile'
    }
];

export default function UpdateGameInfo ({ isOfficial, isLowStats, gameInfo, organizationId, organizationType, onCancel, reloadBracket }) {
    const classes = useStyles();
    const { register, handleSubmit, getValues, control, formState: { errors } } = useForm();
    const [btnLoadingStatus, setBtnLoadingStatus] = useState(false);
    const [facilities, setFacilities] = useState([]);
    const [officiates, setOfficiates] = useState([]);
    const [teams, setTeams] = useState([]);

    useEffect(() => {
        getOriginalOfficiates();
        getTeams();
        getFacilities(gameInfo.startTime, gameInfo.endTime);
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

    const getTeams = async () => {
        const res = await organizationServices.find(x => x.type === organizationType)?.getTeams(organizationId);
        if (res && res.code === 200) {
            const teams = res.value.map(x => ({ label: x.title, value: x.id }));
            setTeams([...teams]);
        }
    }

    const handleSaveClick = async (data) => {
        setBtnLoadingStatus(true);
        const service = organizationServices.find(x => x.type === organizationType);
        data.gameId = gameInfo.id;
        if (service) {
            const res = await service?.editGameInfo(organizationId, data);
            if (res && res.code === 200) {
                reloadBracket && reloadBracket();
                onCancel();
            }
        }
        setBtnLoadingStatus(false);
    };

    const validateStartTime = (value) => {
        const isValidTime = moment(value).isSameOrBefore(new Date(), 'minute');
        return isValidTime ? 'Select time cannot equal or less than now!' : null;
    }

    const validateEndTime = (value) => {
        if (value) {
            const isSameDay = moment(value).isSame(getValues('startTime'), 'day');
            if (!isSameDay) {
                return "Start and end date time must be on the same day!";
            }
            const isValidTime = moment(value).isSameOrBefore(getValues('startTime'), 'minute');
            return isValidTime ? 'Select time cannot equal or less than start time!' : null;
        }
    }

    const handleGameDateTimeChanged = () => {
        const startDateTime = getValues('startTime');
        const endDateTime = getValues('endTime');
        if (startDateTime && endDateTime) {
            getOfficiates(gameInfo.id, startDateTime, endDateTime);
            getFacilities(startDateTime, endDateTime);
        }
    }

    const validateAwayTeam = (value) => {
        const homeTeamId = getValues('homeTeamId');
        if (homeTeamId == value) {
            return "Away team cannot same as Home team";
        }
    }

    const filterTeams = (teamId) => teams.filter(x=>x.value !== teamId);

    return (
        <form onSubmit={handleSubmit(handleSaveClick)} autoComplete="off">
            {
                gameInfo.canEdit && gameInfo.canEditTeamCount === 2 &&
                <>
                    <ElSelect label="Select Home Team" options={filterTeams(gameInfo.awayTeamId)} errors={errors} defaultValue={gameInfo.homeTeamId} 
                        {...register("homeTeamId")}
                    />
                    <ElSelect label="Select Away Team" options={filterTeams(gameInfo.homeTeamId)} errors={errors} defaultValue={gameInfo.awayTeamId}
                        {...register("awayTeamId", { validate: { rule1: v => validateAwayTeam(v) } })}   
                    />
                </>
            }
            {
                gameInfo.canEdit && gameInfo.canEditTeamCount === 1 &&
                <>
                    <ElSelect label="Select Home Team" options={filterTeams(gameInfo.awayTeamId)} errors={errors} defaultValue={gameInfo.homeTeamId} 
                        {...register("homeTeamId")} disabled={!gameInfo.canEditHomeTeam}
                    />
                    <ElSelect label="Select Away Team" options={filterTeams(gameInfo.homeTeamId)} errors={errors} defaultValue={gameInfo.awayTeamId}
                        {...register("awayTeamId", { validate: { rule1: v => validateAwayTeam(v) } })} disabled={gameInfo.canEditHomeTeam}    
                    />
                </>
            }

            <ElDateTimePicker control={control} name="startTime" label="Select start time" type="datetime" errors={errors} defaultValue={gameInfo.startTime}
                onClose={handleGameDateTimeChanged}
                rules={{ validate: { rule1: v => validateStartTime(v) } }}
            />
            <ElDateTimePicker control={control} name="endTime" label="Select end time" type="datetime" errors={errors} defaultValue={gameInfo.endTime}
                onClose={handleGameDateTimeChanged}
                rules={{ validate: { rule1: v => validateEndTime(v) } }}
            />
            {
                !isLowStats &&
                <ElSelect label="Choose Officiate" options={officiates} errors={errors} defaultValue={gameInfo.officiateId}
                    {...register("officiateId")}
                />
            }

            {
                isOfficial && !isLowStats &&
                <ElSelect label="Choose facility" options={facilities} errors={errors} defaultValue={gameInfo.facilityId}
                    {...register("facilityId")}
                />
            }
            <Box className={classes.buttonWrapper}>
                <ElButton media onClick={() => onCancel()}>Cancel</ElButton>
                <ElButton media type="submit" loading={btnLoadingStatus} className="green">Save</ElButton>
            </Box>
        </form>
    );
}