import React, { useEffect, useState, useContext } from 'react';
import { ElButton, ElInput, ElTitle, ElSelect, ElDateTimePicker, ElImageSelecter } from 'components';
import { RegionCascader } from 'pageComponents';
import { eventService, authService, dictionaryService } from 'services';
import { useHistory, useLocation } from 'react-router-dom';
import { Typography } from '@mui/material';
import { SportTypes, alertRanges } from '../../models';
import { useForm } from "react-hook-form";
import { utils } from 'utils';
import * as moment from 'moment';
import { AppActions } from '../../store/reducers/app.reducer'
import { AppContext } from '../../App';

const EventFormPage = () => {
    const history = useHistory();
    const location = useLocation();
    const routerParams = location?.state?.params;
    const currentUser = authService.getCurrentUser();
    const { dispatch } = useContext(AppContext);
    const { register, handleSubmit, getValues, control, formState: { errors } } = useForm();
    const [teamResult, setTeamResult] = useState([]);
    const [image, setImage] = useState();
    const [errorMessage, setErrorMessage] = useState();

    useEffect(() => {
        getAhleteActiveTeamsNameAndId(getValues('sportOption'), currentUser.id);
    }, []);

    const getAhleteActiveTeamsNameAndId = async (sport, userId) => {
        const res = await dictionaryService.getAthleteActiveTeamsNameAndId(sport, userId);
        if (res.code === 200 && res.value && Array.isArray(res.value)) {
            const teamOptions = res.value.map(element => { return { label: element.label, value: element.value } });
            setTeamResult(teamOptions);
        }
    }

    const validateStartTime = (value) => {
        const v = moment(getValues('eventDate') + ' ' + value).isSameOrBefore(new Date(), 'minute');
        return v ? "Select time cannot equal or less than now!" : null;
    }

    const validateEndTime = (value) => {
        const v = moment(getValues('eventDate') + ' ' + value).isSameOrBefore(getValues('eventDate') + ' ' + getValues('startTime'), 'minute');
        return v ? "Select time cannot equal or less than start time!" : null;
    }

    const handleSportTypeChanged = async (e) => {
        getAhleteActiveTeamsNameAndId(e.target.value, currentUser.id);
    }

    const handleCreateEventClick = async (data) => {
        if (!image && !routerParams?.isEdit) {
            return setErrorMessage("Please select profile image!");
        }
        const formData = utils.formToFormData(data, ["startTime", "endTime"]);
        formData.append('startTime', data.eventDate + ' ' + data.startTime);
        formData.append('endTime', data.eventDate + ' ' + data.endTime);
        formData.append('file', image);

        let res;
        if (routerParams?.isEdit) {
            res = await eventService.updateEvent(routerParams?.id, formData);
        } else {
            res = await eventService.createEvent(formData);
        }

        if (res && res.code === 200 && res.value) {
            dispatch({ type: AppActions.RefreshAlarmQueue });
            const profile = await eventService.getEventProfile(res.value);
            if (profile && profile.code && profile.value) {
                history.push('/eventCongratulations', { params: { ...profile.value, isEdit: routerParams?.isEdit } });
            }
        }
    }

    return (
        <form onSubmit={handleSubmit(handleCreateEventClick)} autoComplete="off">
            <ElTitle center>{routerParams?.isEdit ? "Edit an Event" : "Create an Event"}</ElTitle>
            <ElImageSelecter label="Choose event image" defaultValue={routerParams?.imageUrl} cropShape="rect" errorMessage={errorMessage} onImageSelected={(i) => setImage(i)} />

            <ElInput label="Title" errors={errors} inputProps={{ maxLength: 50 }} defaultValue={routerParams?.title}
                {...register("title", { required: { value: true, message: 'This field is required.' } })}
            />
            <ElInput label="Details" rows={6} multiline errors={errors} defaultValue={routerParams?.details} inputProps={{ maxLength: 250 }}
                {...register("details", { required: { value: true, message: 'This field is required.' } })}
            />
            <ElDateTimePicker control={control} name="eventDate" label="Select date" type="date" errors={errors} defaultValue={routerParams?.eventDate}
                rules={{
                    required: { value: true, message: 'This field is required.' },
                    validate: { rule1: v => !moment(v).isBefore(new Date(), 'day') || 'Select date cannot less than today!' }
                }}
            />
            <ElDateTimePicker control={control} name="startTime" label="Select start time" type="time" errors={errors} defaultValue={routerParams?.startTime}
                rules={{
                    required: { value: true, message: 'This field is required.' },
                    validate: { rule1: v => validateStartTime(v) }
                }}
            />
            <ElDateTimePicker control={control} name="endTime" label="Select end time" type="time" errors={errors} defaultValue={routerParams?.endTime}
                rules={{
                    required: { value: true, message: 'This field is required.' },
                    validate: { rule1: v => validateEndTime(v) }
                }}
            />
            <ElSelect label="Choose a sport" options={SportTypes} errors={errors} defaultValue={routerParams?.sportOption || ''}
                {...register("sportOption", { required: { value: true, message: 'This field is required.' } })} onChange={handleSportTypeChanged}
            />
            <RegionCascader register={register} errors={errors} defaultCountry={routerParams?.countryCode} defaultState={routerParams?.stateCode} defaultCity={routerParams?.cityCode} />
            <Typography sx={{ marginTop: 2 }}>Other options</Typography>
            {
                !routerParams?.isEdit &&
                <ElSelect label="Team's Calendar" options={teamResult} errors={errors} defaultValue={routerParams?.team || ''}
                    {...register("teamId", {})}
                />
            }
            <ElInput label="Venue" errors={errors} defaultValue={routerParams?.venue} inputProps={{ maxLength: 50 }}
                {...register("venue", { required: { value: true, message: 'This field is required.' } })}
            />

            <ElSelect label="Alert" options={alertRanges} errors={errors} defaultValue={routerParams?.alertTime || ''}
                {...register("alertTime", {
                    required: { value: true, message: 'This field is required.' }
                })}
            />

            <ElButton mt={6} type="submit" >{routerParams?.isEdit ? "Save" : "Create event"}</ElButton>
        </form>
    );
};

export default EventFormPage;
