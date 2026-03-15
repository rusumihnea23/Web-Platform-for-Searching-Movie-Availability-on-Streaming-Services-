export default function Movie({ poster_path, title }) {
  const hasPoster = poster_path && poster_path !== "";

  return (
    <div className="
      group/film 
      relative 
      w-[120px] sm:w-[150px] md:w-[180px] 
      aspect-[2/3] 
      flex-shrink-0 
      overflow-hidden 
      bg-gray-800 /* This ensures the box exists even if the image doesn't */
      shadow-xl border-2 border-pink-600/20 hover:border-pink-600"
    >
      {hasPoster ? (
        <img
          src={`https://image.tmdb.org/t/p/w500/${poster_path}`}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
          // Safety: if the URL exists but the link is broken, show the fallback
          onError={(e) => { e.target.style.display = 'none'; }} 
        />
      ) : (
        /* Fallback Placeholder */
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-slate-900 text-center">
          <span className="text-pink-500 mb-2">🎬</span>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
            No Poster
          </p>
        </div>
      )}

      {/* Title Overlay */}
      <div className="opacity-0 group-hover:opacity-100 duration-300 absolute inset-0 flex justify-center items-end text-center p-2 text-xs bg-black/60 text-white pointer-events-none">
        {title}
      </div>
    </div>
  );
}