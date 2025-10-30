import React from 'react';
import PropTypes from 'prop-types';
import { Button, CircularProgress } from '@mui/material';
import withElStyle from './withElStyle';

const ElButton = ({ loading, disabled, small, media, circle, sx = [], ...rest }) => {
    return (
        <Button disabled={loading || disabled} {...rest}
            sx={[
                (theme) => ({
                    textTransform: 'none',
                    height: 50,
                    background: theme.bgPrimary,
                    fontSize: 17
                }),
                small && { height: 30 },
                media && { height: 60 },
                rest.variant === 'outlined' && { background: '#FFFFFF' },
                (loading || disabled) && { background: '#F0F2F7', color: 'body.light' },

                circle && ((theme) => ({
                    width: theme.spacing(5),
                    minWidth: theme.spacing(5),
                    height: theme.spacing(5),
                    borderRadius: '50%',
                    padding: 0
                })),

                ...(Array.isArray(sx) ? sx : [sx])
            ]}>
            {rest.children}
            {loading && <CircularProgress size={24} sx={{ position: 'absolute' }} />}
        </Button>
    );
};

ElButton.propTypes = {
    type: PropTypes.string,
    variant: PropTypes.string,
    loading: PropTypes.bool,
    fullWidth: PropTypes.bool,
    sx: PropTypes.oneOfType([
        PropTypes.arrayOf(
            PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool]),
        ),
        PropTypes.func,
        PropTypes.object
    ])
};

ElButton.defaultProps = {
    loading: false,
    fullWidth: true,
    variant: 'contained',
    color: "primary",
    disableElevation: true
};

export default withElStyle(ElButton);
