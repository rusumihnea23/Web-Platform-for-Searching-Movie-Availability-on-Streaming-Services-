import React, { useEffect, useState, useCallback } from "react";
import {
  getGeneralStats,
  getLogsChart,
  getReviewsChart,
  getTopMovies
} from '../../Actions/GeneralAdminDashboardActions'; 
import GeneralComponent from "./GeneralComponent";

const AdminDashboard = () => {
  const [data, setData] = useState({
    stats: {},
    logs: { chartData: [], average: 0 },
    reviewChart: { chartData: [], average: 0 },
    topMovies: [],
  });
  
  const [days, setDays] = useState(30); // Default period
  const [limit, setLimit] = useState(5); // Default top movies limit
  const [loading, setLoading] = useState(true);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
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
  }, [days, limit]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Overview</h1>
          <p className="text-gray-500">Analytics  days.</p>
        </div>
        
        {/* Period Selector */}
        <div className="flex items-center gap-3 bg-white p-2 rounded-lg shadow-sm border border-gray-100">
          <label className="text-sm font-semibold text-gray-600 px-2">Period:</label>
          <select 
            value={days} 
            onChange={(e) => setDays(Number(e.target.value))}
            className="bg-gray-50 border-none text-gray-700 text-sm rounded-md focus:ring-blue-500 block p-2"
          >
            <option value={7}>Last 7 Days</option>
            <option value={30}>Last 30 Days</option>
            <option value={90}>Last 3 months</option>
            <option value={180}>Last 6 months</option>
            <option value={365}>Last year</option>
          </select>
        </div>
      </header>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
           <span className="ml-3 text-gray-600">Updating metrics...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
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
    </div>
  );
};

export default AdminDashboard;