import { useState, useEffect } from "react";
import { getUserListsSparse, addMovieToList, createMovieList } from "../../Actions/UserListActions";

export default function ListActionMenu({ movieId }) {
    const [lists, setLists] = useState([]);
    const [selectedListId, setSelectedListId] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [newListName, setNewListName] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchLists();
    }, []);

    const fetchLists = async () => {
        const data = await getUserListsSparse();
        if (data) setLists(data);
    };

    const handleAdd = async () => {
        if (!selectedListId) return;
        setLoading(true);
        await addMovieToList(selectedListId, movieId);
        setLoading(false);
    };

    const handleCreateList = async () => {
        if (!newListName.trim()) return;
        setLoading(true);
        const newList = await createMovieList({ name: newListName });
        if (newList) {
            setNewListName("");
            setIsCreating(false);
            await fetchLists();
        }
        setLoading(false);
    };

    return (
    /* Added overflow-hidden and w-full */
    <div className="w-full bg-slate-800/40 backdrop-blur-md p-5 rounded-2xl border border-slate-700/50 mt-6 shadow-xl overflow-hidden">
        <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest">
                Collections
            </h4>
            {!isCreating && (
                <button
                    onClick={() => setIsCreating(true)}
                    className="text-[10px] bg-slate-700/50 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded-md transition-all uppercase font-bold"
                >
                    + New List
                </button>
            )}
        </div>

        <div className="w-full">
            {!isCreating ? (
                /* Added min-w-0 to the container to allow children to shrink */
                <div className="flex gap-2 w-full min-w-0">
                    <select
                        value={selectedListId}
                        onChange={(e) => setSelectedListId(e.target.value)}
                        /* min-w-0 is the secret sauce for flex children to shrink */
                        className="flex-1 min-w-0 bg-slate-900/80 border border-slate-700 text-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-pink-500/50 transition-colors appearance-none cursor-pointer"
                    >
                        <option value="">Choose a list...</option>
                        {lists.map((list) => (
                            <option key={list.id} value={list.id} className="bg-slate-900">
                                {list.name}
                            </option>
                        ))}
                    </select>
                    
                    <button
                        onClick={handleAdd}
                        disabled={loading || !selectedListId}
                        /* Reduced px-6 to px-4 for better fit */
                        className="shrink-0 bg-pink-600 hover:bg-pink-500 disabled:opacity-30 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all transform active:scale-95 shadow-lg"
                    >
                        {loading ? "..." : "Add"}
                    </button>
                </div>
            ) : (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <input
                        type="text"
                        autoFocus
                        placeholder="Enter list name..."
                        value={newListName}
                        onChange={(e) => setNewListName(e.target.value)}
                        className="w-full bg-slate-900/80 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-500/50"
                    />
                    <div className="flex gap-2">
                        <button
                            onClick={handleCreateList}
                            disabled={loading}
                            className="flex-1 bg-pink-600 hover:bg-pink-500 text-white py-2 rounded-xl text-xs font-bold transition-all"
                        >
                            {loading ? "Creating..." : "Create List"}
                        </button>
                        <button
                            onClick={() => setIsCreating(false)}
                            className="px-4 bg-slate-700 hover:bg-slate-600 text-slate-300 py-2 rounded-xl text-xs font-bold transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    </div>
);
}