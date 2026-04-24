import React from 'react';
import { FilmIcon, UsersIcon, ArrowTrendingUpIcon, StarIcon } from '@heroicons/react/24/solid';
import { useNavigate } from "react-router-dom";
import LogsChart from './LogsChart';
import ReviewChart from './ReviewChart';

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-all">
    <div className={`${color} p-3 rounded-lg text-white flex items-center justify-center`}>{icon}</div>
    <div>
      <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">{title}</p>
      <p className="text-2xl font-black text-gray-800">{Number(value || 0).toLocaleString()}</p>
    </div>
  </div>
);

const GeneralComponent = ({ stats, topMovies, logs, reviewChart, limit, setLimit, days, setDays }) => {
  const navigate = useNavigate();
  
  const STATS = [
    { title: "Total Users", val: stats?.totalUsers, icon: <UsersIcon className="w-5 h-5"/>, color: "bg-blue-500" },
    { title: "Total Reviews", val: stats?.totalReviews, icon: <FilmIcon className="w-5 h-5"/>, color: "bg-purple-500" },
    { title: "Total Logs", val: stats?.totalLogs, icon: <ArrowTrendingUpIcon className="w-5 h-5"/>, color: "bg-green-500" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <select 
          value={days} 
          onChange={(e) => setDays(Number(e.target.value))} 
          className="bg-white border-gray-100 shadow-sm text-sm rounded-md p-2 outline-none focus:ring-2 focus:ring-pink-500 transition-all cursor-pointer"
        >
          <option value={7}>Last 7 Days</option>
          <option value={30}>Last 30 Days</option>
          <option value={365}>Last year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {STATS.map((s, i) => <StatCard key={i} title={s.title} value={s.val} icon={s.icon} color={s.color} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LogsChart logs={logs} />
        <ReviewChart reviews={reviewChart} />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-gray-800">Most Popular Movies</h3>
          <select 
            value={limit} 
            onChange={(e) => setLimit(Number(e.target.value))} 
            className="text-xs border-gray-200 rounded-md text-gray-500 outline-none focus:ring-1 focus:ring-pink-500 cursor-pointer"
          >
            {[5, 10, 20].map(n => <option key={n} value={n}>Top {n}</option>)}
          </select>
        </div>

        <ul className="divide-y divide-gray-50">
          {topMovies?.length ? topMovies.map((m, i) => (
            <li key={m.id || i} className="px-4 py-3 sm:px-6 sm:py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-2 sm:gap-4 hover:bg-gray-50 transition-colors">
              
              {/* Movie Title & Rank */}
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-gray-300 font-bold text-lg w-5 shrink-0">{i + 1}</span>
                <h3 onClick={() => navigate(`/movies/${m.api_id}/details`)} className="font-bold text-black hover:text-pink-500 cursor-pointer truncate">
                  {m.title}
                </h3>
              </div>

              {/* Compact Stats Badges (Modeled after UserManagement) */}
              <div className="flex gap-2 text-[11px] font-bold text-gray-600 ml-8 sm:ml-0 shrink-0">
                <span className="bg-gray-100 px-2 py-1 rounded-md flex items-center gap-1">
                  <ArrowTrendingUpIcon className="w-3.5 h-3.5 text-blue-500"/> 
                  {Number(m.total_logs || 0).toLocaleString()}
                </span>
                <span className="bg-gray-100 px-2 py-1 rounded-md flex items-center gap-1">
                  <StarIcon className="w-3.5 h-3.5 text-yellow-500"/> 
                  {m.avg_grade ? Number(m.avg_grade).toFixed(1) : "N/A"}
                </span>
              </div>
              
            </li>
          )) : <li className="p-10 text-center text-gray-400">No movies available</li>}
        </ul>
      </div>
    </div>
  );
};

export default GeneralComponent;