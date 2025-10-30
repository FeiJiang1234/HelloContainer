import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

const initialState: any = { display: 'flex' };

export const tabBarSlice = createSlice({
    name: 'tabBar',
    initialState,
    reducers: {
        SET_TAB_BAR_STYLE: (state, action: PayloadAction<any>) => action.payload
    },
});

export const { SET_TAB_BAR_STYLE } = tabBarSlice.actions;
export default tabBarSlice.reducer;
