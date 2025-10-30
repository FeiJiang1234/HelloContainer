import React from 'react';
import { makeStyles } from '@mui/styles';
import { useHistory } from 'react-router-dom';
import { ElBox, ElAvatar, ElBody } from 'components';
import { useProfileRoute } from 'utils';

const useStyles = makeStyles(theme => ({
    box: {
        backgroundColor: '#F0F2F7',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        height: theme.spacing(7),
    },
    image: {
        width: theme.spacing(5),
        height: theme.spacing(5),
        marginLeft: theme.spacing(2)
    }
}));

const GameAthleteStat = ({ id, url, name, count }) => {
    const classes = useStyles();
    const history = useHistory();
    const { athleteProfile } = useProfileRoute();

    return (
        <ElBox centerCross mt={1.5} mb={1.5} className={classes.box}>
            <ElAvatar className={classes.image} src={url} onClick={() => history.push(athleteProfile(id))} />
            <ElBox col pl={1} className={classes.name} sx={{ color: '#1F345D', fontSize: 15 }}>{name}</ElBox>
            <span className="fillRemain"></span>
            <ElBody mr={3}>{count}</ElBody>
        </ElBox>
    );
};

export default GameAthleteStat;
