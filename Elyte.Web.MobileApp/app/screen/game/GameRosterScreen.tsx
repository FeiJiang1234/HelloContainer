import { gameService } from 'el/api';
import { ElBody, ElIdiograph, ElList, ElScrollContainer, ElTitle } from 'el/components';
import { useGoBack, useProfileRoute } from 'el/utils';
import { Pressable, Row, Text } from 'native-base';
import React, { useState, useEffect } from 'react';
import { LineupLayout, Selected, Unselected } from '../organization/components/Lineup';

const GameRosterScreen = ({ route }) => {
    useGoBack();
    const [roster, setRoster] = useState<any[]>([]);
    const { gameId } = route.params;

    var teamName1 = null;
    var teamName2 = null;
    var team1Roster = new Array();
    var team2Roster = new Array();

    useEffect(() => {
        getGameRoster();
    }, []);

    const getGameRoster = async () => {
        const res: any = await gameService.getGameRoster(gameId);
        if (res && res.code === 200 && res.value) {
            setRoster(res.value);
        }
    };

    if (roster.length > 0) {
        teamName1 = roster[0].teamName;
        for (var i = 0; i < roster.length; i++) {
            if (roster[i].teamName != teamName1) {
                teamName2 = roster[i].teamName;
                break;
            }
        }
        for (var j = 0; j < roster.length; j++) {
            if (roster[j].teamName == teamName1) {
                team1Roster.push(roster[j]);
            }
            if (roster[j].teamName == teamName2) {
                team2Roster.push(roster[j]);
            }
        }
    }

    return (
        <ElScrollContainer>
            <ElTitle>Rosters</ElTitle>
            {roster.length === 0 && <Text textAlign="center">Not assigned yet</Text>}

            <ElBody textAlign="center" size="lg">
                {teamName1}
            </ElBody>
            <Row>
                <LineupLayout
                    player={<ElBody>Player</ElBody>}
                    signIn={<ElBody>Sign In</ElBody>}
                    pos={<ElBody>Pos</ElBody>}
                />
            </Row>
            <GameRosterList players={team1Roster}></GameRosterList>

            <ElBody my={2} textAlign="center" size="lg">
                {teamName2}
            </ElBody>
            <Row>
                <LineupLayout
                    player={<ElBody>Player</ElBody>}
                    signIn={<ElBody>Sign In</ElBody>}
                    pos={<ElBody>Pos</ElBody>}
                />
            </Row>
            <GameRosterList players={team2Roster}></GameRosterList>
        </ElScrollContainer>
    );
};

export default GameRosterScreen;

const GameRosterList = ({ players }) => {
    const { goToAthleteProfile } = useProfileRoute();

    return (
        <ElList
            data={players}
            keyExtractor={item => item.playerId}
            renderItem={({ item }) => (
                <LineupLayout
                    player={
                        <ElIdiograph
                            onPress={() => goToAthleteProfile(item.playerId)}
                            title={item.playerName}
                            subtitle={item.joinGameType}
                            imageUrl={item.playerPictureUrl}
                        />
                    }
                    signIn={item.isInGame ? <Selected>S</Selected> : <Unselected>B</Unselected>}
                    pos={<Unselected>{item.position}</Unselected>}
                />
            )}
        />
    );
};
