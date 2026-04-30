import { useState } from "react";
import { createMovieList, deleteList } from "../../../Actions/UserListActions";
import { useListLike } from "../../../Hooks/useListLike";
import { useListView } from "../../../Hooks/useListView";
import DetailedListItems from "../../Lists/DetailedListItems";
import ListGrid from "../../Lists/ListGrid";
import CreateListModal from "../../Lists/CreateListModal";
import Loading from "../../Loading/Loading"; // Import your new component

export default function ListsTab({ userId }) {
  const mode = userId ? "public" : "owner";
  const isPublic = mode === "public";

  const {
    lists, setLists,
    selectedList,
    loading, // Destructure loading from hook
    search, setSearch,
    sortBy, setSortBy, // Destructure sort state
    currentPage, setCurrentPage,
    handleSelectList,
    handleBack,
    fetchLists,
  } = useListView(mode, userId);

  const { togglingLike, handleToggleLike } = useListLike(setLists);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreate = async (listData) => {
    await createMovieList(listData);
    setIsModalOpen(false);
    fetchLists();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this list?")) {
      await deleteList(id);
      fetchLists();
    }
  };

  if (loading) return <Loading />;

  if (selectedList) return (
    <DetailedListItems list={selectedList} isPublic={isPublic} onBack={handleBack} />
  );

  return (
    <div className="text-white w-full max-w-4xl mx-auto">
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

      <ListGrid
        lists={lists}
        search={search} setSearch={setSearch}
        sortBy={sortBy} setSortBy={setSortBy} // Pass sort props
        currentPage={currentPage} setCurrentPage={setCurrentPage}
        onSelect={handleSelectList}
        onToggleLike={isPublic ? handleToggleLike : undefined}
        onDelete={!isPublic ? handleDelete : undefined}
        togglingLike={togglingLike}
        showLike={isPublic}
        showDelete={!isPublic}
        itemsPerPage={6}
        emptyMessage={isPublic ? "This user has no lists yet." : "You haven't created any lists yet."}
      />

      {!isPublic && isModalOpen && (
        <CreateListModal onClose={() => setIsModalOpen(false)} onCreate={handleCreate} />
      )}
    </div>
  );
}