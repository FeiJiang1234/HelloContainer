import React from 'react';
import { Typography, Box } from '@mui/material';
import { ElBox } from 'components';

const CongratulationIndex = ({ title, content }) => {
    return (
        <ElBox>
            <Typography sx={{ color: '#17C476' }} mr={1} >{title}:</Typography>
            <Box sx={{ fontWeight: 500, fontSize: 15, color: '#1F345D', wordBreak: 'break-all' }}>{content}</Box>
        </ElBox>
    );
}

export default CongratulationIndex;