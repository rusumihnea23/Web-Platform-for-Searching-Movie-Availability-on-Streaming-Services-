import { useState, useEffect } from "react";
import { getAllLists, likeList } from "../../Actions/UserListActions";
import { getUserDetails } from "../../Actions/UserActions";
import { HeartIcon } from "@heroicons/react/24/solid";
import { HeartIcon as HeartOutline, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Pagination from "../Reviews/Pagination";

export default function BrowseLists() {
  const [lists, setLists] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [togglingLike, setTogglingLike] = useState(null);
  const itemsPerPage = 12;

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [listsData, userData] = await Promise.all([getAllLists(), getUserDetails()]);
        setLists(listsData || []);
        setCurrentUser(userData || null);
        setCurrentPage(1);
      } catch (e) { console.error(e); }
      setLoading(false);
    })();
  }, []);

  const handleToggleLike = async (e, list) => {
    e.stopPropagation();
    setTogglingLike(list.id);
    await likeList(list.id);
    setLists((prev) =>
      prev.map((l) =>
        l.id === list.id
          ? { ...l, likedByMe: !l.likedByMe, likeCount: l.likedByMe ? (l.likeCount ?? 1) - 1 : (l.likeCount ?? 0) + 1 }
          : l
      )
    );
    setTogglingLike(null);
  };

  const filtered = lists.filter((l) =>
    l.name?.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentLists = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-slate-900">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-sky-500" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-white pb-20">
      <main className="max-w-7xl mx-auto px-4 pt-1 relative">

        <div className="border-l-4 border-sky-500 pl-4 my-6">
          <h2 className="text-2xl font-bold">Community Lists</h2>
          <p className="text-gray-400 text-sm">{filtered.length} results</p>
        </div>

        <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 min-h-100">
          {lists.length ? (
            <>
              <div className="relative mb-6">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search lists by name..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-sky-500 transition-colors"
                />
              </div>

              {currentLists.length === 0 ? (
                <p className="text-center py-20 text-slate-500">No lists match "{search}".</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentLists.map((list) => {
                    const isOwner = currentUser?.username === list.ownerUsername;

                    return (
                      <div
                        key={list.id}
                        className="group bg-slate-800/50 hover:bg-slate-800 border border-slate-700 p-5 rounded-xl transition-all flex justify-between items-start"
                      >
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-sky-400 group-hover:text-pink-500 transition-colors uppercase tracking-tight truncate">
                            {list.name}
                          </h3>
                          <p className="text-sm text-gray-400 line-clamp-2 mt-1 mb-3">
                            {list.description || "No description provided."}
                          </p>
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-xs bg-slate-900 px-2 py-1 rounded text-gray-500">
                              {list.movies?.length ?? 0} Movies
                            </span>
                            <span className="text-xs text-gray-500">
                              by <span className="text-gray-400">{list.ownerUsername}</span>
                            </span>
                            <span className="flex items-center gap-1 text-xs text-rose-400">
                              <HeartIcon className="w-3 h-3" />
                              {list.likeCount ?? 0}
                            </span>
                          </div>
                        </div>

                        {!isOwner && (
                          <button
                            onClick={(e) => handleToggleLike(e, list)}
                            disabled={togglingLike === list.id}
                            className={`ml-4 p-2 rounded-lg transition-all disabled:opacity-50 shrink-0 ${
                              list.likedByMe
                                ? "text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                                : "text-gray-600 hover:text-rose-400 hover:bg-rose-500/10"
                            }`}
                            title={list.likedByMe ? "Unlike" : "Like"}
                          >
                            {togglingLike === list.id ? (
                              <div className="w-5 h-5 border-2 border-rose-400 border-t-transparent rounded-full animate-spin" />
                            ) : list.likedByMe ? (
                              <HeartIcon className="w-5 h-5" />
                            ) : (
                              <HeartOutline className="w-5 h-5" />
                            )}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(p) => { setCurrentPage(p); window.scrollTo(0, 0); }}
              />
            </>
          ) : (
            <p className="text-center py-20 text-slate-500">No lists found.</p>
          )}
        </div>
      </main>
    </div>
  );
}