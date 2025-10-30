import { useEffect, useState } from 'react';
import { athleteService } from 'services';

export default function useManagedAssociations(userId) {
    const [associations, setAssociations] = useState([]);

    useEffect(() => getAthleteManagedAssociations(), [userId]);

    const getAthleteManagedAssociations = async () => {
        const res = await athleteService.getAthleteManagedAssociations(userId);
        if (res && res.code === 200) {
            const options = res.value.map(x => ({ label: x.code, name: x.name }));
            setAssociations(options);
        }
    };

    return { associations };
}
