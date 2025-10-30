import React, { useState } from 'react';
import { ElSelect, ElButton, ElDialog } from 'components';
import { useForm } from "react-hook-form";
import { useHistory } from 'react-router-dom';
import { athleteService, authService } from 'services';

const userTypes = [
    { label: 'Organization', value: 'Organization' },
];

const Organizations = [
    { label: 'Tournament', value: 'Tournament' },
    { label: 'League', value: 'League' },
];


export default function SelectFacilityUser ({ facility, onClose }) {
    const [open, setOpen] = useState(true);
    const currentUser = authService.getCurrentUser();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [facilityUsers, setFacilityUsers] = useState([]);
    const [isHideOrganizationType, setIsHideOrganizationType] = useState(true);
    const history = useHistory();


    const getUserManagedTournaments = async () => {
        const res = await athleteService.getAthleteManagedTournaments(currentUser.id, facility.sportOption);

        if (res && res.code === 200) {
            const users = res.value.map(x => ({ label: x.name, value: x.organizationId }));
            setFacilityUsers([...users]);
        }
    }

    const getUserManagedLeagues = async () => {
        const res = await athleteService.getAthleteManagedLeagues(currentUser.id, facility.sportOption);

        if (res && res.code === 200) {
            const users = res.value.map(x => ({ label: x.name, value: x.organizationId }));
            setFacilityUsers([...users]);
        }
    }

    const handleSave = (data) => {
        history.push('/facilityCalendar', { params: { facility: facility, user: data, isRentalUser: true } });
    }

    const handleClose = () => {
        setOpen(false);
        onClose && onClose();
    };


    const handleOrganizationTypeChanged = e => {
        if (e.target.value === 'Tournament') getUserManagedTournaments();
        if (e.target.value === 'League') getUserManagedLeagues();
    };

    const handleUserTypeChanged = e => {
        if (e.target.value === 'Organization') {
            setIsHideOrganizationType(false);
        }

        if (e.target.value === 'Personal User') {
            setIsHideOrganizationType(true);
        }
    }

    return (
        <ElDialog open={open} onClose={handleClose}
            actions={
                <>
                    <ElButton onClick={handleClose}>Cancel</ElButton>
                    <ElButton onClick={handleSubmit(handleSave)}>Save</ElButton>
                </>
            }>
            <form autoComplete="off" onSubmit={handleSubmit(handleSave)}>
                <ElSelect label="User Type" options={userTypes} errors={errors}
                    {...register("UserType", { required: 'This field is required.' })}
                    onChange={handleUserTypeChanged}
                />
                {
                    !isHideOrganizationType &&
                    <>
                        <ElSelect label="Organization Type" options={Organizations} errors={errors} {...register("organizationType", {})} onChange={handleOrganizationTypeChanged} />
                        <ElSelect label="Choose Facility User" options={facilityUsers} errors={errors} {...register("facilityUser", { required: 'This field is required.' })} />
                    </>
                }
            </form>
        </ElDialog>
    );
}