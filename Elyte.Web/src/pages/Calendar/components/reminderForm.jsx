import React, { useState, useContext } from 'react';
import { Box } from '@mui/material';
import * as moment from 'moment';
import { ElButton, ElDateTimePicker, ElInput } from 'components';
import { makeStyles } from '@mui/styles';
import { athleteService, authService } from 'services';
import { useForm } from "react-hook-form";
import { AppActions } from '../../../store/reducers/app.reducer';
import { AppContext } from '../../../App';


const useStyles = makeStyles(() => ({
    button: {
        alignItems: 'center',
        margin: 'auto',
        textAlign: 'center',
    },
}));

const schemeFormData = { id: "", title: "", teamId: "", isEdit: true, date: moment().format("YYYY-MM-DD"), time: "" };

export default function ReminderForm ({ initData, onCreateReminderPopupClosed }) {
    const classes = useStyles();
    const { dispatch } = useContext(AppContext);
    const { register, handleSubmit, getValues, control, formState: { errors } } = useForm();
    const currentUser = authService.getCurrentUser();

    const [loadingStatus, setLoadingStatus] = useState(false);
    const [defaultFormData] = useState(initData || schemeFormData);

    const handlerCreateReminder = async (data) => {
        setLoadingStatus(true);
        data['athleteId'] = currentUser.id;
        data['reminderTime'] = data.selectDate + ' ' + data.selectTime;
        const service = initData ? athleteService.updateCalendarReminder(defaultFormData.id, data) : athleteService.createCalendarReminder(data);
        const res = await service;
        if (res && res.code === 200) {
            dispatch({ type: AppActions.RefreshAlarmQueue });

            if (onCreateReminderPopupClosed) {
                onCreateReminderPopupClosed();
            }
        }

        setLoadingStatus(false);
    }

    return (
        <form onSubmit={handleSubmit(handlerCreateReminder)} autoComplete="off">
            <ElInput label="Reminder title" defaultValue={defaultFormData.title} disabled={!defaultFormData.isEdit} errors={errors} inputProps={{ maxLength: 50 }}
                {...register("title", { required: { value: true, message: 'This field is required.' } })}
            />

            <ElDateTimePicker control={control} name="selectDate" label="Select date" type="date" defaultValue={defaultFormData.date} errors={errors}
                disabled={!defaultFormData.isEdit}
                rules={{
                    validate: {
                        rule1: v => !moment(v).isBefore(new Date(), 'day') || 'Selected date cannot be earlier than today!'
                    }
                }}
            />

            <ElDateTimePicker control={control} name="selectTime" label="Select time" type="time" defaultValue={defaultFormData.time} disabled={!defaultFormData.isEdit} errors={errors}
                rules={{
                    validate: {
                        rule1: v => !moment(getValues('selectDate') + ' ' + v).isSameOrBefore(new Date(), 'minute') || 'Selected time cannot be earlier than current time!'
                    }
                }}
            />
            {
                defaultFormData.isEdit &&
                <Box pt={1} className={classes.button}>
                    <ElButton type="submit" loading={loadingStatus}>
                        {!initData ? 'Create Reminder' : 'Save'}
                    </ElButton>
                </Box>
            }
        </form>
    );
}
