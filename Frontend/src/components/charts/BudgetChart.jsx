import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BudgetChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 0,
          left: 0,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
        <YAxis tick={{ fontSize: 10 }}/>
        <Tooltip
            contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                border: '1px solid #ccc',
                borderRadius: '0.5rem',
                fontSize: '12px'
            }}
        />
        <Legend wrapperStyle={{ fontSize: '12px' }} />
        <Bar dataKey="allocatedOp" stackId="a" fill="#4ade80" name="Allocated OpEx" />
        <Bar dataKey="spentOp" stackId="a" fill="#166534" name="Spent OpEx" />
        <Bar dataKey="allocatedDev" stackId="b" fill="#60a5fa" name="Allocated DevEx" />
        <Bar dataKey="spentDev" stackId="b" fill="#1e40af" name="Spent DevEx" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BudgetChart;