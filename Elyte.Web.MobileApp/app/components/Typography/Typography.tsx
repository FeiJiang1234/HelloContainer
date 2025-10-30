import { Text } from 'native-base';
import React from 'react';
import { StyleSheet } from 'react-native';
import { TypographyType } from './TypographyType';

const Typography: React.FC<TypographyType> = ({ fontSize, children, center, style, ...rest }) => {
    const styleProp = {
        center,
        fontSize,
    };

    return (
        <Text style={{ ...styles(styleProp).text, ...style }} {...rest}>
            {children}
        </Text>
    );
};

const styles = ({ center, fontSize }) =>
    StyleSheet.create({
        text: {
            fontSize: fontSize,
            textAlign: center ? 'center' : 'auto',
        },
    });

export default Typography;
