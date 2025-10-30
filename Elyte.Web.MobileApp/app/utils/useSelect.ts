export default function useSelect () {
    
    const getTeamOptions = (teams) => teams.map(x => ({ label: x.title, value: x.id }));

    const getGameRoundOptions = (rounds) => {
        var options = rounds.map(x => ({ label: `${x}`, value: x }));
        options.push({ label: 'New Round', value: options.length + 1 });
        return options;
    };

    return { 
        getTeamOptions, 
        getGameRoundOptions 
    };
}
