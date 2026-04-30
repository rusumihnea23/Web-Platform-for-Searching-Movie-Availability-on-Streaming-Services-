import { HeartIcon } from "@heroicons/react/24/solid";
import { useListLike } from "../../../Hooks/useListLike";
import { useListView } from "../../../Hooks/useListView"; // Consistent hook
import DetailedListItems from "../../Lists/DetailedListItems";
import ListGrid from "../../Lists/ListGrid";
import Loading from "../../Loading/Loading";

export default function LikedListsTab() {
  // We can treat "liked" as a special mode or use our custom fetch
  // For now, let's assume we use useListView for consistency 
  // (You might need to adjust useListView to handle 'liked' mode)
  const {
    lists, setLists,
    selectedList,
    loading,
    search, setSearch,
    sortBy, setSortBy,
    currentPage, setCurrentPage,
    handleSelectList,
    handleBack,
  } = useListView("browse"); // Or a custom mode if implemented

  const { togglingLike, handleToggleLike } = useListLike(setLists);

  if (loading) return <Loading />;

  if (selectedList) return (
    <DetailedListItems list={selectedList} isPublic={true} onBack={handleBack} />
  );

  return (
    <div className="text-white w-full max-w-4xl mx-auto">

 

      <ListGrid
        lists={lists}
        search={search} setSearch={setSearch}
        sortBy={sortBy} setSortBy={setSortBy}
        currentPage={currentPage} setCurrentPage={setCurrentPage}
        onSelect={handleSelectList}
        onToggleLike={handleToggleLike} // Backend handles the "unlike" toggle logic
        togglingLike={togglingLike}
        showLike={true}
        emptyMessage="You haven't liked any lists yet."
      />
    </div>
  );
}