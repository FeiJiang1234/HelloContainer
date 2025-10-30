import React, { useState, useEffect } from 'react';
import Chart from './chart';
import { Idiograph } from 'parts';
import { ElBox, ElButton, ElLinkBtn, ElSelect, ElSwitch } from 'components';
import { Box, Slider } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useProfileRoute } from 'utils';
import { basicChartStatsType, basketballChartStatsType, GameOutcomes, soccerChartStatsType, SportType, StatsRangeType } from 'enums';
import { athleteService } from 'services';
import GameField from '../Game/gameField';

const useStyles = makeStyles(theme => ({
    slider: {
        '& .MuiSlider-valueLabel': {
            top: 0,
            background: 'none',
            color: theme.palette.primary.main,
        },
        '& .MuiSlider-track': {
            border: 0,
            background: 'none',
        },
        '& .MuiSlider-thumbColorPrimary': {
            background: '#fff',
            border: `3px solid ${theme.palette.secondary.minor}`,
        },
        '& .MuiSlider-mark': {
            width: 0,
        },
    },
}));

const ProfileStats = ({ user, sportType }) => {
    const classes = useStyles();
    const [statType, setStatType] = useState(GameOutcomes.Win);
    const [stats, setStats] = useState([]);
    const [rangeType, setRangeType] = useState(StatsRangeType.Days);
    const [range, setRange] = useState({});
    const [rangeValue, setRangeValue] = useState([0, 10]);
    const [marks, setMarks] = useState([]);
    const [shots, setShots] = useState([]);
    const [isShotMaps, setIsShotMaps] = useState(false);
    const { athleteProfile } = useProfileRoute();
    const [isOfficial, setIsOfficial] = useState(true);

    useEffect(() => {
        getStatsRange();
    }, [rangeType]);

    useEffect(() => {
        handleSearchStats();
    }, [sportType, isOfficial]);

    const getStatsRange = async () => {
        const res = await athleteService.getStatsRange(user.id, rangeType, sportType, isOfficial);
        if (res && res.code === 200) {
            setMarks([
                { value: res.value.min, label: res.value.min },
                { value: res.value.max, label: res.value.max },
            ]);
            setRange(res.value);
            searchStats(statType, rangeType, isShotMaps);
        }
    };

    const handleRangeChange = (event, newValue) => setRangeValue(newValue);
    const handleChangeRangeType = value => setRangeType(value);

    const handleChangeStatType = value => {
        var selectedStatType = getStatTypes().find(x=>x.value === value);
        const selectedStatNotStatByGame = !selectedStatType?.byGames && rangeType === StatsRangeType.Games;
        const rangeTypeBy = selectedStatNotStatByGame ? StatsRangeType.Days : rangeType;

        setStatType(value);
        const isChangeToShotMaps = value === 'Shot Maps';
        setIsShotMaps(isChangeToShotMaps);

        if (selectedStatNotStatByGame) {
            handleChangeRangeType(StatsRangeType.Days);
        }else{
            searchStats(value, rangeTypeBy, isChangeToShotMaps);
        }
    };

    const handleSearchStats = async () => {
        var isStatTypeExistWhenSwitchSportType = getStatTypes().find(x=>x.value === statType);
        if(!isStatTypeExistWhenSwitchSportType){
            handleChangeStatType(getStatTypes()[0].value);
        }else{
            await searchStats(statType, rangeType, isShotMaps);
        }
    };

    const searchStats = async (selectedStatType, selectedRangeType, isShotMapsParam) => {
        const min = rangeValue[0];
        const max = rangeValue[1];

        if (isShotMapsParam) {
            const res = await getShotMapsService(selectedRangeType, min, max);
            if (res && res.code === 200) setShots(res.value);
        }

        if (!isShotMapsParam) {
            const res = await getStatsService(selectedRangeType, min, max, selectedStatType);
            if (res && res.code === 200) setStats(res.value);
        }
    };

    const getStatTypes = () => {
        if(sportType === SportType.Basketball) return basketballChartStatsType;
        if(sportType === SportType.Soccer) return soccerChartStatsType;

        return basicChartStatsType;
    }

    const getTotalNumbers = () => {
        if(statType !== GameOutcomes.Win && statType !== GameOutcomes.Lose){
            var statTypeEnum = getStatTypes().find(x=>x.value === statType);
            return statTypeEnum ? statTypeEnum.label : getStatTypes()[0].label;
        }

        const totalCount = stats.reduce((pre, cur) => pre + cur.stats, 0);
        if (totalCount > 1) return `${totalCount} ${statType}s`;
        return `${totalCount} ${statType}`;
    };

    const getShotMapsService = (selectedRangeType, min, max) => {
        if (sportType === SportType.Basketball)
            return athleteService.getBasketballShotMaps(user.id, selectedRangeType, min, max, isOfficial);
        if (sportType === SportType.Soccer)
            return athleteService.getSoccerShotMaps(user.id, selectedRangeType, min, max, isOfficial);
    };

    const getStatsService = (type, min, max, selectedStatType) => {
        var dividedParts = 10;
        if (sportType === SportType.Basketball)
            return athleteService.getBasketballStatsByRange(user.id, type, min, max, selectedStatType, isOfficial, dividedParts);

        if (sportType === SportType.Soccer)
            return athleteService.getSoccerStatsByRange(user.id, type, min, max, selectedStatType, isOfficial, dividedParts);

        return athleteService.getLowSportStatsByRange(user.id, type, min, max, selectedStatType, isOfficial, dividedParts, sportType);    
    };

    const isStatsByGames = () => {
        var selectedStatType = getStatTypes().find(x=>x.value === statType);
        return selectedStatType?.byGames;
    };

    return (
        <>
            <ElBox centerCross mt={2} mb={2} justifyContent="space-between">
                <Idiograph
                    to={athleteProfile(user.id)}
                    title={`${user.firstName} ${user.lastName}`}
                    imgurl={user.pictureUrl}></Idiograph>
                {!isShotMaps && (
                    <ElLinkBtn large noPointer>
                        {getTotalNumbers()}
                    </ElLinkBtn>
                )}
            </ElBox>
            <ElSwitch fullWidth on="Official" off="Unofficial" isOn={isOfficial} toggle={()=>setIsOfficial(!isOfficial)}/>
            {!isShotMaps && <Chart data={stats} xField="statRange" yField="stats" />}
            {isShotMaps && <GameField sportType={sportType} shots={shots} />}
            <Box mt={2}>
                <ElSelect
                    label="Wins/Loses"
                    name="result"
                    value={statType}
                    onChange={e => handleChangeStatType(e.target.value)}
                    options={getStatTypes()}
                />
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 2,
                    }}>
                    <ElSelect
                        label="Range"
                        name="range"
                        sx={{ width: 112 }}
                        value={rangeType}
                        onChange={e => handleChangeRangeType(e.target.value)}
                        options={[
                            { value: StatsRangeType.Days, label: StatsRangeType.Days },
                            { value: StatsRangeType.Months, label: StatsRangeType.Months },
                            { value: StatsRangeType.Years, label: StatsRangeType.Years },
                            ...(isStatsByGames()
                                ? [{ value: StatsRangeType.Games, label: StatsRangeType.Games }]
                                : []),
                        ]}
                    />
                    <Slider
                        className={classes.slider}
                        value={rangeValue}
                        marks={marks}
                        min={range.min}
                        max={range.max}
                        valueLabelDisplay="on"
                        onChange={handleRangeChange}
                    />
                </Box>
                <ElButton onClick={handleSearchStats}>Search</ElButton>
            </Box>
        </>
    );
};

export default ProfileStats;
