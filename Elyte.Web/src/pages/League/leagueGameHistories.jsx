import React, { useEffect, useState } from 'react';
import { leagueService } from 'services';
import OrganizationGameHistories from '../Organization/organizationGameHistories';

const LeagueGameHistories = ({ leagueId }) => {
    const [games, setGames] = useState([]);
    const [keyword, setKeyword] = useState('');

    useEffect(() => {
        getLeagueGameHistories();
    }, [leagueId, keyword]);

    const getLeagueGameHistories = async () => {
        const res = await leagueService.getLeagueGameHistories(leagueId, keyword);
        if (res && res.code === 200) setGames(res.value);
    };

    return <OrganizationGameHistories onSearch={setKeyword} games={games} />;
};

export default LeagueGameHistories;
