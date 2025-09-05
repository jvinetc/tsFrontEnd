import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import type { responseChart } from '../interface/Stop';
import type React from 'react';

interface Props {
  title: string;
  data: responseChart[] | undefined;
  children?: React.ReactNode;
}

const ChartCard = ({ title, data, children }: Props) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {data && <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip contentStyle={{ color: 'black' }} />
          <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>}
      {children}
    </div>
  )
}

export default ChartCard