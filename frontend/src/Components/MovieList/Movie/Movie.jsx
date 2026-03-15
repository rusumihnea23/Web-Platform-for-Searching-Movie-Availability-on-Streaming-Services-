import { useNavigate } from "react-router-dom"
export default function Movie({ poster_path, title,id}) {
  const hasPoster = poster_path && poster_path !== "";
  const navigate=useNavigate();
  return (
    <div  onClick={()=>{navigate(`/movies/${id}/details`)}}  className="

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
          className="absolute inset-0 w-full h-full object-cover "
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      ) : (
        /* In caz ca nu are poster */
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-slate-900 text-center">
          <span className="text-pink-600 mb-2">🎬</span>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
            No Poster
          </p>
        </div>
      )}

      <div className="opacity-0 group-hover/film:opacity-100 duration-300 absolute inset-0 flex justify-center items-end text-center p-2 text-xs bg-black/60 text-white pointer-events-none">
        {title}
      </div>
    </div>
  );
}