import React from 'react';
import { Area } from '@ant-design/charts';

const config = {
    seriesField: '#17C476',
    point: {
        size: 5,
        shape: 'circle',
        style: {
            fill: 'white',
            stroke: '#17C476',
            lineWidth: 2,
        },
    },
    line: {
        style: {
            stroke: '#17C476',
        },
    },
    areaStyle: {
        fill: 'l(270) 0:#ffffff 0.5:#17C476 1:#32E4AE',
    },
    yAxis: {
        line: { style: { stroke: '#808A9E', lineWidth: '2' } },
    },
    xAxis: {
        line: { style: { stroke: '#808A9E', lineWidth: '2' } },
    }
};

const Chart = ({ data, yField, xField }) => {
    config.data = data;
    config.xField = xField;
    config.yField = yField;
    return <Area {...config} />;
};

export default Chart;
