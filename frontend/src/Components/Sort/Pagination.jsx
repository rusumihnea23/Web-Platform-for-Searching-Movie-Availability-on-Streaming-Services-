export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const showMax = 5; // How many buttons to show around the current page

    if (totalPages <= 7) {
      // If total pages is small, show all of them
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // Always include the first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      // Calculate the range around the current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      // Always include the last page
      pages.push(totalPages);
    }
    return pages;
  };

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
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            disabled={page === "..."}
            onClick={() => typeof page === "number" && onPageChange(page)}
            className={`w-10 h-10 rounded-full font-bold text-xs transition-all ${
              page === "..." 
                ? "bg-transparent text-slate-600 cursor-default" 
                : currentPage === page
                ? "bg-pink-600 text-white shadow-lg shadow-pink-600/20"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700 cursor-pointer"
            }`}
          >
            {page}
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