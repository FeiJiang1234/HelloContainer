import React, { useEffect, useState } from 'react';
import { ElButton, ElTitle, ElSwitch, ElSearchBox, ElLinkBtn, ElTabs, ElSvgIcon } from 'components';
import { teamService, authService, athleteService } from 'services';
import { useHistory } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import useProfileRoute from '../../utils/useProfileRoute'
import IdiographRow from 'parts/Commons/idiographRow';
import { SportType } from 'enums';

const useStyles = makeStyles(theme => {
    return {
        itemButton: {
            display: 'flex',
            flexDirection: 'row',
            '& > *': {
                marginLeft: theme.spacing(0.5),
            },
        },
        listTitle: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between'
        }
    };
});

const tabs = ["All", SportType.Basketball, SportType.Soccer];

const TeamIndex = () => {
    const classes = useStyles();
    const history = useHistory();
    const currentUser = authService.getCurrentUser();
    const [loading, setLoading] = useState(false);
    const [searchedTeams, setSearchedTeams] = useState([]);
    const [sportType, setSportType] = useState('All');
    const [athleteProfile, setAthleteProfile] = useState();
    const [toggleStatus, setToggleStatus] = useState();
    const [activeTeams, setActiveTeams] = useState([]);
    const [isViewAll, setIsViewAll] = useState(false);
    const [isViewInterestedTeamsAll, setIsViewInterestedTeamsAll] = useState(false);
    const [defaultTeams, setDefaultTeams] = useState([]);
    const [allDefaultTeams, setAllDefaultTeams] = useState([]);
    const [totalCount, setTotalCount] = useState();
    const [keyword, setKeyword] = useState('');
    const [filterStatus, setFilterStatus] = useState(false);

    useEffect(() => {
        getAthleteProfile(currentUser.id);
        getAthleteActiveTeams();
        getAthleteDefaultTeams();
    }, []);

    useEffect(() => {
        if (!athleteProfile) return;
        setToggleStatus(getOpenType(sportType));
    }, [athleteProfile, sportType]);

    useEffect(() => {
        if (String.isNullOrEmpty(keyword)) return setSearchedTeams([]);

        getTeams(keyword, sportType);
    }, [keyword]);

    const getAthleteActiveTeams = async () => {
        const res = await teamService.getAthleteActiveTeams(currentUser.id);
        if (res && res.code === 200) {
            setActiveTeams(res.value);
        }
    }

    const getAthleteDefaultTeams = async () => {
        const condition = { athleteId: currentUser.id, PageNumbe: 1, PageSize: 5 }
        const res = await athleteService.getAthleteDefaultTeams(condition);
        if (res && res.code === 200) {
            setDefaultTeams(res.value.items);
            setTotalCount(res.value.totalCount);
        }
    }

    const getAllDefaultTeams = async () => {
        const condition = { athleteId: currentUser.id, PageNumbe: 1, PageSize: totalCount }
        const res = await athleteService.getAthleteDefaultTeams(condition);
        if (res && res.code === 200) {
            setAllDefaultTeams(res.value.items);
        }
    }

    const getOpenType = (sport) => {
        if (sport === SportType.Basketball) {
            return athleteProfile.isOpenToJoinBasketballTeam;
        }
        if (sport === SportType.Soccer) {
            return athleteProfile.isOpenToJoinSoccerTeam;
        }
        if (sport === SportType.Baseball) {
            return athleteProfile.isOpenToJoinBaseballTeam;
        }

        return false;
    }

    const getAthleteProfile = async (userId) => {
        const res = await athleteService.getAthleteById(userId);
        if (res && res.code === 200) {
            setAthleteProfile(res.value);
        }
    }

    const getTeams = async (keywords, sport) => {
        const res = await teamService.searchTeam(sport === "All" ? '' : sport, keywords);
        if (res && res.code === 200) {
            setSearchedTeams(res.value);
        }
    }

    const handleCreateTeamClick = () => {
        history.push('/createTeam', { params: sportType });
    }

    const toggleOpenToJoinTeam = async isOpen => {
        setLoading(true);
        const service = isOpen ? athleteService.openToJoinTeam(sportType, currentUser.id) : athleteService.closeToJoinTeam(sportType, currentUser.id);
        const res = await service;
        if (res && res.code === 200) {
            getAthleteProfile(currentUser.id);
        }
        setLoading(false);
    };

    const handleViewAllClick = () => {
        setIsViewAll(true);
    }
    const handleViewLessClick = () => {
        setIsViewAll(false);
    }

    const handleViewInsteredTeamsAllClick = () => {
        getAllDefaultTeams();
        setIsViewInterestedTeamsAll(true);
    }
    const handleViewInsteredTeamsLessClick = () => {
        setIsViewInterestedTeamsAll(false);
    }

    const handleGetTeamCallBack = () => {
        if (!String.isNullOrEmpty(keyword)) {
            return getTeams(keyword, sportType);
        }

        if (String.isNullOrEmpty(keyword)) {
            getAthleteDefaultTeams();
            return getAthleteActiveTeams();
        }
    }

    const handleTabChange = (e) => {
        setSportType(e);
        if (!String.isNullOrEmpty(keyword))
            getTeams(keyword, e);
    }

    const handleFilterButtonClick = () => {
        if (filterStatus) {
            setSportType("All");
        }

        setFilterStatus(!filterStatus)
    }

    return (
        <>
            <ElTitle center>Teams</ElTitle>
            <ElLinkBtn onClick={handleCreateTeamClick}>+ Create a team</ElLinkBtn>
            <ElSearchBox value={keyword} isShowFilter={true} filterDefaultStatus={filterStatus} onChange={setKeyword} onFilterButtonClick={handleFilterButtonClick} />
            {filterStatus && <ElTabs tabs={tabs} tab={sportType} onTabChange={handleTabChange} />}
            {
                sportType !== "All" && <ElSwitch mt={2} text="Open to new Teams" on="On" off="Off" isOn={toggleStatus} toggle={toggleOpenToJoinTeam} loading={loading} />
            }

            <Box mt={2} className='scroll-container' sx={{ maxHeight: (theme) => `calc(100vh - ${theme.spacing(48)})` }}>
                {
                    !Array.isNullOrEmpty(activeTeams) && Array.isNullOrEmpty(searchedTeams) && String.isNullOrEmpty(keyword) &&
                    <Box className={classes.listTitle}>
                        <Typography mr={1}>My Teams</Typography>
                        {
                            activeTeams.length > 5 && !isViewAll && <ElLinkBtn onClick={handleViewAllClick}>View All</ElLinkBtn>
                        }
                        {
                            isViewAll && <ElLinkBtn onClick={handleViewLessClick}>View Less</ElLinkBtn>
                        }
                    </Box>
                }
                {
                    !Array.isNullOrEmpty(searchedTeams) &&
                    <MyTeams mb={0} itemList={searchedTeams} getTeamsCallBack={() => handleGetTeamCallBack()} />
                }
                {
                    Array.isNullOrEmpty(searchedTeams) && !Array.isNullOrEmpty(activeTeams) && String.isNullOrEmpty(keyword) &&
                    <MyTeams mb={4} itemList={isViewAll ? activeTeams : activeTeams.slice(0, 5)} />
                }


                {
                    !Array.isNullOrEmpty(defaultTeams) && Array.isNullOrEmpty(searchedTeams) && String.isNullOrEmpty(keyword) &&
                    <Box className={classes.listTitle}>
                        <Typography mr={1}>Teams you may be interested in</Typography>
                        {
                            totalCount > 5 && !isViewInterestedTeamsAll && <ElLinkBtn onClick={handleViewInsteredTeamsAllClick}>View All</ElLinkBtn>
                        }
                        {
                            isViewInterestedTeamsAll && <ElLinkBtn onClick={handleViewInsteredTeamsLessClick}>View Less</ElLinkBtn>
                        }
                    </Box>
                }
                {
                    Array.isNullOrEmpty(searchedTeams) && !Array.isNullOrEmpty(defaultTeams) && String.isNullOrEmpty(keyword) &&
                    <MyTeams mb={4} itemList={isViewInterestedTeamsAll ? allDefaultTeams : defaultTeams} getTeamsCallBack={() => handleGetTeamCallBack()} />
                }

            </Box>
        </>
    );
};

const MyTeams = ({ mb, mt, itemList, getTeamsCallBack }) => {
    const classes = useStyles();
    const { teamProfile } = useProfileRoute();
    const currentUser = authService.getCurrentUser();

    const buildSportIcon = (item) => {
        if (item.sportType === SportType.Basketball) {
            return <ElSvgIcon xSmall name="basketball" />;
        }
        if (item.sportType === SportType.Soccer) {
            return <ElSvgIcon xSmall name="soccer" />;
        }
        if (item.sportType === SportType.Baseball) {
            return <ElSvgIcon xSmall name="baseball" />;
        }

        return "";
    }

    const handleJoinTeamClick = async (team) => {
        const res = await teamService.athleteRequestToJoinTeam(currentUser.id, team.id);
        if (res && res.code === 200) {
            if (getTeamsCallBack) {
                getTeamsCallBack()
            }
        }
    }

    return (
        <>
            {
                itemList.map((item) => (
                    <Box key={item.id} mb={mb} mt={mt}>
                        <IdiographRow to={teamProfile(item.id)} title={<>{item.title}{buildSportIcon(item)}</>} centerTitle={item.centerTitle} subtitle={item.subtitle} imgurl={item.avatarUrl}>
                            <Box className={classes.itemButton}>
                                {
                                    item.isJoin === false && <ElButton small onClick={() => handleJoinTeamClick(item)}>Join</ElButton>
                                }
                                {
                                    item.isJoin === null && <Typography>Requesting</Typography>
                                }
                            </Box>
                        </IdiographRow>
                    </Box>
                ))
            }
        </>
    );
};

export default TeamIndex;
