import { useState } from 'react';
import { basketballGamesType, soccerGamesType, baseballGamesType } from 'models';
import { footballGamesType } from 'models/footballGamesType';
import { tennisGamesType } from 'models/tennisGamesType';
import { pickleballGamesType } from 'models/pickleballGamesType';
import { pingpongGamesType } from 'models/pingpongGamesType';
import { volleyBallGamesType } from 'models/volleyBallGamesType';
import { hockeyGamesType } from 'models/hockeyGamesType';
import { lacrosseGamesType } from 'models/lacrosseGamesType';

export default function useGamesType(gamesType) {
    const [sportGamesType, setSportGamesType] = useState(gamesType);

    const handlerSportTypeChanged = e => sportTypeChanged(e.target.value);

    const sportTypeChanged = type => {
        if (type == 'Basketball') {
            setSportGamesType(basketballGamesType);
        }
        if (type == 'Soccer') {
            setSportGamesType(soccerGamesType);
        }
        if (type == 'Baseball') {
            setSportGamesType(baseballGamesType);
        }
        if (type == 'Hockey') {
            setSportGamesType(hockeyGamesType);
        }
        if (type == 'Football') {
            setSportGamesType(footballGamesType);
        }
        if (type == 'Lacrosse') {
            setSportGamesType(lacrosseGamesType);
        }
        if (type == 'Tennis') {
            setSportGamesType(tennisGamesType);
        }
        if (type == 'Pickleball') {
            setSportGamesType(pickleballGamesType);
        }
        if (type == 'PingPong') {
            setSportGamesType(pingpongGamesType);
        }
        if (type == 'VolleyBall') {
            setSportGamesType(volleyBallGamesType);
        }
    };

    return { sportGamesType, handlerSportTypeChanged, sportTypeChanged };
}
