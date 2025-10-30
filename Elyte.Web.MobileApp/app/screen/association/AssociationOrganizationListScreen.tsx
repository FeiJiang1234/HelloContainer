import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useGoBack, useProfileRoute, utils } from 'el/utils';
import { ElScrollContainer, ElList, ElIdiograph, ElTitle } from 'el/components';
import { ERROR, PENDING, SUCCESS } from 'el/store/slices/requestSlice';
import associationService from 'el/api/associationService';

export default function AssociationOrganizationListScreen({ navigation, route }) {
    useGoBack();

    const { id, type } = route.params;
    const dispatch = useDispatch();
    const { goToProfile } = useProfileRoute();
    const [organizations, setOrganizations] = useState([]);

    useEffect(() => { getAssociationOrganizations() }, [id]);

    const getAssociationOrganizations = async () => {
        dispatch(PENDING());
        const res: any = await associationService.getAssociationOrganizations(id, type);
        if (res && res.code === 200 && res.value && res.value?.length > 0) {
            setOrganizations(res.value);
            dispatch(SUCCESS());
        } else {
            dispatch(ERROR());
        }
    };

    return (
        <ElScrollContainer>
            <ElTitle>{type}</ElTitle>
            {
                !utils.isArrayNullOrEmpty(organizations) &&
                <ElList
                    data={organizations}
                    keyExtractor={item => item.organizationId}
                    renderItem={({ item }) => (
                        <ElIdiograph
                            onPress={() => goToProfile(item.organizationType, item.organizationId)}
                            title={item.name}
                            imageUrl={item.imageUrl}
                            subtitle={item.address}
                            imageSize={48}
                        />
                    )}
                />
            }
        </ElScrollContainer>
    )
}
