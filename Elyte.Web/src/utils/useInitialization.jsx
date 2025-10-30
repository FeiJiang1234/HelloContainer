import { useEffect, useState } from 'react';
import { authRoutes } from '../routers/authRouters';

export default function useInitialization () {
    const [routers, setRouters] = useState([]);
    useEffect(() => { buildRouters(); }, []);

    const buildRouters = () => {
        let routeList = [];
        const modulesFiles = require.context('pages', true, /.jsx$/);
        modulesFiles.keys().reduce((modules, modulePath) => {
            const moduleName = modulePath.replace(/^.\/(.*)\.jsx/, '$1');
            const route = authRoutes.find(x => x.filePath.replace('pages/', '') === moduleName);
            if (route) {
                const value = modulesFiles(modulePath);
                routeList.push({ component: value.default, routePath: route.routePath });
            }
        }, {})

        routeList.push({ routePath: '*', IsRedirect: true, RedirectTo: '404' });
        setRouters(routeList);
    }

    return { routers }
}
