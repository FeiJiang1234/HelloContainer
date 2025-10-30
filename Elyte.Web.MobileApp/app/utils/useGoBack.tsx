import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { RootState } from 'el/store/store';
import { Pressable } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import GoBack from '../svgs/goBack';
import { POP_ROUTE } from 'el/store/slices/routeSlice';
import { isPad } from 'el/config/constants';
import { Box } from 'native-base';

type PropType = {
    backTo?: string;
    params?: any;
};

const useGoBack = ({ backTo, params }: PropType = {}) => {
    const route = useSelector((state: RootState) => state.route);
    const navigation: any = useNavigation();
    const { name } = useRoute<any>();
    const dispatch = useDispatch();

    const handleGoBack = () => {
        if (!!backTo) {
            navigation.navigate(backTo, { ...params });
        } else {
            navigation.goBack();

            const newsetRoute = route[route.length - 1];
            if (newsetRoute && newsetRoute.toScreen === name) {
                navigation.navigate(newsetRoute.route, newsetRoute.param);
                dispatch(POP_ROUTE());
            }
        }
    };

    useFocusEffect(() => {
        const parent = navigation.getParent();
        parent.setOptions({
            headerLeft: () => (
                <Pressable onPress={handleGoBack}>
                    <Box size={10} alignItems="center" justifyContent="center">
                        <GoBack width={isPad ? 24 : 18} height={isPad ? 22 : 16} />
                    </Box>
                </Pressable>
            ),
        });

        navigation.addListener('beforeRemove', () =>
            parent.setOptions({
                headerLeft: null,
            }),
        );
    });
};

export default useGoBack;
