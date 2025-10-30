import { ElAccordion } from 'el/components';
import GameRow from 'el/screen/organization/components/GameRow';

export const GamesGroup = ({ games }) => {
    return (
        <ElAccordion title={games[0].organizationName}>
            {games.map(item => (
                <GameRow key={item.id} game={item} />
            ))}
        </ElAccordion>
    );
};
