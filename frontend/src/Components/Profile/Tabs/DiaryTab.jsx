import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserLogsDetailed } from "../../../Actions/UserMovieActions";
import { getUserReviews } from "../../../Actions/ReviewActions";
import { getUserListsSparse } from "../../../Actions/UserListActions";
import Pagination from "../../Sort/Pagination";

const formatDate = (dateStr) =>
  dateStr ? new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : null;

const ITEMS_PER_PAGE = 10;

export default function DiaryTab() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([getUserLogsDetailed(), getUserReviews(), getUserListsSparse()]).then(([logs, reviews, lists]) => {
      const logEntries = (logs || []).flatMap((log) =>
        (log.watchDates || []).map((date) => ({
          type: "log", movieId: log.movieId, title: log.title,
          personalGrade: log.personalGrade, sortDate: date,
        }))
      );
      const reviewEntries = (reviews || []).map((r) => ({
        type: "review", movieId: r.movieId, title: r.movieTitle, sortDate: r.createdAt,
      }));
      const listEntries = (lists || []).map((l) => ({
        type: "list", listId: l.id, title: l.name, sortDate: l.createdAt,
      }));

      setEntries(
        [...logEntries, ...reviewEntries, ...listEntries]
          .sort((a, b) => new Date(b.sortDate) - new Date(a.sortDate))
      );
      setLoading(false);
    });
  }, []);

  if (loading) return <p className="text-sm text-gray-400">Loading activity...</p>;
  if (!entries.length) return <p className="text-sm text-gray-400">No activity yet.</p>;

  const totalPages = Math.ceil(entries.length / ITEMS_PER_PAGE);
  const paginated = entries.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const getLabel = (entry) => {
    if (entry.type === "log") return "Watched and logged";
    if (entry.type === "review") return "Reviewed";
    return "Created list";
  };

  return (
    <div className="flex flex-col">
      {paginated.map((entry, i) => (
        <div key={`${entry.type}-${entry.movieId ?? entry.listId}-${entry.sortDate}-${i}`}
          className="py-3.5 border-b border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {getLabel(entry)}{" "}
            <span
              onClick={() => entry.type === "list"
                ? navigate(`/lists/${entry.listId}`)
                : navigate(`/movies/${entry.movieId}/details`)
              }
              className="text-base font-semibold text-gray-900 dark:text-white cursor-pointer hover:text-blue-500 transition-colors">
              {entry.title}
            </span>
            {entry.personalGrade && (
              <> with a grade of{" "}
                <span className="text-base font-semibold text-yellow-500">
                  {entry.personalGrade.toFixed(1)}
                  <span className="text-sm font-normal text-gray-400"> / 10</span>
                </span>
              </>
            )}
          </p>
          <p className="mt-1 text-xs text-gray-400">{formatDate(entry.sortDate)}</p>
        </div>
      ))}
      <Pagination currentPage={currentPage} totalPages={totalPages}
        onPageChange={(page) => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
    </div>
  );
}