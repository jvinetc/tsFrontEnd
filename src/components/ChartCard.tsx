import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import type { responseChart } from '../interface/Stop';

interface Props {
  title: string;
  data: responseChart[] | undefined;
}

const ChartCard = ({ title, data }: Props) => {
  return (
     <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {data && <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>}
    </div>
  )
}

export default ChartCard