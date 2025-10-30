import React, { useState, useEffect } from 'react';
import {
    basicChartStatsType,
    basketballChartStatsType,
    GameOutcomes,
    soccerChartStatsType,
    SportType,
    StatsRangeType,
} from 'el/enums';
import { athleteService } from 'el/api';
import { Box, Flex, HStack, Text } from 'native-base';
import { ElAvatar, ElButton, ElLinkBtn, ElSelectEx, ElSlider, ElSwitch } from 'el/components';
import Chart from './Chart';
import ElAddress from 'el/components/ElAddress';
import GameField from './GameField';
import * as Device from 'expo-device';

export default function ProfileStats({
    athleteId,
    sportType,
    pictureUrl,
    firstName,
    lastName,
    state,
    city,
}) {
    const [rangeType, setRangeType] = useState(StatsRangeType.Days);
    const [isOfficial, setIsOfficial] = useState(true);
    const [range, setRange] = useState<any>({});
    const [rangeValue, setRangeValue] = useState<any>([0, 3]);
    const [shots, setShots] = useState([]);
    const [stats, setStats] = useState([]);
    const [statType, setStatType] = useState(GameOutcomes.Win);
    const [isShotMaps, setIsShotMaps] = useState(false);

    useEffect(() => {
        getStatsRange();
    }, [rangeType]);

    useEffect(() => {
        handleSearchStats();
    }, [sportType, isOfficial]);

    const getStatsRange = async () => {
        const res: any = await athleteService.getStatsRange(athleteId, rangeType, sportType, isOfficial);
        if (res && res.code === 200) {
            setRange(res.value);
            searchStats(statType, rangeType, isShotMaps);
        }
    };

    const handleChangeRangeType = value => setRangeType(value);

    const handleChangeStatType = value => {
        var selectedStatType = getStatTypes().find(x => x.value === value);
        const selectedStatNotStatByGame =
            !selectedStatType?.byGames && rangeType === StatsRangeType.Games;
        const rangeTypeBy = selectedStatNotStatByGame ? StatsRangeType.Days : rangeType;

        setStatType(value);
        const isChangeToShotMaps = value === 'Shot Maps';
        setIsShotMaps(isChangeToShotMaps);

        if (selectedStatNotStatByGame) {
            handleChangeRangeType(StatsRangeType.Days);
        } else {
            searchStats(value, rangeTypeBy, isChangeToShotMaps);
        }
    };

    const handleSearchStats = async () => {
        var isStatTypeExistWhenSwitchSportType = getStatTypes().find(x => x.value === statType);
        if (!isStatTypeExistWhenSwitchSportType) {
            handleChangeStatType(getStatTypes()[0].value);
        } else {
            await searchStats(statType, rangeType, isShotMaps);
        }
    };

    const searchStats = async (selectedStatType, selectedRangeType, isShotMapsParam) => {
        const min = rangeValue[0];
        const max = rangeValue[1];

        if (isShotMapsParam) {
            const res: any = await getShotMapsService(selectedRangeType, min, max);
            if (res && res.code === 200) {
                setShots(res.value);
            }
        }

        if (!isShotMapsParam) {
            const res: any = await getStatsService(selectedRangeType, min, max, selectedStatType);
            if (res && res.code === 200) setStats(res.value);
        }
    };

    const getStatTypes = () => {
        if (sportType === SportType.Basketball) return basketballChartStatsType;
        if (sportType === SportType.Soccer) return soccerChartStatsType;

        return basicChartStatsType;
    };

    const getTotalNumbers = () => {
        if (statType !== GameOutcomes.Win && statType !== GameOutcomes.Lose) {
            var statTypeEnum = getStatTypes().find(x => x.value === statType);
            return statTypeEnum ? statTypeEnum.label : getStatTypes()[0].label;
        }

        const totalCount = stats.reduce((pre: any, cur: any) => pre + cur.stats, 0);
        if (totalCount > 1) return `${totalCount} ${statType}s`;
        return `${totalCount} ${statType}`;
    };

    const getShotMapsService = (selectedRangeType, min, max) => {
        if (sportType === SportType.Basketball)
            return athleteService.getBasketballShotMaps(
                athleteId,
                selectedRangeType,
                min,
                max,
                isOfficial,
            );
        if (sportType === SportType.Soccer)
            return athleteService.getSoccerShotMaps(athleteId, selectedRangeType, min, max, isOfficial);
    };

    const getStatsService = async (type, min, max, selectedStatType) => {
        const deviceType = await Device.getDeviceTypeAsync();
        var dividedParts = deviceType === Device.DeviceType.PHONE ? 4 : 8;

        if (sportType === SportType.Basketball)
            return athleteService.getBasketballStatsByRange(
                athleteId, type, min, max, selectedStatType, isOfficial, dividedParts
            );
        if (sportType === SportType.Soccer)
            return athleteService.getSoccerStatsByRange(
                athleteId, type, min, max, selectedStatType, isOfficial, dividedParts
            );

        return athleteService.getLowSportStatsByRange(athleteId, type, min, max, selectedStatType, isOfficial, dividedParts, sportType);    
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
                        <Text>{`${firstName} ${lastName}`}</Text>
                        <ElAddress state={state} city={city} hideFlag />
                    </Box>
                    {!isShotMaps && <ElLinkBtn>{getTotalNumbers()}</ElLinkBtn>}
                </HStack>
            </Box>
            <ElSwitch fullWidth flex={1} value={isOfficial} onToggle={setIsOfficial} my={1} textOn='Official' textOff='Unofficial' />
            <Box my={2}>
                {!isShotMaps && <Chart data={stats} x="statRange" y="stats" />}
                {isShotMaps && <GameField sportType={sportType} shots={shots} />}
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
