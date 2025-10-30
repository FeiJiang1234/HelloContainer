import React, { useState } from 'react';
import { ElButton, ElDialog, ElContent } from 'components';

const AlarmClock = ({ reminderItem }) => {
    const [openState, setOpenState] = useState(true);
    return (
        <ElDialog open={openState} title="Alarm Clock" actions={<ElButton onClick={() => setOpenState(false)}>Close</ElButton>}>
            Your {reminderItem?.type}{"'s"} time of {reminderItem.title} is up!
            {
                reminderItem.type === "Event" &&
                <ElContent>
                    Start time: {reminderItem.startTime}
                </ElContent>
            }
        </ElDialog>
    );
}

export default AlarmClock;