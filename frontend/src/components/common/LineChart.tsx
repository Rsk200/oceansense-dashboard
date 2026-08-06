import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';

interface LineChartProps {
  data: any[];
  lines: Array<{
    dataKey: string;
    stroke: string;
    name: string;
  }>;
  xAxisDataKey: string;
  height?: number;
}

const LineChart = ({ data, lines, xAxisDataKey, height = 300 }: LineChartProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <ResponsiveContainer width="100%" height={height}>
        <RechartsLineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey={xAxisDataKey} 
            stroke="#ffffff"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#ffffff"
            style={{ fontSize: '12px' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(4, 30, 66, 0.9)',
              border: '1px solid rgba(0, 194, 255, 0.3)',
              borderRadius: '8px',
              color: '#ffffff',
            }}
          />
          <Legend 
            wrapperStyle={{ color: '#ffffff' }}
          />
          {lines.map((line) => (
            <Line
              key={line.dataKey}
              type="monotone"
              dataKey={line.dataKey}
              stroke={line.stroke}
              name={line.name}
              strokeWidth={2}
              dot={{ fill: line.stroke, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default LineChart;
