import { PlayoffsType } from 'enums';

export const playoffsType = [
    { value: PlayoffsType.SingleElimination.replace(" ", ""), label: PlayoffsType.SingleElimination },
    { value: PlayoffsType.DoubleElimination.replace(" ", ""), label: PlayoffsType.DoubleElimination },
    { value: PlayoffsType.NoPlayoffs.replace(" ", ""), label: PlayoffsType.NoPlayoffs}
];
