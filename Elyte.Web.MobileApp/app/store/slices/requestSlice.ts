import { createSlice } from '@reduxjs/toolkit';
import { requestStatus } from 'el/models/requestStatus';

const initialState = requestStatus.IDLE;

export const requestSlice = createSlice({
    name: 'requestStatus',
    initialState,
    reducers: {
        PENDING: () => requestStatus.PENDING,
        SUCCESS: () => requestStatus.SUCCESS,
        ERROR: () => requestStatus.ERROR,
    },
});

export const { PENDING, SUCCESS, ERROR } = requestSlice.actions;
export default requestSlice.reducer;
