import * as React from 'react';
import { Box, Divider } from 'native-base';
import colors from 'el/config/colors';

const Ul = ({ children, childrenCount }) => {
    return (
        <Box
            style={{
                display: 'flex',
                flexDirection: 'row',
                paddingTop: 8,
            }}>
            {childrenCount > 1 && (
                <>
                    <Divider
                        bg={colors.medium}
                        style={{ position: 'absolute' }}
                        left="50%"
                        top={-8}
                        orientation="vertical"
                        height={2}
                        thickness="2"
                    />
                </>
            )}
            {children}
        </Box>
    );
};

const Li = ({ children, game, parent }) => {
    const childrenCount = parent?.children?.length ?? 0;
    return (
        <Box
            style={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                paddingTop: 8,
            }}>
            {parent && childrenCount === 2 && (
                <Divider
                    bg={colors.medium}
                    style={{ position: 'absolute' }}
                    top={-8}
                    orientation="vertical"
                    thickness="2"
                    height={8}
                />
            )}
            {parent && childrenCount === 1 && (
                <Divider
                    bg={colors.medium}
                    style={{ position: 'absolute' }}
                    top={-16}
                    orientation="vertical"
                    thickness="2"
                    height={8}
                />
            )}
            {parent && childrenCount === 2 && (
                <Divider
                    bg={colors.medium}
                    style={{
                        position: 'absolute',
                        left: game.id === parent.children[0].id ? '50%' : 0,
                        width: '50%',
                    }}
                    thickness="2"
                    top={-8}
                />
            )}

            {children}
        </Box>
    );
};

function ElTreeNode({ children, label, game, parent, ...rest }) {
    return (
        <Li parent={parent} game={game} {...rest}>
            {label}
            {game.isAdditional && <Box my={2}>If First Loss</Box>}
            {children.length > 0 && <Ul childrenCount={children.length}>{children}</Ul>}
        </Li>
    );
}

export default ElTreeNode;
