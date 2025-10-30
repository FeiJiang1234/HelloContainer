import { Typography } from '@mui/material';
import React from 'react';

const ElLinkBtn = ({ children, small, large, noPointer, sx, ...rest }) => {
    return (
        <Typography 
            sx={[
                {
                    color: '#17C476',
                    fontSize: 15,
                    fontWeight: '600',
                    cursor: 'pointer'
                },
                small && {  fontSize: 12 },
                large && {  fontSize: 16 },
                noPointer && {  cursor: 'initial' },
                ...(Array.isArray(sx) ? sx : [sx])
            ]} {...rest}>
            {children}
        </Typography>
    );
};

export default ElLinkBtn;
