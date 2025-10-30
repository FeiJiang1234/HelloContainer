import React, { useState } from 'react';
import { Box, RadioGroup, FormControlLabel, Radio, CardMedia } from '@mui/material';
import { ElTitle, ElBox, ElSvgIcon, ElImageUploader, ElButton, ElInput, ElForm, ElSearchBox } from 'components';
import { useForm } from "react-hook-form";
import { Idiograph } from 'parts';
import { makeStyles } from '@mui/styles';
import { postService, authService, eventService } from 'services';
import { useHistory } from 'react-router';
import { utils } from 'utils';
import ShareStats from './shareStats';

const useStyles = makeStyles(theme => ({
    icons: {
        backgroundColor: '#F0F2F7',
        height: theme.spacing(7),
        borderRadius: '10px',
        justifyContent: 'space-around',
        alignItems: 'center',
        '& label': {
            display: 'inline-flex'
        }
    }
}));

export default function CreatePost () {
    const classes = useStyles();

    const user = authService.getCurrentUser();
    const [file, setFile] = useState(null);
    const [url, setUrl] = useState(null);
    const [selectType, setSelectType] = useState('camera');


    const handleImageSelect = (image) => {
        setUrl(image.url);
        setFile(image.file);
    }

    return (
        <>
            <ElTitle center>Create a post</ElTitle>
            <ElBox mt={2} className={classes.icons}>
                <ElImageUploader crop cropShape="rect" onImageSelected={handleImageSelect}>
                    <ElSvgIcon active={selectType === "camera"} hover light small name={utils.isMobileMode() ? "camera" : "picture"} onClick={() => setSelectType("camera")} />
                </ElImageUploader>
                <ElSvgIcon active={selectType === "chart"} light small name="chart" onClick={() => setSelectType("chart")} />
                <ElSvgIcon active={selectType === "calendar"} light small name="calendar" onClick={() => setSelectType("calendar")} />
            </ElBox>
            <Idiograph mt={2} mb={2} title={`${user.firstName} ${user.lastName}`} imgurl={user.pictureUrl} />
            {selectType === "camera" && <NormalPost imageUrl={url} imageFile={file}> </NormalPost>}
            {selectType === "chart" && <ShareStats />}
            {selectType === "calendar" && <ShareEvent />}
        </>
    );
}

const NormalPost = ({ imageUrl, imageFile }) => {
    const history = useHistory();
    const form = useForm();
    const { register, formState: { errors } } = form;

    const handleCreateClick = async data => {
        data['file'] = imageFile;
        const res = await postService.create(data);
        if (res && res.code === 200) {
            history.push('/');
        }
    };
    return (
        <ElForm form={form} onSubmit={handleCreateClick}>
            <CardMedia image={imageUrl} component="img" />
            <ElInput label="Say something" rows={6} multiline errors={errors} inputProps={{ maxLength: 250 }}
                {...register("details", { required: 'This field is required.' })}
            />
            <ElButton type="submit" fullWidth>Create a post</ElButton>
        </ElForm>
    );
}

const ShareEvent = () => {
    const history = useHistory();
    const [searchedEvents, setSearchedEvents] = useState([]);
    const [viewButtonStatus, setViewButtonStatus] = useState(true);
    const [eventId, setEventId] = useState('');

    const handleChange = (event) => {
        setEventId(event.target.value);
        setViewButtonStatus(false);
    };

    const handleSearchEvents = async value => {
        if (String.isNullOrEmpty(value)) return setSearchedEvents([]);

        const res = await eventService.searchUnsharedEvent(value);
        if (res && res.code === 200) {
            setSearchedEvents(res.value);
        }
    };
    return (
        <>
            <ElSearchBox mb={2} placeholder="Search an event" onChange={handleSearchEvents} />
            <Box className='scroll-container' sx={{ maxHeight: (theme) => `calc(100vh - ${theme.spacing(70)})` }}>
                <RadioGroup value={eventId} onChange={handleChange}>
                    {
                        !Array.isNullOrEmpty(searchedEvents) &&
                        searchedEvents.map((item) =>
                            <FormControlLabel key={item.id} value={item.id} control={<Radio />} label={<Idiograph imgurl={item.imageUrl} title={item.title} subtitle={item.address} />} />
                        )
                    }
                </RadioGroup>
            </Box >
            <ElButton mt={5} fullWidth disabled={viewButtonStatus} onClick={() => history.push('/eventShare', { params: eventId })}>View Event</ElButton>
        </>
    );
}
