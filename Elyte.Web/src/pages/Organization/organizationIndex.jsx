import React, { useState, useEffect } from 'react';
import { ElTitle, ElSearchBox, ElLinkBtn } from 'components';
import { Box, Typography } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { organizationService, athleteService, authService } from 'services';
import { useProfileRoute } from 'utils';
import IdiographRow from 'parts/Commons/idiographRow';


const OrganizationIndex = () => {
    const history = useHistory();
    const currentUser = authService.getCurrentUser();
    const [keyword, setKeyword] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [activeOrganization, setActiveOrganization] = useState([]);
    const [defaultOrganizations, setDefaultOrganizations] = useState([]);
    const [allDefaultOrganizations, setAllDefaultOrganizations] = useState([]);
    const [isViewAll, setIsViewAll] = useState(false);
    const [totalCount, setTotalCount] = useState();
    const [isViewInterestedOrganizationsAll, setIsViewInterestedOrganizationsAll] = useState(false);

    useEffect(() => {
        getAthleteActiveOrangizations();
        getAthleteDefaultOrganizations();
    }, []);

    useEffect(() => {
        if (String.isNullOrEmpty(keyword)) return setSearchResult([]);

        getOrangizations();
    }, [keyword]);

    const getAthleteDefaultOrganizations = async () => {
        const condition = { athleteId: currentUser.id, PageNumber: 1, PageSize: 5 }
        const res = await athleteService.getAthleteDefaultOrganizations(condition);
        if (res && res.code === 200) {
            setDefaultOrganizations(res.value.items);
            setTotalCount(res.value.totalCount);
        }
    }

    const getAthleteAllDefaultOrganizations = async () => {
        const condition = { athleteId: currentUser.id, PageNumber: 1, PageSize: totalCount }
        const res = await athleteService.getAthleteDefaultOrganizations(condition);
        if (res && res.code === 200) {
            setAllDefaultOrganizations(res.value.items);
        }
    }

    const getOrangizations = async () => {
        const res = await organizationService.getOrganizations(keyword);
        if (res && res.code === 200) {
            setSearchResult(res.value);
        }
    }

    const getAthleteActiveOrangizations = async () => {
        const res = await athleteService.getAthleteActiveOrgnizations(currentUser.id);
        if (res && res.code === 200) {
            setActiveOrganization(res.value);
        }
    }

    const handleCreateOrganization = () => {
        history.push('/createOrganization');
    }

    const handleViewAllClick = () => {
        setIsViewAll(true);
    }
    const handleViewLessClick = () => {
        setIsViewAll(false);
    }

    const handleViewInsteredOrganizationsAllClick = () => {
        getAthleteAllDefaultOrganizations();
        setIsViewInterestedOrganizationsAll(true);
    }
    const handleViewInsteredOrganizationsLessClick = () => {
        setIsViewInterestedOrganizationsAll(false);
    }

    return (
        <>
            <ElTitle center>Game Time</ElTitle>
            <ElLinkBtn onClick={handleCreateOrganization}>+ Create an organization</ElLinkBtn>

            <ElSearchBox mt={2} mb={2} onChange={setKeyword} />

            <Box className='scroll-container' sx={{ maxHeight: (theme) => `calc(100vh - ${theme.spacing(40)})` }}>
                {
                    !Array.isNullOrEmpty(activeOrganization) && Array.isNullOrEmpty(searchResult) && String.isNullOrEmpty(keyword) &&
                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Typography mr={1}>My Organizations</Typography>
                        {
                            activeOrganization.length > 5 && !isViewAll && <ElLinkBtn onClick={handleViewAllClick}>View All</ElLinkBtn>
                        }
                        {
                            isViewAll && <ElLinkBtn onClick={handleViewLessClick}>View Less</ElLinkBtn>
                        }
                    </Box>
                }
                {
                    !Array.isNullOrEmpty(searchResult) && <MyOrganizations mt={2} mb={0} itemList={searchResult} />
                }
                {
                    Array.isNullOrEmpty(searchResult) && !Array.isNullOrEmpty(activeOrganization) && String.isNullOrEmpty(keyword) &&
                    <MyOrganizations mt={2} mb={4} itemList={isViewAll ? activeOrganization : activeOrganization.slice(0, 5)} />
                }
                {
                    !Array.isNullOrEmpty(defaultOrganizations) && Array.isNullOrEmpty(searchResult) && String.isNullOrEmpty(keyword) &&
                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Typography mr={1}>Organizations you may be interested in</Typography>
                        {
                            totalCount > 5 && !isViewInterestedOrganizationsAll && <ElLinkBtn onClick={handleViewInsteredOrganizationsAllClick}>View All</ElLinkBtn>
                        }
                        {
                            isViewInterestedOrganizationsAll && <ElLinkBtn onClick={handleViewInsteredOrganizationsLessClick}>View Less</ElLinkBtn>
                        }
                    </Box>
                }
                {
                    Array.isNullOrEmpty(searchResult) && !Array.isNullOrEmpty(defaultOrganizations) && String.isNullOrEmpty(keyword) &&
                    <MyOrganizations mb={4} itemList={isViewInterestedOrganizationsAll ? allDefaultOrganizations : defaultOrganizations} />
                }
            </Box >
        </>
    );
};

const MyOrganizations = ({ mb, mt, itemList }) => {
    const { getProfileUrl } = useProfileRoute();

    return (
        <>
            {
                itemList.map((item) =>
                    <Box mb={mb} mt={mt} key={item.organizationId}>
                        <IdiographRow title={item.name}
                            to={getProfileUrl(item.organizationType, item.organizationId)}
                            centerTitle={item.sportType}
                            subtitle={`${item.organizationType}, ${item.address || ''}`}
                            imgurl={item.imageUrl}>
                            {
                                item.isAdminView && <Box>admin</Box>
                            }
                        </IdiographRow>
                    </Box>
                )
            }
        </>
    );
};

export default OrganizationIndex;
