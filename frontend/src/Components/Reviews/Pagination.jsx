// Pagination.jsx
export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-4 mt-10">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="text-slate-400 hover:text-white disabled:opacity-30 transition-colors cursor-pointer"
      >
        Prev
      </button>

      <div className="flex gap-2">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i + 1}
            onClick={() => onPageChange(i + 1)}
            className={`w-8 h-8 rounded-full font-bold text-xs transition-all ${
              currentPage === i + 1
                ? "bg-pink-600 text-white shadow-lg shadow-pink-600/20"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700 cursor-pointer"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
      
      <button 
        disabled={currentPage === totalPages} 
        onClick={() => onPageChange(currentPage + 1)} 
        className="text-slate-400 hover:text-white disabled:opacity-30 transition-colors cursor-pointer"
      >
        Next
      </button>
    </div>
  );
}