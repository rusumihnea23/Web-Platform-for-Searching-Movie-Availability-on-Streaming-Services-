import React, { useEffect, useState, useCallback } from "react";
import { MagnifyingGlassIcon, TrashIcon, UserIcon, ChartBarIcon, ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/outline';
import { getAllUsers, deleteUser } from "../../Actions/GeneralAdminDashboardActions";
import Pagination from "../Reviews/Pagination";

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllUsers(`?query=${searchTerm}&page=${currentPage}`);
      setUsers(res?.users || res || []);
      setTotalPages(res?.totalPages || 1);
    } finally { setLoading(false); }
  }, [searchTerm, currentPage]);

  useEffect(() => {
    const timer = setTimeout(fetchUsers, 400);
    return () => clearTimeout(timer);
  }, [fetchUsers]);

  const handleDelete = async (id) => {
    if (window.confirm("Delete user?")) {
      try { await deleteUser(id); fetchUsers(); } catch { alert("Error deleting user"); }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between gap-4">
        <h2 className="text-xl font-bold text-gray-800">Users</h2>
        <div className="relative w-full md:w-64">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm" placeholder="Search..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase font-bold">
            <tr><th className="px-6 py-3">User</th><th className="px-6 py-3">Activity</th><th className="px-6 py-3 text-right">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? <tr><td colSpan="3" className="px-6 py-10 text-center animate-pulse">Loading...</td></tr> : users.map(u => (
              <tr key={u.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-600"><UserIcon className="w-5 h-5" /></div>
                  <div><p className="font-bold text-gray-800 capitalize">{u.firstName} {u.lastName}</p><p className="text-xs text-gray-500">{u.email}</p></div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-3 text-[11px] font-bold text-gray-600">
                    <span className="bg-gray-100 px-2 py-1 rounded-md flex gap-1"><ChartBarIcon className="w-3.5 h-3.5 text-blue-500"/> {u.totalLogs}</span>
                    <span className="bg-gray-100 px-2 py-1 rounded-md flex gap-1"><ChatBubbleLeftEllipsisIcon className="w-3.5 h-3.5 text-pink-500"/> {u.totalReviews}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleDelete(u.id)} className="text-gray-400 hover:text-red-600"><TrashIcon className="w-5 h-5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-gray-100"><Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} /></div>
    </div>
  );
};
export default AdminUserManagement;