import { PlayoffsType } from 'enums';

export const tournamentType = [
    { value: PlayoffsType.SingleElimination.replace(" ", ""), label: PlayoffsType.SingleElimination },
    { value: PlayoffsType.DoubleElimination.replace(" ", ""), label: PlayoffsType.DoubleElimination },
    { value: PlayoffsType.RoundRobin.replace(" ", ""), label: PlayoffsType.RoundRobin }
];