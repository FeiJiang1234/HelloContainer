import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, CardMedia } from '@mui/material';
import { ElAvatar, ElSvgIcon, ElBox, ElButton } from 'components';
import { styled } from '@mui/system';
import { gameService } from 'services'
import { useLocation } from 'react-router-dom';
import { InningHalf } from 'enums';

const Player = styled(ElAvatar)(() => { return { position: 'absolute', transform: 'rotateZ(-45deg)', border: '3px solid white', backgroundColor: 'white', borderRadius: '50%' } })
const StatName = styled(Box)(({ theme }) => { return { fontSize: 18, color: theme.palette.body.main } })
const Stat = styled(Typography)(() => { return { color: '#1F345D', fontWeight: 'bold' } })

const Square = styled(Box)(() => { return { position: 'absolute', '&:before': { content: '""', display: 'block', paddingTop: '100%' } } })
const BorderLine = styled(Square)(() => { return { width: '100%', top: '-33.5%', border: '10px solid white', transform: 'rotateZ(45deg)', borderTop: 0, borderLeft: 0 } })
const BaseArea = styled(Square)(() => { return { width: '60%', top: '20%', left: '20%', border: '10px solid white', transform: 'rotateZ(45deg)', zIndex: 1 } })
const Infield = styled(Square)(() => { return { width: '50%', top: '25%', left: '25%', transform: 'rotateZ(45deg)', background: '#63B590' } })
const HitArea = styled(Square)(() => { return { width: '30%', bottom: '-12.5%', left: 'calc(50% - 15%)', background: '#FFE0BB', borderRadius: '50%' } })

const BaseSquare = styled(Box)(() => { return { position: 'absolute', width: 30, height: 30, backgroundColor: 'white' } })
const FirstBase = styled(BaseSquare)(() => { return { right: 0, top: 0 } })
const SecondBase = styled(BaseSquare)(() => { return { left: 0, top: 0 } })
const ThirdBase = styled(BaseSquare)(() => { return { left: 0, bottom: 0 } })
const HomeBase = styled(BaseSquare)(() => { return { width: 25, height: 25, right: -5, bottom: -5, transform: 'rotateZ(45deg)' } })

const BaseEmpty = styled(Box)(() => { return { position: 'absolute', width: 36, height: 36, background: '#FFE0BB', borderRadius: '50%' } })

const Point = ({ fill }) => {
    return (
        <Box sx={[
            { width: 10, height: 10, backgroundColor: '#F0F2F7', borderRadius: '50%' },
            fill && { backgroundColor: '#17C476' }
        ]}></Box>
    )
}

const BaseballScoreBoard = () => {
    const [scoreBoard, setScoreBoard] = useState({});
    const location = useLocation();
    const gameId = location?.state?.gameId;

    useEffect(() => {
        getScoreData();
    }, []);

    const getScoreData = async () => {
        const res = await gameService.getBaseballScoreBoard(gameId);
        if (res && res.code === 200) setScoreBoard(res.value);
    }

    return (
        <>
            <ElBox col>
                <ElBox>
                    <Box>
                        <StatName sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography sx={{ minWidth: 12 }}>B</Typography>
                            <Point fill={scoreBoard.balls > 0} />
                            <Point fill={scoreBoard.balls > 1} />
                            <Point fill={scoreBoard.balls > 2} />
                            <Point fill={scoreBoard.balls > 3} />
                        </StatName>
                        <StatName sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography sx={{ minWidth: 12 }}>S</Typography>
                            <Point fill={scoreBoard.strikes > 0} />
                            <Point fill={scoreBoard.strikes > 1} />
                            <Point fill={scoreBoard.strikes > 2} />
                        </StatName>
                        <StatName sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography sx={{ minWidth: 12 }}>O</Typography>
                            <Point fill={scoreBoard.outs > 0} />
                            <Point fill={scoreBoard.outs > 1} />
                            <Point fill={scoreBoard.outs > 2} />
                        </StatName>
                    </Box>
                    <ElBox sx={{ display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'center' }}>
                        <Stat sx={{ fontSize: 32 }}>
                            {scoreBoard.inning}th &nbsp;
                            {scoreBoard.inningHalf === InningHalf.FirstHalf && <ElSvgIcon small name="rightArrow" style={{ transform: 'rotateZ(-90deg)' }} />}
                            {scoreBoard.inningHalf === InningHalf.SecondHalf && <ElSvgIcon small name="rightArrow" style={{ transform: 'rotateZ(90deg)' }} />}
                        </Stat>
                        <ElBox>Time: <Stat>00:13:21</Stat></ElBox>
                        <ElButton small sx={{ borderRadius: 10 }}>Game Options</ElButton>
                    </ElBox>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <ElBox col>
                            <StatName>H</StatName>
                            <Stat>{scoreBoard.homeTeamHits}</Stat>
                            <Stat>{scoreBoard.awayTeamHits}</Stat>
                        </ElBox>
                        <ElBox col>
                            <StatName>R</StatName>
                            <Stat>{scoreBoard.homeTeamRuns}</Stat>
                            <Stat>{scoreBoard.awayTeamRuns}</Stat>
                        </ElBox>
                        <ElBox col>
                            <StatName>E</StatName>
                            <Stat>{scoreBoard.homeTeamErrors}</Stat>
                            <Stat>{scoreBoard.awayTeamErrors}</Stat>
                        </ElBox>
                    </Box>
                </ElBox>
                <Box pt={1} pb={1} mt={1} sx={{ backgroundColor: '#63B590', flex: 1, flexDirection: 'column', overflow: 'hidden' }}>
                    <Box ml={2} mr={2}>
                        <Box sx={{
                            width: '100%', background: '#FFE0BB', borderRadius: '50%', position: 'relative',
                            '&:before': { content: '""', display: 'block', paddingTop: '90%' }
                        }}>
                            <BorderLine />
                            <Infield />
                            <BaseArea>
                                <FirstBase>
                                    {scoreBoard.runnerOnFirstUrl && <Player large sx={{ top: -25 }} src={scoreBoard.runnerOnFirstUrl} />}
                                </FirstBase>

                                <SecondBase>
                                    {scoreBoard.runnerOnSecondUrl && <Player large sx={{ top: -25, left: -25 }} src={scoreBoard.runnerOnSecondUrl} />}
                                </SecondBase>

                                <ThirdBase>
                                    {scoreBoard.runnerOnThirdUrl && <Player large sx={{ left: -25 }} src={scoreBoard.runnerOnThirdUrl} />}
                                </ThirdBase>

                                <HomeBase></HomeBase>

                                {scoreBoard.pitcherUrl && <Player large sx={{ top: 'calc(50% - 25px)', left: 'calc(50% - 25px)' }} src={scoreBoard.pitcherUrl} />}
                                {!scoreBoard.pitcherUrl && <BaseEmpty sx={{ top: 'calc(50% - 20px)', left: 'calc(50% - 20px)' }}></BaseEmpty>}

                                {scoreBoard.hitterUrl && <Player large sx={{ bottom: -25, right: -25 }} src={scoreBoard.hitterUrl} />}
                            </BaseArea>
                            <HitArea />
                        </Box>
                    </Box>

                    <Box ml={1} mt={2} mr={1} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Card sx={{ width: 112, height: 140, '& .MuiCardContent-root': { p: 0.5, textAlign: 'center' } }}>
                            <CardMedia component="img" image="images/joshua.png" />
                            <CardContent>J.Pata</CardContent>
                        </Card>
                        <Card sx={{ width: 112, height: 140, '& .MuiCardContent-root': { p: 0.5, textAlign: 'center' } }}>
                            <CardMedia component="img" image="images/chantz.png" />
                            <CardContent>C.Oliver</CardContent>
                        </Card>
                    </Box>
                </Box>
            </ElBox>
        </>
    );
};

export default BaseballScoreBoard;
