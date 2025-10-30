import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RouteModel } from 'el/models/dictionary/routeModel';

const initialState: RouteModel[] = [];

export const routeSlice = createSlice({
    name: 'route',
    initialState,
    reducers: {
        APPEND_ROUTE: (state, action: PayloadAction<RouteModel>) => {
            return [...state, action.payload];
        },
        POP_ROUTE: state => {
            state.pop();
            return state;
        },
    },
});

export const { APPEND_ROUTE, POP_ROUTE } = routeSlice.actions;
export default routeSlice.reducer;
