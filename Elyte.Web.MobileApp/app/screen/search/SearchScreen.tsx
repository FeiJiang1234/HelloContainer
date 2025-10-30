import React, { useState, useEffect, useCallback } from 'react';
import { Box, FlatList, Input, Pressable } from 'native-base';
import { ElButton, ElContainer, ElFlatList, ElIcon, ElIdiograph } from 'el/components';
import colors from 'el/config/colors';
import homeService from 'el/api/homeService';
import { LinearGradient } from 'expo-linear-gradient';
import debounce from 'lodash/debounce';
import { ActivityIndicator, StyleSheet } from 'react-native';
import FilterSvg from 'el/svgs/filterSvg';
import { useProfileRoute } from 'el/utils';
import { OrganizationType } from 'el/enums';
import { ResponseResult } from 'el/models/responseResult';
import { PageResult } from 'el/models/pageResult';
import GoBack from 'el/svgs/goBack';
import HeaderBar from 'el/navigation/HeaderBar';
import defaultStyles from 'el/config/styles';
import { isPad } from 'el/config/constants';
import { useWindowDimensions } from 'react-native';

const tabs = [
    'Athletes',
    'Teams',
    'Events',
    'Facilities',
    'Leagues',
    'Tournaments',
    'Associations',
];

function SearchScreen({ navigation, route }) {
    const [keyword, setKeyword] = useState('');
    const [searchResult, setSearchResult] = useState<any[]>([]);
    const [searchType, setSearchType] = useState('');
    const [filterStatus, setFilterStatus] = useState(false);
    const [noMore, setNoMore] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);
    const pageSize = 10;
    const {height, width} = useWindowDimensions();
    const { goToProfile, goToTeamProfile, goToAthleteProfile, goToEventProfile } =
        useProfileRoute();

    useEffect(() => {
        if (keyword === '') return setSearchResult([]);

        searchDataFromService();
    }, [keyword]);

    const onChangeCallback = useCallback(v => setKeyword(v), [setKeyword]);

    const debounceCallback = useCallback(
        debounce(onChangeCallback, 300, {
            leading: false,
            trailing: true,
        }),
        [onChangeCallback],
    );

    const handleSearchBoxChanged = useCallback(v => debounceCallback(v), [debounceCallback]);

    const handleChangeFilterStatus = () => setFilterStatus(!filterStatus);

    const setOptions = () => {
        const parent = navigation.getParent();
        parent.setOptions({
            header: () => (
                <LinearGradient {...colors.linear} style={[styles.searchContainer, { 
                    paddingLeft: isPad && width >= height ? defaultStyles.layoutOffset : 16,
                    paddingRight: isPad && width >= height ? defaultStyles.layoutOffset : 16, 
                }]}>
                    <Pressable onPress={() => navigation.goBack()} mr={2} hitSlop={4}>
                        <GoBack width={isPad ? 24 : 18} height={isPad ? 22 : 16} />
                    </Pressable>
                    <Input
                        autoFocus
                        autoCapitalize="none"
                        autoCorrect={false}
                        flex={1}
                        bgColor={colors.light}
                        InputLeftElement={
                            <ElIcon name="magnify" size={6} style={{ marginLeft: 4 }} />
                        }
                        placeholder="Search"
                        onChangeText={handleSearchBoxChanged}
                    />
                    <Pressable onPress={handleChangeFilterStatus} ml={2} hitSlop={4}>
                        <FilterSvg stroke={filterStatus ? colors.secondary : undefined} />
                    </Pressable>
                </LinearGradient>
            ),
        });
    };

    useEffect(() => {
        const parent = navigation.getParent();
        navigation.addListener('focus', () => setOptions());

        navigation.addListener('blur', () =>
            parent.setOptions({
                header: props => <HeaderBar {...props} />,
            }),
        );
    }, []);

    useEffect(() => {
        setOptions();
    }, [filterStatus]);

    const searchDataFromService = async () => {
        const firstPage = 1;
        const res: ResponseResult<PageResult<any>> = await homeService.getData(
            firstPage,
            pageSize,
            filterStatus ? searchType : '',
            keyword,
        );
        if (res && res.code === 200) {
            setNoMore(false);
            setPageNumber(firstPage + 1);
            setSearchResult(res.value.items);
        }
    };

    const loadMore = async () => {
        const res: ResponseResult<PageResult<any>> = await homeService.getData(
            pageNumber,
            pageSize,
            filterStatus ? searchType : '',
            keyword,
        );
        if (res && res.code === 200) {
            if (res.value.items.length < pageSize) setNoMore(true);

            const itemIds = searchResult.map(item => item.id);
            const restItems = res.value.items.filter(x => itemIds.indexOf(x.id) === -1);
            setPageNumber(i => i + 1);
            setSearchResult(pre => [...pre, ...restItems]);
        }
    };

    const handleSearchContentClick = data => {
        switch (data.type) {
            case 'Athletes':
                goToAthleteProfile(data.id);
                break;
            case 'Teams':
                goToTeamProfile(data.id);
                break;
            case 'Events':
                goToEventProfile(data.id);
                break;
            case 'Facilities':
                goToProfile(OrganizationType.Facility, data.id);
                break;
            case 'Leagues':
                goToProfile(OrganizationType.League, data.id);
                break;
            case 'Tournaments':
                goToProfile(OrganizationType.Tournament, data.id);
                break;
            case 'Associations':
                goToProfile(OrganizationType.Association, data.id);
                break;
        }
    };

    const getItems = () => {
        if (!filterStatus || searchType === '') return searchResult;
        const itemsBySearchType = searchResult.filter(x => x.type === searchType);

        return itemsBySearchType;
    };

    return (
        <ElContainer h="100%">
            {filterStatus && (
                <Box my={2}>
                    <FlatList
                        data={tabs}
                        keyExtractor={p => p}
                        ItemSeparatorComponent={() => <Box w={2} />}
                        renderItem={({ item }) => (
                            <ElButton
                                onPress={() => setSearchType(item)}
                                size="sm"
                                variant={item !== searchType ? 'disabled' : 'contained'}>
                                {item}
                            </ElButton>
                        )}
                        horizontal={true}
                    />
                </Box>
            )}

            <Box flex={1}>
                <ElFlatList
                    my={4}
                    data={getItems()}
                    listEmptyText="No Search Result"
                    onEndReached={loadMore}
                    listFooterComponent={
                        noMore || searchResult.length === 0 ? null : (
                            <ActivityIndicator style={{ marginTop: 8, marginBottom: 8 }} />
                        )
                    }
                    renderItem={({ item }) => (
                        <ElIdiograph
                            onPress={() => handleSearchContentClick(item)}
                            title={item?.title}
                            subtitle={item.subtitle}
                            centerTitle={item?.centerTitle}
                            imageUrl={item.imageUrl}
                        />
                    )}
                />
            </Box>
        </ElContainer>
    );
}

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: defaultStyles.headerHight,
    },
});

export default SearchScreen;
