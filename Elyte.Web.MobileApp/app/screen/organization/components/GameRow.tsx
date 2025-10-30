import React from 'react';
import { StyleSheet } from 'react-native';
import { Box, Pressable, Row, Text } from 'native-base';
import { ElIdiograph } from 'el/components';
import { GameStatus } from 'el/enums';
import { LinearGradient } from 'expo-linear-gradient';
import colors from 'el/config/colors';
import { useProfileRoute } from 'el/utils';

const GameRow = ({ game }) => {
    const { goToGameProfile, goToGamePost } = useProfileRoute();
    const isTie = game.gameStatus === GameStatus.Confirmed && game.winnerId === null;
    const isHomeWinner = game.winnerId == game.homeTeamId;
    const isAwayWinner = game.winnerId == game.awayTeamId;

    const showRank = (count, rank, isWinner) => {
        if (count && rank) {
            const color = isTie || isWinner ? colors.white : colors.secondary;
            return (
                <Text fontSize={12} color={color}>
                    Rank: {count}, {rank}
                </Text>
            );
        }

        return null;
    };

    const showPlayerCount = (starter, substituter, isWinner) => {
        if (starter !== undefined && substituter !== undefined) {
            const color = isTie || isWinner ? colors.white : colors.medium;
            return (
                <Text fontSize={12} color={color}>
                    {starter} S, {substituter} B
                </Text>
            );
        }

        return null;
    };

    const showTitle = (name, isWinner) => {
        const color = isTie || isWinner ? colors.white : colors.black;
        return <Text numberOfLines={1} ellipsizeMode='clip' color={color}>{name}</Text>;
    };

    const handleGameOnClick = () => {
        if (game.gameStatus == 'Confirmed') {
            goToGamePost(game.id, game.gameSportType);
        } else {
            goToGameProfile(game.id);
        }
    };


    const Node = ({ children, ...rest }) => {
        if (isTie)
            return (
                <LinearGradient {...colors.linear} {...rest}>
                    {children}
                </LinearGradient>
            );

        return <Box {...rest}>{children}</Box>;
    };

    return (
        <Pressable onPress={handleGameOnClick}>
            <Row justifyContent="space-between" alignItems="center" my={2}>
                <Row flex={1} mr={1} overflow='hidden' maxW={240}>
                    <Node
                        flex={1}
                        borderRadius={32}
                        bgColor={isHomeWinner ? colors.secondary : colors.white}>
                        <ElIdiograph
                            title={showTitle(game.homeTeamName, isHomeWinner)}
                            subtitle={
                                showRank(game.teamCount, game.homeTeamRank, isHomeWinner) ??
                                showPlayerCount(
                                    game.homeTeamStarter,
                                    game.homeTeamSubstituter,
                                    isHomeWinner,
                                )
                            }
                            imageUrl={game.homeTeamImageUrl}
                            onPress={handleGameOnClick}
                        />
                    </Node>
                </Row>

                {game.gameStatus === GameStatus.Confirmed && (
                    <LinearGradient {...colors.linear} style={styles.score}>
                        <Text color={colors.white}>
                            {game.homeTeamScore} / {game.awayTeamScore}
                        </Text>
                    </LinearGradient>
                )}

                <Row flex={1} ml={1} justifyContent="flex-end" overflow='hidden' maxW={240}>
                    <Node
                        flex={1}
                        borderRadius={32}
                        bgColor={isAwayWinner ? colors.secondary : colors.white}>
                        <ElIdiograph
                            reverse
                            title={showTitle(game.awayTeamName, isAwayWinner)}
                            subtitle={
                                showRank(game.teamCount, game.awayTeamRank, isAwayWinner) ??
                                showPlayerCount(
                                    game.awayTeamStarter,
                                    game.awayTeamSubstituter,
                                    isAwayWinner,
                                )
                            }
                            imageUrl={game.awayTeamImageUrl}
                            onPress={handleGameOnClick}
                        />
                    </Node>
                </Row>
            </Row>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    score: {
        minWidth: 48,
        height: 32,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
    },
});

export default GameRow;
