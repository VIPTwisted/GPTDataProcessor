
import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

const SparklineChart = ({ data, dataKey, strokeColor, width = '100%', height = 50 }) => {
  return (
    <ResponsiveContainer width={width} height={height}>
      <LineChart data={data}>
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={strokeColor}
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SparklineChart;
