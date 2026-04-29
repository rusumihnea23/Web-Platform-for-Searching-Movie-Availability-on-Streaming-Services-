import { useState, useEffect } from "react";
import { getLikedLists, getPublicSingleList, likeList } from "../../../../Actions/UserListActions";
import { HeartIcon } from "@heroicons/react/24/solid";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import DetailedListItems from "./DetailedListItems";
import Pagination from "../../../Reviews/Pagination"; // adjust path

export default function LikedListsTab() {
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unliking, setUnliking] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fetchLikedLists = async () => {
    const data = await getLikedLists();
    if (data) setLists(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchLikedLists();
  }, []);

  const handleSelectList = async (list) => {
    const full = await getPublicSingleList(list.id);
    setSelectedList(full || list);
  };

  const handleUnlike = async (e, listId) => {
    e.stopPropagation();
    setUnliking(listId);
     likeList(listId);
    setLists((prev) => prev.filter((l) => l.id !== listId));
    setUnliking(null);
  };

  // Filter + paginate
  const filtered = lists.filter((l) =>
    l.name?.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentLists = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (selectedList) {
    return (
      <DetailedListItems
        list={selectedList}
        isPublic={true}
        onBack={() => setSelectedList(null)}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 gap-3">
        <div className="w-5 h-5 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
        Loading liked lists...
      </div>
    );
  }

  return (
    <div className="text-white w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 bg-slate-900/40 p-4 rounded-lg border border-slate-800">
        <div>
          <h2 className="text-xl font-bold">Liked Collections</h2>
          <p className="text-sm text-gray-400">Lists you've hearted from other users</p>
        </div>
        <HeartIcon className="w-6 h-6 text-rose-500" />
      </div>

      {/* Search */}
      {lists.length > 0 && (
        <div className="relative mb-6">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search liked lists..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-sky-500 transition-colors"
          />
        </div>
      )}

      {/* Empty states */}
      {lists.length === 0 && (
        <div className="flex flex-col items-center justify-center h-48 text-gray-500 gap-3">
          <HeartIcon className="w-10 h-10 text-gray-700" />
          <p className="text-sm">You haven't liked any lists yet.</p>
        </div>
      )}
      {lists.length > 0 && filtered.length === 0 && (
        <p className="text-center py-16 text-slate-500">No lists match "{search}".</p>
      )}

      {/* Grid */}
      {currentLists.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentLists.map((list) => (
            <div
              key={list.id}
              className="group bg-slate-800/50 hover:bg-slate-800 border border-slate-700 p-5 rounded-xl transition-all flex justify-between items-start cursor-pointer"
              onClick={() => handleSelectList(list)}
            >
              <div className="flex-1">
                <h3 className="text-lg font-bold text-sky-400 group-hover:text-pink-500 transition-colors uppercase tracking-tight">
                  {list.name}
                </h3>
                <p className="text-sm text-gray-400 line-clamp-2 mt-1 mb-3">
                  {list.description || "No description provided."}
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-xs bg-slate-900 px-2 py-1 rounded text-gray-500">
                    {list.movies?.length ?? 0} Movies
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    by <span className="text-gray-400 ml-1">{list.ownerUsername}</span>
                  </span>
                  <span className="flex items-center gap-1 text-xs text-rose-400">
                    <HeartIcon className="w-3 h-3" />
                    {list.likeCount}
                  </span>
                </div>
              </div>

              <button
                onClick={(e) => handleUnlike(e, list.id)}
                disabled={unliking === list.id}
                className="ml-4 p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-all disabled:opacity-50"
                title="Unlike this list"
              >
                {unliking === list.id
                  ? <div className="w-4 h-4 border-2 border-rose-400 border-t-transparent rounded-full animate-spin" />
                  : <HeartIcon className="w-5 h-5" />
                }
              </button>
            </div>
          ))}
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(p) => setCurrentPage(p)}
      />
    </div>
  );
}