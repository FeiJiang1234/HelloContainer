import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/system';

const Container = styled(Box)(() => {
    return {
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        position: 'fixed',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        top: 0,
        left: 0,
        zIndex: 999999
    }
});

const LoadingAnimation = styled(Box)(() => {
    return {
        display: 'inline-block',
        color: '#ddd',
        position: 'relative',
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: '28px',
        letterSpacing: '0.083333em',
        '&:before': {
            content: '""',
            position: 'absolute',
            right: '1.458333em',
            bottom: '0.75rem',
            height: '0.583333em',
            width: '0.104166em',
            background: 'currentColor',
            animation: 'loading-animation-l 1s linear infinite alternate'
        },
        '&:after': {
            content: '""',
            width: '0.35rem',
            height: '0.35rem',
            position: 'absolute',
            left: '2.604166em',
            top: '0.041666em',
            borderRadius: '50%',
            background: '#1F345C',
            animation: 'loading-animation 1s linear infinite alternate',
        },
        '@keyframes loading-animation-l': {
            '0%': {
                boxShadow: '0 -0.125em, -2.583333em -0.145833em'
            },
            '25%, 75%': {
                boxShadow: '0 0px, -2.583333em -0.145833em',
            },
            '100%': {
                boxShadow: '0 0px, -2.583333em -0.333333em'
            }
        },
        '@keyframes loading-animation': {
            '0%': {
                transform: 'translate(0px, 0px) scaleX(1)'
            },
            '14%': {
                transform: 'translate(-0.25em, -0.333333em) scaleX(1.05)'
            },
            '28%': {
                transform: 'translate(-0.5625em, -0.583333em) scaleX(1.07)'
            },
            '42%': {
                transform: 'translate(-0.958333em, -0.729166em) scaleX(1.1)'
            },
            '57%': {
                transform: 'translate(-1.458333em, -0.770833em) scaleX(1.1)'
            },
            '71%': {
                transform: 'translate(-1.958333em, -0.666666em) scaleX(1.07)'
            },
            '85%': {
                transform: 'translate(-2.3125em, -0.458333em) scaleX(1.05)'
            },
            '100%': {
                transform: 'translate(-2.604166em, -0.1875em) scaleX(1)'
            }
        }
    }
});
const ElLoadingMask = ({ isLazyLoad }) => {
    const [showBackdrop, setShowBackdrop] = useState(false);
    useEffect(() => {
        if (isLazyLoad) {
            return setTimeout(() => setShowBackdrop(true), 200);
        }
        setShowBackdrop(true);
    }, [isLazyLoad]);


    return (
        <>
            {
                showBackdrop &&
                <Container>
                    <LoadingAnimation>Load&nbsp;ng</LoadingAnimation>
                </Container>
            }
        </>
    );
};

export default ElLoadingMask;