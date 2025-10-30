import { ElBody, ElButton, ElDialog, ElIdiograph, ElRadio, H3 } from 'el/components';
import { Radio } from 'native-base';
import React, { useState } from 'react';

const ForfeitGame = ({ onClose, game, onForfeit }) => {
    const [teamId, setTeamId] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const forfeit = async () => {
        setLoading(true);
        await onForfeit(teamId);
        setLoading(false);
    };

    const handleClose = () => {
        setTeamId(null);
        onClose();
    };

    return (
        <ElDialog
            visible={!!game}
            onClose={handleClose}
            header={
                <>
                    <H3 style={{ textAlign: 'center' }}>Which team is forfeit?</H3>
                    <ElBody style={{ textAlign: 'center', marginTop: 4 }}>
                        Where do you want to play and go to the next step
                    </ElBody>
                </>
            }
            footer={
                <ElButton loading={loading} disabled={!teamId} onPress={forfeit}>
                    Continue
                </ElButton>
            }>
            <Radio.Group name="teamRadioGroup" value={teamId} onChange={setTeamId}>
                <ElRadio value={game?.homeTeamId} onPress={() => setTeamId(game?.homeTeamId)}>
                    <ElIdiograph onPress={() => setTeamId(game?.homeTeamId)}
                        title={game?.homeTeamName}
                        imageUrl={game?.homeTeamImageUrl}
                        style={{ flex: 1 }}
                    />
                </ElRadio>
                <ElRadio value={game?.awayTeamId} onPress={() => setTeamId(game?.awayTeamId)}>
                    <ElIdiograph onPress={() => setTeamId(game?.awayTeamId)}
                        title={game?.awayTeamName}
                        imageUrl={game?.awayTeamImageUrl}
                        style={{ flex: 1 }}
                    />
                </ElRadio>
            </Radio.Group>
        </ElDialog>
    );
};

export default ForfeitGame;
