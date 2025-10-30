import React, { useState } from 'react';
import { gameService } from 'el/api';
import { ElBody, ElButton, ElDialog, ElLinkBtn, ElOptionButton, H3 } from 'el/components';
import { CallCoordinatorSvg } from 'el/svgs';
import { Box, Row, Text } from 'native-base';
import { useElToast } from 'el/utils';
import colors from 'el/config/colors';
import { useDispatch } from 'react-redux';
import { ERROR, PENDING, SUCCESS } from 'el/store/slices/requestSlice';
import { GameStatus } from 'el/enums';

const CallCoordinator = ({ game }) => {
    const [recordIdOfCallingCoordinator, setRecordIdOfCallingCoordinator] = useState();
    const [startCallCoordinatorStatus, setStartCallCoordinatorStatus] = useState(false);
    const [isShowCancelCallingCoordinator, setIsShowCancelCallingCoordinator] = useState(false);
    const [isResuming, setIsResuming] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);
    const toast = useElToast();
    const dispatch = useDispatch();

    const handleCallCoordinatorClick = async () => {
        if (game.gameStatus !== GameStatus.Paused) {
            const res: any = await gameService.pauseGame(game.id, null);
            if (res && res.code === 200) {
                callCoordinator();
            } else {
                toast.error(res.Message);
            }
        }
        if (game.gameStatus === GameStatus.Paused) {
            callCoordinator();
        }
    };

    const callCoordinator = async () => {
        dispatch(PENDING());
        const res: any = await gameService.callCoordinator(game.id);
        if (res && res.code === 200) {
            dispatch(SUCCESS());
            setRecordIdOfCallingCoordinator(res.value);
            setStartCallCoordinatorStatus(true);
        } else {
            dispatch(ERROR());
            toast.error(res.Message);
        }
    };

    const handleResume = async () => {
        setIsResuming(true);
        const res: any = await gameService.resumeGame(game.id);

        const callRes: any = await gameService.finishCallingCoordinator(
            game.id,
            recordIdOfCallingCoordinator,
        );
        setIsResuming(false);
        if (res && res.code === 200 && callRes && callRes.code === 200) {
            setStartCallCoordinatorStatus(false);
        } else {
            toast.error(res.Message ?? callRes.Message);
        }
    };

    const handleCancel = async () => {
        setIsCancelling(true);
        const res: any = await gameService.cancelCallingCoordinator(
            game.id,
            recordIdOfCallingCoordinator,
        );
        const resumeRes: any = await gameService.resumeGame(game.id);

        setIsCancelling(false);
        if (res && res.code === 200 && resumeRes && resumeRes.code === 200) {
            setStartCallCoordinatorStatus(false);
            setIsShowCancelCallingCoordinator(true);
        }
    };

    return (
        <>
            <ElOptionButton icon={<CallCoordinatorSvg />} onPress={handleCallCoordinatorClick}>
                Call Coordinator
            </ElOptionButton>
            {startCallCoordinatorStatus && (
                <ElDialog
                    visible={startCallCoordinatorStatus}
                    onClose={() => setStartCallCoordinatorStatus(false)}
                    header={
                        <>
                            <H3 style={{ textAlign: 'center' }}>Call Coordinator</H3>
                            <ElLinkBtn style={{ textAlign: 'center', marginTop: 4 }}>
                                Coordinators have been notified that assistance is required
                            </ElLinkBtn>
                        </>
                    }
                    footer={
                        <Row>
                            <Box flex={1} mr={1}>
                                <ElButton loading={isCancelling} onPress={handleCancel}>
                                    Cancel
                                </ElButton>
                            </Box>
                            <Box flex={1} ml={1}>
                                <ElButton loading={isResuming} onPress={handleResume}>
                                    Resume
                                </ElButton>
                            </Box>
                        </Row>
                    }>
                    <ElBody textAlign="center">
                        If press Resume, direct user to Sport Module for the sport being played. If
                        press Cancel, will cancel calling coordinator
                    </ElBody>
                    <ElBody textAlign="center" fontSize={18}>
                        Game ID: {game.gameCode}
                    </ElBody>
                </ElDialog>
            )}
            {isShowCancelCallingCoordinator && (
                <ElDialog
                    visible={isShowCancelCallingCoordinator}
                    header={
                        <>
                            <H3 style={{ textAlign: 'center' }}>Call Coordinator</H3>
                            <Text textAlign="center" mt={1} color={colors.danger}>
                                Your request for assistance has been canceled
                            </Text>
                        </>
                    }
                    footer={
                        <ElButton onPress={() => setIsShowCancelCallingCoordinator(false)}>
                            Close
                        </ElButton>
                    }>
                    <ElBody textAlign="center">
                        Press Close, will direct officiate to the main play screen
                    </ElBody>
                    <ElBody textAlign="center" fontSize={18}>
                        Game ID: {game.gameCode}
                    </ElBody>
                </ElDialog>
            )}
        </>
    );
};

export default CallCoordinator;
