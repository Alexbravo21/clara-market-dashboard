import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';

interface ISparklineChartProps {
  prices: number[];
  positive: boolean;
}

/**
 * Renders a compact 7-day sparkline chart for a cryptocurrency.
 */
export function SparklineChart({ prices, positive }: ISparklineChartProps) {
  const chartData = prices.map((price, index) => ({ index, price }));
  const strokeColor = positive ? '#059669' : '#dc2626';

  return (
    <ResponsiveContainer width={100} height={36}>
      <LineChart data={chartData}>
        <Tooltip
          contentStyle={{ fontSize: '0.65rem', padding: '2px 6px' }}
          formatter={(value) =>
            typeof value === 'number' ? [`$${value.toFixed(2)}`, 'Price'] : [String(value), 'Price']
          }
          labelFormatter={() => ''}
        />
        <Line
          type="monotone"
          dataKey="price"
          stroke={strokeColor}
          strokeWidth={1.5}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
