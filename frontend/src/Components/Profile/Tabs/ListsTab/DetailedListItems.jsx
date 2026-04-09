import { useState } from "react";

import MovieList from "../../../MovieList/MovieList/MovieList.jsx";
import MovieIdSelector from "../../../LogModal/MovieIdSelector.jsx";
import { removeMovieFromList, addMovieToList, updateListDetails, getSingleList } from "../../../../Actions/UserListActions.js";

export default function DetailedListItems({ list, onBack }) {
    const [currentMovies, setCurrentMovies] = useState(list.movies || []);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        name: list.name,
        description: list.description || ""
    });

    const [selectedMovieId, setSelectedMovieId] = useState(null);
    const [isAdding, setIsAdding] = useState(false);

    const handleUpdateList = async () => {
        await updateListDetails(list.id, editData);
        setIsEditing(false);
        alert("List updated!");
    };

    const handleAddMovie = async () => {
        if (!selectedMovieId) return;
        try {
            await addMovieToList(list.id, selectedMovieId);
            const updatedListData = await getSingleList(list.id);

            const updatedMovies = Array.isArray(updatedListData)
                ? updatedListData[0]?.movies
                : updatedListData?.movies;

            if (updatedMovies) {
                setCurrentMovies(updatedMovies);
            }

            alert("Movie added!");
            setIsAdding(false);
            setSelectedMovieId(null);
        } catch (err) {
            console.error("Failed to add movie:", err);
        }
    };

    const handleRemoveMovie = async (movieId) => {
        if (window.confirm("Remove this movie from the list?")) {
            try {
                await removeMovieFromList(list.id, movieId);
                setCurrentMovies(prev => prev.filter(m => m.id !== movieId));
            } catch (err) {
                console.error("Failed to remove movie:", err);
            }
        }
    };

    return (
        <div className="text-white w-full max-w-6xl mx-auto p-4">
            <button onClick={onBack} className="text-gray-400 hover:text-white mb-6 flex items-center gap-2 transition-colors cursor-pointer">
                <span className="text-xl">←</span> Back to My Lists
            </button>

            {/* Numele si descrierea  */}
            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 mb-8">
                {isEditing ? (
                    <div className="space-y-4">
                        <input
                            className="w-full bg-slate-800 border border-slate-700 p-2 rounded text-xl font-bold focus:outline-none focus:border-pink-600"
                            value={editData.name}
                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        />
                        <textarea
                            className="w-full bg-slate-800 border border-slate-700 p-2 rounded h-24 focus:outline-none focus:border-pink-600"
                            value={editData.description}
                            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                        />
                        <div className="flex gap-2">
                            <button onClick={handleUpdateList} className="bg-pink-600 px-4 py-2 rounded font-bold cursor-pointer">Save Changes</button>
                            <button onClick={() => setIsEditing(false)} className="bg-slate-700 px-4 py-2 rounded cursor-pointer">Cancel</button>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">{editData.name}</h2>
                            <p className="text-gray-400 mt-2 italic">{editData.description || "No description provided."}</p>
                        </div>
                        <button onClick={() => setIsEditing(true)} className="text-sky-500 text-sm hover:underline cursor-pointer">Edit Details</button>
                    </div>
                )}
            </div>

            {/* Add Movie  */}
            <div className="mb-8 flex items-center gap-4">
                <h3 className="text-xl font-bold">Movies</h3>
                {!isAdding ? (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="bg-sky-600/20 text-sky-400 border border-sky-600/30 px-3 py-1 rounded-full text-sm hover:bg-sky-600/40 transition-all cursor-pointer"
                    >
                        + Add Movie
                    </button>
                ) : (
                    <div className="flex gap-2 items-center bg-slate-800 p-2 rounded-lg">
                        <MovieIdSelector onSelect={(id) => setSelectedMovieId(id)} />
                        <button onClick={handleAddMovie} className="bg-sky-600 px-3 py-1 rounded text-sm font-bold cursor-pointer hover:bg-sky-900">Add</button>
                        <button onClick={() => setIsAdding(false)} className="text-gray-400 text-sm cursor-pointer hover:text-gray-600">Cancel</button>
                    </div>
                )}
            </div>

       
            {/* Lista de filme*/}
            {currentMovies && currentMovies.length > 0 ? (
                <MovieList
                    Movies={currentMovies}
                    showDelete={true}
                    onDelete={handleRemoveMovie}
                />
            ) : (
                <div className="text-center py-20 bg-slate-900/30 rounded-xl border-2 border-dashed border-slate-800">
                    <p className="text-gray-500 italic">This list is empty. Start adding movies!</p>
                </div>
            )}
        </div>
    );
}