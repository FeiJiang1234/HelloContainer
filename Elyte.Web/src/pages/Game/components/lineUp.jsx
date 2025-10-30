import { Box } from '@mui/material';
import { styled } from '@mui/system';

const Square = styled(Box)(() => {
    return {
        width: 40,
        height: 40,
        borderRadius: 8,
        fontWeight: 'bold',
        fontSize: '16px',
        textAlign: 'center',
        paddingTop: 8,
        cursor: 'pointer',
    };
});

export const Selected = styled(Square)(() => {
    return { background: '#17C476', color: 'white' };
});

export const Unselected = styled(Square)(() => {
    return { background: '#F0F2F7' };
});


