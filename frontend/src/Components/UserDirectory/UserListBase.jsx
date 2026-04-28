import React from "react";
import { MagnifyingGlassIcon, UserIcon, ChartBarIcon, ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/outline';
import Pagination from "../Reviews/Pagination";
import { useNavigate } from "react-router-dom";

const UserListBase = ({ userState, title = "Users", renderActions, isAdmin = false }) => {
  const { users, searchTerm, setSearchTerm, currentPage, setCurrentPage, totalPages, isLoading } = userState;
  const navigate = useNavigate();

  return (
    <div className="bg-slate-900 rounded-2xl border border-white/5 overflow-hidden text-white">
      {/* Header: Responsive Flex (Column on mobile, Row on desktop) */}
      <div className="p-4 md:p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-xl font-bold border-l-4 border-sky-500 pl-4">{title}</h2>
        <div className="relative w-full md:w-64">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-white/10 rounded-lg text-sm outline-none focus:ring-1 focus:ring-sky-500" 
            placeholder="Search..." 
            value={searchTerm} 
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} 
          />
        </div>
      </div>

      {/* HORIZONTAL SCROLL WRAPPER */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-sm min-w-[600px]"> {/* min-w ensures the table doesn't collapse too much */}
          <thead className="bg-slate-950/50 text-slate-500 text-[10px] uppercase font-bold tracking-widest">
            <tr>
              <th className="px-6 py-3">User</th>
              <th className="px-6 py-3">Activity</th>
              {renderActions && <th className="px-6 py-3 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {isLoading ? (
              <tr><td colSpan="3" className="px-6 py-10 text-center animate-pulse text-slate-500">Loading...</td></tr>
            ) : (
              users.map((u, index) => (
                <tr key={u.id} className="hover:bg-white/5 group transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3 whitespace-nowrap">
              
                    <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-sky-400 group-hover:border-sky-500 border border-transparent transition-all shrink-0">
                      <UserIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold capitalize cursor-pointer hover:text-sky-400 transition-colors" onClick={() => navigate(`/profile/${u.username}`)}>
                        {u.username}
                      </p>
                      <p className="text-xs text-slate-500">
                        {isAdmin ? u.email : `${u.firstName || ''} ${u.lastName || ''}`}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2 text-[10px] font-bold">
                      <span className="bg-slate-950 px-2.5 py-1 rounded-md border border-white/5 flex gap-1 items-center">
                        <ChartBarIcon className="w-3 h-3 text-sky-500"/> {u.totalLogs}
                      </span>
                      <span className="bg-slate-950 px-2.5 py-1 rounded-md border border-white/5 flex gap-1 items-center">
                        <ChatBubbleLeftEllipsisIcon className="w-3 h-3 text-pink-500"/> {Math.floor(u.totalReviews / 2)}
                      </span>
                    </div>
                  </td>
                  {renderActions && (
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      {renderActions(u)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-white/5 bg-slate-950/20">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
};

export default UserListBase;