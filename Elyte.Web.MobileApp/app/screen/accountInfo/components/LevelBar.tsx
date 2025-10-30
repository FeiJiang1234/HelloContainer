import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet } from 'react-native';
import colors from 'el/config/colors';
import { Text, View } from 'native-base';

export default function LevelBar({ level, currentExperience, nextLevelExperience, ...rest }) {
    currentExperience = Math.floor(
        parseFloat(currentExperience) ? parseFloat(currentExperience) : 0,
    );
    nextLevelExperience = Math.floor(
        parseFloat(nextLevelExperience) ? parseFloat(nextLevelExperience) : 49,
    );
    const levelWidth = currentExperience / nextLevelExperience;

    return (
        <View style={styles.container} {...rest}>
            <LinearGradient {...colors.linear} style={styles.level}>
                <Text style={styles.levelText}>{level}</Text>
            </LinearGradient>
            <Text
                style={
                    styles.experienceText
                }>{`${currentExperience}/${nextLevelExperience}`}</Text>
            <LinearGradient
                style={[styles.experience, { flex: levelWidth }]}
                colors={['rgba(90, 145, 253, 0.102194)', 'rgba(0, 39, 123, 0.497391)']}>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.light,
        height: 32,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    level: {
        height: 32,
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15,
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    levelText: {
        color: colors.white,
        fontWeight: 'bold',
    },
    experience: {
        height: '100%',
        width: 0,
        justifyContent: 'center',
        borderTopRightRadius: 15,
        borderBottomRightRadius: 15,
    },
    experienceText: {
        color: colors.white,
        fontWeight: 'bold',
        marginLeft: 8,
        position: 'absolute',
        left: 40,
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.8,
        shadowRadius: 4,
        zIndex: 1
    },
});
