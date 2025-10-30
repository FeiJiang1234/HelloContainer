import React from 'react';
import Checkbox from 'expo-checkbox';
import colors from '../config/colors';
import { StyleSheet, Text, Pressable } from 'react-native';
import { Row } from 'native-base';

const ElCheckbox = ({ value, onValueChange, children, color = colors.primary }) => {
    return (
        <Row>
            <Checkbox
                value={value}
                onValueChange={onValueChange}
                color={color}
                style={styles.checkbox}
            />
            <Pressable onPress={() => onValueChange(!value)}>
                <Text style={{ marginLeft: 8 }}>{children}</Text>
            </Pressable>
        </Row>
    );
};

const styles = StyleSheet.create({
    checkbox: {
        borderColor: colors.light,
    },
});

export default ElCheckbox;
