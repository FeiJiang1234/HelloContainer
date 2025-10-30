import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { makeStyles, useTheme } from '@mui/styles';
import Menu from '@mui/material/Menu';

const useStyles = makeStyles(theme => ({
    root: ({ left }) => ({
        '& .MuiPaper-root': {
            borderRadius: left ? '0 10px 10px 10px' : '10px 0 10px 10px',
        },
        '& .MuiPopover-paper': {
            overflow: 'visible',
        },
        '& .MuiList-root': {
            color: theme.palette.body.main,
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
        },
        '& .MuiMenuItem-root': {
            paddingTop: theme.spacing(2),
            paddingBottom: theme.spacing(2),
        },
        '& .MuiMenuItem-root:not(:last-child)': {
            borderBottom: '1px solid #F0F2F7',
        },
        '& .triangle': {
            position: 'absolute',
            top: ' -11px',
            right: !left ? '0' : null,
            left: left ? '0' : null,
            width: '0',
            height: '0',
            borderBottom: '12px solid white',
            filter: 'drop-shadow(3px -4px 3px rgb(0 0 0 / 7%))',
        },
    }),
    mmenuLeftArrow: {
        '& .triangle': {
            borderRight: '24px solid transparent',
        },
    },
    mmenuRightArrow: {
        '& .triangle': {
            borderLeft: '24px solid transparent',
        },
    },
    height: props => ({
        '& .MuiPaper-root': {
            overflowY: 'auto !important',
            height: props.height
        },
    }),
}));

function ElMenu ({ children, left, height, anchorOrigin, transformOrigin }, ref) {
    const classes = useStyles({ left, height: useTheme().spacing(height === undefined ? 0 : height) });
    const [anchorEl, setAnchorEl] = useState(null);

    useImperativeHandle(
        ref,
        () => ({
            open (el) {
                setAnchorEl(el);
            },
            close () {
                setAnchorEl(null);
            },
        }),
        [],
    );

    return (
        <Menu className={[classes.root, left ? classes.mmenuLeftArrow : classes.mmenuRightArrow, height > 0 ? classes.height : ''].join(' ')}
            anchorOrigin={anchorOrigin || { vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={transformOrigin || { vertical: 'top', horizontal: 'right' }}
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}>
            <div className="triangle"></div>
            {React.Children.map(children, child => child)}
        </Menu>
    );
}

export default forwardRef(ElMenu);
