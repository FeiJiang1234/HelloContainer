import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const ElLink = ({ children, variant, green, sx = [], ...rest }) => {
    return (
        <Link
            sx={[
                {
                    color: '#000',
                    textDecoration: 'none'
                },
                green && { color: '#17C476' },
                ...(Array.isArray(sx) ? sx : [sx])
            ]}
            variant={variant}
            component={RouterLink}
            {...rest}>
            {children}
        </Link>
    );
};

ElLink.propTypes = {
    variant: PropTypes.string,
    sx: PropTypes.oneOfType([
        PropTypes.arrayOf(
          PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool]),
        ),
        PropTypes.func,
        PropTypes.object
    ])
};

ElLink.defaultProps = {
    variant: 'body2',
};

export default ElLink;
