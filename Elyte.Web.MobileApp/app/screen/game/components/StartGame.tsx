import { gameService } from 'el/api';
import { ElButton, ElConfirm } from 'el/components';
import { useGameRoute } from 'el/utils';
import React, { useState } from 'react';

const StartGame = ({ game }) => {
    const [startGameDialogStatus, setStartGameDialogStatus] = useState(false);
    const { goScoreBoard } = useGameRoute();

    const handleStartGame = async () => {
        const res: any = await gameService.startGame(game.id);
        if (res && res.code === 200) {
            setStartGameDialogStatus(false);
            goScoreBoard(game.id, game.gameSportType);
        } 
    };

    const getStartGameMessage = () => {
        return 'Are you sure you want to start this game?';
    };

    return (
        <>
            <ElButton onPress={() => setStartGameDialogStatus(true)}>Start Game</ElButton>
            <ElConfirm
                visible={startGameDialogStatus}
                title="Start Game"
                message={getStartGameMessage()}
                onCancel={() => {
                    setStartGameDialogStatus(false);
                }}
                onConfirm={handleStartGame}
            />
        </>
    );
};

export default StartGame;
