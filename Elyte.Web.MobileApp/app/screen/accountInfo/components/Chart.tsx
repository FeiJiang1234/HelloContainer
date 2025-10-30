import colors from 'el/config/colors';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { VictoryAxis, VictoryChart, VictoryLine } from 'victory-native';
import _ from 'lodash';
import { useLayoutOffset } from 'el/utils';

const Chart = ({ data, ...rest }) => {
    const maxStatsItem = _.maxBy(data, (o: any) => o.stats);
    const maxStats = maxStatsItem?.stats > 10 ? maxStatsItem?.stats : 10;
    let { height, width } = Dimensions.get('window');
    const { layoutOffsetLeft, layoutOffsetRight } = useLayoutOffset();

    return (
        <View style={styles.container}>
            <VictoryChart height={height / 2} width={width - layoutOffsetLeft - layoutOffsetRight}>
                <VictoryAxis />
                <VictoryAxis dependentAxis domain={[0, maxStats]} />
                <VictoryLine
                    style={{
                        data: { stroke: colors.secondary },
                    }}
                    data={data}
                    {...rest}
                />
            </VictoryChart>
        </View>
    );
};

export default Chart;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        backgroundColor: '#f5fcff'
    },
});
