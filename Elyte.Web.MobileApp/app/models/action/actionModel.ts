export interface ActionModel {
    label?: string;
    icon?: string;
    onPress: Function;
    color?: string;
    isHide?: boolean;
    isHideByData?: Function;
    confirmMessage?: string;
}
