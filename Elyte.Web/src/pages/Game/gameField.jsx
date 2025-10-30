import React, { useState } from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import { SportType } from 'enums';

const Container = styled(Box)(() => {
    return {
        position: 'relative',
        background: '#F0F2F7',
        '&:before': { content: '""', display: 'block', paddingTop: '112%' },
    };
});

const Field = styled(Box)(({ sportType }) => ({
   ...({
        width: '90%',
        height: '90%',
        position: 'absolute',
        top: '5%',
        left: '5%',
        padding: 8
    }), 
    ...(sportType === SportType.Basketball && { background: '#FFBA93' }),
    ...(sportType === SportType.Soccer && { background: '#17C476' }),
}));

const InSide = styled(Box)(({ sportType }) => ({
    ...({
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        width: '100%',
        height: '100%',
        position: 'relative'
     }), 
     ...(sportType === SportType.Basketball && { backgroundImage: 'url(/svgs/basketballCourt.svg)' }),
     ...(sportType === SportType.Soccer && { backgroundImage: 'url(/svgs/soccerField.svg)' }),
 }));

 const Shot = styled(Box)(({ sportType }) => ({
    ...({
        position: 'absolute',
        width: 20,
        height: 20,
        borderRadius: '50%'
     }), 
     ...(sportType === SportType.Basketball && {  border: '3px solid #17C476' }),
     ...(sportType === SportType.Soccer && {  border: '3px solid yellow' }),
 }));

const MissShot = styled(CloseIcon)(() => {
    return {
        position: 'absolute',
        width: 25,
        color: 'red'
    };
});

const GameField = ({ isMissShot, onSelectPosition, shots, sportType }) => {
    const [position, setPosition] = useState({});

    const setShotPosition = async e => {
        if(!onSelectPosition) return;

        var rect = e.target.getBoundingClientRect();
        var xToParent = e.clientX - rect.left;
        var yToParent = e.clientY - rect.top;
        var parentWidth = e.target.clientWidth;
        var parentHeight = e.target.clientHeight;

        const xPercent = `calc(${Math.round((xToParent / parentWidth) * 10000) / 100.0}% - 10px)`;
        const yPercent = `calc(${Math.round((yToParent / parentHeight) * 10000) / 100.0}% - 10px)`;
        setPosition({ x: xPercent, y: yPercent });
        await onSelectPosition({ x: xPercent, y: yPercent });
    };

    return (
        <>
            <Container>
                <Field sportType={sportType}>
                    <InSide onClick={e => setShotPosition(e)} sportType={sportType}>
                        {position.x && position.y && (
                           isMissShot ? 
                           <MissShot sx={{ left: position.x, top: position.y }} /> : 
                           <Shot sx={{ left: position.x, top: position.y }} sportType={sportType}/>
                        )}
                        {shots?.map(x=> (
                           x.isMissShot? 
                           <MissShot key={x.id} sx={{ left: x.positionX, top: x.positionY }} /> : 
                           <Shot key={x.id} sx={{ left: x.positionX, top: x.positionY }} sportType={sportType}/>
                        ))}
                    </InSide>
                </Field>
            </Container>
            <Box sx={{ position: 'relative', height: 20, mt: 1, display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
                <Shot sx={{ position: 'relative', mr: 0.5 }} sportType={sportType}/> Made Shot
                <MissShot sx={{ position: 'relative', ml: 2 }}/> Missed Shot
            </Box>
        </>
    );
};

export default GameField;
