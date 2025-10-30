import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/system';

const RootContainer = styled(Box)(() => { return { height: '28px', flex: 1, maxHeight: '28px', display: 'flex' }; });

const Level = styled(Box)(({ theme }) => {
    return {
        background: theme.bgPrimary,
        borderTopLeftRadius: '14px',
        borderBottomLeftRadius: '14px',
        width: '38px',
        height: '100%',
        display: 'grid',
        placeItems: 'center',
        fontSize: '14px',
        color: '#fff',
        fontWeight: '700'
    };
});

const TotalProgressBar = styled(Box)(() => {
    return {
        flex: 1,
        borderTopRightRadius: '14px',
        borderBottomRightRadius: '14px',
        background: '#F0F2F7',
        height: '100%'
    };
});

const CurrentProgressBar = styled(Box)(() => {
    return {
        borderTopRightRadius: '14px',
        borderBottomRightRadius: '14px',
        background: 'linear-gradient(218.2deg, rgba(90, 145, 253, 0.102194) 28.64%, rgba(0, 39, 123, 0.497391) 126.64%)',
        height: '100%',
        width: '80%',
        display: 'flex',
        alignItems: 'center',
    };
});

const StatFont = styled(Typography)(() => { return { fontSize: '14px', color: '#fff', fontWeight: '500', marginLeft: '16px', textShadow: '0 0 4px #000000' }; });

export default function LevelBar ({ level, currentExperience, nextLevelExperience, ...rest }) {
    currentExperience = Math.floor(parseFloat(currentExperience) ? parseFloat(currentExperience) : 0);
    nextLevelExperience = Math.floor(parseFloat(nextLevelExperience) ? parseFloat(nextLevelExperience) : 49);
    return (
        <RootContainer {...rest}>
            <Level>{level}</Level>
            <TotalProgressBar>
                <CurrentProgressBar style={{ width: (currentExperience / nextLevelExperience) * 100 + '%' }}>
                    <StatFont>{`${currentExperience}/${nextLevelExperience}`}</StatFont>
                </CurrentProgressBar>
            </TotalProgressBar>
        </RootContainer>
    );
}
