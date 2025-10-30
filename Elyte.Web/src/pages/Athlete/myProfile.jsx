import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Divider } from '@mui/material';
import { useTheme } from '@mui/styles';
import { ElSvgIcon, ElBody, ElBox, ElImageUploader, ElAddress, ElButton, ElMenuBtn, ElAvatar, ElSwitch } from 'components';
import { useHistory, useLocation } from 'react-router-dom';
import { authService, athleteService } from 'services';
import { ChatMessageButton, LevelBar } from 'pageComponents';
import { ChatType, SportType } from 'enums';
import ProfileTab from './profileTab';
import AthleteStats from './athleteStats';
import SportSelector from './sportSelector';

export default function MyProfile () {
    const theme = useTheme();
    const user = authService.getCurrentUser();
    const history = useHistory();
    const location = useLocation();
    const viewedAthleteId = location.state?.params;
    const isMySelf = !viewedAthleteId || viewedAthleteId == user.id;
    const [isShowStats, setIsShowStats] = useState(true);
    const [profile, setProfile] = useState({});
    const [stats, setStats] = useState([]);
    const [isFoldUp, setIsFoldUp] = useState(false);
    const [isOfficial, setIsOfficial] = useState(true);
    const [changeDefaultSport, setChangeDefaultSport] = useState(false);
    const [sports, setSports] = useState([]);
    const [currentSport, setCurrentSport] = useState({});
    const [noAthlete, setNoAthlete] = useState(false);

    const menuItems = [
        {
            text: 'View Team Invites',
            onClick: () => history.push("/teamInvites", user.id)
        },
        {
            text: 'View Join Team Requests',
            onClick: () => history.push("/teamJoinRequests", user.id)
        },
        {
            text: 'View Officiate Requests',
            onClick: () => history.push("/athleteOfficiateRequests", { params: { id: user.id } })
        },
        {
            text: 'Set Default Sport',
            onClick: () => getAthleteSports(true)
        }
    ];

    const sportMenuItems = () => {
        const sports = Object.keys(SportType);
        return sports.map(x=> ({
            text: x,
            onClick: () => handleChangeSport(x)
        }))
    };

    useEffect(() => {
        if (!currentSport.name) return;

        getStats();
    }, [isOfficial, currentSport.name]);

    useEffect(() => {
        getAthleteProfile();
    }, [viewedAthleteId]);

    const handleChangeSport = async (sport) => {
        const res = await athleteService.getAthleteSports(viewedAthleteId ? viewedAthleteId : user.id);
        const selectSport = res.value.find(item => item.name == sport);
        setCurrentSport(pre => ({
            ...pre,
            name: sport,
            level: selectSport.level,
            currentExperience: selectSport.currentExperience,
            nextLevelExperience: selectSport.nextLevelExperience
        }));
    }

    const getAthleteSports = async (isUpdateSport) => {
        setChangeDefaultSport(isUpdateSport);
        const res = await athleteService.getAthleteSports(viewedAthleteId ? viewedAthleteId : user.id);
        if (res && res.code === 200) {
            setSports(res.value);
        }
    }

    const getAthleteProfile = async () => {
        const res = await athleteService.getAthleteById(viewedAthleteId ? viewedAthleteId : user.id);
        if (res && res.code === 200) {
            if (res.value) {
                setProfile(res.value);
                var athleteSport = profileToAthleteSport(res.value);
                setCurrentSport(athleteSport);
            } else {
                setNoAthlete(true);
            }
        }
    }

    const handleEditProfileClick = async () => {
        history.push('/editAthleteProfile', { params: profile });
    }

    const handleImageSelect = async (image) => {
        const res = await athleteService.updateProfilePicture(user.id, image.file);
        if (res && res.code === 200) getAthleteProfile();
    }

    const followUser = async () => {
        const res = await athleteService.followUser(user.id, viewedAthleteId);
        if (res && res.code === 200) getAthleteProfile();
    };

    const unfollowUser = async () => {
        const res = await athleteService.unfollowUser(user.id, viewedAthleteId);
        if (res && res.code === 200) getAthleteProfile();
    };

    const getStats = async () => {
        setStats([]);
        const res = await getStatsService();
        if (res && res.code === 200) setStats(res.value);
    }

    const getStatsService = () => {
        const id = viewedAthleteId ? viewedAthleteId : user.id;

        if (currentSport.name === SportType.Basketball) {
            return athleteService.getBasketballStats(id, isOfficial);
        }

        if (currentSport.name === SportType.Soccer) {
            return athleteService.getSoccerStats(id, isOfficial);
        }

        return athleteService.getLowSportStats(id, isOfficial, currentSport.name);
    }

    const handleChangeStats = async ({ id, ...rest }) => {
        const res = await getChangeStatsService({ id, ...rest });
        if (res && res.code === 200) getStats();
        return res;
    }

    const getChangeStatsService = ({ id, ...rest }) => {
        if (currentSport.name === SportType.Basketball) {
            return athleteService.updateBasketballStats(user.id, id, rest);
        }
        if (currentSport.name === SportType.Soccer) {
            return athleteService.updateSoccerStats(user.id, id, rest);
        }
    }
    const handleUnblockClick = async () => {
        const res = await athleteService.unblockAthlete(user.id, viewedAthleteId);
        if (res && res.code === 200) {
            getAthleteProfile();
        }
    }

    const handleSportConfirm = async (value) => {
        setSports([]);
        const res = await athleteService.setAthleteDefaultSport(user.id, value);
        if (res && res.code === 200) {
            getAthleteProfile();
        }
    }

    const handleSportSelectorClosed = () => {
        setSports([]);
        setChangeDefaultSport(false);
    }

    const profileToAthleteSport = profile => {
        return {
            ...currentSport,
            name: profile.defaultSport,
            level: profile.level,
            currentExperience: profile.currentExperience,
            nextLevelExperience: profile.nextLevelExperience
        };
    }

    return (
        <>
            {
                profile.id && !isFoldUp &&
                <Box>
                    <ElBox center>
                        <ElImageUploader crop onImageSelected={handleImageSelect} disabled={!isMySelf}>
                            <ElAvatar src={profile?.pictureUrl} large />
                        </ElImageUploader>
                        <ElBox col flex={1} pl={2} pr={1}>
                            <Typography className="profile-title">{`${profile?.firstName} ${profile?.lastName}`}</Typography>
                            <ElAddress className="profile-address" country={profile?.country} state={profile?.state} city={profile?.city} />
                            <Grid container >
                                {
                                    profile?.isSelf && <ElButton small onClick={handleEditProfileClick}>Edit</ElButton>
                                }
                                {
                                    !profile?.isFollowed && !profile?.isSelf && !profile?.beBlocked && !profile?.isBlocked && <ElButton small onClick={followUser}>Follow</ElButton>
                                }
                                {
                                    profile?.isFollowed && !profile?.isSelf && <ElButton small onClick={unfollowUser}>Unfollow</ElButton>
                                }
                                {
                                    profile?.isBlocked && !profile?.isSelf && <ElButton small sx={{ background: '#E95B5B' }} onClick={handleUnblockClick}>UnBlock</ElButton>
                                }
                                {
                                    !profile?.isSelf && !profile?.isBlocked && !profile?.beBlocked && <ChatMessageButton toUserId={viewedAthleteId} chatType={ChatType.Personal} />
                                }
                            </Grid>
                        </ElBox>
                        {
                            profile?.isSelf &&
                            <Box alignSelf="flex-start">
                                <ElMenuBtn items={menuItems}>
                                    <ElSvgIcon light small name="options" />
                                </ElMenuBtn>
                            </Box>
                        }
                    </ElBox>
                    <ElBox center mt={2} mb={1} >
                        <Typography>{currentSport.name}</Typography>
                        <span className="fillRemain"></span>
                        <ElMenuBtn items={sportMenuItems()}>
                            <ElSvgIcon dark xSmall name="expandMore" />
                        </ElMenuBtn>
                    </ElBox>
                    <Box display='flex' alignItems='center'>
                        <LevelBar level={currentSport.level} currentExperience={currentSport.currentExperience} nextLevelExperience={currentSport.nextLevelExperience} />
                    </Box>
                    <ElBody mt={2}>{profile?.bio ?? 'No bio now'}</ElBody>

                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <ElSwitch fullWidth flex={1} my={2} on="Official" off="Unofficial" isOn={isOfficial} toggle={() => setIsOfficial(!isOfficial)} />
                        <ElSvgIcon small active name="statsSwitch" onClick={() => setIsShowStats(!isShowStats)} style={{
                            strokeWidth: 1,
                            fill: isShowStats ? theme.palette.secondary.minor : '#C0C5D0',
                            stroke: isShowStats ? theme.palette.secondary.minor : '#C0C5D0'
                        }} />
                    </Box>
                    {
                        isShowStats && !Array.isNullOrEmpty(stats) &&
                        <AthleteStats stats={stats} sportType={currentSport.name} onChangeStats={handleChangeStats} viewer={viewedAthleteId} />
                    }
                    <Divider className="mt-16" />
                </Box>
            }
            {
                (isMySelf || profile.isFollowed) &&
                <ProfileTab user={profile} sportType={currentSport.name} onFoldUp={e => setIsFoldUp(e)} viewedAthleteId={viewedAthleteId} />
            }
            {
                profile.id && !isMySelf && !profile.isFollowed &&
                <Typography mt={4} sx={{ textAlign: 'center', color: '#808A9E' }}>Visible after following</Typography>
            }
            {
                noAthlete && <Typography mt={4} sx={{ textAlign: 'center', color: '#808A9E' }}>Cannot find athlete</Typography>
            }
            {!Array.isNullOrEmpty(sports) && <SportSelector sports={sports} isUpdateSport={changeDefaultSport} defaultValue={profile?.defaultSport} onConfirmed={handleSportConfirm} onClosed={handleSportSelectorClosed} />}
        </>
    )
}
