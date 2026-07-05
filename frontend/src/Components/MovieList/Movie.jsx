import { useNavigate } from "react-router-dom";

export default function Movie({
  poster_path,
  title,
  id,
  showDelete,
  onDelete,
  watchDates,
  showLogs,
  onDeleteDate,
  onDeleteAll,
}) {
  const hasPoster = poster_path && poster_path !== "";
  const navigate = useNavigate();

  const sortedDates = watchDates
    ? [...watchDates].sort((a, b) => new Date(b) - new Date(a))
    : [];

  return (
    <div
      onClick={() => { navigate(`/movies/${id}/details`); }}
      className="
        group/film 
        relative 
        w-30 sm:w-37.5 md:w-45
        aspect-2/3
        shrink-0 
        overflow-hidden 
        rounded-xs shadow-2xl border border-slate-700
        hover:border-pink-600 cursor-pointer"
    >
      {hasPoster ? (
        <img
          src={`https://image.tmdb.org/t/p/w500/${poster_path}`}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-slate-900 text-center">
          <span className="text-pink-600 mb-2">🎬</span>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
            No Poster
          </p>
        </div>
      )}

      {showDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(id);
          }}
          className="
            absolute top-1 right-1 z-30 
            bg-red-600 hover:bg-red-900 text-white 
            w-4 h-4 rounded-full flex items-center justify-center shadow-lg 
            cursor-pointer transition-all duration-200
            opacity-0 group-hover/film:opacity-100 scale-90 group-hover/film:scale-100"
        >
          <span className="text-lg font-bold leading-none">×</span>
        </button>
      )}

      {showLogs && sortedDates.length > 0 ? (
        <div
          onClick={(e) => e.stopPropagation()}
          className="
            absolute inset-0 z-20
            opacity-0 group-hover/film:opacity-100
            transition-opacity duration-200
            bg-black/85 backdrop-blur-sm
            flex flex-col
            pointer-events-none group-hover/film:pointer-events-auto"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteAll(id);
            }}
            title="Delete all logs for this movie"
            className="
              absolute top-1 right-1 z-30 
              bg-red-600 hover:bg-red-900 text-white 
              w-4 h-4 rounded-full flex items-center justify-center shadow-lg 
              cursor-pointer"
          >
            <span className="text-lg font-bold leading-none">×</span>
          </button>

          <p className="text-[10px] text-gray-300 uppercase tracking-widest font-bold text-center pt-2 pb-1 px-2 truncate">
            {title}
          </p>

          <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-1">
            {sortedDates.map((date, idx) => (
              <div
                key={`${date}-${idx}`}
                className="flex items-center justify-between bg-slate-800/80 rounded px-2 py-1"
              >
                <span className="text-[10px] text-white">
                  {new Date(date).toLocaleDateString()}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteDate(id, date);
                  }}
                  className="text-red-400 hover:text-red-600 text-xs font-bold leading-none cursor-pointer"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="opacity-0 group-hover/film:opacity-100 duration-300 absolute inset-0 flex justify-center items-end text-center p-2 text-xs bg-black/60 text-white pointer-events-none">
          {title}
        </div>
      )}
    </div>
  );
}