import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Pagination from "../Sort/Pagination";
import ListCard from "./ListCard";
import SortControls from "../Sort/SortControls";

const LIST_SORT_OPTIONS = [
  { value: "popular",      label: "Most popular" },
  { value: "least-liked",  label: "Least liked" },
  { value: "name",         label: "Name (A–Z)" },
];

export default function ListGrid({
  lists,
  search, setSearch,
  sortBy, setSortBy,
  currentPage, setCurrentPage,
  itemsPerPage = 6,
  onSelect, onToggleLike, onDelete,
  togglingLike,
  showLike = false,
  showDelete = false,
  emptyMessage = "No lists found.",
}) {
  const totalPages = Math.ceil(lists.length / itemsPerPage);
  const paginated = lists.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (val) => { setSortBy(val); setCurrentPage(1); };
  const handleSearch = (e) => { setSearch(e.target.value); setCurrentPage(1); };

  return (
    <>
    
      <div className="flex items-center ">
        <SortControls
          sortBy={sortBy}
          setSortBy={handleSort}
          options={LIST_SORT_OPTIONS}
          className="h-8.5 w-44 shrink-0"
        />
        
      </div>

      {lists.length === 0 ? (
        <p className="text-center py-16 text-slate-500 text-sm">{emptyMessage}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {paginated.map((list) => (
            <ListCard
              key={list.id}
              list={list}
              onClick={() => onSelect(list)}
              onToggleLike={onToggleLike}
              onDelete={onDelete}
              togglingLike={togglingLike}
              showLike={showLike}
              showDelete={showDelete}
            />
          ))}
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </>
  );
}