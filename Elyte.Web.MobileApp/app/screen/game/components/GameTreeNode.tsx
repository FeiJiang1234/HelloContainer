import React, { useState } from 'react';
import { Box, Flex, Pressable, Text, useDisclose } from 'native-base';
import { StyleSheet } from 'react-native';
import { ElActionsheet, ElBody, ElDialog, ElIdiograph,ElConfirm, ElIcon } from 'el/components';
import { utils } from 'el/utils';
import colors from 'el/config/colors';
import moment from 'moment';
import UpdateGameInfo from './UpdateGameInfo';
import { useNavigation } from '@react-navigation/native';
import routes from 'el/navigation/routes';
import ForfeitGame from './ForfeitGame';
import { ActionModel } from 'el/models/action/actionModel';
import { GameStatus, OrganizationType } from 'el/enums';
import { LinearGradient } from 'expo-linear-gradient';
import OfficiatesSvg from 'el/svgs/officiatesSvg';
import { gameService, leagueService, tournamentService } from 'el/api';
import SetGameScores from './SetGameScores';

type PropType = {
    game: any;
    parent?: any;
    onForfeit?: any;
    isOfficial: boolean;
    isLowStats: boolean;
    organizationId: string;
    organizationType: string;
    onUpdateGameSuccess?: any;
    reloadBracket?: any;
    onDeleted?: any;
};

const GameTreeNode: React.FC<PropType> = ({
    game,
    onForfeit,
    isOfficial,
    isLowStats,
    organizationId,
    organizationType,
    onUpdateGameSuccess,
    reloadBracket,
    onDeleted
}) => {
    const navigation: any = useNavigation();
    const [openUpdateGameDialog, setOpenUpdateGameDialog] = useState(false);
    const [openDeleteDialogOpen, setOpenDeleteDialogOpen] = useState(false);
    const [openPostponeGameDialog, setOpenPostponeGameDialog] = useState(false);
    const [showSetScores, setShowSetScores] = useState(false);
    const [forfeitedGame, setForfeitedGame] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclose();
    const isTie = game.gameStatus === GameStatus.Confirmed && game.winnerId === null;
    const isHomeWinner = game.winnerId == game.homeTeamId;
    const isAwayWinner = game.winnerId == game.awayTeamId;

    const options: ActionModel[] = [];
    const gameNotSatrtedYet = game.gameStatus === null;

    options.push({
        label: 'Game Page',
        onPress: () => navigation.navigate(routes.GameProfile, { id: game.id }),
    });

    if((game.isAdmin || game.isCoordinator) && isLowStats && !utils.isGuidEmpty(game.homeTeamId) && !utils.isGuidEmpty(game.awayTeamId)){
        options.push({
            label: 'Set Scores',
            onPress: () => setShowSetScores(true),
        });
    }

    if (game.isAdmin && gameNotSatrtedYet) {
        options.push({
            label: 'Schedule Game',
            onPress: () => setOpenUpdateGameDialog(true),
        });

        if (game.isRoundRobin && !game.isPostponed) {
            options.push({
                label: 'Postpone',
                onPress: () => setOpenPostponeGameDialog(true),
            });
        }
    }

    if ((game.isAdmin || game.isCoordinator) && gameNotSatrtedYet && game.isRoundRobin) {
        options.push({
            label: 'Delete',
            onPress: () => setOpenDeleteDialogOpen(true),
        });
    }

    if (
        (game.isOfficiate || game.isAdmin || game.isCoordinator) &&
        game.gameStatus === null &&
        !utils.isGuidEmpty(game.homeTeamId) &&
        !utils.isGuidEmpty(game.awayTeamId) &&
        game.winnerId === null
    ) {
        options.push({
            label: 'Assign a Forfeit',
            onPress: () => setForfeitedGame(game),
        });
    }

    const handleUpdateSuccess = () => {
        setOpenUpdateGameDialog(false);
        onUpdateGameSuccess && onUpdateGameSuccess();
    };

    const handleClose = () => setForfeitedGame(null);

    const handleForfeit = async teamId => {
        await onForfeit(game.id, teamId, organizationId);
        handleClose();
    };

    const getNameColor = isWinner => (isTie || isWinner ? colors.white : colors.primary);
    const getRankColor = isWinner => (isTie || isWinner ? colors.white : colors.secondary);

    const handleYesToDeleteClick = async () => {
        const res: any = await gameService.deleteGame(game.id);
        if (res && res.code === 200) {
            setOpenDeleteDialogOpen(false);
            onDeleted && onDeleted(game);
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

    const handleGamePress = () => {
        const isManager = game.isOfficiate || game.isAdmin || game.isCoordinator;
        const isGameStarted = game.gameStatus == null;

        if(!isManager || (isManager && !isGameStarted)) {
            navigation.navigate(routes.GameProfile, { id: game.id });
        }

        if (isManager && isGameStarted) {
            onOpen();
        }
    }
    const handlePostponeGame = async () => {
        const res: any = await getPostponeService();
        if (res && res.code === 200) {
            setOpenPostponeGameDialog(false);
            reloadBracket && reloadBracket();
        }
    }

    const getPostponeService = () => {
        if (organizationType == OrganizationType.League) {
            return leagueService.postponeGame(organizationId, game.id);
        }

        if (organizationType == OrganizationType.Tournament) {
            return tournamentService.postponeGame(organizationId, game.id);
        }
    };

    return (
        <>
            <Pressable onPress={handleGamePress}>
                <Box style={styles.container}>
                    <Node style={[styles.team, isHomeWinner && styles.winner]}>
                        <ElIdiograph
                            title={
                                <>
                                    <Text fontSize={12} color={getNameColor(isHomeWinner)}>
                                        {game.homeTeamName}
                                    </Text>
                                    <ElBody color={getRankColor(isHomeWinner)} fontSize={10}>
                                        {!utils.isGuidEmpty(game.homeTeamId) &&
                                            `Rank: ${game.teamCount}, ${game.homeTeamRank}`}
                                    </ElBody>
                                </>
                            }
                            imageUrl={game.homeTeamImageUrl}
                            imageSize={28}
                            flex={1}
                            onPress={handleGamePress}
                        />
                        {game.isOfficiate && <OfficiatesSvg width="14" height="16" style={styles.officiate} />}
                        {game.isPostponed && (
                            <ElIcon name="clock-outline" style={styles.postpone} size={5} color={colors.primary}/>
                        )}  

                    </Node>
                    <Node style={[styles.team, { marginTop: 4 }, isAwayWinner && styles.winner]}>
                        <ElIdiograph
                            title={
                                <>
                                    <Text fontSize={12} color={getNameColor(isAwayWinner)}>
                                        {game.awayTeamName}
                                    </Text>
                                    <ElBody color={getRankColor(isAwayWinner)} fontSize={10}>
                                        {!utils.isGuidEmpty(game.awayTeamId) &&
                                            `Rank: ${game.teamCount}, ${game.awayTeamRank}`}
                                    </ElBody>
                                </>
                            }
                            imageUrl={game.awayTeamImageUrl}
                            imageSize={28}
                            flex={1}
                            onPress={handleGamePress}
                        />
                    </Node>

                    <Flex mt={1} minH={10} justify="center">
                        {game.gameStatus === null && (
                            <>
                                <ElBody size="sm">Game will be on</ElBody>
                                <ElBody size="sm" color={colors.primary} textAlign="center">
                                    {game.startTime && moment(game.startTime).format('MM.DD.YYYY')}
                                </ElBody>
                            </>
                        )}
                        {game.gameStatus !== null && (
                            <ElBody size="sm" color={colors.primary}>
                                See the game
                            </ElBody>
                        )}
                    </Flex>
                </Box>
            </Pressable>

            <ForfeitGame onClose={handleClose} game={forfeitedGame} onForfeit={handleForfeit} />

            {
                openUpdateGameDialog && (
                    <ElDialog
                        visible={openUpdateGameDialog}
                        onClose={() => setOpenUpdateGameDialog(false)}
                        title="Edit Game Info">
                        <UpdateGameInfo
                            isOfficial={isOfficial}
                            isLowStats={isLowStats}
                            gameInfo={game}
                            organizationId={organizationId}
                            organizationType={organizationType}
                            onCancel={() => setOpenUpdateGameDialog(false)}
                            onUpdateSuccess={handleUpdateSuccess}
                        />
                    </ElDialog>
                )
            }

            <ElActionsheet isOpen={isOpen} onClose={onClose} items={options} />
            {
                openDeleteDialogOpen && <ElConfirm
                    visible={openDeleteDialogOpen}
                    title="Delete game"
                    message="Are you sure you want to delete the current game?"
                    onConfirm={handleYesToDeleteClick}
                    onCancel={() => setOpenDeleteDialogOpen(false)}
                />
            }
            {
                openPostponeGameDialog && <ElConfirm
                    visible={openPostponeGameDialog}
                    title="Postpone Game"
                    message="Are you sure you want to postpone the current game?"
                    onConfirm={handlePostponeGame}
                    onCancel={() => setOpenPostponeGameDialog(false)}
             />
            }
             {showSetScores && <SetGameScores open={showSetScores} onClose={() => setShowSetScores(false)} game={game} reloadBracket={reloadBracket}/>}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        backgroundColor: colors.disabled,
        alignItems: 'center',
        padding: 8,
        borderRadius: 8,
        width: 140,
        marginBottom: 8,
        marginLeft: 4,
        marginRight: 4,
    },
    team: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 8,
        paddingLeft: 4,
        paddingRight: 4,
        height: 48,
        width: '100%',
    },
    winner: {
        backgroundColor: '#17C476',
    },
    officiate: {
        position: 'absolute',
        top: -4,
        left: -4
    },
    postpone: {
        position: 'absolute',
        top: -6,
        right: -6
    },
});

export default GameTreeNode;
