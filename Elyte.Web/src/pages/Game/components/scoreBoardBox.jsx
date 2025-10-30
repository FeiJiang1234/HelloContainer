import React from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/system';

export const NewBox = styled(Box)(({ theme, large, style }) => ({
    ...({
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 80,
        background: '#F0F2F7',
        borderRadius: 8,
        paddingLeft: 8,
        paddingRight: 8,
        cursor: 'pointer',
        color: theme.palette.primary.main,
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center'
    }),
    ...(large && { fontSize: 28 }),
    ...style
}));

export const DarkBox = styled((props) => (<NewBox {...props} />))(({ theme }) => { 
    return { 
        background: theme.bgPrimary, 
        color: 'white' 
    } 
});

export const ScoreBox = styled(NewBox)(() => { 
    return { 
        cursor: 'auto',
        flexDirection: 'column',
        height: 90,
        '& :first-of-type': { fontSize: 15 },
        '& :last-of-type': { fontSize: 40 }  
    } 
});

export const FoulBox = styled(NewBox)(() => { 
    return { 
        cursor: 'auto',
        marginLeft: 50,
        marginRight: 50,
        height: 60,
        '& :first-of-type': { fontSize: 25 },
        '& :last-of-type': { fontSize: 25 }  
    } 
});