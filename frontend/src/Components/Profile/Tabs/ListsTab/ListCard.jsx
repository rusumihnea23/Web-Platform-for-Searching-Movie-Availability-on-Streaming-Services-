import { HeartIcon } from "@heroicons/react/24/solid";
import { HeartIcon as HeartOutline, TrashIcon } from "@heroicons/react/24/outline";
// TrashIcon from solid if you prefer, adjust import

export default function ListCard({ list, onClick, onLike, onUnlike, onDelete, togglingLike, showLike, showUnlike, showDelete }) {
  return (
    <div
      className="group bg-slate-800/50 hover:bg-slate-800 border border-slate-700 p-5 rounded-xl transition-all flex justify-between items-start"
      onClick={onClick}
    >
      <div className="flex-1 min-w-0 cursor-pointer">
        <h3 className="text-lg font-bold text-sky-400 group-hover:text-pink-500 transition-colors uppercase tracking-tight truncate">
          {list.name}
        </h3>
        <p className="text-sm text-gray-400 line-clamp-2 mt-1 mb-3">
          {list.description || "No description provided."}
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs bg-slate-900 px-2 py-1 rounded text-gray-500">
            {list.movies?.length ?? 0} Movies
          </span>
          {list.ownerUsername && (
            <span className="text-xs text-gray-500">
              by <span className="text-gray-400">{list.ownerUsername}</span>
            </span>
          )}
          {(showLike || showUnlike) && (
            <span className="flex items-center gap-1 text-xs text-rose-400">
              <HeartIcon className="w-3 h-3" />
              {list.likeCount ?? 0}
            </span>
          )}
        </div>
      </div>

      {/* Like / Unlike button */}
      {(showLike || showUnlike) && (
        <button
          onClick={(e) => showUnlike ? onUnlike(e, list.id) : onLike(e, list)}
          disabled={togglingLike === list.id}
          className={`ml-4 p-2 rounded-lg transition-all disabled:opacity-50 shrink-0 ${
            list.likedByMe || showUnlike
              ? "text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
              : "text-gray-600 hover:text-rose-400 hover:bg-rose-500/10"
          }`}
          title={list.likedByMe || showUnlike ? "Unlike" : "Like"}
        >
          {togglingLike === list.id ? (
            <div className="w-5 h-5 border-2 border-rose-400 border-t-transparent rounded-full animate-spin" />
          ) : list.likedByMe || showUnlike ? (
            <HeartIcon className="w-5 h-5" />
          ) : (
            <HeartOutline className="w-5 h-5" />
          )}
        </button>
      )}

      {/* Delete button */}
      {showDelete && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(list.id); }}
          className="ml-4 text-gray-600 hover:text-red-500 p-2 transition-colors shrink-0"
          title="Delete List"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}