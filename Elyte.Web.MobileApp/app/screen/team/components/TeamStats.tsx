import React, { useState, useEffect } from 'react';
import {
    basicChartStatsType,
    basketballTeamChartStatsType,
    GameOutcomes,
    soccerTeamChartStatsType,
    SportType,
    StatsRangeType,
} from 'el/enums';
import { teamService } from 'el/api';
import { ElAvatar, ElButton, ElLinkBtn, ElSelectEx, ElSlider, ElSwitch } from 'el/components';
import Chart from 'el/screen/accountInfo/components/Chart';
import ElAddress from 'el/components/ElAddress';
import { Box, Flex, HStack, Text } from 'native-base';
import * as Device from 'expo-device';

export default function TeamStats({ id, sportType, pictureUrl, name, state, city }) {
    const [statType, setStatType] = useState(GameOutcomes.Win);
    const [stats, setStats] = useState([]);
    const [rangeType, setRangeType] = useState(StatsRangeType.Days);
    const [range, setRange] = useState<any>({});
    const [rangeValue, setRangeValue] = useState<any>([0, 3]);
    const [isOfficial, setIsOfficial] = useState(true);

    useEffect(() => {
        getStatsRange();
    }, [rangeType]);

    useEffect(() => {
        handleSearchStats();
    }, [isOfficial]);

    const getStatsRange = async () => {
        const res: any = await teamService.getStatsRange(id, rangeType, sportType, isOfficial);
        if (res && res.code === 200) {
            setRange(res.value);
            searchStats(statType, rangeType);
        }
    };

    const handleChangeRangeType = value => setRangeType(value);

    const handleChangeStatType = value => {
        var selectedStatType = getStatTypes().find(x => x.value === value);
        const selectedStatNotStatByGame =
            !selectedStatType?.byGames && rangeType === StatsRangeType.Games;
        const rangeTypeBy = selectedStatNotStatByGame ? StatsRangeType.Days : rangeType;

        setStatType(value);
        if (selectedStatNotStatByGame) {
            handleChangeRangeType(StatsRangeType.Days);
        } else {
            searchStats(value, rangeTypeBy);
        }
    };

    const handleSearchStats = async () => {
        await searchStats(statType, rangeType);
    };

    const searchStats = async (selectedStatType, selectedRangeType) => {
        var min = rangeValue[0];
        var max = rangeValue[1];

        const res: any = await getStatsService(selectedRangeType, min, max, selectedStatType);
        if (res && res.code === 200) setStats(res.value);
    };

    const getStatsService = async (selectedRangeType, min, max, selectedStatType) => {
        const deviceType = await Device.getDeviceTypeAsync();
        var dividedParts = deviceType === Device.DeviceType.PHONE ? 4 : 8;

        if (sportType === SportType.Basketball)
            return teamService.getBasketballStatsByRange(
                id,
                selectedRangeType,
                min,
                max,
                selectedStatType,
                isOfficial,
                dividedParts
            );
        if (sportType === SportType.Soccer)
            return teamService.getSoccerStatsByRange(
                id,
                selectedRangeType,
                min,
                max,
                selectedStatType,
                isOfficial,
                dividedParts
            );

        return teamService.getLowSportStatsByRange(id, selectedRangeType, min, max, selectedStatType, isOfficial, dividedParts);        
    };

    const getStatTypes = () => {
        if (sportType === SportType.Basketball) return basketballTeamChartStatsType;
        if (sportType === SportType.Soccer) return soccerTeamChartStatsType;

        return basicChartStatsType;
    };

    const getTotalNumbers = () => {
        if (statType !== GameOutcomes.Win && statType !== GameOutcomes.Lose) {
            var statTypeEnum = getStatTypes().find(x => x.value === statType);
            return statTypeEnum ? statTypeEnum.label : getStatTypes()[0].label;
        }

        var totalCount = stats.reduce((pre: any, cur: any) => pre + cur.stats, 0);
        if (totalCount > 1) return `${totalCount} ${statType}s`;
        return `${totalCount} ${statType}`;
    };

    const isStatsByGames = () => {
        var selectedStatType = getStatTypes().find(x => x.value === statType);
        return selectedStatType?.byGames;
    };

    return (
        <>
            <Box mt={2} mb={2} justifyContent="space-between">
                <HStack my="2" space={1}>
                    <ElAvatar uri={pictureUrl} size={36} />
                    <Box flex={1}>
                        <Text>{name}</Text>
                        <ElAddress state={state} city={city} hideFlag />
                    </Box>
                    <ElLinkBtn>{getTotalNumbers()}</ElLinkBtn>
                </HStack>
            </Box>
            <ElSwitch fullWidth flex={1} value={isOfficial} onToggle={setIsOfficial} my={1} textOn='Official' textOff='Unofficial' />
            <Box my={2}>
                <Chart data={stats} x="statRange" y="stats" />
            </Box>
            <ElSelectEx
                placeholder="Wins/Loses"
                defaultValue={statType}
                onValueChange={value => handleChangeStatType(value)}
                items={getStatTypes()}
            />
            <Flex direction="row" align="center">
                <Box flex={1}>
                    <ElSelectEx
                        placeholder="Range"
                        defaultValue={rangeType}
                        onValueChange={value => handleChangeRangeType(value)}
                        items={[
                            { value: StatsRangeType.Days, label: StatsRangeType.Days },
                            { value: StatsRangeType.Months, label: StatsRangeType.Months },
                            { value: StatsRangeType.Years, label: StatsRangeType.Years },
                            ...(isStatsByGames()
                                ? [{ value: StatsRangeType.Games, label: StatsRangeType.Games }]
                                : []),
                        ]}
                    />
                </Box>
            </Flex>

            <ElSlider
                mx={4}
                mt={4}
                mb={2}
                value={rangeValue}
                min={range.min}
                max={range.max}
                onChange={setRangeValue}
            />
            <ElButton onPress={handleSearchStats}>Search</ElButton>
        </>
    );
}
