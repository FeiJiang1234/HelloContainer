import * as React from 'react';
import ElTreeNode from './ElTreeNode';

function ElTree({ children, label, game, parent, ...rest }) {
    return (
        <ElTreeNode label={label} game={game} parent={parent} {...rest}>
            {children}
        </ElTreeNode>
    );
}

export default ElTree;
