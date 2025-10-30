import React, { useState } from 'react';
import { ElBody, ElButton, ElConfirm, ElIcon } from 'el/components';
import colors from 'el/config/colors';
import { GameStatus, SportType } from 'el/enums';
import { Box, Pressable, Row, Text } from 'native-base';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import routes from 'el/navigation/routes';

const GameLog = ({ logs, timeFormat, onRemoveLog, gameType, gameId, gameCode, isOfficiate }) => {
    const [showRemoveDialog, setShowRemoveDialog] = useState(false);
    const [logId, setLogId] = useState<any>();
    const navigation: any = useNavigation();

    const handleEditClick = selectedLogId => {
        var data = { gameId, gameCode, isOfficiate, logId: selectedLogId };
        if (gameType === SportType.Baseball) navigation.navigate(routes.BaseballActionEdit, data);
        if (gameType === SportType.Basketball) navigation.navigate(routes.BasketballActionEdit, data);
        if (gameType === SportType.Soccer) navigation.navigate(routes.SoccerActionEdit, data);
    };

    const handRemoveClick = id => {
        setShowRemoveDialog(true);
        setLogId(id);
    };

    const handleRemoveClose = () => {
        setShowRemoveDialog(false);
        setLogId(null);
    };

    const handleRemoveConfirm = async () => {
        await onRemoveLog(logId);
        setShowRemoveDialog(false);
        setLogId(null);
    };

    return (
        <Box>
            {logs.length === 0 && (
                <Text mt={2} textAlign="center">
                    Currently no activity
                </Text>
            )}
            {logs.map(x => (
                <Row key={x.id} style={styles.log} alignItems="center">
                    <Box flex={1}>
                        <Text color={colors.primary}>
                            {x.teamName} - {x.athleteName}
                        </Text>
                        <ElBody>{x.description}</ElBody>
                        <ElBody>{timeFormat(x)}</ElBody>
                    </Box>
                    {(x.gameStatus === GameStatus.End ||
                        x.gameStatus === GameStatus.Paused ||
                        x.gameStatus === GameStatus.QuarterOver) &&
                        isOfficiate && (
                            <>
                                <ElButton style={styles.edit} onPress={() => handleEditClick(x.id)}>
                                    <ElIcon name="pencil" color={colors.white}></ElIcon>
                                </ElButton>
                                <Pressable
                                    style={styles.delete}
                                    onPress={() => handRemoveClick(x.id)}>
                                    <ElIcon name="close-circle" color={colors.danger} />
                                </Pressable>
                            </>
                        )}
                </Row>
            ))}

            {showRemoveDialog && (
                <ElConfirm
                    title="Remove Log"
                    message="Are you sure you want to remove this item?"
                    visible={showRemoveDialog}
                    onCancel={handleRemoveClose}
                    onConfirm={handleRemoveConfirm}
                />
            )}
        </Box>
    );
};

const styles = StyleSheet.create({
    log: {
        backgroundColor: colors.light,
        borderRadius: 10,
        padding: 8,
        marginBottom: 8,
    },
    edit: {
        height: 36,
        width: 42,
    },
    delete: {
        position: 'absolute',
        top: -8,
        right: 0,
    },
});

export default GameLog;
