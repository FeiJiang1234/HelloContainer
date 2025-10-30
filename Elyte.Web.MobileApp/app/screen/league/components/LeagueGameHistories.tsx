import { leagueService } from 'el/api';
import OrganizationGameHistories from 'el/screen/organization/components/OrganizationGameHistories';
import React, { useEffect, useState } from 'react';

const LeagueGameHistories = ({ leagueId }) => {
    const [games, setGames] = useState<any[]>([]);
    const [keyword, setKeyword] = useState('');

    useEffect(() => {
        getLeagueGameHistories();
    }, [leagueId, keyword]);

    const getLeagueGameHistories = async () => {
        const res: any = await leagueService.getLeagueGameHistories(leagueId, keyword);
        if (res && res.code === 200) setGames(res.value);
    };

    return (
        <OrganizationGameHistories
            keyword={keyword}
            onSearch={setKeyword}
            games={games}
            inputAccessoryViewID="leagueGameHistory"
        />
    );
};

export default LeagueGameHistories;
