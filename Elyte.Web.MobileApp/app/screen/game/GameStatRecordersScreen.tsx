import { gameService } from 'el/api';
import {
    ElBody,
    ElConfirm,
    ElIcon,
    ElIdiograph,
    ElLinkBtn,
    ElScrollContainer,
    ElTitle,
} from 'el/components';
import { useElToast, useGoBack, useProfileRoute } from 'el/utils';
import { Divider, Row, Text, Pressable, Box, Column } from 'native-base';
import React, { useState, useEffect } from 'react';
import * as Clipboard from 'expo-clipboard';

const GameStatRecordersScreen = ({ route }) => {
    useGoBack();
    const [recorders, setRecorders] = useState<any[]>([]);
    const [recorderId, setRecorderId] = useState(null);
    const [code, setCode] = useState<any>(null);
    const [isShowGenerateCode, setIsShowGenerateCode] = useState(false);
    const { gameId, isOfficiate } = route.params;
    const { goToAthleteProfile } = useProfileRoute();
    const toast = useElToast();

    useEffect(() => {
        getStatRecorders();
        getStatRecorderCode();
    }, []);

    const getStatRecorders = async () => {
        const res: any = await gameService.getGameStatRecorders(gameId);
        if (res && res.code === 200 && res.value) {
            setRecorders(res.value);
        }
    };

    const getStatRecorderCode = async () => {
        const res: any = await gameService.getStatTrackerCode(gameId);
        if (res && res.code === 200) setCode(res.value);
    };

    const handleRemoveStatTracker = async () => {
        const res: any = await gameService.removeStatRecorder(gameId, recorderId);
        if (res && res.code === 200) {
            getStatRecorders();
            setRecorderId(null);
        }
    };

    const handleGenerateNewStatTrackerCode = async () => {
        const res: any = await gameService.generateNewStatTrackerCode(gameId);
        if (res && res.code === 200) {
            getStatRecorderCode();
            setIsShowGenerateCode(false);
        }
    };

    const handleCopyStatRecorderCode = async () => {
        await Clipboard.setStringAsync(code);
        toast.success('Copy code successfully');
    };

    return (
        <ElScrollContainer>
            <ElTitle>Stat Recorders</ElTitle>
            {isOfficiate && (
                <ElLinkBtn onPress={() => setIsShowGenerateCode(true)}>
                    Generate new stat recorder code
                </ElLinkBtn>
            )}
            {code && (
                <Box>
                    <Column py={2} justifyContent="center">
                        <ElBody>StatRecorderCode:</ElBody>
                        <Row mt={1}>
                            <ElBody>{code}</ElBody>
                            <Pressable onPress={handleCopyStatRecorderCode}>
                                <ElIcon name="content-copy" ml={1} />
                            </Pressable>
                        </Row>
                    </Column>
                    <Divider />
                </Box>
            )}

            {recorders.length === 0 && (
                <Text textAlign="center" mt={2}>
                    No Stat Recorders
                </Text>
            )}
            {recorders.map(item => (
                <React.Fragment key={item.statTrackerId}>
                    <Row my={2} alignItems="center">
                        <ElIdiograph
                            onPress={() => goToAthleteProfile(item.athleteId)}
                            title={item.title}
                            subtitle={item.subtitle}
                            centerTitle={item.centerTitle}
                            imageUrl={item.avatarUrl}
                        />
                        {isOfficiate && (
                            <Pressable
                                hitSlop={10}
                                onPress={() => setRecorderId(item.statTrackerId)}>
                                <ElIcon name="close" />
                            </Pressable>
                        )}
                    </Row>
                    <Divider />
                </React.Fragment>
            ))}

            <ElConfirm
                message="Are you sure to remove this stat tracker?"
                visible={!!recorderId}
                onCancel={() => setRecorderId(null)}
                onConfirm={handleRemoveStatTracker}
            />

            <ElConfirm
                message="Are you sure to generate new stat recorder code?"
                visible={isShowGenerateCode}
                onCancel={() => setIsShowGenerateCode(false)}
                onConfirm={handleGenerateNewStatTrackerCode}
            />
        </ElScrollContainer>
    );
};

export default GameStatRecordersScreen;
