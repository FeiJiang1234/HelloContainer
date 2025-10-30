import { leaderboardService } from 'el/api';
import dictionaryService from 'el/api/dictionaryService';
import {
    ElBody,
    ElButton,
    ElContainer,
    ElFlatList,
    ElIdiograph,
    ElInput,
    ElSearch,
    ElSelectEx,
    ElSlider,
    ElTitle,
    SportSelect,
} from 'el/components';
import { useFormik } from 'formik';
import RegionCascader from 'el/components/RegionCascader';
import { PageResult } from 'el/models/pageResult';
import { ResponseResult } from 'el/models/responseResult';
import FilterSvg from 'el/svgs/filterSvg';
import { Box, FlatList, Flex, Pressable, Row, ScrollView, Text } from 'native-base';
import React, { useState, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import colors from 'el/config/colors';
import { useDispatch } from 'react-redux';
import { ERROR, PENDING, SUCCESS } from 'el/store/slices/requestSlice';
import { StatsRangeType } from 'el/enums';
import { useProfileRoute } from 'el/utils';
const tabs = ['Athletes', 'Teams'];

export default function LeaderboardScreen() {
    const [filterStatus, setFilterStatus] = useState(false);
    const [keyword, setKeyword] = useState('');
    const [searchType, setSearchType] = useState('Athletes');
    const [sportType, setSportType] = useState('Basketball');
    const [data, setData] = useState<any>([]);
    const [noMore, setNoMore] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);
    const pageSize = 20;
    const dispatch = useDispatch();
    const [condition, setCondition] = useState({});
    const [organizations, setOrganizations] = useState<any[]>([]);

    useEffect(() => {
        getData();
        getOrganizations();
    }, []);

    useEffect(() => {
        getData();
    }, [keyword, sportType, searchType, condition]);

    const getData = async () => {
        dispatch(PENDING());
        const firstPage = 1;
        const res: ResponseResult<PageResult<any>> = await leaderboardService.getData({
            sportType: sportType,
            searchType: searchType,
            keywords: keyword,
            pageSize: pageSize,
            pageNumber: firstPage,
            ...condition,
        });

        if (res && res.code === 200) {
            dispatch(SUCCESS());
            setNoMore(false);
            setPageNumber(firstPage + 1);
            setData(res.value.items);
        } else {
            dispatch(ERROR());
        }
    };

    const loadMore = async () => {
        const res: ResponseResult<PageResult<any>> = await leaderboardService.getData({
            sportType: sportType,
            searchType: searchType,
            keywords: keyword,
            pageSize: pageSize,
            pageNumber: pageNumber,
            ...condition,
        });
        if (res && res.code === 200) {
            if (res.value.items.length < pageSize) setNoMore(true);

            const itemIds = data.map(item => item.id);
            const restItems = res.value.items.filter(x => itemIds.indexOf(x.id) === -1);

            setPageNumber(i => i + 1);
            setData(pre => [...pre, ...restItems]);
        }
    };

    const handleSubmitClick = formData => {
        setFilterStatus(false);
        setCondition({ ...formData });
    };

    const getOrganizations = async () => {
        const res: any = await dictionaryService.getOrganizations();
        setOrganizations([{ label: 'None', value: '' }, ...res.value]);
    };

    return (
        <ElContainer h="100%">
            <ElTitle>Leaderboard</ElTitle>
            <Row justifyContent="center" alignItems="center">
                <Box flex={1} mr={2}>
                    <ElSearch onKeywordChange={setKeyword} />
                </Box>
                <Pressable size={8} alignItems="center" justifyContent="center" onPress={() => setFilterStatus(pre => !pre)}>
                    <FilterSvg stroke={filterStatus ? colors.secondary : undefined} />
                </Pressable>
            </Row>
            <SportSelect sportType={sportType} onTabclick={setSportType} />
            {filterStatus && (
                <FilterConditionForm searchType={searchType} onSubmit={handleSubmitClick} organizations={organizations} />
            )}
            <Box mb={2}>
                <FlatList
                    data={tabs}
                    keyExtractor={p => p}
                    ItemSeparatorComponent={() => <Box w={2} />}
                    renderItem={({ item }) => (
                        <ElButton
                            onPress={() => setSearchType(item)}
                            variant={item !== searchType ? 'disabled' : 'contained'}
                            size="sm">
                            {item}
                        </ElButton>
                    )}
                    horizontal={true}
                />
            </Box>
            <Row>
                <Flex align="center" w={16}>
                    <ElBody>Rank</ElBody>
                </Flex>
                <Flex flex={1}>
                    <ElBody>Name</ElBody>
                </Flex>
                <Flex align="center" w={16}>
                    <ElBody>Level</ElBody>
                </Flex>
            </Row>
            <Box flex={1}>
                <ElFlatList
                    data={data}
                    listEmptyText="No Items"
                    onEndReached={loadMore}
                    listFooterComponent={
                        noMore || data.length === 0 ? null : (
                            <ActivityIndicator style={{ marginTop: 8, marginBottom: 8 }} />
                        )
                    }
                    renderItem={({ item }) => (
                        <RankItem key={item.id} item={item} searchType={searchType} />
                    )}
                />
            </Box>
        </ElContainer>
    );
}

const FilterConditionForm = ({ searchType, onSubmit, organizations }) => {
    const initValue = {
        dateRangeType: StatsRangeType.Days,

    };
    const { handleSubmit, errors, setFieldValue, values, touched } = useFormik({
        initialValues: initValue,
        onSubmit: values => handleSaveClick(values),
    });

    const [dateRange, setDateRange] = useState([0, 0]);
    const [ageRange, setAgeRange] = useState([0, 0]);
    const [levelRange, setLevelRange] = useState([0, 0]);

    const handleSaveClick = async data => {
        let condition = {
            countryCode: data.country,
            stateCode: data.state,
            cityCode: data.city,
            minAge: ageRange[0],
            maxAge: ageRange[1],
            minLevel: levelRange[0],
            maxLevel: levelRange[1],
            dateRangeType: data.dateRangeType,
            minDateValue: dateRange[0],
            maxDateValue: dateRange[1],
            organizationId: data.organizationId,
        };

        if (onSubmit) {
            onSubmit(condition);
        }
    };

    return (
        <ScrollView mb={2}>
            <RegionCascader
                setFieldValue={setFieldValue}
                touched={touched}
                errors={errors}
                values={values}
            />

            <ElSelectEx
                items={organizations}
                name="organizationId"
                onValueChange={value => setFieldValue('organizationId', value)}
                placeholder="Organization"
            />

            {searchType !== 'Teams' && (
                <>
                    <ElInput placeholder="Age" editable={false} />
                    <ElSlider
                        mx={4}
                        my={4}
                        flex={1}
                        value={ageRange}
                        min={0}
                        max={99}
                        onChange={setAgeRange}
                        hideRange
                    />
                    <ElSelectEx
                        defaultValue={values.dateRangeType}
                        name="dateRangeType"
                        placeholder="Range"
                        onValueChange={value => setFieldValue('dateRangeType', value)}
                        items={[
                            { value: StatsRangeType.Days, label: StatsRangeType.Days },
                            { value: StatsRangeType.Months, label: StatsRangeType.Months },
                            { value: StatsRangeType.Years, label: StatsRangeType.Years },
                        ]}
                    />
                    <ElSlider
                        mx={4}
                        my={4}
                        flex={1}
                        value={dateRange}
                        min={0}
                        max={31}
                        onChange={setDateRange}
                        hideRange
                    />
                </>
            )}

            <ElInput placeholder="Level" editable={false} />
            <ElSlider
                mx={4}
                my={4}
                flex={1}
                value={levelRange}
                min={0}
                max={99}
                onChange={setLevelRange}
                hideRange
            />
            <ElButton onPress={handleSubmit}>Search</ElButton>
        </ScrollView>
    );
};

const RankItem = ({ item, searchType }) => {
    const { goToAthleteProfile, goToTeamProfile } = useProfileRoute();

    const buildRankFontColor = rank => {
        if (rank === 1) return '#FFC024';
        if (rank === 2) return '#A2C4E8';
        if (rank === 3) return '#17C476';
        if (rank > 3) return '';
    };

    const buildIdiograph = id => {
        if (searchType === 'Athletes') return goToAthleteProfile(id);
        if (searchType === 'Teams') return goToTeamProfile(id);
    };

    return (
        <Row flex={1}>
            <Flex align="center" justify="center" w={16}>
                <Text color={buildRankFontColor(item.rank)}>{item.rank}</Text>
            </Flex>
            <Box flex={1} overflow="hidden">
                <ElIdiograph
                    onPress={() => buildIdiograph(item.id)}
                    title={item.name}
                    subtitle={item.subtitle}
                    centerTitle={item.centerTitle}
                    imageUrl={item.avatarUrl}
                />
            </Box>
            <Flex align="center" justify="center" w={16}>
                <Text color={buildRankFontColor(item.points)}>{item.points}</Text>
            </Flex>
        </Row>
    );
};
