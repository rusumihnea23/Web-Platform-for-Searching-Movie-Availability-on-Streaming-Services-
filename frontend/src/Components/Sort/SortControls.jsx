// src/components/Reviews/SortControls.jsx
export default function SortControls({ sortBy, setSortBy, grade, setGrade, options }) {
  // Default options if none are provided via props
  const defaultOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "popular", label: "Most Popular" },
    { value: "least-liked", label: "Least Liked" },
    { value: "highest-grade", label: "Highest Grade" },
    { value: "lowest-grade", label: "Lowest Grade" },
  ];

  const displayOptions = options || defaultOptions;

  return (
    <div className="flex flex-wrap gap-4 mb-8 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
      <div className="flex flex-col gap-1.5">
        <label className="text-slate-500 text-[10px] uppercase font-bold tracking-wider ml-1">Sort By</label>
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-slate-800 text-slate-200 text-sm rounded-lg px-3 py-2 outline-none border border-slate-700 focus:border-pink-500 transition-colors cursor-pointer"
        >
          {displayOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Only show Grade Filter if setGrade is provided (prevents showing it in Admin) */}  
      {setGrade && (
        <div className="flex flex-col gap-1.5">
          <label className="text-slate-500 text-[10px] uppercase font-bold tracking-wider ml-1">Filter by Grade</label>
          <select 
            value={grade || ""} 
            onChange={(e) => setGrade(e.target.value ? parseInt(e.target.value) : null)}
            className="bg-slate-800 text-slate-200 text-sm rounded-lg px-3 py-2 outline-none border border-slate-700 focus:border-pink-500 transition-colors cursor-pointer"
          >
            <option value="">All Grades</option>
            {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(n => (
              <option key={n} value={n}>{n} Stars</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}