import { useNavigate } from "react-router-dom";
import { useListLike } from "../../Hooks/useListLike";
import { useListView } from "../../Hooks/useListView";
import ListGrid from "../Lists/ListGrid";
import Loading from "../loading/Loading";

export default function BrowseLists() {
  const navigate = useNavigate();
  const {
    lists, setLists,
    loading,
    search, setSearch,
    sortBy, setSortBy,
    currentPage, setCurrentPage,
  } = useListView("browse");

  const { togglingLike, handleToggleLike } = useListLike(setLists);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-slate-900 text-white pb-20">
      <main className="max-w-7xl mx-auto px-4 pt-1 relative">
        <div className="border-l-4 border-sky-500 pl-4 my-6">
          <h2 className="text-2xl font-bold">Community Lists</h2>
          <p className="text-gray-400 text-sm">{lists.length} results</p>
        </div>

        <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 min-h-100">
          <ListGrid
            lists={lists}
            search={search}
            setSearch={setSearch}
            sortBy={sortBy}
            setSortBy={setSortBy}
            currentPage={currentPage}
            setCurrentPage={(p) => setCurrentPage(p, true)}
            itemsPerPage={6}
            onSelect={(list) => navigate(`/lists/${list.id}`)}
            onToggleLike={handleToggleLike}
            togglingLike={togglingLike}
            showLike
          />
        </div>
      </main>
    </div>
  );
}