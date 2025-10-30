import { ElDatePicker, ElErrorMessage, ElImageSelecter, ElInput, ElKeyboardAvoidingView, ElSelectEx, ElTextarea, ElTitle, ElBody, ElButton } from 'el/components';
import { useAuth, useCalendar, useElToast, useGoBack, utils, validator } from 'el/utils';
import { Formik } from 'formik';
import * as Yup from 'yup';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { EventAlertOptions, SportTypes } from 'el/enums';
import RegionCascader from 'el/components/RegionCascader';
import dictionaryService from 'el/api/dictionaryService';
import { ERROR, PENDING, SUCCESS } from 'el/store/slices/requestSlice';
import { useDispatch } from 'react-redux';
import { athleteService, eventService } from 'el/api';
import routes from 'el/navigation/routes';
import { EventProfileModel } from 'el/models/event/eventProfileModel';
import { ResponseResult } from 'el/models/responseResult';

const validationSchema = Yup.object().shape({
    title: Yup.string().required().max(100).label('Title'),
    details: Yup.string().required().max(250).label('Details'),
    sportOption: Yup.string().required().label('Sport Option'),
    ...validator.address,
    startTime: Yup.date()
        .required()
        .min(moment().utc(), 'Start time cannot equal or less than now!')
        .label('Start time'),
    endTime: Yup.date()
        .required()
        .when('startTime', (startTime: Date, schema) => {
            const nextDay = new Date(startTime.getTime() + 86400000);
            if (startTime) {
                return schema
                    .min(moment(startTime).add(1000, "millisecond"), 'End time cannot equal or less than start time!')
                    .max(
                        nextDay.toLocaleDateString(),
                        'Start and end date time must be on the same day!',
                    );
            }
        })
        .label('End time'),
    venue: Yup.string().required().max(100).label('Venue'),
    alertTime: Yup.number().required().label('Alert Time'),
});

export default function EventEditScreen({ navigation, route }) {
    useGoBack();

    const { id } = route.params;
    const dispatch = useDispatch();
    const { user } = useAuth();
    const toast = useElToast();
    const [teams, setTeams] = useState<any[]>([]);
    const [image, setImage] = useState<any>();
    const [profile, setProfile] = useState<EventProfileModel>();
    const { createEvent, updateEvent } = useCalendar();

    const initValue: any = {
        imageUrl: profile?.imageUrl,
        title: profile?.title,
        details: profile?.details,
        eventDate: moment(profile?.startTime).format('MM/DD/YYYY'),
        startTime: moment(profile?.startTime).format('MM/DD/YYYY HH:mm'),
        endTime: moment(profile?.endTime).format('MM/DD/YYYY HH:mm'),
        sportOption: profile?.sportOption,
        country: profile?.countryCode,
        countryName: profile?.country,
        state: profile?.stateCode,
        stateName: profile?.state,
        city: profile?.cityCode,
        cityName: profile?.city,
        teamId: profile?.teamId,
        venue: profile?.venue,
        alertTime: profile?.alertTime,
    }

    useEffect(() => {
        getEventProfile();
    }, [id]);

    useEffect(() => {
        getAthleteActiveTeamsNameAndId(profile?.sportOption);
    }, [profile?.sportOption]);

    const getEventProfile = async () => {
        dispatch(PENDING());
        const res: ResponseResult<EventProfileModel> = await eventService.getEventProfile(id);
        if (res && res.code === 200) {
            dispatch(SUCCESS());
            setProfile(res.value);
        } else {
            dispatch(ERROR());
        }
    };

    const handleSaveClick = async (values: any) => {
        dispatch(PENDING());
        const res: any = await eventService.updateEvent(id, { ...values, image });
        if (res && res.code === 200) {
            dispatch(SUCCESS());
            const calendarData = {
                title: values.title,
                startDate: new Date(values.startTime),
                endDate: new Date(values.endTime),
                location: `${values.stateName} ${values.cityName} ${values.venue}`,
                alertTime: values.alertTime
            };
            const team = teams.find(x => x.value === values.teamId);

            if (!utils.isGuidEmpty(profile?.mobileCalendarEventId)) {
                await updateEvent(profile?.mobileCalendarEventId, calendarData);
            } else {
                const mobileCalendarEventId = await createEvent(team?.label ?? 'Elyte Event', calendarData);
                await athleteService.linkCalendarEvent(profile?.id, { mobileCalendarEventId });
            }

            navigation.navigate(routes.EventCreateSuccess, { id: res.value, isEdit: true });
        } else {
            toast.error(res.Message);
            dispatch(ERROR());
        }
    }

    const combineDate = (selectDate, selectTime) => {
        const date = moment(selectDate);
        const time = moment(selectTime);
        const combined = `${date.format('MM/DD/YYYY')} ${time.hours()}:${time.minutes()}`;
        return combined;
    };

    const handleImageSelected = image => {
        setImage(image);
    }

    const handleSportSelected = async e => {
        const sportType = e?.value;
        getAthleteActiveTeamsNameAndId(sportType);
    }

    const getAthleteActiveTeamsNameAndId = async (sportType) => {
        const res: any = await dictionaryService.getAthleteActiveTeamsNameAndId(sportType, user.id);
        if (res.code === 200 && res.value && Array.isArray(res.value)) {
            const teamOptions = res.value.map(element => { return { label: element.label, value: element.value } });
            setTeams(teamOptions);
        }
    }

    return (
        <ElKeyboardAvoidingView withOffset>
            <ElTitle>Edit Event</ElTitle>
            {profile &&
                <Formik
                    initialValues={initValue}
                    validationSchema={validationSchema}
                    onSubmit={values => handleSaveClick(values)}>
                    {({
                        handleChange,
                        handleSubmit,
                        errors,
                        setFieldTouched,
                        touched,
                        setFieldValue,
                        values,
                        isSubmitting
                    }) => (
                        <>
                            <ElImageSelecter name="image" placeholder="Choose event image" defaultValue={values.imageUrl} onImageSelected={handleImageSelected}></ElImageSelecter>

                            <ElInput name="title" placeholder="Title" defaultValue={values.title} maxLength={100} onBlur={() => setFieldTouched('title')} onChangeText={handleChange('title')} />
                            <ElErrorMessage error={errors['title']} visible={touched['title']} />

                            <ElTextarea name="details" placeholder="Details" defaultValue={values.details} maxLength={250} onBlur={() => setFieldTouched('details')} onChangeText={handleChange('details')} />
                            <ElErrorMessage error={errors['details']} visible={touched['details']} />

                            <ElDatePicker
                                name="eventDate"
                                placeholder="Select date"
                                onSelectedDate={item => {
                                    setFieldValue('eventDate', item);
                                    const startTimeCombined = combineDate(item, values.startTime);
                                    const endTimeCombined = combineDate(item, values.endTime);
                                    setFieldValue('startTime', startTimeCombined);
                                    setFieldValue('endTime', endTimeCombined);
                                }}
                                defaultValue={initValue.eventDate}
                                mode="date"
                            />
                            <ElErrorMessage error={errors['eventDate']} visible={touched['eventDate']} />

                            <ElDatePicker
                                name="startTime"
                                placeholder="Select start time"
                                defaultValue={initValue.startTime}
                                onSelectedDate={item => {
                                    const combined = combineDate(values.eventDate, item);
                                    setFieldValue('startTime', combined);
                                }}
                                mode="time"
                            />
                            <ElErrorMessage error={errors['startTime']} visible={touched['startTime']} />

                            <ElDatePicker
                                name="endTime"
                                placeholder="Select end time"
                                defaultValue={initValue.endTime}
                                onSelectedDate={item => {
                                    const combined = combineDate(values.eventDate, item);
                                    setFieldValue('endTime', combined);
                                }}
                                mode="time"
                            />
                            <ElErrorMessage error={errors['endTime']} visible={touched['endTime']} />

                            <ElSelectEx name="sportOption" placeholder="Choose a sport" items={SportTypes} defaultValue={values.sportOption}
                                onValueChange={(e) => {
                                    setFieldValue('sportOption', e.value);
                                    handleSportSelected(e);
                                }} />
                            <ElErrorMessage error={errors['sportOption']} visible={touched['sportOption']} />

                            <RegionCascader setFieldValue={setFieldValue} touched={touched} errors={errors} values={values} />

                            <ElBody>Other options</ElBody>
                            <ElSelectEx name="teamId" placeholder="Team's Calendar" items={teams} defaultValue={values.teamId} onValueChange={e => setFieldValue('teamId', e.value)} />
                            <ElErrorMessage error={errors['teamId']} visible={touched['teamId']} />

                            <ElInput name="venue" placeholder="Venue" maxLength={100} onBlur={() => setFieldTouched('venue')} defaultValue={values.venue} onChangeText={handleChange('venue')} />
                            <ElErrorMessage error={errors['venue']} visible={touched['venue']} />

                            <ElSelectEx name="alertTime" placeholder="Alert" items={EventAlertOptions} defaultValue={values.alertTime} onValueChange={e => setFieldValue('alertTime', e.value)} />
                            <ElErrorMessage error={errors['alertTime']} visible={touched['alertTime']} />

                            <ElButton disabled={!image?.uri || isSubmitting} onPress={handleSubmit} style={{ marginBottom: 8 }}>Update Event</ElButton>
                        </>
                    )}
                </Formik>
            }
        </ElKeyboardAvoidingView>
    );
}
