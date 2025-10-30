import React from 'react';
import { makeStyles } from '@mui/styles';
import { InputLabel, FormControl, FormHelperText, Select, MenuItem, Box } from '@mui/material';
import PropTypes from 'prop-types';
import ListSubheader from '@mui/material/ListSubheader';

const errorColor = '#FF7373';

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
            },
            '& .MuiSvgIcon-root': {
                color: theme.palette.primary.main,
            },
        },
        formControl: {
            borderColor: theme.palette.primary.main,
        },
        errors: {
            '& .MuiSelect-root': {
                backgroundColor: theme.palette.error.bg,
                border: 'none',
            },
            '& .MuiFormLabel-root': {
                color: errorColor,
            },
            '& .MuiInputBase-root .MuiOutlinedInput-notchedOutline': {
                borderColor: errorColor,
            },
            '& .MuiSvgIcon-root': {
                color: errorColor,
            },
        }
    };
});

const ElGroupSelect = React.forwardRef(({ errors, options, onChange, ...rest }, ref) => {
    const classes = useStyles();
    return (
        <Box className={classes.root}>
            <FormControl fullWidth margin="normal" variant="outlined"
                className={`${classes.formControl} ${Object.keys(errors || []).includes(rest.name) ? classes.errors : ''}`}>
                <InputLabel htmlFor="grouped-select">{rest.label}</InputLabel>
                <Select id="grouped-select" label="Grouping" ref={ref}
                    defaultValue={rest.defaultValue === undefined ? '' : rest.defaultValue}
                    onChange={onChange} {...rest}>
                    {!Array.isNullOrEmpty(options) && options.map((group, index) => (
                        [
                            <ListSubheader key={index} sx={{ fontSize: '1rem', color: 'black' }}>{group.groupName}</ListSubheader>,
                            group.data.map((option) => (
                                <MenuItem key={option.value + group.groupName} value={`${option.value}`}>
                                    {option.label}
                                </MenuItem>
                            ))
                        ])
                    )}
                </Select>
                <FormHelperText error={Object.keys(errors || []).includes(rest.name)}>
                    {Object.keys(errors || []).includes(rest.name) ? errors[rest.name]?.message : ''}
                </FormHelperText>
            </FormControl>
        </Box>
    )
});

ElGroupSelect.propTypes = {
    error: PropTypes.string,
};

ElGroupSelect.displayName = "ElGroupSelect";

export default ElGroupSelect;
