import React from 'react';
import _ from 'lodash';
import GameTreeNode from './gameTreeNode';
import { ElTree, ElTreeNode } from 'components';

export default function GameBracketTree ({
    game,
    parent,
    onForfeit,
    isOfficial,
    isLowStats,
    organizationId,
    organizationType,
    onDeleted,
    reloadBracket
}) {
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
                    onDeleted={onDeleted}
                    reloadBracket={reloadBracket}
                />
            }
            game={game}
        >
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
                    onDeleted={onDeleted}
                    reloadBracket={reloadBracket}
                />
            ))}
        </T>
    );
}
