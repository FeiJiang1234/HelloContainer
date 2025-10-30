import React from 'react';
import { makeStyles } from '@mui/styles';
import { Idiograph } from 'parts';
import { ElButton } from 'components';
import { Box } from '@mui/material';

const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        cursor: 'pointer',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #F0F2F7',
        padding: theme.spacing(1, 0.3),
        borderRadius: theme.spacing(0.5),
        '&:hover': {
            background: '#d9d9d9',
        },
    },
    main: {
        display: 'flex',
        width: '100%',
        justifyContent: 'space-between'
    }
}));

const SearchContent = ({ title, centerTitle, subtitle, imageUrl, onGoToProfile, unblock, isBlocked }) => {
    const classes = useStyles();
    return (
        <div className={classes.container}>
            <div className={classes.main}>
                <Box onClick={() => { onGoToProfile && onGoToProfile() }} flex={1}>
                    <Idiograph title={title} centerTitle={centerTitle} subtitle={subtitle} imgurl={imageUrl} ></Idiograph>
                </Box>
                {
                    isBlocked &&
                    <ElButton sx={{ background: '#E95B5B' }} small onClick={() => { unblock && unblock() }}>UnBlock</ElButton>
                }
            </div>
        </div >
    );
};

export default SearchContent;
