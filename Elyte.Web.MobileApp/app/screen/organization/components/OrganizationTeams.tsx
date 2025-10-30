import React, { useState } from 'react';
import { ElBody, ElConfirm, ElIdiograph, ElList, ElMenu } from 'el/components';
import { Box, Center, HStack } from 'native-base';
import { leagueService, tournamentService } from 'el/api';
import { useElToast, useProfileRoute } from 'el/utils';
import { ActionModel } from 'el/models/action/actionModel';
import { OrganizationType } from 'el/enums';

const OrganizationTeams = ({ teams, isAdminView, organizationType, organizationId, onRefresh }) => {
    const toast = useElToast();
    const { goToTeamProfile } = useProfileRoute();
    const [isShowConfirm, setIsShowConfirm] = useState(false);
    const [currentTeam, setCurrentTeam] = useState<any>();

    const getOptions = (item) => {
        const options: ActionModel[] = [
            {
                label: 'Remove',
                onPress: () => handleRemoveClick(item),
                isHide: !isAdminView,
            },
        ];
        return options;
    }

    const handleRemoveClick = (item) => {
        setCurrentTeam(item);
        setIsShowConfirm(true)
    }

    const handleRemove = async () => {
        const res: any = await getService(organizationType, currentTeam.id);
        setIsShowConfirm(false);
        if (res && res.code === 200) {
            toast.success('Remove team successfully');
            onRefresh && onRefresh();
        } else {
            toast.error(res.Message);
        }
    };

    const getService = (type, teamId) => {
        if (type === OrganizationType.League) {
            return leagueService.removeTeamFromLeague(organizationId, teamId);
        }
        if (type === OrganizationType.Tournament) {
            return tournamentService.removeTeamFromTournament(organizationId, teamId);
        }
    };

    return (
        <Box mt={2}>
            {teams.length === 0 && <ElBody>No Teams</ElBody>}
            <ElList
                data={teams}
                renderItem={({ item }) => (
                    <HStack space={5}>
                        <ElIdiograph
                            key={item.id}
                            onPress={() => goToTeamProfile(item.id)}
                            title={item.title}
                            centerTitle={item.centerTitle}
                            subtitle={item.subtitle}
                            imageUrl={item.avatarUrl}
                        />
                        <Center>
                            <ElMenu items={getOptions(item)}></ElMenu>
                        </Center>
                    </HStack>
                )}
            />
            {isShowConfirm && (
                <ElConfirm
                    visible={isShowConfirm}
                    message={'Are you sure you want to remove this team?'}
                    onConfirm={handleRemove}
                    onCancel={() => setIsShowConfirm(false)}
                />
            )}
        </Box>
    );
};

export default OrganizationTeams;
