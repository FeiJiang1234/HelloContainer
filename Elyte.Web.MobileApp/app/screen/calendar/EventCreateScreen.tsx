import { ElDatePicker, ElErrorMessage, ElImageSelecter, ElInput, ElKeyboardAvoidingView, ElTextarea, ElTitle, ElBody, ElButton, ElSelectEx } from 'el/components';
import { useAuth, useCalendar, useElToast, useGoBack, validator } from 'el/utils';
import { Formik } from 'formik';
import * as Yup from 'yup';
import React, { useState } from 'react';
import moment from 'moment';
import { EventAlertOptions, SportTypes } from 'el/enums';
import RegionCascader from 'el/components/RegionCascader';
import dictionaryService from 'el/api/dictionaryService';
import { ERROR, PENDING, SUCCESS } from 'el/store/slices/requestSlice';
import { useDispatch } from 'react-redux';
import { athleteService, eventService } from 'el/api';
import routes from 'el/navigation/routes';

const validationSchema = Yup.object().shape({
    title: Yup.string().required().max(100).label('Title'),
    details: Yup.string().required().max(250).label('Details'),
    sportOption: Yup.string().required().label('Sport Option'),
    ...validator.address,
    eventDate: Yup.date().required().label("Event date"),
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

export default function EventCreateScreen({ navigation, route }) {
    useGoBack();

    const initValue: any = {
        title: '',
        details: '',
        eventDate: moment().format('MM/DD/YYYY'),
        startTime: moment().format('MM/DD/YYYY HH:mm'),
        endTime: moment().format('MM/DD/YYYY HH:mm'),
        sportOption: '',
        country: '',
        state: '',
        city: '',
        teamId: '',
        venue: '',
        alertTime: '',
    }

    const dispatch = useDispatch();
    const toast = useElToast();
    const [teams, setTeams] = useState<any[]>([]);
    const [image, setImage] = useState<any>();
    const { user } = useAuth();
    const { createEvent } = useCalendar();

    const handleCreateClick = async (values: any) => {
        dispatch(PENDING());
        const res: any = await eventService.createEvent(values, image);
        if (res && res.code === 200) {
            const calendarData = {
                title: values.title,
                startDate: new Date(values.startTime),
                endDate: new Date(values.endTime),
                location: `${values.stateName} ${values.cityName} ${values.venue}`,
                alertTime: values.alertTime
            };
            const team = teams.find(x => x.value === values.teamId);

            const postId = res.value;
            const mobileCalendarEventId = await createEvent(team?.label ?? 'Elyte Event', calendarData);
            await athleteService.linkCalendarEvent(postId, { mobileCalendarEventId });
            dispatch(SUCCESS());

            navigation.navigate(routes.EventCreateSuccess, { id: postId });
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

    const handleSportSelected = async sportType => {
        const res: any = await dictionaryService.getAthleteActiveTeamsNameAndId(sportType, user.id);
        if (res.code === 200 && res.value && Array.isArray(res.value)) {
            const teamOptions = res.value.map(element => { return { label: element.label, value: element.value } });
            setTeams(teamOptions);
        }
    }

    return (
        <ElKeyboardAvoidingView withOffset>
            <ElTitle>Create Event</ElTitle>
            <Formik
                initialValues={initValue}
                validationSchema={validationSchema}
                onSubmit={values => handleCreateClick(values)}>
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
                        <ElImageSelecter name="image" placeholder="Choose event image" onImageSelected={handleImageSelected}></ElImageSelecter>

                        <ElInput name="title" placeholder="Title" maxLength={100} onBlur={() => setFieldTouched('title')} onChangeText={handleChange('title')} />
                        <ElErrorMessage error={errors['title']} visible={touched['title']} />

                        <ElTextarea name="details" placeholder="Details" maxLength={250} onBlur={() => setFieldTouched('details')} onChangeText={handleChange('details')} />
                        <ElErrorMessage error={errors['details']} visible={touched['details']} />

                        <ElDatePicker
                            name="eventDate"
                            placeholder="Select date"
                            onSelectedDate={item => {
                                setFieldValue('eventDate', item);

                                const startTimeCombined = combineDate(item, values.startTime);
                                setFieldValue('startTime', startTimeCombined);

                                const endTimeCombined = combineDate(item, values.endTime);
                                setFieldValue('endTime', endTimeCombined);
                            }}
                            defaultValue={values.eventDate}
                            mode="date"
                        />
                        <ElErrorMessage error={errors['eventDate']} visible={touched['eventDate']} />

                        <ElDatePicker
                            name="startTime"
                            placeholder="Select start time"
                            defaultValue={values.startTime}
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
                            defaultValue={values.endTime}
                            onSelectedDate={item => {
                                const combined = combineDate(values.eventDate, item);
                                setFieldValue('endTime', combined);
                            }}
                            mode="time"
                        />
                        <ElErrorMessage error={errors['endTime']} visible={touched['endTime']} />

                        <ElSelectEx name="sportOption" placeholder="Choose a sport" items={SportTypes} defaultValue={values.sportOption}
                            onValueChange={value => {
                                setFieldValue('sportOption', value);
                                handleSportSelected(value);
                            }} />
                        <ElErrorMessage error={errors['sportOption']} visible={touched['sportOption']} />

                        <RegionCascader setFieldValue={setFieldValue} touched={touched} errors={errors} values={values} />

                        <ElBody>Other options</ElBody>
                        <ElSelectEx name="teamId" placeholder="Team's Calendar" items={teams} defaultValue={values.teamId} onValueChange={value => setFieldValue('teamId', value)} />

                        <ElInput name="venue" placeholder="Venue" maxLength={100} onBlur={() => setFieldTouched('venue')} onChangeText={handleChange('venue')} />
                        <ElErrorMessage error={errors['venue']} visible={touched['venue']} />

                        <ElSelectEx name="alertTime" placeholder="Alert" items={EventAlertOptions} defaultValue={values.alertTime} onValueChange={value => setFieldValue('alertTime', value)} />
                        <ElErrorMessage error={errors['alertTime']} visible={touched['alertTime']} />

                        <ElButton disabled={!image?.uri || isSubmitting} onPress={handleSubmit} style={{ marginBottom: 8 }} >Create Event</ElButton>
                    </>
                )}
            </Formik>
        </ElKeyboardAvoidingView >
    );
}
