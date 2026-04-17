import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


const LogsChart = ({ logs }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return ""; // Guard for empty dates
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Add a loading state check or use optional chaining
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-bold text-gray-700 flex items-center gap-2">
            Logs Activity
          </h3>
          {/* Fix 1: Optional Chaining (?.) and default value */}
          <p className="text-xs text-gray-400">
            Daily Average: {logs?.average || 0}
          </p>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {/* Fix 2: Optional Chaining on chartData */}
          <BarChart data={logs?.chartData || []}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#64748b', fontSize: 12}} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#64748b', fontSize: 12}} 
            />
            <Tooltip 
              labelFormatter={formatDate}
              cursor={{fill: '#f8fafc'}}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
            />
            <Bar 
              dataKey="count" 
              fill="#3b82f6" 
              radius={[6, 6, 0, 0]} 
              barSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LogsChart;