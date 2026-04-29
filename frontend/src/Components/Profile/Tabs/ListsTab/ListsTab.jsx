import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { getUserListsDetailed, createMovieList, deleteList, getPublicUserLists, getPublicSingleList } from "../../../../Actions/UserListActions";
import { likeList } from "../../../../Actions/UserListActions";
import DetailedListItems from "./DetailedListItems";
import { TrashIcon } from "@heroicons/react/24/solid";
import { HeartIcon } from "@heroicons/react/24/solid";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Pagination from "../../../Reviews/Pagination"; // adjust path

export default function ListsTab({ userId }) {
  const isPublic = Boolean(userId);

  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [togglingLike, setTogglingLike] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newList, setNewList] = useState({ name: "", description: "" });

  const fetchLists = async () => {
    const data = isPublic
      ? await getPublicUserLists(userId)
      : await getUserListsDetailed();
    if (data) setLists(data);
  };

  useEffect(() => {
    fetchLists();
  }, [userId]);

  const handleCreate = async () => {
    if (!newList.name.trim()) return;
    await createMovieList(newList);
    setNewList({ name: "", description: "" });
    setIsModalOpen(false);
    fetchLists();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this list?")) {
      await deleteList(id);
      fetchLists();
    }
  };

  const handleSelectList = async (list) => {
    if (isPublic) {
      const full = await getPublicSingleList(list.id);
      setSelectedList(full || list);
    } else {
      setSelectedList(list);
    }
  };

  const handleToggleLike = async (e, list) => {
    e.stopPropagation();
    setTogglingLike(list.id);
    await likeList(list.id);
    setLists((prev) =>
      prev.map((l) =>
        l.id === list.id
          ? { ...l, likedByMe: !l.likedByMe, likeCount: l.likedByMe ? l.likeCount - 1 : l.likeCount + 1 }
          : l
      )
    );
    setTogglingLike(null);
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
        isPublic={isPublic}
        onBack={() => {
          setSelectedList(null);
          if (!isPublic) fetchLists();
        }}
      />
    );
  }

  return (
    <div className="text-white w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 bg-slate-900/40 p-4 rounded-lg border border-slate-800">
        <div>
          <h2 className="text-xl font-bold">
            {isPublic ? "Movie Collections" : "Your Movie Collections"}
          </h2>
          <p className="text-sm text-gray-400">
            {isPublic ? "This user's curated lists" : "Organize your cinema journey"}
          </p>
        </div>
        {!isPublic && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-6 rounded-md transition-all shadow-lg"
          >
            Create New List [+]
          </button>
        )}
      </div>

      {/* Search */}
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

      {/* Empty states */}
      {filtered.length === 0 && search && (
        <p className="text-center py-16 text-slate-500">No lists match "{search}".</p>
      )}
      {lists.length === 0 && !search && (
        <p className="text-center py-16 text-slate-500">
          {isPublic ? "This user has no lists yet." : "You haven't created any lists yet."}
        </p>
      )}

      {/* Lists grid */}
      {currentLists.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentLists.map((list) => (
            <div
              key={list.id}
              className="group bg-slate-800/50 hover:bg-slate-800 border border-slate-700 p-5 rounded-xl transition-all flex justify-between items-start"
            >
              <div
                className="cursor-pointer flex-1"
                onClick={() => handleSelectList(list)}
              >
                <h3 className="text-lg font-bold text-sky-400 group-hover:text-pink-500 transition-colors uppercase tracking-tight">
                  {list.name}
                </h3>
                <p className="text-sm text-gray-400 line-clamp-2 mt-1 mb-3">
                  {list.description || "No description provided."}
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-xs bg-slate-900 px-2 py-1 rounded text-gray-500">
                    {list.movies?.length || 0} Movies
                  </span>
                  {isPublic && (
                    <span className="flex items-center gap-1 text-xs text-rose-400">
                      <HeartIcon className="w-3 h-3" />
                      {list.likeCount ?? 0}
                    </span>
                  )}
                </div>
              </div>

              {isPublic && (
                <button
                  onClick={(e) => handleToggleLike(e, list)}
                  disabled={togglingLike === list.id}
                  className={`ml-4 p-2 rounded-lg transition-all disabled:opacity-50 ${
                    list.likedByMe
                      ? "text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                      : "text-gray-600 hover:text-rose-400 hover:bg-rose-500/10"
                  }`}
                  title={list.likedByMe ? "Unlike this list" : "Like this list"}
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

              {!isPublic && (
                <button
                  onClick={() => handleDelete(list.id)}
                  className="ml-4 text-gray-600 hover:text-red-500 p-2 transition-colors"
                  title="Delete List"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(p) => setCurrentPage(p)}
      />

      {/* CREATE LIST MODAL */}
      {!isPublic && isModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
              <h4 className="text-2xl font-black text-white mb-6 uppercase tracking-tighter">
                Create Collection
              </h4>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">List Name</label>
                  <input
                    autoFocus
                    className="w-full bg-slate-800 border border-slate-700 p-3 rounded-lg text-white focus:outline-none focus:border-sky-500 transition-colors"
                    placeholder="e.g., Best Sci-Fi 2024"
                    value={newList.name}
                    onChange={(e) => setNewList({ ...newList, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Description (Optional)</label>
                  <textarea
                    className="w-full bg-slate-800 border border-slate-700 p-3 rounded-lg text-white h-32 resize-none focus:outline-none focus:border-sky-500 transition-colors"
                    placeholder="What is this collection about?"
                    value={newList.description}
                    onChange={(e) => setNewList({ ...newList, description: e.target.value })}
                  />
                </div>
              </div>
              <div className="mt-8 flex gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 rounded-lg text-sm font-bold text-gray-400 hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!newList.name.trim()}
                  className="flex-1 rounded-lg bg-sky-600 px-4 py-3 text-sm font-black text-white shadow-lg hover:bg-sky-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  CREATE LIST
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}