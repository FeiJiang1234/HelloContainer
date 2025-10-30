import { gameService } from 'el/api';
import { ElButton, ElScrollContainer, ElTitle } from 'el/components';
import colors from 'el/config/colors';
import routes from 'el/navigation/routes';
import { useElToast } from 'el/utils';
import { Box, Text } from 'native-base';
import React from 'react';

const SoccerCardScreen = ({ navigation, route }) => {
    const { gameId, gameCode, teamId, athleteId, logId, isOfficiate } = route.params;
    const toast = useElToast();

    const onClickYellowCard = async () => {
        const res: any = await gameService.recordSoccerYellowCard(gameId, { teamId, athleteId, logId });
        if (res && res.code === 200) {
            goBack();
        } else {
            toast.error(res.Message);
        }
    }

    const onClickRedCard = async () => {
        const res: any = await gameService.recordSoccerRedCard(gameId, { teamId, athleteId, logId });
        if (res && res.code === 200) {
            goBack();
        } else {
            toast.error(res.Message);
        }
    }

    const goBack = () => {
        if (logId) {
            navigation.navigate(routes.SoccerLog, { gameId, gameCode, isOfficiate });
        }
        else {
            navigation.navigate(routes.SoccerScoreBoard, { gameId });
        }
    }

    return (
        <ElScrollContainer>
            <ElTitle>Card Options Page</ElTitle>
            <Box bgColor='#FFE27B' p={4} borderRadius={8}>
                <Text fontSize={18} textAlign='center'>Yellow Card</Text>
                <Text textAlign='center' mb={2}>Player will receive a yellow warning count for the game</Text>
                <ElButton onPress={onClickYellowCard}>Choose</ElButton>
            </Box>
            <Box bgColor='#FF6666' p={4} borderRadius={8} mt={2}>
                <Text fontSize={18} textAlign='center' color={colors.white}>Red Card</Text>
                <Text textAlign='center' mb={2} color={colors.white}>Player will be removed from playing for the rest of the game</Text>
                <ElButton onPress={onClickRedCard}>Choose</ElButton>
            </Box>
        </ElScrollContainer>
    );
};

export default SoccerCardScreen;
