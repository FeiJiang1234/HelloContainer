import React, { useEffect, useState } from 'react';
import { athleteService, organizationService } from 'el/api';
import {
    ElBody,
    ElIdiograph,
    ElLink,
    ElLinkBtn,
    ElList,
    ElScrollContainer,
    ElSearch,
    ElTitle,
} from 'el/components';
import routes from 'el/navigation/routes';
import { useAuth, useProfileRoute, utils } from 'el/utils';
import { Flex, Row } from 'native-base';
import { useIsFocused } from '@react-navigation/native';

const OrganizationScreen = () => {
    const { user } = useAuth();
    const [keyword, setKeyword] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [activeOrganization, setActiveOrganization] = useState<any[]>([]);
    const [defaultOrganization, setDefaultOrganization] = useState<any[]>([]);
    const [isViewAll, setIsViewAll] = useState(false);
    const isFocused = useIsFocused();
    const [totalCount, setTotalCount] = useState<any>();
    const [allDefaultOrganizations, setAllDefaultOrganizations] = useState<any[]>([]);
    const [isViewInterestedOrganizationsAll, setIsViewInterestedOrganizationsAll] = useState(false);

    useEffect(() => {
        if (isFocused) {
            getAthleteActiveOrangizations();
            getAthleteDefaultOrganizations();
        }
    }, [isFocused]);

    useEffect(() => {
        if (keyword === '') return setSearchResult([]);

        getOrangizations();
    }, [keyword]);

    const getAthleteDefaultOrganizations = async () => {
        const condition = { athleteId: user.id, PageNumbe: 1, PageSize: 5 };
        const res: any = await athleteService.getAthleteDefaultOrganizations(condition);
        if (res && res.code === 200) {
            setDefaultOrganization(res.value.items);
            setTotalCount(res.value.totalCount);
        }
    };

    const getAthleteAllDefaultOrganizations = async () => {
        const condition = { athleteId: user.id, PageNumber: 1, PageSize: totalCount }
        const res: any = await athleteService.getAthleteDefaultOrganizations(condition);
        if (res && res.code === 200) {
            setAllDefaultOrganizations(res.value.items);
        }
    }

    const getOrangizations = async () => {
        const res: any = await organizationService.getOrganizations(keyword);
        if (res && res.code === 200) {
            setSearchResult(res.value);
        }
    };

    const getAthleteActiveOrangizations = async () => {
        const res: any = await athleteService.getAthleteActiveOrgnizations(user.id);
        if (res && res.code === 200) {
            setActiveOrganization(res.value);
        }
    };

    const handleViewInsteredOrganizationsAllClick = () => {
        getAthleteAllDefaultOrganizations();
        setIsViewInterestedOrganizationsAll(true);
    }
    const handleViewInsteredOrganizationsLessClick = () => {
        setIsViewInterestedOrganizationsAll(false);
    }

    return (
        <ElScrollContainer>
            <ElTitle>Game Time</ElTitle>
            <ElLink to={routes.OrganizationCreate} style={{ fontWeight: 'bold' }}>
                + Create an organization
            </ElLink>

            <ElSearch keyword={keyword} onKeywordChange={setKeyword} />

            {keyword === '' && (
                <>
                    {activeOrganization.length > 0 && (
                        <>
                            <Row justifyContent="space-between">
                                <ElBody>My Organizations</ElBody>
                                {activeOrganization.length > 5 && (
                                    <ElLinkBtn onPress={() => setIsViewAll(!isViewAll)}>
                                        {!isViewAll ? 'View All' : ' View Less'}
                                    </ElLinkBtn>
                                )}
                            </Row>
                            <MyOrganizations
                                itemList={
                                    isViewAll ? activeOrganization : activeOrganization.slice(0, 5)
                                }
                            />
                        </>
                    )}
                    {!utils.isArrayNullOrEmpty(defaultOrganization) && (
                        <>
                            <Flex direction="row" alignItems="center" justify="space-between">
                                <ElBody my={2}>Organizations you may be interested in</ElBody>
                                {
                                    totalCount > 5 && !isViewInterestedOrganizationsAll && <ElLinkBtn onPress={handleViewInsteredOrganizationsAllClick}>View All</ElLinkBtn>
                                }
                                {
                                    isViewInterestedOrganizationsAll && <ElLinkBtn onPress={handleViewInsteredOrganizationsLessClick}>View Less</ElLinkBtn>
                                }
                            </Flex>
                            {
                                <MyOrganizations itemList={isViewInterestedOrganizationsAll ? allDefaultOrganizations : defaultOrganization} />
                            }
                        </>
                    )}
                </>
            )}
            <MyOrganizations itemList={searchResult} />
        </ElScrollContainer>
    );
};

const MyOrganizations = ({ itemList }) => {
    const { goToProfile } = useProfileRoute();

    return (
        <ElList
            data={itemList}
            keyExtractor={item => item.organizationId}
            renderItem={({ item }) => (
                <ElIdiograph
                    onPress={() => goToProfile(item.organizationType, item.organizationId)}
                    title={item.name}
                    centerTitle={item.sportType}
                    imageUrl={item.imageUrl}
                    subtitle={`${item.organizationType}, ${item.address || ''}`}
                    imageSize={48}
                />
            )}
        />
    );
};

export default OrganizationScreen;
