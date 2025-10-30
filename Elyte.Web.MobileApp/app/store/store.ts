import { configureStore } from '@reduxjs/toolkit';
import athleteReducer from './slices/athleteSlice';
import postReducer from './slices/postSlice';
import requestReducer from './slices/requestSlice';
import routeReducer from './slices/routeSlice';
import tabBarReducer from './slices/tabBarSlice';

export const store = configureStore({
    reducer: {
        athlete: athleteReducer,
        posts: postReducer,
        request: requestReducer,
        route: routeReducer,
        tabBar: tabBarReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
