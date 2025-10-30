import { useState, useEffect } from 'react';
import { PlayoffsType } from 'enums';
import { utils } from 'utils';

export default function useRounds (bracketType) {
    const [round, setRound] = useState();
    const [defaultRound, setDefaultRound] = useState();
    const [rounds, setRounds] = useState([]);
    const [roundMenu, setRoundMenu] = useState([]);
    const isRoundRobin = bracketType === PlayoffsType.RoundRobin.replace(" ", "");

    useEffect(() => {
        if(isRoundRobin){
            var menu = rounds.map((x) => getMenuItem(x, `${utils.numberToOrdinal(x)} ROUND`));
            setRoundMenu(menu);
            return;
        }

        var roundNames = ['FINAL', 'HALF FINAL'];
        var hasAdditionalGameRound = rounds.includes(-1);
        if (hasAdditionalGameRound) roundNames.unshift('Additional Final');
        var eliminationMenu = rounds.filter(x => x != -1).map((x, idx) => {
            var isChangeRoundName = roundNames[idx] !== undefined;
            let roundName = isChangeRoundName ? roundNames[idx] : `${utils.numberToOrdinal(x)} ROUND`;
            return getMenuItem(x, roundName);
        });
        
        eliminationMenu.unshift(getMenuItem(0, 'ALL'));

        setRoundMenu(eliminationMenu);
    }, [rounds, bracketType]);

    useEffect(() => {
        const currentRound = getRound();
        setRound(currentRound);
    }, [defaultRound]);

    const getMenuItem = (value, text) => {
        return {
            value: value, 
            text: text, 
            onClick: () => setRound({ value: value, text: text })
        };
    }

    const getRound = () => {
        if(!isRoundRobin){
            const eliminationRound = roundMenu.find(x=>x.text === 'ALL');
            return eliminationRound;
        }

        const robinRound = roundMenu.find(x=>x.value === defaultRound);
        return robinRound;
    }

    return { round, rounds, roundMenu, setDefaultRound, setRounds };
}
