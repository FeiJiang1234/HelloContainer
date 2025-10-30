import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import { TextField } from '@mui/material';
import PropTypes from 'prop-types';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DesktopDatePicker, DesktopTimePicker, DesktopDateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { Controller } from "react-hook-form";
import * as moment from 'moment';

const useStyles = makeStyles(theme => {
    return {
        root: {
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(1),
            '& .MuiOutlinedInput-root': {
                backgroundColor: '#F0F2F7',
                borderRadius: '10px',
            },
            '& .MuiFormLabel-root': {
                color: theme.palette.body.light,
            },
            '& .MuiOutlinedInput-notchedOutline': {
                borderWidth: 0,
            },
            '& .MuiInputBase-root.Mui-error': {
                color: theme.palette.error.main,
                backgroundColor: theme.palette.error.bg,
            },
            '& .MuiFormLabel-root.Mui-error': {
                color: theme.palette.error.main,
            },
            '& .MuiInputBase-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.error.main,
            },
        }
    };
});



const ElDateTimePicker = ({ name, label, control, type, defaultValue, disabled, rules, errors, onChange, onClose }) => {
    let fullTime = null;
    if (type === "time" && defaultValue) {
        fullTime = moment(new Date()).set({ 'hour': defaultValue.split(':')[0], 'minute': defaultValue.split(':')[1] }).format("MM/DD/YYYY HH:mm");
    }

    const [value, setValue] = useState((type === "time" ? fullTime : defaultValue) || '');

    const handleValueChange = (field, newValue, formatter) => {
        field.onChange(newValue?.format(formatter) || '');
        setValue(newValue);
        if (onChange) {
            onChange(newValue?.format(formatter) || '');
        }
    };
    return (
        <Controller
            name={name}
            control={control}
            rules={{ ...rules }}
            defaultValue={defaultValue}
            render={({ field }) =>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                    {
                        type === "date" &&
                        <DesktopDatePicker label={label} {...field} value={value} disabled={disabled}
                            onChange={(v) => handleValueChange(field, v, 'MM/DD/YYYY')}
                            onClose={onClose}
                            renderInput={(params) => <DateTimePickerText name={name} errors={errors} params={params} />} />
                    }
                    {
                        type === "time" &&
                        <DesktopTimePicker label={label} {...field} value={value} disabled={disabled}
                            onChange={(v) => handleValueChange(field, v, 'HH:mm')}
                            onClose={onClose}
                            renderInput={(params) => <DateTimePickerText name={name} errors={errors} params={params} />} />
                    }
                    {
                        type === "datetime" &&
                        <DesktopDateTimePicker label={label} {...field} value={value} disabled={disabled}
                            onChange={(v) => handleValueChange(field, v, 'MM/DD/YYYY HH:mm:ss')}
                            onClose={onClose}
                            renderInput={(params) => <DateTimePickerText name={name} errors={errors} params={params} />} />
                    }
                </LocalizationProvider>
            }
        />
    );
}

const DateTimePickerText = ({ name, errors, params }) => {
    const classes = useStyles();
    return <TextField fullWidth className={classes.root} {...params}
        error={Object.keys(errors || []).includes(name)}
        helperText={Object.keys(errors || []).includes(name) ? errors[name]?.message : ''} />
}

ElDateTimePicker.propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
};

ElDateTimePicker.displayName = "ElDateTimePicker";
export default ElDateTimePicker;
