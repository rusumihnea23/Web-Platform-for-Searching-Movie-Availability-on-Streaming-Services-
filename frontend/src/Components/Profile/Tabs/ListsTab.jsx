import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { getUserListsDetailed, createMovieList, deleteList, getPublicUserLists, getPublicSingleList } from "../../../Actions/UserListActions";
import { useListLike } from "../../../Hooks/useListLike";
import DetailedListItems from "../../Lists/DetailedListItems";
import ListGrid from "../../Lists/ListGrid"; // adjust path

export default function ListsTab({ userId }) {
  const isPublic = Boolean(userId);
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newList, setNewList] = useState({ name: "", description: "" });
  const { togglingLike, handleToggleLike } = useListLike(setLists);

  const fetchLists = async () => {
    const data = isPublic ? await getPublicUserLists(userId) : await getUserListsDetailed();
    if (data) setLists(data);
  };

  useEffect(() => { fetchLists(); }, [userId]);

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
    if (isPublic) { const full = await getPublicSingleList(list.id); setSelectedList(full || list); }
    else setSelectedList(list);
  };

  if (selectedList) return (
    <DetailedListItems list={selectedList} isPublic={isPublic} onBack={() => { setSelectedList(null); if (!isPublic) fetchLists(); }} />
  );

  return (
    <div className="text-white w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6 bg-slate-900/40 p-4 rounded-lg border border-slate-800">
        <div>
          <h2 className="text-xl font-bold">{isPublic ? "Movie Collections" : "Your Movie Collections"}</h2>
          <p className="text-sm text-gray-400">{isPublic ? "This user's curated lists" : "Organize your cinema journey"}</p>
        </div>
        {!isPublic && (
          <button onClick={() => setIsModalOpen(true)} className="bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-6 rounded-md transition-all shadow-lg">
            Create New List [+]
          </button>
        )}
      </div>

      <ListGrid
        lists={lists} search={search} setSearch={setSearch}
        currentPage={currentPage} setCurrentPage={setCurrentPage}
        onSelect={handleSelectList} onLike={handleToggleLike} onDelete={handleDelete}
        togglingLike={togglingLike} showLike={isPublic} showDelete={!isPublic}
        emptyMessage={isPublic ? "This user has no lists yet." : "You haven't created any lists yet."}
      />

      {!isPublic && isModalOpen && createPortal(
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h4 className="text-2xl font-black text-white mb-6 uppercase tracking-tighter">Create Collection</h4>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">List Name</label>
                <input autoFocus className="w-full bg-slate-800 border border-slate-700 p-3 rounded-lg text-white focus:outline-none focus:border-sky-500 transition-colors" placeholder="e.g., Best Sci-Fi 2024" value={newList.name} onChange={(e) => setNewList({ ...newList, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Description (Optional)</label>
                <textarea className="w-full bg-slate-800 border border-slate-700 p-3 rounded-lg text-white h-32 resize-none focus:outline-none focus:border-sky-500 transition-colors" placeholder="What is this collection about?" value={newList.description} onChange={(e) => setNewList({ ...newList, description: e.target.value })} />
              </div>
            </div>
            <div className="mt-8 flex gap-3">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 rounded-lg text-sm font-bold text-gray-400 hover:bg-slate-800 transition-colors">Cancel</button>
              <button onClick={handleCreate} disabled={!newList.name.trim()} className="flex-1 rounded-lg bg-sky-600 px-4 py-3 text-sm font-black text-white shadow-lg hover:bg-sky-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all">CREATE LIST</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}