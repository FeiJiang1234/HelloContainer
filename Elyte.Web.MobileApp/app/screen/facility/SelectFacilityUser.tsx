import React, { useState } from 'react';
import { useFormik } from 'formik';
import { ElButton, ElDialog, ElErrorMessage, ElSelectEx, H3 } from 'el/components';
import { useAuth } from 'el/utils';
import { athleteService } from 'el/api';
import { Box, Row } from 'native-base';
import * as Yup from 'yup';
import routes from 'el/navigation/routes';
import { useNavigation } from '@react-navigation/native';


const Organizations = [
    { label: 'Tournament', value: 'Tournament' },
    { label: 'League', value: 'League' },
];

const validates = Yup.object().shape({
    facilityUser: Yup.string().required().label('facilityUser'),
});

const SelectFacilityUser = ({ facility, onClose }) => {
    const navigation: any = useNavigation();
    const { user } = useAuth();
    const [facilityUsers, setFacilityUsers] = useState<any>([]);
    const { handleSubmit, errors, touched, setFieldValue } = useFormik({
        initialValues: {
            facilityUser: ''
        },
        validationSchema: validates,
        onSubmit: values => handleSave(values),
    });
    const [open, setOpen] = useState(true);

    const getUserManagedTournaments = async () => {
        const res: any = await athleteService.getAthleteManagedTournaments(user.id, facility.sportOption);

        if (res && res.code === 200) {
            const users: any = res.value.map(x => ({ label: x.name, value: x.organizationId }));
            setFacilityUsers([...users]);
        }
    }

    const getUserManagedLeagues = async () => {
        const res: any = await athleteService.getAthleteManagedLeagues(user.id, facility.sportOption);

        if (res && res.code === 200) {
            const users = res.value.map(x => ({ label: x.name, value: x.organizationId }));
            setFacilityUsers([...users]);
        }
    }

    const handleSave = (data) => {
        setOpen(false);
        navigation.navigate(routes.FacilityCalendar, { facility: facility, user: data, isRentalUser: true });
    }

    const handleOrganizationTypeChanged = e => {
        setFieldValue('organizationType', e.value)
        if (e.value === 'Tournament') getUserManagedTournaments();
        if (e.value === 'League') getUserManagedLeagues();
    };

    return (
        <ElDialog
            visible={open}
            onClose={onClose}
            header={
                <H3 style={{ textAlign: 'center' }}>Select Your Organization</H3>
            }
            footer={
                <Row>
                    <Box flex={1} mr={1}>
                        <ElButton onPress={onClose}>
                            Cancel
                        </ElButton>
                    </Box>
                    <Box flex={1} ml={1}>
                        <ElButton onPress={handleSubmit}>
                            Save
                        </ElButton>
                    </Box>
                </Row>
            }>
            <ElSelectEx
                placeholder="Organization Type"
                items={Organizations}
                errors={errors}
                name="organizationType"
                onSelectedItem={item => handleOrganizationTypeChanged(item)}
            />
            <ElSelectEx
                placeholder="Choose Facility User"
                items={facilityUsers}
                name="facilityUser"
                onSelectedItem={item => setFieldValue('facilityUser', item.value)}
            />
            <ElErrorMessage error={errors['facilityUser']} visible={touched['facilityUser']} />
        </ElDialog>
    );
}

export default SelectFacilityUser;