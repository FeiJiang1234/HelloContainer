import { ElBody, ElIdiograph, ElList } from "el/components";
import { OrganizationType } from "el/enums";
import { useProfileRoute } from "el/utils";
import { Box } from "native-base";
import React from "react";
import { StyleSheet, Text } from 'react-native';

const styles = StyleSheet.create({
    elBody: {
        color: '#808A9E',
        fontSize: 10,
    },
});

const OrganizationFacilities = ({ facilities, isAdminView, organizationType, organizationId }) => {
    const { goToProfile } = useProfileRoute();

    return (
        <Box pb={10}>
            {facilities.length === 0 && <ElBody>No Facility</ElBody>}
            <ElList
                data={facilities}
                renderItem={({ item }) => (
                    <ElIdiograph
                        key={item.id}
                        onPress={() => goToProfile(OrganizationType.Facility, item.id)}
                        title={
                            <>
                                <Text>{item.name}</Text>{
                                    item.isExpired &&
                                    <ElBody style={styles.elBody}>
                                        (Expired)
                                    </ElBody>
                                }
                            </>
                        }
                        subtitle={item.address}
                        imageUrl={item.imageUrl}
                    />
                )}
            />
        </Box>
    );
};

export default OrganizationFacilities;