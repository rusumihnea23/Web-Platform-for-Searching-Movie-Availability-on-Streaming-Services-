import { useState, useEffect, useRef } from "react";
import { getQueryMovieList } from "@/Actions/MovieActions";
export default function MovieIdSelector({ onSelect }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  //  Debounced api call , lafel ca la search bar 
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim().length > 1) {
        const data = await getQueryMovieList(query);
        if (data) {
          setSuggestions(Array.isArray(data) ? data.slice(0, 6) : []);
          setShowDropdown(true);
        }
      } else {
        setSuggestions([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSelectMovie = (movie) => {
    setQuery(movie.title); 
    setShowDropdown(false); 
    
    if (onSelect) {
      onSelect(movie.id);
    }
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type to find a movie..."
          className="text-gray-600 w-full rounded-md border border-slate-200 bg-white px-4 py-2 text-sm focus:border-slate-400 focus:outline-none shadow-sm"
        />
        
        
        {showDropdown && suggestions.length > 0 && (
          <div className="absolute top-full left-0 z-50 mt-1 w-full rounded-md border border-slate-200 bg-white shadow-lg max-h-60 overflow-y-auto">
            <ul className="py-1">
              {suggestions.map((movie) => (
                <li key={movie.id}>
                  <button
                    type="button"
                    onClick={() => handleSelectMovie(movie)}
                    className="flex w-full flex-col px-4 py-2 text-left hover:bg-slate-100"
                  >
                    <span className="text-sm font-medium text-slate-700">{movie.title}</span>
                    <span className="text-xs text-slate-400">{movie.release_date}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}