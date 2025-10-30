import React, { useState, useEffect } from 'react';
import { ElTitle, ElSearchBox, ElBox, ElButton } from 'components';
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useHistory, useLocation } from 'react-router-dom';
import { Idiograph } from 'parts';
import { organizationService, teamService } from 'services';

const useStyles = makeStyles(() => {
    return {
        itemLabel: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
        },
    };
});

const teamSearchOrganizations = () => {
    const location = useLocation();
    const [keyword, setKeyword] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const teamId = location?.state?.params;

    useEffect(() => {
        if (teamId) {
            getOrangizations();
        }
    }, [keyword, teamId]);

    const getOrangizations = async () => {
        const res = await organizationService.teamSearchOrganizations(teamId, keyword);
        if (res && res.code === 200) {
            setSearchResult(res.value);
        }
    }

    return (
        <>
            <ElTitle center>Organization List</ElTitle>
            <ElSearchBox mt={2} mb={2} onChange={setKeyword} />
            <Box mt={2}>
                {
                    searchResult.length === 0 && keyword !== '' && <ElBox center>No Search Result</ElBox>
                }
                {
                    !Array.isNullOrEmpty(searchResult) && searchResult.map((item) =>
                        <OrganizationItem key={item.organizationId} teamId={teamId} item={item} onJoinSuccess={(() => { getOrangizations() })} />
                    )
                }
            </Box >
        </>
    );
};

export default teamSearchOrganizations;

const OrganizationItem = ({ teamId, item, onJoinSuccess }) => {
    const classes = useStyles();
    const history = useHistory();
    const [btnLoading, setBtnLoading] = useState(false);
    const handlerItemClick = (item) => {
        let path = "";
        switch (item.organizationType) {
            case "League":
                path = "/leagueProfile";
                break;
            case "Tournament":
                path = "/tournamentProfile";
                break;
            default:
                break;
        }

        if (path) {
            history.push(path, { params: item.organizationId });
        }
    }

    const handlerJoinClick = async () => {
        setBtnLoading(true);
        let res = {};
        switch (item.organizationType) {
            case "League":
                res = await teamService.teamJoinLeague(teamId, item.organizationId);
                break;
            case "Tournament":
                res = await teamService.teamJoinTournament(teamId, item.organizationId);
                break;
            default:
                break;
        }

        if (res && res.code === 200) {
            onJoinSuccess && onJoinSuccess();
        }
        setBtnLoading(false);
    }
    return (
        <ElBox mb={2} className={classes.itemLabel} >
            <Idiograph title={item.name} onClick={() => { handlerItemClick(item); }} subtitle={`${item.isOfficial ? "Official&nbsp;" : ""}${item.organizationType}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${item.createdDate}`} imgurl={item.imageUrl}></Idiograph>
            <span className="fillRemain"></span>
            {item.isJoin === false && <ElButton small loading={btnLoading} onClick={handlerJoinClick}>Join</ElButton>}
            {item.isJoin === null && <ElBox center>Requesting</ElBox>}
        </ElBox>
    )
}
