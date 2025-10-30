import React from 'react';
import {
    createStackNavigator,
    TransitionPresets,
} from '@react-navigation/stack';
import routes from './routes';
import CalendarScreen from '../screen/calendar/CalendarScreen';
import EventProfileScreen from 'el/screen/calendar/EventProfileScreen';
import EventEditScreen from 'el/screen/calendar/EventEditScreen';
import EventCreateScreen from 'el/screen/calendar/EventCreateScreen';
import EventCreateSuccessScreen from 'el/screen/calendar/EventCreateSuccessScreen';
import EventShareScreen from 'el/screen/calendar/EventShareScreen';

const Stack = createStackNavigator();

const CalendarNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                ...TransitionPresets.SlideFromRightIOS,
            }}
        >
            <Stack.Screen name={routes.CalendarScreen} component={CalendarScreen} />
            <Stack.Screen name={routes.EventProfile} component={EventProfileScreen} />
            <Stack.Screen name={routes.EventEdit} component={EventEditScreen} />
            <Stack.Screen name={routes.EventCreate} component={EventCreateScreen} />
            <Stack.Screen name={routes.EventCreateSuccess} component={EventCreateSuccessScreen} />
            <Stack.Screen name={routes.EventShare} component={EventShareScreen} />
        </Stack.Navigator>
    );
};

export default CalendarNavigator;
