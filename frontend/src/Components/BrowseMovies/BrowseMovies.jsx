import { useState, useEffect } from "react";
import MovieList from "../MovieList/MovieList";
import SortControls from "../Sort/SortControls";
import Pagination from "../Sort/Pagination";
import { getAllMovies } from "../../Actions/MovieActions";

export default function BrowseMovies() {
  const [movies, setMovies] = useState([]), [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest"), [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 36;

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await getAllMovies(sortBy, null);
        setMovies(data || []);
        setCurrentPage(1);
      } catch (e) { console.error(e); }
      setLoading(false);
    })();
  }, [sortBy]);

  const currentMovies = movies.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(movies.length / itemsPerPage);

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-slate-900">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-pink-500" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-white pb-20">

      <main className="max-w-7xl mx-auto px-4 pt-1 relative">
       
        
        <div className="border-l-4 border-pink-500 pl-4 my-6">
          <h2 className="text-2xl font-bold">All Movies</h2>
          <p className="text-gray-400 text-sm">{movies.length} results</p>
        </div>

        <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 min-h-100">
          {movies.length ? (
            <>
             <SortControls sortBy={sortBy} setSortBy={setSortBy} />
              <MovieList Movies={currentMovies} />
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={p => { setCurrentPage(p); window.scrollTo(0,0); }} />
            </>
          ) : <p className="text-center py-20 text-slate-500">No movies found.</p>}
        </div>
      </main>
    </div>
  );
}