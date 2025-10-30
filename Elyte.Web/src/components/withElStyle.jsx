import React from 'react';
import { Box } from '@mui/material';

const withElStyle = Component => {
    const HOC = function ({ mt, mb, ml, mr, pt, pb, pl, pr, ...rest }) {
        return (
            <Box mt={mt} mb={mb} ml={ml} mr={mr} pt={pt} pb={pb} pl={pl} pr={pr}>
                <Component {...rest} />
            </Box>
        );
    };

    HOC.defaultProps = {
        mt: 0,
        mb: 0,
        ml: 0,
        mr: 0,
        pt: 0,
        pb: 0,
        pl: 0,
        pr: 0,
    };

    return HOC;
};

export default withElStyle;
