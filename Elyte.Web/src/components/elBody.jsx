import React from 'react';
import { Box } from '@mui/material';
import withElStyle from './withElStyle';
import PropTypes from 'prop-types';

function ElBody ({ children, light, center, sx = [], ...rest }) {
    return <Box
        sx={[
            {
                fontWeight: 400,
                fontSize: 14,
                color: 'body.main',
                overflowWrap: 'break-word'
            },
            light && { color: 'body.light' },
            center && { textAlign: 'center' },
            ...(Array.isArray(sx) ? sx : [sx])
        ]} {...rest}>
        {children}
    </Box>;
}

ElBody.propTypes = {
    sx: PropTypes.oneOfType([
        PropTypes.arrayOf(
            PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool]),
        ),
        PropTypes.func,
        PropTypes.object
    ])
};

export default withElStyle(ElBody);
