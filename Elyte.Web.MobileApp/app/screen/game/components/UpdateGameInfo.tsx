import React, { useState, useEffect } from 'react';
import { leagueService, tournamentService } from 'el/api';
import { useFormik } from 'formik';
import { ElButton, ElDatePicker, ElErrorMessage, ElSelectEx } from 'el/components';
import { Box, Row } from 'native-base';
import * as Yup from 'yup';
import moment from 'moment';
import { useElToast, utils } from 'el/utils';

const organizationServices = [
    {
        type: 'Tournament',
        getOfficiates: tournamentService.getTournamentOfficiates,
        getFreeOfficiates: tournamentService.getTournamentFreeOfficiates,
        getAvailableFacilitiesForGame: tournamentService.getAvailableFacilitiesForTournamentGame,
        getUneditedGames: tournamentService.getTournamentUneditedGames,
        editGameInfo: tournamentService.editTournamentGameInfo,
        getTeams: tournamentService.getTournamentTeams,
    },
    {
        type: 'League',
        getOfficiates: leagueService.getLeagueOfficiates,
        getFreeOfficiates: leagueService.getLeagueFreeOfficiates,
        getAvailableFacilitiesForGame: leagueService.getAvailableFacilitiesForLeagueGame,
        editGameInfo: leagueService.editLeagueGameInfo,
        getTeams: leagueService.getLeagueTeams,
    },
];

const validates = {
    startTime: Yup.date()
        .min(new Date(), 'Select time cannot equal or less than now!')
        .label('Start time'),
    endTime: Yup.date()
        .when('startTime', (startTime: Date, schema) => {
            if (startTime) {
                const nextDay = new Date(startTime.getTime() + 86400000);
                return schema
                    .min(moment(startTime).add(1000, "millisecond"), 'Select time cannot equal or less than start time!')
                    .max(
                        nextDay.toLocaleDateString(),
                        'Start and end date time must be on the same day!',
                    );
            }
        })
        .label('End time'),
    officiateId: Yup.string().label('Officiate'),
    homeTeamId: Yup.string(),
    awayTeamId: Yup.string()
        .when('homeTeamId', (homeTeamId: string, schema) => {
            if (!utils.isGuidEmpty(homeTeamId)) {
                return schema.notOneOf([Yup.ref('homeTeamId')], 'Away team cannot same as home team')
            }
        }),
};

const validation = Yup.object().shape({
    ...validates,
});

const officialValidation = Yup.object().shape({
    ...validates,
    facilityId: Yup.string().required().label('Facility'),
});

export default function UpdateGameInfo({
    isOfficial,
    isLowStats,
    gameInfo,
    organizationId,
    organizationType,
    onCancel,
    onUpdateSuccess,
}) {
    const [officiates, setOfficiates] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [facilities, setFacilities] = useState<any[]>([]);
    const initValue = {
        startTime: gameInfo?.startTime ?
            moment(gameInfo?.startTime).format('MM/DD/YYYY HH:mm') :
            '',
        endTime: gameInfo?.endTime ?
            moment(gameInfo?.endTime).format('MM/DD/YYYY HH:mm') :
            '',
        officiateId: gameInfo?.officiateId ?? '',
        facilityId: gameInfo?.facilityId ?? '',
        homeTeamId: gameInfo?.homeTeamId ?? '',
        awayTeamId: gameInfo?.awayTeamId ?? '',

    };
    const { handleSubmit, errors, setFieldValue, values, touched } = useFormik({
        initialValues: initValue,
        validationSchema: isOfficial && !isLowStats ? officialValidation : validation,
        onSubmit: values => handleSaveClick(values),
    });
    const [teams, setTeams] = useState<any[]>([]);
    const toast = useElToast();

    useEffect(() => {
        getOriginalOfficiates();
        getTeams();
        getFacilities(gameInfo?.startTime, gameInfo?.endTime);
    }, []);

    const getOriginalOfficiates = async () => {
        const res: any = await organizationServices
            .find(x => x.type === organizationType)
            ?.getOfficiates(organizationId);
        if (res && res.code === 200) {
            const users = res.value.map(x => ({ label: x.name, value: x.athleteId }));
            setOfficiates([...users]);
        }
    };

    const getOfficiates = async (gameId, startTime, endTime) => {
        const res: any = await organizationServices
            .find(x => x.type === organizationType)
            ?.getFreeOfficiates(organizationId, gameId, startTime, endTime);

        if (res && res.code === 200) {
            const users = res.value.map(x => ({ label: x.name, value: x.athleteId }));
            setOfficiates([...users]);
        }
    };

    const getFacilities = async (startTime, endTime) => {
        const res: any = await organizationServices
            .find(x => x.type === organizationType)
            ?.getAvailableFacilitiesForGame(organizationId, startTime, endTime);
        if (res && res.code === 200) {
            const resultFacilities: any[] = res.value.map(x => ({ label: x.name, value: x.id }));

            const selectedFacility = resultFacilities.find(x => x.value === initValue.facilityId);
            setFieldValue('facilityId', selectedFacility?.value ?? '');

            setFacilities([...resultFacilities]);
        }
    };

    const getTeams = async () => {
        const res: any = await organizationServices.find(x => x.type === organizationType)?.getTeams(organizationId);
        if (res && res.code === 200) {
            const teams: any[] = res.value.map(x => ({ label: x.title, value: x.id }));
            setTeams([...teams]);
        }
    }

    const handleSaveClick = async data => {
        const service = organizationServices.find(x => x.type === organizationType);
        data.gameId = gameInfo?.id;
        if (service) {
            setLoading(true);
            const res: any = await service?.editGameInfo(organizationId, data);
            setLoading(false);
            if (res && res.code === 200) {
                onUpdateSuccess && onUpdateSuccess();
            }else{
                toast.error(res.Message);
            }
        }
    };

    const handleGameDateTimeChanged = (startDateTime, endDateTime) => {
        if (startDateTime && endDateTime) {
            getOfficiates(gameInfo?.id, startDateTime, endDateTime);
            getFacilities(startDateTime, endDateTime);
        }
    };

    const filterTeams = (teamId) => teams.filter(x=>x.value !== teamId);

    return (
        <>
             {
                gameInfo?.canEdit && gameInfo?.canEditTeamCount === 2 &&
                <>
                   <ElSelectEx
                        items={filterTeams(values.awayTeamId)}
                        name="homeTeamId"
                        onValueChange={value => setFieldValue('homeTeamId', value)}
                        placeholder="Select Home Team"
                        defaultValue={values.homeTeamId}
                    />
                    <ElErrorMessage error={errors['homeTeamId']} visible={true} />

                    <ElSelectEx
                        items={filterTeams(values.homeTeamId)}
                        name="awayTeamId"
                        onValueChange={value => setFieldValue('awayTeamId', value)}
                        placeholder="Select Away Team"
                        defaultValue={values.awayTeamId}
                    />
                    <ElErrorMessage error={errors['awayTeamId']} visible={true} />
                </>
            }

            {
                gameInfo?.canEdit && gameInfo?.canEditTeamCount === 1 &&
                <>
                   <ElSelectEx
                        items={filterTeams(values.awayTeamId)}
                        name="homeTeamId"
                        onValueChange={value => setFieldValue('homeTeamId', value)}
                        placeholder="Select Home Team"
                        defaultValue={values.homeTeamId}
                        disabled={!gameInfo.canEditHomeTeam}
                    />
                    <ElErrorMessage error={errors['homeTeamId']} visible={true} />

                    <ElSelectEx
                        items={filterTeams(values.homeTeamId)}
                        name="awayTeamId"
                        onValueChange={value => setFieldValue('awayTeamId', value)}
                        placeholder="Select Away Team"
                        defaultValue={values.awayTeamId}
                        disabled={gameInfo.canEditHomeTeam}
                    />
                    <ElErrorMessage error={errors['awayTeamId']} visible={true} />
                </>
            }

           
            <ElDatePicker
                name="startTime"
                placeholder="Select start time"
                onSelectedDate={item => {
                    setFieldValue('startTime', item);
                    handleGameDateTimeChanged(item, values.endTime);
                }}
                defaultValue={values.startTime}
                mode="datetime"
            />
            <ElErrorMessage error={errors['startTime']} visible={true} />

            <ElDatePicker
                name="endTime"
                placeholder="Select end time"
                onSelectedDate={item => {
                    setFieldValue('endTime', item);
                    handleGameDateTimeChanged(values.startTime, item);
                }}
                defaultValue={values.endTime}
                mode="datetime"
            />
            <ElErrorMessage error={errors['endTime']} visible={true} />

            {!isLowStats && 
            <>
                <ElSelectEx
                    items={officiates}
                    name="officiateId"
                    onValueChange={value => setFieldValue('officiateId', value)}
                    placeholder="Choose Officiate"
                    defaultValue={values.officiateId}
                />
                <ElErrorMessage error={errors['officiateId']} visible={touched['officiateId']} />
            </>
            }   
            {isOfficial && !isLowStats && (
                <>
                    <ElSelectEx
                        items={facilities}
                        name="facilityId"
                        onValueChange={value => setFieldValue('facilityId', value)}
                        placeholder="Choose facility"
                        defaultValue={values.facilityId}
                    />
                    <ElErrorMessage error={errors['facilityId']} visible={touched['facilityId']} />
                </>
            )}
            <Row>
                <Box flex={1} mr={1}>
                    <ElButton onPress={onCancel}>Cancel</ElButton>
                </Box>
                <Box flex={1} mr={1}>
                    <ElButton onPress={handleSubmit} loading={loading} variant="secondary">
                        Save
                    </ElButton>
                </Box>
            </Row>
        </>
    );
}
