export const PlayoffsType = {
    SingleElimination: 'Single Elimination',
    DoubleElimination: 'Double Elimination',
    RoundRobin: 'Round Robin',
    NoPlayoffs: 'No Playoffs'
};

export const playoffsType = [
    { value: PlayoffsType.SingleElimination.replace(" ", ""), label: PlayoffsType.SingleElimination },
    { value: PlayoffsType.DoubleElimination.replace(" ", ""), label: PlayoffsType.DoubleElimination },
    { value: PlayoffsType.NoPlayoffs.replace(" ", ""), label: PlayoffsType.NoPlayoffs }
];

export const tournamentType = [
    { value: PlayoffsType.SingleElimination.replace(" ", ""), label: PlayoffsType.SingleElimination },
    { value: PlayoffsType.DoubleElimination.replace(" ", ""), label: PlayoffsType.DoubleElimination },
    { value: PlayoffsType.RoundRobin.replace(" ", ""), label: PlayoffsType.RoundRobin }
];
