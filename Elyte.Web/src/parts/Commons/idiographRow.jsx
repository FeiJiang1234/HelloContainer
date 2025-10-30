import React from 'react';
import { Divider, Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ElBox } from 'components';
import Idiograph from './idiograph';

const useStyles = makeStyles(theme => {
    return {
        itemLabel: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
        },
        actions: {
            display: 'flex',
            gap: theme.spacing(1)
        }
    };
});


const IdiographRow = ({ children, normalTitle, title, to, centerTitle, subtitle, imgurl, noDivider, onClick }) => {
    const classes = useStyles();
    const handleRowClick = () => {
        if (onClick) {
            onClick();
        }
    }

    return (
        <>
            <ElBox mb={1.5} mt={1.5} className={classes.itemLabel} onClick={handleRowClick}>
                <Idiograph normalTitle={normalTitle} title={title} to={to} subtitle={subtitle} centerTitle={centerTitle} imgurl={imgurl} />
                <span className="fillRemain"></span>
                <Box className={classes.actions}>{children}</Box>
            </ElBox>
            {!noDivider && <Divider />}
        </>
    );
};

export default IdiographRow;
