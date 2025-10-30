import { useEffect, useState } from 'react';
import { organizationService } from 'services';

export default function useOfficialIds (userId) {
    const [officialIds, setOfficialIds] = useState([]);

    useEffect(() => getOfficialIds(), [userId]);

    const getOfficialIds = async () => {
        const res = await organizationService.getOfficialIds(userId);
        if (res && res.code === 200 && !Array.isNullOrEmpty(res.value)) {
            const ids = res.value.map(x => ({ label: x, value: x }));
            setOfficialIds([
                { value: '', label: 'None' },
                ...ids,
            ]);
        }

    };

    return { officialIds };
}
