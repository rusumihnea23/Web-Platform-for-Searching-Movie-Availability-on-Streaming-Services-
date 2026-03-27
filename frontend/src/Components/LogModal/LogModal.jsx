import React, { useState } from "react";
import { createPortal } from "react-dom";
import MovieIdSelector from "./MovieIdSelector.jsx"; 
import { userLogMovie } from "@/Actions/UserMovieActions";

export function LogModal() {
  const [open, setOpen] = useState(false);
  

  const [movieId, setMovieId] = useState(null);
  const [personalGrade, setPersonalGrade] = useState(0);
  const [watchDate, setWatchDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  const toggleModal = () => setOpen(!open);

  const userLogMovieFunction = async () => {
    if (!movieId || personalGrade === 0) {
      alert("Please select a movie and a rating.");
      return;
    }

    setLoading(true);
    try {
     await userLogMovie({ 
      movieId, 
      personalGrade, 
      watchDate 
    });
      setOpen(false); 
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={toggleModal} className="bg-sky-600 text-white px-4 py-2 rounded-md hover:bg-sky-900 cursor-pointer">
        Log [+]
      </button>

      {open && createPortal(
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={toggleModal} />
          
          <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <h4 className="text-xl font-bold text-gray-900 mb-4">Log Movie Entry</h4>

            <div className="space-y-5">
              {/* 1.pentru api call avem nevoie de id*/}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Search Movie</label>
                <MovieIdSelector onSelect={(id) => setMovieId(id)} />
                
              </div>

             
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
                  value={watchDate}
                  onChange={(e) => setWatchDate(e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-1 focus:ring-sky-500 outline-none"
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