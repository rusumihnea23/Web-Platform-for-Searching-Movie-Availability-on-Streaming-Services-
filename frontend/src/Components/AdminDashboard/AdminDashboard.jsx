import React, { useEffect, useState, useCallback } from "react";
import { 
  ChartBarIcon, 
  ChatBubbleLeftRightIcon,
  UsersIcon // Added for user management
} from '@heroicons/react/24/outline'; 
import {
  getGeneralStats,
  getLogsChart,
  getReviewsChart,
  getTopMovies
} from '../../Actions/GeneralAdminDashboardActions'; 
import GeneralComponent from "./GeneralComponent";
import AdminReviewManagement from "./AdminReviewManagement";
import AdminUserManagement from "./AdminUserManagement";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'reviews', or 'users'
  const [data, setData] = useState({
    stats: {},
    logs: { chartData: [], average: 0 },
    reviewChart: { chartData: [], average: 0 },
    topMovies: [],
  });
  
  const [days, setDays] = useState(30);
  const [limit, setLimit] = useState(5);
  const [loading, setLoading] = useState(true);

  const fetchAllData = useCallback(async () => {
    // We only want the loading spinner for the initial load or "overview" data
    if (activeTab === 'overview') setLoading(true);
    try {
      const [stats, logs, reviewChart, movies] = await Promise.all([
        getGeneralStats(),
        getLogsChart(days),
        getReviewsChart(days),
        getTopMovies(limit),
      ]);
      setData({ stats, logs, reviewChart, topMovies: movies });
    } catch (error) {
      console.error("Dashboard refresh failed", error);
    } finally {
      setLoading(false);
    }
  }, [days, limit, activeTab]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
          <p className="text-gray-500">Manage platform analytics, users, and content.</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'overview' 
                ? "bg-blue-600 text-white shadow-md" 
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            <ChartBarIcon className="w-4 h-4" />
            Overview
          </button>
          
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'users' 
                ? "bg-purple-600 text-white shadow-md" 
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            <UsersIcon className="w-4 h-4" />
            Users
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'reviews' 
                ? "bg-pink-600 text-white shadow-md" 
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            <ChatBubbleLeftRightIcon className="w-4 h-4" />
            Moderation
          </button>
        </div>
      </header>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
           <span className="ml-3 text-gray-600">Loading data...</span>
        </div>
      ) : (
        <div className="fade-in">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex justify-end">
                <div className="flex items-center gap-3 bg-white p-2 rounded-lg shadow-sm border border-gray-100">
                  <label className="text-sm font-semibold text-gray-600 px-2">Period:</label>
                  <select 
                    value={days} 
                    onChange={(e) => setDays(Number(e.target.value))}
                    className="bg-gray-50 border-none text-gray-700 text-sm rounded-md focus:ring-blue-500 block p-2"
                  >
                    <option value={7}>Last 7 Days</option>
                    <option value={30}>Last 30 Days</option>
                    <option value={365}>Last year</option>
                  </select>
                </div>
              </div>
              
              <GeneralComponent 
                stats={data.stats} 
                movies={data.topMovies} 
                logs={data.logs} 
                reviews={data.reviewChart}
                limit={limit}
                setLimit={setLimit}
              />
            </div>
          )}

          {activeTab === 'users' && <AdminUserManagement />}
          
          {activeTab === 'reviews' && <AdminReviewManagement />}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;