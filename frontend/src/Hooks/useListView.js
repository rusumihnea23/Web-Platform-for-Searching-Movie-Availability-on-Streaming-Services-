import { useState, useEffect } from "react";
import {
  getUserListsDetailed,
  getPublicUserLists,
  getPublicSingleList,
  getAllLists,
  getLikedLists, // 1. ADD THIS IMPORT HERE
} from "../Actions/UserListActions";

/**
 * @param {"owner" | "public" | "browse" | "liked"} mode // 2. ADD "liked" TO JSDOC
 * @param {string|null} userId required when mode === "public"
 */
export function useListView(mode, userId = null) {
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchLists = async () => {
    setLoading(true);
    try {
      let data;
      if (mode === "owner") {
        data = await getUserListsDetailed();
      } else if (mode === "liked") {
        // 3. ADD THIS CONDITION TO FETCH LIKED LISTS
        data = await getLikedLists(); 
      } else if (mode === "public") {
        data = await getPublicUserLists(userId);
      } else {
        data = await getAllLists(search, sortBy);
      }
      setLists(data || []);
    } catch (error) {
      console.error("Error fetching lists:", error);
      setLists([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLists();
    setCurrentPage(1); 
  }, [mode, userId, search, sortBy]);

  const handleSelectList = async (list) => {
    if (mode !== "owner") {
      const full = await getPublicSingleList(list.id);
      setSelectedList(full || list);
    } else {
      setSelectedList(list);
    }
  };

  const handleBack = () => {
    setSelectedList(null);
    if (mode === "owner") fetchLists();
  };

  const handlePageChange = (page, scrollToTop = false) => {
    setCurrentPage(page);
    if (scrollToTop) window.scrollTo(0, 0);
  };

  return {
    lists,
    setLists,
    selectedList,
    loading,
    search,
    setSearch,
    sortBy,
    setSortBy,
    currentPage,
    setCurrentPage: handlePageChange,
    handleSelectList,
    handleBack,
    fetchLists,
  };
}