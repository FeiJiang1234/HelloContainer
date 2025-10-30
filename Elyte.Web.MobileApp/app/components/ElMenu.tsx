import { ActionModel } from 'el/models/action/actionModel';
import { OptionsSvg } from 'el/svgs';
import { utils } from 'el/utils';
import { Pressable, useDisclose } from 'native-base';
import React from 'react';
import ElActionsheet from './ElActionsheet';

type PropType = {
    items: ActionModel[] | undefined;
    [rest: string]: any;
};

const ElMenu: React.FC<PropType> = ({ items, ...rest }) => {
    const menuItems = items?.filter(x => !x.isHide);
    const { isOpen, onOpen, onClose } = useDisclose();

    return (
        <>
            {
                !utils.isArrayNullOrEmpty(menuItems) &&
                <Pressable height={10} alignItems="center" justifyContent="center" onPress={onOpen}>
                    <OptionsSvg style={{ width: 20, height: 20 }} />
                </Pressable>
            }
            <ElActionsheet {...rest} isOpen={isOpen} onClose={onClose} items={menuItems} />
        </>
    )
};

export default ElMenu;
