import React, {  } from 'react';
import { Typography, Box } from '@mui/material';
import { styled } from '@mui/system';

const Athlete = styled(Box)(({ theme }) => {
    return {
        marginBottom: theme.spacing(2),
        display: 'flex', 
        background: '#F0F2F7',
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        '&:before': { content: '""', display: 'block', paddingTop: '30%' }
    };
});

const Avatar = styled(Box)(({ url }) => {
    return {
        flex: 2, 
        background:`url(${url})`, 
        backgroundPosition: 'center', 
        backgroundSize: 'cover', 
        borderRadius: 10
    };
});

const AthleteName = styled(Typography)(({ theme }) => {
    return {
        color: theme.palette.primary.main, 
        fontWeight: 'bold', 
        marginTop: theme.spacing(1), 
        marginLeft: theme.spacing(1)
    };
});

const GameAthlete = ({ url, name }) => {
    return (
        <Athlete>
            <Avatar url={url}></Avatar>
            <Box sx={{ flex: 3 }}>
                <AthleteName>{name}</AthleteName>
            </Box>
        </Athlete>
    );
};

export default GameAthlete;
