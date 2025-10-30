import React, { useRef } from 'react';
import { MenuItem, Box } from '@mui/material';
import { ElMenu } from 'components';
import _ from 'lodash';

function ElMenuBtn ({ children, items }) {
    const menuRef = useRef();
    const isShowMenu = _.some(items, x => !x.hide);

    const handleClick = item => {
        item.onClick && item.onClick();
        menuRef.current.close();
    };

    const handleOpen = e => {
        if (isShowMenu) menuRef.current.open(e.currentTarget);
    };

    return (
        <>
            {
                <Box className={`${isShowMenu && 'hand'}`} onClick={handleOpen}>
                    {children}
                </Box>
            }
            <ElMenu ref={menuRef} onClose={() => menuRef.current.close()}>
                {items &&
                    items.map(
                        item =>
                            !item.hide && (
                                <MenuItem key={item.text} onClick={() => handleClick(item)}>
                                    {item.text}
                                </MenuItem>
                            ),
                    )}
            </ElMenu>
        </>
    );
}

export default ElMenuBtn;
