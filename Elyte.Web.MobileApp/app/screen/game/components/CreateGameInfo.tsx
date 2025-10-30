import React, { useState, useEffect } from 'react';
import { leagueService, tournamentService } from 'el/api';
import { useFormik } from 'formik';
import { ElButton, ElDatePicker, ElErrorMessage, ElGroupSelect, ElSelectEx } from 'el/components';
import { Box, Row } from 'native-base';
import * as Yup from 'yup';
import _ from 'lodash';
import moment from 'moment';

const organizationServices = [
    {
        type: 'Tournament',
        getOfficiates: tournamentService.getTournamentOfficiates,
        getFreeOfficiates: tournamentService.getTournamentFreeOfficiates,
        getAvailableFacilitiesForGame: tournamentService.getAvailableFacilitiesForTournamentGame,
        getUneditedGames: tournamentService.getTournamentUneditedGames,
        editGameInfo: tournamentService.editTournamentGameInfo,
    },
    {
        type: 'League',
        getOfficiates: leagueService.getLeagueOfficiates,
        getFreeOfficiates: leagueService.getLeagueFreeOfficiates,
        getAvailableFacilitiesForGame: leagueService.getAvailableFacilitiesForLeagueGame,
        getUneditedGames: leagueService.getLeagueUneditedGames,
        editGameInfo: leagueService.editLeagueGameInfo,
    },
];

const validates = {
    gameId: Yup.string().required().label("Game"),
    startTime: Yup.date()
        .required()
        .min(new Date(), 'Select time cannot equal or less than now!')
        .label('Start time'),
    endTime: Yup.date()
        .required()
        .when('startTime', (startTime: Date, schema) => {
            const nextDay = new Date(startTime.getTime() + 86400000);
            if (startTime) {
                return schema
                    .min(moment(startTime).add(1000, "millisecond"), 'Select time cannot equal or less than start time!')
                    .max(
                        nextDay.toLocaleDateString(),
                        'Start and end date time must be on the same day!',
                    );
            }
        })
        .label('End time'),
    officiateId: Yup.string().label('Officiate')
};

const validation = Yup.object().shape({
    ...validates,
});

const officialValidation = Yup.object().shape({
    ...validates,
    facilityId: Yup.string().required().label('Facility'),
});

export default function CreateGameInfo({
    isOfficial,
    isLowStats,
    date,
    organizationId,
    organizationType,
    onCancel,
    onUpdateSuccess,
}) {
    const [officiates, setOfficiates] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [facilities, setFacilities] = useState<any[]>([]);
    const [games, setGames] = useState<any[]>([]);
    const [gameId, setGameId] = useState<any>();

    const initValue = {
        startTime: date,
        endTime: date,
        officiateId: '',
        facilityId: '',
    };

    const { handleSubmit, errors, setFieldValue, values, touched } = useFormik({
        initialValues: initValue,
        validationSchema: isOfficial && !isLowStats ? officialValidation : validation,
        onSubmit: values => handleSaveClick(values),
    });

    useEffect(() => {
        getOriginalOfficiates();
        getGames();
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
            const resultFacilities = res.value.map(x => ({ label: x.name, value: x.id }));

            const selectedFacility = resultFacilities.find(x => x.value === initValue.facilityId);
            setFieldValue('facilityId', selectedFacility?.value ?? '');

            setFacilities([...resultFacilities]);
        }
    };

    const getGames = async () => {
        const res: any = await organizationServices.find(x => x.type === organizationType)?.getUneditedGames(organizationId);

        if (res && res.code === 200) {
            let groupGames: any[] = [];

            for (var i = 0; i < res.value.length; i++) {
                groupGames.push({
                    groupName: 'Round ' + (i + 1),
                    items: res.value[i].games.map(x => ({
                        label: x.gameParty
                            ? (x.isPlayoffs ? x.gameParty + ' (PlayOffs)' : x.gameParty)
                            : (x.isPlayoffs ? 'Game TBD' + ' (PlayOffs)' : 'Game TBD'),
                        value: x.id,
                    })),
                });
            }
            setGames([...groupGames]);
        }
    };

    const handleSaveClick = async data => {
        const service = organizationServices.find(x => x.type === organizationType);
        if (service) {
            setLoading(true);
            const res: any = await service?.editGameInfo(organizationId, data);
            setLoading(false);
            if (res && res.code === 200) {
                onUpdateSuccess && onUpdateSuccess();
            }
        }
    };

    const handleGameDateTimeChanged = (startDateTime, endDateTime) => {
        if (startDateTime && endDateTime) {
            getOfficiates(gameId, startDateTime, endDateTime);
            getFacilities(startDateTime, endDateTime);
        }
    };

    return (
        <>
            <ElGroupSelect
                name="gameId"
                placeholder="Select Game"
                groups={games}
                onSelectedItem={item => {
                    setFieldValue('gameId', item?.value);
                    setGameId(item?.value);
                }}
            />
            <ElErrorMessage error={errors['gameId']} visible={true} />

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
