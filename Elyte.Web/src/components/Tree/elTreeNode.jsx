import * as React from 'react';
import { styled } from '@mui/system';

const lineHeight = '20px';
const nodePadding = '5px';
const border = `2px solid #1F345D`;
const borderDashed  = `2px dashed #1F345D`;

const line = {
    content: "''",
    position: 'absolute',
    top: 0,
    height: lineHeight,
    boxSizing: 'border-box',
};

const node = {
    display: 'flex',
    alignItems: 'center',
    listStyleType: 'none',
    position: 'relative',
};

const container = {
    display: 'flex',
    paddingInlineStart: 0,
    position: 'relative',
};

const Ul = styled('ul',{
    shouldForwardProp: (prop) => prop !== 'childrenCount' && prop !== 'isAdditional'
  })(({ childrenCount, isAdditional }) => ({
    ...({ 
        ...container,
        flexDirection: 'row',
        paddingTop: lineHeight,
        '&::before': {
            ...line,
            left: '50%',
            width: 0,
            borderLeft: isAdditional ? borderDashed : border,
        }
    }),
    ...(childrenCount === 1 && { 
        paddingTop: '40px', 
        '&::before': {
            ...line,
            left: '50%',
            width: 0,
            borderLeft: isAdditional ? borderDashed : border,
            height: '40px'
    }})
}));


const Li = styled('li')(() => ({
    ...({ 
        ...node,
        flexDirection: 'column',
        padding: `${lineHeight} ${nodePadding} 0 ${nodePadding}`,
        '&::before, &::after': {
            ...line,
            right: '50%',
            width: '50%',
            borderTop: border,
        },

        '&::after': {
            left: '50%',
            borderLeft: border,
        },

        '&:only-of-type': {
            padding: 0,
            '&::before, &::after': {
                display: 'none',
            },
        },

        '&:first-of-type': {
            '&::before': {
                border: '0 none',
            },
        },

        '&:last-of-type': {
            '&::after': {
                border: '0 none',
            },
            '&::before': {
                borderRight: border,
            }
        }
    })
}));

const FirstLoss = styled('span')(() => ({
    marginTop: 8,
    marginBottom: 8
}));

function ElTreeNode ({ children, label, game }) {
    return (
        <Li>
            {label}
            { game.isAdditional && <FirstLoss>If First Loss</FirstLoss> }  
            {children.length > 0 && (
                <Ul childrenCount={children.length} isAdditional={game.isAdditional}>{children}</Ul>      
            )}
        </Li>
    );
}

export default ElTreeNode;
