import * as Device from 'expo-device';

export const isPad = Device.osName === 'iPadOS';

export const isAndroid = Device.osName === 'Android';