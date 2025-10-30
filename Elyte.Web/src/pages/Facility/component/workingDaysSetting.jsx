import React, { useEffect } from 'react';
import { Typography, MenuItem, Checkbox, ListItemText, Grid } from '@mui/material';
import { styled } from '@mui/system';
import { ElSelect, ElButton } from 'components';
import { makeStyles } from '@mui/styles';
import { weeks, timeRanges } from '../../../models';
import { useForm } from "react-hook-form";
import { facilityService } from 'services';

const SubCheckbox = styled(Checkbox)(() => {
    return {
        '&.MuiCheckbox-root': {
            color: 'white'
        },
        '&.Mui-checked': {
            color: '#17C476'
        }
    };
});

const useStyles = makeStyles(theme => ({
    interval: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 15,
        color: theme.palette.body.main,
    },
}));

const WorkingDaysSetting = ({ defaultFacilityId, defaultWorkDays, defaultWorkStartTime, defaultWorkEndTime, onSaveSuccess }) => {
    const classes = useStyles();
    const [workDays, setWorkDays] = React.useState([]);
    const { register, handleSubmit, formState: { errors } } = useForm();

    useEffect(() => {
        if (defaultWorkDays) {
            setWorkDays(defaultWorkDays.split(','));
        }
    }, [defaultWorkDays]);

    const handleWorkDaysChanged = (event) => {
        setWorkDays(event.target.value);
    };

    const handleSaveWorkDays = async (data) => {
        if (!Array.isNullOrEmpty(data.workDays)) {
            data.workDays = workDays;
        }
        const res = await facilityService.updateFacilityWorkDays(defaultFacilityId, data);
        if (res && res.code === 200 && onSaveSuccess) {
            onSaveSuccess();
        }
    };

    return (
        <form onSubmit={handleSubmit(handleSaveWorkDays)} autoComplete="off">
            <Typography className="category-text">Working Days</Typography>
            <ElSelect label="Set facilit's work days" multiple value={workDays} renderValue={(selected) => selected.join(',')}
                {...register("workDays", { onChange: handleWorkDaysChanged, value: workDays })}
            >
                {weeks.map((name) => (
                    <MenuItem key={name} value={name}>
                        <SubCheckbox checked={workDays.indexOf(name) > -1} />
                        <ListItemText primary={name} />
                    </MenuItem>
                ))}
            </ElSelect>
            <Typography className="category-text">Working Time</Typography>
            <Grid container spacing={1}>
                <Grid item xs={5}>
                    <ElSelect label="Start time" errors={errors} options={timeRanges} defaultValue={defaultWorkStartTime}
                        {...register("workStartTime", { required: { value: true, message: 'This field is required.' } })}
                    />
                </Grid>
                <Grid item xs={2} className={classes.interval}>To</Grid>
                <Grid item xs={5}>
                    <ElSelect label="End time" errors={errors} options={timeRanges} defaultValue={defaultWorkEndTime}
                        {...register("workEndTime", { required: { value: true, message: 'This field is required.' } })}
                    />
                </Grid>
            </Grid>
            <ElButton mt={1} type="submit">Save Schedule</ElButton>
        </form>
    );
}

export default WorkingDaysSetting;