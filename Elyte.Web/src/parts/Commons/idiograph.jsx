import React from 'react';
import { Box, Badge, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ElBox, ElAvatar } from 'components';
import { styled } from '@mui/system';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
    normalTitle: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '500',
        fontSize: '18px',
    },
    title: {
        fontWeight: '500',
        fontSize: '15px',
        lineHeight: '22.5px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        width: 29.99,
        height: 42.03,
    },
    reverse: {
        flexDirection: 'row-reverse',
        '& .idiograph-title': {
            flexDirection: 'row-reverse',
            paddingRight: theme.spacing(1),
        },
        '& .idiograph-center-title': {
            textAlign: 'right',
            paddingRight: theme.spacing(1),
        },
        '& .idiograph-sub-title': {
            textAlign: 'right',
            paddingRight: theme.spacing(1),
        },
    },
}));


const SubTitle = styled(Typography)(({ theme }) => {
    return {
        fontWeight: '400',
        fontSize: '10px',
        lineHeight: '15px',
        color: theme.palette.body.main,
    };
});

const CenterTitle = styled(Typography)(() => {
    return {
        fontWeight: '500',
        fontSize: '10px',
        lineHeight: '15px',
        color: '#17C476',
    };
});

const Idiograph = ({ normalTitle, title, subtitle, imgurl, isShowDot, centerTitle, reverse, to, ...rest }) => {
    const classes = useStyles();
    let allClasses = [rest.className];
    if (reverse) {
        allClasses.push(classes.reverse);
    }

    return (
        <ElBox centerCross className={allClasses.join(" ")} component={to ? Link : Box} to={to} sx={{ color: '#000', textDecoration: 'none', width: '100%' }} {...rest}>
            <Box mt={0.5}>
                <Badge
                    color="secondary"
                    variant="dot"
                    anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                    invisible={!isShowDot}>
                    <ElAvatar src={imgurl} />
                </Badge>
            </Box>
            {
                normalTitle &&
                <Box pl={1} pr={1} className={classes.normalTitle}>
                    {normalTitle}
                </Box>
            }
            <ElBox col pl={1} style={{
                    overflow: 'hidden',
                }}>
                <Box className={`${classes.title} idiograph-title`} style={{
                    overflow: 'hidden',
                }}>
                    {typeof title === 'object' && title}
                    {typeof title === 'string' && <Box dangerouslySetInnerHTML={{ __html: title }}  style={{
                        flex: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}></Box>}
                </Box>

                {centerTitle && <CenterTitle className='idiograph-center-title' dangerouslySetInnerHTML={{ __html: centerTitle }}></CenterTitle>}

                {typeof subtitle === 'object' && subtitle}
                {typeof subtitle === 'string' && <SubTitle className='idiograph-sub-title' dangerouslySetInnerHTML={{ __html: subtitle }}></SubTitle>}
            </ElBox>
        </ElBox>
    );
};

export default Idiograph;
