import React, { useState } from 'react';
import { Box, Divider, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ElSvgIcon } from 'components';

const useStyles = makeStyles(theme => ({
    arrow: ({ isShowDetails }) => ({
        width: theme.spacing(2),
        height: theme.spacing(2),
        marginRight: theme.spacing(2),
        transform: isShowDetails ? 'rotateZ(90deg)' :'rotateZ(-90deg)'
    })
}));

export default function ElAccordion ({ title, text, divider, children, hideArrow }) {
    const [isShowDetails, setIsShowDetails] = useState(true);
    const classes = useStyles({ isShowDetails });

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography className="category-text">{title}</Typography>
                <Typography className="category-text" sx={{ display: 'flex',  alignItems: 'center', gap: 1 }}>
                    {text} 
                    {!hideArrow && <ElSvgIcon dark name="leftArrow" className={classes.arrow} onClick={() => setIsShowDetails(!isShowDetails)}/>}
                </Typography>
            </Box>
            {isShowDetails && children }
            {divider && <Divider className='mb-16 mt-16' />}
        </>
    );
}

