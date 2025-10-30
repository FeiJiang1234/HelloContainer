import { useState } from 'react';
import { baseballGamesType, basketballGamesType, soccerGamesType } from 'el/enums';
import { footballGamesType } from 'el/enums/footballGamesType';
import { tennisGamesType } from 'el/enums/tennisGamesType';
import { pickleballGamesType } from 'el/enums/pickleballGamesType';
import { pingpongGamesType } from 'el/enums/pingpongGamesType';
import { volleyBallGamesType } from 'el/enums/volleyBallGamesType';
import { hockeyGamesType } from 'el/enums/hockeyGamesType';
import { lacrosseGamesType } from 'el/enums/lacrosseGamesType';

export default function useGamesType(gamesType) {
    const [sportGamesType, setSportGamesType] = useState(gamesType);

    const handlerSportTypeChanged = value => {
        if (value == 'Basketball') {
            setSportGamesType(basketballGamesType);
        }
        if (value == 'Soccer') {
            setSportGamesType(soccerGamesType);
        }
        if (value == 'Baseball') {
            setSportGamesType(baseballGamesType);
        }
        if (value == 'Hockey') {
            setSportGamesType(hockeyGamesType);
        }
        if (value == 'Football') {
            setSportGamesType(footballGamesType);
        }
        if (value == 'Lacrosse') {
            setSportGamesType(lacrosseGamesType);
        }
        if (value == 'Tennis') {
            setSportGamesType(tennisGamesType);
        }
        if (value == 'Pickleball') {
            setSportGamesType(pickleballGamesType);
        }
        if (value == 'PingPong') {
            setSportGamesType(pingpongGamesType);
        }
        if (value == 'VolleyBall') {
            setSportGamesType(volleyBallGamesType);
        }

    };

    return { sportGamesType, handlerSportTypeChanged };
}
