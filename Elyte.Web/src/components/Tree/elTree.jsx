import * as React from 'react';
import TreeNode from './elTreeNode';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(theme => ({
    root: {
        paddingInlineStart: 0,
        margin: 0,
        flex: 1,
        marginRight: theme.spacing(1),
    },
}));

function ElTree ({ children, label, ...rest }) {
    const classes = useStyles();
    return (
        <ul className={classes.root}>
            <TreeNode label={label} {...rest}>{children}</TreeNode>
        </ul>
    );
}

export default ElTree;
