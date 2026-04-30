import { useState, useEffect } from "react";
import {
  getUserListsDetailed,
  getPublicUserLists,
  getPublicSingleList,
  getAllLists,
} from "../Actions/UserListActions";

/**
 * @param {"owner" | "public" | "browse"} mode
 * @param {string|null} userId required when mode === "public"
 */
export function useListView(mode, userId = null) {
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("popular"); // Added state for backend sorting
  const [currentPage, setCurrentPage] = useState(1);

  const fetchLists = async () => {
    setLoading(true);
    try {
      let data;
      if (mode === "owner") {
        data = await getUserListsDetailed();
      } else if (mode === "public") {
        data = await getPublicUserLists(userId);
      } else {
        // For 'browse' mode, we pass search and sortBy to the API action
        // which sends them as query parameters to your Spring Boot backend
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

  // Trigger fetch whenever mode, userId, search, or sortBy changes
  useEffect(() => {
    fetchLists();
    // Reset to page 1 when search or sort changes to avoid empty pages
    setCurrentPage(1); 
  }, [mode, userId, search, sortBy]);

  const handleSelectList = async (list) => {
    // Public / browse views need the full list fetched; owner already has it.
    if (mode !== "owner") {
      const full = await getPublicSingleList(list.id);
      setSelectedList(full || list);
    } else {
      setSelectedList(list);
    }
  };

  const handleBack = () => {
    setSelectedList(null);
    if (mode === "owner") fetchLists(); // re-sync after edits
  };

  const handlePageChange = (page, scrollToTop = false) => {
    setCurrentPage(page);
    if (scrollToTop) window.scrollTo(0, 0);
  };

  return {
    lists,
    setLists,        // exposed so useListLike can update it
    selectedList,
    loading,
    search,
    setSearch,       // used by Search Bar
    sortBy,          // used by SortControls
    setSortBy,       // used by SortControls (prevents the 'not a function' error)
    currentPage,
    setCurrentPage: handlePageChange,
    handleSelectList,
    handleBack,
    fetchLists,
  };
}