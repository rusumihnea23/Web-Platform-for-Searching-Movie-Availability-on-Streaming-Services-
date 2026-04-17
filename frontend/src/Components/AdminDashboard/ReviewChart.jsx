import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ReviewChart = ({ reviews }) => {
  const formatDate = (dateStr) => {
    // Safety check for date formatting
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-bold text-gray-700 flex items-center gap-2">
            Review Trends
          </h3>
          <p className="text-xs text-gray-400">Monthly Volume</p>
        </div>
        <div className="text-right">
          {/* Protected with optional chaining and default value */}
          <span className="text-xl font-bold text-gray-800">{reviews?.average || 0}</span>
          <p className="text-[10px] text-gray-400 uppercase font-semibold">Avg/Day</p>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {/* Protected chart data */}
          <AreaChart data={reviews?.chartData || []}>
            <defs>
              <linearGradient id="reviewGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              axisLine={false} 
              tickLine={false}
              tick={{fill: '#64748b', fontSize: 12}} 
            />
            <YAxis hide />
            <Tooltip 
              labelFormatter={formatDate}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
            />
            <Area 
              type="monotone" 
              dataKey="count" 
              stroke="#a855f7" 
              fillOpacity={1} 
              fill="url(#reviewGradient)" 
              strokeWidth={3}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ReviewChart;