import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../config/colors';
import { Icon } from 'native-base';

export default function ElIcon({ name, size = 6, color = colors.medium, ...rest }) {
    return <Icon as={MaterialCommunityIcons} name={name} color={color} size={size} {...rest} />;
}
