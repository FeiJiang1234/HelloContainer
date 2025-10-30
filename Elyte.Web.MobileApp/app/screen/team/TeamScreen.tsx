import React, { useState, useEffect } from 'react';
import {
    ElBody,
    ElButton,
    ElLink,
    ElLinkBtn,
    ElScrollContainer,
    ElSearch,
    ElSwitch,
    ElTitle,
} from 'el/components';
import routes from 'el/navigation/routes';
import { Box, FlatList, Flex, Pressable } from 'native-base';
import FilterSvg from 'el/svgs/filterSvg';
import colors from 'el/config/colors';
import { SportType } from 'el/enums';
import { athleteService, teamService } from 'el/api';
import { useAuth, utils } from 'el/utils';
import TeamList from './components/TeamList';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { ERROR, PENDING, SUCCESS } from 'el/store/slices/requestSlice';

export default function TeamScreen() {
    const { user } = useAuth();
    const [filterStatus, setFilterStatus] = useState(false);
    const tabs = ['All', SportType.Basketball, SportType.Soccer];
    const [sportType, setSportType] = useState('All');
    const [searchedTeams, setSearchedTeams] = useState<any[]>([]);
    const [keyword, setKeyword] = useState('');
    const [activeTeams, setActiveTeams] = useState<any[]>([]);
    const [defaultTeams, setDefaultTeams] = useState<any[]>([]);
    const [allDefaultTeams, setAllDefaultTeams] = useState<any[]>([]);
    const [totalCount, setTotalCount] = useState<any>();
    const [athleteProfile, setAthleteProfile] = useState<any>();
    const [isViewAll, setIsViewAll] = useState(false);
    const [isViewInterestedTeamsAll, setIsViewInterestedTeamsAll] = useState(false);
    const isFocused = useIsFocused();
    const dispatch = useDispatch();

    useEffect(() => {
        if (isFocused) {
            getAthleteProfile(user.id);
            getAthleteActiveTeams();
            getAthleteDefaultTeams();
        }
    }, [isFocused]);

    useEffect(() => {
        if (!keyword) return setSearchedTeams([]);

        searchTeams(keyword, sportType);
    }, [keyword, sportType]);

    const getAthleteActiveTeams = async () => {
        const res: any = await teamService.getAthleteActiveTeams(user.id);
        if (res && res.code === 200) {
            setActiveTeams(res.value);
        }
    };

    const getAthleteDefaultTeams = async () => {
        const condition = { athleteId: user.id, PageNumbe: 1, PageSize: 5 };
        const res: any = await athleteService.getAthleteDefaultTeams(condition);
        if (res && res.code === 200) {
            setDefaultTeams(res.value.items);
            setTotalCount(res.value.totalCount);
        }
    };

    const getAllDefaultTeams = async () => {
        const condition = { athleteId: user.id, PageNumbe: 1, PageSize: totalCount };
        const res: any = await athleteService.getAthleteDefaultTeams(condition);
        if (res && res.code === 200) {
            setAllDefaultTeams(res.value.items);
        }
    }

    const searchTeams = async (keywords, sport) => {
        const res: any = await teamService.searchTeam(sport === 'All' ? '' : sport, keywords);
        if (res && res.code === 200) {
            setSearchedTeams(res.value);
        }
    };

    const toggleOpenToJoinTeam = async isOpen => {
        dispatch(PENDING());
        const service = isOpen
            ? athleteService.openToJoinTeam(sportType, user.id)
            : athleteService.closeToJoinTeam(sportType, user.id);
        const res: any = await service;
        if (res && res.code === 200) {
            await getAthleteProfile(user.id);
            dispatch(SUCCESS());
        } else {
            dispatch(ERROR());
        }
    };

    const getAthleteProfile = async userId => {
        const res: any = await athleteService.getAthleteById(userId);
        if (res && res.code === 200) {
            setAthleteProfile(res.value);
        }
    };

    const handleViewInsteredTeamsAllClick = () => {
        getAllDefaultTeams();
        setIsViewInterestedTeamsAll(true);
    }
    const handleViewInsteredTeamsLessClick = () => {
        setIsViewInterestedTeamsAll(false);
    }

    const handleGetTeamCallBack = () => {
        if (!!keyword) {
            searchTeams(keyword, sportType);
        } else {
            getAthleteDefaultTeams();
        }
    }

    return (
        <ElScrollContainer>
            <ElTitle>Teams</ElTitle>
            <ElLink to={routes.TeamCreate} style={{ fontWeight: 'bold' }}>
                + Create a team
            </ElLink>
            <Flex direction="row" align="center">
                <Box flex={1} mr={2} >
                    <ElSearch keyword={keyword} onKeywordChange={setKeyword} />
                </Box>
                <Pressable size={8} alignItems="center" justifyContent="center" onPress={() => setFilterStatus(!filterStatus)}>
                    <FilterSvg stroke={filterStatus ? colors.secondary : undefined} />
                </Pressable>
            </Flex>
            {
                filterStatus && (
                    <FlatList
                        data={tabs}
                        keyExtractor={x => x}
                        ItemSeparatorComponent={() => <Box w={2} />}
                        renderItem={({ item }) => (
                            <ElButton
                                key={item}
                                size="sm"
                                onPress={() => setSportType(item)}
                                variant={item !== sportType ? 'disabled' : 'contained'}>
                                {item}
                            </ElButton>
                        )}
                        horizontal={true}
                    />
                )
            }
            {
                filterStatus && sportType === SportType.Basketball && (
                    <ElSwitch
                        text="Open to new Teams"
                        value={athleteProfile?.isOpenToJoinBasketballTeam}
                        onToggle={toggleOpenToJoinTeam}
                        my={2}
                    />
                )
            }
            {
                filterStatus && sportType === SportType.Soccer && (
                    <ElSwitch
                        text="Open to new Teams"
                        value={athleteProfile?.isOpenToJoinSoccerTeam}
                        onToggle={toggleOpenToJoinTeam}
                        my={2}
                    />
                )
            }
            {
                !keyword && (
                    <>
                        {!utils.isArrayNullOrEmpty(activeTeams) && (
                            <>
                                <Flex direction="row" alignItems="center" justify="space-between">
                                    <ElBody my={2}>My Teams</ElBody>
                                    {activeTeams.length > 5 && (
                                        <ElLinkBtn onPress={() => setIsViewAll(!isViewAll)}>
                                            {!isViewAll ? 'View All' : ' View Less'}
                                        </ElLinkBtn>
                                    )}
                                </Flex>
                                <TeamList teams={isViewAll ? activeTeams : activeTeams.slice(0, 5)} />
                            </>
                        )}
                        {!utils.isArrayNullOrEmpty(defaultTeams) && (
                            <>
                                <Flex direction="row" alignItems="center" justify="space-between">
                                    <ElBody my={2}>Teams you may be interested in</ElBody>
                                    {
                                        totalCount > 5 && !isViewInterestedTeamsAll && <ElLinkBtn onPress={handleViewInsteredTeamsAllClick}>View All</ElLinkBtn>
                                    }
                                    {
                                        isViewInterestedTeamsAll && <ElLinkBtn onPress={handleViewInsteredTeamsLessClick}>View Less</ElLinkBtn>
                                    }
                                </Flex>
                                <TeamList teams={isViewInterestedTeamsAll ? allDefaultTeams : defaultTeams} onHandleSuccess={handleGetTeamCallBack} />
                            </>
                        )}
                    </>
                )
            }
            <Box mt={2}>
                <TeamList teams={searchedTeams} onHandleSuccess={handleGetTeamCallBack} />
            </Box>
        </ElScrollContainer >
    );
}
