import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { leagueService, tournamentService } from 'el/api';
import { OrganizationType } from 'el/enums';
import RenderTimeLine from 'el/screen/calendar/components/RenderTimeLine';
import CalendarWeeksTab from 'el/screen/calendar/components/CalendarWeeksTab';
import { Box } from 'native-base';
import { ElDialog } from 'el/components';
import UpdateGameInfo from './UpdateGameInfo';
import CreateGameInfo from './CreateGameInfo';

const GameSchedule = ({ isOfficial, isLowStats, isAdmin, organizationId, organizationType }) => {
    const [games, setGames] = useState<any[]>([]);
    const [selectedDate, setSelectedDate] = useState();
    const [openCreateGameDialog, setOpenCreateGameDialog] = useState(false);
    const [openUpdateGameDialog, setOpenUpdateGameDialog] = useState(false);
    const [editGame, setEditGame] = useState();

    useEffect(() => {
        getGames(selectedDate);
    }, [selectedDate]);

    const getGames = async date => {
        const res: any = await getGameService(date);
        if (res && res.code === 200) {
            setGames(res.value);
        }
    };

    const getGameService = date => {
        const currentDate = moment(date).format('YYYY-MM-DD');

        if (organizationType == OrganizationType.League) {
            return leagueService.getLeagueGamesByDate(organizationId, currentDate);
        }

        if (organizationType == OrganizationType.Tournament) {
            return tournamentService.getTournamentGamesByDate(organizationId, currentDate);
        }
    };

    const handleEditGame = (game) => {
        setOpenUpdateGameDialog(true);
        setEditGame(game);
    }

    const handleCreateGame = () => {
        isAdmin && setOpenCreateGameDialog(true);
    };

    const handleCreateGameSuccess = () => {
        setOpenCreateGameDialog(false);
        getGames(selectedDate);
    }

    const handleUpdateGameSuccess = () => {
        setOpenUpdateGameDialog(false);
        getGames(selectedDate);
    }

    return (
        <>
            <Box mt={2}>
                <CalendarWeeksTab onDayTabClick={setSelectedDate} />
                <RenderTimeLine initData={games} onEditGame={handleEditGame} onCreateGame={handleCreateGame} />
            </Box>

            <ElDialog title='Create Game' visible={openCreateGameDialog} onClose={() => setOpenCreateGameDialog(false)}>
                <CreateGameInfo
                    isOfficial={isOfficial}
                    isLowStats={isLowStats}
                    date={selectedDate}
                    organizationId={organizationId}
                    organizationType={organizationType}
                    onCancel={() => setOpenCreateGameDialog(false)}
                    onUpdateSuccess={handleCreateGameSuccess}
                />
            </ElDialog>

            <ElDialog title='Edit Game' visible={openUpdateGameDialog} onClose={() => setOpenUpdateGameDialog(false)}>
                <UpdateGameInfo
                    isOfficial={isOfficial}
                    isLowStats={isLowStats}
                    gameInfo={editGame}
                    organizationId={organizationId}
                    organizationType={organizationType}
                    onCancel={() => setOpenUpdateGameDialog(false)}
                    onUpdateSuccess={handleUpdateGameSuccess}
                />
            </ElDialog>
        </>
    );
};

export default GameSchedule;
