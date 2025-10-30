import React, { useState } from 'react';
import { Radio, RadioGroup, FormControlLabel } from '@mui/material';
import { ElButton, ElDialog } from 'components';
import { styled } from '@mui/system';
import { Idiograph } from 'parts';

const GameRadio = styled(FormControlLabel)(() => {
    return {
        position: 'relative',
        cursor: 'pointer',
        marginLeft: 0,
        marginRight: 0,
        background: '#F0F2F7',
        borderRadius: 10,
        marginBottom: 8,
        height: 64,
        paddingLeft: 16,
        '& .MuiRadio-root': {
            position: 'absolute',
            right: 8
        }
    };
});


const ForfeitGame = ({ onClose, game, onForfeit }) => {
    const [teamId, setTeamId] = useState(null);
    const [loading, setLoading] = useState(null);

    const handleChange = event => setTeamId(event.target.value);

    const forfeit = async () => {
        setLoading(true);
        await onForfeit(teamId);
        setLoading(false);
    };

    const handleClose = () => {
        setTeamId(null);
        onClose();
    }

    return (

        <ElDialog open={!!game} onClose={handleClose} title="Which team is forfeit?"
            subTitle="Where do you want to play and go to the next step"
            actions={
                <ElButton loading={loading} disabled={!teamId} onClick={forfeit}>
                    Continue
                </ElButton>
            }>
            <RadioGroup name="forfeit" value={teamId} onChange={handleChange}>
                <GameRadio value={game?.homeTeamId} control={<Radio color="primary" />}
                    label={
                        <Idiograph title={game?.homeTeamName} imgurl={game?.homeTeamImageUrl} />
                    } />
                <GameRadio value={game?.awayTeamId} control={<Radio color="primary" />}
                    label={
                        <Idiograph title={game?.awayTeamName} imgurl={game?.awayTeamImageUrl} />
                    } />
            </RadioGroup>
        </ElDialog>

    );
};

export default ForfeitGame;
