import { ElIdiograph, ElScrollContainer } from 'el/components';
import { StyleSheet } from 'react-native';
import { Box, Flex, Pressable, Row, Text } from 'native-base';
import React, { useState } from 'react';
import colors from 'el/config/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { TeamSvg } from 'el/svgs';

function GamePlayerSelector({ players, onAthleteClick }) {
    const [showPlayerNumber, setShowPlayerNumber] = useState(false);
    const handleSwitchDisplay = () => setShowPlayerNumber(!showPlayerNumber);

    return (
        <ElScrollContainer mt={2}>
            <Row justifyContent="center" alignItems="center" mb={1} style={{ height: 40 }}>
                {showPlayerNumber ? <Text>Player Number</Text> : <Text>Player Name</Text>}
                <Pressable onPress={handleSwitchDisplay} style={{ position: 'absolute', right: 0 }}>
                    <LinearGradient {...colors.linear} style={styles.switch}>
                        {showPlayerNumber ? (
                            <TeamSvg width={25} height={25} stroke={colors.white} />
                        ) : (
                            <Text fontSize={18} color={colors.white}>
                                #
                            </Text>
                        )}
                    </LinearGradient>
                </Pressable>
            </Row>
            {!showPlayerNumber &&
                players.map(
                    item =>
                        item.isInGame &&
                        <ElIdiograph
                            key={item.athleteId}
                            onPress={() => onAthleteClick(item)}
                            style={styles.container}
                            title={item.athleteName}
                            imageUrl={item.avatarUrl}
                            subtitle={item.subtitle}
                            centerTitle={item.centerTitle}
                        />
                )}
            {showPlayerNumber && (
                <Row flexWrap="wrap">
                    {players.map(
                        (item, index) =>
                            item.isInGame && (
                                <NumberItem
                                    key={item.athleteId}
                                    item={item}
                                    index={index}
                                    onAthleteClick={onAthleteClick}
                                />
                            ),
                    )}
                </Row>
            )}
        </ElScrollContainer>
    );
}

const NumberItem = ({ item, index, onAthleteClick }) => {
    const [isPress, setIsPress] = useState(false);

    const getNumberAlign = () => {
        if (index % 3 === 0) return 'flex-start';
        if (index % 3 === 1) return 'center';
        if (index % 3 === 2) return 'flex-end';
    };

    const handleNumberPress = () => {
        setIsPress(true);
        setTimeout(() => {
            onAthleteClick(item);
        });
    };

    return (
        <Flex key={item.athleteId} style={styles.numberItem} align={getNumberAlign()}>
            <Pressable onPress={handleNumberPress}>
                {isPress ? (
                    <LinearGradient {...colors.linear} style={styles.number}>
                        <Text color={colors.white} fontSize={24}>
                            {item.playerNumber}
                        </Text>
                    </LinearGradient>
                ) : (
                    <Box style={styles.number} bgColor={colors.light}>
                        <Text color={colors.primary} fontSize={24}>
                            {item.playerNumber}
                        </Text>
                    </Box>
                )}
            </Pressable>
        </Flex>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.light,
        padding: 8,
        paddingTop: 4,
        paddingBottom: 4,
        marginBottom: 8,
        borderRadius: 8,
    },
    switch: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    numberItem: {
        width: '33%',
        justifyContent: 'center',
        marginBottom: 8,
    },
    number: {
        width: 64,
        height: 64,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
});

export default GamePlayerSelector;
