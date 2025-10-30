import { ElTree, ElTreeNode } from 'el/components';
import React from 'react';
import GameTreeNode from './GameTreeNode';
import _ from 'lodash';

type PropType = {
    game: any;
    parent?: any;
    onForfeit?: any;
    isOfficial: boolean;
    isLowStats: boolean;
    organizationId: string;
    organizationType: string;
    onUpdateGameSuccess?: any;
};

const GameBracketTree: React.FC<PropType> = ({
    game,
    parent,
    onForfeit,
    isOfficial,
    isLowStats,
    organizationId,
    organizationType,
    onUpdateGameSuccess,
}) => {
    const T = parent ? ElTreeNode : props => <ElTree {...props}>{props.children}</ElTree>;
    return (
        <T
            label={
                <GameTreeNode
                    game={game}
                    onForfeit={onForfeit}
                    isOfficial={isOfficial}
                    isLowStats={isLowStats}
                    organizationId={organizationId}
                    organizationType={organizationType}
                    onUpdateGameSuccess={onUpdateGameSuccess}
                />
            }
            parent={parent}
            game={game}>
            {_.map(game.children, child => (
                <GameBracketTree
                    key={child.id}
                    game={child}
                    parent={game}
                    onForfeit={onForfeit}
                    isOfficial={isOfficial}
                    isLowStats={isLowStats}
                    organizationId={organizationId}
                    organizationType={organizationType}
                    onUpdateGameSuccess={onUpdateGameSuccess}
                />
            ))}
        </T>
    );
};

export default GameBracketTree;
