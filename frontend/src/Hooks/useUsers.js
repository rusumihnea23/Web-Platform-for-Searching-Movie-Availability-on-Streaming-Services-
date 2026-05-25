import { useState, useEffect, useCallback } from "react";
import { getAllUsers } from "../Actions/GeneralAdminDashboardActions";

export const useUsers = (mode = "standard") => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllUsers(`?query=${searchTerm}&page=${currentPage}`);
      let data = res?.users || res || [];

      if (mode === "top" && !searchTerm) {
        data = [...data]
          .sort((a, b) => {
            const scoreA = (a.totalLogs || 0) + ((a.totalReviews || 0) / 2);
            const scoreB = (b.totalLogs || 0) + ((b.totalReviews || 0) / 2);
            return scoreB - scoreA; 
          })
          .slice(0, 10); // Take top 10
      }

      setUsers(data);
      setTotalPages(res?.totalPages || 1);
    } finally { setLoading(false); }
  }, [searchTerm, currentPage, mode]);

  useEffect(() => {
    const timer = setTimeout(fetchUsers, 400);
    return () => clearTimeout(timer);
  }, [fetchUsers]);

  return { users, searchTerm, setSearchTerm, currentPage, setCurrentPage, totalPages, isLoading };
};