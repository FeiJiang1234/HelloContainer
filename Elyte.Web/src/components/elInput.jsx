import { TextField } from '@mui/material';
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(theme => {
    return {
        root: {
            '& .MuiInputBase-root': {
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
        },
    };
});

const ElInput = React.forwardRef(({ errors, ...rest }, ref) => {
    const classes = useStyles();
    return (
        <TextField className={[classes.root, rest.className].join(" ")} variant="outlined" margin="normal" fullWidth
            {...rest}
            ref={ref}
            helperText={Object.keys(errors || []).includes(rest.name) ? errors[rest.name]?.message : ''}
            error={Object.keys(errors || []).includes(rest.name)}
        />
    )
});

ElInput.displayName = "ElInput";

ElInput.propTypes = {
    label: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
};

export default ElInput;
