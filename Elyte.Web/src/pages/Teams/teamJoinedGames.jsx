import React, { useState, useEffect } from 'react';
import { ElBox, ElAccordion } from 'components';
import { teamService } from 'services';
import _ from 'lodash';
import GameRow from 'pageComponents/gameRow';

const TeamJoinedGames = ({ teamId }) => {
    const [games, setGames] = useState([]);

    useEffect(() => getTeamGames(), [teamId]);

    const getTeamGames = async () => {
        const res = await teamService.getTeamJoinedGames(teamId);
        if (res && res.code === 200) {
            let groupedGames = _.groupBy(res.value, 'organizationId');
            const newGames = _.map(groupedGames, (value, key) => {
                return { key: key, value: value };
            });
            setGames(newGames);
        }
    };

    return (
        <>
            {Array.isNullOrEmpty(games) && <ElBox mt={2} center flex={1}>No Joining Games</ElBox>}
            {!Array.isNullOrEmpty(games) && games.map((value, key) => <GamesGroup key={key} games={value.value} />)}
        </>
    );
};

const GamesGroup = ({ games }) => {
    return (
        <ElAccordion title={games[0].organizationName} divider>
            {games.map((item, index) => <GameRow key={item.id + index} game={item} />)}
        </ElAccordion>
    );
}

export default TeamJoinedGames;