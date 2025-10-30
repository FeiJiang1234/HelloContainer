import React from 'react';
import { makeStyles, useTheme } from '@mui/styles';
import { InputLabel, FormControl, FormHelperText, Select, MenuItem } from '@mui/material';
import PropTypes from 'prop-types';

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
            '& .payment-account-icon': {
                display: 'none'
            }
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
        },
        item: {
            display: 'flex',
            justifyContent: 'space-between'
        },
    };
});

const DefaultMenuProps = (selectStyle) => {
    return {
        PaperProps: {
            style: {
                maxHeight: 200,
                borderRadius: '0px 0px 10px 10px',
                background: useTheme().bgPrimary,
                color: '#FFFFFF',
                ...selectStyle
            }
        }
    }
};

const ElSelect = React.forwardRef(({ errors, options, onChange, selectStyle, ...rest }, ref) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <FormControl fullWidth margin="normal" variant="outlined"
                className={`${classes.formControl} ${Object.keys(errors || []).includes(rest.name) ? classes.errors : ''}`}>
                <InputLabel>{rest.label}</InputLabel>
                <Select className={classes.select} ref={ref} defaultValue={rest.defaultValue === undefined ? '' : rest.defaultValue} MenuProps={rest.MenuProps ?? DefaultMenuProps(selectStyle)} onChange={onChange} {...rest}>
                    {!rest.children && !Array.isNullOrEmpty(options) && options.map((item, index) => {
                        return (
                            <MenuItem key={item.value + item.label + index} value={item.value} disabled={item.disabled} className={classes.item}>
                                {item.label} {item.icon}
                            </MenuItem>
                        );
                    })}
                    {
                        rest.children
                    }
                </Select>
                <FormHelperText error={Object.keys(errors || []).includes(rest.name)}>
                    {Object.keys(errors || []).includes(rest.name) ? errors[rest.name]?.message : ''}
                </FormHelperText>
            </FormControl>
        </div>
    )
});

ElSelect.propTypes = {
    name: PropTypes.string.isRequired,
    error: PropTypes.string,
};

ElSelect.displayName = "ElSelect";

export default ElSelect;
