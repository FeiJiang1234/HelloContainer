import React, { useState, useEffect } from 'react';
import { ElSvgIcon, ElButton, ElSwitch, ElConfirm, ElSearchBox } from 'components';
import { useHistory } from 'react-router-dom';
import { teamService, authService, athleteService } from 'services';
import { useProfileRoute } from 'utils';
import IdiographRow from 'parts/Commons/idiographRow';

const ProfileTeam = ({ user, sportType }) => {
    const history = useHistory();
    const currentUser = authService.getCurrentUser();
    const { teamProfile } = useProfileRoute();
    const [teams, setTeams] = useState([]);
    const [open, setOpen] = useState(false);
    const [teamId, setTeamId] = useState(null);
    const [toggleStatus, setToggleStatus] = useState();
    const [athleteProfile, setAthleteProfile] = useState(user);


    useEffect(() => getAthleteJoinedTeams(), []);

    useEffect(() => {
        if (sportType == "Basketball") {
            setToggleStatus(athleteProfile.isOpenToJoinBasketballTeam);
        }
        if (sportType == "Soccer") {
            setToggleStatus(athleteProfile.isOpenToJoinSoccerTeam);
        }
        if (sportType == "Baseball") {
            setToggleStatus(athleteProfile.isOpenToJoinBaseballTeam);
        }
    }, [athleteProfile, sportType]);


    const getAthleteJoinedTeams = async (name) => {
        const res = await teamService.getAthleteActiveTeams(athleteProfile.id, name);
        if (res && res.code === 200) {
            setTeams(res.value);
        }
    }

    const toggleOpenToJoinTeam = async e => {
        if (e) {
            await athleteService.openToJoinTeam(sportType, user.id);
        } else {
            await athleteService.closeToJoinTeam(sportType, user.id);
        }

        const res = await athleteService.getAthleteById(currentUser.id);
        setAthleteProfile(res.value);
    };

    const leaveTeam = async () => {
        const res = await athleteService.leaveTeam(currentUser.id, teamId);
        if (res && res.code === 200) {
            getAthleteJoinedTeams();
        }
    };

    const handleClose = () => {
        setOpen(false);
        setTeamId(null);
    };

    const handleLeaveTeamClick = (item) => {
        setOpen(true);
        setTeamId(item.id);
    }

    const handleViewRequestClick = (item) => {
        history.push('/athleteJoinTeamRequest', { params: item.id });
    }

    const handleKeywordChanged = (keyword) => {
        getAthleteJoinedTeams(keyword);
    }

    return (
        <>
            <ElSearchBox mt={2} mb={2} onChange={handleKeywordChanged} />
            {
                athleteProfile.isSelf &&
                <ElSwitch text="Open to new Teams" on="On" off="Off" mb={4} isOn={toggleStatus} toggle={toggleOpenToJoinTeam} />
            }
            {
                !Array.isNullOrEmpty(teams) && teams.map((item) => (
                    <IdiographRow key={item.id} to={teamProfile(item.id)} noDivider title={item.title} centerTitle={item.centerTitle} subtitle={item.subtitle} imgurl={item.avatarUrl}>
                        {
                            !item.isAdminView && <ElSvgIcon light xSmall name="close" onClick={() => handleLeaveTeamClick(item)} />
                        }
                        {
                            item.isAdminView && currentUser.id === user.id && <ElButton small onClick={() => handleViewRequestClick(item)}>Requests</ElButton>
                        }
                    </IdiographRow>
                ))
            }
            <ElConfirm title="Are you sure to leave team?" keepMounted open={open} onOkClick={() => leaveTeam()} onNoClick={handleClose} />
        </>
    );
};

export default ProfileTeam;
