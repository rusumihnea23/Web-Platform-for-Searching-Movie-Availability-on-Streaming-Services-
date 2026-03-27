import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getQueryMovieList } from "@/Actions/MovieActions";
export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
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

  // Debounce la api call
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

  const handleSearch = () => {
    if (query.trim() !== "") {
      setShowDropdown(false);
      navigate(`/search?query=${query}`);
    }
  };

  return (
    <div className="relative flex w-full max-w-sm items-center" ref={dropdownRef}>   
      {/* aici scrii */}
      <div className="relative flex-1">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length > 1 && setShowDropdown(true)}
          className="w-full bg-white placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-10 pr-3 py-2 transition duration-300 focus:outline-none focus:border-slate-400 shadow-sm"
          placeholder="Search a movie"
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        {/*sugestii*/}
        {showDropdown && suggestions.length > 0 && (
          <div className="absolute top-full left-0 z-50 mt-1 w-full rounded-md border border-slate-200 bg-white shadow-lg">
            <ul className="py-1">
              {suggestions.map((movie) => (
                <li key={movie.id}>
                  <button
                    onClick={() => {
                      setQuery(movie.title);
                      setShowDropdown(false);
                      navigate(`/movies/${movie.id}/details`);
                    }}
                    className="flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 text-left cursor-pointer"
                  >
                    <span className="truncate">{movie.title}</span>
                    {movie.release_date && (
                      <span className="ml-2 text-xs text-slate-400">
                        ({movie.release_date.split('-')[0]})
                      </span>
                    )}
                  </button>
                </li>
              ))}
              <li className="border-t border-slate-100">
                <button
                  onClick={handleSearch}
                  className="w-full px-4 py-2 text-xs font-bold text-sky-600 hover:bg-slate-50 text-center uppercase cursor-pointer"
                >
                  See all results for "{query}"
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>

      <button 
        onClick={handleSearch}
        className="ml-2 rounded-md bg-slate-800 py-2 px-4 text-sm text-white shadow-md hover:bg-slate-700 transition-all cursor-pointer"
        type="button"
      >
        Search
      </button>
    </div>
  );
}