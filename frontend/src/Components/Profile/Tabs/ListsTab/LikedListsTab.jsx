import { useState, useEffect } from "react";
import { getLikedLists, getPublicSingleList } from "../../../../Actions/UserListActions";
import { HeartIcon } from "@heroicons/react/24/solid";
import { useListLike } from "./useListLike";
import DetailedListItems from "./DetailedListItems";
import ListGrid from "./ListGrid";

export default function LikedListsTab() {
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { togglingLike, handleUnlike } = useListLike(setLists);

  useEffect(() => {
    (async () => {
      const data = await getLikedLists();
      if (data) setLists(data);
      setLoading(false);
    })();
  }, []);

  const handleSelectList = async (list) => {
    const full = await getPublicSingleList(list.id);
    setSelectedList(full || list);
  };

  if (selectedList) return <DetailedListItems list={selectedList} isPublic={true} onBack={() => setSelectedList(null)} />;

  if (loading) return (
    <div className="flex items-center justify-center h-48 text-gray-400 gap-3">
      <div className="w-5 h-5 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
      Loading liked lists...
    </div>
  );

  return (
    <div className="text-white w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6 bg-slate-900/40 p-4 rounded-lg border border-slate-800">
        <div>
          <h2 className="text-xl font-bold">Liked Collections</h2>
          <p className="text-sm text-gray-400">Lists you've hearted from other users</p>
        </div>
        <HeartIcon className="w-6 h-6 text-rose-500" />
      </div>

      <ListGrid
        lists={lists} search={search} setSearch={setSearch}
        currentPage={currentPage} setCurrentPage={setCurrentPage}
        onSelect={handleSelectList} onUnlike={handleUnlike}
        togglingLike={togglingLike} showUnlike={true}
        emptyMessage="You haven't liked any lists yet."
      />
    </div>
  );
}