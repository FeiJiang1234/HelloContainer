import { useEffect } from 'react';
import { styled } from '@mui/system';
import { Box, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import React, { useState } from 'react';
import { ElButton, ElDialog } from 'components';

const Container = styled(Box)(() => {
    return {
        marginTop: 8,
        display: 'grid',
        gap: 8,
        gridTemplateColumns: 'repeat(4, 1fr)',
        gridTemplateRows: 'repeat(2, 1fr)',
    };
});

const Item = styled(Box)(({ theme, main, viewer }) => ({
    ...({
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        background: theme.bgPrimary,
        borderRadius: 10,
        '&:before': { content: '""', display: 'block', paddingTop: '100%' },

        '& .stats-type': { fontSize: 16, color: '#fff' },
        '& .stats': { fontSize: 19, color: '#fff', fontWeight: 'bold' }
    }),
    ...(!main && !viewer && {
        cursor: 'pointer'
    }),
    ...(main && {
        '& .stats': { fontSize: 30, color: '#fff', fontWeight: 'bold' },
        gridColumn: '3 / 5',
        gridRow: '1 / 3'
    })
}));

const Stats = styled(Box)(() => {
    return {
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    };
});

const StatsRadio = styled(FormControlLabel)(() => {
    return {
        position: 'relative',
        cursor: 'pointer',
        marginLeft: 0,
        marginRight: 0,
        background: '#F0F2F7',
        borderRadius: 10,
        marginBottom: 8,
        minHeight: 56,
        paddingLeft: 16,
        '& .MuiRadio-root': {
            position: 'absolute',
            right: 8
        }
    };
});

export default function AthleteStats ({ stats, onChangeStats, viewer }) {
    const [isSaveDisabled, setIsSaveDisabled] = useState(true);
    const [isShowChangeStatsDialog, setIsShowChangeStatsDialog] = useState(false);
    const [unshownStats, setUnshownStats] = useState([]);
    const [data, setData] = useState({});
    const [mainStats, setMainStats] = useState();
    const [defaultShowStats, setDefaultShowStats] = useState();

    useEffect(() => {
        if (Array.isNullOrEmpty(stats)) return;

        setMainStats(stats.find(x => x.isMain));
        setDefaultShowStats(stats.filter(x => !x.isMain && x.isDisplay));
        setUnshownStats(stats.filter(x => !x.isMain && !x.isDisplay));
    }, []);

    const handleChange = (e) => {
        setIsSaveDisabled(false);
        setData(state => ({ ...state, statsName: e.target.value }));
    }

    const handleClickStats = (id, order, isMain) => {
        if (viewer) return;
        setData({ id, order, isMain, statsName: '' });
        setIsShowChangeStatsDialog(true);
    }

    const handleSaveChange = async () => {
        const res = await onChangeStats(data);
        if (res && res.code === 200) setIsShowChangeStatsDialog(false);
    }

    const handleOnClose = async () => {
        setIsShowChangeStatsDialog(false);
        setIsSaveDisabled(true);
    }

    return (
        <Container>
            {
                !Array.isNullOrEmpty(defaultShowStats) && defaultShowStats.map((x, index) =>
                    <Item key={x.id} onClick={() => handleClickStats(x.id, index + 1, false)} viewer={viewer}>
                        <Stats>
                            <Box className='stats-type'>{x.friendlyStatsName}</Box>
                            <Box className='stats'>{x.stats}</Box>
                        </Stats>
                    </Item>
                )
            }
            {
                mainStats &&
                <Item main onClick={() => handleClickStats(mainStats.id, 1, true)} viewer={viewer}>
                    <Stats>
                        <Box className='stats-type'>{mainStats.friendlyStatsName}</Box>
                        <Box className='stats'>{mainStats.stats}</Box>
                    </Stats>
                </Item>
            }
            {
                !Array.isNullOrEmpty(unshownStats) &&
                <ElDialog open={isShowChangeStatsDialog} onClose={handleOnClose} title="Update Stats"
                    actions={<ElButton disabled={isSaveDisabled} onClick={handleSaveChange}>Save</ElButton>}>
                    <Box className='scroll-container' sx={{ maxHeight: (theme) => `calc(100vh - ${theme.spacing(70)})` }}>
                        <RadioGroup name="stats" value={data.fullStatsName} onChange={handleChange}>
                            {unshownStats.map(x => <StatsRadio key={x.id} value={x.fullStatsName} label={`${x.fullStatsName} (${x.stats})`} control={<Radio color="primary" />} />)}
                        </RadioGroup>
                    </Box>
                </ElDialog>
            }
        </Container>
    );
}
