import { ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine, ReferenceArea } from 'recharts';
import { motion } from 'framer-motion';

interface LineChartProps {
  data: any[];
  lines?: Array<{
    dataKey: string;
    stroke: string;
    name: string;
  }>;
  areas?: Array<{
    dataKey: string | [string, string];
    fill: string;
    stroke?: string;
    name: string;
    fillOpacity?: number;
  }>;
  referenceLines?: Array<{
    y: number;
    stroke: string;
    label?: string;
    strokeDasharray?: string;
  }>;
  referenceAreas?: Array<{
    y1?: number;
    y2?: number;
    fill: string;
    fillOpacity?: number;
  }>;
  xAxisDataKey: string;
  height?: number;
}

const LineChart = ({ data, lines = [], areas = [], referenceLines, referenceAreas, xAxisDataKey, height = 300 }: LineChartProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={data}>
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
          {referenceAreas?.map((refArea, idx) => (
            <ReferenceArea
              key={`ra-${idx}`}
              y1={refArea.y1}
              y2={refArea.y2}
              fill={refArea.fill}
              fillOpacity={refArea.fillOpacity ?? 0.1}
            />
          ))}
          {referenceLines?.map((refLine, idx) => (
            <ReferenceLine 
              key={`rl-${idx}`}
              y={refLine.y}
              stroke={refLine.stroke}
              label={{ position: 'insideTopLeft', value: refLine.label, fill: refLine.stroke, fontSize: 10 }}
              strokeDasharray={refLine.strokeDasharray || "3 3"}
            />
          ))}
          {areas.map((area) => (
            <Area
              key={typeof area.dataKey === 'string' ? area.dataKey : area.dataKey.join('-')}
              type="monotone"
              dataKey={area.dataKey as any}
              fill={area.fill}
              stroke={area.stroke || "none"}
              name={area.name}
              fillOpacity={area.fillOpacity ?? 0.2}
              isAnimationActive={true}
            />
          ))}
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
        </ComposedChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default LineChart;
