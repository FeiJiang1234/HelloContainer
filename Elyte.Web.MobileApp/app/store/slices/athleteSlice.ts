import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { AthleteModel } from '../../models/athlete/athleteModel';

const initialState: any = {};

export const athleteSlice = createSlice({
    name: 'athlete',
    initialState,
    reducers: {
        GET_PROFILE: (state, action: PayloadAction<AthleteModel>) => action.payload,
        UPDATE_PROFILE: (state, action: PayloadAction<any>) => {
            return { ...state, ...action.payload };
        },
    },
});

export const { GET_PROFILE, UPDATE_PROFILE } = athleteSlice.actions;
export default athleteSlice.reducer;
