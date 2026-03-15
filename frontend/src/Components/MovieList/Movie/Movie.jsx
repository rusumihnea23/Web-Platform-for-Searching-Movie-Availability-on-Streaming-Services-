export default function Movie({ poster_path, title }){

return (
  <div className="group/film w-full max-w-[150px] sm:max-w-[180px] md:max-w-[200px] lg:max-w-[220px] shadow-sky-800/15 shadow-xl border-2 border-pink-600/20 hover:border-pink-600 relative group" >
  
  <img
    src={`https://image.tmdb.org/t/p/w500/${poster_path}`}
    alt={title}
    className=""
  />
    <div className="opacity-0 group-hover:opacity-100 duration-300 top-0 absolute inset-x-0  flex justify-center items-end text-xl bg-gray-200/40 ">{title}</div>
</div>
)

}