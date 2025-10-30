import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { SET_TAB_BAR_STYLE } from 'el/store/slices/tabBarSlice';
import { useDispatch } from 'react-redux';

const useHideTabBar = () => {
    const dispatch = useDispatch();
    const navigation: any = useNavigation();

    useFocusEffect(() => {
        dispatch(SET_TAB_BAR_STYLE({ display: 'none' }))

        navigation.addListener('beforeRemove', () =>{
            dispatch(SET_TAB_BAR_STYLE({ display: 'flex' }))
        });
    });
};

export default useHideTabBar;
