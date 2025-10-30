import colors from 'el/config/colors';
import { Box, Center, Square, Text } from 'native-base';

export const Selected = ({ children }) => {
    return (
        <Square size={10} bgColor={colors.secondary} borderRadius={8}>
            <Text color={colors.white}>{children}</Text>
        </Square>
    );
};

export const Unselected = ({ children }) => {
    return (
        <Square size={10} bgColor={colors.light} borderRadius={8}>
            <Text>{children}</Text>
        </Square>
    );
};

export const LineupLayout = ({ player, signIn, pos }) => {
    return (
        <>
            <Box flex={3} overflow="hidden">
                {player}
            </Box>
            <Center flex={1}>{signIn}</Center>
            <Center w={10}>{pos}</Center>
        </>
    );
};
