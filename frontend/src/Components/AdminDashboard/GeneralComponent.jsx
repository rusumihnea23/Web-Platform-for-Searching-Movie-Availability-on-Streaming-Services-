import React from 'react';
import { FilmIcon, UsersIcon, ArrowTrendingUpIcon } from '@heroicons/react/16/solid';
import LogsChart from './LogsChart';
import ReviewChart from './ReviewChart';
import { useNavigate } from "react-router-dom"


const GeneralComponent = ({ stats, movies, logs, reviews, limit, setLimit }) => {
 const navigate = useNavigate();
  return (
    <div className="space-y-6">
      {/* 1. Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          title="Total Users" 
          value={stats?.totalUsers || 0} 
          icon={<UsersIcon className="w-5 h-5" />} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Total Reviews" 
          value={stats?.totalReviews || 0} 
          icon={<FilmIcon className="w-5 h-5" />} 
          color="bg-purple-500" 
        />
        <StatCard 
          title="Total Logs" 
          value={stats?.totalLogs || 0} 
          icon={<ArrowTrendingUpIcon className="w-5 h-5" />} 
          color="bg-green-500" 
        />
      </div>

      {/* 2. Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LogsChart logs={logs} />
        <ReviewChart reviews={reviews} />
      </div>

      {/* 3. Top Movies List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-gray-800">Most Popular Movies</h3>
          <select 
            value={limit} 
            onChange={(e) => setLimit(Number(e.target.value))}
            className="text-xs border-gray-200 rounded-md text-gray-500 focus:ring-blue-500"
          >
            <option value={5}>Top 5</option>
            <option value={10}>Top 10</option>
            <option value={20}>Top 20</option>
          </select>
        </div>

        <ul className="divide-y divide-gray-50">
          {movies && movies.length > 0 ? (
            movies.map((movie, index) => (
              <li 
                key={movie.id || index} 
                className="px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="text-gray-300 font-bold text-lg w-6">
                    {index + 1}
                  </span>
                  <h3 onClick={() => navigate(`/movies/${movie.api_id}/details`)} className="text-sm md:text-xl font-bold text-black mb-2 hover:text-pink-500 cursor-pointer transition-colors truncate">
                                {movie.title}
                            </h3>
                </div>
                
                <div className="flex items-center gap-8">
                  {/* Logs */}
                  <div className="text-right">
                    <span className="block text-[10px] text-gray-400 uppercase font-bold">Total Logs</span>
                    <span className="text-sm font-medium text-gray-600">
                      {Number(movie.total_logs || 0).toLocaleString()}
                    </span>
                  </div>
                  
                  {/* Rating */}
                  <div className="text-right min-w-[60px]">
                    <span className="block text-[10px] text-gray-400 uppercase font-bold">Rating</span>
                    <span className="text-sm font-bold text-yellow-600 flex items-center justify-end gap-1">
                      ★ {movie.avg_grade ? Number(movie.avg_grade).toFixed(1) : "N/A"}
                    </span>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="p-10 text-center text-gray-400">No movie data available</li>
          )}
        </ul>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 transition-all hover:shadow-md">
    <div className={`${color} p-3 rounded-lg text-white flex items-center justify-center`}>
      {icon}
    </div>
    <div>
      <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">{title}</p>
      <p className="text-2xl font-black text-gray-800">
        {Number(value).toLocaleString()}
      </p>
    </div>
  </div>
);

export default GeneralComponent;