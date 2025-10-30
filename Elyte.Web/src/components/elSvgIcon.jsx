import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(theme => ({
    svg: {
        stroke: 'white',
        strokeWidth: 2,
        height: '32px',
        width: '32px',
    },
    like: {
        stroke: theme.palette.secondary.main,
    },
    favorite: {
        stroke: theme.palette.secondary.minor,
    },
    light: {
        stroke: '#C0C5D0',
    },
    dark: {
        stroke: theme.palette.body.light,
    },
    hover: {
        '&:hover': {
            stroke: '#17C476',
        },
    },
    active: {
        stroke: '#17C476',
    },
    xSmall: {
        height: '18px',
        width: '18px',
    },
    small: {
        height: '26px',
        width: '26px',
    },
    large: {
        height: '70px',
        width: '70px',
    },
    xLarge: {
        width: '126px',
        height: '126px',
    },
}));

const ElSvgIcon = ({ name, large, xLarge, small, xSmall, hover, active, light, dark, like, favorite, className, ...rest }) => {
    const classes = useStyles();

    let allClasses = [className, classes.svg, 'el-svg-icon hand'];
    if (small) allClasses.push(classes.small);
    if (large) allClasses.push(classes.large);
    if (xLarge) allClasses.push(classes.xLarge);
    if (xSmall) allClasses.push(classes.xSmall);
    if (hover) allClasses.push(classes.hover);
    if (active) allClasses.push(classes.active);
    if (light) allClasses.push(classes.light);
    if (dark) allClasses.push(classes.dark);
    if (like) allClasses.push(classes.like);
    if (favorite) allClasses.push(classes.favorite);

    return (
        <svg className={allClasses.join(' ')} fill="#1F345D" {...rest}>
            <use xlinkHref={`/svgs/sprite.svg#${name}`}></use>
        </svg>
    );
};

ElSvgIcon.propTypes = {
    name: PropTypes.string.isRequired,
};

export default ElSvgIcon;
