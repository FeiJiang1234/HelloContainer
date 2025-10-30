import colors from 'el/config/colors';
import { Flex, Text, Image } from 'native-base';
import { isPad } from 'el/config/constants';

type PropType = {
    street?: string;
    country?: string;
    state?: string;
    city?: string;
    [rest: string]: any;
};

const ElAddress: React.FC<PropType> = ({ street, country, state, city, ...rest }) => {
    const { hideFlag } = rest;

    const address: string[] = [];
    if (street) address.push(street);
    if (city) address.push(city);
    if (state) address.push(state);
    if (country) address.push(country);
    if (address.length === 0) address.push('city, state, country');

    return (
        <Flex direction="row" align="center" {...rest}>
            <Text
                flexShrink={1}
                fontSize={isPad ? 14 : 12}
                ellipsizeMode="tail"
                numberOfLines={1}
                color={colors.medium}>
                {address.join(', ')}
            </Text>
            {!hideFlag && (
                <Image
                    source={require('../../assets/images/us.png')}
                    style={{ width: 25, height: 15, marginLeft: 4 }}
                    alt="image"
                />
            )}
        </Flex>
    );
};

export default ElAddress;
