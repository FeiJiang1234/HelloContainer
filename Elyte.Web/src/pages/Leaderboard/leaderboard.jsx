import React, { useState, useEffect, useRef } from 'react';
import { ElTitle, ElSearchBox, ElTabs, ElSelect, ElButton } from 'components';
import { Box, Typography, Grid, Divider, Slider as MSlider } from '@mui/material';
import { styled } from '@mui/system';
import { useInfiniteScroll } from 'ahooks';
import { useForm } from "react-hook-form";
import { leaderboardService, dictionaryService } from 'services';
import { useProfileRoute } from 'utils';
import SportSelect from '../Athlete/sportSelect';
import Idiograph from 'parts/Commons/idiograph';
import { RegionCascader } from 'pageComponents';
import { StatsRangeType } from 'enums';


const Slider = styled(MSlider)(({ theme }) => {
    return {
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
    };
});

const ConditionLabel = styled(Typography)(({ theme }) => {
    return {
        height: theme.spacing(7),
        borderRadius: theme.spacing(1),
        background: '#F0F2F7',
        color: '#B0B8CB',
        lineHeight: theme.spacing(6),
        paddingLeft: theme.spacing(2)
    };
});

const Header = styled(Typography)(() => { return { color: '#B0B8CB', fontWeight: '500', fontSize: '13px' }; });

const tabs = ['Athletes', 'Teams'];

const DateTypeRange = [
    { value: StatsRangeType.Days, label: StatsRangeType.Days },
    { value: StatsRangeType.Months, label: StatsRangeType.Months },
    { value: StatsRangeType.Years, label: StatsRangeType.Years },
];

const Leaderboard = () => {
    const ref = useRef(null);
    const pageNumberRef = useRef(1);
    const pageSize = 20;
    const [filterStatus, setFilterStatus] = useState(false);
    const [keyword, setKeyword] = useState('');
    const [searchType, setSearchType] = useState('Athletes');
    const [sportType, setSportType] = useState('Basketball');
    const [condition, setCondition] = useState({ 
        sportType: sportType, 
        searchType: searchType, 
        keywords: keyword, 
        pageSize: pageSize, 
        pageNumber: pageNumberRef.current 
    });
    const { data, loadingMore, noMore } = useInfiniteScroll(() => getData(condition), { reloadDeps: [condition], target: ref, isNoMore: (data) => data?.hasMore });

    useEffect(() => {
        if (condition.keywords === keyword && condition.sportType === sportType && condition.searchType === searchType) return;

        pageNumberRef.current = 1;
        setCondition(() => { return { sportType: sportType, searchType: searchType, keywords: keyword } });
    }, [keyword, sportType, searchType]);

    const getData = async (condtion) => {
        condtion.pageNumber = pageNumberRef.current;
        condtion.pageSize = pageSize;
        const res = await leaderboardService.getData(condtion);
        if (res && res.code === 200) {
            pageNumberRef.current = pageNumberRef.current + 1;
            return { list: res.value.items, hasMore: res.value.items.length < pageSize };
        }
    }

    const handleSportChange = e => setSportType(e);

    const handleTabChange = (tab) => {
        setKeyword('');
        setSearchType(tab);
        setFilterStatus(false);
    };

    const handleSubmitClick = (formData) => {
        setFilterStatus(false);
        pageNumberRef.current = 1;
        setCondition((d) => { return { ...d, ...formData } });
    }


    return (
        <>
            <ElTitle center>Leaderboard</ElTitle>
            <ElSearchBox value={keyword} isShowFilter={true} filterDefaultStatus={filterStatus} onChange={setKeyword} onFilterButtonClick={() => setFilterStatus(!filterStatus)} />
            <SportSelect onTabclick={handleSportChange} />
            {filterStatus && <FilterConditionForm searchType={searchType} onSubmit={handleSubmitClick} />}

            <ElTabs tabs={tabs} tab={searchType} onTabChange={handleTabChange} />

            <Box mr={1} mb={1} mt={1} >
                <Grid container spacing={1}>
                    <Grid item xs={3}><Header>Rank</Header></Grid>
                    <Grid item xs={5}><Header>Name</Header></Grid>
                    <Grid item xs={4}><Header>Level</Header></Grid>
                </Grid>
                <Divider className="mt-8" />
            </Box>

            <Box ref={ref} className='scroll-container' sx={{ height: (theme) => `calc(100vh - ${theme.spacing(48)})` }}>
                {data?.list?.map((item) => <RankItem key={item.id} item={item} searchType={searchType} />)}
                {noMore && <Box display="flex" justifyContent="center">No more data</Box>}
                {!noMore && loadingMore && <Box display="flex" justifyContent="center">Loading more...</Box>}
            </Box>
        </>
    );
};

export default Leaderboard;

const FilterConditionForm = ({ searchType, onSubmit }) => {
    const { register, handleSubmit, } = useForm();
    const [dateRange, setDateRange] = useState([0, 0]);
    const [ageRange, setAgeRange] = useState([0, 0]);
    const [levelRange, setLevelRange] = useState([0, 0]);
    const [organizations, setOrganizations] = useState([]);

    useEffect(() => getOrganizations(), []);

    const getOrganizations = () => {
        dictionaryService.getOrganizations().then(x => {
            setOrganizations([{ label: 'None', value: '' }, ...x.value])
        });
    }

    const handleSaveClick = async (data) => {
        const minAge = ageRange[0] > ageRange[1] ? ageRange[1] : ageRange[0];
        const maxAge = ageRange[0] > ageRange[1] ? ageRange[0] : ageRange[1];

        const minLevel = levelRange[0] > levelRange[1] ? levelRange[1] : levelRange[0];
        const maxLevel = levelRange[0] > levelRange[0] ? levelRange[1] : levelRange[1];

        const minDateValue = dateRange[0] > dateRange[1] ? dateRange[1] : dateRange[0];
        const maxDateValue = dateRange[0] > dateRange[1] ? dateRange[0] : dateRange[1];

        let condition = {
            countryCode: data.country,
            stateCode: data.state,
            cityCode: data.city,
            minAge,
            maxAge,
            minLevel,
            maxLevel,
            dateRangeType: data.dateRangeType,
            minDateValue,
            maxDateValue,
            organizationId: data.organizationId
        };

        if (onSubmit) {
            onSubmit(condition);
        }
    };


    return (
        <form onSubmit={handleSubmit(handleSaveClick)} autoComplete="off">
            <RegionCascader register={register} isRequired={false} />
            <ElSelect label="Organozation" options={organizations} {...register("organizationId")} />
            <Grid container spacing={2} direction="row" justifyContent="flex-start" alignItems="center">
                {
                    searchType !== "Teams" &&
                    <>
                        <Grid item xs={4} sx={{ marginBottom: 1 }}><ConditionLabel>Age</ConditionLabel></Grid>
                        <Grid item xs={8}><Slider value={ageRange} min={0} max={99} valueLabelDisplay="on" onChange={(e, v) => setAgeRange(v)} /></Grid>

                        <Grid item xs={4}><ElSelect label="Range" {...register("dateRangeType", {})} options={DateTypeRange} defaultValue={DateTypeRange[0].value} /></Grid>
                        <Grid item xs={8}><Slider value={dateRange} min={0} max={31} valueLabelDisplay="on" onChange={(e, v) => setDateRange(v)} /></Grid>
                    </>
                }
                <Grid item xs={4} sx={{ marginBottom: 1 }}><ConditionLabel>Level</ConditionLabel></Grid>
                <Grid item xs={8}><Slider value={levelRange} min={0} max={99} valueLabelDisplay="on" onChange={(e, v) => setLevelRange(v)} /></Grid>
            </Grid>
            <ElButton mt={2} mb={2} type="submit">Search</ElButton>
        </form>
    );
}

const RankItem = ({ item, searchType }) => {
    const { athleteProfile, teamProfile } = useProfileRoute();

    const buildRankFontColor = (rank) => {
        if (rank === 1) return '#FFC024';
        if (rank === 2) return '#A2C4E8';
        if (rank === 3) return '#17C476';
        if (rank > 3) return '';
    }

    const buildIdiograph = (type, id) => {
        if (type === 'Athletes') return athleteProfile(id);
        if (type === 'Teams') return teamProfile(id);
    }
    return (
        <>
            <Grid container >
                <Grid item xs={1}>
                    <Typography mt={1.5} sx={{ color: buildRankFontColor(item.rank), fontSize: 15, fontWeight: 500, paddingLeft: 1.5 }}>{item.rank}</Typography>
                </Grid>
                <Grid item xs={10}>
                    <Idiograph title={item.name} to={buildIdiograph(searchType, item.id)} subtitle={item.subtitle} centerTitle={item.centerTitle} imgurl={item.avatarUrl} />
                </Grid>
                <Grid item xs={1}>
                    <Typography mt={1.5} sx={{ color: buildRankFontColor(item.rank), fontSize: 18, fontWeight: 600 }}>{item.points}</Typography>
                </Grid>
            </Grid>
            <Divider className="mt-16 mb-16" />
        </>
    );
}
