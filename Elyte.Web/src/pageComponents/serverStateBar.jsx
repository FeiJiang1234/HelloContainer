import React from 'react';
import { Box, Typography } from '@mui/material';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import CircularProgress from '@mui/material/CircularProgress';

const ServerStateBar = () => {
    return <Box sx={{ display: 'flex', height: '32px', position: 'fixed', width: '100%', alignItems: 'center', top: 0, marginTop: 7, backgroundColor: 'rgb(253, 237, 237)' }}>
        <Box sx={{ position: 'absolute', width: 370, left: 0, right: 0, margin: 'auto', display: 'inline-flex' }}>
            <CircularProgress variant="indeterminate" size={25} sx={{ color: 'red' }} />
            <Box sx={{ position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
                <PriorityHighIcon size={20} sx={{ color: 'red' }} />
            </Box>
        </Box>
        <Typography variant="caption" sx={{ color: 'red', position: 'absolute', width: 310, left: 0, right: 0, margin: 'auto' }}>
            The network is unstable, waiting for reconnecting...
        </Typography>
    </Box >
}

export default ServerStateBar;