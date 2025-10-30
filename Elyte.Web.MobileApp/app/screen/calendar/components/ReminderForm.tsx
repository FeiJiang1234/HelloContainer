import { ElButton, ElDatePicker, ElErrorMessage, ElInput } from 'el/components';
import { useAuth, useCalendar, utils } from 'el/utils';
import { Formik } from 'formik';
import React, { useState } from 'react';
import * as Yup from 'yup';
import moment from 'moment';
import { athleteService } from 'el/api';

type PropType = {
    initData?: any;
    onCreateReminderPopupClosed: any;
};

const validationSchema = Yup.object().shape({
    title: Yup.string().required().max(50).label('Title'),
    date: Yup.date().required().label('Selected date'),
    time: Yup.date()
        .required()
        .min(new Date(), 'Selected time cannot be earlier than current time!')
        .label('Selected time'),
});

const schemeFormData = {
    title: '',
    isEdit: true,
    date: moment().format('MM/DD/YYYY'),
    time: moment().format('MM/DD/YYYY HH:mm'),
};

const ReminderForm: React.FC<PropType> = ({ initData, onCreateReminderPopupClosed }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [defaultFormData] = useState(initData || schemeFormData);
    const { createEvent, updateEvent } = useCalendar();

    const handlerCreateReminder = async data => {
        setLoading(true);
        let date = moment(data.date);
        let time = moment(data.time);
        data['athleteId'] = user.id;
        data['reminderTime'] = `${date.format('MM/DD/YYYY')} ${time.hours()}:${time.minutes()}`;
        const isNewReinder = !initData;
        const service = initData
            ? athleteService.updateCalendarReminder(initData.id, data)
            : athleteService.createCalendarReminder(data);
        const res: any = await service;
        if (res && res.code === 200) {
            const calendarData = {
                title: data.title,
                startDate: new Date(data.reminderTime)
            };
            const reminderId = isNewReinder ? res.value : initData.id;
            if (!utils.isGuidEmpty(initData?.mobileCalendarEventId)) {
                await updateEvent(initData.mobileCalendarEventId, calendarData);
            }
            else {
                const mobileCalendarEventId = await createEvent('Elyte Reminder', calendarData);
                await athleteService.linkCalendarReminder(reminderId, { mobileCalendarEventId });
            }

            if (onCreateReminderPopupClosed) {
                onCreateReminderPopupClosed();
            }
        }
        setLoading(false);
    };

    const combineDate = (selectDate, selectTime) => {
        const date = moment(selectDate);
        const time = moment(selectTime);
        const combined = `${date.format('MM/DD/YYYY')} ${time.hours()}:${time.minutes()}`;
        return combined;
    };

    return (
        <Formik
            initialValues={defaultFormData}
            validationSchema={validationSchema}
            onSubmit={values => handlerCreateReminder(values)}>
            {({
                handleChange,
                handleSubmit,
                errors,
                setFieldValue,
                setFieldTouched,
                values,
                touched,
                isSubmitting
            }) => (
                <>
                    <ElInput
                        name="title"
                        placeholder="Reminder title"
                        disabled={!defaultFormData.isEdit}
                        onBlur={() => setFieldTouched('title')}
                        onChangeText={handleChange('title')}
                        defaultValue={values.title}
                        maxLength={50}
                    />
                    <ElErrorMessage error={errors['title']} visible={touched['title']} />

                    <ElDatePicker
                        name="date"
                        placeholder="Select date"
                        onSelectedDate={item => {
                            setFieldValue('date', item);

                            const combined = combineDate(item, values.time);
                            setFieldValue('time', combined);
                        }}
                        defaultValue={values.date}
                        mode="date"
                        disabled={!defaultFormData.isEdit}
                    />
                    <ElErrorMessage error={errors['date']} visible={touched['date']} />

                    <ElDatePicker
                        name="time"
                        placeholder="Select time"
                        onSelectedDate={item => {
                            const combined = combineDate(values.date, item);
                            setFieldValue('time', combined);
                        }}
                        defaultValue={values.time}
                        disabled={!defaultFormData.isEdit}
                        mode="time"
                    />
                    <ElErrorMessage error={errors['time']} visible={touched['time']} />

                    {defaultFormData.isEdit && (
                        <ElButton loading={loading} onPress={handleSubmit} disabled={isSubmitting}>
                            Save
                        </ElButton>
                    )}
                </>
            )}
        </Formik>
    );
};

export default ReminderForm;
