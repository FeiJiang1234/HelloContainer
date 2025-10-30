import React from 'react';
import { makeStyles } from '@mui/styles';
import { Box, FormControl, TextField, Autocomplete } from '@mui/material';
import PropTypes from 'prop-types';


const useStyles = makeStyles(theme => {
    return {
        root: {
            '& .MuiOutlinedInput-root': {
                backgroundColor: '#F0F2F7',
                borderRadius: '10px',
            },
            '& .MuiFormLabel-root': {
                color: theme.palette.body.light,
            },
            '& .MuiOutlinedInput-notchedOutline': {
                borderWidth: 0,
            }
        },
        formControl: {
            borderColor: theme.palette.primary.main,
        },
        errors: {
            '& .MuiFormLabel-root': {
                color: '#FF7373',
            },
            '& .MuiInputBase-root .MuiOutlinedInput-notchedOutline': {
                borderColor: '#FF7373',
            },
        }
    };
});


const ElAutocomplete = ({ name, errors, register, options, rules, ...rest }) => {
    const classes = useStyles();
    return (
        <Autocomplete options={options} {...rest}
            renderInput={params => (
                <Box className={classes.root}>
                    <FormControl fullWidth margin="normal" variant="outlined"
                        className={`${classes.formControl} ${Object.keys(errors || []).includes(name) ? classes.errors : ''}`} >
                        <TextField label={rest.label} variant="outlined" {...params}
                            error={Object.keys(errors || []).includes(name)}
                            helperText={Object.keys(errors || []).includes(name) ? errors[name]?.message : ''}
                            {...register(name, { value: rest.defaultValue, ...rules })}
                        />
                    </FormControl>
                </Box>
            )}
        />
    )
};

ElAutocomplete.propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    error: PropTypes.string,
};

ElAutocomplete.displayName = "ElAutocomplete";

export default ElAutocomplete;
