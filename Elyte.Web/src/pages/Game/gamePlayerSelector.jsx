import React, { useState } from 'react';
import { ElDialog, ElButton, ElSvgIcon } from 'components';
import { Idiograph } from 'parts';
import { Box, styled } from '@mui/system';
import { NewBox } from './components/scoreBoardBox';

const AthleteBox = styled(Box)(() => {
    return {
        display: 'flex',
        background: '#F0F2F7',
        alignItems: 'center',
        marginBottom: 8,
        paddingLeft: 8,
        cursor: 'pointer',
        borderRadius: 8,
        paddingTop: 4,
        paddingBottom: 4
    }
});

function GamePlayerSelector ({ onClose, open, players, onAthleteClick }) {
    const [showPlayerNumber, setShowPlayerNumber] = useState(false);
    const handleSwitchDisplay = () => {
        setShowPlayerNumber(!showPlayerNumber);
    }

    return (
        <ElDialog open={open} onClose={onClose} showCloseIcon={false} title="Player Selector" contentStyle={{ overflow: 'auto' }}>
            <>
                <ElButton sx={{ position: 'absolute', minWidth: '35px!important', width: 35, height: 35, right: 20, top: 8 }} onClick={handleSwitchDisplay}>
                    {
                        showPlayerNumber ? (<ElSvgIcon style={{ position: 'absolute', width: 20, height: 20 }} name="teams"></ElSvgIcon>) : "#"
                    }
                </ElButton>
                {
                    !showPlayerNumber && players.map(item => (
                        item.isInGame &&
                        <AthleteBox key={item.athleteId} onClick={() => onAthleteClick(item)}>
                            <Idiograph title={item.athleteName} imgurl={item.avatarUrl} subtitle={item.subtitle} centerTitle={item.centerTitle} />
                        </AthleteBox>
                    ))
                }
                {
                    showPlayerNumber &&
                    <Box sx={{ padding: '20px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                        {
                            players.map(item => (
                                item.isInGame &&
                                <NewBox sx={{ width: 65, height: 65, fontSize: 30 }} key={item.athleteId} onClick={() => onAthleteClick(item)} >{item.playerNumber}</NewBox>
                            ))
                        }
                    </Box>
                }
            </>
        </ElDialog >
    );
}

export default GamePlayerSelector;
