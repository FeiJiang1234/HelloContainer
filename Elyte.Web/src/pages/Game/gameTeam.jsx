import React, { } from 'react';
import { makeStyles } from '@mui/styles';
import { Typography } from '@mui/material';
import { ElBox, ElSvgIcon, ElAvatar } from 'components';


const useStyles = makeStyles(theme => ({
    teamBox: ({ isWinner }) => ({
        backgroundColor: isWinner ? '#17C476' : '#F0F2F7',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        height: theme.spacing(7),
    }),
    teamImage: {
        width: theme.spacing(5),
        height: theme.spacing(5),
        marginLeft: theme.spacing(2)
    },
    teamName: ({ isWinner }) => ({
        color: isWinner ? 'white' : '#1F345D',
        fontSize: 15
    }),
    teamRank: ({ isWinner }) => ({
        color: isWinner ? 'white' : '#17C476',
        fontSize: 12
    }),
    teamArrow: ({ isWinner }) => ({
        width: theme.spacing(2),
        height: theme.spacing(2),
        marginRight: theme.spacing(2),
        fill: isWinner ? "white" : '#1F345D'
    }),
    teamScore: ({ isWinner }) => ({
        color: isWinner ? 'white' : '#17C476',
        fontWeight: 600,
        fontSize: 18
    })
}));

const GameTeam = ({ url, name, rank, score, onArrowClick, onAvatarClick, onRowClick, isWinner }) => {
    const classes = useStyles({ isWinner });
    return (
        <ElBox centerCross mt={1.5} mb={1.5} className={classes.teamBox} onClick={onRowClick}>
            <ElAvatar className={classes.teamImage} src={url} onClick={onAvatarClick} />
            <ElBox col pl={1}>
                <Typography className={classes.teamName}>{name}</Typography>
                <span className="fillRemain"></span>
                {rank && <Typography className={classes.teamRank}>{rank}</Typography>}
            </ElBox>
            <span className="fillRemain"></span>
            {score !== undefined && <ElBox mr={3} className={classes.teamScore}>{score}</ElBox>}
            {onArrowClick && <ElSvgIcon name="rightArrow" className={classes.teamArrow} onClick={onArrowClick}/>}
        </ElBox>
    );
};

export default GameTeam;
