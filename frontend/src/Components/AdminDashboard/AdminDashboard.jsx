import React, { useEffect, useState, useCallback } from "react";
import { ChartBarIcon, ChatBubbleLeftRightIcon, UsersIcon } from '@heroicons/react/24/outline'; 
import { getGeneralStats, getLogsChart, getReviewsChart, getTopMovies } from '../../Actions/GeneralAdminDashboardActions'; 
import GeneralComponent from "./GeneralComponent";
import AdminReviewManagement from "./AdminReviewManagement";
import AdminUserManagement from "./AdminUserManagement";

const TABS = [
  { id: 'overview', label: 'Overview', icon: ChartBarIcon, color: 'bg-blue-600' },
  { id: 'users', label: 'Users', icon: UsersIcon, color: 'bg-purple-600' },
  { id: 'reviews', label: 'Moderation', icon: ChatBubbleLeftRightIcon, color: 'bg-pink-600' }
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState({ stats: {}, logs: {}, reviewChart: {}, topMovies: [] });
  const [days, setDays] = useState(30);
  const [limit, setLimit] = useState(5);
  const [loading, setLoading] = useState(true);

  const fetchAllData = useCallback(async () => {
    if (activeTab === 'overview') setLoading(true);
    try {
      const [stats, logs, reviewChart, topMovies] = await Promise.all([
        getGeneralStats(), getLogsChart(days), getReviewsChart(days), getTopMovies(limit)
      ]);
      setData({ stats, logs, reviewChart, topMovies });
    } catch (error) {
      console.error("Dashboard refresh failed", error);
    } finally { setLoading(false); }
  }, [days, limit, activeTab]);

  useEffect(() => { fetchAllData(); }, [fetchAllData]);

  return (
    // Reduced base padding to p-4 for mobile, p-6 for larger screens
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <header className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          {/* Responsive text sizing */}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Admin Panel</h1>
          <p className="text-sm sm:text-base text-gray-500">Manage platform analytics, users, and content.</p>
        </div>

        {/* Added overflow-x-auto for horizontal scrolling on very small screens, and w-full for mobile span */}
        <div className="flex w-full md:w-auto overflow-x-auto bg-white p-1 rounded-xl shadow-sm border border-gray-200 hide-scrollbar">
          {TABS.map(({ id, label, icon: Icon, color }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              // flex-1 makes tabs stretch evenly on mobile. whitespace-nowrap prevents text breaking.
              className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2 md:px-4 md:py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === id ? `${color} text-white shadow-md` : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <Icon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" /> 
              <span>{label}</span>
            </button>
          ))}
        </div>
      </header>

      {loading ? (
        <div className="flex h-64 items-center justify-center text-gray-600">
           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div> Loading data...
        </div>
      ) : (
        <div className="fade-in">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <GeneralComponent 
                {...data} 
                limit={limit} setLimit={setLimit}   days={days} setDays={setDays} 
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