import { teamService } from 'el/api';
import { ElActionsheet } from 'el/components';
import { ERROR, PENDING, SUCCESS } from 'el/store/slices/requestSlice';
import { useElToast } from 'el/utils';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

const AssignPlayerNumber = ({ visible, setVisible, member, onSuccess }) => {
    const [availablePlayerNumbers, setAvailablePlayerNumbers] = useState([]);
    const toast = useElToast();
    const dispatch = useDispatch();

    useEffect(() => {
        getAvailablePlayerNumbers();
    }, [member.id]);

    const getAvailablePlayerNumbers = async () => {
        dispatch(PENDING())
        let res: any = await teamService.getAvailablePlayerNumbers(member.teamId);
        dispatch(SUCCESS())
        if (res && res.code === 200) {
            var playNumbers = res.value.map(number => {
                return { label: number, value: number };
            });
            setAvailablePlayerNumbers(playNumbers);
        }
    };

    const handleUpdatePlayerNumber = async playerNumber => {
        dispatch(PENDING());
        const res: any = await teamService.updatePlayerNumber(member.teamId, member.id, {
            playerNumber: playerNumber,
        });
        if (res && res.code === 200) {
            dispatch(SUCCESS());
            onSuccess();
            toast.success('Change number successfully!');
        } else {
            dispatch(ERROR());
            toast.error(res.Message);
        }
    };

    return (
        <ElActionsheet
            title="Select Your Player Number"
            subtitle="This is the number you will be recognized with during a game"
            isOpen={visible}
            onClose={() => { setVisible(false) }}
            items={availablePlayerNumbers}
            onSelectedItem={item => handleUpdatePlayerNumber(item?.value)}>
        </ElActionsheet>
    );
};

export default AssignPlayerNumber;
