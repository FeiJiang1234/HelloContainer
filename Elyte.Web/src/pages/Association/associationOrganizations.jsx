import React, { useState, useEffect } from 'react';
import { Box, Typography, Popover, List, ListItem, ListItemButton, Divider } from '@mui/material';
import { Idiograph } from 'parts';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import { ElBox, ElSvgIcon, ElButton } from 'components';
import { useProfileRoute } from 'utils';
import { organizationTypes } from '../../models';
import { associationService } from 'services';
import { OrganizationType } from 'enums';

const useStyles = makeStyles(theme => ({
    downWardArrow: {
        width: theme.spacing(2),
        height: theme.spacing(2),
        marginRight: theme.spacing(2),
        transform: 'rotateZ(90deg)'
    },
    upWardArrow: {
        width: theme.spacing(2),
        height: theme.spacing(2),
        marginRight: theme.spacing(2),
        transform: 'rotateZ(-90deg)'
    },
    listTitle: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    listName: {
        color: '#B0B8CB',
        fontWeight: 500,
        fontSize: 15,
    },
    seeMore: {
        color: '#17C476',
        fontWeight: 500,
        fontSize: 15,
    },
    wrapper: {
        display: 'flex',
        flexDirection: 'row',
    },
    createOrganizationButtonBox: {
        marginBottom: theme.spacing(10),
        position: 'relative',
        justifyContent: 'center',
        '& .MuiBox-root': {
            width: theme.spacing(40),
        }
    },
    buttonPopover: ({ anchorWidth }) => {
        return {
            '& .MuiPopover-paper': {
                width: anchorWidth,
                borderRadius: '10px 10px 0px 0px',
                background: theme.bgPrimary,
                color: '#FFFFFF',
                fontSize: 16
            }
        }
    }
}));

const AssociationOrganizations = ({ associationId, associationCode, isAdminView }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const classes = useStyles({ anchorWidth: anchorEl?.clientWidth });
    const history = useHistory();
    const [organizations, setOrganizations] = useState([]);
    const [leagues, setLeagues] = useState([]);
    const [tournaments, setTournaments] = useState([]);
    const [facilities, setFacilities] = useState([]);

    useEffect(() => getAssociationOrganizations(), [associationId]);

    const getAssociationOrganizations = async () => {
        const res = await associationService.getAssociationOrganizations(associationId);
        if (res && res.code === 200 && res.value && res.value?.length > 0) {
            setLeagues(res.value.filter(x => x.organizationType === 'League'));
            setTournaments(res.value.filter(x => x.organizationType === 'Tournament'));
            setFacilities(res.value.filter(x => x.organizationType === 'Facility'));
            setOrganizations(res.value);
        }
    };
    const handleShowOrganizationTypeClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleShowOrganizationTypeClose = () => {
        setAnchorEl(null);
    };

    const handleCreateOrganization = (type) => {
        const organizationType = organizationTypes.find(x => x.value === type);
        if (organizationType && organizationType.router) {
            history.push(organizationType.router, { params: { associationId: associationCode, fromAssociation: true } });
        }
    }

    const handleSeeMoreClick = (type) => {
        history.push("/associationOrganizationList", { params: { associationId, type } })
    }

    return (
        <Box pb={10}>
            {
                Array.isNullOrEmpty(organizations) && <ElBox>No Organizations</ElBox>
            }
            {
                !Array.isNullOrEmpty(leagues) && <OrganizationList title="Leagues" data={leagues} onSeeMoreClick={() => handleSeeMoreClick(OrganizationType.League)} />
            }
            {
                !Array.isNullOrEmpty(tournaments) && <OrganizationList title="Tournaments" data={tournaments} onSeeMoreClick={() => handleSeeMoreClick(OrganizationType.Tournament)} />
            }
            {
                !Array.isNullOrEmpty(facilities) && <OrganizationList title="Facilities" data={facilities} onSeeMoreClick={() => handleSeeMoreClick(OrganizationType.Facility)} />
            }
            {
                isAdminView &&
                <ElBox center className={classes.createOrganizationButtonBox}>
                    <ElButton fullWidth onClick={handleShowOrganizationTypeClick}>+ Create</ElButton>
                    {
                        !!anchorEl &&
                        <Popover className={classes.buttonPopover} open={!!anchorEl} anchorEl={anchorEl} onClose={handleShowOrganizationTypeClose}
                            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                            transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
                            <List>
                                <ListItem alignItems="center">
                                    <ListItemButton alignItems="center" onClick={() => handleCreateOrganization("facility")}>Facility</ListItemButton>
                                </ListItem>
                                <ListItem>
                                    <ListItemButton alignItems="center" onClick={() => handleCreateOrganization("league")}>League</ListItemButton>
                                </ListItem>
                                <ListItem>
                                    <ListItemButton alignItems="center" onClick={() => handleCreateOrganization("tournament")}>Tournament</ListItemButton>
                                </ListItem>
                            </List>
                        </Popover>
                    }
                </ElBox>
            }
        </Box>
    );
};

const OrganizationList = ({ title, data, onSeeMoreClick }) => {
    const classes = useStyles();
    const [isShowDetails, setIsShowDetails] = useState(true);

    const handleSeeMoreClick = () => {
        if (onSeeMoreClick) {
            onSeeMoreClick();
        }
    }
    return (
        <Box mb={1} >
            <Box className={classes.listTitle}>
                <Box className={classes.wrapper}>
                    <Typography mr={1} className={classes.listName}>{title}</Typography>
                    <ElSvgIcon dark name="leftArrow" className={isShowDetails ? classes.downWardArrow : classes.upWardArrow} onClick={() => setIsShowDetails(!isShowDetails)} />
                </Box>
                {
                    !Array.isNullOrEmpty(data) &&
                    <Typography className={classes.seeMore} onClick={handleSeeMoreClick}>See more</Typography>
                }
            </Box>
            {
                isShowDetails && !Array.isNullOrEmpty(data) && data.map(item => <OrganizationItem key={item.organizationId} item={item}></OrganizationItem>)
            }
        </Box>
    );
};

const OrganizationItem = ({ item }) => {
    const { getProfileUrl } = useProfileRoute();
    return (
        < >
            <Idiograph to={getProfileUrl(item.organizationType, item.organizationId)} title={item.name} subtitle={item.address} imgurl={item.imageUrl} />
            <Divider className='mt-16 mb-16' />
        </>
    )
}

export default AssociationOrganizations;