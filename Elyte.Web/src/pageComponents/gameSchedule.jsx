import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import * as moment from 'moment';
import { ElDialog } from 'components';
import { OrganizationType } from 'enums';
import { tournamentService, leagueService } from 'services';
import CalendarWeeksTab from './calendarWeeksTab';
import CreateGameInfo from '../pages/Game/createGameInfo';
import UpdateGameInfo from './../pages/Game/updateGameInfo';
import RenderTimeLine from 'pages/Calendar/components/renderTimeLine';

const GameSchedule = ({ isOfficial, isLowStats, isAdmin, organizationId, organizationType }) => {
    const [openCreateGameDialog, setOpenCreateGameDialog] = useState(false);
    const [openUpdateGameDialog, setOpenUpdateGameDialog] = useState(false);
    const [editGame, setEditGame] = useState();
    const [games, setGames] = useState([]);
    const [selectedDate, setSelectedDate] = useState(moment().format("YYYY-MM-DD"));

    useEffect(() => getGames(selectedDate), []);

    const getGames = async (date) => {
        const res = await getGameService(date);
        if (res && res.code === 200) {
            setGames(res.value);
        }
    }

    const getGameService = date => {
        const currentDate = moment(date).format("YYYY-MM-DD");

        if (organizationType == OrganizationType.League) {
            return leagueService.getLeagueGamesByDate(organizationId, currentDate);
        }

        if (organizationType == OrganizationType.Tournament) {
            return tournamentService.getTournamentGamesByDate(organizationId, currentDate);
        }
    };

    const handleDayClick = (date) => {
        getGames(date);
        const myDate = moment(date).format("YYYY-MM-DD");
        setSelectedDate(myDate);
    }

    const handleEditGame = (game) => {
        setOpenUpdateGameDialog(true);
        setEditGame(game);
    }

    const handleCreateGame = () => {
        isAdmin && setOpenCreateGameDialog(true);
    };

    return (
        <Box>
            <CalendarWeeksTab onDayTabClick={handleDayClick} />
            <RenderTimeLine initData={games} onEditGame={handleEditGame} onCreateGame={handleCreateGame} />

            <ElDialog open={openCreateGameDialog} onClose={() => setOpenCreateGameDialog(false)} title="Create Game">
                <CreateGameInfo isOfficial={isOfficial} isLowStats={isLowStats} date={selectedDate} organizationId={organizationId} organizationType={organizationType} onCancel={() => setOpenCreateGameDialog(false)} />
            </ElDialog>

            <ElDialog open={openUpdateGameDialog} onClose={() => setOpenUpdateGameDialog(false)} title="Edit Game">
                <UpdateGameInfo isOfficial={isOfficial} isLowStats={isLowStats} gameInfo={editGame} organizationId={organizationId} organizationType={organizationType} onCancel={() => setOpenUpdateGameDialog(false)} />
            </ElDialog>
        </Box>
    );
}

export default GameSchedule;