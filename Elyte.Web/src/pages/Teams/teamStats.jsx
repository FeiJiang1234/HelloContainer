import React, { useState, useEffect } from 'react';
import Chart from '../Athlete/chart';
import { Idiograph } from 'parts';
import { ElBox, ElButton, ElLinkBtn, ElSelect, ElSwitch } from 'components';
import { Box, Slider } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { basicChartStatsType, basketballTeamChartStatsType, GameOutcomes, soccerTeamChartStatsType, SportType, StatsRangeType } from 'enums';
import { teamService } from 'services';

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

const TeamStats = ({ team }) => {
    const classes = useStyles();
    const [statType, setStatType] = useState(GameOutcomes.Win);
    const [stats, setStats] = useState([]);
    const [rangeType, setRangeType] = useState(StatsRangeType.Days);
    const [range, setRange] = useState({});
    const [rangeValue, setRangeValue] = useState([0, 10]);
    const [marks, setMarks] = useState([]);
    const [isOfficial, setIsOfficial] = useState(true);

    useEffect(() => {
        getStatsRange();
    }, [rangeType]);

    useEffect(() => {
        handleSearchStats();
    }, [isOfficial]);

    const getStatsRange = async () => {
        const res = await teamService.getStatsRange(team.id, rangeType, team.sportType, isOfficial);
        if (res && res.code === 200) {
            setMarks([
                { value: res.value.min, label: res.value.min },
                { value: res.value.max, label: res.value.max },
            ]);
            setRange(res.value);
            searchStats(statType, rangeType);
        }
    };

    const handleRangeChange = (event, newValue) => setRangeValue(newValue);
    const handleChangeRangeType = value => setRangeType(value);

    const handleChangeStatType = value => {
        var selectedStatType = getStatTypes().find(x=>x.value === value);
        const selectedStatNotStatByGame = !selectedStatType?.byGames && rangeType === StatsRangeType.Games;
        const rangeTypeBy = selectedStatNotStatByGame ? StatsRangeType.Days : rangeType;

        setStatType(value);
        if (selectedStatNotStatByGame) {
            handleChangeRangeType(StatsRangeType.Days);
        }else{
            searchStats(value, rangeTypeBy);
        }
    }

    const handleSearchStats = async () => {
        await searchStats(statType, rangeType);
    };

    const searchStats = async (selectedStatType, selectedRangeType) => {
        var min = rangeValue[0];
        var max = rangeValue[1];

        const res = await getStatsService(selectedRangeType, min, max, selectedStatType);
        if (res && res.code === 200) setStats(res.value);
    };

    const getStatsService = (selectedRangeType, min, max, selectedStatType) => {
        const dividedParts = 10;
        if (team.sportType === SportType.Basketball)
            return teamService.getBasketballStatsByRange(team.id, selectedRangeType, min, max, selectedStatType, isOfficial, dividedParts);

        if (team.sportType === SportType.Soccer)
            return teamService.getSoccerStatsByRange(team.id, selectedRangeType, min, max, selectedStatType, isOfficial, dividedParts);

        return teamService.getLowSportStatsByRange(team.id, selectedRangeType, min, max, selectedStatType, isOfficial, dividedParts);    
    };

    const getStatTypes = () => {
        if(team.sportType === SportType.Basketball) return basketballTeamChartStatsType;
        if(team.sportType === SportType.Soccer) return soccerTeamChartStatsType;

        return basicChartStatsType;
    }

    const getTotalNumbers = () => {
        if(statType !== GameOutcomes.Win && statType !== GameOutcomes.Lose){
            var statTypeEnum = getStatTypes().find(x=>x.value === statType);
            return statTypeEnum.label;
        }
        
        var totalCount = stats.reduce((pre, cur) => pre + cur.stats, 0);
        if (totalCount > 1) return `${totalCount} ${statType}s`;
        return `${totalCount} ${statType}`;
    };

    const isStatsByGames = () => {
        var selectedStatType = getStatTypes().find(x=>x.value === statType);
        return selectedStatType?.byGames;
    };

    return (
        <>
            <ElBox centerCross mt={2} mb={2} justifyContent="space-between" >
                <Idiograph title={team.name} imgurl={team.imageUrl}></Idiograph>
                <ElLinkBtn large noPointer>{getTotalNumbers()}</ElLinkBtn>
            </ElBox >
            <ElSwitch fullWidth on="Official" off="Unofficial" isOn={isOfficial} toggle={()=>setIsOfficial(!isOfficial)}/>
            <Chart data={stats} xField="statRange" yField="stats" />
            <Box mt={2}>
                <ElSelect
                    label="Wins/Loses"
                    name="result"
                    value={statType}
                    onChange={e => handleChangeStatType(e.target.value)}
                    options={getStatTypes()}
                />
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
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
        </ >
    );
};

export default TeamStats;
