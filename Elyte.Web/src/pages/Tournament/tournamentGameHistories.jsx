import React, { useEffect, useState } from 'react';
import { tournamentService } from 'services';
import OrganizationGameHistories from '../Organization/organizationGameHistories';

const TournamentGameHistories = ({ tournamentId }) => {
    const [games, setGames] = useState([]);
    const [keyword, setKeyword] = useState('');

    useEffect(() => getTournamentGameHistories(), [tournamentId, keyword]);

    const getTournamentGameHistories = async () => {
        const res = await tournamentService.getTournamentGameHistories(tournamentId, keyword);
        if (res && res.code === 200) setGames(res.value);
    };

    return <OrganizationGameHistories onSearch={setKeyword} games={games} />;
};

export default TournamentGameHistories;
