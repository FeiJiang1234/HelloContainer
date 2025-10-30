import React from 'react';
import { Box } from '@mui/material';
import { ElBox, ElButton } from 'components';
import { useDateTime } from 'utils';
import IdiographRow from 'parts/Commons/idiographRow';

const RequestList = ({ data, onRowClick, onAcceptClick, onDeclineClick }) => {
    const { utcToLocalDatetime } = useDateTime();

    const handleRowClick = (item) => {
        if (onRowClick) {
            onRowClick(item);
        }
    }

    const handleAcceptClick = (e, item) => {
        e.stopPropagation();
        if (onAcceptClick) {
            onAcceptClick(item);
        }
    }

    const handleDeclineClick = (e, item) => {
        e.stopPropagation();
        if (onDeclineClick) {
            onDeclineClick(item);
        }
    }

    return (
        <Box>
            {
                Array.isNullOrEmpty(data) && <ElBox center flex={1}>No Requests</ElBox>
            }
            {
                !Array.isNullOrEmpty(data) && data.map((item) => (
                    <IdiographRow key={item.requestId} title={item.title} imgurl={item.imageUrl}
                        subtitle={`Date: ${utcToLocalDatetime(item.requestDate)}`}
                        onClick={() => handleRowClick(item)}
                    >
                        <ElButton small onClick={(e) => handleAcceptClick(e, item)}>Accept</ElButton>
                        <ElButton small onClick={(e) => handleDeclineClick(e, item)}>Decline</ElButton>
                    </IdiographRow>
                ))
            }
        </Box>
    );
};

export default RequestList;