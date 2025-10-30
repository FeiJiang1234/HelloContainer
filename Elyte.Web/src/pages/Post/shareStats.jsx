import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ElButton, ElInput, ElForm, ElSelect, ElCheckbox } from 'components';
import { useForm } from 'react-hook-form';
import { postService, authService, athleteService } from 'services';
import { useHistory } from 'react-router';
import { SportTypes } from 'models';
import { SportType } from 'enums';

const useStyles = makeStyles(theme => ({
    stats: ({ isOfficial }) => {
        return {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            background: theme.bgPrimary,
            marginLeft: 16,
            borderRadius: 10,
            width: 140,
            height: 140,
            color: 'white',
            border: isOfficial ? `4px solid ${theme.palette.secondary.minor}` : '0px',
        };
    },
}));

const ShareStats = () => {
    const history = useHistory();
    const form = useForm();
    const user = authService.getCurrentUser();
    const { register, formState: { errors }, setValue } = form;
    const [sportStats, setSportStats] = useState([]);
    const [stats, setStats] = useState();
    const [isOfficial, setIsOfficial] = useState();
    const [selectedSport, setSelectedSport] = useState('');
    const classes = useStyles({ isOfficial: isOfficial });

    useEffect(() => {
        if (!selectedSport) return;

        getStats();
    }, [isOfficial, selectedSport]);

    const getStats = async () => {
        const res = await getStatsService(selectedSport);
        if (res && res.code === 200) {
            const allStats = res.value.map(x => ({ 
                value: x.fullStatsName, 
                label: x.fullStatsName, 
                stats: x.stats, 
                shortName: x.friendlyStatsName 
            }));
            setSportStats(allStats);

            const currentStats = allStats.find(x=>x.value === stats?.value);
            setStats(currentStats);
            if(!currentStats){
                setValue('statsType', '');
            }
        }
    };

    const getStatsService = sportType => {
        if (sportType === SportType.Basketball) {
            return athleteService.getBasketballStats(user.id, isOfficial);
        }
        if (sportType === SportType.Soccer) {
            return athleteService.getSoccerStats(user.id, isOfficial);
        }

        return athleteService.getLowSportStats(user.id, isOfficial, sportType);
    };

    const handleShareClick = async data => {
        const res = await postService.createPostStats({
            ...data,
            statsType: stats?.shortName,
            statsValue: stats?.stats,
            isOfficial: isOfficial,
        });
        if (res && res.code === 200) {
            history.push('/');
        }
    };

    const handleSportTypeChanged = e => {
        const sportType = e.target.value;
        setSelectedSport(sportType);
    };

    const handleStatsChanged = e => {
        const currentStat = sportStats.find(x => x.value === e.target.value);
        setStats(currentStat);
    };


    return (
        <ElForm form={form} onSubmit={handleShareClick}>
            <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Box flex={1}>
                    <ElSelect label="Choose a Sport" errors={errors} options={SportTypes} {...register('sportType', { required: 'This field is required.' })} onChange={handleSportTypeChanged} />
                    <ElSelect label="Choose a Stat" errors={errors} options={sportStats}  {...register('statsType', { required: 'This field is required.' })} onChange={handleStatsChanged} />
                    <ElCheckbox onChange={() => setIsOfficial(pre => !pre)} label={<Typography>Is Official</Typography>} sx={{ alignItems: 'center' }} />
                </Box>
                {
                    stats?.value &&
                    <Box className={classes.stats}>
                        <Typography>{stats?.shortName}</Typography>
                        <Typography sx={{ fontWeight: 'bold' }}>{stats?.stats}</Typography>
                    </Box>
                }
            </Box>
            <ElInput label="Say something" rows={6} multiline errors={errors} inputProps={{ maxLength: 250 }} {...register('details', { required: 'This field is required.' })} />
            <ElButton type="submit" fullWidth>Create a post</ElButton>
        </ElForm>
    );
};

export default ShareStats;
