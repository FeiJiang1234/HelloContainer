import React, { useEffect, useState } from 'react';
import { ElTitle, ElSelect, ElButton, ElAvatar, ElReadMore } from 'components';
import { Card, CardHeader, CardContent, CardMedia, Typography } from '@mui/material';
import { authService, eventService } from 'services';
import { useLocation, useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDateTime } from 'utils';

const shareOptions = [
    { value: 'Anyone', label: 'Anyone' },
    { value: 'Followers', label: 'Followers' },
];

export default function EventShare () {
    const history = useHistory();
    const location = useLocation();
    const eventId = location.state?.params;
    const currentUser = authService.getCurrentUser();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { fromNow } = useDateTime();
    const [eventProfile, setProfile] = useState([]);

    useEffect(() => getMyEventProfile(), []);

    const getMyEventProfile = async () => {
        const res = await eventService.getEventProfile(eventId || '');
        if (res && res.code === 200) {
            setProfile(res.value);
        }
    }

    const shareEvent = async (data) => {
        const res = await eventService.shareEvent(eventId, data.shareType);
        if (res && res.code === 200) {
            window.elyte.success("share successfully!");
            history.push('/');
        }
    };

    return (
        <form onSubmit={handleSubmit(shareEvent)} autoComplete="off">
            <ElTitle center>Share an event</ElTitle>
            <Card>
                <CardHeader avatar={<ElAvatar src={currentUser.pictureUrl} />}
                    title={<Typography>{currentUser.firstName + ' ' + currentUser.lastName}</Typography>}
                    subheader={<Typography sx={{ color: (theme) => theme.palette.body.main, fontSize: 11 }}>{fromNow(eventProfile.createdDate)}</Typography>}
                />
                {eventProfile.imageUrl && <CardMedia component="img" image={eventProfile.imageUrl} />}
                <CardContent>
                    <ElReadMore text={eventProfile.details || ''} />
                </CardContent>
            </Card>

            <ElSelect name="shareType" label="Share To" options={shareOptions} defaultValue={shareOptions[1].value} errors={errors}
                {...register("shareType", { required: { value: true, message: 'This field is required.' } })}
            />
            <ElButton type="submit" fullWidth>Share an event</ElButton>
        </form>
    );
}