import React, { useState, useEffect } from 'react';
import { Box, AppBar, Toolbar, IconButton } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ElSvgIcon, ElTabs, ElSearchBox, ElButton, ElDialog } from 'components';
import SearchContent from './searchContent';
import { athleteService, authService, homeService } from 'services';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles(theme => {
    return {
        root: {
            '& .MuiToolbar-gutters': {
                paddingLeft: 0,
                paddingRight: 0,
            },
        },
        tip: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        container: {
            padding: 0,
            display: 'flex'
        },
        toolbar: theme.mixins.toolbar,
        backArrow: {
            width: '26px',
            height: '20px',
            stroke: '#fff',
            transform: 'rotate(180deg)',
            marginRight: theme.spacing(1),
        },
        search: {
            paddingTop: theme.spacing(0.5),
            paddingBottom: theme.spacing(0.5),
            paddingLeft: theme.spacing(2),
            height: 40,
            width: '100%',
            "&>div": {
                backgroundColor: 'rgba(255,255,255,0.1)',
            },
            "& input": {
                color: theme.palette.body.light,
            }
        },
        searchContent: {
            maxWidth: theme.breakpoints.values.sm
        },
        toolbarWidth: {
            width: theme.breakpoints.values.sm
        },
        toolbarContent: {
            justifyContent: 'center'
        },
    };
});

const tabs = ['Athletes', 'Teams', 'Events', 'Facilities', 'Leagues', 'Tournaments', 'Associations'];

function Search () {
    const classes = useStyles();
    const user = authService.getCurrentUser();
    const history = useHistory();
    const [keyword, setKeyword] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [searchType, setSearchType] = useState('');
    const [filterStatus, setFilterStatus] = useState(false);
    const [openConfirmDiolog, setOpenConfirmDiolog] = useState(false);
    const [blockedAthleteId, setBlockedAthleteId] = useState();

    useEffect(() => {
        if (String.isNullOrEmpty(keyword)) return setSearchResult([]);

        searchDataFromService();
    }, [keyword]);

    useEffect(() => {
        setSearchType(filterStatus ? tabs[0] : '');
        setKeyword('');
        setSearchResult([]);
    }, [filterStatus]);

    const searchDataFromService = async () => {
        setSearchResult([]);
        const res = await homeService.getData(searchType, keyword);
        if (res && res.code === 200 && res.value.length > 0) {
            setSearchResult(res.value);
        }
    }

    const handleTabChange = (tab) => {
        setSearchResult([]);
        setKeyword('');
        setSearchType(tab);
    };

    const handleUnblockClick = async (athleteId) => {
        setOpenConfirmDiolog(true);
        setBlockedAthleteId(athleteId);
    }

    const handleYesClick = async () => {
        const res = await athleteService.unblockAthlete(user.id, blockedAthleteId);
        if (res && res.code === 200) {
            setOpenConfirmDiolog(false);
            searchDataFromService();
        }
    }

    const handleSearchContentClick = (data) => {
        switch (data.type) {
            case 'Athletes':
                history.push('/myProfile', { params: data.id });
                break;
            case 'Teams':
                history.push('/teamProfile', { params: data.id });
                break;
            case 'Events':
                history.push('/eventProfile', { params: data.id });
                break;
            case 'Facilities':
                history.push('/facilityProfile', { params: data.id });
                break;
            case 'Leagues':
                history.push('/leagueProfile', { params: data.id });
                break;
            case 'Tournaments':
                history.push('/tournamentProfile', { params: data.id });
                break;
            case 'Associations':
                history.push('/associationProfile', { params: data.id });
                break;
        }
    }

    return (
        <>
            <AppBar elevation={0} className={classes.root}>
                <Toolbar className={classes.toolbarContent}>
                    <Box display="flex" justifyContent="space-around" className={classes.toolbarWidth}>
                        <IconButton onClick={() => { history.goBack(); }}>
                            <ElSvgIcon xSmall name="backArrow" />
                        </IconButton>
                        <ElSearchBox
                            value={keyword}
                            className={classes.search}
                            isShowFilter={true}
                            filterDefaultStatus={filterStatus}
                            onChange={setKeyword}
                            onFilterButtonClick={() => { setFilterStatus(!filterStatus) }}
                        />
                    </Box>
                </Toolbar>
            </AppBar>

            <Box className={classes.searchContent}>
                {filterStatus && <ElTabs tabs={tabs} tab={searchType} onTabChange={handleTabChange} />}
                {Array.isNullOrEmpty(searchResult) && !String.isNullOrEmpty(keyword) && <Box className={classes.tip}>No Search Result</Box>}
                {
                    !Array.isNullOrEmpty(searchResult) &&
                    searchResult.map((item, index) =>
                        <SearchContent
                            key={index}
                            title={item?.title}
                            centerTitle={item?.centerTitle}
                            subtitle={item?.subtitle}
                            imageUrl={item?.imageUrl}
                            onGoToProfile={() => handleSearchContentClick(item)}
                            unblock={() => handleUnblockClick(item.id)}
                            isBlocked={item.status} />
                    )
                }
            </Box>
            {
                openConfirmDiolog &&
                <ElDialog open={openConfirmDiolog}
                    title="Are you sure you want to unblock this user?"
                    actions={
                        <>
                            <ElButton onClick={handleYesClick}>Yes</ElButton>
                            <ElButton onClick={() => setOpenConfirmDiolog(false)}>No</ElButton>
                        </>
                    }>
                </ElDialog>
            }
        </>
    );
}

export default Search;
