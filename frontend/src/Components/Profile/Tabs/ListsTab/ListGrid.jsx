import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Pagination from "../../../Reviews/Pagination"; 
import ListCard from "./ListCard";

export default function ListGrid({ lists, currentPage, setCurrentPage, search, setSearch, itemsPerPage = 6, onSelect, onLike, onUnlike, onDelete, togglingLike, showLike = false, showUnlike = false, showDelete = false, emptyMessage = "No lists found." }) {
  const filtered = lists.filter((l) =>
    l.name?.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentLists = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <>
      {lists.length > 0 && (
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
      )}

      {lists.length === 0 && <p className="text-center py-16 text-slate-500">{emptyMessage}</p>}
      {lists.length > 0 && filtered.length === 0 && (
        <p className="text-center py-16 text-slate-500">No lists match "{search}".</p>
      )}

      {currentLists.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentLists.map((list) => (
            <ListCard
              key={list.id}
              list={list}
              onClick={() => onSelect(list)}
              onLike={onLike}
              onUnlike={onUnlike}
              onDelete={onDelete}
              togglingLike={togglingLike}
              showLike={showLike}
              showUnlike={showUnlike}
              showDelete={showDelete}
            />
          ))}
        </div>
      )}

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </>
  );
}