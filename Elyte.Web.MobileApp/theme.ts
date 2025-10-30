import colors from 'el/config/colors';
import { extendTheme } from 'native-base';

const theme = extendTheme({
    colors: {
        primary: {
            600: '#1F345C',
        },
    },
    components: {
        Divider: {
            baseStyle: {
                bg: colors.light,
            },
        },
        Box: {
            variants: {
                linear: {
                    bg: {
                        linearGradient: {
                            colors: colors.linear.colors,
                            start: [0, 0.16],
                            end: [0, 0.98],
                        },
                    },
                },
            },
        },
    },
});

export default theme;
