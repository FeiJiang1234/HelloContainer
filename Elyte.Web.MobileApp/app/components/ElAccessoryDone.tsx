import React from 'react';
import colors from '../config/colors';
import { Platform, Button, InputAccessoryView, Keyboard, View, useWindowDimensions } from 'react-native';

export default function ElAccessoryDone() {
    if (Platform.OS !== 'ios') return null;
    const { width } = useWindowDimensions();

    return (
        <InputAccessoryView nativeID="InputAccessoryDone">
            <View
                style={{
                    backgroundColor: colors.white,
                    width: width,
                    height: 50,
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    shadowColor: colors.black,
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.5,
                    shadowRadius: 4,
                }}>
                <Button onPress={Keyboard.dismiss} title="Done" />
            </View>
        </InputAccessoryView>
    );
}
