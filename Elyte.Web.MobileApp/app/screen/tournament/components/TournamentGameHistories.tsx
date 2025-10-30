import { tournamentService } from 'el/api';
import OrganizationGameHistories from 'el/screen/organization/components/OrganizationGameHistories';
import { ERROR, PENDING, SUCCESS } from 'el/store/slices/requestSlice';
import { useElToast } from 'el/utils';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

const TournamentGameHistories = ({ tournamentId }) => {
    const dispatch = useDispatch();
    const toast = useElToast();
    const [games, setGames] = useState<any[]>([]);
    const [keyword, setKeyword] = useState('');

    useEffect(() => {
        getTournamentGameHistories();
    }, [tournamentId, keyword]);

    const getTournamentGameHistories = async () => {
        dispatch(PENDING());
        const res: any = await tournamentService.getTournamentGameHistories(tournamentId, keyword);
        if (res && res.code === 200) {
            dispatch(SUCCESS());
            setGames(res.value);
        } else {
            dispatch(ERROR());
            toast.error(res.Message);
        }
    };

    return (
        <OrganizationGameHistories
            keyword={keyword}
            onSearch={setKeyword}
            games={games}
            inputAccessoryViewID="tournamentGameHistory"
        />
    );
};

export default TournamentGameHistories;
