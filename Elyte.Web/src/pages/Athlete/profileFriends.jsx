import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, MenuItem } from '@mui/material';
import { Idiograph } from 'parts';
import { makeStyles } from '@mui/styles';
import { ElBox, ElSvgIcon, ElSearchBox, ElDialog, ElButton, ElMenu, ElLinkBtn } from 'components';
import { useProfileRoute } from 'utils';
import { athleteService } from 'services';

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
    wrapper: {
        display: 'flex',
        flexDirection: 'row',
    },
}));

const ProfileFriends = ({ user, onFoldUp, viewedAthleteId }) => {
    const [followingAthletes, setFollowingAthletes] = useState([]);
    const [fans, setFans] = useState([]);
    const [fanOf, setFanOf] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [openConfirmDiolog, setOpenConfirmDiolog] = useState(false);
    const [targetAthleteId, setTargetAthleteId] = useState();

    useEffect(() => {
        getFollowing();
    }, [user]);

    const getFollowing = async () => {
        const res = await athleteService.getFollowing(user.id, "");
        if (res && res.code === 200 && res.value) {
            setFans(res.value.filter(x => x.followingType === 'Fans'));
            setFanOf(res.value.filter(x => x.followingType === 'FanOf'));
            setFollowingAthletes(res.value);
        }
    };

    useEffect(() => {
        if (keyword && keyword.length >= 0) {
            searchFollowing();
        }
        if (keyword == 0) {
            setSearchResult([]);
        }
    }, [keyword]);

    const searchFollowing = async () => {
        const res = await athleteService.getFollowing(user.id, keyword);
        if (res && res.code === 200 && res.value) {
            setSearchResult(res.value);
            getFollowing();
        }
    };

    const handleFoldUp = (e) => {
        if (onFoldUp) {
            onFoldUp(e);
        }
    }

    const handleAfterBlock = () => {
        getFollowing()
    }

    const handleBlock = (id) => {
        setOpenConfirmDiolog(true);
        setTargetAthleteId(id);
    }

    const handleYesToBlockClick = async () => {
        const res = await athleteService.blockAthlete(user.id, targetAthleteId);
        if (res && res.code === 200) {
            setOpenConfirmDiolog(false);
            searchFollowing();
        }
    }

    return (
        <>
            <ElSearchBox mt={2} mb={2} onChange={setKeyword} />
            {
                Array.isNullOrEmpty(searchResult) &&
                <Box mt={1}>
                    {
                        Array.isNullOrEmpty(followingAthletes) && <ElBox>No Fan</ElBox>
                    }
                    {
                        !Array.isNullOrEmpty(fans) &&
                        <FollowingAthleteList title="My Fans" list={fans} athleteList={fans.slice(0, 3)} onFoldUp={handleFoldUp} isViewAll={false} viewedAthleteId={viewedAthleteId} user={user} onRefresh={handleAfterBlock} fans />
                    }
                    {
                        !Array.isNullOrEmpty(fanOf) &&
                        <FollowingAthleteList title="Fan Of" list={fanOf} athleteList={fanOf.slice(0, 3)} onFoldUp={handleFoldUp} isViewAll={false} viewedAthleteId={viewedAthleteId} user={user} onRefresh={handleAfterBlock} fanOf />
                    }
                </Box>
            }
            {
                !Array.isNullOrEmpty(searchResult) &&
                searchResult.map(item => <AthleteItem key={item.id} item={item} onBlock={() => handleBlock(item.id)} viewedAthleteId={viewedAthleteId} />)
            }
            {
                openConfirmDiolog &&
                <ElDialog open={openConfirmDiolog}
                    title="Are you sure you want to block this user?"
                    actions={
                        <>
                            <ElButton onClick={handleYesToBlockClick}>Yes</ElButton>
                            <ElButton onClick={() => setOpenConfirmDiolog(false)}>No</ElButton>
                        </>
                    }>
                </ElDialog>
            }
        </>
    );
};

const FollowingAthleteList = ({ title, list, athleteList, onFoldUp, viewedAthleteId, user, onRefresh, fans, fanOf }) => {
    const classes = useStyles();
    const [isViewAll, setIsViewAll] = useState(false);
    const [openConfirmDiolog, setOpenConfirmDiolog] = useState(false);
    const [targetAthleteId, setTargetAthleteId] = useState();

    const handleViewAllClick = () => {
        if (onFoldUp) {
            onFoldUp(true);
        }
        setIsViewAll(true);
    }
    const handleViewLessClick = () => {
        if (onFoldUp) {
            onFoldUp(false);
        }
        setIsViewAll(false);
    }

    const handleBlock = (id) => {
        setOpenConfirmDiolog(true);
        setTargetAthleteId(id);
    }

    const handleUnfollow = async (id) => {
        const res = await athleteService.unfollowUser(user.id, id);
        if (res && res.code === 200 && onRefresh) onRefresh();
    }

    const handleYesToBlockClick = async () => {
        const res = await athleteService.blockAthlete(user.id, targetAthleteId);
        if (res && res.code === 200) {
            setOpenConfirmDiolog(false);
            if (onRefresh) {
                onRefresh();
            }
        }
    }

    return (
        <Box mb={1}>
            <Box className={classes.listTitle}>
                <Box className={classes.wrapper}>
                    <Typography mr={1} className={classes.listName}>{title}</Typography>
                </Box>
                {
                    !Array.isNullOrEmpty(athleteList) && !isViewAll &&
                    <ElLinkBtn onClick={handleViewAllClick}>View All</ElLinkBtn>
                }
                {
                    !Array.isNullOrEmpty(list) && isViewAll &&
                    <ElLinkBtn onClick={handleViewLessClick}>View Less</ElLinkBtn>
                }
            </Box>
            {
                fans && !Array.isNullOrEmpty(athleteList) && !isViewAll &&
                athleteList.map(item => <AthleteItem key={item.id} item={item} onBlock={() => handleBlock(item.id)} viewedAthleteId={viewedAthleteId} fans />)
            }
            {
                fans && !Array.isNullOrEmpty(list) && isViewAll &&
                list.map(item => <AthleteItem key={item.id} item={item} onBlock={() => handleBlock(item.id)} viewedAthleteId={viewedAthleteId} fans />)
            }
            {
                fanOf && !Array.isNullOrEmpty(athleteList) && !isViewAll &&
                athleteList.map(item => <AthleteItem key={item.id} item={item} onBlock={() => handleBlock(item.id)} viewedAthleteId={viewedAthleteId} fanOf unfollow={() => handleUnfollow(item.id)} />)
            }
            {
                fanOf && !Array.isNullOrEmpty(list) && isViewAll &&
                list.map(item => <AthleteItem key={item.id} item={item} onBlock={() => handleBlock(item.id)} viewedAthleteId={viewedAthleteId} fanOf unfollow={() => handleUnfollow(item.id)} />)
            }
            {
                openConfirmDiolog &&
                <ElDialog open={openConfirmDiolog}
                    title="Are you sure you want to block this user?"
                    actions={
                        <>
                            <ElButton onClick={handleYesToBlockClick}>Yes</ElButton>
                            <ElButton onClick={() => setOpenConfirmDiolog(false)}>No</ElButton>
                        </>
                    }>
                </ElDialog>
            }
        </Box>
    );
};

const AthleteItem = ({ item, onBlock, viewedAthleteId, fans, fanOf, unfollow }) => {
    const classes = useStyles();
    const removeViewMenuRef = useRef();
    const { athleteProfile } = useProfileRoute();

    const handleBlockAthleteClick = () => {
        if (onBlock) {
            onBlock();
        }
        removeViewMenuRef.current.close();
    }
    const handleRemoveAthleteClick = (e) => {
        removeViewMenuRef.current.open(e.currentTarget);
    }
    const handleUnfollowClick = () => {
        if (unfollow) {
            unfollow();
        }
    }

    return (
        <Box mt={1} mb={1} className={classes.listTitle}>
            <Idiograph to={athleteProfile(item.id)} title={item.title} subtitle={item.subtitle} centerTitle={item.centerTitle} imgurl={item.avatarUrl} />
            {!viewedAthleteId && fanOf &&
                <Box mt={2}>
                    <ElSvgIcon light xSmall name="close" onClick={handleRemoveAthleteClick} />
                </Box>
            }
            {!viewedAthleteId && fans &&
                <Box mt={2}>
                    <ElSvgIcon light xSmall name="close" onClick={handleBlockAthleteClick} />
                </Box>
            }

            <ElMenu ref={removeViewMenuRef}>
                <MenuItem onClick={handleBlockAthleteClick}>Block</MenuItem>
                <MenuItem onClick={handleUnfollowClick}>Unfollow</MenuItem>
            </ElMenu>
        </Box>
    )
}

export default ProfileFriends;
