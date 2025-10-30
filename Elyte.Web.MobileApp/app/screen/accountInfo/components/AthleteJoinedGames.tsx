import { athleteService } from 'el/api';
import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { Text } from 'native-base';
import { GamesGroup } from 'el/screen/game/components/GamesGroup';

export default function AthleteJoinedGames({ id }) {
    const [games, setGames] = useState<any[]>([]);

    useEffect(() => {
        getAthleteGames();
    }, [id]);

    const getAthleteGames = async () => {
        const res: any = await athleteService.getAthleteJoinedGames(id);
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
}
