import React, { useState, useEffect } from 'react';
import { ElBody, ElButton, ElCheckbox, ElConfirm, ElScrollContainer, ElTitle } from 'el/components';
import { useElToast, useGameRoute, useGoBack } from 'el/utils';
import { gameService } from 'el/api';
import GameTeam from './components/GameTeam';
import GameDetail from './components/GameDetail';
import { Box, Row, Text } from 'native-base';
import routes from 'el/navigation/routes';
import { useIsFocused } from '@react-navigation/native';
import colors from 'el/config/colors';

export default function GameRecapScreen({ navigation, route }) {
    useGoBack();
    const [gameInfo, setGameInfo] = useState<any>({});
    const { gameId, gameType } = route.params;
    const [isAgree, setIsAgree] = useState(false);
    const [loading, setLoading] = useState(false);
    const { goGameLog } = useGameRoute();
    const isFocused = useIsFocused();
    const toast = useElToast();
    const scoreUnequalMessage = 'Teams score are same';
    const [isConfirmResult, setIsConfirmResult] = useState(false);

    useEffect(() => {
        if (isFocused) {
            getPostGameInfo();
        }
    }, [isFocused]);

    const getPostGameInfo = async () => {
        const res: any = await gameService.getPostGameInfo(gameId);
        if (res && res.code === 200) {
            setGameInfo(res.value);
        }
    };

    const handleConfirm = async () => {
        setLoading(true);
        const res: any = await gameService.confirmGame(gameId, false);
        setLoading(false);
        if (res && res.code === 200) {
            navigation.navigate(routes.GamePost, {
                gameId: gameId,
                gameSportType: gameType,
            });
        } else {
            if (res.Message === scoreUnequalMessage) {
                setIsConfirmResult(true);
                return;
            }

            toast.error(res.Message);
        }
    };

    const handleEditClick = () => goGameLog({ ...gameInfo, gameSportType: gameType });

    const handleConfirmScoreEqual = async () => {
        const res: any = await gameService.confirmGame(gameId, true);
        if (res && res.code === 200) {
            setIsConfirmResult(false);
            navigation.navigate(routes.GamePost, {
                gameId: gameId,
                gameSportType: gameType,
            });
        }
    }

    return (
        <ElScrollContainer>
            <ElTitle>Game ID: {gameInfo.gameCode}</ElTitle>
            <ElBody>Team Match up:</ElBody>
            <GameTeam
                url={gameInfo.homeTeamImageUrl}
                name={gameInfo.homeTeamName}
                score={gameInfo.homeTeamScore}
            />
            <GameTeam
                url={gameInfo.awayTeamImageUrl}
                name={gameInfo.awayTeamName}
                score={gameInfo.awayTeamScore}
            />

            {gameInfo.location && <GameDetail title="Location:" text={gameInfo.location} />}
            <GameDetail title="Date/Time:" text={gameInfo.startTime} />

            <ElBody mt={2}>Final review:</ElBody>
            <Box mb={6} mt={2}>
                <ElCheckbox onValueChange={() => setIsAgree(!isAgree)} value={isAgree}>
                    <ElBody>Please verify that everything displayed is correct</ElBody>
                </ElCheckbox>
            </Box>
            <Row mb={2}>
                <Box flex={1} mr={1}>
                    <ElButton onPress={handleEditClick}>Edit</ElButton>
                </Box>
                <Box flex={1} ml={1}>
                    <ElButton disabled={!isAgree} onPress={handleConfirm} variant="secondary" loading={loading}>
                        Confirm
                    </ElButton>
                </Box>
            </Row>
            {
                isConfirmResult &&
                <ElConfirm
                    title="Game Result Confirm"
                    message={<Text color={colors.danger} textAlign='center'>The score of the two teams is the same. Are you sure you want to end the game?</Text>}
                    visible={isConfirmResult}
                    onConfirm={() => handleConfirmScoreEqual()}
                    onCancel={() => setIsConfirmResult(false)}
                />
            }
        </ElScrollContainer>
    );
}
