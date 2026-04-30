import { useState, useEffect } from "react";
import { getAllLists } from "../../Actions/UserListActions";
import { getUserDetails } from "../../Actions/UserActions";
import { useListLike } from "../../Hooks/useListLike";
import ListGrid from "../Lists/ListGrid";

export default function BrowseLists() {
  const [lists, setLists] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { togglingLike, handleToggleLike } = useListLike(setLists);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [listsData, userData] = await Promise.all([getAllLists(), getUserDetails()]);
      setLists(listsData || []);
      setCurrentUser(userData || null);
      setLoading(false);
    })();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-slate-900">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-sky-500" />
    </div>
  );

 
  const handleLike = (e, list) => {
    if (currentUser?.username === list.ownerUsername) return;
    handleToggleLike(e, list);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white pb-20">
      <main className="max-w-7xl mx-auto px-4 pt-1 relative">
        <div className="border-l-4 border-sky-500 pl-4 my-6">
          <h2 className="text-2xl font-bold">Community Lists</h2>
          <p className="text-gray-400 text-sm">{lists.filter(l => l.name?.toLowerCase().includes(search.toLowerCase())).length} results</p>
        </div>
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 min-h-100">
          <ListGrid
            lists={lists.filter(l => currentUser?.username !== l.ownerUsername || true)} // keep all, hide button per-card
            search={search} setSearch={setSearch}
            currentPage={currentPage} setCurrentPage={(p) => { setCurrentPage(p); window.scrollTo(0, 0); }}
            itemsPerPage={12}
            onSelect={() => {}} 
            onLike={handleLike} togglingLike={togglingLike}
            showLike={true}
            emptyMessage="No lists found."
          />
        </div>
      </main>
    </div>
  );
}