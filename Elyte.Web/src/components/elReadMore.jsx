import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import { Box } from '@mui/material';
import ElLinkBtn from './elLinkBtn';

const useStyles = makeStyles(() => ({
    detail: {
        wordBreak: 'break-all'
    }
}));

export default function ElReadMore ({ text }) {
    const [isReadMore, setIsReadMore] = useState(false);
    const classes = useStyles();

    return (
        <Box>
            {!isReadMore && text.length < 100 &&
                <Box className={classes.detail}>
                    {text}
                </Box>
            }
            {
                text.length > 100 && !isReadMore &&
                <Box>
                    <Box className={classes.detail}>
                        {text.substring(0, 46)}...
                    </Box>
                    <ElLinkBtn small onClick={() => setIsReadMore(true)}>
                        Read more
                    </ElLinkBtn>
                </Box>
            }
            {
                text.length > 100 && isReadMore &&
                <Box>
                    <Box className={classes.detail}>
                        {text}
                    </Box>
                    <ElLinkBtn small onClick={() => setIsReadMore(false)}>
                        Read less
                    </ElLinkBtn>
                </Box>
            }
        </Box>
    )
}
