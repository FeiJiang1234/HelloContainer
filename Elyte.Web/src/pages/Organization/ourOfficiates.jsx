import React from 'react';
import { Box } from '@mui/material';
import { ElSvgIcon } from 'components';
import { makeStyles } from '@mui/styles';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles(() => ({
    officiates: {
        color: '#1F345D',
        fontWeight: 600,
        fontSize: '13px',
        cursor: 'pointer'
    }
}));

const OurOfficiates = ({ id, type, isAdminView }) => {
    const classes = useStyles();
    const history = useHistory();

    const handleViewOurOfficiatesClick = () => {
        history.push("/officiateList", { params: { id, type, isAdminView } });
    }

    return (
        <Box mt={2} display="flex">
            <ElSvgIcon light small name="officiates" onClick={handleViewOurOfficiatesClick} />
            <Box ml={2} mt={1} className={classes.officiates} onClick={handleViewOurOfficiatesClick}>Our Officiates</Box>
        </Box>
    )
};

export default OurOfficiates;