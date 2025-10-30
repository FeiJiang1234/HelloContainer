import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { makeStyles } from '@mui/styles';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: theme.spacing(0.5),
        fontSize: '13px',
        fontWeight: '500',
        '& .text': {
            color: theme.palette.body.main,
            fontSize: '15px',
            fontWeight: '500',
        },
    },
    root: ({ fullWidth }) => ({
        width: fullWidth ? '100%' : '90px',
        height: '30px',
        padding: 0,
        borderRadius: '5px',
        color: theme.palette.primary.contrastText,
        background: theme.bgPrimary,
        textAlign: 'center',
        position: 'relative',
        cursor: 'pointer',
        '& div': {
            display: 'inline-block',
            width: '50%',
            height: '100%',
            lineHeight: '30px',
        },
        '& .elswitch-text': {
            transitionDuration: '0.3s',
            display: 'block',
            width: 'calc(50% - 4px)',
            height: 'calc(100% - 8px)',
            lineHeight: '22px',
            backgroundColor: '#17C476',
            borderRadius: '4px',
            position: 'absolute',
            left: '4px',
            top: '4px',
        },
    }),
    loading: {
        background: '#F0F2F7',
    },
    slideOff: {
        transform: 'translateX(0)',
    },
    slideOn: {
        transform: 'translateX(100%)',
    },
    progress: {
        position: 'absolute',
        left: '38%',
        top: '24%',
    },
    disabled: {
        background: 'rgba(0, 0, 0, 0.12)',
        color: theme.palette.body.light,
        '& span': {
            background: '#F0F2F7',
        },
    },
}));

const ElSwitch = ({ on, off, isOn, toggle, loading, disabled, text, fullWidth, ...rest }) => {
    const classes = useStyles({ fullWidth });
    const handlerSwitchClick = () => {
        if (toggle) {
            toggle(!isOn);
        }
    }
    return (
        <Box className={classes.container} {...rest}>
            <Typography className="text">{text}</Typography>
            <span className="fillRemain"></span>
            <Box className={`${classes.root} ${loading ? classes.loading : ''} ${disabled ? classes.disabled : ''}`} onClick={handlerSwitchClick}>
                <div>{off}</div>
                <div>{on}</div>
                <span className={`${isOn ? classes.slideOn : classes.slideOff} elswitch-text`}>{isOn ? on : off}</span>
                {loading && <CircularProgress size={18} className={classes.progress} />}
            </Box>
        </Box>
    );
};

ElSwitch.propTypes = {
    on: PropTypes.string,
    off: PropTypes.string,
    isOn: PropTypes.bool,
};

ElSwitch.defaultProps = {
    isOn: false,
};

export default ElSwitch;
