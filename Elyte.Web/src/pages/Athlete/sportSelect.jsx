import React, { useState } from 'react';
import { Typography, IconButton } from '@mui/material';
import { ElSvgIcon, ElBox, ElMenuBtn } from 'components';

export default function SportSelect ({ onTabclick, ...rest }) {
    const [sport, setSport] = useState('Basketball');

    const menuItems = [
        { text: 'Basketball', onClick: () => handleClose('Basketball') },
        { text: 'Baseball', onClick: () => handleClose('Baseball') },
        { text: 'Soccer', onClick: () => handleClose('Soccer') },
        { text: 'Hockey', onClick: () => handleClose('Hockey') },
        { text: 'Football', onClick: () => handleClose('Football') },
        { text: 'Lacrosse', onClick: () => handleClose('Lacrosse') },
        { text: 'Tennis', onClick: () => handleClose('Tennis') },
        { text: 'Pickleball', onClick: () => handleClose('Pickleball') },
        { text: 'PingPong', onClick: () => handleClose('PingPong') },
        { text: 'VolleyBall', onClick: () => handleClose('VolleyBall') }
    ];

    const handleClose = e => {
        setSport(e);
        onTabclick && onTabclick(e);
    };

    return (
        <ElBox center {...rest}>
            <Typography>{sport}</Typography>
            <span className="fillRemain"></span>
            <ElMenuBtn items={menuItems}>
                <IconButton>
                    <ElSvgIcon dark xSmall name="expandMore"></ElSvgIcon>
                </IconButton>
            </ElMenuBtn>
        </ElBox>
    );
}
