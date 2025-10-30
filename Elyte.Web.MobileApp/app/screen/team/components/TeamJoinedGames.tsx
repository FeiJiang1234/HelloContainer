import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { teamService } from 'el/api';
import { Text } from 'native-base';
import { GamesGroup } from 'el/screen/game/components/GamesGroup';

const TeamJoinedGames = ({ teamId }) => {
    const [games, setGames] = useState<any[]>([]);

    useEffect(() => {
        getTeamGames();
    }, [teamId]);

    const getTeamGames = async () => {
        const res: any = await teamService.getTeamJoinedGames(teamId);
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
            {games.length === 0 && (
                <Text mt={2} textAlign="center">
                    No Joining Games
                </Text>
            )}
            {games.map((value, key) => (
                <GamesGroup key={key} games={value.value} />
            ))}
        </>
    );
};

export default TeamJoinedGames;
