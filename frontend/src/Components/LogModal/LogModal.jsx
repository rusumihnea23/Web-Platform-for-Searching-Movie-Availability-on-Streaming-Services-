import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import MovieIdSelector from "./MovieIdSelector.jsx"; 
import { userLogMovie } from "@/Actions/UserMovieActions";

export function LogModal({ preSelectedMovieId = null, onLogSuccess = null }) {
  const [open, setOpen] = useState(false);
  
  // Date Logic
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const maxDate = yesterday.toISOString().split("T")[0];

  // If a preSelectedMovieId is passed (from MovieCard), use it. Otherwise, null.
  const [movieId, setMovieId] = useState(preSelectedMovieId);
  const [personalGrade, setPersonalGrade] = useState(0);
  const [watchDate, setWatchDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  // Synchronize movieId if the prop changes (important for navigation between movies)
  useEffect(() => {
    if (preSelectedMovieId) {
      setMovieId(preSelectedMovieId);
    }
  }, [preSelectedMovieId]);

  const toggleModal = () => {
    setOpen(!open);
    if (open && !preSelectedMovieId) {
      setMovieId(null);
      setPersonalGrade(0);
    }
  };

  const userLogMovieFunction = async () => {
    const finalMovieId = preSelectedMovieId || movieId;

    if (!finalMovieId || personalGrade === 0) {
      alert("Please select a movie and a rating.");
      return;
    }

    setLoading(true);
    try {
      await userLogMovie({ 
        movieId: finalMovieId, 
        personalGrade, 
        watchDate 
      });
      window.dispatchEvent(new Event("movieLogged"));
      if (onLogSuccess) onLogSuccess();

      setOpen(false); 
      setPersonalGrade(0);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={toggleModal} 
        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 transform active:scale-95 shadow-lg bg-sky-600 hover:bg-sky-700 text-white cursor-pointer`}
      >
        
        <span>{preSelectedMovieId ? "Log Movie" : "Log [+]"}</span>
      </button>

      {open && createPortal(
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={toggleModal} />
          
          <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <h4 className="text-xl font-bold text-gray-900 mb-4">Log Movie Entry</h4>

            <div className="space-y-5">
              
              {/* Only show the search selector if we don't already have an ID */}
              {!preSelectedMovieId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Search Movie</label>
                  <MovieIdSelector onSelect={(id) => setMovieId(id)} />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Personal Grade ({personalGrade}/10)</label>
                <div className="flex justify-between gap-1">
                  {[...Array(10)].map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setPersonalGrade(i + 1)}
                      className={`h-8 w-8 rounded-md text-xs font-bold transition-all ${
                        personalGrade === i + 1 ? "bg-slate-800 text-white scale-110" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Watch Date</label>
                <input
                  type="date"
                  max={maxDate}
                  value={watchDate}
                  onChange={(e) => setWatchDate(e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-1 focus:ring-sky-500 outline-none text-black"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button onClick={toggleModal} className="text-sm font-medium text-gray-500 hover:text-gray-700">
                Cancel
              </button>
              <button
                onClick={userLogMovieFunction}
                disabled={loading}
                className="rounded-md bg-sky-600 px-6 py-2 text-sm font-bold text-white shadow-md hover:bg-sky-700 disabled:opacity-50"
              >
                {loading ? "Logging..." : "Confirm Entry"}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}