import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getQueryMovieList } from "@/Actions/MovieActions";
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'; // Added for visual cue

export default function SearchBar({ showButton = false }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => dropdownRef.current && !dropdownRef.current.contains(e.target) && setShowDropdown(false);
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim().length > 1) {
        const data = await getQueryMovieList(query);
        setSuggestions(Array.isArray(data) ? data.slice(0, 6) : []);
        setShowDropdown(true);
      } else {
        setSuggestions([]);
        setShowDropdown(false);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSearch = () => {
    if (query.trim()) {
      setShowDropdown(false);
      navigate(`/search?query=${query}`);
    }
  };

  return (
    <div className="relative flex w-full items-center" ref={dropdownRef}>
      <div className="relative flex-1">
        {/* Search Icon inside the input */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-4 w-4 text-slate-400" />
        </div>
        
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length > 1 && setShowDropdown(true)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Search a movie"
          className="w-full bg-white placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-10 pr-3 py-2 transition-all focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 shadow-sm"
        />

        {showDropdown && suggestions.length > 0 && (
          <div className="absolute top-full left-0 z-50 mt-1 w-full rounded-md border border-slate-200 bg-white shadow-xl">
            <ul className="py-1">
              {suggestions.map((movie) => (
                <li key={movie.id}>
                  <button
                    onClick={() => { setShowDropdown(false); navigate(`/movies/${movie.id}/details`); }}
                    className="flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 text-left"
                  >
                    <span className="truncate">{movie.title}</span>
                    {movie.release_date && <span className="ml-2 text-xs text-slate-400">({movie.release_date.split('-')[0]})</span>}
                  </button>
                </li>
              ))}
              <li className="border-t border-slate-100 mt-1">
                <button onClick={handleSearch} className="w-full px-4 py-2 text-xs font-bold text-sky-600 hover:bg-sky-50 text-center uppercase tracking-wide">
                  See all results for "{query}"
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Conditional Button */}
      {showButton && (
        <button 
          onClick={handleSearch}
          className="ml-2 rounded-md bg-sky-600 py-2 px-4 text-sm font-semibold text-white shadow-md hover:bg-sky-500 transition-all active:scale-95 cursor-pointer"
        >
          Search
        </button>
      )}
    </div>
  );
}