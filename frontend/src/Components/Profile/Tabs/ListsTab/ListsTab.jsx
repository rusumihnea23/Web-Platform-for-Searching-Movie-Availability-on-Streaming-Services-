import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { getUserListsDetailed, createMovieList, deleteList } from "../../../../Actions/UserListActions";
import DetailedListItems from "./DetailedListItems";
import { TrashIcon} from '@heroicons/react/24/solid';

export default function ListsTab() {
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newList, setNewList] = useState({ name: "", description: "" });

  const fetchLists = async () => {
    const data = await getUserListsDetailed();
    if (data) setLists(data);
  };

  useEffect(() => { fetchLists(); }, []);

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

  if (selectedList) {
    return (
      <DetailedListItems 
        list={selectedList} 
        onBack={() => { setSelectedList(null); fetchLists(); }} 
      />
    );
  }

  return (
    <div className="text-white w-full max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8 bg-slate-900/40 p-4 rounded-lg border border-slate-800">
        <div>
          <h2 className="text-xl font-bold">Your Movie Collections</h2>
          <p className="text-sm text-gray-400">Organize your cinema journey</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-6 rounded-md transition-all shadow-lg"
        >
          Create New List [+]
        </button>
      </div>

      {/* Lists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {lists.map(list => (
          <div key={list.id} className="group bg-slate-800/50 hover:bg-slate-800 border border-slate-700 p-5 rounded-xl transition-all flex justify-between items-start">
            <div className="cursor-pointer flex-1" onClick={() => setSelectedList(list)}>
              <h3 className="text-lg font-bold text-sky-400 group-hover:text-pink-500 transition-colors uppercase tracking-tight">
                {list.name}
              </h3>
              <p className="text-sm text-gray-400 line-clamp-2 mt-1 mb-3">
                {list.description || "No description provided."}
              </p>
              <span className="text-xs bg-slate-900 px-2 py-1 rounded text-gray-500">
                {list.movies?.length || 0} Movies
              </span>
            </div>
            <button 
              onClick={() => handleDelete(list.id)} 
              className="ml-4 text-gray-600 hover:text-red-500 p-2 transition-colors"
              title="Delete List"
            >
              <TrashIcon  className="w-5 h-5"/>
            </button>
          </div>
        ))}
      </div>

      {/* CREATE LIST MODAL */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm" 
            onClick={() => setIsModalOpen(false)} 
          />
          
          <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h4 className="text-2xl font-black text-white mb-6 uppercase tracking-tighter">Create Collection</h4>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">List Name</label>
                <input
                  autoFocus
                  className="w-full bg-slate-800 border border-slate-700 p-3 rounded-lg text-white focus:outline-none focus:border-sky-500 transition-colors"
                  placeholder="e.g., Best Sci-Fi 2024"
                  value={newList.name}
                  onChange={(e) => setNewList({...newList, name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Description (Optional)</label>
                <textarea
                  className="w-full bg-slate-800 border border-slate-700 p-3 rounded-lg text-white h-32 resize-none focus:outline-none focus:border-sky-500 transition-colors"
                  placeholder="What is this collection about?"
                  value={newList.description}
                  onChange={(e) => setNewList({...newList, description: e.target.value})}
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